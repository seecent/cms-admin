import React, { PureComponent } from 'react';
import { Table } from 'antd';
import { injectIntl, formatDateTimeStr } from '../../utils/common';
import styles from './OperLogTable.less';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@injectIntl()
class OperLogTable extends PureComponent {
  handleTableChange = (pagination, filters, sorter) => {
    const filterValues = Object.keys(filters).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filters[key]);
      return newObj;
    }, {});

    const params = {
      offset: (pagination.current - 1) * pagination.pageSize,
      limit: pagination.pageSize,
      ...filterValues,
    };

    if (sorter.field) {
      if (sorter.order === 'ascend') {
        params.sort = `${sorter.field}`;
      } else {
        params.sort = `-${sorter.field}`;
      }
    }
    this.props.onChange(params);
  }

  render() {
    const { data: { list, pagination }, loading, intl } = this.props;

    const columns = [
      {
        title: intl.formatMessage({ id: 'OperationLog.create_date' }),
        width: 180,
        dataIndex: 'create_date',
        key: 'create_date',
        render: (text) => {
          return formatDateTimeStr(text);
        },
        sorter: true,
      }, {
        title: intl.formatMessage({ id: 'OperationLog.name' }),
        width: 160,
        key: 'name',
        dataIndex: 'name',
        sorter: true,
      },
      {
        title: intl.formatMessage({ id: 'OperationLog.detail' }),
        key: 'detail',
        dataIndex: 'detail',
      }, {
        title: intl.formatMessage({ id: 'OperationLog.user' }),
        width: 100,
        key: 'username',
        dataIndex: 'username',
        sorter: true,
      }, {
        title: intl.formatMessage({ id: 'OperationLog.ip' }),
        width: 120,
        key: 'ip_address',
        dataIndex: 'ip_address',
        sorter: true,
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    return (
      <div className={styles.standardTable}>
        <Table
          loading={loading}
          rowKey={record => record.id}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default OperLogTable;
