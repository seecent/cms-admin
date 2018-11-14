import React from 'react';
import { connect } from 'dva';
import { Card, Form } from 'antd';
import { injectIntl } from '../../utils/common';
import Filter from './Filter';
import OperLogTable from './OperLogTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './index.less';

const defaultPage = { offset: 0, limit: 10 };

@connect(state => ({
  operationLog: state.operationLog,
}))
@Form.create()
@injectIntl()
export default class OprationLog extends React.PureComponent {
  state = {
    searchValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'operationLog/fetch',
      payload: defaultPage,
    });
  }

  handleTableChange = (params) => {
    const { dispatch } = this.props;
    const { searchValues } = this.state;

    dispatch({
      type: 'operationLog/fetch',
      payload: { ...params, ...searchValues },
    });
  }

  handleSearch = (params) => {
    const { dispatch } = this.props;
    this.setState({
      searchValues: params,
    });
    dispatch({
      type: 'operationLog/fetch',
      payload: { ...params, ...defaultPage },
    });
  }

  handleFilterReset = () => {
    const { dispatch } = this.props;
    this.setState({
      searchValues: {},
    });
    dispatch({
      type: 'operationLog/fetch',
      payload: defaultPage,
    });
  }

  render() {
    const { operationLog: { list, pagination, loading } } = this.props;

    return (
      <PageHeaderLayout title="操作日志">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Filter
                onSearch={this.handleSearch}
                onReset={this.handleFilterReset}
              />
            </div>
            <OperLogTable
              loading={loading}
              data={{ list, pagination }}
              onChange={this.handleTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
