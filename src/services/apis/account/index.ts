import { ResponseResult } from "../../../entity/response";
import { Api } from "../../api/api";
import { GetUserInfoResponse } from "./types";

/**
 * 获取用户信息
 * @returns ResponseResult<GetUserInfoResponse>
 */
export const GetUserInfoApi = async () =>
  (await Api.get<ResponseResult<GetUserInfoResponse>>("/Account/user"))?.data ??
  {};
