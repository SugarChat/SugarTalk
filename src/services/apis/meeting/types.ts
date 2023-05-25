import { Meeting } from "../../../entity/response";

export interface MeetingJoinRequest {
  meetingNumber: string;
  isMuted: boolean;
  streamId: string;
}

export interface MeetingJoinResponse extends Meeting {}

export interface MeetingCreateRequest {
  meetingStreamMode: number;
}

export interface MeetingCreateResponse extends Meeting {}

export interface GetMeetingInfoRequest {
  meetingNumber: string;
}
