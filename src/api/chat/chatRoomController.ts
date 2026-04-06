// @ts-ignore
/* eslint-disable */
import { request } from "@/services/request";

/** 创建聊天室 创建一个新的聊天室（群聊或私聊） POST /chat_room/add */
export async function addChatRoom(
  body: ChatAPI.ChatRoomAddRequest,
  options?: { [key: string]: any }
) {
  return request<ChatAPI.BaseResponseLong>("/chat_room/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 加入聊天室 将当前用户加入到指定的聊天室 POST /chat_room/join */
export async function joinChatRoom(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: ChatAPI.joinChatRoomParams,
  options?: { [key: string]: any }
) {
  return request<ChatAPI.BaseResponseBoolean>("/chat_room/join", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取当前用户的聊天室列表 获取当前登录用户参与的所有聊天室 GET /chat_room/list/vo */
export async function listUserChatRooms(options?: { [key: string]: any }) {
  return request<ChatAPI.BaseResponseListChatRoomVO>("/chat_room/list/vo", {
    method: "GET",
    ...(options || {}),
  });
}

/** 获取或创建私聊房间 与好友建立唯一私聊会话 POST /chat_room/private */
export async function getOrCreatePrivateRoom(
  body: ChatAPI.ChatPrivateRoomRequest,
  options?: { [key: string]: any }
) {
  return request<ChatAPI.BaseResponseLong>("/chat_room/private", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
