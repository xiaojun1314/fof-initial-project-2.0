import React, { useState } from 'react';
import { message } from 'antd';
import {saveMenuInfo,editMenuInfo } from '../service';
import { ProFormText, ProFormDigit,ProFormRadio } from '@ant-design/pro-form';
import type { FormInstance } from 'antd/lib/form';
import { TreeItem } from '@/pages/orgcenter/orgstructInfoList/data';
// import type { TreeItem } from '../data.d';

export interface MenuTreeProps {
  title: string;
  openType: any;
  type: string;
  btn: JSX.Element | undefined;
  record: TreeItem;
  handleMenuTreeInfo: () => void;
  Components: any;
  handleMenuTreeById: any;
}

const MenuTreeModal: React.FC<MenuTreeProps> = (props) => {

  const { openType,btn,record,Components,type,handleMenuTreeInfo,handleMenuTreeById } = props;

  const [btnDisabled, setBtnDisabled] = useState<boolean>(false);

  const FormComponents = Components[openType];

  const formRef = React.createRef<FormInstance>();

  const TypeProps =(openType==='ModalForm')?{modalProps:{onCancel:()=> formRef.current!.resetFields()}}:{drawerProps:{onClose:()=> formRef.current!.resetFields()}};

  return (
    <FormComponents
      title="菜单信息"
      trigger={btn}
      width={600}
      layout="horizontal"
      onFinish={
        async (values: any) => {
          setBtnDisabled(true);
          if(record.id===undefined) {
            const response = await saveMenuInfo(values);
            if (response.IsSuccess) {
              handleMenuTreeInfo();
              message.success('添加成功');
            } else {
              message.success('添加失败');
            }
          }else{
            const response = await editMenuInfo(values);
            const params = {id:record.id,type:"0"};
            handleMenuTreeById(params);
            if(response.IsSuccess){
              handleMenuTreeInfo();
              message.success('更新成功');
            }else{
              message.success('更新失败');
            }
          }
          setBtnDisabled(false);
          return true;
        }}
      submitter={{submitButtonProps:{disabled:btnDisabled}}}
      onVisibleChange={(visible: boolean) => visible&&(formRef.current!.resetFields())}
      formRef={formRef}
      initialValues={record}
      {...TypeProps}
    >
      <ProFormText name="id" hidden />
      <ProFormText name="parentId" hidden />
      {type==='0'&& (<ProFormRadio.Group name="isLeaf" label="组叶节点" initialValue="0" options={[{ label: '组', value: '0'}, { label: '子叶节点', value: '1'}] } rules={[{ required: true, message: '请输入组叶节点！'}]}/>)}
      {(type==='1'&&record.id===undefined)&& (<ProFormRadio.Group name="isLeaf" label="组叶节点" initialValue="0" options={[{ label: '组', value: '0'}, { label: '子叶节点', value: '1'}]} rules={[{ required: true, message: '请输入组叶节点！'}]}/>)}
      {(type==='1'&&record.id!==undefined)&& (<ProFormRadio.Group name="isLeaf" label="组叶节点" initialValue="0" options={[{ label: '组', value: '0'}, { label: '子叶节点', value: '1'}]} disabled rules={[{ required: true, message: '请输入组叶节点！'}]}/>)}
      <ProFormText name="name" label="节点名称" placeholder="请输入节点名称" rules={[{ required: true, message: '请输入节点名称！' }]} />
      <ProFormText name="title" label="菜单标题" placeholder="请输入菜单标题" rules={[{ required: true, message: '请输入菜单标题！' }]} />
      <ProFormText name="url" label="菜单地址" placeholder="请输入菜单地址" rules={[{ required: true, message: '请输入菜单地址！' }]} />
      <ProFormText name="icon" label="菜单图标" placeholder="请输入菜单图标" rules={[{ required: true, message: '请输入菜单图标！' }]} />
      <ProFormText name="description" label="详细描述" placeholder="请输入详细描述" rules={[{ required: true, message: '请输入详细描述！' }]} />
      <ProFormDigit name="orderNo" label="节点序号" placeholder="请输入节点序号" rules={[{ required: true, message: '请输入节点序号！' }]} min={1} max={100000 } />
      <ProFormRadio.Group name="isHide" label="是否隐藏" initialValue="0" options={[{ label: '显示', value: '0'}, { label: '隐藏', value: '1', }]} rules={[{ required: true, message: '请输入是否隐藏！'}]}/>
      {(type==='1')&& (<ProFormText name="parentName" label="上级菜单" readonly />)}
    </FormComponents>
  );
};

export default MenuTreeModal;
