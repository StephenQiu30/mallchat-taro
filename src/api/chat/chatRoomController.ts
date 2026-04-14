// @ts-ignore
/* eslint-disable */
import {request} from "@/services/request";

/** 创建群聊 创建一个新的群聊并初始化成员 POST /chat/room/add */
export async function addChatRoom(
  body: ChatAPI.ChatRoomAddRequest,
  options?: { [key: string]: any }
) {
  return request<ChatAPI.BaseResponseLong>("/chat/room/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取房间详情 获取群聊或私聊详情 GET /chat/room/detail */
export async function getRoomDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: ChatAPI.getRoomDetailParams,
  options?: { [key: string]: any }
) {
  return request<ChatAPI.BaseResponseChatRoomVO>("/chat/room/detail", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 解散群聊 群主解散指定群聊 POST /chat/room/dismiss */
export async function dismissRoom(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: ChatAPI.dismissRoomParams,
  options?: { [key: string]: any }
) {
  return request<ChatAPI.BaseResponseBoolean>("/chat/room/dismiss", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 邀请成员入群 邀请自己的好友加入指定群聊 POST /chat/room/invite */
export async function inviteMembers(
  body: ChatAPI.ChatRoomInviteRequest,
  options?: { [key: string]: any }
) {
  return request<ChatAPI.BaseResponseBoolean>("/chat/room/invite", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 加入聊天室 将当前用户加入到指定的聊天室 POST /chat/room/join */
export async function joinChatRoom(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: ChatAPI.joinChatRoomParams,
  options?: { [key: string]: any }
) {
  return request<ChatAPI.BaseResponseBoolean>("/chat/room/join", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取当前用户的聊天室列表 获取当前登录用户参与的所有聊天室 GET /chat/room/list/vo */
export async function listUserChatRooms(options?: { [key: string]: any }) {
  return request<ChatAPI.BaseResponseListChatRoomVO>("/chat/room/list/vo", {
    method: "GET",
    ...(options || {}),
  });
}

/** 获取房间成员 获取指定房间的成员列表 GET /chat/room/member/list */
export async function listRoomMembers(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: ChatAPI.listRoomMembersParams,
  options?: { [key: string]: any }
) {
  return request<ChatAPI.BaseResponseListChatRoomMemberVO>(
    "/chat/room/member/list",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 获取或创建私聊房间 获取与指定好友的唯一私聊房间，若不存在则初始化（UnionID 级别唯一） POST /chat/room/private */
export async function getOrCreatePrivateRoom(
  body: ChatAPI.ChatPrivateRoomRequest,
  options?: { [key: string]: any }
) {
  return request<ChatAPI.BaseResponseLong>("/chat/room/private", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 退出群聊 当前用户退出指定群聊 POST /chat/room/quit */
export async function quitRoom(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: ChatAPI.quitRoomParams,
  options?: { [key: string]: any }
) {
  return request<ChatAPI.BaseResponseBoolean>("/chat/room/quit", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
