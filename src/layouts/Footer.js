import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        {
          key: '首页',
          title: '首页',
          href: '#',
          blankTarget: true,
        },
        {
          key: '帮助',
          title: '帮助',
          href: '#',
          blankTarget: true,
        },
        {
          key: '关于',
          title: '关于',
          href: '#',
          blankTarget: true,
        },
      ]}
    />
  </Footer>
);
export default FooterView;
