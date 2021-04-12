// import React from 'react';
// import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';

export default () => (
  <DefaultFooter
    copyright="2021 平台测试中"
    links={[
      {
        key: '测试中..',
        title: '测试中..',
        href: '#',
        blankTarget: false,
      },
      /**
      {
        key: 'github',
        title: <GithubOutlined />,
        href: 'https://github.com/ant-design/ant-design-pro',
        blankTarget: true,
      },
      {
        key: 'Ant Design',
        title: 'Ant Design',
        href: 'https://ant.design',
        blankTarget: true,
      },
       */
    ]}
  />
);
