import React from 'react';
import { Table, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import styles from './OrgTable.less';
import DropOption from '../../components/DropOption';
import { Operation } from '../../utils/enums';
import { formatDateTimeStr } from '../../utils/common';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

class OrgTable extends React.PureComponent {
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
    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }
    this.setState({ selectedRowKeys });
  }

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

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  render() {
    const { selectedRowKeys } = this.state;

    const { data: { list, pagination }, loading, intl, onEditItem, onDeleteItem } = this.props;

    const handleMenuClick = (record, e) => {
      if (e.key === Operation.UPDATE) {
        onEditItem(record);
      } else if (e.key === Operation.DELETE) {
        Modal.confirm({
          title: intl.formatMessage({ id: 'Organization.delete.confirm' }),
          onOk() {
            onDeleteItem(record.id);
          },
        });
      }
    };

    const updateMsg = intl.formatMessage({ id: 'Ops.update' });
    const deleteMsg = intl.formatMessage({ id: 'Ops.delete' });
    const menuOptions = [
      { key: Operation.UPDATE, name: updateMsg },
      { key: Operation.DELETE, name: deleteMsg },
    ];

    const orgTypeList = [
      {
        text: intl.formatMessage({ id: 'OrgType.Company' }),
        value: 'Company',
      }, {
        text: intl.formatMessage({ id: 'OrgType.Branch' }),
        value: 'Branch',
      }, {
        text: intl.formatMessage({ id: 'OrgType.Department' }),
        value: 'Department',
      },
    ];

    // const orgStatusList = [
    //   {
    //     text: intl.formatMessage({ id: 'OrgStatus.Active' }),
    //     value: 'Active',
    //   }, {
    //     text: intl.formatMessage({ id: 'OrgStatus.Locked' }),
    //     value: 'Locked',
    //   },
    // ];

    const creatDropOption = (record) => {
      return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={menuOptions} />;
    };

    const columns = [
      {
        title: intl.formatMessage({ id: 'Organization.code' }),
        dataIndex: 'code',
        key: 'code',
        sorter: true,
      }, {
        title: intl.formatMessage({ id: 'Organization.name' }),
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => <Link to={`organizations/show?id=${record.id}`}>{text}</Link>,
        sorter: true,
      }, {
        title: intl.formatMessage({ id: 'Organization.short_name' }),
        dataIndex: 'short_name',
        key: 'short_name',
      }, {
        title: intl.formatMessage({ id: 'Organization.parent' }),
        dataIndex: 'parent',
        key: 'parent',
      }, {
        title: intl.formatMessage({ id: 'Organization.org_type' }),
        dataIndex: 'org_type',
        key: 'org_type',
        filters: orgTypeList,
        filterMultiple: false,
        render: (text) => {
          return intl.formatMessage({ id: text });
        },
      }, {
        title: intl.formatMessage({ id: 'Organization.create_date' }),
        dataIndex: 'create_date',
        key: 'create_date',
        render: (text) => {
          return formatDateTimeStr(text);
        },
        sorter: true,
      }, {
        title: intl.formatMessage({ id: 'Organization.operation' }),
        key: 'operation',
        width: 100,
        render: (record) => {
          return creatDropOption(record);
        },
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
      <div className={styles.userTable}>
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

export default injectIntl(OrgTable);
