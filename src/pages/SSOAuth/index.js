import React, { Component } from 'react';
import { Spin } from 'antd';
import styles from './index.less';

export default class SSOAuth extends Component {
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div className={styles.main}><Spin tip="Loading..." size="large" /></div>
    );
  }
}
