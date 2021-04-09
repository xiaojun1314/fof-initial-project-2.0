import { request } from 'umi';
import type { DictionaryTypeParams,DictionaryTypeItem } from './data.d';

export async function queryDictionaryTypeList(params?: DictionaryTypeParams) {
  return request('/ultima/dictionaryTypeManage/queryDictionaryTypeList', {
    method: 'POST',
    data: params,
  });
}

export async function removeDictionaryType(params: { ids: string | any[] }) {
  return request('/ultima/dictionaryTypeManage/removeDictionaryType', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function saveDictionaryType(params?: DictionaryTypeItem) {
  return request('/ultima/dictionaryTypeManage/saveDictionaryType', {
    method: 'POST',
    data: {...params, method: 'save'},
  });
}

export async function editDictionaryType(params?: DictionaryTypeItem) {
  return request('/ultima/dictionaryTypeManage/editDictionaryType', {
    method: 'POST',
    data: {...params, method: 'save'},
  });
}


export async function checkDictionaryTypeCode(params?: DictionaryTypeParams) {
  return request('/ultima/dictionaryTypeManage/checkDictionaryTypeCode', {
    method: 'POST',
    data: {...params, method: 'save'},
  });
}

