import React, { useState } from 'react';
import { Modal, Button, message } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { UserInfoItem } from '@/pages/systemManage/userInfoList/data';
import { queryNoUserListByRole, saveRoleToUser } from '../service';
import styles from '@/pages/systemManage/roleInfoList/style.less';
import ProCard from '@ant-design/pro-card';


export interface WaitAllotUserListProps {
  visible: any;
  infoValue: any;
  handleCancelModal: any;
  actionRef: any;
}

const columns: ProColumns<UserInfoItem>[] = [
  { title: '用户名称', key: 'userName', dataIndex: 'userName', order: 3, sorter: true, width: '25%', ellipsis: true },
  { title: '用户编码', key: 'userCode', dataIndex: 'userCode', order: 2, sorter: true, width: '25%', ellipsis: true },
  { title: '用户全名', key: 'fullName', dataIndex: 'fullName', order: 1, sorter: true, width: '25%', ellipsis: true },
  { title: '创建时间', key: 'create_time', dataIndex: 'create_time', hideInSearch: true, width: '25%', ellipsis: true,valueType:"dateTime"},
];
 const WaitAllotUserListModal: React.FC<WaitAllotUserListProps> = (props) => {

   const [selectedRowsState, setSelectedRows] = useState<UserInfoItem[]>([]);

   const [btnDisabled, setBtnDisabled] = useState<boolean>(false);
   const { visible,handleCancelModal,infoValue,actionRef} = props;

   const handleSubmitModal = async () => {
     setBtnDisabled(true);
     const hide = message.loading('正在删除');
     if (selectedRowsState.length === 0) {
       message.warning('请选择用户信息');
       return true;
     }
     try {
       const params = { roleId: infoValue.id,userIds: selectedRowsState.map((row) => row.id)};
       await saveRoleToUser(params);
       hide();
       message.success('操作成功');
       return true;
     } catch (error) {
       hide();
       message.error('操作失败');
       return false;
     }finally{
       setSelectedRows([]);
       actionRef.current?.reloadAndRest?.();
       setBtnDisabled(false);
     }
   }

  return (
    <Modal
      title="待分配用户列表"
      centered
      visible={visible}
      width={1500}
      onCancel={handleCancelModal}
      destroyOnClose={true}
      className={styles.ModalContainer}
      footer={[
        <Button key="back" onClick={() => handleCancelModal()} disabled={btnDisabled}>取消</Button>,
        <Button key="submit" type="primary" disabled={btnDisabled} onClick={() => handleSubmitModal()}>提交</Button>,
      ]}
    >
    <ProCard >
      <ProTable<UserInfoItem>
        actionRef={actionRef}
        rowKey="id"
        params={{"roleId": infoValue.id}}
        request={async (params, sorter, filter) => {
          const { data } = await queryNoUserListByRole({...params, sorter, filter});
          actionRef.current?.clearSelected?.();
          return data;
        }}
        columns={columns}
        options={{ reload: true, density: false, setting: true, fullScreen: false }}
        search={{ labelWidth: 'auto'}}
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
    </ProCard>
    </Modal>
  );
};
 export default WaitAllotUserListModal;

