// @ts-ignore
/* eslint-disable */
import {request} from "@/services/request";

/** 上传文件 上传文件到腾讯云 COS，支持用户头像、聊天图片、聊天文件等业务类型 POST /file/upload */
export async function uploadFile(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: FileAPI.uploadFileParams,
  body: {},
  options?: { [key: string]: any }
) {
  return request<FileAPI.BaseResponseFileVO>("/file/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    params: {
      ...params,
    },
    data: body,
    ...(options || {}),
  });
}
