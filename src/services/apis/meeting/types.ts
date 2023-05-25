import { Meeting } from "../../../entity/response";

export interface JoinMeetingRequest {
  meetingNumber: string;
  isMuted: boolean;
  streamId: string;
}

export interface JoinMeetingResponse extends Meeting {}

export interface CreateMeetingRequest {
  meetingStreamMode: number;
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
