// @ts-ignore
/* eslint-disable */
import {request} from "@/services/request";

/** AI 对话 (标准) 发送问题并同步等待 AI 完整的文本回复 POST /ai/chat */
export async function doAiChat(
  body: AiAPI.AiChatRequest,
  options?: { [key: string]: any }
) {
  return request<AiAPI.BaseResponseAiChatResponse>("/ai/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** AI 对话 (流式) 发送问题并通过 SSE 获取 AI 实时、逐字下发的回答内容 POST /ai/chat/stream */
export async function doStreamAiChat(
  body: AiAPI.AiChatRequest,
  options?: { [key: string]: any }
) {
  return request<AiAPI.SseEmitter>("/ai/chat/stream", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取支持的模型列表 获取系统当前支持的所有 AI 模型及其描述 GET /ai/models */
export async function listModels(options?: { [key: string]: any }) {
  return request<AiAPI.BaseResponseListAiModelVO>("/ai/models", {
    method: "GET",
    ...(options || {}),
  });
}
