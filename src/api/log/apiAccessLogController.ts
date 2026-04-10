// @ts-ignore
/* eslint-disable */
import {request} from "@/services/request";

/** 创建API访问日志 记录API访问日志 POST /log/access/add */
export async function addApiAccessLog(
  body: LogAPI.ApiAccessLogAddRequest,
  options?: { [key: string]: any }
) {
  return request<LogAPI.BaseResponseBoolean>("/log/access/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除API访问日志 删除指定API访问日志（仅管理员） POST /log/access/delete */
export async function deleteApiAccessLog(
  body: LogAPI.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<LogAPI.BaseResponseBoolean>("/log/access/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 分页获取API访问日志列表 分页查询API访问日志（仅管理员） POST /log/access/list/page */
export async function listLogByPage2(
  body: LogAPI.ApiAccessLogQueryRequest,
  options?: { [key: string]: any }
) {
  return request<LogAPI.BaseResponsePageApiAccessLogVO>(
    "/log/access/list/page",
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
