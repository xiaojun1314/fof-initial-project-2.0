import React, { useState, useRef, useEffect } from 'react';
import { Button, message, Dropdown, Menu, Modal } from 'antd';
import type { FormInstance } from 'antd/lib/form';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined, EditOutlined, DeleteOutlined, DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText,DrawerForm  } from '@ant-design/pro-form';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import {loopIconItem}  from '@/utils/common';
import ModuleTreeList from './modal/ModuleTreeList';
import { queryModuleOperationList, removeModuleOperationInfo, saveModuleOperationInfo, checkModuleOperationCode, editModuleOperationInfo, queryModuleTreeInfo} from './service';
import type { ModuleOperationItem } from './data.d';
import styles from './style.less';


const ModuleOperationList: React.FC = () => {

  const actionRef = useRef<ActionType>();

  const [selectedRowsState, setSelectedRows] = useState<ModuleOperationItem[]>([]);

  const [btnDisabled, setBtnDisabled] = useState<boolean>(false);

  const Components = { ModalForm, DrawerForm};

  const [isLeaf, setIsLeaf] = useState(false);

  const [treeData, setTreeData] = useState([]);

  const [selectKey, setSelectKey] = useState("root");


  const [addVisible, setAddVisible] = useState<boolean>(false);

  const [updateVisible, setUpdateVisible] = useState<boolean>(false);


  const unitTreeData = async () => {
    const { data }  = await queryModuleTreeInfo();
    setTreeData(data.unitTreeData);
  }

  useEffect(() => {unitTreeData();}, []);

  // =====================================添加操作=====================================begin

  const handleAdd = async (fields: ModuleOperationItem) => {
    setBtnDisabled(true);
    const hide = message.loading('正在添加');
    try {
      await saveModuleOperationInfo(fields);
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
        onFinish={(values: any)=>handleAdd(values)}
        submitter={{ submitButtonProps: { disabled: btnDisabled },resetButtonProps: {disabled: btnDisabled,onClick: () => {setAddVisible(false);}}}}
        formRef={formRef}
        {...TypeProps}
        initialValues={{module_id:selectKey}}
      >
        <ProFormText name="module_id" hidden />
        <ProFormText name="name" label="操作名称" rules={[{ required: true, message: '操作名称不能为空！' },{ pattern:new RegExp('^[\u4e00-\u9fa5]+$','g'),message:'操作名称必须为汉字!'}]}/>
        <ProFormText name="code" label="操作编码" rules={[{ required: true, message: '请输入操作编码' },{ pattern:new RegExp('^[A-Z_\u4e00-\u9fa5]+$','g'),message:'操作编码必须为大写字母!'},
        {
        validator: async (rule, value) => {
          const params: any = { 'code': value };
          const { data } = await checkModuleOperationCode(params);
          if (!data.checkResult) {
            throw new Error('该操作编码已经存在！');
          }
        },
      }]}/>
        <ProFormText name="url" label="拦截链接" rules={[{ required: true, message: '拦截链接不能为空！' }]}/>
        <ProFormText name="description" label="操作描述" />
    </FormComponents>);
  }

  // =====================================添加操作=====================================end
  // =====================================更新操作=====================================begin

  const handleUpdate = async (fields: ModuleOperationItem) => {
    const hide = message.loading('正在更新');
    try {
      await editModuleOperationInfo(fields);
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

  const updateForm = (title: string,control:  JSX.Element | undefined, openType: string, record: ModuleOperationItem) => {

    const FormComponents = Components[openType];

    const formRef = React.createRef<FormInstance>();

    const TypeProps =(openType==='ModalForm')?{modalProps:{maskClosable:false,keyboard:false,closable:false,destroyOnClose:true}}:{drawerProps:{onClose:()=> formRef.current!.resetFields()}};


    return (
      <FormComponents
        title={title}
        trigger={control}
        visible={updateVisible}
        width={600}
        onFinish={(values: any)=>handleUpdate(values)}
        submitter={{ submitButtonProps: { disabled: btnDisabled },resetButtonProps: {disabled: btnDisabled,onClick: () => {setUpdateVisible(false);}}}}
        initialValues={record}
        formRef={formRef}
        {...TypeProps}
      >
        <ProFormText name="id" hidden />
        <ProFormText name="name" label="操作名称" rules={[{ required: true, message: '操作名称不能为空！' },{ pattern:new RegExp('^[\u4e00-\u9fa5]+$','g'),message:'操作名称必须为汉字!'}]}/>
        <ProFormText name="code" label="操作编码" rules={[{ required: true, message: '请输入操作编码' },{ pattern:new RegExp('^[A-Z_\u4e00-\u9fa5]+$','g'),message:'操作编码必须为大写字母!'},
          {
            validator: async (rule, value) => {
            const params: any = {'code':value,oldCode:record.code,id:record.id};
            const { data } = await checkModuleOperationCode(params);
            if (!data.checkResult) {
              throw new Error('该操作编码已经存在！');
            }
          }}]}/>
        <ProFormText name="url" label="拦截链接" rules={[{ required: true, message: '拦截链接不能为空！' }]}/>
        <ProFormText name="description" label="操作描述" />
      </FormComponents>);
  }
  // =====================================更新操作=====================================end

 // =====================================更多操作=====================================begin

  const handleRemove = async (ids: string | any[]) => {
    setBtnDisabled(true);
    const hide = message.loading('正在删除');
    if (ids.length === 0) return true;
    try {
      const params = { "ids": ids };
      await removeModuleOperationInfo(params);
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

  const menu =(ids: any[])=> (
    <Menu onClick={({ key }) => handleMenuClick(key,ids)} selectedKeys={[]}>
      <Menu.Item key="remove"><DeleteOutlined />删除</Menu.Item>
    </Menu>
  );

// =====================================更多操作=====================================结束

  const columns: ProColumns<ModuleOperationItem>[] = [
    { title: '操作名称', key: 'name', dataIndex: 'name', order: 3, sorter: true, width: '25%', ellipsis: true },
    { title: '操作编码', key: 'code', dataIndex: 'code', order: 2, sorter: true, width: '25%', ellipsis: true },
    { title: '操作描述', key: 'description', dataIndex: 'description', order: 2, sorter: true, width: '25%', ellipsis: true },
    { title: '拦截链接', key: 'url', dataIndex: 'url', order: 2, sorter: true, width: '25%', ellipsis: true },
    { title: '创建时间', key: 'create_time', dataIndex: 'create_time', hideInSearch: true, width: '24%', ellipsis: true}
  ];

  const handleOnSelectTree=  (selectedKeys: React.Key[],info: any) => {
    if (selectedKeys[0] === undefined) {
      return;
    }
    setIsLeaf(info.node.isLeaf);
    const selectedKey=selectedKeys["0"];
    if(selectedKey==='root'){
      setSelectKey("root");
    }else{
      setSelectKey(selectedKey);
    }
    actionRef.current?.reload?.();
    setSelectedRows([]);
  };



  return (
    <PageContainer title={false} className={styles.PageContainer}>
      <ProCard split="vertical" bordered headerBordered style={{height:700}}>
        <ProCard colSpan="300px" className={styles.CarStyle} style={{overflow: 'auto',height:650}}>
          <ModuleTreeList
            treeData={treeData}
            handleOnSelectTree={handleOnSelectTree}
            loopIconItem={loopIconItem}
          />
        </ProCard>
        <ProCard>
          <ProTable<ModuleOperationItem>
            headerTitle="模块操作列表"
            actionRef={actionRef}
            rowKey="id"
            toolBarRender={(action, { selectedRows }) => [
              <Button type="primary"></Button>,
              (isLeaf)&&addForm("新建操作",<Button type="primary" onClick={() => {setAddVisible(true);}}><PlusOutlined/>新建</Button>,"ModalForm"),
              selectedRows && selectedRows.length === 1 && (updateForm("更新操作",<Button key="edit" onClick={() => {setUpdateVisible(true);}}><EditOutlined />编辑</Button>,"ModalForm",selectedRows[0])),
              selectedRows && selectedRows.length > 0 && (
                <span>
                 <Dropdown overlay={menu(selectedRowsState.map((row) => row.id))}><Button>更多操作<DownOutlined /></Button></Dropdown>
                </span>
              ),
            ]}
            params={{"selectKey": selectKey}}
            request={async (params, sorter, filter) => {
              const { data } = await queryModuleOperationList({...params, sorter, filter});
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
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};

export default ModuleOperationList;
