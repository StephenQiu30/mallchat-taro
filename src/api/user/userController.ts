// @ts-ignore
/* eslint-disable */
import {request} from "@/services/request";

/** 创建用户 管理员手动创建新用户 POST /user/add */
export async function addUser(
  body: UserAPI.UserAddRequest,
  options?: { [key: string]: any }
) {
  return request<UserAPI.BaseResponseLong>("/user/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除用户 删除指定 ID 的用户（仅本人或管理员） POST /user/delete */
export async function deleteUser(
  body: UserAPI.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<UserAPI.BaseResponseBoolean>("/user/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 编辑个人信息 当前登录用户编辑自己的个人资料 POST /user/edit */
export async function editUser(
  body: UserAPI.UserEditRequest,
  options?: { [key: string]: any }
) {
  return request<UserAPI.BaseResponseBoolean>("/user/edit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据ID获取用户 根据用户ID获取用户详细信息（仅管理员） GET /user/get */
export async function getUserById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UserAPI.getUserByIdParams,
  options?: { [key: string]: any }
) {
  return request<UserAPI.BaseResponseUser>("/user/get", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取当前登录用户 获取系统当前登录的用户信息 GET /user/get/login */
export async function getLoginUser(options?: { [key: string]: any }) {
  return request<UserAPI.BaseResponseLoginUserVO>("/user/get/login", {
    method: "GET",
    ...(options || {}),
  });
}

/** 根据ID获取用户视图对象 根据用户ID获取用户脱敏后的视图对象 GET /user/get/vo */
export async function getUserVoById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UserAPI.getUserVOByIdParams,
  options?: { [key: string]: any }
) {
  return request<UserAPI.BaseResponseUserVO>("/user/get/vo", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 批量获取用户视图对象 根据用户ID列表批量获取用户脱敏后的视图对象 GET /user/get/vo/batch */
export async function getUserVoByIds(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UserAPI.getUserVOByIdsParams,
  options?: { [key: string]: any }
) {
  return request<UserAPI.BaseResponseListUserVO>("/user/get/vo/batch", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 是否管理员 返回当前登录用户是否为管理员 GET /user/is/admin */
export async function isAdmin(options?: { [key: string]: any }) {
  return request<UserAPI.BaseResponseBoolean>("/user/is/admin", {
    method: "GET",
    ...(options || {}),
  });
}

/** 分页获取用户列表 管理员分页查询原始用户信息 POST /user/list/page */
export async function listUserByPage(
  body: UserAPI.UserQueryRequest,
  options?: { [key: string]: any }
) {
  return request<UserAPI.BaseResponsePageUser>("/user/list/page", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 分页获取用户封装列表 分页获取脱敏后的用户信息列表 POST /user/list/page/vo */
export async function listUserVoByPage(
  body: UserAPI.UserQueryRequest,
  options?: { [key: string]: any }
) {
  return request<UserAPI.BaseResponsePageUserVO>("/user/list/page/vo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 微信 App 登录 通过微信 App code 进行登录或注册 POST /user/login/app */
export async function userLoginByApp(
  body: UserAPI.UserAppLoginRequest,
  options?: { [key: string]: any }
) {
  return request<UserAPI.BaseResponseLoginUserVO>("/user/login/app", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** Apple 登录 通过 Apple 授权信息进行登录或注册 POST /user/login/apple */
export async function userLoginByApple(
  body: UserAPI.UserAppleLoginRequest,
  options?: { [key: string]: any }
) {
  return request<UserAPI.BaseResponseLoginUserVO>("/user/login/apple", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 邮箱登录 通过邮箱和验证码进行登录或注册 POST /user/login/email */
export async function userLoginByEmail(
  body: UserAPI.UserEmailLoginRequest,
  options?: { [key: string]: any }
) {
  return request<UserAPI.BaseResponseLoginUserVO>("/user/login/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 发送邮箱验证码 向指定邮箱发送 6 位数登录验证码 POST /user/login/email/code */
export async function sendEmailCode(
  body: UserAPI.UserEmailCodeRequest,
  options?: { [key: string]: any }
) {
  return request<UserAPI.BaseResponseBoolean>("/user/login/email/code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 微信小程序登录 通过微信小程序 code 进行登录或注册 POST /user/login/ma */
export async function userLoginByMa(
  body: UserAPI.UserMaLoginRequest,
  options?: { [key: string]: any }
) {
  return request<UserAPI.BaseResponseLoginUserVO>("/user/login/ma", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 用户注销 退出当前登录状态 POST /user/logout */
export async function userLogout(options?: { [key: string]: any }) {
  return request<UserAPI.BaseResponseBoolean>("/user/logout", {
    method: "POST",
    ...(options || {}),
  });
}

/** 更新用户 管理员后台更新用户信息 POST /user/update */
export async function updateUser(
  body: UserAPI.UserUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<UserAPI.BaseResponseBoolean>("/user/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
