import React, { useState, useRef, Fragment, useEffect } from 'react';
import { Button, message, Dropdown, Menu, Modal } from 'antd';
import type { FormInstance } from 'antd/lib/form';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined, EditOutlined, DeleteOutlined, DownOutlined, ExclamationCircleOutlined, MoreOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText,DrawerForm,ProFormSelect } from '@ant-design/pro-form';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import {loopIconItem}  from '@/utils/common';
import ModuleTreeList from './modal/ModuleTreeList';
import { queryModuleElementList, removeModuleElementInfo, saveModuleElementInfo, checkModuleElementCode, editModuleElementInfo, queryModuleTreeInfo} from './service';
import { getDictionaryInfoByKeyFlag} from '@/services/common';
import type { ModuleElementItem } from './data.d';
import styles from './style.less';


const ModuleElementList: React.FC = () => {

  const actionRef = useRef<ActionType>();

  const [selectedRowsState, setSelectedRows] = useState<ModuleElementItem[]>([]);

  const [btnDisabled, setBtnDisabled] = useState<boolean>(false);

  const Components = { ModalForm, DrawerForm};

  const [isLeaf, setIsLeaf] = useState(false);

  const [treeData, setTreeData] = useState([]);

  const [selectKey, setSelectKey] = useState("root");

  const [rowActiveIndex, setRowActiveIndex] = useState<any>(null);

  const [addVisible, setAddVisible] = useState<boolean>(false);

  const [updateVisible, setUpdateVisible] = useState<boolean>(false);

  const [moduleElementType, setModuleElementType] = useState<any>([]);

  const [moduleElementState, setModuleElementState] = useState<any>([]);

  const unitTreeData = async () => {
    const { data }  = await queryModuleTreeInfo();
    setTreeData(data.unitTreeData);
    setModuleElementType(data.moduleElementTypeCode);
    setModuleElementState(data.moduleElementStateCode);
  }

  useEffect(() => {unitTreeData();}, []);

  // =====================================????????????=====================================begin

  const handleAdd = async (fields: ModuleElementItem) => {
    setBtnDisabled(true);
    const hide = message.loading('????????????');
    try {
      await saveModuleElementInfo(fields);
      hide();
      message.success('????????????');
      return true;
    } catch (error) {
      hide();
      message.error('????????????????????????');
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

    const meTypeOptions = moduleElementType.map((item: { display: any; key: any; }) => ({"label": item.display,"value": item.key }));

    const meStateOptions = moduleElementState.map((item: { display: any; key: any; }) => ({"label": item.display,"value": item.key }));

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
        <ProFormText name="name" label="????????????" rules={[{ required: true, message: '???????????????????????????' },{ pattern:new RegExp('^[\u4e00-\u9fa5]+$','g'),message:'???????????????????????????!'}]}/>
        <ProFormText name="code" label="????????????" rules={[{ required: true, message: '?????????????????????' },{ pattern:new RegExp('^[A-Z]+$','g'),message:'?????????????????????????????????!'},
        {
        validator: async (rule, value) => {
          const params: any = { 'code': value };
          const { data } = await checkModuleElementCode(params);
          if (!data.checkResult) {
            throw new Error('??????????????????????????????');
          }
        },
      }]}/>
        <ProFormText name="description" label="????????????" />
        <ProFormSelect
          name="type"
          label="????????????"
          request={async () => meTypeOptions}
          placeholder="?????????????????????!"
          rules={[{ required: true, message: '?????????????????????!' }]}
        />

        <ProFormSelect
          name="state"
          label="????????????"
          request={async () => meStateOptions}
          placeholder="?????????????????????!"
          rules={[{ required: true, message: '?????????????????????!' }]}
        />
    </FormComponents>);
  }

  // =====================================????????????=====================================end
  // =====================================????????????=====================================begin

  const handleUpdate = async (fields: ModuleElementItem) => {
    const hide = message.loading('????????????');
    try {
      await editModuleElementInfo(fields);
      hide();
      message.success('????????????');
      return true;
    } catch (error) {
      hide();
      message.error('????????????????????????');
      return false;
    }finally{
      setUpdateVisible(false);
      actionRef.current?.reload?.();
      setBtnDisabled(false);
    }
  };

  const updateForm = (title: string,control:  JSX.Element | undefined, openType: string, record: ModuleElementItem) => {

    const FormComponents = Components[openType];

    const formRef = React.createRef<FormInstance>();

    const TypeProps =(openType==='ModalForm')?{modalProps:{maskClosable:false,keyboard:false,closable:false,destroyOnClose:true}}:{drawerProps:{onClose:()=> formRef.current!.resetFields()}};

    const meTypeOptions = moduleElementType.map((item: { display: any; key: any; }) => ({"label": item.display,"value": item.key }));

    const meStateOptions = moduleElementState.map((item: { display: any; key: any; }) => ({"label": item.display,"value": item.key }));

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
        <ProFormText name="name" label="????????????" rules={[{ required: true, message: '???????????????????????????' },{ pattern:new RegExp('^[\u4e00-\u9fa5]+$','g'),message:'???????????????????????????!'}]}/>
        <ProFormText name="code" label="????????????" rules={[{ required: true, message: '?????????????????????' },{ pattern:new RegExp('^[A-Z]+$','g'),message:'?????????????????????????????????!'},
          {
            validator: async (rule, value) => {
            const params: any = {'code':value,oldCode:record.code,id:record.id};
            const { data } = await checkModuleElementCode(params);
            if (!data.checkResult) {
              throw new Error('??????????????????????????????');
            }
          }}]}/>
        <ProFormText name="description" label="????????????" />
        <ProFormSelect
          name="type"
          label="????????????"
          request={async () => meTypeOptions}
          placeholder="?????????????????????!"
          rules={[{ required: true, message: '?????????????????????!' }]}
        />

        <ProFormSelect
          name="state"
          label="????????????"
          request={async () => meStateOptions}
          placeholder="?????????????????????!"
          rules={[{ required: true, message: '?????????????????????!' }]}
        />
      </FormComponents>);
  }
  // =====================================????????????=====================================end

 // =====================================????????????=====================================begin

  const handleRemove = async (ids: string | any[]) => {
    setBtnDisabled(true);
    const hide = message.loading('????????????');
    if (ids.length === 0) return true;
    try {
      const params = { "ids": ids };
      await removeModuleElementInfo(params);
      hide();
      message.success('????????????');
      return true;
    } catch (error) {
      hide();
      message.error('????????????????????????');
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
          title: '????????????',
          content: '???????????????????????????',
          icon: <ExclamationCircleOutlined />,
          okText: '??????',
          okButtonProps: {disabled:btnDisabled},
          cancelText: '??????',
          onOk:()=>handleRemove(ids),
        });
        break;
      default:
        break;
    }
  };

  const menu =(ids: any[])=> (
    <Menu onClick={({ key }) => handleMenuClick(key,ids)} selectedKeys={[]}>
      <Menu.Item key="remove"><DeleteOutlined />??????</Menu.Item>
    </Menu>
  );

// =====================================????????????=====================================??????

  const columns: ProColumns<ModuleElementItem>[] = [
    { title: '????????????', key: 'name', dataIndex: 'name', order: 3, sorter: true, width: '25%', ellipsis: true },
    { title: '????????????', key: 'code', dataIndex: 'code', order: 2, sorter: true, width: '25%', ellipsis: true },
    { title: '????????????', key: 'type', dataIndex: 'type', order: 2, sorter: true, width: '25%', ellipsis: true,valueType: 'select',
      request: async () => {
        const params = { "keyFlag": "METYPE"};
        const { data }=await getDictionaryInfoByKeyFlag(params);
        return data.optionsList;
      } },
    { title: '????????????', key: 'state', dataIndex: 'state', order: 2, sorter: true, width: '25%', ellipsis: true,valueType: 'select',
      request: async () => {
        const params = { "keyFlag": "MESTATE"};
        const { data }=await getDictionaryInfoByKeyFlag(params);
        return data.optionsList;
      }
    },
    { title: '????????????', key: 'description', dataIndex: 'description', order: 2, sorter: true, width: '25%', ellipsis: true },
    { title: '????????????', key: 'create_time', dataIndex: 'create_time', hideInSearch: true, width: '24%', ellipsis: true},
    { title: '', valueType: 'option', width: '1%',
      render: (text, record,index) => (
        <Fragment>
          <Dropdown overlay={menu([record.id])}><a hidden={index !== rowActiveIndex}><MoreOutlined/></a></Dropdown>
        </Fragment>
      ),
    },
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
          <ProTable<ModuleElementItem>
            headerTitle="??????????????????"
            actionRef={actionRef}
            rowKey="id"
            toolBarRender={(action, { selectedRows }) => [
              <Button type="primary"></Button>,
              (isLeaf)&&addForm("????????????",<Button type="primary" onClick={() => {setAddVisible(true);}}><PlusOutlined/>??????</Button>,"ModalForm"),
              selectedRows && selectedRows.length === 1 && (updateForm("????????????",<Button key="edit" onClick={() => {setUpdateVisible(true);}}><EditOutlined />??????</Button>,"ModalForm",selectedRows[0])),
              selectedRows && selectedRows.length > 0 && (
                <span>
                 <Dropdown overlay={menu(selectedRowsState.map((row) => row.id))}><Button>????????????<DownOutlined /></Button></Dropdown>
                </span>
              ),
            ]}
            params={{"selectKey": selectKey}}
            request={async (params, sorter, filter) => {
              const { data } = await queryModuleElementList({...params, sorter, filter});
              actionRef.current?.clearSelected?.();
              return data;
            }}
            columns={columns}
            options={{ reload: true, density: false, setting: true, fullScreen: false }}
            search={{ labelWidth: 'auto' }}
            pagination={{
              pageSize: 5,
              showQuickJumper: true, // ?????????????????????
              showSizeChanger: true, // ?????????????????????
            }}
            rowSelection={{
              onChange: (_, selectedRows: any []) => setSelectedRows(selectedRows),
            }}
            tableAlertRender={false}
            size='small'
            onRow={(record,index) => {
              return {
                // ????????????
                onMouseEnter: () => {setRowActiveIndex(index)},
                // ????????????
                onMouseLeave: () => {setRowActiveIndex(null)},
              };
            }}
          />
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};

export default ModuleElementList;
