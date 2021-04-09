import React from 'react';
import { queryDepartPartList } from '../service';
import type { TreeItem } from '../data.d';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';

export interface SubCompanyProps {
  treeValue: any;
  actionRef: any;
  setSelectedRows: any;
}

const DepartmentList: React.FC<SubCompanyProps> = (props) => {

  const columns: ProColumns<TreeItem>[] = [
    { title: '部门名称', key: 'name', dataIndex: 'name', order: 3, sorter: true, width: '20%', ellipsis: true },
    { title: '部门编码', key: 'code', dataIndex: 'code', order: 2, sorter: true, width: '20%', ellipsis: true },
    { title: '描述', key: 'description', dataIndex: 'description', order: 1, sorter: true, width: '20%', ellipsis: true },
    { title: '序号', key: 'order_no', dataIndex: 'order_no', hideInSearch: true, sorter: true, width: '20%', ellipsis: true},
  ];
  const { treeValue,actionRef,setSelectedRows } = props;

  return (
    <ProTable<TreeItem>
      headerTitle="部门列表"
      actionRef={actionRef}
      rowKey="id"
      params={{"id": treeValue.id}}
      request={async (params, sorter, filter) => {
        const { data }= await queryDepartPartList({ ...params, sorter, filter});
        actionRef.current?.clearSelected?.();
        return data;
      }}
      columns={columns}
      options={{ reload: true, density: false, setting: true, fullScreen: false }}
      search={{ labelWidth: 'auto' }}
      pagination={{
        pageSize: 5,
        showQuickJumper: true, // 显示页码跳转器
        showSizeChanger: true, // 显示条数改变器
      }}
      rowSelection={{
        onChange: (_, selectedRows: any []) => setSelectedRows(selectedRows),
      }}
      tableAlertRender={false}
      size='small'
    />
  );
};

export default DepartmentList;
