import { request } from 'umi';
import { ModuleElementItem, ModuleElementParams } from './data.d';

export async function queryModuleTreeInfo() {
  return request('/ultima/moduleManage/queryModuleTreeInfo', {
    method: 'POST',
    data: { method: 'save' },
  });
}

export async function queryModuleElementList(params?: ModuleElementParams) {
  return request('/ultima/moduleElementManage/queryModuleElementList', {
    method: 'POST',
    data: params,
  });
}

export async function removeModuleElementInfo(params?: { ids: string | any[] }) {
  return request('/ultima/moduleElementManage/removeModuleElementInfo', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function saveModuleElementInfo(params?: ModuleElementItem) {
  return request('/ultima/moduleElementManage/saveModuleElementInfo', {
    method: 'POST',
    data: {...params, method: 'save'},
  });
}

export async function checkModuleElementCode(params?: ModuleElementParams) {
  return request('/ultima/moduleElementManage/checkModuleElementCode', {
    method: 'POST',
    data: {...params, method: 'save'},
  });
}

export async function editModuleElementInfo(params?: ModuleElementItem) {
  return request('/ultima/moduleElementManage/editModuleElementInfo', {
    method: 'POST',
    data: {...params, method: 'save'},
  });
}


