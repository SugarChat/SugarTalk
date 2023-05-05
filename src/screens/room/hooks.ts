import { nextTick, onMounted, ref, toRaw, watch } from "vue";
import { WebRTCAdaptor } from "../../utils/webrtc/webrtc-adaptor";
import { ScreenSource } from "../../entity/types";

interface RoomInfo {
  maxTrackCount: number;
  room: string;
  streamId: string;
  streamList: string;
  streams: string[];
}

interface StreamItem {
  stream: MediaStream;
  track: MediaStreamTrack;
  streamId: string;
  trackId: string;
}

interface DataChannel {
  eventType: string;
  streamId: string;
}

export const useAction = () => {
  const webRTCAdaptor = ref<WebRTCAdaptor>();

  /**
   * 房间信息
   */
  const roomInfo = ref<RoomInfo>();

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
   * 本地流是否静音状态
   */
  const isMuted = ref(false);

  /**
   * 是否共享屏幕
   */
  const isShareScreen = ref(false);

  const remoteShareScreenStreamId = ref("");

  // watch([streamsList, localStream], () => {
  //   if (!isShareScreen.value) {
  //     const activeVideoStream = streamsList.value.find((streams) => {
  //       return streams.stream?.getVideoTracks()[0].enabled;
  //     });
  //     if (activeVideoStream) {
  //       if (remoteShareScreenStreamId.value !== activeVideoStream.streamId) {
  //         remoteShareScreenStreamId.value = activeVideoStream.streamId;
  //         videoStream.value = new MediaStream([
  //           ...activeVideoStream.stream.getVideoTracks(),
  //         ]);
  //       }
  //     } else {
  //       videoStream.value = undefined;
  //     }
  //   }
  // });

  watch([streamsList], () => {
    const newVideoTrack = streamsList.value
      .find((streams) => streams.streamId === remoteShareScreenStreamId.value)
      ?.stream?.getVideoTracks()[0];

    if (!newVideoTrack || (newVideoTrack && !newVideoTrack.enabled)) {
      remoteShareScreenStreamId.value = "";
      videoStream.value = undefined;
    }
  });

  const init = () => {
    webRTCAdaptor.value = new WebRTCAdaptor({
      websocket_url: "wss://talk.sjdistributors.com:5443/WebRTCAppEE/websocket",
      debug: false,
      peerconnection_config: {
        iceServers: [{ urls: "stun:stun1.l.google.com:19302" }],
      },
      callback: (command: string, payload?: any) => {
        switch (command) {
          case "joinedTheRoom":
            roomInfo.value = payload;
            /**
             * 发布本地流
             */
            webRTCAdaptor.value?.publish(payload?.streamId);
            /**
             * 本地流声级计
             */
            webRTCAdaptor.value?.enableAudioLevelForLocalStream();

            payload?.streams.forEach((streamId: string) => {
              /**
               * 播放远程流
               */
              webRTCAdaptor.value?.play(streamId, payload.room);
            });

            streamIds.value = payload?.streams ?? [];

            setInterval(() => {
              /**
               * 每隔3秒获取一次房间信息
               */
              webRTCAdaptor.value?.getRoomInfo("room1", payload?.streamId);
            }, 3000);
            break;
          case "roomInformation":
            const currentStreamIds: string[] = payload.streams;

            currentStreamIds.forEach((streamId) => {
              if (!streamIds.value.includes(streamId)) {
                /**
                 * 获取房间信息回调
                 * 播放新的远程流
                 */
                webRTCAdaptor.value?.play(streamId, roomInfo.value!.room);
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

            streamIds.value = payload.streams;
            break;
          case "newStreamAvailable":
            console.log("newStreamAvailable", payload.stream?.getTracks());
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
          case "localStream":
            localStream.value = payload;
            break;
          case "data_received":
            const notificationEvent: DataChannel = JSON.parse(payload.data);
            if (notificationEvent.streamId !== roomInfo.value!.streamId) {
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
        }
      },
      callbackError: () => {},
    });

    setTimeout(() => {
      /**
       * 加入房间
       */
      webRTCAdaptor.value?.joinRoom("room1", "", "mcu");
    }, 3000);
  };

  /**
   * 本地麦克风静音/取消静音
   * @param status true: 静音, false: 取消静音
   */
  const updateMicMuteStatus = (status: boolean) => {
    isMuted.value = status;
    if (status) {
      webRTCAdaptor.value?.muteLocalMic();
    } else {
      webRTCAdaptor.value?.unmuteLocalMic();
    }
  };

  /**
   * 开始分享屏幕
   * @param source 屏幕信息
   */
  const onStartShare = async (source: ScreenSource) => {
    isShareScreen.value = true;
    webRTCAdaptor.value?.sendData(
      roomInfo.value!.streamId,
      JSON.stringify({
        eventType: "START_SHARE_SCREEN",
        streamId: roomInfo.value!.streamId,
      })
    );
    await webRTCAdaptor.value?.startDesktopCapture(
      roomInfo.value!.streamId,
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
      roomInfo.value!.streamId,
      JSON.stringify({
        eventType: "END_SHARE_SCREEN",
        streamId: roomInfo.value!.streamId,
      })
    );
    webRTCAdaptor.value?.stopDesktopCapture(roomInfo.value?.streamId!);
  };

  onMounted(() => {
    nextTick(() => {
      setTimeout(() => {
        init();
      }, 3000);
    });

    // window.electronAPI.onClose(
    //   {
    //     type: "info",
    //     title: "离开会议",
    //     message: "离开会议后，您仍可使用此会议号再次加入会议。",
    //     buttons: ["离开会议", "取消"],
    //     defaultId: 0,
    //     cancelId: 1,
    //   },
    //   () => {
    //     // 关闭窗口回调
    //   }
    // );
  });

  return {
    isMuted,
    isShareScreen,
    streamsList,
    videoStream,
    updateMicMuteStatus,
    onStartShare,
    onStopShare,
  };
};
