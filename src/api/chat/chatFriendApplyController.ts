// @ts-ignore
/* eslint-disable */
import {request} from "@/services/request";

/** 申请好友 向目标用户发起好友添加申请 POST /chat/friend/apply/add */
export async function applyFriend(
  body: ChatAPI.ChatFriendApplyRequest,
  options?: { [key: string]: any }
) {
  return request<ChatAPI.BaseResponseLong>("/chat/friend/apply/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 审核好友 同意或拒绝好友申请，同意后将自动建立双向好友关系并创建私聊房间 POST /chat/friend/apply/approve */
export async function approveFriend(
  body: ChatAPI.ChatFriendApproveRequest,
  options?: { [key: string]: any }
) {
  return request<ChatAPI.BaseResponseBoolean>("/chat/friend/apply/approve", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 好友申请列表 获取当前收到的好友申请记录 POST /chat/friend/apply/list/page/vo */
export async function listFriendApply(
  body: ChatAPI.ChatFriendApplyQueryRequest,
  options?: { [key: string]: any }
) {
  return request<ChatAPI.BaseResponsePageChatFriendApplyVO>(
    "/chat/friend/apply/list/page/vo",
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
