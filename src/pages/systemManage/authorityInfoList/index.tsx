import React, { useState, useRef, useEffect, FC } from 'react';
import { Card,Row,Col } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { AuthorityInfoItem } from './data.d';
import { queryAuthorityList,queryAuthorityCountInfo} from './service';
import styles from './style.less';

const AuthorityInfoList: React.FC = () => {

  const actionRef = useRef<ActionType>();

  const [authorityData, setAuthorityData] = useState({ menuCount: 0, operationCount: 0, fileCount: 0, elementCount: 0});

  const getAuthorityData = async () => {
    const { data }  = await queryAuthorityCountInfo();
    setAuthorityData(data.authorityData);
  }

  useEffect(() => {getAuthorityData();}, []);

  const Info: FC<{
    title: React.ReactNode;
    value: React.ReactNode;
    bordered?: boolean;
  }> = ({ title, value, bordered }) => (
    <div className={styles.headerInfo}>
      <span>{title}</span>
      <p>{value}</p>
      {bordered && <em />}
    </div>
  );

// =====================================更多操作=====================================end

  const columns: ProColumns<AuthorityInfoItem>[] = [
    { title: '权限名称', key: 'name', dataIndex: 'name', order: 3, sorter: true, width: '25%', ellipsis: true },
    { title: '权限类型', key: 'type', dataIndex: 'type', order: 2, sorter: true, width: '25%', ellipsis: true, render:(text,record) => (record.typeText),valueType: 'select', valueEnum :{ 0: '访问权限', 1: '元素可见权限', 2: '操作权限', 3: '修改权限', } },
    { title: '描述', key: 'description', dataIndex: 'description', order: 1, sorter: true, width: '25%', ellipsis: true },
    { title: '创建时间', key: 'create_time', dataIndex: 'create_time', hideInSearch: true, sorter: true, width: '24%', ellipsis: true,valueType:"dateTime"},
  ];

  return (
    <PageContainer title={false} className={styles.PageContainer}>
      <Card bordered={false} style={{ marginTop: 2 }}>
        <Card bordered={false} className={styles.headerCard}>
          <Row>
            <Col sm={6} xs={24}>
              <Info title="访问权限" value={authorityData.menuCount} bordered />
            </Col>
            <Col sm={6} xs={24}>
              <Info title="操作权限" value={authorityData.operationCount} bordered />
            </Col>
            <Col sm={6} xs={24}>
              <Info title="修改权限" value={authorityData.fileCount} bordered/>
            </Col>
            <Col sm={6} xs={24}>
              <Info title="元素的可见性控制" value={authorityData.elementCount} />
            </Col>
          </Row>
        </Card>
        <ProTable<AuthorityInfoItem>
          headerTitle="权限列表"
          actionRef={actionRef}
          rowKey="id"
          request={async (params, sorter, filter) => {
            const { data }= await queryAuthorityList({...params, sorter, filter});
            actionRef.current?.clearSelected?.();
            return data;
          }}
          columns={columns}
          options={{ reload: true, density: false, setting: true, fullScreen: false }}
          search={{ labelWidth: 'auto' }}
          pagination={{ pageSize: 5, showQuickJumper: true, showSizeChanger: true }}
          tableAlertRender={false}
          size='small'
        />
      </Card>
    </PageContainer>
  );
};

export default AuthorityInfoList;
