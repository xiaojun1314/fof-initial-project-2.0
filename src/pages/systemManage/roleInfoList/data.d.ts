export interface RoleInfoItem {
  id: string;
  name: string;
  code: string;
  description: string;
  state: string;
  create_time: string;
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

export interface RoleInfoParams {
  pageSize?: number;
  current?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}

export interface RoleToUserParams {
  roleId: string;
  userIds: string[];
}

