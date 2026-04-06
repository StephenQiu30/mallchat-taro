// @ts-ignore
/* eslint-disable */
import { request } from "@/services/request";

/** 创建用户登录日志 记录用户登录日志 POST /log/login/add */
export async function addUserLoginLog(
  body: LogAPI.UserLoginLogAddRequest,
  options?: { [key: string]: any }
) {
  return request<LogAPI.BaseResponseBoolean>("/log/login/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除用户登录日志 删除指定用户登录日志（仅管理员） POST /log/login/delete */
export async function deleteUserLoginLog(
  body: LogAPI.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<LogAPI.BaseResponseBoolean>("/log/login/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 分页获取用户登录日志列表 分页查询用户登录日志（仅管理员） POST /log/login/list/page */
export async function listLogByPage1(
  body: LogAPI.UserLoginLogQueryRequest,
  options?: { [key: string]: any }
) {
  return request<LogAPI.BaseResponsePageUserLoginLogVO>(
    "/log/login/list/page",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}
