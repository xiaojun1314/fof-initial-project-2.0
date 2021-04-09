export interface TreeItem extends Record{
  id: any;
  foreignId: any;
  name: any;
  code: any;
  description: any;
  order_no: any;
  create_time: any;
  parent_id: any;
  roleCount: any;
  departmentCount: any;

}

export interface TreeBreadcrumbItem extends Record {
  oneLevel: string;
  twoLevel: string;
  threeLevel: string;
  fourLevel: string;
}


export interface TreeItemParams {
  pageSize?: number;
  current?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
}



export interface CompanyItem extends Record{
  id: string;
  name: string;
  code: string;
  description: string;
  order_no: string;
  create_time: string;
}




export interface SubCompanyItem extends Record{
  id: string;
  name: string;
  code: string;
  description: string;
  order_no: string;
  create_time: string;
}

export interface DepartmentItem extends Record{
  id: string;
  foreignId: string;
  name: string;
  code: string;
  description: string;
  order_no: string;
  parent_id: string;
  create_time: string;
}



export interface SubCompanyParams {
  pageSize?: number;
  current?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
}
