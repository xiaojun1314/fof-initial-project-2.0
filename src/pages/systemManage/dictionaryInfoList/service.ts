import { request } from 'umi';
import type { DictionaryInfoParams } from './data.d';
import { DictionaryInfoItem } from './data.d';

export async function queryDictionaryInfoList(params?: DictionaryInfoParams) {
  return request('/ultima/dictionaryInfoManage/queryDictionaryInfoList', {
    method: 'POST',
    data: params,
  });
}

export async function removeDictionaryInfo(params: { ids: string | any[] }) {
  return request('/ultima/dictionaryInfoManage/removeDictionaryInfo', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function saveDictionaryInfo(params?: DictionaryInfoItem) {
  return request('/ultima/dictionaryInfoManage/saveDictionaryInfo', {
    method: 'POST',
    data: {...params, method: 'save'},
  });
}

export async function editDictionaryInfo(params?: DictionaryInfoItem) {
  return request('/ultima/dictionaryInfoManage/editDictionaryInfo', {
    method: 'POST',
    data: {...params, method: 'save'},
  });
}


export async function checkDictionaryInfoCode(params?: DictionaryInfoParams) {
  return request('/ultima/dictionaryInfoManage/checkDictionaryInfoCode', {
    method: 'POST',
    data: {...params, method: 'save'},
  });
}

