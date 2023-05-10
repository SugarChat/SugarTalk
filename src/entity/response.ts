export interface LoginResponse {
  ".expires": string;
  ".issued": string;
  access_token: string;
  expires_in: number;
  token_type: string;
  userName: string;
}
