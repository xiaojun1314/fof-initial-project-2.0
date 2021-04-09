import React, { useState, useRef,Fragment } from 'react';
import { Card, Button, message, Dropdown, Menu, Modal } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined, EditOutlined, DeleteOutlined, DownOutlined, ExclamationCircleOutlined,MoreOutlined,SettingOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText,DrawerForm } from '@ant-design/pro-form';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { useAccess } from 'umi';
import ProTable from '@ant-design/pro-table';
import type { FormInstance } from 'antd/lib/form';
import type { UserInfoItem } from './data.d';
import { queryUserList, removeUserInfo, saveUserInfo, checkUserName, editUserInfo, checkUserCode, resetUserInfo } from './service';
import styles from './style.less';

const UserInfoList: React.FC = () => {

  const access = useAccess();

  const actionRef = useRef<ActionType>();

  const [selectedRowsState, setSelectedRows] = useState<UserInfoItem[]>([]);

  const [btnDisabled, setBtnDisabled] = useState<boolean>(false);

  const Components = { ModalForm, DrawerForm};

  const [rowActiveIndex, setRowActiveIndex] = useState<any>(null);

  const [addVisible, setAddVisible] = useState<boolean>(false);

  const [updateVisible, setUpdateVisible] = useState<boolean>(false);

  const [resetVisible, setResetVisible] = useState<boolean>(false);

  // =====================================添加操作=====================================begin

  const handleAdd = async (fields: UserInfoItem) => {
    setBtnDisabled(true);
    const hide = message.loading('正在添加');
    try {
      await saveUserInfo(fields);
      hide();
      message.success('添加成功');
      return true;
    } catch (error) {
      hide();
      message.error('添加失败请重试！');
      return false;
    }finally{
      setAddVisible(false);
      actionRef.current?.reload?.();
      setBtnDisabled(false);
    }
  };

  const addForm =(title: string,control: JSX.Element | undefined, openType: string) => {

    const FormComponents = Components[openType];

    const formRef = React.createRef<FormInstance>();

    const TypeProps =(openType==='ModalForm')?{modalProps:{maskClosable:false,keyboard:false,closable:false,destroyOnClose:true}}:{drawerProps:{onClose:()=> formRef.current!.resetFields()}};

    return (
      <FormComponents
        title={title}
        trigger={control}
        visible={addVisible}
        width={600}
        layout="horizontal"
        onFinish={(values: any)=>handleAdd(values)}
        submitter={{ submitButtonProps: { disabled: btnDisabled },resetButtonProps: {disabled: btnDisabled,onClick: () => {setAddVisible(false);}}}}
        formRef={formRef}
        {...TypeProps}
      >
      <ProFormText name="fullName" label="用户名称" rules={[{ required: true, message: '用户名称不能为空！' }, {
        pattern: new RegExp('^[\u4e00-\u9fa5]+$', 'g'),
        message: '用户名称必须为汉字!',
      }]}/>
      <ProFormText name="userName" label="登录名称" rules={[{ required: true, message: '请输入登录名称' }, {
        validator: async (rule, value) => {
          const params: any = { 'userName': value };
          const { data } = await checkUserName(params);
          if (!data.checkResult) {
            throw new Error('该登录名称已经存在！');
          }
        },
      }]}/>
      <ProFormText.Password label="用户密码" name="passWord" rules={[{ required: true, message: '请输入密码!' }]} hasFeedback/>
      <ProFormText.Password label="确认密码" name="confirm" dependencies={['passWord']} hasFeedback
                            rules={[{ required: true, message: '请输入确认密码!' },
                              ({ getFieldValue }) => ({
                                validator(rule, value) {
                                  if (!value || getFieldValue('passWord') === value) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(new Error('您输入的两个密码不匹配!'));
                                },
                              }),
                            ]}/>
      <ProFormText name="userCode" label="用户编码" rules={[{ required: true, message: '请输入用户编码' }, {
        validator: async (rule, value) => {
          const params: any = { 'userCode': value };
          const { data } = await checkUserCode(params);
          if (!data.checkResult) {
            throw new Error('该用户编码已经存在！');
          }
        }
      }]}/>
    </FormComponents>);
  }

  // =====================================添加操作=====================================end

  // =====================================更新操作=====================================begin

  const handleUpdate = async (fields: UserInfoItem) => {
    const hide = message.loading('正在更新');
    try {
      await editUserInfo(fields);
      hide();
      message.success('更新成功');
      return true;
    } catch (error) {
      hide();
      message.error('更新失败请重试！');
      return false;
    }finally{
      setUpdateVisible(false);
      actionRef.current?.reload?.();
      setBtnDisabled(false);
    }
  };

  const updateForm = (title: string,control: JSX.Element | undefined, openType: string, record: UserInfoItem) => {

    const FormComponents = Components[openType];

    const formRef = React.createRef<FormInstance>();

    const TypeProps =(openType==='ModalForm')?{modalProps:{maskClosable:false,keyboard:false,closable:false,destroyOnClose:true}}:{drawerProps:{onClose:()=> formRef.current!.resetFields()}};

    return (
      <FormComponents
        title={title}
        trigger={control}
        visible={updateVisible}
        width={600}
        layout="horizontal"
        onFinish={(values: any)=>handleUpdate(values)}
        submitter={{ submitButtonProps: { disabled: btnDisabled },resetButtonProps: {disabled: btnDisabled,onClick: () => {setUpdateVisible(false);}}}}
        formRef={formRef}
        {...TypeProps}
        initialValues={record}
      >
        <ProFormText name="id" hidden />
        <ProFormText name="fullName" label="用户名称" rules={[{ required: true, message: '用户名称不能为空！' },{ pattern:new RegExp('^[\u4e00-\u9fa5]+$','g'),message:'用户名称必须为汉字!'}]}/>
        <ProFormText name="userName" label="登录名称" rules={[{ required: true, message: '请输入登录名称' },{validator: async (rule, value) => {
            const params: any = {'userName':value,oldUserName:record.userName,id:record.id};
            const { data } = await checkUserName(params);
            if (!data.checkResult) {
              throw new Error('该登录名称已经存在！');
            }
          }}]}/>
        <ProFormText name="userCode" label="用户编码" rules={[{ required: true, message: '请输入用户编码' },{validator: async (rule, value) => {
            const params: any = {'userCode':value,oldUserCode:record.userCode,id:record.id};
            const { data } = await checkUserCode(params);
            if(!data.checkResult){
              throw new Error('该用户编码已经存在！');
            }
          }}]}/>
      </FormComponents>);
  }

  // =====================================更新操作=====================================end

  // =====================================重置密码操作=====================================begin

  const handleReset = async (fields: UserInfoItem) => {
    const hide = message.loading('正在重置');
    try {
      await resetUserInfo(fields);
      hide();
      message.success('重置成功');
      return true;
    } catch (error) {
      hide();
      message.error('重置失败请重试！');
      return false;
    }finally{
      setResetVisible(false);
      actionRef.current?.reload?.();
      setBtnDisabled(false);
    }
  };

  const  resetForm = (title: string,botton: JSX.Element | undefined, openType: string) =>{

    const FormComponents = Components[openType];

    const formRef = React.createRef<FormInstance>();

    const TypeProps =(openType==='ModalForm')?{modalProps:{maskClosable:false,keyboard:false,closable:false,destroyOnClose:true}}:{drawerProps:{onClose:()=> formRef.current!.resetFields()}};

    return (
      <FormComponents
        title={title}
        trigger={botton}
        visible={resetVisible}
        width={600}
        layout="horizontal"
        onFinish={(values: any)=>handleReset(values)}
        submitter={{ submitButtonProps: { disabled: btnDisabled },resetButtonProps: {disabled: btnDisabled,onClick: () => {setResetVisible(false);}}}}
        initialValues={{...selectedRowsState[0],"passWord":""}}
        formRef={formRef}
        {...TypeProps}
      >
      <ProFormText name="id" hidden />
      <ProFormText.Password label="用户密码" name="passWord" rules={[{required: true, message: '请输入密码!',},]} hasFeedback/>
    </FormComponents>);
  }

  // =====================================重置密码操作=====================================end

// =====================================更多操作=====================================begin

  const handleRemove = async (ids: string | any[]) => {
    setBtnDisabled(true);
    const hide = message.loading('正在删除');
    if (ids.length === 0) return true;
    try {
      await removeUserInfo({ 'ids': ids});
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

  const handleMenuClick = (key: React.ReactText,ids: any[]) => {
    if (ids.length === 0) return;
    switch (key) {
      case 'remove':
        Modal.confirm({
          title: '删除信息',
          content: '确定删除该信息吗？',
          icon: <ExclamationCircleOutlined />,
          okText: '确认',
          okButtonProps: {disabled:btnDisabled},
          cancelText: '取消',
          onOk:()=>handleRemove(ids),
        });
        break;
      default:
        break;
    }
  };

  const menu =(ids: any[])=> (
    <Menu onClick={({ key }) => handleMenuClick(key,ids)} selectedKeys={[]}>
      {<Menu.Item key="remove"><DeleteOutlined />删除</Menu.Item>}
    </Menu>
  );

// =====================================更多操作=====================================end

  const columns: ProColumns<UserInfoItem>[] = [
    { title: '登录名称', key: 'userName', dataIndex: 'userName', order: 3, sorter: true, width: '25%', ellipsis: true },
    { title: '用户名称', key: 'fullName', dataIndex: 'fullName', order: 1, sorter: true, width: '25%', ellipsis: true },
    { title: '用户编码', key: 'userCode', dataIndex: 'userCode', order: 2, sorter: true, width: '25%', ellipsis: true },
    { title: '创建时间', key: 'create_time', dataIndex: 'create_time', hideInSearch: true, sorter: true, width: '24%', ellipsis: true,valueType:"dateTime"},
    { valueType: 'option', width: '1%',
      render: (text, record,index) => (
        <Fragment>
          <Dropdown overlay={menu([record.id])}><a hidden={index !== rowActiveIndex}><MoreOutlined/></a></Dropdown>
        </Fragment>
      ),
    },
  ];

  return (
    <PageContainer title={false} className={styles.PageContainer}>
      <Card bordered={false} style={{ marginTop: 2 }}>
        <ProTable<UserInfoItem>
          headerTitle="用户信息列表"
          actionRef={actionRef}
          rowKey="id"
          toolBarRender={(action, { selectedRows }) => [
            access.elementAccess("ADDUSER")&&addForm("新增用户信息",<Button type="primary" onClick={() => {setAddVisible(true);}}><PlusOutlined/>新建</Button>,"ModalForm"),
            access.elementAccess("UPDATEUSER")&&selectedRows && selectedRows.length === 1 && (updateForm("更新用户信息",<Button key="edit" onClick={() => {setUpdateVisible(true);}}><EditOutlined />编辑</Button>,"ModalForm",selectedRows[0])),
            selectedRows && selectedRows.length === 1 && (resetForm("重置密码",<Button key="reset" onClick={() => {setResetVisible(true);}}><SettingOutlined />重置密码</Button>,"ModalForm")),
            selectedRows && selectedRows.length > 0 && (
            <span>
              <Dropdown overlay={menu(selectedRowsState.map((row) => row.id))}><Button>更多操作<DownOutlined /></Button></Dropdown>
            </span>
            )
          ]}
          request={async (params, sorter, filter) => {
            const { data }= await queryUserList({...params, sorter, filter});
            actionRef.current?.clearSelected?.();
            return data;
          }}
          columns={columns}
          options={{ reload: true, density: false, setting: true, fullScreen: false }}
          search={{ labelWidth: 'auto' }}
          pagination={{ pageSize: 5, showQuickJumper: true, showSizeChanger: true }}
          rowSelection={{ onChange: (_, selectedRows: any []) => setSelectedRows(selectedRows) }}
          tableAlertRender={false}
          size='small'
          onRow={(record,index) => {
            return {
              // 鼠标移入
              onMouseEnter: () => {setRowActiveIndex(index)},
              // 鼠标移除
              onMouseLeave: () => {setRowActiveIndex(null)},
            };
          }}
        />
      </Card>
    </PageContainer>
  );
};

export default UserInfoList;
