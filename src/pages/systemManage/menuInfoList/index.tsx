import React, { useState,useEffect} from 'react';
import { Button, Descriptions, message, Modal } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { DrawerForm, ModalForm, ProFormDigit, ProFormRadio, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import type { FormInstance } from 'antd/lib/form';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {loopIconItem,IconMenuMap}  from '@/utils/common';
import MenuTreeList from './modal/MenuTreeList';
import { queryMenuTreeInfo, queryMenuInfoById, removeMenuInfo, saveMenuInfo, editMenuInfo } from './service';
import styles from './style.less';

const Components = { ModalForm, DrawerForm};
const MenuTreeInfoList: React.FC = () => {
  const [treeData, setTreeData] = useState([]);
  const [card1visible, setCard1visible] = useState(false);
  const [card2visible, setCard2visible] = useState(true);
  const [btnDisabled, setBtnDisabled] = useState<boolean>(false);
  const [treeValue, setTreeValue] = useState<any>({id: '0'});
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const [updateVisible, setUpdateVisible] = useState<boolean>(false);
  const [iconValue, setIconValue] = useState<any>();

  /* 获取树型全部数据 */
  const handleMenuTreeInfo = async () => {
    const { data }  = await queryMenuTreeInfo();
    setTreeData(data.unitTreeData);
  }

  useEffect(() => {handleMenuTreeInfo();}, []);

  /* 通过ID获取一条树型数据 */
  const handleMenuTreeById = async (params: { id: any}) => {
    const { data }  = await queryMenuInfoById(params);
    setTreeValue(data.entity);
    const Icon = IconMenuMap[data.entity.icon];
    setIconValue(<Icon />);
  }

  const handleOnSelectMenuTree = async (selectedKeys: React.Key[]) => {
    if (selectedKeys[0] === undefined) {
      message.warning('操作异常');
      return;
    }
    const selectedKey=selectedKeys[0];
    if(selectedKey==='root'){
      setCard1visible(false);
      setCard2visible(true);
      setTreeValue({id: '0'});
    }else{
      const params = {id:selectedKey};
      const { data }  = await queryMenuInfoById(params);
      setTreeValue(data.entity);
      setCard1visible(true);
      setCard2visible(false);
      const Icon = IconMenuMap[data.entity.icon];
      setIconValue(<Icon />);
    }
  };

  // =====================================创建操作=====================================begin
  const handleAdd = async (fields: any) => {
    setBtnDisabled(true);
    const hide = message.loading('正在添加');
    try {
      await saveMenuInfo(fields);
      hide();
      message.success('添加成功');
      return true;
    } catch (error) {
      hide();
      message.error('添加失败请重试！');
      return false;
    }finally{
      setAddVisible(false);
      handleMenuTreeInfo();
      setBtnDisabled(false);
    }
  };

  // const dropdownContent=(<div className={styles.iconsList} ><Button type="dashed" icon={<DeleteOutlined />}/><Button type="dashed" icon={<DeleteOutlined />}/><Button type="dashed" icon={<DeleteOutlined />}/><Button type="dashed" icon={<DeleteOutlined />}/><Button type="dashed" icon={<DeleteOutlined />}/><Button type="dashed" icon={<DeleteOutlined />}/><Button type="dashed" icon={<DeleteOutlined />}/><Button type="dashed" icon={<DeleteOutlined />}/><Button type="dashed" icon={<DeleteOutlined />}/><Button type="dashed" icon={<DeleteOutlined />}/></div>);

  const [selectOption, setSelectOption] = useState<any>();

  const addForm =(title: string,control: JSX.Element | undefined,record: any, openType: string,type: string) => {
    const FormComponents = Components[openType];
    const formRef = React.createRef<FormInstance>();
    const addSelectItem = (item: string) => {
      const Icon = IconMenuMap[item];
      setSelectOption([{label: <Icon />,value: item}]);
      formRef.current!.setFieldsValue({icon: item});
    };

  const dropdownContent =() =>{
    const content=Object.keys(IconMenuMap).map((item) => {
      const Icon = IconMenuMap[item];
      return (<Button type="dashed" icon={<Icon />}  onClick={()=>addSelectItem(item)}/>)
    });
    return (<div className={styles.iconsList}>{content}</div>)
  };
    const TypeProps =(openType==='ModalForm')?{modalProps:{maskClosable:false,keyboard:false,closable:false,destroyOnClose:true}}:{drawerProps:{onClose:()=> formRef.current!.resetFields()}};
    return (
      <FormComponents
        title={title}
        trigger={control}
        visible={addVisible}
        width={600}
        layout="horizontal"
        onFinish={(values: any)=>handleAdd(values)}
        submitter={{ submitButtonProps: { disabled: btnDisabled },resetButtonProps: {disabled: btnDisabled,onClick: () => {setAddVisible(false)}}}}
        formRef={formRef}
        initialValues={record}
        {...TypeProps}
      >
        <ProFormText name="id" hidden />
        <ProFormText name="parent_id" hidden />
        {type==='0'&& (<ProFormRadio.Group name="is_leaf" label="组叶节点" initialValue="0" options={[{ label: '组', value: '0'}, { label: '子叶节点', value: '1'}] } rules={[{ required: true, message: '请输入组叶节点！'}]}/>)}
        {type==='1'&& (<ProFormRadio.Group name="is_leaf" label="组叶节点" initialValue="0" options={[{ label: '组', value: '0'}, { label: '子叶节点', value: '1'}]} rules={[{ required: true, message: '请输入组叶节点！'}]}/>)}
        <ProFormText name="name" label="节点名称" placeholder="请输入节点名称" rules={[{ required: true, message: '请输入节点名称！' }]} />
        <ProFormText name="title" label="菜单标题" placeholder="请输入菜单标题" rules={[{ required: true, message: '请输入菜单标题！' }]} />
        <ProFormText name="url" label="菜单地址" placeholder="请输入菜单地址" rules={[{ required: true, message: '请输入菜单地址！' }]} />
        <ProFormText name="description" label="详细描述" placeholder="请输入详细描述" rules={[{ required: true, message: '请输入详细描述！' }]} />
        <ProFormDigit name="order_no" label="节点序号" placeholder="请输入节点序号" rules={[{ required: true, message: '请输入节点序号！' }]} min={1} max={100000 } />
        <ProFormRadio.Group name="is_hide" label="是否隐藏" initialValue="0" options={[{ label: '显示', value: '0'}, { label: '隐藏', value: '1', }]} rules={[{ required: true, message: '请输入是否隐藏！'}]}/>
        {(type==='1')&& (<ProFormText name="parentName" label="上级菜单" readonly />)}
        <ProFormSelect
          name="icon"
          label="菜单图标"
          rules={[{ required: true, message: '请选择菜单图标！' }]}
          fieldProps={{ dropdownRender:dropdownContent,options:selectOption}}
        />
      </FormComponents>);
  }
  // =====================================创建操作=====================================end

  // =====================================更新操作=====================================begin

  const handleUpdate = async (fields: any) => {
    const hide = message.loading('正在更新');
    try {
      await editMenuInfo(fields);
      hide();
      message.success('更新成功');
      return true;
    } catch (error) {
      hide();
      message.error('更新失败请重试！');
      return false;
    }finally{
      setUpdateVisible(false);
      const params = {id:fields.id,type:"0"};
      handleMenuTreeById(params);
      handleMenuTreeInfo();
      setBtnDisabled(false);
    }
  };

  const updateForm =(title: string,control: JSX.Element | undefined,record: any, openType: string,type: string) => {
    const FormComponents = Components[openType];
    const formRef = React.createRef<FormInstance>();
    const TypeProps =(openType==='ModalForm')?{modalProps:{maskClosable:false,keyboard:false,closable:false,destroyOnClose:true}}:{drawerProps:{onClose:()=> formRef.current!.resetFields()}};

    const addSelectItem = (item: string) => {
      const Icon = IconMenuMap[item];
      setSelectOption([{label: <Icon />,value: item}]);
      formRef.current!.setFieldsValue({icon: item});
    };

    const dropdownContent =() =>{
      const content=Object.keys(IconMenuMap).map((item) => {
        const Icon = IconMenuMap[item];
        return (<Button type="dashed" icon={<Icon />}  onClick={()=>addSelectItem(item)}/>)
      });
      return (<div className={styles.iconsList}>{content}</div>)
    };
    return (
      <FormComponents
        title={title}
        trigger={control}
        visible={updateVisible}
        width={600}
        layout="horizontal"
        onFinish={(values: any)=>handleUpdate(values)}
        submitter={{ submitButtonProps: { disabled: btnDisabled },resetButtonProps: {disabled: btnDisabled,onClick: () => {setUpdateVisible(false)}}}}
        formRef={formRef}
        {...TypeProps}
        initialValues={record}
      >
        <ProFormText name="id" hidden />
        <ProFormText name="parent_id" hidden />
        {type==='0'&& (<ProFormRadio.Group name="is_leaf" label="组叶节点" options={[{ label: '组', value: '0'}, { label: '子叶节点', value: '1'}] } rules={[{ required: true, message: '请输入组叶节点！'}]}/>)}
        {type==='1'&& (<ProFormRadio.Group name="is_leaf" label="组叶节点" options={[{ label: '组', value: '0'}, { label: '子叶节点', value: '1'}]} disabled rules={[{ required: true, message: '请输入组叶节点！'}]}/>)}
        <ProFormText name="name" label="节点名称" placeholder="请输入节点名称" rules={[{ required: true, message: '请输入节点名称！' }]} />
        <ProFormText name="title" label="菜单标题" placeholder="请输入菜单标题" rules={[{ required: true, message: '请输入菜单标题！' }]} />
        <ProFormText name="url" label="菜单地址" placeholder="请输入菜单地址" rules={[{ required: true, message: '请输入菜单地址！' }]} />
        <ProFormText name="description" label="详细描述" placeholder="请输入详细描述" rules={[{ required: true, message: '请输入详细描述！' }]} />
        <ProFormDigit name="order_no" label="节点序号" placeholder="请输入节点序号" rules={[{ required: true, message: '请输入节点序号！' }]} min={1} max={100000 } />
        <ProFormRadio.Group name="is_hide" label="是否隐藏" options={[{ label: '显示', value: '0'}, { label: '隐藏', value: '1', }]} rules={[{ required: true, message: '请输入是否隐藏！'}]}/>
        {(type==='1')&& (<ProFormText name="parentName" label="上级菜单" readonly />)}
        <ProFormSelect
          name="icon"
          label="菜单图标"
          rules={[{ required: true, message: '请选择菜单图标！' }]}
          fieldProps={{ dropdownRender:dropdownContent,options:selectOption}}
        />
      </FormComponents>);
  }

  // =====================================更新操作=====================================end

  const handleRemove = async (id: any) => {
    setBtnDisabled(true);
    const hide = message.loading('正在删除');
    try {
      const params = { "id": id };
      await removeMenuInfo(params);
      hide();
      message.success('操作成功');
      return true;
    } catch (error) {
      hide();
      message.error('删除失败，请重试');
      return false;
    }finally{
      handleMenuTreeInfo();
      setCard1visible(false);
      setCard2visible(true);
      setTreeValue({id: '0'});
      setBtnDisabled(false);
    }
  };

  const handleMenuClick= (id: any)=>{
    Modal.confirm({
      title: '删除信息',
      content: '确定删除该信息吗？',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      cancelText: '取消',
      okButtonProps: {disabled:btnDisabled},
      onOk:() => handleRemove(id),
    });
  };

  const createBarExtraContent =() =>{
    if(treeValue.id==='0'){
      return addForm("新建菜单信息",<Button type="primary" onClick={() => {setAddVisible(true);}}><PlusOutlined/>新建</Button>, {parentName:"ROOT",parent_id:"0"} ,"ModalForm","0");
    }
    if(treeValue.id!=='0'){
      return (
        <>
          {treeValue.is_leaf==='0'&& addForm("新建菜单信息",<Button type="primary" style={{ marginLeft: 8 }} onClick={() => {setAddVisible(true);}}><PlusOutlined/>新建</Button>, {parent_id:treeValue.id} ,"ModalForm","0")}
          {updateForm("更新菜单信息",<Button style={{ marginLeft: 8 }} onClick={() => {
            const Icon = IconMenuMap[treeValue.icon];
            setSelectOption([{label: <Icon />,value: treeValue.icon}]);
            setUpdateVisible(true);
          }}><EditOutlined />编辑</Button>,treeValue,"ModalForm","1")}
          <Button style={{ marginLeft: 8 }} onClick={()=>handleMenuClick(treeValue.id)}><DeleteOutlined />删除</Button>
        </>
      )
    }
    return <></>;
  };

  return (
    <PageContainer title={false} className={styles.PageContainer}>
      <ProCard title="菜单列表" extra={createBarExtraContent()} split="vertical" bordered headerBordered style={{height:700}}>
        <ProCard colSpan="300px" className={styles.CarStyle} style={{overflow: 'auto',height:650}}>
          <MenuTreeList
            treeData={treeData}
            handleOnSelectMenuTree={handleOnSelectMenuTree}
            loopIconItem={loopIconItem}
          />
        </ProCard>
        <ProCard className={styles.CarStyle}>
          <div hidden={card1visible}>
            <br />
            <Descriptions column={1} labelStyle={{width:'50%',paddingLeft:"30%",marginTop:"10px"}} contentStyle={{marginTop:"10px",borderBottom:"1px solid #f0f0f0"}}>
              <Descriptions.Item label="菜单名称">root</Descriptions.Item>
            </Descriptions>
          </div>
          <div hidden={card2visible}>
            <br />
            <Descriptions column={1} labelStyle={{width:'50%',paddingLeft:"30%",marginTop:"10px"}} contentStyle={{marginTop:"10px",borderBottom:"1px solid #f0f0f0"}}>
              <Descriptions.Item label="组叶节点">{treeValue.isLeafText}</Descriptions.Item>
              <Descriptions.Item label="节点名称">{treeValue.name}</Descriptions.Item>
              <Descriptions.Item label="菜单序号">{treeValue.order_no}</Descriptions.Item>
              <Descriptions.Item label="上级菜单">{treeValue.parentName}</Descriptions.Item>
              <Descriptions.Item label="菜单标题">{treeValue.title}</Descriptions.Item>
              <Descriptions.Item label="菜单地址">{treeValue.url}</Descriptions.Item>
              <Descriptions.Item label="菜单图标">{iconValue} </Descriptions.Item>
              <Descriptions.Item label="菜单描述">{treeValue.description}</Descriptions.Item>
              <Descriptions.Item label="是否隐藏">{treeValue.isHideText}</Descriptions.Item>
            </Descriptions>
          </div>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};
export default MenuTreeInfoList;
