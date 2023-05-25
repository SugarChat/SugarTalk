import { MeetingStreamMode } from "./enum";

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
