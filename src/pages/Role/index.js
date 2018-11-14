import React from 'react';
import { connect } from 'dva';
import { Card, Form, Button } from 'antd';
import { formatMessage } from 'umi/locale';
import Filter from './Filter';
import RoleModal from './RoleModal';
import RoleTable from './RoleTable';
import TreeModal from './TreeModal';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles from './index.less';

const defaultPage = { offset: 0, limit: 10 };
const namespace = 'role';

@connect(state => ({
  role: state.role,
}))
@Form.create()
class Role extends React.PureComponent {
  state = {
    searchValues: {},
    selectedRows: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/fetch`,
      payload: defaultPage,
    });
  }

  handleRoleTableChange = (params) => {
    const { dispatch } = this.props;
    const { searchValues } = this.state;

    dispatch({
      type: `${namespace}/fetch`,
      payload: { ...params, ...searchValues },
    });
  };

  handleSearch = (params) => {
    const { dispatch } = this.props;
    this.setState({
      searchValues: params,
    });
    dispatch({
      type: `${namespace}/fetch`,
      payload: params,
    });
  };

  handleFilterReset = () => {
    const { dispatch } = this.props;
    this.setState({
      searchValues: {},
    });
    dispatch({
      type: `${namespace}/fetch`,
      payload: defaultPage,
    });
  };

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleEditItem = (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/showModal`,
      payload: {
        currentItem: item,
        modalType: 'update',
        modalVisible: true,
        modalTitle: formatMessage({ id: 'Role.update.title', defaultMessage: 'Update Role' }),
      },
    });
  };

  handleEditMenu = (item) => {
    const { dispatch, role: { list } } = this.props;
    let row;
    if (!item) {
      list.forEach((record) => {
        if (record.id === item) {
          row = record;
        }
      });
    } else {
      row = item;
    }
    dispatch({
      type: `${namespace}/fetchMenus`,
      payload: {
        id: row.id,
        offset: 0,
        limit: 1000,
      },
    });
    dispatch({
      type: `${namespace}/showTreeModal`,
      payload: {
        currentItem: row,
      },
    });
  };

  handleDeleteItem = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/delete`,
      payload: id,
    });
    dispatch({
      type: `${namespace}/fetch`,
      payload: defaultPage,
    });
  };

  showCreateModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/showModal`,
      payload: {
        currentItem: {},
        modalType: 'create',
        modalVisible: true,
        modalTitle: formatMessage({ id: 'Role.create.title' }),
      },
    });
  };

  hideModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/hideModal`,
    });
  };

  handleModelOk = (data) => {
    const { role: { modalType, currentItem }, dispatch } = this.props;
    const payload = { ...data };
    if (modalType === 'update') {
      payload.id = currentItem.id;
    }
    dispatch({
      type: `role/${modalType}`,
      payload,
    });
  };

  hideTreeModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/hideTreeModal`,
    });
  };

  handleTreeModelOk = (data) => {
    const { role: { currentItem }, dispatch } = this.props;
    const payload = { ...data };
    payload.id = currentItem.id;
    dispatch({
      type: `${namespace}/updateMenus`,
      payload,
    });
  };

  render() {
    const {
      role: {
        loading,
        list,
        pagination,
        currentItem,
        modalType,
        modalVisible,
        modalTitle,
        treeModalVisible,
        menuTreeDatas,
      },
    } = this.props;

    const { selectedRows } = this.state;
    const roleTableData = { list, pagination };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Filter onSearch={this.handleSearch} onReset={this.handleFilterReset} />
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.showCreateModal()}>
                {formatMessage({ id: 'Ops.create' })}
              </Button>
              <Button
                icon="safety"
                type="primary"
                disabled={selectedRows.length === 0 ? true : null}
                onClick={() => this.handleEditMenu(selectedRows[0].id)}
              >
                {formatMessage({ id: 'Ops.authority' })}
              </Button>
            </div>
            <RoleTable
              selectedRows={selectedRows}
              loading={loading}
              data={roleTableData}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleRoleTableChange}
              onEditItem={this.handleEditItem}
              onDeleteItem={this.handleDeleteItem}
              onEditMenu={this.handleEditMenu}
            />
          </div>
        </Card>
        {
          modalVisible && (
            <RoleModal
              modalType={modalType}
              visible={modalVisible}
              title={modalTitle}
              item={currentItem}
              onOk={this.handleModelOk}
              onCancel={this.hideModal}
            />
          )
        }
        {
          treeModalVisible && (
            <TreeModal
              visible={treeModalVisible}
              item={currentItem}
              onOk={this.handleTreeModelOk}
              onCancel={this.hideTreeModal}
              menuMetadata={menuTreeDatas}
              loading={loading}
            />
          )
        }
      </PageHeaderLayout>
    );
  }
}

export default Role;
