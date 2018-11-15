import React from 'react';
import { Table, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { formatMessage } from 'umi/locale';
import styles from './UserTable.less';
import DropOption from '@/components/DropOption';
import { Operation } from '@/utils/enums';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

class UserTable extends React.PureComponent {
  // state = {
  //   selectedRowKeys: [],
  // };
  //
  // componentWillReceiveProps(nextProps) {
  //   // clean state
  //   if (nextProps.selectedRows.length === 0) {
  //     this.setState({
  //       selectedRowKeys: [],
  //     });
  //   }
  // }
  //
  // handleRowSelectChange = (selectedRowKeys, selectedRows) => {
  //   if (this.props.onSelectRow) {
  //     this.props.onSelectRow(selectedRows);
  //   }
  //   this.setState({ selectedRowKeys });
  // }

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

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  render() {
    // const { selectedRowKeys } = this.state;

    const { data: { list, pagination }, loading, onEditItem, onDeleteItem } = this.props;

    const handleMenuClick = (record, e) => {
      if (e.key === Operation.UPDATE) {
        onEditItem(record);
      } else if (e.key === Operation.DELETE) {
        Modal.confirm({
          title: formatMessage({ id: 'User.delete.confirm' }),
          onOk() {
            onDeleteItem(record.id);
          },
        });
      }
    };

    const updateMsg = formatMessage({ id: 'Ops.update' });
    const deleteMsg = formatMessage({ id: 'Ops.delete' });
    const menuOptions = [
      { key: Operation.UPDATE, name: updateMsg },
      { key: Operation.DELETE, name: deleteMsg },
    ];

    const creatDropOption = (record) => <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={menuOptions} />;

    const userStatusList = [
      {
        text: formatMessage({ id: 'UserStatus.Active' }),
        value: 'Active',
      }, {
        text: formatMessage({ id: 'UserStatus.Locked' }),
        value: 'Locked',
      }, {
        text: formatMessage({ id: 'UserStatus.Removed' }),
        value: 'Removed',
      },
    ];

    const columns = [
      {
        title: formatMessage({ id: 'User.username' }),
        dataIndex: 'username',
        key: 'username',
        render: (text, record) => <Link to={`users/show?id=${record.id}`}>{text}</Link>,
        sorter: true,
      }, {
        title: formatMessage({ id: 'User.fullname' }),
        dataIndex: 'fullname',
        key: 'fullname',
        sorter: true,
      }, {
        title: formatMessage({ id: 'User.enname' }),
        dataIndex: 'enname',
        key: 'enname',
        sorter: true,
      }, {
        title: formatMessage({ id: 'User.mobile' }),
        dataIndex: 'mobile',
        key: 'mobile',
      }, {
        title: formatMessage({ id: 'User.role' }),
        dataIndex: 'roles',
        key: 'roles',
        render: (record) => {
          if (record) {
            const names = record.map((it) => it.name);
            return names.join(', ');
          }
          return '';
        },
      }, {
        title: formatMessage({ id: 'User.organization' }),
        dataIndex: 'organization.name',
        key: 'organization',
        sorter: true,
      }, {
        title: formatMessage({ id: 'User.department' }),
        dataIndex: 'department',
        key: 'department',
        sorter: true,
      }, {
        title: formatMessage({ id: 'User.status' }),
        dataIndex: 'status',
        key: 'status',
        filters: userStatusList,
        filterMultiple: false,
        render: (text) => formatMessage({ id: text }),
      }, {
        title: formatMessage({ id: 'User.operation' }),
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

    // const rowSelection = {
    //   selectedRowKeys,
    //   onChange: this.handleRowSelectChange,
    //   getCheckboxProps: record => ({
    //     disabled: record.disabled,
    //   }),
    // };

    return (
      <div className={styles.userTable}>
        <Table
          loading={loading}
          rowKey={record => record.id}
          // rowSelection={rowSelection}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default UserTable;
