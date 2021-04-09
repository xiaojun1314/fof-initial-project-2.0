import { request } from 'umi';

export async function getDictionaryInfoByKeyFlag(params?: any) {
  return request('/ultima/dictionaryInfoManage/getDictionaryInfoByKeyFlag', {
    method: 'POST',
    data: params,
  });
}
