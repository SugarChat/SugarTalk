import { ResponseResult } from "../../../entity/response";
import { Api } from "../../api/api";
import {
  CreateMeetingRequest,
  CreateMeetingResponse,
  EndMeetingRequest,
  GetMeetingInfoRequest,
  GetMeetingInfoResponse,
  JoinMeetingRequest,
  JoinMeetingResponse,
  OutMeetingRequest,
} from "./types";

/**
 * 加入会议
 * @param data JoinMeetingRequest
 * @returns ResponseResult<JoinMeetingResponse>
 */
export const joinMeetingApi = async (data: JoinMeetingRequest) =>
  (await Api.post<ResponseResult<JoinMeetingResponse>>("/Meeting/join", data))
    .data;

/**
 * 创建会议
 * @param data CreateMeetingRequest
 * @returns ResponseResult<CreateMeetingResponse>
 */
export const createMeetingApi = async (data: CreateMeetingRequest) =>
  (
    await Api.post<ResponseResult<CreateMeetingResponse>>(
      "/Meeting/schedule",
      data
    )
  ).data;

/**
 * 获取会议信息
 * @param params GetMeetingInfoRequest
 * @returns ResponseResult<GetMeetingInfoResponse>
 */
export const getMeetingInfoApi = async (params: GetMeetingInfoRequest) =>
  (
    await Api.get<ResponseResult<GetMeetingInfoResponse>>("/Meeting/get", {
      params,
    })
  ).data;

/**
 * 退出会议
 * @param data OutMeetingRequest
 * @returns
 */
export const outMeetingApi = async (data: OutMeetingRequest) =>
  (await Api.post("/Meeting/out", data)).data;

/**
 * 结束会议
 * @param data EndMeetingRequest
 * @returns
 */
export const endMeetingApi = async (data: EndMeetingRequest) =>
  (await Api.post("/Meeting/end", data)).data;
