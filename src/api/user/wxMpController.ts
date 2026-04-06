// @ts-ignore
/* eslint-disable */
import { request } from "@/services/request";

/** 此处后端没有提供注释 GET /wx/mp/ */
export async function check(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UserAPI.checkParams,
  options?: { [key: string]: any }
) {
  return request<string>("/wx/mp/", {
    method: "GET",
    params: {
      ...params,
      request: undefined,
      ...params["request"],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /wx/mp/ */
export async function receiveMessage(options?: { [key: string]: any }) {
  return request<any>("/wx/mp/", {
    method: "POST",
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /wx/mp/setMenu */
export async function setMenu(options?: { [key: string]: any }) {
  return request<string>("/wx/mp/setMenu", {
    method: "GET",
    ...(options || {}),
  });
}
