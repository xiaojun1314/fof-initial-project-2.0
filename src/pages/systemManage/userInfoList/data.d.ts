export interface UserInfoItem {
  id: string;
  userName: string;
  passWord: string;
  fullName: string;
  userCode: string;
  create_time: string;
}

export interface UserInfoPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface UserInfoData {
  list: UserInfoItem[];
  pagination: Partial<UserInfoPagination>;
}

export interface UserInfoParams {
  pageSize?: number;
  current?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
}
