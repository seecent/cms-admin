import React from 'react';
import { Table, Modal, Icon } from 'antd';
import { formatMessage } from 'umi/locale';
import DropOption from '@/components/DropOption';
import { Operation } from '@/utils/enums';
import CollapseTextArea from './CollapseTextArea';
import styles from './MenusTable.less';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

class MenusTable extends React.PureComponent {
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

  render() {
    const { data: { list }, loading, onEditItem, onDeleteItem } = this.props;

    const handleMenuClick = (record, e) => {
      if (e.key === Operation.UPDATE) {
        onEditItem(record);
      } else if (e.key === Operation.DELETE) {
        Modal.confirm({
          title: formatMessage({ id: 'Menus.delete.title' }),
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
        title: formatMessage({ id: 'Menus.code' }),
        width: 120,
        key: 'code',
        dataIndex: 'code',
        sorter: true,
      }, {
        title: formatMessage({ id: 'Menus.name' }),
        width: 120,
        key: 'name',
        dataIndex: 'name',
        render: (value) => formatMessage({ id: value }),
        sorter: true,
      }, {
        title: formatMessage({ id: 'Menus.icon' }),
        width: 100,
        key: 'icon',
        dataIndex: 'icon',
        render: (value) => <Icon type={value} />,
      }, {
        title: formatMessage({ id: 'Menus.url' }),
        key: 'url',
        dataIndex: 'url',
        render: (value) => <CollapseTextArea text={value} len={40} />,
      }, {
        title: formatMessage({ id: 'Menus.grade' }),
        width: 100,
        key: 'grade',
        dataIndex: 'grade',
        sorter: true,
        render: (value) => {
          switch (value) {
            case 1:
              return '一级菜单';
            case 2:
              return '二级菜单';
            case 3:
              return '三级菜单';
            default:
              return null;
          }
        },
      }, {
        title: formatMessage({ id: 'Menus.permissions' }),
        key: 'permissions',
        dataIndex: 'permissions',
      }, {
        title: formatMessage({ id: 'Ops.operation' }),
        key: 'operation',
        width: 100,
        render: (record) => creatDropOption(record),
      },
    ];

    return (
      <div className={styles.menusTable}>
        <Table
          loading={loading}
          rowKey={record => record.rowkey}
          dataSource={list}
          columns={columns}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default MenusTable;
