import React from 'react';
import { Table, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { formatMessage } from 'umi/locale';
import styles from './FolderTable.less';
import DropOption from '@/components/DropOption';
import { Operation } from '@/utils/enums';
import { formatDateTimeStr } from '@/utils/common';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

class FolderTable extends React.PureComponent {
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
  }

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
    const { selectedRowKeys } = this.state;

    const { data: { list, pagination }, loading, onEditItem, onDeleteItem } = this.props;

    const handleMenuClick = (record, e) => {
      if (e.key === Operation.UPDATE) {
        onEditItem(record);
      } else if (e.key === Operation.DELETE) {
        Modal.confirm({
          title: formatMessage({ id: 'Folder.delete.confirm' }),
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

    const columns = [
      {
        title: formatMessage({ id: 'Folder.code' }),
        dataIndex: 'code',
        key: 'code',
        sorter: true,
      }, {
        title: formatMessage({ id: 'Folder.name' }),
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => <Link to={`/material/folder?parentId=${record.id}`}>{text}</Link>,
        sorter: true,
      }, {
        title: formatMessage({ id: 'Folder.parent' }),
        dataIndex: 'parent.name',
        key: 'parent',
      }, {
        title: formatMessage({ id: 'Folder.description' }),
        dataIndex: 'description',
        key: 'description',
      }, {
        title: formatMessage({ id: 'Folder.created_date' }),
        dataIndex: 'created_date',
        key: 'created_date',
        render: (text) => formatDateTimeStr(text),
        sorter: true,
      }, {
        title: formatMessage({ id: 'Folder.operation' }),
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
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    return (
      <div className={styles.folderTable}>
        <Table
          size="middle"
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

export default FolderTable;
