import {
  DataChannelCommand,
  DataChannelNotifyType,
  MeetingStreamMode,
  DrawingStep,
  DrawingTool,
  MessageType,
  MessageSendStatus,
} from "./enum";

export type RoutePath = "/home" | "/settings" | "/join-meeting" | "/meeting";

export interface ScreenSource {
  appIcon: string;
  display_id: string;
  id: string;
  name: string;
  thumbnail: string;
}

export interface StreamItem {
  stream: MediaStream;
  track: MediaStreamTrack;
  streamId: string;
  trackId: string;
}

export interface MeetingQuery {
  audio: boolean;
  isMuted: boolean;
  camera: boolean;
  meetingNumber: string;
  userName: string;
  meetingStreamMode: MeetingStreamMode;
}

export interface StreamInfo {
  maxTrackCount: number;
  room: string;
  streamId: string;
  streamList: string;
  streams: string[];
}

export interface DataChannel {
  eventType: string;
  streamId: string;
}

export interface AppInfo {
  name: string;
  version: string;
  platform: "mac" | "win" | "other";
}

export interface Point {
  x: number;
  y: number;
}

export interface DataChannelMessage<T> {
  command: DataChannelCommand;
  message: T;
}

export interface DataChannelNotify {
  type: DataChannelNotifyType;
}

// 绘制Item
export interface DrawingRecord {
  id: string;
  userId: number;
  tool: DrawingTool;
  drawingTool?: DrawingTool;
  size: number;
  color: string;
  points: Point[];
  step: DrawingStep;
  fabric?: fabric.Object;
}

// 共享屏幕的video 尺寸信息
export interface VideoSizeInfo {
  width: number;
  height: number;
  videoWidth: number;
  videoHeight: number;
  currentVideoWidth: number;
  currentVideoHeight: number;
  ratio: number;
}

// IM Message
export interface Message {
  id: string;
  type: MessageType;
  content: string;
  fileType: string;
  filePath: string;
  size: number;
  sendStatus: MessageSendStatus;
  sendTime: string;
  isReaded: boolean;
  sendByUserId: number;
  sendByUserName: string;
  sendToUserId: number;
  sendToUserName: string;
}
