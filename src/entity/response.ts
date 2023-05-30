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

export interface UserSession {
  id: number;
  createdDate: string;
  isMuted: boolean;
  isSharingScreen: false;
  meetingId: string;
  userId: number;
  userName: string;
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
