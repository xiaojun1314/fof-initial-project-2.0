import React, { useRef, useState } from 'react';
import { Modal, Button, message } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import WaitAllotUserListModal from './WaitAllotUserListModal';
import { UserInfoItem } from '@/pages/systemManage/userInfoList/data';
import { queryUserListByRole, removeRoleToUser } from '../service';
import { PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import styles from '@/pages/systemManage/roleInfoList/style.less';
import ProCard from '@ant-design/pro-card';

export interface RoleToUserListProps {
  visible: any;
  infoValue: any;
  handleCancelModal: any;
  actionRef: any;
}

const columns: ProColumns<UserInfoItem>[] = [
  { title: '用户名称', key: 'userName', dataIndex: 'userName', order: 3, sorter: true, width: '25%', ellipsis: true },
  { title: '用户编码', key: 'userCode', dataIndex: 'userCode', order: 2, sorter: true, width: '25%', ellipsis: true },
  { title: '用户全名', key: 'fullName', dataIndex: 'fullName', order: 1, sorter: true, width: '25%', ellipsis: true },
  { title: '创建时间', key: 'create_time', dataIndex: 'create_time', hideInSearch: true, width: '25%', ellipsis: true,valueType:"dateTime"}
];

 const RoleToUserListModal: React.FC<RoleToUserListProps> = (props) => {

   const [selectedRowsState, setSelectedRows] = useState<UserInfoItem[]>([]);

   const [waitAllotUserVisible, setWaitAllotUserVisible] = useState(false);

   const { visible,handleCancelModal,infoValue,actionRef} = props;

   const [btnDisabled, setBtnDisabled] = useState<boolean>(false);

   const waitAllotUserActionRef = useRef<ActionType>();


   const handleCancelWaitAllotUserListModal = () => {
     actionRef.current?.reload?.();
     setWaitAllotUserVisible(false);
   };

   const createMethods = {
     handleCancelModal: handleCancelWaitAllotUserListModal,
   };

   const handleShowWaitAllotUserModal = ()=> {
     setWaitAllotUserVisible(true);
     waitAllotUserActionRef.current?.reload?.();
   };

   const handleRemoveRoleToUser = async (ids: string | any[]) => {
     setBtnDisabled(true);
     const hide = message.loading('正在删除');
     if (ids.length === 0) {
       message.warning('请选择需要移除信息');
       return true;
     }
     try {
       const params = { roleId: infoValue.id,userIds: ids};
       await removeRoleToUser(params);
       hide();
       message.success('操作成功');
       return true;
     } catch (error) {
       hide();
       message.error('删除失败，请重试');
       return false;
     }finally{
       setSelectedRows([]);
       actionRef.current?.reloadAndRest?.();
       setBtnDisabled(false);
     }
   };


   const handleRemoveRoleToUserClick= (ids: string | any[]) => {
     if(ids.length===0){
       message.error("请选择需要移除用户信息");
     }else{
       Modal.confirm({
         title: '删除信息',
         content: '确定删除该信息吗？',
         icon: <ExclamationCircleOutlined />,
         okText: '确认',
         okButtonProps: {disabled:btnDisabled},
         cancelText: '取消',
         onOk:()=>handleRemoveRoleToUser(ids),
       });
     }
   }

  return (
    <Modal
      title="已分配用户列表"
      style={{ top: 100 }}
      visible={visible}
      width={1500}
      onCancel={handleCancelModal}
      destroyOnClose={true}
      className={styles.ModalContainer}
      maskClosable={false}
    >
    <ProCard >
      <ProTable<UserInfoItem>
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={(action, { selectedRows }) => [
          <Button type="primary" onClick={() => handleShowWaitAllotUserModal()}><PlusOutlined/>新增</Button>,
          selectedRows && selectedRows.length > 0 && (<Button key="delete" disabled={btnDisabled} onClick={() => handleRemoveRoleToUserClick(selectedRowsState.map((row) => row.id))}><DeleteOutlined />移除</Button>)
        ]}
        params={{"roleId": infoValue.id}}
        request={async (params, sorter, filter) => {
          const { data } = await queryUserListByRole({...params, sorter, filter});
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
    <WaitAllotUserListModal
      {...createMethods}
      visible={waitAllotUserVisible}
      infoValue={infoValue}
      actionRef={waitAllotUserActionRef}
    />
    </Modal>
  );
};
 export default RoleToUserListModal;

