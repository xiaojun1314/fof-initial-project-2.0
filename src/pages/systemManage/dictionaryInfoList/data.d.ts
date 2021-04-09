export interface DictionaryInfoItem extends Record{
  id: string;
  typeCode: string;
  name: string;
  code: string;
  create_time: string;
}

export interface DictionaryInfoParams {
  pageSize?: number;
  current?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
}
