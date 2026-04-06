// @ts-ignore
/* eslint-disable */
import { request } from "@/services/request";

/** 添加好友 与指定用户建立好友关系 POST /chat_friend/add */
export async function addFriend(
  body: ChatAPI.ChatFriendAddRequest,
  options?: { [key: string]: any }
) {
  return request<ChatAPI.BaseResponseBoolean>("/chat_friend/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 好友列表 获取当前用户的好友简要信息 GET /chat_friend/list/vo */
export async function listFriends(options?: { [key: string]: any }) {
  return request<ChatAPI.BaseResponseListChatFriendUserVO>(
    "/chat_friend/list/vo",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}
