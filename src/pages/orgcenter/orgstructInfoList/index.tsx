import React, { useState, useRef, useEffect } from 'react';
import { Button, Tabs, Breadcrumb, Descriptions, Dropdown, Menu, Modal, message } from 'antd';
import { ClusterOutlined, DeleteOutlined, DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import type { ActionType } from '@ant-design/pro-table';
import { DrawerForm, ModalForm } from '@ant-design/pro-form';
import { queryOrgTreeInfo,queryOrgTreeById,removeDepartmentInfo,removeSubCompanyInfo } from './service';
import type { TreeItem, TreeBreadcrumbItem } from './data.d';
import {loopIconItem}  from '@/utils/common';
import OrgTreeList from './modal/OrgTreeList';
import CompanyModal from './modal/CompanyModal';
import SubCompanyModal from './modal/SubCompanyModal';
import DepartmentModal from './modal/DepartmentModal';
import SubCompanyList from './modal/SubCompanyList';
import DepartmentList from './modal/DepartmentList';
import styles from './style.less';

const { TabPane } = Tabs;

const Components = { ModalForm, DrawerForm};

const OrgstructInfoList: React.FC = () => {

  const [treeData, setTreeData] = useState([]);

  const [paneKey, setPaneKey] = useState("1");

  const [card1visible, setCard1visible] = useState(false);

  const [card2visible, setCard2visible] = useState(false);

  const [type, setType] = useState("-1");

  const [treeValue, setTreeValue] = useState<any>({});

  const [treeBreadcrumb, setTreeBreadcrumb] = useState<TreeBreadcrumbItem>({ fourLevel: '', threeLevel: '', twoLevel: '',oneLevel: ''} );

  const [selectedRows, setSelectedRows] = useState<TreeItem[]>([]);

  const [btnDisabled, setBtnDisabled] = useState<boolean>(false);

  const [companyVisible, setCompanyVisible] = useState<boolean>(false);

  const [subCompanyVisible, setSubCompanyVisible] = useState<boolean>(false);

  const [departmentVisible, setDepartmentVisible] = useState<boolean>(false);


  const unitTreeData = async () => {
    const params = {'findType':"ALL"};
    const { data }  = await queryOrgTreeInfo(params);
    setTreeData(data.unitTreeData);
  }

  useEffect(() => {unitTreeData();}, []);


  const handleOrgTreeById = async (params: { id: any; type: any; }) => {
    const { data }  = await queryOrgTreeById(params);
    setTreeValue(data.entity);
    setTreeBreadcrumb(data.treeBreadcrumb);
  }

  const handleOnSelectTree=  (selectedKeys: React.Key[],info: any) => {
    if (selectedKeys[0] === undefined) {
      return;
    }
    const selectedKey=selectedKeys["0"];
    if(selectedKey==='root'){
      setType("-1")
      setCard1visible(false);
      setCard2visible(true);
    }else{
      setType(info.selectedNodes[0].type);
      const params = {id:selectedKey,type:info.selectedNodes[0].type};
      handleOrgTreeById(params);
      setCard1visible(true);
      setCard2visible(false);
    }
    setSelectedRows([]);
    setPaneKey("1");
  };

  const title= (<Breadcrumb>
    {(type==='-1')&&(<Breadcrumb.Item ><ClusterOutlined /><span>????????????</span></Breadcrumb.Item>)}
    {(type!=='-1')&&(
      <>
        <Breadcrumb.Item ><ClusterOutlined/><span>{treeBreadcrumb.oneLevel}</span></Breadcrumb.Item>
        <Breadcrumb.Item ><span>{treeBreadcrumb.twoLevel}</span></Breadcrumb.Item>
        {(type==='1'||type==='2')&&(<Breadcrumb.Item ><span>{treeBreadcrumb.threeLevel}</span></Breadcrumb.Item>)}
        {(type==='2')&&(<Breadcrumb.Item ><span>{treeBreadcrumb.fourLevel}</span></Breadcrumb.Item>)}
      </>)
    }
  </Breadcrumb>);



  const companyForm =(control: JSX.Element | undefined,record: any, openType: string)=>
    (<CompanyModal
      openType = {openType}
      control = {control}
      record = {record}
      unitTreeData={() => unitTreeData()}
      Components={Components}
      handleOrgTreeById={(params: any)=>handleOrgTreeById(params)}
      companyVisible={companyVisible}
      setCompanyVisible={setCompanyVisible}
    />);

  const subCompanyActionRef = useRef<ActionType>();
  const subCompanyForm =(control: JSX.Element | undefined,record: any, openType: string)=>
    (<SubCompanyModal
      openType = {openType}
      control = {control}
      record = {record}
      unitTreeData={() => unitTreeData()}
      Components={Components}
      handleOrgTreeById={(params: any)=>handleOrgTreeById(params)}
      actionRef={subCompanyActionRef}
      paneKey={paneKey}
      subCompanyVisible={subCompanyVisible}
      setSubCompanyVisible={setSubCompanyVisible}
    />);

  const departmentActionRef = useRef<ActionType>();
  const departmentForm =(control: JSX.Element | undefined,record: any, openType: string)=>
    (<DepartmentModal
      openType = {openType}
      control = {control}
      record = {record}
      unitTreeData={() => unitTreeData()}
      Components={Components}
      handleOrgTreeById={(params: any)=>handleOrgTreeById(params)}
      actionRef={departmentActionRef}
      paneKey={paneKey}
      departmentVisible={departmentVisible}
      setDepartmentVisible={setDepartmentVisible}
    />);


  const handleDeleteDepartmentInfo = async (ids: string | any[]) => {
    setBtnDisabled(true);
    const hide = message.loading('????????????');
    if (ids.length===0) return true;
    try {
      const params = { "ids": ids };
      await removeDepartmentInfo(params);
      hide();
      message.success('????????????');
      return true;
    } catch (error) {
      hide();
      message.error('????????????????????????');
      return false;
    }finally{
      unitTreeData();
      setSelectedRows([]);
      departmentActionRef.current?.reload?.();
      setBtnDisabled(false);
    }
  };

  const handleSubCompanyRemove = async (ids: string | any[]) => {
    setBtnDisabled(true);
    const hide = message.loading('????????????');
    if (ids.length===0) return true;
    try {
      const params = { "ids": ids };
      await removeSubCompanyInfo(params);
      hide();
      message.success('????????????');
      return true;
    } catch (error) {
      hide();
      message.error('????????????????????????');
      return false;
    } finally{
      unitTreeData();
      setSelectedRows([]);
      subCompanyActionRef.current?.reload?.();
      setBtnDisabled(false);
    }
  };

  const handleMenuClick = (key: React.ReactText ,ids: any[]) => {
    if (ids.length === 0) return;
    switch (key) {
      case 'removeDepartment':
        Modal.confirm({
          title: '????????????',
          content: '???????????????????????????',
          icon: <ExclamationCircleOutlined />,
          okText: '??????',
          okButtonProps: {disabled:btnDisabled},
          cancelText: '??????',
          onOk:()=>handleDeleteDepartmentInfo(ids),
        });
        break;
      case 'removeSubCompany':
        Modal.confirm({
          title: '????????????',
          content: '???????????????????????????',
          icon: <ExclamationCircleOutlined />,
          okText: '??????',
          okButtonProps: {disabled:btnDisabled},
          cancelText: '??????',
          onOk:()=>handleSubCompanyRemove(ids),
        });
        break;
      default:
        break;
    }
  };

  const departmentMenu = (
    <Menu onClick={({ key }) => handleMenuClick(key,selectedRows.map((row) => row.id))} selectedKeys={[]}>
      <Menu.Item key="removeDepartment"><DeleteOutlined />??????</Menu.Item>
    </Menu>
  );

  const subCompanyMenu = (
    <Menu onClick={({ key }) => handleMenuClick(key,selectedRows.map((row) => row.id))} selectedKeys={[]}>
      <Menu.Item key="removeSubCompany"><DeleteOutlined />??????</Menu.Item>
    </Menu>
  );

  const createBarExtraContent =() =>{
    if(type==="-1"){
      return companyForm(<Button type="primary" onClick={() => {setCompanyVisible(true);}}>????????????</Button>, {} ,"ModalForm");
    }
    if(type==="0"&&paneKey==='1'){
      return <>{subCompanyForm(<Button type="primary" style={{ marginLeft: 8 }} onClick={() => {setSubCompanyVisible(true);}}>????????????</Button>, {'foreignId':treeValue.id},"ModalForm")} {companyForm(<Button type="primary" style={{ marginLeft: 8 }} onClick={() => {setCompanyVisible(true);}}>????????????</Button>,treeValue,"ModalForm")}</>;
    }
    if(type==="0"&&paneKey==='2'){
      return <>{subCompanyForm(<Button type="primary" style={{ marginLeft: 8 }} onClick={() => {setSubCompanyVisible(true);}}>????????????</Button>, {'foreignId':treeValue.id},"ModalForm")}{selectedRows.length>0&&<span style={{ marginLeft: 8 }}><Dropdown overlay={subCompanyMenu}><Button>????????????<DownOutlined /></Button></Dropdown></span>}</>;
    }
    if(type==="1"&&paneKey==='1'){
      return <>{departmentForm(<Button type="primary" style={{ marginLeft: 8 }} onClick={() => {setDepartmentVisible(true);}}>????????????</Button>, {'foreignId':treeValue.id,'parent_id':treeValue.id},"ModalForm")} {subCompanyForm(<Button type="primary" style={{ marginLeft: 8 }} onClick={() => {setSubCompanyVisible(true);}}>????????????</Button>,treeValue,"ModalForm")}</>;
    }
    if(type==="1"&&paneKey==='2'){
      return <>{departmentForm(<Button type="primary" style={{ marginLeft: 8 }} onClick={() => {setDepartmentVisible(true);}}>????????????</Button>, {'foreignId':treeValue.id,'parent_id':treeValue.id},"ModalForm")}{selectedRows.length>0&&<span style={{ marginLeft: 8 }}><Dropdown overlay={departmentMenu}><Button>????????????<DownOutlined /></Button></Dropdown></span>}</>;
    }
    if(type==="2"&&paneKey==='1'){
      return <><Button type="primary" style={{ marginLeft: 8 }} >????????????</Button>{departmentForm(<Button type="primary" style={{ marginLeft: 8 }} onClick={() => {setDepartmentVisible(true);}}>??????????????????</Button>, {'foreignId':treeValue.foreignId,'parent_id':treeValue.parent_id},"ModalForm")}{departmentForm(<Button type="primary" style={{ marginLeft: 8 }} onClick={() => {setDepartmentVisible(true);}}>??????</Button>, treeValue,"ModalForm")}</>;
    }
    if(type==="2"&&paneKey==='2'){
      return <>{departmentForm(<Button type="primary" style={{ marginLeft: 8 }} onClick={() => {setDepartmentVisible(true);}}>??????????????????</Button>, {'foreignId':treeValue.foreignId,'parent_id':treeValue.id},"ModalForm")}{selectedRows.length>0&&<span style={{ marginLeft: 8 }}><Dropdown overlay={departmentMenu}><Button>????????????<DownOutlined /></Button></Dropdown></span>}</>;
    }
    if(type==="2"&&paneKey==='3'){
      return <><Button type="primary" style={{ marginLeft: 8 }}>????????????</Button><Button type="primary" style={{ marginLeft: 8 }}>????????????</Button></>;
    }
    return <></>;
  };

  const onTabChange = (key: React.SetStateAction<string>) => {
    setPaneKey(key);
    if(type==="0"&&key==='2'){
      subCompanyActionRef.current?.reload?.();
    }
    if((type==="1"&&key==='2')||(type==="2"&&key==='2')){
      departmentActionRef.current?.reload?.();
    }
    setSelectedRows([]);
  }
  return (
    <PageContainer title={false} className={styles.PageContainer}>
      <ProCard title={title} extra={createBarExtraContent()} split="vertical" bordered headerBordered style={{height:700}}>
        <ProCard colSpan="300px" className={styles.CarStyle} style={{overflow: 'auto',height:650}}>
          <OrgTreeList
            treeData={treeData}
            handleOnSelectTree={handleOnSelectTree}
            loopIconItem={loopIconItem}
          />
        </ProCard>
        <ProCard className={styles.CarStyle}>
          <div hidden={card1visible}>
            <br />
            <Descriptions column={1} labelStyle={{width:'50%',paddingLeft:"30%",marginTop:"10px"}} contentStyle={{marginTop:"10px",borderBottom:"1px solid #f0f0f0"}}>
              <Descriptions.Item label="????????????">????????????</Descriptions.Item>
              <Descriptions.Item label="????????????">??????????????????</Descriptions.Item>
            </Descriptions>
          </div>
          <div hidden={card2visible} >
            {(type==="0")&&(
              <Tabs activeKey={paneKey} onTabClick={(key) => {onTabChange(key);}}>
                <TabPane tab="????????????" key="1" style={{width:'100%'}} forceRender={false}>
                  <br />
                  <Descriptions column={1} labelStyle={{width:'50%',paddingLeft:"30%",marginTop:"10px"}} contentStyle={{marginTop:"10px",borderBottom:"1px solid #f0f0f0"}}>
                    <Descriptions.Item label="????????????">{treeValue.name}</Descriptions.Item>
                    <Descriptions.Item label="????????????">{treeValue.code}</Descriptions.Item>
                    <Descriptions.Item label="????????????">{treeValue.description}</Descriptions.Item>
                    <Descriptions.Item label="????????????">{treeValue.order_no}</Descriptions.Item>
                  </Descriptions>
                </TabPane>
                <TabPane tab="????????????" key="2" forceRender={false}>
                  <SubCompanyList
                    treeValue={treeValue}
                    actionRef={subCompanyActionRef}
                    setSelectedRows={setSelectedRows}
                  />
                </TabPane>
              </Tabs>
            )}
            {(type==="1")&& (
              <Tabs activeKey={paneKey} onTabClick={(key) => {onTabChange(key);}}>
                <TabPane tab="????????????" key="1" style={{width:'100%'}} forceRender={false}>
                  <br />
                  <Descriptions column={1} labelStyle={{width:'50%',paddingLeft:"30%",marginTop:"10px"}} contentStyle={{marginTop:"10px",borderBottom:"1px solid #f0f0f0"}}>
                    <Descriptions.Item label="????????????">{treeValue.name}</Descriptions.Item>
                    <Descriptions.Item label="????????????">{treeValue.code}</Descriptions.Item>
                    <Descriptions.Item label="????????????">{treeValue.description}</Descriptions.Item>
                    <Descriptions.Item label="????????????">{treeValue.order_no}</Descriptions.Item>
                  </Descriptions>
                </TabPane>
                <TabPane tab="????????????" key="2" forceRender={false}>
                  <DepartmentList
                    treeValue={treeValue}
                    actionRef={departmentActionRef}
                    setSelectedRows={setSelectedRows}
                  />
                </TabPane>
              </Tabs>
            )}
            {(type==="2")&& (
              <Tabs activeKey={paneKey} onTabClick={(key) => {onTabChange(key);}}>
                <TabPane tab="????????????" key="1" style={{width:'100%'}} forceRender={false}>
                  <br />
                  <Descriptions column={1} labelStyle={{width:'50%',paddingLeft:"30%",marginTop:"10px"}} contentStyle={{marginTop:"10px",borderBottom:"1px solid #f0f0f0"}}>
                    <Descriptions.Item label="????????????">{treeValue.name}</Descriptions.Item>
                    <Descriptions.Item label="????????????">{treeValue.code}</Descriptions.Item>
                    <Descriptions.Item label="????????????">{treeValue.description}</Descriptions.Item>
                    <Descriptions.Item label="????????????">{treeValue.order_no}</Descriptions.Item>
                  </Descriptions>
                </TabPane>
                <TabPane tab="????????????" key="2" forceRender={false}>
                  <DepartmentList
                    treeValue={treeValue}
                    actionRef={departmentActionRef}
                    setSelectedRows={setSelectedRows}
                  />
                </TabPane>
                <TabPane tab="????????????" key="3" forceRender={false}>
                  ????????????
                </TabPane>
              </Tabs>
            )}
          </div>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};
export default OrgstructInfoList;
