export interface ModuleOperationItem {
  id: string;
  name: string;
  code: string;
  description: string;
  url: string;
  create_time: string;
  module_id: string;
  authority_id: string;
}

export interface ModuleOperationParams {
  pageSize?: number;
  current?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}
