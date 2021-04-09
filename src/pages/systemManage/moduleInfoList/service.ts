import { request } from 'umi';

export async function queryModuleTreeInfo() {
  return request('/ultima/moduleManage/queryModuleTreeInfo', {
    method: 'POST',
    data: { method: 'save'},
  });
}

export async function queryModuleInfoById(params?: { id: any }) {
  return request('/ultima/moduleManage/queryModuleInfoById', {
    method: 'POST',
    data: {
      ...params,
      method: 'save',
    },
  });
}


export async function saveModuleInfo(params?: any) {
  return request('/ultima/moduleManage/saveModuleInfo', {
    method: 'POST',
    data: {
      ...params,
      method: 'save',
    },
  });
}

export async function editModuleInfo(params?: any) {
  return request('/ultima/moduleManage/editModuleInfo', {
    method: 'POST',
    data: {
      ...params,
      method: 'save',
    },
  });
}


export async function removeModuleInfo(params: { id: string }) {
  return request('/ultima/moduleManage/removeModuleInfo', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}
