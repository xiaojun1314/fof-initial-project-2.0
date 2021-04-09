import React, { useState, useRef } from 'react';
import { Card, Button, message, Dropdown, Modal, Menu } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined, EditOutlined, DeleteOutlined, DownOutlined, ExclamationCircleOutlined,RiseOutlined } from '@ant-design/icons';
import { DrawerForm, ModalForm, ProFormText } from '@ant-design/pro-form';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { FormInstance } from 'antd/lib/form';
import {history} from "umi";
import type { DictionaryTypeItem } from './data.d';
import { queryDictionaryTypeList, removeDictionaryType, saveDictionaryType, editDictionaryType, checkDictionaryTypeCode } from './service';
import styles from './style.less';

const DictionaryTypeList: React.FC = () => {

  const actionRef = useRef<ActionType>();

  const [selectedRowsState, setSelectedRows] = useState<DictionaryTypeItem[]>([]);

  const [btnDisabled, setBtnDisabled] = useState<boolean>(false);

  const [addVisible, setAddVisible] = useState<boolean>(false);

  const [updateVisible, setUpdateVisible] = useState<boolean>(false);

  const Components = { ModalForm, DrawerForm};

  const columns: ProColumns<DictionaryTypeItem>[] = [
    { title: '分类名称', key: 'name', dataIndex: 'name', sorter: true, width: '33%', ellipsis: true },
    { title: '分类编码', key: 'code', dataIndex: 'code', sorter: true, width: '33%', ellipsis: true },
    { title: '创建时间', key: 'create_time', dataIndex: 'create_time',hideInSearch:true, sorter: true, width: '34%', ellipsis: true }
  ];

  // =====================================添加操作=====================================begin

  const handleAdd = async (fields: DictionaryTypeItem) => {
    setBtnDisabled(true);
    const hide = message.loading('正在添加');
    try {
      await saveDictionaryType(fields);
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
      <ProFormText name="name" label="分类名称" rules={[{ required: true, message: '请输入分类名称！' },{ pattern:new RegExp('^[\u4e00-\u9fa5]+$','g'),message:'分类名称必须为汉字!'}]}/>
      <ProFormText name="code" label="分类编码" rules={[{ required: true, message: '请输入分类编码' },{ pattern:new RegExp('^[A-Z]+$','g'),message:'分类编码必须为大写字母!'
      },{validator: async (rule, value) => {
          const params: any = {'code':value};
          const { data } = await checkDictionaryTypeCode(params);
          if(!data.checkResult){
            throw new Error('该分类编码已经存在！');
          }
        }}]}/>
    </FormComponents>
    )
  }

  // =====================================添加操作=====================================end
  // =====================================更新操作=====================================begin

  const handleUpdate = async (fields: DictionaryTypeItem) => {
    const hide = message.loading('正在更新');
    try {
      await editDictionaryType(fields);
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

  const updateForm = (title: string,control: JSX.Element | undefined,openType: string, record: DictionaryTypeItem) =>{

    const FormComponents = Components[openType];

    const formRef = React.createRef<FormInstance>();

    const TypeProps =(openType==='ModalForm')?{modalProps:{maskClosable:false,keyboard:false,closable:false,destroyOnClose:true}}:{drawerProps:{onClose:()=> formRef.current!.resetFields()}};

    return (
    <FormComponents
      title="更新业务分类"
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
      <ProFormText name="name" label="分类名称" rules={[{ required: true, message: '请输入分类名称！' },{ pattern:new RegExp('^[\u4e00-\u9fa5]+$','g'),message:'分类名称必须为汉字!'}]}/>
      <ProFormText name="code" label="分类编码" rules={[{ required: true, message: '请输入分类编码！' },{ pattern:new RegExp('^[A-Z]+$','g'),message:'分类编码必须为大写字母!'
      },{validator: async (rule, value) => {
          const params: any = {'code':value,oldCode:record.code,id:record.id};
          const { data }= await checkDictionaryTypeCode(params);
          if(!data.checkResult){
            throw new Error('该分类编码已经存在！');
          }
        }}]}/>
    </FormComponents>)};

  // =====================================添加操作=====================================end
  // =====================================更多操作=====================================begin

  const handleRemove = async (ids: string | any[]) => {
    setBtnDisabled(true);
    const hide = message.loading('正在删除');
    if (ids.length === 0) return true;
    try {
      const params = { "ids": ids };
      await removeDictionaryType(params);
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

  const handleGoToDetails=(record: any)=>{
    history.push({
      pathname: '/systemManage/dictionaryInfoList',
      state:record
    })
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
      case 'approval':
        handleGoToDetails(selectedRowsState[0]);
        break;
      default:
        break;
    }
  };

  const menu = (
    <Menu onClick={({ key }) => handleMenuClick(key,selectedRowsState.map((row) => row.id))} selectedKeys={[]}>
      <Menu.Item key="remove"><DeleteOutlined />删除</Menu.Item>
      {selectedRowsState.length===1&&(<Menu.Item key="approval"><RiseOutlined />业务数据</Menu.Item>)}
    </Menu>
  );
// =====================================更多操作=====================================结束

  return (
    <PageContainer title={false} className={styles.PageContainer}>
      <Card bordered={false} style={{ marginTop: 2 }}>
        <ProTable<DictionaryTypeItem>
          headerTitle="业务分类列表"
          actionRef={actionRef}
          rowKey="id"
          toolBarRender={(action, { selectedRows }) => [
            addForm("新增业务分类",<Button type="primary" onClick={() => {setAddVisible(true);}}><PlusOutlined/>新建</Button>,"ModalForm"),
            selectedRows && selectedRows.length === 1 && (updateForm("更新业务分类",<Button key="edit" onClick={() => {setUpdateVisible(true);}}><EditOutlined />编辑</Button>,"ModalForm",selectedRows[0],)),
            selectedRows && selectedRows.length > 0 && (
              <span>
                <Dropdown overlay={menu}><Button>更多操作<DownOutlined /></Button></Dropdown>
              </span>
            )
          ]}
          request={async (params, sorter, filter) => {
            const { data } = await queryDictionaryTypeList({ ...params, sorter, filter});
            actionRef.current?.clearSelected?.();
            return data;
          }}
          columns={columns}
          options={{ reload: true, density: false, setting: true, fullScreen: false }}
          search={{ labelWidth: 'auto' }}
          pagination={{ pageSize: 5, showQuickJumper: true, showSizeChanger: true }}
          rowSelection={{ onChange: (_, selectedRows: any []) => setSelectedRows(selectedRows)}}
          tableAlertRender={false}
          size='small'
        />
      </Card>
    </PageContainer>
  );
};
export default DictionaryTypeList;
