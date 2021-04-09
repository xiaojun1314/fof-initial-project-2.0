export interface DictionaryTypeItem extends Record{
  id: string;
  name: string;
  code: string;
  create_time: string;
}
export interface DictionaryTypeParams {
  pageSize?: number;
  current?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
}
