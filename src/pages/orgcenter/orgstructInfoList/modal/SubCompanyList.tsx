import React from 'react';
import { querySubCompanyList } from '../service';
import type { TreeItem } from '../data.d';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';

export interface SubCompanyProps {
  treeValue: any;
  actionRef: any;
  setSelectedRows: any;
}

const SubCompanyList: React.FC<SubCompanyProps> = (props) => {

  const columns: ProColumns<TreeItem>[] = [
    { title: '分部名称', key: 'name', dataIndex: 'name', order: 3, sorter: true, width: '20%', ellipsis: true },
    { title: '分部编码', key: 'code', dataIndex: 'code', order: 2, sorter: true, width: '20%', ellipsis: true },
    { title: '描述', key: 'description', dataIndex: 'description', order: 1, sorter: true, width: '20%', ellipsis: true },
    { title: '序号', key: 'order_no', dataIndex: 'order_no', hideInSearch: true, sorter: true, width: '20%', ellipsis: true},
    { title: '角色数量', key: 'roleCount', dataIndex: 'roleCount', hideInSearch: true, sorter: true, width: '20%', ellipsis: true},
    { title: '部门数量', key: 'departmentCount', dataIndex: 'departmentCount', hideInSearch: true, sorter: true, width: '20%', ellipsis: true},
  ];
  const { treeValue,actionRef,setSelectedRows } = props;

  const rowSelection = {
    getCheckboxProps: (record: TreeItem) => ({
      disabled: (record.roleCount>0 || record.roleCount>0),
    }),
  };
  return (
    <ProTable<TreeItem>
      headerTitle="分部列表"
      actionRef={actionRef}
      rowKey="id"
      params={{"foreignId": treeValue.id}}
      request={async (params, sorter, filter) => {
        const { data }= await querySubCompanyList({ ...params, sorter, filter});
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
        ...rowSelection,
      }}
      tableAlertRender={false}
      size='small'
    />
  );
};

export default SubCompanyList;
