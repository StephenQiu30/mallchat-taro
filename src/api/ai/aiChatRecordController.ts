// @ts-ignore
/* eslint-disable */
import { request } from "@/services/request";

/** 删除对话记录 根据 ID 删除指定的对话记录，仅本人可删除 POST /ai/record/delete */
export async function deleteAiChatRecord(
  body: AiAPI.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<AiAPI.BaseResponseBoolean>("/ai/record/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 分页获取我的对话记录 获取当前登录用户的历史 AI 对话记录，支持分页 POST /ai/record/my/list/page/vo */
export async function listMyAiChatRecordVoByPage(
  body: AiAPI.AiChatRecordQueryRequest,
  options?: { [key: string]: any }
) {
  return request<AiAPI.BaseResponsePageAiChatRecordVO>(
    "/ai/record/my/list/page/vo",
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
