import { computed, nextTick, onMounted, reactive, ref, watch } from "vue";
import { WebRTCAdaptor } from "../../utils/webrtc/webrtc-adaptor";
import {
  DataChannel,
  MeetingQuery,
  ScreenSource,
  StreamInfo,
  StreamItem,
} from "../../entity/types";
import { ElLoading, ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import {
  audioChangeApi,
  getMeetingInfoApi,
  joinMeetingApi,
  outMeetingApi,
  screenShareApi,
} from "../../services";
import { useSettingsStore } from "../../stores/useSettingsStore";
import { useNavigation } from "../../hooks/useNavigation";
import { MeetingStreamMode } from "../../entity/enum";
import { Meeting, UserSession } from "../../entity/response";

export const useAction = () => {
  const { query } = useRoute();

  const settingsStore = useSettingsStore();

  const navigation = useNavigation();

  /**
   * 路由参数
   */
  const meetingQuery = reactive<MeetingQuery>({
    audio: query.audio === "true",
    isMuted: query.isMuted === "true",
    camera: query.camera === "true",
    meetingNumber: query.meetingNumber as string,
    userName: query.userName as string,
    meetingStreamMode: +(query.meetingStreamMode as any),
  });

  const meetingInfo = ref<Meeting>({} as Meeting);

  const webRTCAdaptor = ref<WebRTCAdaptor>();

  const leaveMeetingRef = ref<{
    open: () => boolean;
    close: () => boolean;
  }>();

  /**
   * 房间信息
   */
  const streamInfo = ref<StreamInfo>({} as StreamInfo);

  /**
   * 本地流
   */
  const localStream = ref<MediaStream>();

  /**
   * 本地/远程视频流
   */
  const videoStream = ref<MediaStream>();

  /**
   * 远程对等连接流
   */
  const streamsList = ref<StreamItem[]>([]);

  /**
   * 远程对等连接id
   */
  const streamIds = ref<string[]>([]);

  /**
   * 是否共享屏幕
   */
  const isShareScreen = ref(false);

  /**
   * 远程流音频声级
   */
  const remoteSoundLevelList = ref<Record<string, number>>({});

  const currentUser = computed<UserSession | undefined>(() =>
    meetingInfo.value?.userSessions?.find(
      (user) => user.userName === meetingQuery.userName
    )
  );

  const isMCU = computed(
    () => meetingQuery.meetingStreamMode === MeetingStreamMode.MCU
  );

  /**
   * 加入会议
   */
  const joinMeeting = async (streamId: string) => {
    const { code, data, msg } = await joinMeetingApi({
      meetingNumber: meetingQuery.meetingNumber,
      isMuted: meetingQuery.isMuted,
      streamId,
    });
    if (code === 200) {
      meetingInfo.value = data.meeting;
    } else {
      ElMessage({
        offset: 28,
        message: msg,
        type: "error",
      });
    }
  };

  const getMeetingInfoAfter = (data: Meeting) => {
    if (!isShareScreen.value) {
      const currentShareUser = data.userSessions.find(
        (user) => user.isSharingScreen
      );
      if (currentShareUser) {
        if (isMCU.value) {
          const newVideoTrack =
            streamsList.value?.[0]?.stream?.getVideoTracks();
          console.log(
            1,
            ...(streamsList.value?.[0]?.stream?.getTracks() ?? [])
          );
          if (newVideoTrack?.length > 0 && !videoStream.value) {
            console.log(2);
            videoStream.value = new MediaStream([
              newVideoTrack[newVideoTrack.length - 1],
            ]);
          }
        } else {
        }
      } else {
        console.log(3, ...(streamsList.value?.[0]?.stream?.getTracks() ?? []));
        videoStream.value = undefined;
      }
    }
  };

  /**
   * 获取会议信息
   */
  const getMeetingInfo = async () => {
    const { code, data, msg } = await getMeetingInfoApi({
      meetingNumber: meetingQuery.meetingNumber,
    });
    if (code === 200) {
      meetingInfo.value = data;
      getMeetingInfoAfter(data);
      setTimeout(() => {
        getMeetingInfo();
      }, 3000);
    } else {
      ElMessage({
        offset: 28,
        message: msg,
        type: "error",
      });
    }
  };

  const joinMeetingAfter = async () => {
    /**
     * 发布本地流
     */
    webRTCAdaptor.value?.publish(streamInfo.value!.streamId);

    /**
     * 本地流声级计
     */
    webRTCAdaptor.value?.enableAudioLevelForLocalStream(
      streamInfo.value!.streamId
    );

    // 判断初始化是否静音
    if (meetingQuery.isMuted) {
      webRTCAdaptor.value?.muteLocalMic();
    } else {
      webRTCAdaptor.value?.unmuteLocalMic();
    }

    if (isMCU.value) {
      await getMeetingInfo();

      /**
       * 播放远程合并流
       */
      setTimeout(() => {
        webRTCAdaptor.value?.play(
          meetingInfo.value!.mergedStream,
          streamInfo.value!.room
        );
      }, 6000);
    } else {
      streamInfo.value?.streams.forEach((streamId: string) => {
        /**
         * 播放远程流
         */
        webRTCAdaptor.value?.play(streamId, streamInfo.value!.room);
      });

      // 获取房间信息
      webRTCAdaptor.value?.getRoomInfo(
        meetingQuery.meetingNumber,
        streamInfo.value!.streamId
      );

      // 获取远程流的声级计
      webRTCAdaptor.value?.getSoundLevelList(streamInfo.value!.streams);
    }
  };

  /**
   * 离开会议
   */
  const outMeeting = async () => {
    await outMeetingApi({
      meetingId: meetingInfo.value.id,
      streamId: streamInfo.value.streamId,
    });
  };

  /**
   * 离开会议
   */
  const leaveMeeting = async () => {
    const loading = ElLoading.service({ fullscreen: true });
    try {
      webRTCAdaptor.value?.leaveFromRoom(meetingQuery.meetingNumber);

      if (streamInfo.value?.streamId) {
        webRTCAdaptor.value?.stop(streamInfo.value.streamId);
        webRTCAdaptor.value?.closePeerConnection(streamInfo.value.streamId);
        webRTCAdaptor.value?.closeWebSocket();
      }

      await outMeeting();
    } finally {
      loading.close();
      navigation.destroy();
    }
  };

  const init = () => {
    webRTCAdaptor.value = new WebRTCAdaptor({
      websocket_url: settingsStore.websocketURL,
      debug: false,
      peerconnection_config: {
        iceServers: [{ urls: "stun:stun1.l.google.com:19302" }],
      },
      callback: async (command: string, payload?: any) => {
        switch (command) {
          // 已初始化完成
          case "initialized":
            /**
             * 加入房间
             */
            webRTCAdaptor.value?.joinRoom(
              meetingQuery.meetingNumber,
              "",
              isMCU ? "mcu" : "legacy"
            );
            break;
          // 已加入房间回调
          case "joinedTheRoom":
            streamInfo.value = payload;
            streamIds.value = payload.streams ?? [];

            await joinMeeting(payload.streamId);

            joinMeetingAfter();
            break;
          // 获取房间信息回调
          case "roomInformation":
            const currentStreamIds: string[] = payload.streams;

            currentStreamIds.forEach((streamId) => {
              if (!streamIds.value.includes(streamId)) {
                /**
                 * 播放新的远程流
                 */
                webRTCAdaptor.value?.play(streamId, streamInfo.value!.room);
              }
            });

            streamsList.value = streamsList.value.filter((stream) => {
              if (!currentStreamIds.includes(stream.streamId)) {
                /**
                 * 停止已退出的远程流
                 */
                webRTCAdaptor.value?.stop(stream.streamId);
                return false;
              }
              return true;
            });

            setTimeout(() => {
              /**
               * 每隔3秒获取一次房间信息
               */
              webRTCAdaptor.value?.getRoomInfo(
                meetingQuery.meetingNumber,
                streamInfo.value!.streamId
              );
            }, 3000);

            streamIds.value = payload.streams;
            break;
          // 获取到新的远程流
          case "newStreamAvailable":
            console.log("newStreamAvailable", ...payload.stream?.getTracks());
            /**
             * 启动远程流的声级计
             */
            webRTCAdaptor.value?.enableAudioLevel(
              payload.stream,
              payload.streamId
            );

            const isExist = streamsList.value.some(
              (stream) => stream.streamId === payload.streamId
            );
            if (!isExist) {
              streamsList.value.push(payload);
            }
            break;
          // 本地流回调
          case "localStream":
            localStream.value = payload;
            break;
          // 获取远程流的声级计
          case "gotSoundList":
            remoteSoundLevelList.value = payload;

            setTimeout(() => {
              webRTCAdaptor.value?.getSoundLevelList(streamIds.value);
            }, 200);
            break;
        }
      },
      callbackError: (command: string, payload?: any) => {
        const message = payload?.definition;
        ElMessage({
          offset: 28,
          message,
          type: "error",
        });
      },
    });
  };

  /**
   * 本地麦克风静音/取消静音
   * @param status true: 静音, false: 取消静音
   */
  const updateMicMuteStatus = async (status: boolean) => {
    meetingQuery.isMuted = status;
    const { code, msg } = await audioChangeApi({
      meetingUserSessionId: currentUser.value!.id,
      streamId: streamInfo.value.streamId,
      isMuted: status,
    });
    if (code === 200) {
      if (status) {
        webRTCAdaptor.value?.muteLocalMic();
      } else {
        webRTCAdaptor.value?.unmuteLocalMic();
      }
    } else {
      ElMessage({
        offset: 28,
        message: msg,
        type: "error",
      });
    }
  };

  /**
   * 屏幕分享之前判断是否已经其他人分享屏幕
   * @returns boolean true：阻止弹窗
   */
  const beforeStartShare = () => {
    const isShared = meetingInfo.value?.userSessions?.some(
      (user) => user.isSharingScreen
    );
    if (isShared) {
      ElMessage({
        message: "他人正在共享，此时无法发起共享",
        type: "warning",
      });
      return true;
    }
    return false;
  };

  /**
   * 开始分享屏幕
   * @param source 屏幕信息
   */
  const onStartShare = async (source: ScreenSource) => {
    isShareScreen.value = true;
    await webRTCAdaptor.value?.startDesktopCapture(
      streamInfo.value!.streamId,
      source.id
    );
    if (localStream.value?.getVideoTracks()) {
      videoStream.value = new MediaStream([
        ...localStream.value?.getVideoTracks(),
      ]);
    }
    await screenShareApi({
      meetingUserSessionId: currentUser.value!.id,
      streamId: streamInfo.value.streamId,
      isShared: true,
    });
  };

  /**
   * 停止分享屏幕
   */
  const onStopShare = async () => {
    isShareScreen.value = false;
    videoStream.value = undefined;
    webRTCAdaptor.value?.stopDesktopCapture(streamInfo.value?.streamId!);
    await screenShareApi({
      meetingUserSessionId: currentUser.value!.id,
      streamId: streamInfo.value.streamId,
      isShared: false,
    });
  };

  onMounted(() => {
    nextTick(() => {
      init();
      // setTimeout(() => {
      // }, 2000);
    });

    /**
     * 阻止窗口关闭，唤起自定义关闭窗口
     */
    navigation.blockClose(() => {
      leaveMeetingRef.value?.open();
    });
  });

  return {
    leaveMeetingRef,
    isShareScreen,
    meetingQuery,
    meetingInfo,
    streamsList,
    videoStream,
    remoteSoundLevelList,
    updateMicMuteStatus,
    beforeStartShare,
    onStartShare,
    onStopShare,
    leaveMeeting,
  };
};