// @ts-ignore
/* eslint-disable */
import {request} from "@/services/request";

/** 批量发布通知 管理员向全员、特定角色或指定用户组批量下发实时通知 POST /notification/add */
export async function addNotification(
  body: NotificationAPI.NotificationAddRequest,
  options?: { [key: string]: any }
) {
  return request<NotificationAPI.BaseResponseListLong>("/notification/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 批量删除通知 批量删除选中的通知 POST /notification/batch/delete */
export async function batchDeleteNotification(
  body: NotificationAPI.NotificationBatchDeleteRequest,
  options?: { [key: string]: any }
) {
  return request<NotificationAPI.BaseResponseInteger>(
    "/notification/batch/delete",
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

/** 批量标记已读 批量将选中通知标记为已读 POST /notification/batch/read */
export async function batchMarkNotificationRead(
  body: NotificationAPI.NotificationBatchReadRequest,
  options?: { [key: string]: any }
) {
  return request<NotificationAPI.BaseResponseInteger>(
    "/notification/batch/read",
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

/** 删除通知 删除指定通知，仅本人或管理员可操作 POST /notification/delete */
export async function deleteNotification(
  body: NotificationAPI.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<NotificationAPI.BaseResponseBoolean>("/notification/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取通知详情 根据 ID 获取通知脱敏后的视图对象 GET /notification/get/vo */
export async function getNotificationVoById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: NotificationAPI.getNotificationVOByIdParams,
  options?: { [key: string]: any }
) {
  return request<NotificationAPI.BaseResponseNotificationVO>(
    "/notification/get/vo",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 分页获取通知列表（用于同步） 获取系统通知的完整记录分页列表，仅限管理员权限。 POST /notification/list/page */
export async function listNotificationByPage(
  body: NotificationAPI.NotificationQueryRequest,
  options?: { [key: string]: any }
) {
  return request<NotificationAPI.BaseResponsePageNotification>(
    "/notification/list/page",
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

/** 分页获取通知列表（封装类） 以脱敏视图形式分页获取通知列表，普通用户仅能查看自己的数据。 POST /notification/list/page/vo */
export async function listNotificationVoByPage(
  body: NotificationAPI.NotificationQueryRequest,
  options?: { [key: string]: any }
) {
  return request<NotificationAPI.BaseResponsePageNotificationVO>(
    "/notification/list/page/vo",
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

/** 获取当前用户的通知列表 分页检索当前登录用户收到的所有通知，包含关联的用户信息。 POST /notification/my/list/page/vo */
export async function listMyNotificationVoByPage(
  body: NotificationAPI.NotificationQueryRequest,
  options?: { [key: string]: any }
) {
  return request<NotificationAPI.BaseResponsePageNotificationVO>(
    "/notification/my/list/page/vo",
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

/** 标记已读 将指定通知标记为已读状态 POST /notification/read */
export async function markNotificationRead(
  body: NotificationAPI.NotificationReadRequest,
  options?: { [key: string]: any }
) {
  return request<NotificationAPI.BaseResponseBoolean>("/notification/read", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 全量已读 一键将当前用户名下的所有未读状态通知更新为已读状态 POST /notification/read/all */
export async function markAllNotificationRead(options?: {
  [key: string]: any;
}) {
  return request<NotificationAPI.BaseResponseBoolean>(
    "/notification/read/all",
    {
      method: "POST",
      ...(options || {}),
    }
  );
}

/** 获取未读通知数 获取当前用户未读通知的总数 GET /notification/unread/count */
export async function getNotificationUnreadCount(options?: {
  [key: string]: any;
}) {
  return request<NotificationAPI.BaseResponseLong>(
    "/notification/unread/count",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** 更新通知 更新指定通知，仅管理员可用 POST /notification/update */
export async function updateNotification(
  body: NotificationAPI.NotificationUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<NotificationAPI.BaseResponseBoolean>("/notification/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
