// @ts-ignore
/* eslint-disable */
import {request} from "@/services/request";

/** 获取历史消息 获取指定房间的历史聊天记录（支持滚动翻页优化） GET /chat/message/list/history/vo */
export async function listHistoryMessages(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: ChatAPI.listHistoryMessagesParams,
  options?: { [key: string]: any }
) {
  return request<ChatAPI.BaseResponseListChatMessageVO>(
    "/chat/message/list/history/vo",
    {
      method: "GET",
      params: {
        // limit has a default value: 20
        limit: "20",
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 上报消息已读 更新当前用户在该房间的已读消息 ID POST /chat/message/read */
export async function markMessageRead(
  body: ChatAPI.ChatMessageReadRequest,
  options?: { [key: string]: any }
) {
  return request<ChatAPI.BaseResponseBoolean>("/chat/message/read", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 撤回消息 撤回指定消息（限时 2 分钟内） POST /chat/message/recall */
export async function recallMessage(
  body: ChatAPI.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<ChatAPI.BaseResponseBoolean>("/chat/message/recall", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 发送消息 向指定房间发送一条消息（支持文本、图片、文件） POST /chat/message/send */
export async function sendMessage(
  body: ChatAPI.ChatMessageSendRequest,
  options?: { [key: string]: any }
) {
  return request<ChatAPI.BaseResponseChatMessageVO>("/chat/message/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
