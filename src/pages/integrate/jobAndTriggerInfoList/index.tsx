import React, { useState, useRef, useEffect, FC } from 'react';
import { FormInstance } from 'antd/lib/form';
import { Card, Row, Col, Button, Dropdown, message, Menu, Modal } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type {JobAndTriggerInfoItem } from './data.d';
import { queryJobAndTriggerList,queryJobAndTriggerCountInfo,saveJobAndTriggerInfo,checkJobName,checkJobClassName,editJobAndTriggerInfo,removeJobAndTriggerInfo} from './service';
import styles from './style.less';
import { DeleteOutlined, DownOutlined, EditOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { DrawerForm, ModalForm, ProFormText,ProFormDateTimeRangePicker,ProFormSelect } from '@ant-design/pro-form';

const Info: FC<{ title: React.ReactNode; value: React.ReactNode; bordered?: boolean; }> = ({ title, value, bordered }) => (
  <div className={styles.headerInfo}>
    <span>{title}</span>
    <p>{value}</p>
    {bordered && <em />}
  </div>
);

const AuthorityInfoList: React.FC = () => {

  const actionRef = useRef<ActionType>();

  const [selectedRowsState, setSelectedRows] = useState<JobAndTriggerInfoItem[]>([]);

  const [btnDisabled, setBtnDisabled] = useState<boolean>(false);

  const Components = { ModalForm, DrawerForm};

  const [addVisible, setAddVisible] = useState<boolean>(false);

  const [updateVisible, setUpdateVisible] = useState<boolean>(false);

  const [jobAndTriggerData, setJobAndTriggerData] = useState({ acquiredCount: 0, pausedCount: 0, errorCount: 0 });

  const getJobAndTriggerData = async () => {
    const { data }  = await queryJobAndTriggerCountInfo();
    setJobAndTriggerData(data.jobAndTriggerData);
  }

  useEffect(() => {getJobAndTriggerData();}, []);

  // =====================================添加操作=====================================begin

  const handleAdd = async (fields: JobAndTriggerInfoItem) => {
    setBtnDisabled(true);
    const hide = message.loading('正在添加');
    try {
      await saveJobAndTriggerInfo(fields);
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
      >
        <ProFormText name="jobName" label="任务名称" rules={[{ required: true, message: '请输入任务名称' },
          {pattern:new RegExp('^[\u4e00-\u9fa5]+$','g'),message:'任务名称必须为汉字!'
        },{validator:async (rule, value) => {
              const params: any = { 'jobName': value };
              const { data } = await checkJobName(params);
              if (!data.checkResult) {
                throw new Error('该任务名称已经存在！');
              }
            },
        }]}/>
        <ProFormText name="jobClassName" label="任务标识" rules={[{ required: true, message: '请输入任务类标识' }, {
          validator: async (rule, value) => {
            const params: any = { 'jobClassName': value };
            const { data } = await checkJobClassName(params);
            if (!data.checkResult) {
              throw new Error('该任务类标识已经存在！');
            }
          },
        }]}/>
        <ProFormText name="cronExpression" label="任务公式" rules={[{ required: true, message: '请输入任务时间表达式' }]}/>
        <ProFormDateTimeRangePicker
          transform={(values) => {
          return {
            startTime: values ? values[0] : undefined,
            endTime: values ? values[1] : undefined,
          };
        }} name="createTimeRanger" label="任务日期" rules={[{ required: true, message: '请输入任务日期' }]}/>
        <ProFormText name="jobDescription" label="任务描述" rules={[{ required: true, message: '请输入任务描述' }]}/>
        <ProFormSelect
          name="triggerState"
          label="任务状态"
          valueEnum={{
            ACQUIRED: '正常执行',
            PAUSED: '暂停',
          }}
          placeholder="请选择任务状态"
          rules={[{ required: true, message: '请选择任务状态!' }]}
        />
      </FormComponents>);
  }
  // =====================================添加操作=====================================end

  // =====================================更新操作=====================================begin

  const handleUpdate = async (fields: JobAndTriggerInfoItem) => {
    const hide = message.loading('正在更新');
    try {
      await editJobAndTriggerInfo(fields);
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


  const updateForm = (title: string,control: JSX.Element | undefined, openType: string, record: JobAndTriggerInfoItem) => {

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
        formRef={formRef}
        {...TypeProps}
        initialValues={{...record,createTimeRanger:[record.startTime,record.endTime],triggerState:(record.triggerState===undefined||record.triggerState==="WAITING"||record.triggerState==="BLOCKED"?"ACQUIRED":record.triggerState)}}
      >
        <ProFormText name="jobName" label="任务名称" rules={[{ required: true, message: '请输入任务名称' },
          {pattern:new RegExp('^[\u4e00-\u9fa5]+$','g'),message:'任务名称必须为汉字!'
          },{validator:async (rule, value) => {
              const params: any = { 'jobName': value,oldJobName:record.jobName};
              const { data } = await checkJobName(params);
              if (!data.checkResult) {
                throw new Error('该任务名称已经存在！');
              }
            },
          }]} disabled/>
        <ProFormText name="jobClassName" label="任务标识" rules={[{ required: true, message: '请输入任务类标识' }, {
          validator: async (rule, value) => {
            const params: any = { 'jobClassName': value,oldJobClassName:record.jobClassName };
            const { data } = await checkJobClassName(params);
            if (!data.checkResult) {
              throw new Error('该任务类标识已经存在！');
            }
          },
        }]} disabled/>
        <ProFormText name="cronExpression" label="任务公式" rules={[{ required: true, message: '请输入任务时间表达式' }]}/>
        <ProFormDateTimeRangePicker
          transform={(values) => {
            return {
              startTime: values ? values[0] : undefined,
              endTime: values ? values[1] : undefined,
            };
          }} name="createTimeRanger" label="任务日期" rules={[{ required: true, message: '请输入任务日期' }]}/>
        <ProFormText name="jobDescription" label="任务描述" rules={[{ required: true, message: '请输入任务描述' }]}/>
        <ProFormSelect
          name="triggerState"
          label="任务状态"
          valueEnum={{
            ACQUIRED: '正常执行',
            PAUSED: '暂停',
          }}
          placeholder="请选择任务状态"
          rules={[{ required: true, message: '请选择任务状态!' }]}
        />
      </FormComponents>);
  }


  // =====================================更新操作=====================================end

  const handleRemove = async () => {
    setBtnDisabled(true);
    const hide = message.loading('正在删除');
    if (selectedRowsState.length === 0) return true;
    try {
      await removeJobAndTriggerInfo({ 'jobNames': selectedRowsState.map(row => row.jobName).toString()});
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

  const handleMenuClick = (key: React.ReactText) => {
    if (selectedRowsState.length === 0) return;
    switch (key) {
      case 'remove':
        Modal.confirm({
          title: '删除信息',
          content: '确定删除该信息吗？',
          icon: <ExclamationCircleOutlined />,
          okText: '确认',
          okButtonProps: {disabled:btnDisabled},
          cancelText: '取消',
          onOk:()=>handleRemove(),
        });
        break;
      default:
        break;
    }
  };

  const menu =()=> (
    <Menu onClick={({ key }) => handleMenuClick(key)} selectedKeys={[]}>
      {<Menu.Item key="remove"><DeleteOutlined />删除</Menu.Item>}
    </Menu>
  );


// =====================================更多操作=====================================end

  const columns: ProColumns<JobAndTriggerInfoItem>[] = [
    { title: '任务名称', key: 'jobName', dataIndex: 'jobName', sorter: true, width: '14%', ellipsis: true },
    { title: '任务表达式', key: 'cronExpression', dataIndex: 'cronExpression', sorter: true, width: '14%', ellipsis: true},
    { title: '开启时间', key: 'startTime', dataIndex: 'startTime', sorter: true, width: '14%', ellipsis: true },
    { title: '结束时间', key: 'endTime', dataIndex: 'endTime', sorter: true, width: '12%', ellipsis: true,},
    { title: '任务类名', key: 'jobClassName', dataIndex: 'jobClassName',sorter: true, width: '14%', ellipsis: true},
    { title: '触发器状态', key: 'triggerStateName', dataIndex: 'triggerStateName', sorter: true, width: '15%', ellipsis: true},
    { title: '描述', key: 'jobDescription', dataIndex: 'jobDescription', sorter: true, width: '15%', ellipsis: true},
  ];

  return (
    <PageContainer title={false} className={styles.PageContainer}>
      <Card bordered={false} style={{ marginTop: 2 }}>
        <Card bordered={false} className={styles.headerCard}>
          <Row>
            <Col sm={8} xs={24}>
              <Info title="执行任务" value={jobAndTriggerData.acquiredCount} bordered />
            </Col>
            <Col sm={8} xs={24}>
              <Info title="暂停任务" value={jobAndTriggerData.pausedCount} bordered />
            </Col>
            <Col sm={8} xs={24}>
              <Info title="作废任务" value={jobAndTriggerData.errorCount} bordered/>
            </Col>
          </Row>
        </Card>
        <ProTable<JobAndTriggerInfoItem>
          headerTitle="计划任务列表"
          actionRef={actionRef}
          rowKey="jobName"
          toolBarRender={(action, { selectedRows }) => [
            addForm("新增信息",<Button type="primary" onClick={() => {setAddVisible(true);}}><PlusOutlined/>新建</Button>,"ModalForm"),
            selectedRows && selectedRows.length === 1 && (updateForm("更新用户信息",<Button key="edit" onClick={() => {setUpdateVisible(true);}}><EditOutlined />编辑</Button>,"ModalForm",selectedRows[0])),
            selectedRows && selectedRows.length > 0 && (
            <span>
              <Dropdown overlay={menu()}><Button>更多操作<DownOutlined /></Button></Dropdown>
            </span>
            )
          ]}
          request={async (params, sorter, filter) => {
            const { data }= await queryJobAndTriggerList({...params, sorter, filter});
            actionRef.current?.clearSelected?.();
            return data;
          }}
          columns={columns}
          options={{ reload: true, density: false, setting: true, fullScreen: false }}
          search={{ labelWidth: 'auto' }}
          pagination={{ pageSize: 5, showQuickJumper: true, showSizeChanger: true }}
          rowSelection={{ onChange: (_, selectedRows: any []) => setSelectedRows(selectedRows) }}
          tableAlertRender={false}
          size='small'
        />
      </Card>
    </PageContainer>
  );
};

export default AuthorityInfoList;
