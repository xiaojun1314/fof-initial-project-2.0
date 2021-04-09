import React, { useState } from 'react';
import { message } from 'antd';
import { saveSubCompanyInfo, checkSubCompanyCode, editSubCompanyInfo } from '../service';
import { ProFormText, ProFormDigit } from '@ant-design/pro-form';
import type { FormInstance } from 'antd/lib/form';
import type { TreeItem } from '../data.d';

export interface SubCompanyProps {
  openType: any;
  control: JSX.Element | undefined;
  record: TreeItem;
  unitTreeData: () => void;
  Components: any;
  handleOrgTreeById: any;
  actionRef: any;
  paneKey: string;
  subCompanyVisible: any;
  setSubCompanyVisible: any;
}

const SubCompanyModal: React.FC<SubCompanyProps> = (props) => {
  const { openType,control,record,unitTreeData,Components,handleOrgTreeById,paneKey,actionRef,subCompanyVisible,setSubCompanyVisible} = props;

  const [btnDisabled, setBtnDisabled] = useState<boolean>(false);

  const FormComponents = Components[openType];

  const formRef = React.createRef<FormInstance>();

  const TypeProps =(openType==='ModalForm')?{modalProps:{maskClosable:false,keyboard:false,closable:false,destroyOnClose:true}}:{drawerProps:{onClose:()=> formRef.current!.resetFields()}};

  const handleAdd = async (fields: any) => {
    setBtnDisabled(true);
    const hide = message.loading('正在添加');
    try {
      await saveSubCompanyInfo(fields);
      hide();
      message.success('添加成功');
      return true;
    } catch (error) {
      hide();
      message.error('添加失败请重试！');
      return false;
    }finally{
      setSubCompanyVisible(false);
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
      await editSubCompanyInfo(fields);
      hide();
      message.success('更新成功');
      return true;
    } catch (error) {
      hide();
      message.error('更新失败请重试！');
      return false;
    }finally{
      setSubCompanyVisible(false);
      const params = {id:record.id,type:"1"};
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
      title="分部信息"
      trigger={control}
      visible={subCompanyVisible}
      width={600}
      onFinish={
        async (values: any) => {
          if(record.id===undefined) {
            handleAdd(values);
          }else{
            handleUpdate(values);
          }
        }}
      submitter={{ submitButtonProps: { disabled: btnDisabled },resetButtonProps: {disabled: btnDisabled,onClick: () => {setSubCompanyVisible(false)}}}}
      formRef={formRef}
      initialValues={{...record,foreignId:record.foreignId}}
      {...TypeProps}
    >
      <ProFormText name="id" hidden />
      <ProFormText name="foreignId" hidden />
      <ProFormText name="name" label="分部名称" placeholder="请输入分部名称" rules={[{ required: true, message: '请输入分部名称！' }]} />
      <ProFormText name="code" label="分部编码" placeholder="请输入分部编码" rules={[{ required: true, message: '请输入分部编码' },{validator: async (rule, value) => {
          const params: any = {'code':value,oldCode:record.code,id:record.id};
          const { data } = await checkSubCompanyCode(params);
          if(!data.checkResult){
            throw new Error('该分部编码已经存在！');
          }
        }}]} />
      <ProFormText name="description" label="分部描述" placeholder="请输入分部描述" rules={[{ required: true, message: '请输入分部描述！' }]} />
      <ProFormDigit label="序号" placeholder="请输入序号" name="order_no" min={1} max={100} />
    </FormComponents>
  );
};

export default SubCompanyModal;
