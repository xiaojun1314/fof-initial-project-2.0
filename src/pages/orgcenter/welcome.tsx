import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card} from 'antd';
import styles from '@/pages/systemManage/userInfoList/style.less';



export default (): React.ReactNode => {

  return (
    <PageContainer title={false} className={styles.PageContainer}>
      <Card>组织管理-欢迎页面</Card>
    </PageContainer>
  );
};
