import { request } from 'umi';

import { JobAndTriggerInfoParams,JobAndTriggerInfoItem } from './data.d';

export async function queryJobAndTriggerList(params?: JobAndTriggerInfoParams) {
  return request('/ultima/jobAndTriggerManage/queryJobAndTriggerList', {
    method: 'POST',
    data: params,
  });
}

export async function queryJobAndTriggerCountInfo() {
  return request('/ultima/jobAndTriggerManage/queryJobAndTriggerCountInfo', {
    method: 'POST',
  });
}


export async function removeJobAndTriggerInfo(params: any) {
  return request('/ultima/jobAndTriggerManage/removeJobAndTriggerInfo', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function saveJobAndTriggerInfo(params?: JobAndTriggerInfoItem) {
  return request('/ultima/jobAndTriggerManage/saveJobAndTriggerInfo', {
    method: 'POST',
    data: {...params, method: 'save'},
  });
}

export async function editJobAndTriggerInfo(params?: JobAndTriggerInfoItem) {
  return request('/ultima/jobAndTriggerManage/editJobAndTriggerInfo', {
    method: 'POST',
    data: {...params, method: 'save'},
  });
}


export async function checkJobName(params?: JobAndTriggerInfoParams) {
  return request('/ultima/jobAndTriggerManage/checkJobName', {
    method: 'POST',
    data: {...params, method: 'save'},
  });
}

export async function checkJobClassName(params?: JobAndTriggerInfoParams) {
  return request('/ultima/jobAndTriggerManage/checkJobClassName', {
    method: 'POST',
    data: {...params, method: 'save'},
  });
}
