import React, { useState, useRef,useEffect } from 'react';
import { Card, Button, message, Modal, Menu, Dropdown } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, DownOutlined } from '@ant-design/icons';
import { DrawerForm, ModalForm, ProFormText } from '@ant-design/pro-form';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { FormInstance } from 'antd/lib/form';
import {history} from "umi";
import type { DictionaryInfoItem } from './data.d';
import { queryDictionaryInfoList, removeDictionaryInfo, saveDictionaryInfo, editDictionaryInfo, checkDictionaryInfoCode } from './service';
import styles from './style.less';

const DictionaryTypeList: React.FC = () => {

  const actionRef = useRef<ActionType>();

  const [dictionaryTypeInfo, setDictionaryTypeInfo] = useState<any>({} );

  const [selectedRowsState, setSelectedRows] = useState<DictionaryInfoItem[]>([]);

  const [btnDisabled, setBtnDisabled] = useState<boolean>(false);

  const [addVisible, setAddVisible] = useState<boolean>(false);

  const [updateVisible, setUpdateVisible] = useState<boolean>(false);

  const Components = { ModalForm, DrawerForm};

  const columns: ProColumns<DictionaryInfoItem>[] = [
    { title: '业务分类', key: 'typeCode', dataIndex: 'typeCode',hideInSearch:true, sorter: true, width: '20%', ellipsis: true },
    { title: '业务编码', key: 'code', dataIndex: 'code', sorter: true, width: '20%', ellipsis: true },
    { title: '业务名称', key: 'name', dataIndex: 'name',sorter: true, width: '20%', ellipsis: true },
    { title: '创建时间', key: 'create_time', dataIndex: 'create_time',hideInSearch:true, sorter: true, width: '20%', ellipsis: true },
  ];

  useEffect(() => {
    history.listen((location: { state: any; }) => {
      setDictionaryTypeInfo(location.state);
    });
  }, []);

  // =====================================添加操作=====================================begin

  const handleAdd = async (fields: DictionaryInfoItem) => {
    setBtnDisabled(true);
    const hide = message.loading('正在添加');
    try {
      await saveDictionaryInfo(fields);
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

  const addForm =(title: string,control: JSX.Element | undefined, openType: string) =>{

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
      <ProFormText name="foreignId" hidden initialValue={dictionaryTypeInfo.id}/>
      <ProFormText name="name" label="业务名称" rules={[{ required: true, message: '请输入业务名称！' },{ pattern:new RegExp('^[\u4E00-\u9FA5A-Za-z0-9]+$','g'),message:'业务名称必须为中文、英文、数字!'}]}/>
      <ProFormText name="code" label="业务编码" rules={[{ required: true, message: '请输入业务编码' },{ pattern:new RegExp('^[A-Za-z0-9]+$','g'),message:'业务编码必须为英文或者数字!'
      },{validator: async (rule, value) => {
          const params: any = {'code':value,foreignId:dictionaryTypeInfo.id};
          const { data }= await checkDictionaryInfoCode(params);
          if(!data.checkResult){
            throw new Error('该业务编码已经存在！');
          }
        }}]}/>
    </FormComponents>)
  };
  // =====================================添加操作=====================================end

  // =====================================更新操作=====================================begin

  const handleUpdate = async (fields: DictionaryInfoItem) => {
    const hide = message.loading('正在更新');
    try {
      await editDictionaryInfo(fields);
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

  const updateForm = (title: string,control: JSX.Element | undefined, openType: string,record: DictionaryInfoItem) => {

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
      initialValues={record}
      formRef={formRef}
      {...TypeProps}
    >
      <ProFormText name="id" hidden />
      <ProFormText name="foreignId" hidden />
      <ProFormText name="name" label="业务名称" rules={[{ required: true, message: '请输入业务名称！' },{ pattern:new RegExp('^[\u4E00-\u9FA5A-Za-z0-9]+$','g'),message:'业务名称必须为中文、英文、数字!'}]}/>
      <ProFormText name="code" label="业务编码" rules={[{ required: true, message: '请输入分类编码！' },{ pattern:new RegExp('^[A-Za-z0-9]+$','g'),message:'业务编码必须为英文或者数字!'
      },{validator: async (rule, value) => {
          const params: any = {'code':value,oldCode:record.code,id:record.id};
          const { data } = await checkDictionaryInfoCode(params);
          if(!data.checkResult){
            throw new Error('该业务编码已经存在！');
          }
        }}]}/>
    </FormComponents>)
  };

  // =====================================更新操作=====================================end

  // =====================================更多操作=====================================开始

  const handleRemove = async (ids: string | any[]) => {
    setBtnDisabled(true);
    const hide = message.loading('正在删除');
    if (ids.length === 0) return true;
    try {
      const params = { "ids": ids };
      await removeDictionaryInfo(params);
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

  const handleMenuClick = (key: React.ReactText ,ids: any[]) => {
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

  const menu = (
    <Menu onClick={({ key }) => handleMenuClick(key,selectedRowsState.map((row) => row.id))} selectedKeys={[]}>
      <Menu.Item key="remove"><DeleteOutlined />删除</Menu.Item>
    </Menu>
  );

  return (
    <PageContainer title={false} className={styles.PageContainer}>
      <Card bordered={false} style={{ marginTop: 2 }}>
        <ProTable<DictionaryInfoItem>
          headerTitle="业务信息列表"
          actionRef={actionRef}
          rowKey="id"
          toolBarRender={(action, { selectedRows }) => [
            addForm("新建业务信息",<Button type="primary" onClick={() => {setAddVisible(true);}}><PlusOutlined/>新建</Button>,"ModalForm"),
            selectedRows && selectedRows.length === 1 && (updateForm("更新业务信息",<Button key="edit" onClick={() => {setUpdateVisible(true);}}><EditOutlined />编辑</Button>,"ModalForm",selectedRows[0])),
            selectedRows && selectedRows.length > 0 && (
            <span>
              <Dropdown overlay={menu}><Button>更多操作<DownOutlined /></Button></Dropdown>
            </span>
            )
          ]}
          params={{"foreignId": dictionaryTypeInfo.id}}
          request={async (params, sorter, filter) => {
            const { data } = await queryDictionaryInfoList({...params, sorter, filter});
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
      </Card>
    </PageContainer>
  );
};
export default DictionaryTypeList;
