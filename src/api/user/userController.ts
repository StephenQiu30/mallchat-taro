// @ts-ignore
/* eslint-disable */
import { request } from "@/services/request";

/** 此处后端没有提供注释 POST /user/add */
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

/** 此处后端没有提供注释 POST /user/delete */
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

/** 此处后端没有提供注释 POST /user/edit */
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

/** 此处后端没有提供注释 GET /user/get */
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

/** 此处后端没有提供注释 GET /user/get/vo */
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

/** 此处后端没有提供注释 GET /user/get/vo/batch */
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

/** 此处后端没有提供注释 POST /user/list/page */
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

/** 此处后端没有提供注释 POST /user/list/page/vo */
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

/** 获取 GitHub 授权 URL 获取跳转到 GitHub 授权页面的 URL GET /user/login/github */
export async function getGitHubAuthorizeUrl(options?: { [key: string]: any }) {
  return request<UserAPI.BaseResponseString>("/user/login/github", {
    method: "GET",
    ...(options || {}),
  });
}

/** GitHub 登录 通过 GitHub 授权码进行登录或注册 POST /user/login/github */
export async function userLoginByGitHub(
  body: UserAPI.GitHubLoginRequest,
  options?: { [key: string]: any }
) {
  return request<UserAPI.BaseResponseLoginUserVO>("/user/login/github", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /user/login/github/callback */
export async function gitHubLoginCallback(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UserAPI.gitHubLoginCallbackParams,
  options?: { [key: string]: any }
) {
  return request<UserAPI.BaseResponseLoginUserVO>(
    "/user/login/github/callback",
    {
      method: "GET",
      params: {
        ...params,
        request: undefined,
        ...params["request"],
      },
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 GET /user/login/wx/qrcode */
export async function getWxLoginQrCode(options?: { [key: string]: any }) {
  return request<UserAPI.BaseResponseWxLoginResponse>("/user/login/wx/qrcode", {
    method: "GET",
    ...(options || {}),
  });
}

/** 检查微信登录状态 轮询检查微信扫码登录状态 GET /user/login/wx/status */
export async function checkWxLoginStatus(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UserAPI.checkWxLoginStatusParams,
  options?: { [key: string]: any }
) {
  return request<UserAPI.BaseResponseLoginUserVO>("/user/login/wx/status", {
    method: "GET",
    params: {
      ...params,
    },
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

/** 此处后端没有提供注释 POST /user/update */
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
