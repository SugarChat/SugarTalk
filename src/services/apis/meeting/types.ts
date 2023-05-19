import { Meeting, MeetingSchedule } from "../../../entity/response";

export interface MeetingJoinRequest {
  meetingNumber: string;
  isMuted: boolean;
}

export interface MeetingJoinResponse extends Meeting {}

export interface MeetingCreateRequest {
  meetingStreamMode: number;
}

export interface MeetingCreateResponse extends MeetingSchedule {}
