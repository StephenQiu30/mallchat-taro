// @ts-ignore
/* eslint-disable */
import { request } from "@/services/request";

/** 删除会话 在列表中移除选中的会话 DELETE /session/remove */
export async function deleteSession(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: ChatAPI.deleteSessionParams,
  options?: { [key: string]: any }
) {
  return request<ChatAPI.BaseResponseBoolean>("/session/remove", {
    method: "DELETE",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 置顶会话 修改会话置顶状态 POST /session/top */
export async function topSession(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: ChatAPI.topSessionParams,
  options?: { [key: string]: any }
) {
  return request<ChatAPI.BaseResponseBoolean>("/session/top", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 用户消息列表 获取当前登录用户的所有消息会话列表 GET /session/user/list */
export async function listMySessions(options?: { [key: string]: any }) {
  return request<ChatAPI.BaseResponseListChatSessionVO>("/session/user/list", {
    method: "GET",
    ...(options || {}),
  });
}
