import { request } from 'umi';

import { AuthorityInfoParams } from './data.d';

export async function queryAuthorityList(params?: AuthorityInfoParams) {
  return request('/ultima/authorityManage/queryAuthorityList', {
    method: 'POST',
    data: params,
  });
}

export async function queryAuthorityCountInfo() {
  return request('/ultima/authorityManage/queryAuthorityCountInfo', {
    method: 'POST',
  });
}
