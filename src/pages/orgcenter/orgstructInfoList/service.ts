import { request } from 'umi';
import type { TreeItem,TreeItemParams } from './data.d';

export async function queryOrgTreeInfo(params: { findType: string }) {
  return request('/ultima/orgManage/queryOrgTreeInfo', {
    method: 'POST',
    data: { ...params,method: 'save'},
  });
}

export async function queryOrgTreeById(params?: { id: any; type: any }) {
  return request('/ultima/orgManage/queryOrgTreeById', {
    method: 'POST',
    data: {
      ...params,
      method: 'save',
    },
  });
}

export async function saveCompanyInfo(params?: TreeItem) {
  return request('/ultima/companyManage/saveCompanyInfo', {
    method: 'POST',
    data: {
      ...params,
      method: 'save',
    },
  });
}

export async function checkCompanyCode(params?: TreeItem) {
  return request('/ultima/companyManage/checkCompanyCode', {
    method: 'POST',
    data: {
      ...params,
      method: 'save',
    },
  });
}

export async function editCompanyInfo(params?: TreeItem) {
  return request('/ultima/companyManage/editCompanyInfo', {
    method: 'POST',
    data: {
      ...params,
      method: 'save',
    },
  });
}


export async function saveSubCompanyInfo(params?: TreeItem) {
  return request('/ultima/subCompanyManage/saveSubCompanyInfo', {
    method: 'POST',
    data: {
      ...params,
      method: 'save',
    },
  });
}

export async function checkSubCompanyCode(params?: TreeItem) {
  return request('/ultima/subCompanyManage/checkSubCompanyCode', {
    method: 'POST',
    data: {
      ...params,
      method: 'save',
    },
  });
}


export async function editSubCompanyInfo(params?: TreeItem) {
  return request('/ultima/subCompanyManage/editSubCompanyInfo', {
    method: 'POST',
    data: {
      ...params,
      method: 'save',
    },
  });
}

export async function removeSubCompanyInfo(params: { ids: string | any[] }) {
  return request('/ultima/subCompanyManage/removeSubCompanyInfo', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function querySubCompanyList(params?: TreeItemParams) {
  return request('/ultima/subCompanyManage/querySubCompanyList', {
    method: 'POST',
    data: params,
  });
}


export async function saveDepartmentInfo(params?: TreeItem) {
  return request('/ultima/departmentManage/saveDepartmentInfo', {
    method: 'POST',
    data: {
      ...params,
      method: 'save',
    },
  });
}

export async function checkDepartmentCode(params?: TreeItem) {
  return request('/ultima/departmentManage/checkDepartmentCode', {
    method: 'POST',
    data: {
      ...params,
      method: 'save',
    },
  });
}


export async function editDepartmentInfo(params?: TreeItem) {
  return request('/ultima/departmentManage/editDepartmentInfo', {
    method: 'POST',
    data: {
      ...params,
      method: 'save',
    },
  });
}

export async function removeDepartmentInfo(params: { ids: string | any[] }) {
  return request('/ultima/departmentManage/removeDepartmentInfo', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function queryDepartPartList(params?: TreeItemParams) {
  return request('/ultima/departmentManage/queryDepartPartList', {
    method: 'POST',
    data: params,
  });
}

