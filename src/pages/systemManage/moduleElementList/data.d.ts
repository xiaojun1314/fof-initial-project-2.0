export interface ModuleElementItem {
  id: string;
  name: string;
  code: string;
  type: string;
  state: string;
  description: string;
  create_time: string;
  module_id: string;
  authority_id: string;
}

export interface RoleInfoPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface RoleInfoData {
  list: RoleInfoItem[];
  pagination: Partial<RoleInfoPagination>;
}

export interface ModuleElementParams {
  pageSize?: number;
  current?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}

export interface RoleToUserParams {
  roleId: string;
  userIds: string[];
}

