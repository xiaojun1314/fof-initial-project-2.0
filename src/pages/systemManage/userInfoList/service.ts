import { request } from 'umi';

import { UserInfoItem, UserInfoParams } from './data.d';

export async function queryUserList(params?: UserInfoParams) {
  return request('/ultima/userManage/queryUserList', {
    method: 'POST',
    data: params,
  });
}

export async function removeUserInfo(params: { ids: string | any[] }) {
  return request('/ultima/userManage/removeUserInfo', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function saveUserInfo(params?: UserInfoItem) {
  return request('/ultima/userManage/saveUserInfo', {
    method: 'POST',
    data: {...params, method: 'save'},
  });
}

export async function checkUserName(params?: UserInfoParams) {
 return request('/ultima/userManage/checkUserName', {
    method: 'POST',
    data: {...params, method: 'save'},
  });
}


export async function editUserInfo(params?: UserInfoItem) {
  return request('/ultima/userManage/editUserInfo', {
    method: 'POST',
    data: {...params, method: 'save'},
  });
}


export async function checkUserCode(params?: UserInfoParams) {
  return request('/ultima/userManage/checkUserCode', {
    method: 'POST',
    data: {...params, method: 'save'},
  });
}

export async function resetUserInfo(params?: UserInfoItem) {
  return request('/ultima/userManage/resetUserInfo', {
    method: 'POST',
    data: {...params, method: 'save'},
  });
}
