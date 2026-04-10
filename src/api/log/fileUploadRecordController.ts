// @ts-ignore
/* eslint-disable */
import {request} from "@/services/request";

/** 创建文件上传记录 记录文件上传信息 POST /log/file/upload/add */
export async function addFileUploadRecord(
  body: LogAPI.FileUploadRecordAddRequest,
  options?: { [key: string]: any }
) {
  return request<LogAPI.BaseResponseBoolean>("/log/file/upload/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除文件上传记录 删除指定文件上传记录（仅管理员） POST /log/file/upload/delete */
export async function deleteFileUploadRecord(
  body: LogAPI.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<LogAPI.BaseResponseBoolean>("/log/file/upload/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 分页获取文件上传记录列表 分页查询文件上传记录（仅管理员） POST /log/file/upload/list/page */
export async function listRecordByPage(
  body: LogAPI.FileUploadRecordQueryRequest,
  options?: { [key: string]: any }
) {
  return request<LogAPI.BaseResponsePageFileUploadRecordVO>(
    "/log/file/upload/list/page",
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
