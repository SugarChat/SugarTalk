import { StreamType } from "../../../entity/enum";
import { Meeting, UserSession } from "../../../entity/response";

interface Response {
  dataId: number;
  errorId: number;
  message: string;
  success: boolean;
}

export interface JoinMeetingRequest {
  meetingNumber: string;
  isMuted: boolean;
  streamId?: string;
  streamType: StreamType;
}

export interface JoinMeetingResponse {
  meeting: Meeting;
  response: Response;
}

export interface CreateMeetingRequest {
  meetingStreamMode: number;
  startDate: Date;
  endDate: Date;
}

export interface CreateMeetingResponse extends Meeting {}

export interface GetMeetingInfoRequest {
  meetingNumber: string;
}

export interface GetMeetingInfoResponse extends Meeting {}

export interface OutMeetingRequest {
  meetingId: string;
  streamId: string;
}

export interface EndMeetingRequest {
  meetingNumber: string;
}

export interface AudioChangeRequest {
  meetingUserSessionId: number;
  streamId: string;
  isMuted: boolean;
}

export interface AudioChangeResponse {
  response: Response;
  meetingUserSession: UserSession[];
}

export interface ScreenShareRequest {
  meetingUserSessionId: number;
  streamId: string;
  isShared: boolean;
}

export interface ScreenShareResponse {
  response: Response;
  meetingUserSession: UserSession[];
}
