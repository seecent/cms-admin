import React from 'react';
import { Table, Modal } from 'antd';
import { formatMessage } from 'umi/locale';
import { Link } from 'react-router-dom';
import styles from './WxUserTable.less';
import DropOption from '@/components/DropOption';
import { Operation } from '@/utils/enums';
import { formatEnumStr, formatDateTimeStr } from '@/utils/common';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

class WxUserTable extends React.PureComponent {
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

    const sexTypeList = [
      {
        text: formatMessage({ id: 'wxuser.sextype.unknown' }),
        value: 0,
      }, {
        text: formatMessage({ id: 'wxuser.sextype.male' }),
        value: 1,
      }, {
        text: formatMessage({ id: 'wxuser.sextype.female' }),
        value: 2,
      },
    ];

    const subscribeStatusList = [
      {
        text: formatMessage({ id: 'subscribe.unsubscribe' }),
        value: 0,
      }, {
        text: formatMessage({ id: 'subscribe.subscribe' }),
        value: 1,
      },
    ];

    const { data: { list, pagination }, loading, onEditItem, onDeleteItem, onEditMenu } = this.props;
    const handleMenuClick = (record, e) => {
      if (e.key === Operation.UPDATE) {
        onEditItem(record);
      } else if (e.key === Operation.DELETE) {
        Modal.confirm({
          title: formatMessage({ id: 'wxuser.delete.title' }),
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
        title: formatMessage({ id: 'wxuser.nickname' }),
        key: 'nickname',
        dataIndex: 'nickname',
        render: (text, record) => <Link to={`/weixin/wxuser/show?id=${record.id}`}><span><img src={record.headimgurl} className={styles.headImage} alt="" /> {text}</span></Link>,
        sorter: true,
      }, {
        title: formatMessage({ id: 'wxuser.sex' }),
        key: 'sex',
        dataIndex: 'sex',
        filters: sexTypeList,
        filterMultiple: false,
        render: (text) => formatEnumStr(text, sexTypeList),
      }, {
        title: formatMessage({ id: 'wxuser.city' }),
        key: 'city',
        dataIndex: 'city',
        sorter: true,
      }, {
        title: formatMessage({ id: 'wxuser.province' }),
        key: 'province',
        dataIndex: 'province',
        sorter: true,
      }, {
        title: formatMessage({ id: 'wxuser.subscribe' }),
        dataIndex: 'subscribe',
        key: 'subscribe',
        filters: subscribeStatusList,
        filterMultiple: false,
        render: (text) => formatEnumStr(text, subscribeStatusList),
      }, {
        title: formatMessage({ id: 'wxuser.subscribe_time' }),
        dataIndex: 'subscribe_time',
        key: 'subscribe_time',
        render: (text) => formatDateTimeStr(text),
        sorter: true,
      },
      {
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
      type: 'checkbox',
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

export default WxUserTable;
