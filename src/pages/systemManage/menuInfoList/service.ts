import { request } from 'umi';

export async function queryMenuTreeInfo() {
  return request('/ultima/menuManage/queryMenuTreeInfo', {
    method: 'POST',
    data: { method: 'save'},
  });
}

export async function queryMenuInfoById(params?: { id: any }) {
  return request('/ultima/menuManage/queryMenuInfoById', {
    method: 'POST',
    data: {
      ...params,
      method: 'save',
    },
  });
}


export async function saveMenuInfo(params?: any) {
  return request('/ultima/menuManage/saveMenuInfo', {
    method: 'POST',
    data: {
      ...params,
      method: 'save',
    },
  });
}

export async function editMenuInfo(params?: any) {
  return request('/ultima/menuManage/editMenuInfo', {
    method: 'POST',
    data: {
      ...params,
      method: 'save',
    },
  });
}


export async function removeMenuInfo(params: { id: string }) {
  return request('/ultima/menuManage/removeMenuInfo', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}
