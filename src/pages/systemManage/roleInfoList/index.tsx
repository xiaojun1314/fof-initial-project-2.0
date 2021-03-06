import React, { useState, useRef, Fragment, useEffect } from 'react';
import { Button, message, Dropdown, Menu, Modal } from 'antd';
import type { FormInstance } from 'antd/lib/form';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined, EditOutlined, DeleteOutlined, DownOutlined, ExclamationCircleOutlined, MoreOutlined,UserOutlined,SlackOutlined,MenuOutlined,ProfileOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText,DrawerForm } from '@ant-design/pro-form';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import {loopIconItem}  from '@/utils/common';
import OrgTreeList from './modal/OrgTreeList';
import RoleToUserListModal from './modal/RoleToUserListModal';
import MenuAuthorityModal from './modal/MenuAuthorityModal';
import ElementAuthorityModal from './modal/ElementAuthorityModal';
import OperationAuthorityModal from './modal/OperationAuthorityModal';
import { queryRoleList, removeRoleInfo, saveRoleInfo, checkRoleCode, editRoleInfo, queryOrgTreeInfo,queryMenuTreeInfo,getMenuIdsByRoleId,getModuleElementInfoByRole,getModuleOperationInfoByRole } from './service';
import type { RoleInfoItem } from './data.d';
import styles from './style.less';



const RoleInfoList: React.FC = () => {

  const actionRef = useRef<ActionType>();

  const [selectedRowsState, setSelectedRows] = useState<RoleInfoItem[]>([]);

  const [btnDisabled, setBtnDisabled] = useState<boolean>(false);

  const Components = { ModalForm, DrawerForm};

  const [type, setType] = useState("-1");

  const [treeData, setTreeData] = useState([]);

  const [infoValue, setInfoValue] = useState({});

  const [selectKey, setSelectKey] = useState("root");

  const [rowActiveIndex, setRowActiveIndex] = useState<any>(null);

  const [roleToUserVisible, setRoleToUserVisible] = useState(false);

  const [menuAuthorityVisible, setMenuAuthorityVisible] = useState(false);

  const [elementAuthorityVisible, setElementAuthorityVisible] = useState(false);

  const [operationAuthorityVisible, setOperationAuthorityVisible] = useState(false);

  const [addVisible, setAddVisible] = useState<boolean>(false);

  const [updateVisible, setUpdateVisible] = useState<boolean>(false);

  const [treeMenuData, setTreeMenuData] = useState([]);

  const [checkedKeys, setCheckedKeys] = useState([]);

  const [roleId, setRoleId] = useState({});

  const [moduleInfo1, setModuleInfo1] = useState([]);

  const [moduleInfo2, setModuleInfo2] = useState([]);

  const [checkAll, setCheckAll] = useState([]);

  const [allCheckListId, setAllCheckListId] = useState([]);

  const [indeterminate, setIndeterminate] = useState<any>([]);


  const unitTreeData = async () => {
    const params = {findType:"PART"};
    const { data }  = await queryOrgTreeInfo(params);
    setTreeData(data.unitTreeData);
  }

  useEffect(() => {unitTreeData();}, []);

  // =====================================????????????=====================================begin

  const handleAdd = async (fields: RoleInfoItem) => {
    setBtnDisabled(true);
    const hide = message.loading('????????????');
    try {
      await saveRoleInfo(fields);
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
        initialValues={{foreignId:selectKey}}
      >
        <ProFormText name="foreignId" hidden />
        <ProFormText name="name" label="????????????" rules={[{ required: true, message: '???????????????????????????' }, { pattern: new RegExp('^[\u4e00-\u9fa5]+$', 'g'), message: '????????????????????????!', }]}/>
        <ProFormText name="code" label="????????????" rules={[{ required: true, message: '?????????????????????' },{ pattern:new RegExp('^[A-Z]+$','g'),message:'?????????????????????????????????!' },
        {
        validator: async (rule, value) => {
          const params: any = { 'code': value };
          const { data } = await checkRoleCode(params);
          if (!data.checkResult) {
            throw new Error('??????????????????????????????');
          }
        },
      }]}/>
    </FormComponents>);
  }

  // =====================================????????????=====================================end
  // =====================================????????????=====================================begin

  const handleUpdate = async (fields: RoleInfoItem) => {
    const hide = message.loading('????????????');
    try {
      await editRoleInfo(fields);
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

  const updateForm = (title: string,control:  JSX.Element | undefined, openType: string, record: RoleInfoItem) => {

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
        <ProFormText name="name" label="????????????" rules={[{ required: true, message: '???????????????????????????' },{ pattern:new RegExp('^[\u4e00-\u9fa5]+$','g'),message:'???????????????????????????!'}]}/>
        <ProFormText name="code" label="????????????" rules={[{ required: true, message: '?????????????????????' },{ pattern:new RegExp('^[A-Z]+$','g'),message:'?????????????????????????????????!'},
          {
            validator: async (rule, value) => {
            const params: any = {'code':value,oldCode:record.code,id:record.id};
            const { data } = await checkRoleCode(params);
            if (!data.checkResult) {
              throw new Error('??????????????????????????????');
            }
          }}]}/>
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
      await removeRoleInfo(params);
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

  const columns: ProColumns<RoleInfoItem>[] = [
    { title: '????????????', key: 'name', dataIndex: 'name', order: 3, sorter: true, width: '25%', ellipsis: true },
    { title: '????????????', key: 'code', dataIndex: 'code', order: 2, sorter: true, width: '25%', ellipsis: true },
    { title: '????????????', key: 'subCompanyText', dataIndex: 'subCompanyText',hideInSearch: true, order: 1, sorter: true, width: '25%', ellipsis: true},
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
    const selectedKey=selectedKeys["0"];
    if(selectedKey==='root'){
      setType("-1");
      setSelectKey("root");
    }else{
      setType(info.selectedNodes[0].type);
      setSelectKey(selectedKey);
    }
    actionRef.current?.reload?.();
    setSelectedRows([]);
  };


// ----------------------??????????????????-------------------

  const roleToUserListActionRef = useRef<ActionType>();

  const handleShowRoleToUserListModal = ()=> {
    if (selectedRowsState.length !== 1) return;
    setRoleToUserVisible(true);
    setInfoValue(selectedRowsState[0]);
    roleToUserListActionRef.current?.reload?.();
  };

  const handleCancelRoleToUserListModal = () => {
    setRoleToUserVisible(false);
  };


  const handleCancelMenuAuthorityModal = () => {
    setMenuAuthorityVisible(false);
  };

  const handleShowMenuAuthorityModal = async ()=> {
    if (selectedRowsState.length !== 1) return;
    const { data }  = await queryMenuTreeInfo();
    setTreeMenuData(data.unitTreeData);
    const params = {roleId:selectedRowsState[0].id};
    const response = await getMenuIdsByRoleId(params);
    setCheckedKeys(response.data.menuIds);
    setRoleId(selectedRowsState[0].id);
    setMenuAuthorityVisible(true);
  };

  // -----------------------------??????????????????---------------------------------??????

  const handleCancelElementAuthorityModal = () => {
    setElementAuthorityVisible(false);
    setModuleInfo1([]);
    setCheckAll([]);
    setIndeterminate([]);
    setAllCheckListId([]);
    setRoleId([]);
  };

  const handleShowElementAuthorityModal = async () => {
    if (selectedRowsState.length !== 1) return;
    const params = {role_id:selectedRowsState[0].id};
    const { data }  = await getModuleElementInfoByRole(params);
    data.moduleInfo.map((item: { elementIdList: string | any[]; checkedList: string | any[]; }, index: string | number) => {
      if(item.elementIdList.length===item.checkedList.length&&(item.elementIdList.length!==0)) {
        setCheckAll(
          () => {
            checkAll[index] = true;
            return [...checkAll]
          }
        )
      }
      if(item.elementIdList.length!==item.checkedList.length&&item.checkedList.length>0){
        setIndeterminate(
          ()=>{
            indeterminate[index] = true;
            return [...indeterminate]
          }
        )
      }
      if(item.elementIdList.length===item.checkedList.length&&item.checkedList.length>0){
        setIndeterminate(
          ()=>{
            indeterminate[index] = false;
            return [...indeterminate]
          }
        )
      }
      return true;
    });
    setModuleInfo1(data.moduleInfo);
    setAllCheckListId(data.allCheckListId);
    setRoleId(selectedRowsState[0].id);
    setElementAuthorityVisible(true);
  };


  const handleCancelOperationAuthorityModal = () => {
    setOperationAuthorityVisible(false);
    setModuleInfo2([]);
    setCheckAll([]);
    setIndeterminate([]);
    setAllCheckListId([]);
    setRoleId([]);
  };

  const handleShowOperationAuthorityModal = async () => {
    if (selectedRowsState.length !== 1) return;
    const params = {role_id:selectedRowsState[0].id};
    const { data }  = await getModuleOperationInfoByRole(params);
    data.moduleInfo.map((item: { operationIdList: string | any[]; checkedList: string | any[]; }, index: string | number) => {
      if(item.operationIdList.length===item.checkedList.length&&(item.operationIdList.length!==0)) {
        setCheckAll(
          () => {
            checkAll[index] = true;
            return [...checkAll]
          }
        )
      }
      if(item.operationIdList.length!==item.checkedList.length&&item.checkedList.length>0){
        setIndeterminate(
          ()=>{
            indeterminate[index] = true;
            return [...indeterminate]
          }
        )
      }
      if(item.operationIdList.length===item.checkedList.length&&item.checkedList.length>0){
        setIndeterminate(
          ()=>{
            indeterminate[index] = false;
            return [...indeterminate]
          }
        )
      }
      return true;
    });
    setModuleInfo2(data.moduleInfo);
    setAllCheckListId(data.allCheckListId);
    setRoleId(selectedRowsState[0].id);
    setOperationAuthorityVisible(true);
  };

  return (
    <PageContainer title={false} className={styles.PageContainer}>
      <ProCard split="vertical" bordered headerBordered style={{height:700}}>
        <ProCard colSpan="300px" className={styles.CarStyle} style={{overflow: 'auto',height:650}}>
          <OrgTreeList
            treeData={treeData}
            handleOnSelectTree={handleOnSelectTree}
            loopIconItem={loopIconItem}
          />
        </ProCard>
        <ProCard>
          <ProTable<RoleInfoItem>
            headerTitle="??????????????????"
            actionRef={actionRef}
            rowKey="id"
            toolBarRender={(action, { selectedRows }) => [
              <Button type="primary"></Button>,
              (type==='1')&&addForm("????????????",<Button type="primary" onClick={() => {setAddVisible(true);}}><PlusOutlined/>??????</Button>,"ModalForm"),
              selectedRows && selectedRows.length === 1 && (updateForm("????????????",<Button key="edit" onClick={() => {setUpdateVisible(true);}}><EditOutlined />??????</Button>,"ModalForm",selectedRows[0])),
              selectedRows && selectedRows.length > 0 && (
                <span>
                 <Dropdown overlay={menu(selectedRowsState.map((row) => row.id))}><Button>????????????<DownOutlined /></Button></Dropdown>
                </span>
              ),
              selectedRows && selectedRows.length === 1 && (<Button key="edit" onClick={() => handleShowRoleToUserListModal()}><UserOutlined />????????????</Button>),
              selectedRows && selectedRows.length === 1 && (<Button key="edit" onClick={() => handleShowMenuAuthorityModal()}><MenuOutlined />????????????</Button>),
              selectedRows && selectedRows.length === 1 && (<Button key="edit" onClick={() => handleShowElementAuthorityModal()}><ProfileOutlined />????????????</Button>),
              selectedRows && selectedRows.length === 1 && (<Button key="operation" onClick={() => handleShowOperationAuthorityModal()}><SlackOutlined />????????????</Button>),
            ]}
            params={{"selectKey": selectKey,"type":type}}
            request={async (params, sorter, filter) => {
              const { data } = await queryRoleList({...params, sorter, filter});
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
      <RoleToUserListModal
        handleCancelModal={handleCancelRoleToUserListModal}
        visible={roleToUserVisible}
        infoValue={infoValue}
        actionRef={roleToUserListActionRef}
      />
      <MenuAuthorityModal
        handleCancelModal={handleCancelMenuAuthorityModal}
        visible={menuAuthorityVisible}
        treeData={treeMenuData}
        checkedKeys={checkedKeys}
        setCheckedKeys={setCheckedKeys}
        roleId={roleId}
      />
      <ElementAuthorityModal
        handleCancelModal={handleCancelElementAuthorityModal}
        visible={elementAuthorityVisible}
        moduleInfo={moduleInfo1}
        checkAll={checkAll}
        allCheckListId={allCheckListId}
        setCheckAll={setCheckAll}
        roleId={roleId}
        indeterminate={indeterminate}
        setIndeterminate={setIndeterminate}
      />

      <OperationAuthorityModal
        handleCancelModal={handleCancelOperationAuthorityModal}
        visible={operationAuthorityVisible}
        moduleInfo={moduleInfo2}
        checkAll={checkAll}
        allCheckListId={allCheckListId}
        setCheckAll={setCheckAll}
        roleId={roleId}
        indeterminate={indeterminate}
        setIndeterminate={setIndeterminate}
      />
    </PageContainer>
  );
};

export default RoleInfoList;
