import React from 'react';
import { connect } from 'dva';
import { Card, Form, Button } from 'antd';
import { formatMessage } from 'umi/locale';
import Filter from './Filter';
import WxUserModal from './WxUserModal';
import WxUserTable from './WxUserTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './index.less';

const defaultPage = { offset: 0, limit: 10 };

@connect(state => ({
  wxuser: state.wxuser,
  accountId: state.wxuser.accountId,
}))
@Form.create()
class WxUser extends React.PureComponent {
  state = {
    accountId: undefined,
    searchValues: {},
    selectedRows: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'wxuser/fetch',
      payload: defaultPage,
    });
  }

  handleTableChange = (params) => {
    const { dispatch } = this.props;
    const { searchValues } = this.state;

    dispatch({
      type: 'wxuser/fetch',
      payload: { ...params, ...searchValues },
    });
  };

  handleSearch = (params) => {
    const { dispatch } = this.props;
    this.setState({
      searchValues: params,
    });
    dispatch({
      type: 'wxuser/fetch',
      payload: params,
    });
  };

  handleFilterReset = () => {
    const { dispatch } = this.props;
    this.setState({
      searchValues: {},
    });
    dispatch({
      type: 'wxuser/fetch',
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
      type: 'wxuser/showModal',
      payload: {
        currentItem: item,
        modalType: 'update',
        modalVisible: true,
        modalTitle: formatMessage({ id: 'wxuser.update.title', defaultMessage: 'Update WxUser' }),
      },
    });
  };

  handleDeleteItem = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'wxuser/delete',
      payload: id,
    });
    dispatch({
      type: 'wxuser/fetch',
      payload: defaultPage,
    });
  };

  showCreateModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'wxuser/showModal',
      payload: {
        currentItem: {},
        modalType: 'create',
        modalVisible: true,
        modalTitle: formatMessage({ id: 'wxuser.create.title' }),
      },
    });
  };

  hideModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'wxuser/hideModal',
    });
  };

  handleModelOk = (data) => {
    const { wxuser: { modalType, currentItem }, dispatch } = this.props;
    const payload = { ...data };
    if (modalType === 'update') {
      payload.id = currentItem.id;
    }
    dispatch({
      type: `wxuser/${modalType}`,
      payload,
    });
  };

  syncAllUsers = () => {
    const { dispatch } = this.props;
    const { accountId } = this.state;
    dispatch({
      type: 'wxuser/syncAllUsers',
      payload: { id: accountId },
    });
  };

  syncUser = () => {
    const { dispatch } = this.props;
    const { accountId } = this.state;
    dispatch({
      type: 'wxuser/syncUser',
      payload: { id: accountId },
    });
  };

  render() {
    const {
      wxuser: {
        loading,
        list,
        pagination,
        currentItem,
        modalType,
        modalVisible,
        modalTitle,
      },
    } = this.props;

    const { selectedRows } = this.state;
    const tableData = { list, pagination };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Filter onSearch={this.handleSearch} onReset={this.handleFilterReset} />
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.showCreateModal()}>
                {formatMessage({ id: 'Ops.create' })}
              </Button>
            </div>
            <WxUserTable
              selectedRows={selectedRows}
              loading={loading}
              data={tableData}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleTableChange}
              onEditItem={this.handleEditItem}
              onDeleteItem={this.handleDeleteItem}
              onEditMenu={this.handleEditMenu}
            />
          </div>
        </Card>
        {
          modalVisible && (
            <WxUserModal
              modalType={modalType}
              visible={modalVisible}
              title={modalTitle}
              item={currentItem}
              onOk={this.handleModelOk}
              onCancel={this.hideModal}
            />
          )
        }
      </PageHeaderWrapper>
    );
  }
}

export default WxUser;
