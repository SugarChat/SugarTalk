import { SoundMeter } from "./soundmeter";
import {
  WebRTCAdaptorConfig,
  MediaConstraints,
  WebRTCAdaptor,
} from "./webrtc-adaptor";

interface MediaManagerConfig {
  userParameters: WebRTCAdaptorConfig;

  webRTCAdaptor: WebRTCAdaptor;

  callback: (command: string, payload?: any) => void;

  callbackError: (command: string, payload?: any) => void;

  getSender: (
    streamId: string,
    type: "video" | "audio"
  ) => RTCRtpSender | undefined;
}

export enum VideoMode {
  None = "none",
  Camera = "camera",
  Screen = "screen",
  ScreenWithCamera = "screen+camera",
}

export class MediaManager {
  /** ---------- options ---------- */
  userParameters: WebRTCAdaptorConfig;

  webRTCAdaptor: WebRTCAdaptor;

  /** ---------- 实例属性 ---------- */
  publishMode: VideoMode = VideoMode.Camera;

  mediaConstraints: MediaConstraints = {
    video: false,
    audio: true,
  };

  localStream?: MediaStream;

  publishStreamId?: string;

  callback: (command: string, payload?: any) => void;

  callbackError: (command: string, payload?: any) => void;

  getSender: (
    streamId: string,
    type: "video" | "audio"
  ) => RTCRtpSender | undefined;

  /**
   * 音频流静音状态
   */
  isMuted = false;

  audioContext = new AudioContext();

  /**
   * 音频输入设备列表
   */
  audioInputList: MediaDeviceInfo[] = [];

  /**
   * 用来创建伪流的canvas
   */
  dummyCanvas: HTMLCanvasElement = document.createElement("canvas");

  /**
   * 伪流，用来替换屏幕共享
   */
  replaceStream?: MediaStream;

  blackFrameTimer: NodeJS.Timer;

  constructor({
    userParameters,
    webRTCAdaptor,
    callback,
    callbackError,
    getSender,
  }: MediaManagerConfig) {
    this.userParameters = userParameters;

    this.webRTCAdaptor = webRTCAdaptor;

    this.callback = callback;

    this.callbackError = callbackError;

    this.getSender = getSender;

    this.mediaConstraints =
      userParameters?.mediaConstraints ?? this.mediaConstraints;

    this.initializeDummyFrame();
    this.blackFrameTimer = setInterval(() => {
      this.initializeDummyFrame();
    }, 3000);
  }

  initMediaDevices() {
    return navigator.mediaDevices.enumerateDevices().then((devices) => {
      this.audioInputList = devices.filter(
        (device) => device.kind === "audioinput"
      );
    });
  }

  /**
   * 初始化本地流，只获取音频流
   */
  async initLocalStream() {
    if (this.audioInputList.length === 0) {
      await this.initMediaDevices();
    }

    return this.navigatorUserMedia().then((stream) => {
      this.gotStream(stream);
    });
  }

  /**
   * 打开媒体流，屏幕/相机/麦克风
   */
  openStream(mediaConstraints: MediaConstraints) {
    if (mediaConstraints.video) {
      return this.getMedia(mediaConstraints);
    }
  }

  getMedia(mediaConstraints: MediaConstraints) {
    return this.navigatorUserMedia().then((stream) => {
      return this.prepareStreamTracks(stream);
    });
  }

  /**
   * 获取默认音频输入设备ID
   * @returns deviceId
   */
  getDefaultAudioInputDeviceId() {
    return new Promise<string>((resolve) => {
      if (this.audioInputList.length > 0) {
        resolve(this.audioInputList[0].deviceId);
      } else {
        this.initMediaDevices().then(() => {
          resolve(this.audioInputList[0].deviceId);
        });
      }
    });
  }

  /**
   * 如果静音或者关闭相机，仍应发送一些数据
   * 这个方法创建一个黑帧以减少数据传输
   */
  initializeDummyFrame() {
    this.dummyCanvas.getContext("2d")!.fillRect(0, 0, 320, 240);
    const replaceStream = this.dummyCanvas.captureStream();
    replaceStream.getVideoTracks()[0].enabled = false;
    this.replaceStream = replaceStream;
  }

  /**
   * 获取用户媒体流
   * @param sourceId
   * @returns
   */
  async navigatorUserMedia(sourceId?: string) {
    let constraints: MediaStreamConstraints;
    if (sourceId) {
      constraints = {
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: sourceId,
          },
        } as MediaTrackConstraints,
        audio: false,
      };
    } else {
      const deviceId = await this.getDefaultAudioInputDeviceId();
      if (deviceId) {
        constraints = {
          video: false,
          audio: {
            deviceId,
          },
        };
      } else {
        constraints = {
          video: false,
          audio: true,
        };
      }
    }
    let stream = await navigator.mediaDevices.getUserMedia(constraints);

    if (!sourceId) {
      /**
       * 如果是初始化获取音频流，则添加一个黑帧的视频流
       * 用来后面替换屏幕分享的视频流
       */
      if (
        this.replaceStream &&
        this.replaceStream.getVideoTracks().length > 0
      ) {
        stream.addTrack(this.replaceStream.getVideoTracks()[0]);
      }
    }

    return stream;
  }

  prepareStreamTracks(stream: MediaStream) {
    var audioTracks = stream.getAudioTracks();
    return this.gotStream(stream);
  }

  /**
   * 更新本地流
   */
  gotStream(stream: MediaStream) {
    this.localStream = stream;
    this.callback("localStream", stream);
  }

  /**
   * Called by User
   * 启动屏幕分享模式
   * @param streamId
   */
  async startDesktopCapture(streamId: string, sourceId: string) {
    this.publishMode = VideoMode.Screen;
    await this.navigatorUserMedia(sourceId).then((stream) => {
      const newVideoTrack = stream.getVideoTracks()[0];
      if (this.localStream && this.localStream?.getAudioTracks().length > 0) {
        stream.addTrack(this.localStream.getAudioTracks()[0]);
      }
      const videoTrackSender = this.getSender(streamId, "video");

      console.log("stream", stream.getTracks());
      console.log("newVideoTrack", newVideoTrack);
      console.log("videoTrackSender", videoTrackSender);

      if (videoTrackSender) {
        videoTrackSender.replaceTrack(newVideoTrack);
      } else {
        this.webRTCAdaptor.remotePeerConnection[streamId].addTrack(
          newVideoTrack,
          stream
        );
        this.webRTCAdaptor.startPublishing(streamId);
      }

      this.gotStream(stream);

      // const newStream = new MediaStream([
      //   ...stream.getVideoTracks(),
      //   ...this.localStream?.getAudioTracks()!,
      // ]);
      // this.updateVideoTrack(newStream, streamId);
    });
  }

  /**
   * 停止屏幕分享模式
   */
  stopDesktopCapture(streamId: string) {
    this.publishMode = VideoMode.None;
    this.initializeDummyFrame();

    const localVideoTrack = this.localStream?.getVideoTracks()[0];
    this.localStream?.removeTrack(localVideoTrack!);
    localVideoTrack?.stop();

    const replaceStreamVideoTrack = this.replaceStream!.getVideoTracks()[0];

    if (this.replaceStream && this.replaceStream.getVideoTracks().length > 0) {
      this.localStream?.addTrack(replaceStreamVideoTrack);
    }

    const videoTrackSender = this.getSender(streamId, "video");
    videoTrackSender?.replaceTrack(replaceStreamVideoTrack);

    // this.updateVideoTrack(this.localStream!, streamId);
  }

  updateVideoTrack(stream: MediaStream, streamId: string) {
    const videoTrackSender = this.getSender(streamId, "video");
    console.log("videoTrackSender", videoTrackSender);
    console.log("getVideoTracks", stream.getVideoTracks()[0]);
    if (videoTrackSender) {
      return videoTrackSender
        .replaceTrack(stream.getVideoTracks()[0])
        .then(() => {
          this.updateLocalVideoStream(stream);
        });
    } else {
      return this.updateLocalVideoStream(stream);
    }
  }

  updateLocalVideoStream(stream: MediaStream) {
    const newVideoTrack = stream.getVideoTracks()[0];

    if (this.localStream && this.localStream.getVideoTracks().length > 0) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      this.localStream.removeTrack(videoTrack);
      videoTrack.stop();
      newVideoTrack && this.localStream.addTrack(newVideoTrack);
    }

    this.gotStream(this.localStream!);
  }

  /**
   * 用户调用
   * 本地音频流静音
   */
  muteLocalMic() {
    this.isMuted = true;
    this.localStream
      ?.getAudioTracks()
      .forEach((track) => (track.enabled = false));
  }

  /**
   * 用户调用
   * 本地音频流取消静音
   */
  unmuteLocalMic() {
    this.isMuted = false;
    this.localStream
      ?.getAudioTracks()
      .forEach((track) => (track.enabled = true));
  }

  enableAudioLevelForLocalStream(levelCallback?: (instant: number) => void) {
    const localStreamSoundMeter = new SoundMeter(
      this.audioContext,
      levelCallback
    );
    localStreamSoundMeter.connectToSource(this.localStream!);
  }
}
