import React from 'react';
import { Table, Modal } from 'antd';
import { formatMessage } from 'umi/locale';
import { Link } from 'react-router-dom';
import styles from './WxAccountTable.less';
import DropOption from '@/components/DropOption';
import { Operation } from '@/utils/enums';
import { formatDateTimeStr } from '@/utils/common';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

class WxAccountTable extends React.PureComponent {
  state = {
    selectedRowKeys: [],
  };

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: [],
      });
    }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }
    this.setState({ selectedRowKeys });
  };

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
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  render() {
    const { selectedRowKeys } = this.state;

    const accountStatusList = [
      {
        text: formatMessage({ id: 'AccountStatus.Active' }),
        value: 'Active',
      }, {
        text: formatMessage({ id: 'AccountStatus.Locked' }),
        value: 'Locked',
      }, {
        text: formatMessage({ id: 'AccountStatus.Removed' }),
        value: 'Removed',
      },
    ];

    const { data: { list, pagination }, loading, onEditItem, onDeleteItem, onEditMenu } = this.props;
    const handleMenuClick = (record, e) => {
      if (e.key === Operation.UPDATE) {
        onEditItem(record);
      } else if (e.key === Operation.DELETE) {
        Modal.confirm({
          title: formatMessage({ id: 'wxaccount.delete.title' }),
          onOk() {
            onDeleteItem(record.id);
          },
        });
      } else {
        onEditMenu(record);
      }
    };

    const updateMsg = formatMessage({ id: 'Ops.update' });
    const deleteMsg = formatMessage({ id: 'Ops.delete' });
    const menuOptions = [
      { key: Operation.UPDATE, name: updateMsg },
      { key: Operation.DELETE, name: deleteMsg },
    ];

    const creatDropOption = (record) => <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={menuOptions} />;

    const columns = [
      {
        title: formatMessage({ id: 'wxaccount.code' }),
        key: 'code',
        dataIndex: 'code',
        render: (text, record) => <Link to={`/weixin/wxaccount/show?id=${record.id}`}>{text}</Link>,
        sorter: true,
      },
      {
        title: formatMessage({ id: 'wxaccount.name' }),
        key: 'name',
        dataIndex: 'name',
        sorter: true,
      }, {
        title: formatMessage({ id: 'wxaccount.refresh_time' }),
        dataIndex: 'refresh_time',
        key: 'refresh_time',
        render: (text) => formatDateTimeStr(text),
        sorter: true,
      }, {
        title: formatMessage({ id: 'wxaccount.effective_time' }),
        dataIndex: 'effective_time',
        key: 'effective_time',
        render: (text) => formatDateTimeStr(text),
        sorter: true,
      },
      {
        title: formatMessage({ id: 'wxaccount.status' }),
        dataIndex: 'status',
        key: 'status',
        filters: accountStatusList,
        filterMultiple: false,
        render: (text) => formatMessage({ id: text }),
      }, {
        title: formatMessage({ id: 'Ops.operation' }),
        key: 'operation',
        width: 100,
        render: (record) => creatDropOption(record),
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    const rowSelection = {
      type: 'radio',
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    return (
      <div className={styles.standardTable}>
        <Table
          loading={loading}
          rowKey={record => record.id}
          rowSelection={rowSelection}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default WxAccountTable;
