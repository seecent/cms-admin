import React from 'react';
import { connect } from 'dva';
import { Card, Form, Button } from 'antd';
import { formatMessage } from 'umi/locale';
import Filter from './Filter';
import UserModal from './UserModal';
import UserTable from './UserTable';
import { formatTreeDatas } from '@/utils/common';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './index.less';

const defaultPage = { offset: 0, limit: 10 };

@connect(state => ({
  user: state.user,
  roles: state.role.roles,
  departments: state.department.departments,
  orgTreeDatas: state.organization.orgTreeDatas,
}))
@Form.create()
class User extends React.PureComponent {
  state = {
    searchValues: {},
    selectedRows: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetch',
      payload: defaultPage,
    });
    dispatch({
      type: 'role/fetchAllRoles',
    });
    dispatch({
      type: 'department/fetchAllDepartments',
    });
    dispatch({
      type: 'organization/fetchOrgTreeDatas',
    });
  }

  handleUserTableChange = (params) => {
    const { dispatch } = this.props;
    const { searchValues } = this.state;

    dispatch({
      type: 'user/fetch',
      payload: { ...params, ...searchValues },
    });
  }

  handleSearch = (params) => {
    const { dispatch } = this.props;
    this.setState({
      searchValues: params,
    });
    dispatch({
      type: 'user/fetch',
      payload: params,
    });
  }

  handleFilterReset = () => {
    const { dispatch } = this.props;
    this.setState({
      searchValues: {},
    });
    dispatch({
      type: 'user/fetch',
      payload: defaultPage,
    });
  }

  handleMenuClick = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'user/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }

  handleEditItem = (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/showModal',
      payload: {
        currentItem: item,
        modalType: 'update',
        modalVisible: true,
        modalTitle: formatMessage({ id: 'User.update' }),
      },
    });
  }

  handleDeleteItem = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/delete',
      payload: id,
    });
  }

  showCreateModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/showModal',
      payload: {
        currentItem: {
          usertype: 'UserType.Sales',
          status: 'UserStatus.Active',
          roles: [],
        },
        modalType: 'create',
        modalVisible: true,
        modalTitle: formatMessage({ id: 'User.create' }),
      },
    });
  }

  hideModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/hideModal',
    });
  }

  handleModelOk = (data) => {
    const { user: { modalType, currentItem }, dispatch } = this.props;
    const payload = { ...data };
    if (modalType === 'update') {
      payload.id = currentItem.id;
    }
    dispatch({
      type: `user/${modalType}`,
      payload,
    });
  }

  render() {
    const {
      user: {
        loading,
        list,
        pagination,
        currentItem,
        modalType,
        modalVisible,
        modalTitle,
      },
      orgTreeDatas,
      departments,
      roles,
    } = this.props;

    const { selectedRows } = this.state;
    const userTableData = { list, pagination };
    const orgsTreeDatas = formatTreeDatas(orgTreeDatas);

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Filter
                roles={roles}
                orgTreeDatas={orgsTreeDatas}
                onSearch={this.handleSearch}
                onReset={this.handleFilterReset}
              />
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.showCreateModal()}>
                {formatMessage({ id: 'Ops.create' })}
              </Button>
            </div>
            <UserTable
              selectedRows={selectedRows}
              loading={loading}
              data={userTableData}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleUserTableChange}
              onEditItem={this.handleEditItem}
              onDeleteItem={this.handleDeleteItem}
            />
          </div>
        </Card>
        {
          modalVisible && (
            <UserModal
              modalType={modalType}
              visible={modalVisible}
              title={modalTitle}
              item={currentItem}
              roles={roles}
              orgTreeDatas={orgsTreeDatas}
              departments={departments}
              onOk={this.handleModelOk}
              onCancel={this.hideModal}
              loading={loading}
            />
          )
        }
      </PageHeaderWrapper>
    );
  }
}

export default User;
