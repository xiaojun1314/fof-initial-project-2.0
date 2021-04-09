import React, { useState, useRef, Fragment, useEffect } from 'react';
import { Button, message, Dropdown, Menu, Modal } from 'antd';
import type { FormInstance } from 'antd/lib/form';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined, EditOutlined, DeleteOutlined, DownOutlined, ExclamationCircleOutlined, MoreOutlined,UserOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText,DrawerForm } from '@ant-design/pro-form';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import {loopIconItem}  from '@/utils/common';
import OrgTreeList from './modal/OrgTreeList';
import RoleToUserListModal from './modal/RoleToUserListModal';
import MenuAuthorityModal from './modal/MenuAuthorityModal';
import ElementAuthorityModal from './modal/ElementAuthorityModal';
import { queryRoleList, removeRoleInfo, saveRoleInfo, checkRoleCode, editRoleInfo, queryOrgTreeInfo,queryMenuTreeInfo,getMenuIdsByRoleId,getModuleElementInfoByRole } from './service';
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


  const [addVisible, setAddVisible] = useState<boolean>(false);

  const [updateVisible, setUpdateVisible] = useState<boolean>(false);

  const [treeMenuData, setTreeMenuData] = useState([]);

  const [checkedKeys, setCheckedKeys] = useState([]);

  const [roleId, setRoleId] = useState({});

  const [moduleInfo, setModuleInfo] = useState([]);



  const [checkAll, setCheckAll] = useState([]);



  const [allCheckListId, setAllCheckListId] = useState([]);

  const [indeterminate, setIndeterminate] = useState<any>([]);


  const unitTreeData = async () => {
    const params = {findType:"PART"};
    const { data }  = await queryOrgTreeInfo(params);
    setTreeData(data.unitTreeData);
  }

  useEffect(() => {unitTreeData();}, []);

  // =====================================添加操作=====================================begin

  const handleAdd = async (fields: RoleInfoItem) => {
    setBtnDisabled(true);
    const hide = message.loading('正在添加');
    try {
      await saveRoleInfo(fields);
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
        initialValues={{foreignId:selectKey}}
      >
        <ProFormText name="foreignId" hidden />
        <ProFormText name="name" label="角色名称" rules={[{ required: true, message: '角色名称不能为空！' }, { pattern: new RegExp('^[\u4e00-\u9fa5]+$', 'g'), message: '角色称必须为汉字!', }]}/>
        <ProFormText name="code" label="角色编码" rules={[{ required: true, message: '请输入用户编码' },{ pattern:new RegExp('^[A-Z]+$','g'),message:'分类编码必须为大写字母!' },
        {
        validator: async (rule, value) => {
          const params: any = { 'code': value };
          const { data } = await checkRoleCode(params);
          if (!data.checkResult) {
            throw new Error('该角色编码已经存在！');
          }
        },
      }]}/>
    </FormComponents>);
  }

  // =====================================添加操作=====================================end
  // =====================================更新操作=====================================begin

  const handleUpdate = async (fields: RoleInfoItem) => {
    const hide = message.loading('正在更新');
    try {
      await editRoleInfo(fields);
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
        <ProFormText name="name" label="角色名称" rules={[{ required: true, message: '角色名称不能为空！' },{ pattern:new RegExp('^[\u4e00-\u9fa5]+$','g'),message:'角色名称必须为汉字!'}]}/>
        <ProFormText name="code" label="角色编码" rules={[{ required: true, message: '请输入角色编码' },{ pattern:new RegExp('^[A-Z]+$','g'),message:'分类编码必须为大写字母!'},
          {
            validator: async (rule, value) => {
            const params: any = {'code':value,oldCode:record.code,id:record.id};
            const { data } = await checkRoleCode(params);
            if (!data.checkResult) {
              throw new Error('该角色编码已经存在！');
            }
          }}]}/>
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
      await removeRoleInfo(params);
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

  const columns: ProColumns<RoleInfoItem>[] = [
    { title: '角色名称', key: 'name', dataIndex: 'name', order: 3, sorter: true, width: '25%', ellipsis: true },
    { title: '角色编码', key: 'code', dataIndex: 'code', order: 2, sorter: true, width: '25%', ellipsis: true },
    { title: '所属分部', key: 'subCompanyText', dataIndex: 'subCompanyText',hideInSearch: true, order: 1, sorter: true, width: '25%', ellipsis: true},
    { title: '创建时间', key: 'create_time', dataIndex: 'create_time', hideInSearch: true, width: '24%', ellipsis: true},
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


// ----------------------用户列表操作-------------------

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

  // -----------------------------模块元素权限---------------------------------开始

  const handleCancelElementAuthorityModal = () => {
    setElementAuthorityVisible(false);
    setModuleInfo([]);
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
    setModuleInfo(data.moduleInfo);
    setAllCheckListId(data.allCheckListId);
    setRoleId(selectedRowsState[0].id);
    setElementAuthorityVisible(true);
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
            headerTitle="角色信息列表"
            actionRef={actionRef}
            rowKey="id"
            toolBarRender={(action, { selectedRows }) => [
              <Button type="primary"></Button>,
              (type==='1')&&addForm("新建角色",<Button type="primary" onClick={() => {setAddVisible(true);}}><PlusOutlined/>新建</Button>,"ModalForm"),
              selectedRows && selectedRows.length === 1 && (updateForm("更新角色",<Button key="edit" onClick={() => {setUpdateVisible(true);}}><EditOutlined />编辑</Button>,"ModalForm",selectedRows[0])),
              selectedRows && selectedRows.length > 0 && (
                <span>
                 <Dropdown overlay={menu(selectedRowsState.map((row) => row.id))}><Button>更多操作<DownOutlined /></Button></Dropdown>
                </span>
              ),
              selectedRows && selectedRows.length === 1 && (<Button key="edit" onClick={() => handleShowRoleToUserListModal()}><UserOutlined />分配用户</Button>),
              selectedRows && selectedRows.length === 1 && (<Button key="edit" onClick={() => handleShowMenuAuthorityModal()}><UserOutlined />菜单授权</Button>),
              selectedRows && selectedRows.length === 1 && (<Button key="edit" onClick={() => handleShowElementAuthorityModal()}><UserOutlined />元素授权</Button>),
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
              showQuickJumper: true, // 显示页码跳转器
              showSizeChanger: true, // 显示条数改变器
            }}
            rowSelection={{
              onChange: (_, selectedRows: any []) => setSelectedRows(selectedRows),
            }}
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
        moduleInfo={moduleInfo}
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
