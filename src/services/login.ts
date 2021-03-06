import { request } from 'umi';

export interface LoginParamsType {
  userName: string;
  passWord: string;
  mobile: string;
  captcha: string;
  type: string;
}

export async function fakeAccountLogin(params: API.LoginParams) {
  return request<API.LoginStateType>('/ultima/login', {
    method: 'POST',
    data: params,
    requestType: 'form'
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function outLogin() {
  return request('/ultima/logout');
}
