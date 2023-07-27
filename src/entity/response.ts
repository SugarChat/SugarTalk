import { StreamType } from "./enum";

export interface ResponseResult<T> {
  code: number;
  data: T;
  msg: string;
}

export interface LoginResponse {
  ".expires": string;
  ".issued": string;
  access_token: string;
  expires_in: number;
  token_type: string;
  userName: string;
}

export interface UserSessionStream {
  id: string;
  streamId: string;
  meetingUserSessionId: string;
  streamType: StreamType;
}

export interface UserSession {
  id: number;
  createdDate: string;
  isMuted: boolean;
  isSharingScreen: false;
  meetingId: string;
  userId: number;
  userName: string;
  streamId: string;
  userSessionStreams: UserSessionStream[];
}

export interface Meeting {
  id: string;
  startDate: number;
  endDate: number;
  meetingMasterUserId: number;
  meetingNumber: string;
  meetingStreamMode: number;
  mergedStream: string;
  originAdress: string;
  userSessions: UserSession[];
}

export interface UserInfo {
  createdOn: string;
  id: number;
  isActive: boolean;
  issuer: number;
  modifiedOn: string;
  roles: any[];
  thirdPartyUserId: string;
  userName: string;
  uuid: string;
}
