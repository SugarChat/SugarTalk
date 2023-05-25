import { ResponseResult } from "../../../entity/response";
import { Api } from "../../api/api";
import {
  GetMeetingInfoRequest,
  MeetingCreateRequest,
  MeetingCreateResponse,
  MeetingJoinRequest,
  MeetingJoinResponse,
} from "./types";

/**
 * 加入会议
 * @param data MeetingJoinRequest
 * @returns ResponseResult<MeetingJoinResponse>
 */
export const meetingJoinApi = async (data: MeetingJoinRequest) =>
  (await Api.post<ResponseResult<MeetingJoinResponse>>("/Meeting/join", data))
    .data;

/**
 * 创建会议
 * @param data MeetingCreateRequest
 * @returns ResponseResult<MeetingCreateResponse>
 */
export const meetingCreateApi = async (data: MeetingCreateRequest) =>
  (
    await Api.post<ResponseResult<MeetingCreateResponse>>(
      "/Meeting/schedule",
      data
    )
  ).data;

/**
 * 获取会议信息
 * @param params GetMeetingInfoRequest
 * @returns
 */
export const getMeetingInfo = async (params: GetMeetingInfoRequest) =>
  (
    await Api.get<ResponseResult<MeetingCreateResponse>>("/Meeting/get", {
      params,
    })
  ).data;
