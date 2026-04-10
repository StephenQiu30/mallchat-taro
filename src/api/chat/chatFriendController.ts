// @ts-ignore
/* eslint-disable */
import {request} from "@/services/request";

/** 直接添加好友 跳过申请直接与指定用户建立双向好友关系（通常用于系统加好友或测试） POST /chat/friend/add */
export async function addFriend(
  body: ChatAPI.ChatFriendAddRequest,
  options?: { [key: string]: any }
) {
  return request<ChatAPI.BaseResponseBoolean>("/chat/friend/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 我的好友列表 获取当前登录用户的所有好友基本信息（昵称、头像） GET /chat/friend/list/vo */
export async function listFriends(options?: { [key: string]: any }) {
  return request<ChatAPI.BaseResponseListChatFriendUserVO>(
    "/chat/friend/list/vo",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}
