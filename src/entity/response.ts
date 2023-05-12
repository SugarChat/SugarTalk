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

export interface MeetingSchedule {
  startDate: number;
  endDate: number;
  mode: "mcu" | "legacy";
  originAdress: string;
  roomId: string;
  roomStreamList: any[];
}

export interface UserSession {
  id: number;
  createdDate: string;
  isMuted: boolean;
  isSharingScreen: false;
  meetingId: string;
  userId: number;
}

export interface Meeting {
  endDate: number;
  id: string;
  meetingNumber: string;
  meetingStreamMode: number;
  mode: string;
  originAddress: string;
  startDate: number;
  userSessions: UserSession[];
}
