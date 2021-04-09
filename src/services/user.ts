import { request } from 'umi';

export async function query() {
  return request<API.CurrentUser[]>('/api/users');
}

export async function queryCurrent() {
  // return request<API.CurrentUser>('/api/currentUser');
  return request<{ data: API.CurrentUser }>('/ultima/initial/currentUser', {
    method: 'POST',
    requestType: 'form'
  });
}

export async function queryNotices(): Promise<any> {
  return request<{ data: API.NoticeIconData[] }>('/api/notices');
}
