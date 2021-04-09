import React, { useState } from 'react';
import { message } from 'antd';
import { saveDepartmentInfo, checkDepartmentCode, editDepartmentInfo } from '../service';
import { ProFormText, ProFormDigit } from '@ant-design/pro-form';
import type { FormInstance } from 'antd/lib/form';
import type { TreeItem } from '../data.d';

export interface DepartmentProps {
  openType: any;
  control: JSX.Element | undefined;
  record: TreeItem;
  unitTreeData: () => void;
  Components: any;
  handleOrgTreeById: any;
  actionRef: any;
  paneKey: string;
  departmentVisible: any;
  setDepartmentVisible: any;
}

const DepartmentModal: React.FC<DepartmentProps> = (props) => {
  const { openType,control,record,unitTreeData,Components,handleOrgTreeById,paneKey,actionRef,departmentVisible,setDepartmentVisible} = props;

  const [btnDisabled, setBtnDisabled] = useState<boolean>(false);

  const FormComponents = Components[openType];

  const formRef = React.createRef<FormInstance>();

  const TypeProps =(openType==='ModalForm')?{modalProps:{maskClosable:false,keyboard:false,closable:false,destroyOnClose:true}}:{drawerProps:{onClose:()=> formRef.current!.resetFields()}};

  const handleAdd = async (fields: any) => {
    setBtnDisabled(true);
    const hide = message.loading('正在添加');
    try {
      await saveDepartmentInfo(fields);
      hide();
      message.success('添加成功');
      return true;
    } catch (error) {
      hide();
      message.error('添加失败请重试！');
      return false;
    }finally{
      setDepartmentVisible(false);
      unitTreeData();
      setBtnDisabled(false);
      if(paneKey==="2"){
        actionRef.current?.reload?.();
      }
    }
  };


  const handleUpdate = async (fields: any) => {
    const hide = message.loading('正在更新');
    try {
      await editDepartmentInfo(fields);
      hide();
      message.success('更新成功');
      return true;
    } catch (error) {
      hide();
      message.error('更新失败请重试！');
      return false;
    }finally{
      setDepartmentVisible(false);
      const params = {id:record.id,type:"2"};
      handleOrgTreeById(params);
      unitTreeData();
      setBtnDisabled(false);
      if(paneKey==="2"){
        actionRef.current?.reload?.();
      }
    }
  };

  return (
    <FormComponents
      title="部门信息"
      trigger={control}
      width={600}
      visible={departmentVisible}
      onFinish={
        async (values: any) => {
          if(record.id===undefined) {
            handleAdd(values);
          }else{
            handleUpdate(values);
          }
        }}
      submitter={{ submitButtonProps: { disabled: btnDisabled },resetButtonProps: {disabled: btnDisabled,onClick: () => {setDepartmentVisible(false)}}}}
      formRef={formRef}
      initialValues={{...record,foreignId:record.foreignId,parent_id:record.parent_id}}
      {...TypeProps}
    >
      <ProFormText name="id" hidden />
      <ProFormText name="foreignId" hidden />
      <ProFormText name="parent_id" hidden />
      <ProFormText name="name" label="部门名称" placeholder="请输入部门名称" rules={[{ required: true, message: '请输入部门名称！' }]} />
      <ProFormText name="code" label="部门编码" placeholder="请输入部门编码" rules={[{ required: true, message: '请输入部门编码' },{validator: async (rule, value) => {
          const params: any = {'code':value,oldCode:record.code,id:record.id};
          const { data } = await checkDepartmentCode(params);
          if(!data.checkResult){
            throw new Error('该部门编码已经存在！');
          }
        }}]} />
      <ProFormText name="description" label="部门描述" placeholder="请输入部门描述" rules={[{ required: true, message: '请输入部门描述！' }]} />
      <ProFormDigit label="序号" placeholder="请输入序号" name="order_no" min={1} max={100} />
    </FormComponents>
  );
};

export default DepartmentModal;
