import React, { PureComponent } from 'react';
import { Table } from 'antd';
import { formatMessage } from 'umi/locale';
import { formatDateTimeStr } from '@/utils/common';
import styles from './OperLogTable.less';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

class OperLogTable extends PureComponent {
  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
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
    onChange(params);
  }

  render() {
    const { data: { list, pagination }, loading } = this.props;

    const columns = [
      {
        title: formatMessage({ id: 'OperationLog.create_date' }),
        width: 180,
        dataIndex: 'create_date',
        key: 'create_date',
        render: (text) => {
          formatDateTimeStr(text);
        },
        sorter: true,
      }, {
        title: formatMessage({ id: 'OperationLog.name' }),
        width: 160,
        key: 'name',
        dataIndex: 'name',
        sorter: true,
      },
      {
        title: formatMessage({ id: 'OperationLog.detail' }),
        key: 'detail',
        dataIndex: 'detail',
      }, {
        title: formatMessage({ id: 'OperationLog.user' }),
        width: 100,
        key: 'username',
        dataIndex: 'username',
        sorter: true,
      }, {
        title: formatMessage({ id: 'OperationLog.ip' }),
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
