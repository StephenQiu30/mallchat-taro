import { request } from "@/services/request";

/**
 * 微信小程序登录
 * @param body 
 * @returns 
 */
export async function userLoginByWxMp(
  body: { code: string },
  options?: { [key: string]: any }
) {
  return request<UserAPI.BaseResponseLoginUserVO>("/user/login/wx_mp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
