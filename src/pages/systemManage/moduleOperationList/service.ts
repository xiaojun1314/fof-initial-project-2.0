import { request } from 'umi';
import { ModuleOperationItem, ModuleOperationParams } from './data.d';

export async function queryModuleTreeInfo() {
  return request('/ultima/moduleManage/queryModuleTreeInfo', {
    method: 'POST',
    data: { method: 'save' },
  });
}

export async function queryModuleOperationList(params?: ModuleOperationParams) {
  return request('/ultima/moduleOperationManage/queryModuleOperationList', {
    method: 'POST',
    data: params,
  });
}

export async function removeModuleOperationInfo(params?: { ids: string | any[] }) {
  return request('/ultima/moduleOperationManage/removeModuleOperationInfo', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function saveModuleOperationInfo(params?: ModuleOperationItem) {
  return request('/ultima/moduleOperationManage/saveModuleOperationInfo', {
    method: 'POST',
    data: {...params, method: 'save'},
  });
}

export async function checkModuleOperationCode(params?: ModuleOperationItem) {
  return request('/ultima/moduleOperationManage/checkModuleOperationCode', {
    method: 'POST',
    data: {...params, method: 'save'},
  });
}

export async function editModuleOperationInfo(params?: ModuleOperationItem) {
  return request('/ultima/moduleOperationManage/editModuleOperationInfo', {
    method: 'POST',
    data: {...params, method: 'save'},
  });
}


