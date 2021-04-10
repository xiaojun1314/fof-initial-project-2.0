import { request } from 'umi';

import { RoleInfoParams,RoleToUserParams,RoleInfoItem } from './data.d';

export async function queryRoleList(params?: RoleInfoParams) {
  return request('/ultima/roleManage/queryRoleList', {
    method: 'POST',
    data: params,
  });
}

export async function removeRoleInfo(params?: { ids: string | any[] }) {
  return request('/ultima/roleManage/removeRoleInfo', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function saveRoleInfo(params?: RoleInfoItem) {
  return request('/ultima/roleManage/saveRoleInfo', {
    method: 'POST',
    data: {...params, method: 'save'},
  });
}

export async function checkRoleCode(params?: RoleInfoParams) {
  return request('/ultima/roleManage/checkRoleCode', {
    method: 'POST',
    data: {...params, method: 'save'},
  });
}


export async function editRoleInfo(params?: RoleInfoItem) {
  return request('/ultima/roleManage/editRoleInfo', {
    method: 'POST',
    data: {...params, method: 'save'},
  });
}


export async function checkUserCode(params?: RoleInfoParams) {
  return request('/ultima/roleManage/checkUserCode', {
    method: 'POST',
    data: {...params, method: 'save'},
  });
}


export async function queryOrgTreeInfo(params: { findType: string }) {
  return request('/ultima/orgManage/queryOrgTreeInfo', {
    method: 'POST',
    data: {
      ...params,
      method: 'save',
    },
  });
}

export async function queryUserListByRole(params?: RoleInfoParams) {
  return request('/ultima/userManage/queryUserListByRole', {
    method: 'POST',
    data: { ...params, method: 'save'},
  });
}

export async function queryNoUserListByRole(params?: RoleInfoParams) {
  return request('/ultima/userManage/queryNoUserListByRole', {
    method: 'POST',
    data: { ...params, method: 'save'},
  });
}

export async function saveRoleToUser(params?: RoleToUserParams) {
  return request('/ultima/roleManage/saveRoleToUser', {
    method: 'POST',
    data: {...params, method: 'save'},
  });
}

export async function removeRoleToUser(params?: { roleId: any; userIds: string | any[] }) {
  return request('/ultima/roleManage/removeRoleAndUser', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function queryMenuTreeInfo() {
  return request('/ultima/menuManage/queryMenuTreeInfo', {
    method: 'POST',
    data: { method: 'save'},
  });
}

export async function getMenuIdsByRoleId(params: { roleId: string; }) {
  return request('/ultima/menuManage/getMenuIdsByRoleId', {
    method: 'POST',
    data: { ...params, method: 'save' },
  });
}

export async function saveRoleAndMenuAndAuthInfo(params: { menuIds: any; role_id: any; }) {
  return request('/ultima/roleManage/saveRoleAndMenuAndAuthInfo', {
    method: 'POST',
    data: { ...params, method: 'save' },
  });
}

export async function getModuleElementInfoByRole(params: { role_id: any; }) {
  return request('/ultima/moduleElementManage/getModuleElementInfoByRole', {
    method: 'POST',
    data: { ...params, method: 'save' },
  });
}

export async function saveRoleAndMoudleElementAndAuthInfo(params: { moduleElementIds: any; role_id: any; }) {
  return request('/ultima/roleManage/saveRoleAndMoudleElementAndAuthInfo', {
    method: 'POST',
    data: { ...params, method: 'save' },
  });
}


export async function getModuleOperationInfoByRole(params: { role_id: any; }) {
  return request('/ultima/moduleOperationManage/getModuleOperationInfoByRole', {
    method: 'POST',
    data: { ...params, method: 'save' },
  });
}

export async function saveRoleAndMoudleOperationAndAuthInfo(params: { moduleOperationIds: any; role_id: any; }) {
  return request('/ultima/roleManage/saveRoleAndMoudleOperationAndAuthInfo', {
    method: 'POST',
    data: { ...params, method: 'save' },
  });
}
