import { LoginResponse } from "../../../entity/response";

export interface LoginApiRequest {
  grant_type: string;
  username: string;
  password: string;
}

export interface LoginApiResponse extends LoginResponse {}
