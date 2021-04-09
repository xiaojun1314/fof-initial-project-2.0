import { request } from 'umi';

export async function getMenuList() {
  return request<API.httpRule>('/ultima/routingManage/getRouting',{
    method:'POST',
  });
}
