import { WebRTCAdaptor } from "./webrtc-adaptor";

interface WebSocketAdaptorConfig {
  websocket_url: string;

  webrtcadaptor: WebRTCAdaptor;

  debug?: boolean;

  /**
   * ping的时间间隔
   */
  pingInterval?: number;

  callback: (command: string, payload?: any) => void;

  callbackError: (command: string, payload?: any) => void;

  /**
   * 连接成功回调
   */
  callbackConnected?(): void;

  /**
   * 反序列化
   */
  deserialize?(text: string): any;

  /**
   * 序列化
   */
  serialize?(value: any): string;
}

/**
 * WebSocket 连接状态
 */
export enum ConnectionStatus {
  CONNECTING, // 正在建立連接
  OPEN, // 連接已經建立，可以進行通信
  CLOSING, // 連接正在關閉
  CLOSED, // 連接已經關閉或無法打開
}

export class WebSocketAdaptor {
  /** ---------- options ---------- */
  websocket_url: string;

  webrtcadaptor: WebRTCAdaptor;

  debug: boolean = false;

  pingInterval: number = 3000;

  callback: (command: string, payload?: any) => void;

  callbackError: (command: string, payload?: any) => void;

  deserialize = JSON.parse;

  serialize = JSON.stringify;

  /** ---------- 实例属性 ---------- */
  connectionStatus: ConnectionStatus = ConnectionStatus.CONNECTING;

  wsConn!: WebSocket;

  multiPeerStreamId?: string;

  constructor(options: WebSocketAdaptorConfig) {
    const {
      websocket_url,
      webrtcadaptor,
      debug,
      pingInterval,
      callback,
      callbackError,
      callbackConnected,
      deserialize,
      serialize,
    } = options;

    this.websocket_url = websocket_url;

    this.webrtcadaptor = webrtcadaptor;

    this.debug = debug ?? this.debug;

    this.pingInterval = pingInterval ?? this.pingInterval;

    this.callback = callback;

    this.callbackError = callbackError;

    this.deserialize = deserialize ?? this.deserialize;

    this.serialize = serialize ?? this.serialize;

    this.initWebSocketConnection(callbackConnected);
  }

  initWebSocketConnection(callbackConnected?: () => void) {
    this.connectionStatus = ConnectionStatus.CONNECTING;

    this.initConnectionMode();

    this.wsConn = new WebSocket(this.websocket_url);

    this.wsConn.onopen = () => {
      this.connectionStatus = ConnectionStatus.OPEN;

      this.log("websocket 连接成功");

      this.sendPing();

      this.callback("initialized");

      callbackConnected?.();
    };

    this.wsConn.onmessage = (event) => {
      const obj = this.deserialize(event.data);

      switch (obj.command) {
        case "start":
          this.log("收到启动命令");
          this.webrtcadaptor.startPublishing(obj.streamId);
          break;
        case "takeCandidate":
          this.log(`收到 ice candidate for stream id: ${obj.streamId}`);
          this.webrtcadaptor.takeCandidate(
            obj.streamId,
            obj.label,
            obj.candidate
          );
          break;
        case "takeConfiguration":
          this.log(
            `接收到流的远程描述类型 id: ${obj.streamId} type: ${obj.type}`
          );
          this.webrtcadaptor.takeConfiguration(
            obj.streamId,
            obj.sdp,
            obj.type,
            obj.idMapping
          );
          break;
        case "stop":
          this.log("收到停止命令");
          this.webrtcadaptor.closePeerConnection(obj.streamId);
          break;
        case "error":
          this.callbackError(obj.definition, obj);
          break;
        case "notification":
          this.callback(obj.definition, obj);
          if (["play_finished", "publish_finished"].includes(obj.definition)) {
            this.webrtcadaptor.closePeerConnection(obj.streamId);
          }
          break;
        case "pong":
          // this.sendPing();
          this.callback(obj.command);
          break;
        case "connectWithNewId":
          this.multiPeerStreamId = obj.streamId;
          this.webrtcadaptor.join(obj.streamId);
          break;
        case "streamInformation":
        case "roomInformation":
        case "trackList":
        case "peerMessageCommand":
          this.callback(obj.command, obj);
          break;
        default:
          this.callback(obj.command, obj);
      }
    };

    this.wsConn.onerror = (error) => {
      this.connectionStatus = ConnectionStatus.CLOSED;

      this.log(`发生错误：${JSON.stringify(error)}`);

      this.callbackError("WebSocketNotConnected", error);
    };

    this.wsConn.onclose = (event) => {
      this.connectionStatus = ConnectionStatus.CLOSED;

      this.log("连接关闭");

      this.callback("closed", event);
    };
  }

  /**
   * 初始化连接模式
   */
  initConnectionMode() {
    const target = this.webrtcadaptor.isPlayMode ? "edge" : "origin";

    if (this.websocket_url.includes("?")) {
      this.websocket_url += `&target=${target}`;
    } else {
      this.websocket_url += `?target=${target}`;
    }
  }

  log(message?: any, ...optionalParams: any[]) {
    if (this.debug) {
      console.log(message, optionalParams);
    }
  }

  sendPing() {
    setTimeout(() => {
      this.wsConn?.send(this.serialize({ command: "ping" }));
    }, this.pingInterval);
  }

  close() {
    this.wsConn.close();
  }

  send(text: string) {
    if (this.connectionStatus !== ConnectionStatus.OPEN) {
      this.initWebSocketConnection(() => {
        this.send(text);
      });
      return;
    }

    this.wsConn?.send(text);

    this.log(`发送消息：${text}`);
  }

  isConnected() {
    return this.connectionStatus === ConnectionStatus.OPEN;
  }

  getConnectionStatus() {
    return this.connectionStatus;
  }
}
