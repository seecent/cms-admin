import React from 'react';
import { Table, Modal } from 'antd';
import { formatMessage } from 'umi/locale';
import { Link } from 'react-router-dom';
import styles from './RoleTable.less';
import DropOption from '@/components/DropOption';
import { Operation } from '@/utils/enums';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

class RoleTable extends React.PureComponent {
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

    const { data: { list, pagination }, loading, onEditItem, onDeleteItem, onEditMenu } = this.props;

    const handleMenuClick = (record, e) => {
      if (e.key === Operation.UPDATE) {
        onEditItem(record);
      } else if (e.key === Operation.DELETE) {
        Modal.confirm({
          title: formatMessage({ id: 'Role.delete.title' }),
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
      // { key: 'edit-menu', name: '管理菜单' },
    ];

    const creatDropOption = (record) => <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={menuOptions} />;

    const columns = [
      {
        title: formatMessage({ id: 'Role.code' }),
        key: 'code',
        dataIndex: 'code',
        render: (text, record) => <Link to={`role/show?id=${record.id}`}>{text}</Link>,
        sorter: true,
      },
      {
        title: formatMessage({ id: 'Role.name' }),
        key: 'name',
        dataIndex: 'name',
        sorter: true,
      },
      {
        title: formatMessage({ id: 'Role.description' }),
        key: 'description',
        dataIndex: 'description',
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
      type: 'radio',
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    return (
      <div className={styles.RoleTable}>
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

export default RoleTable;
