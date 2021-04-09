
export interface AuthorityInfoItem extends Record{
  id: string;
  type: string;
  typeText: string;
  name: string;
  code: string;
  create_time: string;
}
export interface AuthorityInfoParams {
  pageSize?: number;
  current?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
}
