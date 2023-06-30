import { computed, nextTick, onMounted, reactive, ref, toRaw } from "vue";
import { WebRTCAdaptor } from "../../utils/webrtc/webrtc-adaptor";
import {
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
import { SoundMeter } from "../../utils/webrtc/soundmeter";

export const useSoundmeter = () => {
  const audioContext = ref(new AudioContext());

  const soundMeters: Record<string, SoundMeter> = reactive({});

  const soundLevelList: Record<string, number> = reactive({});

  const enableAudioLevel = (stream: MediaStream, streamId: string) => {
    if (!soundMeters[streamId]) {
      soundMeters[streamId] = new SoundMeter(audioContext.value, stream);
    }
  };

  const getByteFrequency = (dataArray: Uint8Array) => {
    let frequency = 0;
    let count = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const value = dataArray[i];
      if (value > 0) {
        frequency += value;
        count += 1;
      }
    }
    return frequency === 0 ? 0 : frequency / count;
  };

  const getSoundLevelList = () => {
    for (let streamId in toRaw(soundMeters)) {
      if (soundMeters[streamId]?.dataArray?.length > 0) {
        soundMeters[streamId].getByteFrequencyData();
        soundLevelList[streamId] = getByteFrequency(
          soundMeters[streamId].dataArray
        );
      }
    }
    requestAnimationFrame(getSoundLevelList);
  };

  onMounted(() => {
    requestAnimationFrame(getSoundLevelList);
  });

  return {
    soundLevelList,
    enableAudioLevel,
  };
};

export const useAction = () => {
  const { query } = useRoute();

  const settingsStore = useSettingsStore();

  const navigation = useNavigation();

  const { soundLevelList, enableAudioLevel } = useSoundmeter();

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
   * 当前分享屏幕的streamId
   */
  const shareScreenStreamId = ref("");

  /**
   * 当前用户信息
   */
  const currentUser = computed<UserSession>(
    () =>
      meetingInfo.value?.userSessions?.find(
        (user) => user.userName === meetingQuery.userName
      ) ?? ({} as UserSession)
  );

  const currentFrequency = computed(
    () => soundLevelList?.[currentUser?.value?.streamId ?? ""] ?? 0
  );

  /**
   * 当前分享屏幕用户信息
   */
  const currentShareUser = computed<UserSession>(
    () =>
      meetingInfo.value?.userSessions.find((user) => user.isSharingScreen) ??
      ({} as UserSession)
  );

  /**
   * 主持人信息
   */
  const moderator = computed<UserSession>(
    () =>
      meetingInfo.value?.userSessions?.find(
        (user) => user.userId === meetingInfo.value?.meetingMasterUserId
      ) ?? ({} as UserSession)
  );

  const isMCU = computed(
    () => meetingQuery.meetingStreamMode === MeetingStreamMode.MCU
  );

  const joinMeetingAfter = async () => {
    // 发布本地流
    webRTCAdaptor.value?.publish(streamInfo.value!.streamId);

    // 本地流声级计
    enableAudioLevel(localStream.value!, streamInfo.value.streamId);

    // 判断初始化是否静音
    if (meetingQuery.isMuted) {
      webRTCAdaptor.value?.muteLocalMic();
    } else {
      webRTCAdaptor.value?.unmuteLocalMic();
    }

    await getMeetingInfo().finally(() => {
      setTimeout(() => {
        webRTCAdaptor.value?.getRoomInfo(
          meetingQuery.meetingNumber,
          streamInfo.value!.streamId
        );
      }, 3000);
    });

    if (isMCU.value) {
      // 播放远程合并流
      setTimeout(() => {
        webRTCAdaptor.value?.play(
          meetingInfo.value!.mergedStream,
          streamInfo.value!.room
        );
      }, 8000);
    }
  };

  const getMeetingInfoAfter = (data: Meeting) => {
    if (!isShareScreen.value) {
      const currentShareUser = data.userSessions.find(
        (user) => user.isSharingScreen
      );

      if (currentShareUser) {
        if (isMCU.value) {
          if (!shareScreenStreamId.value) {
            const streamId = currentShareUser.userSessionStreams[0].streamId;
            shareScreenStreamId.value = streamId;
            webRTCAdaptor.value?.play(streamId, streamInfo.value!.room);
          }
        } else {
          const streamId = currentShareUser.userSessionStreams?.[0]?.streamId;
          if (streamId) {
            const stream = streamsList.value.find(
              (stream) => stream.streamId === streamId
            );
            if (stream) {
              if (!shareScreenStreamId.value) {
                shareScreenStreamId.value = streamId;
                const newVideoTrack = stream.stream.getVideoTracks()[0];
                videoStream.value = new MediaStream([newVideoTrack]);
              }
            }
          }
        }
      } else {
        videoStream.value = undefined;
        if (isMCU.value) {
          if (shareScreenStreamId.value) {
            webRTCAdaptor.value?.stop(shareScreenStreamId.value);
            shareScreenStreamId.value = "";
          }
        } else {
          shareScreenStreamId.value = "";
        }
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
      data?.userSessions?.forEach(
        (user) =>
          (user.streamId =
            user.userSessionStreams?.find((stream) => stream.streamId)
              ?.streamId ?? "")
      );
      meetingInfo.value = data;
      getMeetingInfoAfter(data);
    } else {
      ElMessage({
        offset: 28,
        message: msg,
        type: "error",
      });
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
            // 加入房间
            webRTCAdaptor.value?.joinRoom(
              meetingQuery.meetingNumber,
              "",
              "mcu"
            );
            break;
          // 已加入房间回调
          case "joinedTheRoom":
            streamInfo.value = payload;

            const streamId: string = payload?.streamId ?? "";
            // 加入会议
            const { code, msg } = await joinMeetingApi({
              meetingNumber: meetingQuery.meetingNumber,
              isMuted: meetingQuery.isMuted,
              streamId,
              streamType: 0,
            });
            if (code === 200) {
              joinMeetingAfter();
            } else {
              ElMessage({
                offset: 28,
                message: msg,
                type: "error",
              });
            }
            break;
          // 获取房间信息回调
          case "roomInformation":
            const currentStreamIds: string[] = payload.streams;

            currentStreamIds.forEach((streamId) => {
              if (!streamIds.value.includes(streamId)) {
                // 播放新的远程流
                webRTCAdaptor.value?.play(streamId, streamInfo.value!.room);
              }
            });

            streamsList.value = streamsList.value.filter((stream) => {
              if (!currentStreamIds.includes(stream.streamId)) {
                // 停止已退出的远程流
                webRTCAdaptor.value?.stop(stream.streamId);
                return false;
              }
              return true;
            });

            /**
             * 每隔3秒获取一次房间信息
             */
            getMeetingInfo().finally(() => {
              setTimeout(() => {
                webRTCAdaptor.value?.getRoomInfo(
                  meetingQuery.meetingNumber,
                  streamInfo.value!.streamId
                );
              }, 3000);
            });

            streamIds.value = payload.streams;
            break;
          // 获取到新的远程流
          case "newStreamAvailable":
            // 有分享屏幕用户
            if (isMCU.value && currentShareUser.value) {
              const stream: MediaStream = payload.stream;
              const newVideoTrack = stream.getVideoTracks()[0];
              videoStream.value = new MediaStream([newVideoTrack]);
              return;
            }

            // 启动远程流的声级计
            enableAudioLevel(payload.stream, payload.streamId);

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
    const { code, msg } = await audioChangeApi({
      meetingUserSessionId: currentUser.value!.id,
      streamId: streamInfo.value.streamId,
      isMuted: status,
    });
    if (code === 200) {
      meetingQuery.isMuted = status;
      currentUser.value.isMuted ??= status;
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
    const { code } = await screenShareApi({
      meetingUserSessionId: currentUser.value!.id,
      streamId: streamInfo.value.streamId,
      isShared: true,
    });
    if (code === 200) {
      await webRTCAdaptor.value?.startDesktopCapture(
        streamInfo.value!.streamId,
        source.id
      );
      if (localStream.value?.getVideoTracks()) {
        videoStream.value = new MediaStream([
          ...localStream.value?.getVideoTracks(),
        ]);
      }
    }
  };

  /**
   * 停止分享屏幕
   */
  const onStopShare = async () => {
    const { code } = await screenShareApi({
      meetingUserSessionId: currentUser.value!.id,
      streamId: streamInfo.value.streamId,
      isShared: false,
    });
    if (code === 200) {
      isShareScreen.value = false;
      videoStream.value = undefined;
      webRTCAdaptor.value?.stopDesktopCapture(streamInfo.value?.streamId!);
    }
  };

  const blockClose = () => leaveMeetingRef.value?.open();

  onMounted(() => {
    nextTick(() => {
      setTimeout(() => {
        init();
      }, 2000);
    });

    /**
     * 阻止窗口关闭，唤起自定义关闭窗口
     */
    navigation.blockClose(blockClose);
  });

  return {
    leaveMeetingRef,
    isShareScreen,
    meetingQuery,
    meetingInfo,
    streamsList,
    videoStream,
    soundLevelList,
    currentFrequency,
    moderator,
    updateMicMuteStatus,
    beforeStartShare,
    onStartShare,
    onStopShare,
    leaveMeeting,
    blockClose,
  };
};
