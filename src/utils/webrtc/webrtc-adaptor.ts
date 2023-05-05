import { WebSocketAdaptor } from "./websocket-adaptor";
import { MediaManager } from "./media-manager";
import { SoundMeter } from "./soundmeter";

export interface MediaConstraints {
  video: boolean;
  audio: boolean;
}

type EventListener = (command: string, payload?: any) => void;

export interface WebRTCAdaptorConfig {
  websocket_url: string;

  peerconnection_config?: RTCConfiguration;

  isPlayMode?: boolean;

  debug?: boolean;

  mediaConstraints?: MediaConstraints;

  onlyDataChannel?: boolean;

  dataChannelEnabled?: boolean;

  sdp_constraints?: RTCOfferOptions;

  callback(command: string, payload?: any): void;

  callbackError: (command: string, payload?: any) => void;
}

/**
 * 此结构用户处理大数据通道消息（如图像）
 * 在发送和接收时应当将其分成块
 */
class ReceivingMessage {
  size: number;

  received: number;

  data: ArrayBuffer;

  constructor(size: number) {
    this.size = size;
    this.received = 0;
    this.data = new ArrayBuffer(size);
  }
}

export class WebRTCAdaptor {
  static pluginInitMethods: ((self: WebRTCAdaptor) => void)[] = [];

  /** ---------- options ---------- */
  websocket_url: string;

  peerconnection_config?: RTCConfiguration;

  /**
   * 播放回话模式
   * 在此模式下，不要相机/麦克风
   */
  isPlayMode = false;

  /**
   * 此标志启用/禁用调试日志记录
   */
  debug = false;

  mediaConstraints: MediaConstraints = {
    video: true,
    audio: true,
  };

  /**
   * 只传输数据
   * 为true时，不会发送音视频
   */
  onlyDataChannel = false;

  dataChannelEnabled = true;

  sdp_constraints: RTCOfferOptions = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true,
  };

  callback: (command: string, payload?: any) => void;

  callbackError: (command: string, payload?: any) => void;

  /** ---------- 实例属性 ---------- */
  webSocketAdaptor!: WebSocketAdaptor;

  mediaManager: MediaManager;

  roomName?: string;

  /**
   * 音频上写文
   */
  audioContext = new AudioContext();

  /**
   * 保存每一个媒体流的对等连接
   */
  remotePeerConnection: Record<string, RTCPeerConnection> = {};

  dataChannel: Record<string, RTCDataChannel> = {};

  /**
   * 保存每个对等连接的远程描述(SDP)设置状态
   */
  remoteDescriptionSet: Record<string, boolean> = {};

  /**
   * 保存接收远程描述(SDP)之前的ICE候选者
   */
  iceCandidateList: Record<string, RTCIceCandidate[]> = {};

  /**
   * 保存 streamId和trackId 的映射
   */
  idMapping: Record<string, Record<number, string>> = {};

  publishStreamId: string = "";

  /**
   * 候选者支持类型
   */
  candidateTypes: string[] = ["udp", "tcp"];

  receivingMessages: Record<string, ReceivingMessage> = {};

  /**
   * 保存每个播放会话的 streamId
   */
  playStreamId: string[] = [];

  /**
   * 保存每个对等连接音频的声级计
   */
  soundMeters: Record<string, SoundMeter> = {};

  /**
   * 音频声级计列表
   */
  soundLevelList: Record<string, number> = {};

  /**
   * 回调事件监听列表
   */
  eventListeners: EventListener[] = [];

  /**
   * 错误事件监听列表
   */
  errorEventListeners: EventListener[] = [];

  constructor(options: WebRTCAdaptorConfig) {
    const {
      websocket_url,
      peerconnection_config,
      isPlayMode,
      debug,
      mediaConstraints,
      sdp_constraints,
      callback,
      callbackError,
    } = options;

    this.websocket_url = websocket_url;

    this.peerconnection_config = peerconnection_config;

    this.isPlayMode = isPlayMode ?? this.isPlayMode;

    this.debug = debug ?? this.debug;

    this.mediaConstraints = mediaConstraints ?? this.mediaConstraints;

    this.sdp_constraints = sdp_constraints ?? this.sdp_constraints;

    this.callback = callback;

    this.callbackError = callbackError;

    this.mediaManager = new MediaManager({
      userParameters: options,
      webRTCAdaptor: this,
      callback: (info, obj) => {
        this.notifyEventListeners(info, obj);
      },
      callbackError: (error, message) => {
        this.notifyErrorEventListeners(error, message);
      },
      getSender: (streamId: string, type: "video" | "audio") => {
        return this.getSender(streamId, type);
      },
    });

    this.initialize();
  }

  /**
   * 初始化插件
   */
  initPlugins() {
    WebRTCAdaptor.pluginInitMethods.forEach((initMethod) => initMethod(this));
  }

  /**
   * 回调事件监听
   */
  addEventListener(listener: (command: string, payload?: any) => void) {
    this.eventListeners.push(listener);
  }

  /**
   * 回调事件通知
   */
  notifyEventListeners(command: string, payload?: any) {
    this.eventListeners.forEach((listener) => listener(command, payload));
    this.callback?.(command, payload);
  }

  /**
   * 错误事件监听
   */
  addErrorEventListener(errorListener: (error: string, message: any) => void) {
    this.errorEventListeners.push(errorListener);
  }

  /**
   * 错误事件通知
   */
  notifyErrorEventListeners(error: string, message: any) {
    this.errorEventListeners.forEach((listener) => listener(error, message));
    this.callbackError?.(error, message);
  }

  /**
   * Called by constuctor to
   * 检查本地流，非 playMode 则初始化
   * 开始 websocket 连接
   */
  initialize() {
    if (
      !this.isPlayMode &&
      !this.onlyDataChannel &&
      !this.mediaManager.localStream
    ) {
      this.mediaManager
        .initLocalStream()
        ?.then(() => {
          this.initPlugins();
          this.checkWebSocketConnection();
        })
        .catch((error) => {
          console.error("initialize Error: ", error);
        });
      return;
    }
    this.initPlugins();
    this.checkWebSocketConnection();
  }

  /**
   * 启动新的 WebRTC 媒体流，响应 "start"
   * @param streamId
   */
  async publish(
    streamId: string,
    token?: string,
    subscriberId?: string,
    subscriberCode?: string,
    streamName?: string,
    mainTrack?: string,
    metaData?: any
  ) {
    this.publishStreamId = streamId;
    this.mediaManager.publishStreamId = streamId;

    if (this.onlyDataChannel) {
      this.sendPublishCommand(
        streamId,
        token,
        subscriberId,
        subscriberCode,
        streamName,
        mainTrack,
        metaData,
        false,
        false
      );
      return;
    }

    const localStream = this.mediaManager.localStream;
    if (!this.mediaManager.localStream) {
      await this.mediaManager.initLocalStream();
    }
    const videoEnabled = localStream!.getVideoTracks().length > 0;
    const audioEnabled = localStream!.getAudioTracks().length > 0;
    this.sendPublishCommand(
      streamId,
      token,
      subscriberId,
      subscriberCode,
      streamName,
      mainTrack,
      metaData,
      videoEnabled,
      audioEnabled
    );
  }

  sendPublishCommand(
    streamId: string,
    token?: string,
    subscriberId = "",
    subscriberCode = "",
    streamName = "",
    mainTrack = "",
    metaData?: any,
    videoEnabled?: boolean,
    audioEnabled?: boolean
  ) {
    const jsCmd = {
      command: "publish",
      streamId: streamId,
      token: token,
      subscriberId,
      subscriberCode,
      streamName,
      mainTrack,
      video: videoEnabled,
      audio: audioEnabled,
      metaData: metaData,
    };
    this.webSocketAdaptor.send(JSON.stringify(jsCmd));
  }

  /**
   * 加入房间 响应 "joinedTheRoom" 信息
   * @param roomName 房间的唯一id
   * @param streamId
   * @param mode amcu: 混合音频
   */
  joinRoom(roomName: string, streamId: string, mode: "mcu" | "legacy") {
    this.roomName = roomName;
    this.webSocketAdaptor.send(
      JSON.stringify({
        command: "joinRoom",
        room: roomName,
        streamId: streamId,
        mode: mode,
      })
    );
  }

  /**
   * 启动流的播放会话
   */
  play(
    streamId: string,
    roomId: string,
    token = "",
    trackList: string[] = [],
    subscriberId = "",
    subscriberCode = "",
    metaData?: any
  ) {
    this.playStreamId.push(streamId);
    const jsCmd = {
      command: "play",
      streamId: streamId,
      token: token,
      room: roomId,
      trackList,
      subscriberId,
      subscriberCode,
      viewerInfo: metaData,
    };

    this.webSocketAdaptor.send(JSON.stringify(jsCmd));
  }

  /**
   * 停止流的发布 响应 "publishFinished"
   */
  stop(streamId: string) {
    this.closePeerConnection(streamId);
    this.webSocketAdaptor.send(
      JSON.stringify({
        command: "stop",
        streamId,
      })
    );
  }

  /**
   * 加入会话流 响应 "joined"
   */
  join(streamId: string) {
    this.webSocketAdaptor.send(
      JSON.stringify({
        command: "join",
        streamId: streamId,
        multiPeer: false,
        mode: this.isPlayMode ? "play" : "both",
      })
    );
  }

  /**
   * 离开会话房间 响应 "leavedTheRoom"
   * @param roomName 房间ID
   */
  leaveFromRoom(roomName: string) {
    this.roomName = roomName;
    const jsCmd = {
      command: "leaveFromRoom",
      room: roomName,
    };
    this.log("发送离开房间请求, 房间ID: " + roomName);
    this.webSocketAdaptor.send(JSON.stringify(jsCmd));
  }

  /**
   * 离开会话流 响应 "leaved"
   * @param streamId
   */
  leave(streamId: string) {
    this.webSocketAdaptor.send(
      JSON.stringify({
        command: "leave",
        streamId,
      })
    );
    this.closePeerConnection(streamId);
  }

  /**
   * 获取流信息 响应 "streamInformation"
   */
  getStreamInfo(streamId: string) {
    this.webSocketAdaptor.send(
      JSON.stringify({
        command: "getStreamInfo",
        streamId: streamId,
      })
    );
  }

  /**
   * 更新流的元数据
   * @param streamId
   * @param metaData
   */
  upateStreamMetaData(streamId: string, metaData: any) {
    this.webSocketAdaptor.send(
      JSON.stringify({
        command: "updateStreamMetaData",
        streamId,
        metaData,
      })
    );
  }

  /**
   * 获取房间信息 响应 "roomInformation"
   * @param roomName
   * @param streamId
   */
  getRoomInfo(roomName: string, streamId: string) {
    this.webSocketAdaptor.send(
      JSON.stringify({
        command: "getRoomInfo",
        room: roomName,
        streamId: streamId,
      })
    );
  }

  /**
   * Called to enable/disable data flow from the AMS for a specific track under a main track.
   */
  enableTrack(streamId: string, trackId: string, enabled: boolean) {
    this.webSocketAdaptor.send(
      JSON.stringify({
        command: "enableTrack",
        streamId,
        trackId,
        enabled,
      })
    );
  }

  /**
   * Called to get the track ids under a main stream. AMS responds with trackList message.
   */
  getTracks(streamId: string, token?: string) {
    this.playStreamId.push(streamId);
    this.webSocketAdaptor.send(
      JSON.stringify({
        command: "getTrackList",
        streamId,
        token,
      })
    );
  }

  /**
   * 由浏览器调用，当WebRTC有新的对等连接加入回调 响应 "newStreamAvailable"
   */
  onTrack(event: RTCTrackEvent, streamId: string) {
    this.callback("newStreamAvailable", {
      stream: event.streams[0],
      track: event.track,
      streamId: streamId,
      trackId: event?.transceiver?.mid
        ? this.idMapping[streamId]?.[Number(event.transceiver.mid)]
        : undefined,
    });
  }

  /**
   * 接收ICE候选人事件
   */
  iceCandidateReceived(event: RTCPeerConnectionIceEvent, streamId: string) {
    if (event.candidate) {
      let protocolSupported = false;
      if (event.candidate.candidate === "") {
        protocolSupported = true;
      } else if (!event.candidate.protocol) {
        this.candidateTypes.forEach((element) => {
          if (event.candidate?.candidate.toLowerCase().includes(element)) {
            protocolSupported = true;
          }
        });
      } else {
        protocolSupported = this.candidateTypes.includes(
          event.candidate.protocol.toLowerCase()
        );
      }

      if (protocolSupported) {
        const jsCmd = {
          command: "takeCandidate",
          streamId: streamId,
          label: event.candidate.sdpMLineIndex,
          id: event.candidate.sdpMid,
          candidate: event.candidate.candidate,
        };

        this.webSocketAdaptor.send(JSON.stringify(jsCmd));
      }
    } else {
      this.log("没有候选人 No event.candidate");
    }
  }

  initDataChannel(streamId: string, dataChannel: RTCDataChannel) {
    this.dataChannel[streamId] = dataChannel;

    dataChannel.onerror = (error) => {
      this.log("数据通道 Error: ", error);
      this.log("通道状态: ", dataChannel.readyState);
      if (dataChannel.readyState !== "closed") {
        this.notifyErrorEventListeners("data_channel_error", {
          streamId: streamId,
          error: error,
        });
      }
    };

    dataChannel.onmessage = (event) => {
      const obj = {
        streamId: streamId,
        data: event.data,
      };

      const data = obj.data;

      if (typeof data === "string" || data instanceof String) {
        this.notifyEventListeners("data_received", obj);
      } else {
        const length = data.length;

        const view = new Int32Array(data, 0, 1);
        const token = view[0];

        let msg = this.receivingMessages[token];
        if (!msg) {
          const view = new Int32Array(data, 0, 2);
          const size = view[1];
          msg = new ReceivingMessage(size);
          this.receivingMessages[token] = msg;
          if (length > 8) {
            this.log("信息接收处理问题");
          }
          return;
        }

        var rawData = data.slice(4, length);

        var dataView = new Uint8Array(msg.data);
        dataView.set(new Uint8Array(rawData), length - 4);
        msg.received += length - 4;

        if (msg.size == msg.received) {
          obj.data = msg.data;
          this.notifyEventListeners("data_received", obj);
        }
      }
    };
  }

  /**
   * 由内部调用，启动对等连接
   * @param streamId
   * @param dataChannelMode "publish" | "play" | "peer" 决定数据通道的创建方式
   */
  initPeerConnection(streamId: string, dataChannelMode: string) {
    if (!this.remotePeerConnection[streamId]) {
      this.log("初始化对等连接" + streamId);
      this.remotePeerConnection[streamId] = new RTCPeerConnection({
        ...this.peerconnection_config,
      });
      this.remoteDescriptionSet[streamId] = false;
      this.iceCandidateList[streamId] = [];

      if (!this.playStreamId.includes(streamId)) {
        if (this.mediaManager.localStream) {
          this.mediaManager.localStream.getTracks().forEach((track) => {
            this.remotePeerConnection[streamId].addTrack(
              track,
              this.mediaManager.localStream!
            );
          });
        }
      }

      this.remotePeerConnection[streamId].onicecandidate = (event) => {
        this.iceCandidateReceived(event, streamId);
      };

      this.remotePeerConnection[streamId].ontrack = (event) => {
        this.onTrack(event, streamId);
      };

      this.remotePeerConnection[streamId].onnegotiationneeded = () =>
        this.log("onnegotiationneeded");

      if (dataChannelMode === "publish") {
        const dataChannelOptions = {
          ordered: true,
        };
        var dataChannel = this.remotePeerConnection[streamId].createDataChannel(
          streamId,
          dataChannelOptions
        );
        this.initDataChannel(streamId, dataChannel);
      } else if (dataChannelMode === "play") {
        this.remotePeerConnection[streamId].ondatachannel = (ev) => {
          this.initDataChannel(streamId, ev.channel);
        };
      } else {
        const dataChannelOptions = {
          ordered: true,
        };

        const dataChannelPeer = this.remotePeerConnection[
          streamId
        ].createDataChannel(streamId, dataChannelOptions);
        this.initDataChannel(streamId, dataChannelPeer);

        this.remotePeerConnection[streamId].ondatachannel = (ev) => {
          this.initDataChannel(streamId, ev.channel);
        };
      }

      this.remotePeerConnection[streamId].oniceconnectionstatechange = (
        event
      ) => {
        const obj = {
          state: this.remotePeerConnection[streamId].iceConnectionState,
          streamId,
        };
        this.notifyEventListeners("ice_connection_state_changed", obj);

        if (!this.isPlayMode && !this.playStreamId.includes(streamId)) {
          if (
            this.remotePeerConnection[streamId].iceConnectionState ===
            "connected"
          ) {
            // this.mediaManager.changeBandwidth()
          }
        }
      };
    }
  }

  /**
   * 由内部调用，关闭对等连接
   */
  closePeerConnection(streamId: string) {
    const remotePeerConnection = this.remotePeerConnection[streamId];
    if (remotePeerConnection) {
      if (remotePeerConnection?.signalingState !== "closed") {
        remotePeerConnection?.close();
        delete this.remotePeerConnection[streamId];

        this.playStreamId = this.playStreamId.filter((id) => id !== streamId);
      }
    }

    if (this.soundMeters[streamId]) {
      this.soundMeters[streamId].stop();
      delete this.soundMeters[streamId];
    }
  }

  /**
   * 获取流的信息状态
   * https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/connectionState
   */
  signallingState(streamId: string) {
    return this.remotePeerConnection[streamId]?.signalingState;
  }

  /**
   * 获取流ICE连接状态
   * @param streamId
   * @returns
   */
  iceConnectionState(streamId: string) {
    return this.remotePeerConnection[streamId]?.iceConnectionState;
  }

  /**
   * 当成功创建本地配置（SDP）时，由浏览器调用。
   * 它被设置为LocalDescription，然后被发送到AMS。
   * 配置：创建的本地配置（SDP）
   */
  gotDescription(configuration: RTCSessionDescriptionInit, streamId: string) {
    this.remotePeerConnection[streamId]
      ?.setLocalDescription(configuration)
      .then(() => {
        this.log(`本地描述设置成功 streamId: ${streamId}`);
        const jsCmd = {
          command: "takeConfiguration",
          streamId: streamId,
          type: configuration.type,
          sdp: configuration.sdp,
        };
        this.log("本地 sdp: " + configuration.sdp);
        this.webSocketAdaptor.send(JSON.stringify(jsCmd));
      })
      .catch((error) => {
        console.error("本地描述设置失败 Error: " + error);
      });
  }

  /**
   * 由WebSocketAdaptor调用 从AMS接收到远程配置(SDP)时
   * 首先将其设置为 远程描述，然后如果 iceCandidateList 有候选者，收到消息后，添加为ICE候选者
   */
  takeConfiguration(
    streamId: string,
    sdp: string,
    type: RTCSdpType,
    idMapping: string
  ) {
    const isTypeOffer = type === "offer";
    const dataChannelMode = isTypeOffer ? "play" : "publish";

    this.idMapping[streamId] = idMapping;
    this.initPeerConnection(streamId, dataChannelMode);

    this.remotePeerConnection[streamId]
      ?.setRemoteDescription(
        new RTCSessionDescription({
          sdp,
          type,
        })
      )
      .then(() => {
        this.log(`设置远程描述成功, streamId: ${streamId}, type: ${type}`);
        this.remoteDescriptionSet[streamId] = true;
        const length = this.iceCandidateList[streamId].length;
        for (let i = 0; i < length; i++) {
          this.addIceCandidate(streamId, this.iceCandidateList[streamId][i]);
        }
        this.iceCandidateList[streamId] = [];
        if (isTypeOffer) {
          this.log("尝试创建answer streamId: " + streamId);
          this.remotePeerConnection[streamId]
            ?.createAnswer(this.sdp_constraints)
            .then((configuration) => {
              this.log("创建answer streamId: " + streamId);
              configuration.sdp = configuration.sdp?.replace(
                "useinbandfec=1",
                "useinbandfec=1; stereo=1"
              );
              this.gotDescription(configuration, streamId);
            })
            .catch((error) => {
              console.error("create answer error :" + error);
            });
        }
      })
      .catch((error) => {
        this.log("设置远程描述失败 Error: " + error);
        if (
          error?.toString().includes("InvalidAccessError") ||
          error?.toString().includes("setRemoteDescription")
        ) {
          /**
           * 此错误通常发生在编解码器不兼容的情况下
           * AMS for 现在支持H.264编解码器。当一些浏览器试图从VP8打开它时，会发生此错误。
           */
          this.callbackError("notSetRemoteDescription");
        }
      });
  }

  /**
   * 由WebSocketAdaptor调用，接收到新的 ICE 候选者
   * 如果已经了远程描述（SDP），则立即添加候选者
   * 否则存储到iceCandidateList中，等待远程描述设置
   */
  takeCandidate(streamId: string, sdpMLineIndex: number, candidate: string) {
    var iceCandidate = new RTCIceCandidate({
      sdpMLineIndex,
      candidate,
    });

    this.initPeerConnection(streamId, "peer");

    if (this.remoteDescriptionSet[streamId]) {
      this.addIceCandidate(streamId, iceCandidate);
    } else {
      this.log("ICE候选者添加到列表中, 因为尚未设置远程描述");
      this.iceCandidateList[streamId].push(iceCandidate);
    }
  }

  /**
   * 内部调用，将 ICE候选者 添加到 PeerConnection
   */
  addIceCandidate(streamId: string, iceCandidate: RTCIceCandidate) {
    let protocolSupported = false;
    if (iceCandidate.candidate === "") {
      // 如果接收的候选者值为空值，则不要比较协议
      protocolSupported = true;
    } else if (typeof iceCandidate.protocol === "undefined") {
      this.candidateTypes.forEach((element) => {
        if (iceCandidate.candidate.toLowerCase().includes(element)) {
          protocolSupported = true;
        }
      });
    } else {
      protocolSupported = this.candidateTypes.includes(
        iceCandidate.protocol?.toLowerCase() ?? ""
      );
    }
    if (protocolSupported) {
      this.remotePeerConnection[streamId]
        ?.addIceCandidate(iceCandidate)
        .then(() => {
          this.log("媒体流添加候选者 streamId " + streamId);
        })
        .catch((error) => {
          this.log("无法添加候选者 streamId " + streamId + "Error: " + error);
          this.log("候选者：", iceCandidate);
        });
    } else {
      this.log(
        "Candidate's protocol(" +
          iceCandidate.protocol +
          ") is not supported." +
          "Candidate: " +
          iceCandidate.candidate +
          " Supported protocols:" +
          this.candidateTypes
      );
    }
  }

  /**
   * 由WebSocketAdaptor调用，响应 "start" 信息
   * @param streamId
   */
  startPublishing(streamId: string) {
    this.initPeerConnection(streamId, "publish");
    this.remotePeerConnection[streamId]
      ?.createOffer(this.sdp_constraints)
      .then((configuration) => {
        this.gotDescription(configuration, streamId);
      })
      .catch((error) => {
        console.error(
          "create offer error for stream id: " + streamId + " error: " + error
        );
      });
  }

  /**
   * 通过DataChannel发送数据
   * @param streamId
   */
  sendData(streamId: string, data: string) {
    this.dataChannel[streamId]?.send(data);
  }

  /**
   * 在服务器切换视频轨道
   */
  toggleVideo(streamId: string, trackId: string, enabled: boolean) {
    this.webSocketAdaptor.send(
      JSON.stringify({
        command: "toggleVideo",
        streamId,
        trackId,
        enabled,
      })
    );
  }

  /**
   * 在服务器切换音频轨道
   */
  toggleAudio(streamId: string, trackId: string, enabled: boolean) {
    this.webSocketAdaptor.send(
      JSON.stringify({
        command: "toggleAudio",
        streamId,
        trackId,
        enabled,
      })
    );
  }

  /**
   * 检查并启用 WebSocket 连接
   */
  checkWebSocketConnection() {
    if (!this.webSocketAdaptor || !this.webSocketAdaptor?.isConnected()) {
      this.webSocketAdaptor = new WebSocketAdaptor({
        websocket_url: this.websocket_url,
        webrtcadaptor: this,
        callback: (command: string, payload?: any) => {
          this.notifyEventListeners(command, payload);
        },
        callbackError: (error: string, message?: any) => {
          this.notifyErrorEventListeners(error, message);
        },
        debug: this.debug,
      });
    }
  }

  /**
   * 关闭WebSocket
   */
  closeWebSocket() {
    for (const key in this.remotePeerConnection) {
      this.remotePeerConnection[key].close();
    }
    //free the remote peer connection by initializing again
    this.remotePeerConnection = {};
    this.webSocketAdaptor.close();
  }

  /**
   * 启动远程流的声级计
   */
  enableAudioLevel(stream: MediaStream, streamId: string) {
    const soundMeter = new SoundMeter(this.audioContext);
    soundMeter.connectToSource(stream);
    this.soundMeters[streamId] = soundMeter;
  }

  getSoundLevelList(streamsList: string[]) {
    for (let i = 0; i < streamsList.length; i++) {
      const streamId = streamsList[i];
      this.soundLevelList[streamId] = this.soundMeters[streamId].instant;
    }
    this.notifyEventListeners("gotSoundList", this.soundLevelList);
  }

  getSender(streamId: string, type: "video" | "audio") {
    return this.remotePeerConnection[streamId]
      .getSenders()
      .find((sender) => sender.track?.kind === type);
  }

  /**
   * 静音
   */
  muteLocalMic() {
    this.mediaManager.muteLocalMic();
  }

  /**
   * 取消静音
   */
  unmuteLocalMic() {
    this.mediaManager.unmuteLocalMic();
  }

  async startDesktopCapture(streamId: string, sourceId: string) {
    await this.mediaManager.startDesktopCapture(streamId, sourceId);
  }

  stopDesktopCapture(streamId: string) {
    this.mediaManager.stopDesktopCapture(streamId);
  }

  log(message?: any, ...optionalParams: any[]) {
    if (this.debug) {
      console.log(message, optionalParams);
    }
  }

  enableAudioLevelForLocalStream(levelCallback?: (instant: number) => void) {
    this.mediaManager.enableAudioLevelForLocalStream(levelCallback);
  }
}
