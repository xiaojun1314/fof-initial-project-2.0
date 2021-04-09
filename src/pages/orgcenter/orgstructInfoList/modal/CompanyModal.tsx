import React, { useState } from 'react';
import { message } from 'antd';
import {saveCompanyInfo,checkCompanyCode,editCompanyInfo } from '../service';
import { ProFormText, ProFormDigit } from '@ant-design/pro-form';
import type { FormInstance } from 'antd/lib/form';
import type { TreeItem } from '../data.d';

export interface CompanyProps {
  openType: any;
  control: JSX.Element | undefined;
  record: TreeItem;
  unitTreeData: () => void;
  Components: any;
  handleOrgTreeById: any;
  companyVisible: any;
  setCompanyVisible: any;
}



const CompanyModal: React.FC<CompanyProps> = (props) => {

  const { openType,control,record,unitTreeData,Components,handleOrgTreeById,companyVisible,setCompanyVisible } = props;

  const [btnDisabled, setBtnDisabled] = useState<boolean>(false);

  const FormComponents = Components[openType];

  const formRef = React.createRef<FormInstance>();

  const TypeProps =(openType==='ModalForm')?{modalProps:{maskClosable:false,keyboard:false,closable:false,destroyOnClose:true}}:{drawerProps:{onClose:()=> formRef.current!.resetFields()}};

  const handleAdd = async (fields: any) => {
    setBtnDisabled(true);
    const hide = message.loading('正在添加');
    try {
      await saveCompanyInfo(fields);
      hide();
      message.success('添加成功');
      return true;
    } catch (error) {
      hide();
      message.error('添加失败请重试！');
      return false;
    }finally{
      setCompanyVisible(false);
      unitTreeData();
      setBtnDisabled(false);
    }
  };

  const handleUpdate = async (fields: any) => {
    const hide = message.loading('正在更新');
    try {
      await editCompanyInfo(fields);
      hide();
      message.success('更新成功');
      return true;
    } catch (error) {
      hide();
      message.error('更新失败请重试！');
      return false;
    }finally{
      setCompanyVisible(false);
      const params = {id:fields.id,type:"0"};
      handleOrgTreeById(params);
      unitTreeData();
      setBtnDisabled(false);
    }
  };

  return (
    <FormComponents
      title="公司信息"
      trigger={control}
      visible={companyVisible}
      width={600}
      onFinish={
        async (values: any) => {
          if(record.id===undefined) {
            handleAdd(values);
          }else{
            handleUpdate(values);
          }
        }
      }
      submitter={{ submitButtonProps: { disabled: btnDisabled },resetButtonProps: {disabled: btnDisabled,onClick: () => {setCompanyVisible(false)}}}}
      formRef={formRef}
      initialValues={record}
      {...TypeProps}
    >
      <ProFormText name="id" hidden />
      <ProFormText name="name" label="公司名称" placeholder="请输入公司名称" rules={[{ required: true, message: '请输入公司名称！' }]} />
      <ProFormText name="code" label="公司编码" placeholder="请输入公司编码" rules={[{ required: true, message: '请输入公司编码' },{validator: async (rule, value) => {
          const params: any = {'code':value,oldCode:record.code,id:record.id};
          const { data } = await checkCompanyCode(params);
          if(!data.checkResult){
            throw new Error('该公司编码已经存在！');
          }
        }}]} />
      <ProFormText name="description" label="公司描述" placeholder="请输入公司描述" rules={[{ required: true, message: '请输入公司描述！' }]} />
      <ProFormDigit label="序号" placeholder="请输入序号" name="order_no" min={1} max={100} />
    </FormComponents>
  );
};

export default CompanyModal;
