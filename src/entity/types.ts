import {
  DataChannelCommand,
  DataChannelNotifyType,
  MeetingStreamMode,
} from "./enum";

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
