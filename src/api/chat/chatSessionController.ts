// @ts-ignore
/* eslint-disable */
import {request} from "@/services/request";

/** 删除会话 在列表中移除选中的会话 POST /chat/session/delete */
export async function deleteSession(
  body: ChatAPI.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<ChatAPI.BaseResponseBoolean>("/chat/session/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 用户消息列表 获取当前登录用户的所有消息会话列表（包含未读数、最后一条消息概览） GET /chat/session/list/vo */
export async function listMySessions(options?: { [key: string]: any }) {
  return request<ChatAPI.BaseResponseListChatSessionVO>(
    "/chat/session/list/vo",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** 置顶会话 修改会话置顶状态 POST /chat/session/top */
export async function topSession(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: ChatAPI.topSessionParams,
  options?: { [key: string]: any }
) {
  return request<ChatAPI.BaseResponseBoolean>("/chat/session/top", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
