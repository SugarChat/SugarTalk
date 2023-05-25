import { computed, nextTick, onMounted, reactive, ref, watch } from "vue";
import { WebRTCAdaptor } from "../../utils/webrtc/webrtc-adaptor";
import {
  DataChannel,
  MeetingQuery,
  ScreenSource,
  StreamInfo,
  StreamItem,
} from "../../entity/types";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import { joinMeetingApi } from "../../services";
import { useSettingsStore } from "../../stores/useSettingsStore";
import { useNavigation } from "../../hooks/useNavigation";
import { MeetingStreamMode } from "../../entity/enum";

export const useAction = () => {
  const { query } = useRoute();

  const settingsStore = useSettingsStore();

  const navigation = useNavigation();

  const meetingQuery = reactive<MeetingQuery>({
    audio: query.audio === "true",
    isMuted: query.isMuted === "true",
    camera: query.camera === "true",
    meetingNumber: query.meetingNumber as string,
    userName: query.userName as string,
    meetingStreamMode: query.meetingStreamMode as any,
  });

  const webRTCAdaptor = ref<WebRTCAdaptor>();

  const leaveMeetingRef = ref<{
    open: () => boolean;
    close: () => boolean;
  }>();

  /**
   * 房间信息
   */
  const streamInfo = ref<StreamInfo>();

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

  /**
   * 远程流共享屏幕streamId
   */
  const remoteShareScreenStreamId = ref("");

  const isMCU = computed(
    () => meetingQuery.meetingStreamMode === MeetingStreamMode.MCU
  );

  /**
   * 监听远程流共享屏幕 video轨道是否活动状态
   */
  watch([streamsList], () => {
    const newVideoTrack = streamsList.value
      .find((streams) => streams.streamId === remoteShareScreenStreamId.value)
      ?.stream?.getVideoTracks()[0];
    if (!isShareScreen.value) {
      if (!newVideoTrack || (newVideoTrack && !newVideoTrack.enabled)) {
        remoteShareScreenStreamId.value = "";
        videoStream.value = undefined;
      }
    }

    if (streamsList.value.length > 0) {
      // 发送消息询问有没有人在分享屏幕
    }
  });

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
  const leaveMeeting = () => {
    webRTCAdaptor.value?.leaveFromRoom(meetingQuery.meetingNumber);

    if (streamInfo.value?.streamId) {
      webRTCAdaptor.value?.stop(streamInfo.value.streamId);
      webRTCAdaptor.value?.closePeerConnection(streamInfo.value.streamId);
      webRTCAdaptor.value?.closeWebSocket();
    }

    navigation.destroy();
  };

  const init = () => {
    webRTCAdaptor.value = new WebRTCAdaptor({
      websocket_url: settingsStore.websocketURL,
      debug: false,
      peerconnection_config: {
        iceServers: [{ urls: "stun:stun1.l.google.com:19302" }],
      },
      callback: (command: string, payload?: any) => {
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
            /**
             * 发布本地流
             */
            webRTCAdaptor.value?.publish(payload?.streamId);
            /**
             * 本地流声级计
             */
            webRTCAdaptor.value?.enableAudioLevelForLocalStream(
              payload?.streamId
            );

            // 判断初始化是否静音
            updateMicMuteStatus(meetingQuery.isMuted);

            payload?.streams.forEach((streamId: string) => {
              /**
               * 播放远程流
               */
              webRTCAdaptor.value?.play(streamId, payload.room);
            });

            // 获取一次房间信息
            webRTCAdaptor.value?.getRoomInfo(
              meetingQuery.meetingNumber,
              payload?.streamId
            );

            // 获取一次远程流的声级计
            webRTCAdaptor.value?.getSoundLevelList(payload?.streams);

            streamIds.value = payload?.streams ?? [];
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
          // dataChannel 信息回调
          case "data_received":
            const notificationEvent: DataChannel = JSON.parse(payload.data);
            if (notificationEvent.streamId !== streamInfo.value!.streamId) {
              if (notificationEvent.eventType === "START_SHARE_SCREEN") {
                remoteShareScreenStreamId.value = notificationEvent.streamId;
                const newVideoTrack = streamsList.value
                  .find(
                    (streams) => streams.streamId === notificationEvent.streamId
                  )
                  ?.stream?.getVideoTracks()[0];
                newVideoTrack &&
                  (videoStream.value = new MediaStream([newVideoTrack]));
              } else if (notificationEvent.eventType === "END_SHARE_SCREEN") {
                remoteShareScreenStreamId.value = "";
                videoStream.value = undefined;
              }
            }
            break;
          // 获取远程流的声级计
          case "gotSoundList":
            remoteSoundLevelList.value = payload;
            console.log("gotSoundList", payload);

            setTimeout(() => {
              webRTCAdaptor.value?.getSoundLevelList(streamIds.value);
            }, 200);
            break;
        }
      },
      callbackError: () => {},
    });
  };

  /**
   * 本地麦克风静音/取消静音
   * @param status true: 静音, false: 取消静音
   */
  const updateMicMuteStatus = (status: boolean) => {
    meetingQuery.isMuted = status;
    if (status) {
      webRTCAdaptor.value?.muteLocalMic();
    } else {
      webRTCAdaptor.value?.unmuteLocalMic();
    }
  };

  /**
   * 屏幕分享之前判断是否已经其他人分享屏幕
   * @returns boolean true：阻止弹窗
   */
  const beforeStartShare = () => {
    if (remoteShareScreenStreamId.value) {
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
    webRTCAdaptor.value?.sendData(
      streamInfo.value!.streamId,
      JSON.stringify({
        eventType: "START_SHARE_SCREEN",
        streamId: streamInfo.value!.streamId,
      })
    );
    await webRTCAdaptor.value?.startDesktopCapture(
      streamInfo.value!.streamId,
      source.id
    );
    if (localStream.value?.getVideoTracks()) {
      videoStream.value = new MediaStream([
        ...localStream.value?.getVideoTracks(),
      ]);
    }
  };

  /**
   * 停止分享屏幕
   */
  const onStopShare = () => {
    isShareScreen.value = false;
    videoStream.value = undefined;
    webRTCAdaptor.value?.sendData(
      streamInfo.value!.streamId,
      JSON.stringify({
        eventType: "END_SHARE_SCREEN",
        streamId: streamInfo.value!.streamId,
      })
    );
    webRTCAdaptor.value?.stopDesktopCapture(streamInfo.value?.streamId!);
  };

  onMounted(() => {
    nextTick(() => {
      setTimeout(() => {
        init();
      }, 2000);
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
