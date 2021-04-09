import React, { useState, useRef, useEffect, FC } from 'react';
import { Card,Row,Col } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { AuthorityInfoItem } from './data.d';
import { queryAuthorityList,queryAuthorityCountInfo} from './service';
import styles from './style.less';

const AuthorityInfoList: React.FC = () => {

  return (
    <PageContainer title={false} className={styles.PageContainer}>

    </PageContainer>
  );
};

export default AuthorityInfoList;
