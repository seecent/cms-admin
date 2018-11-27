import React from 'react';
import { connect } from 'dva';
import { Card, Form, Button, message } from 'antd';
import { formatMessage } from 'umi/locale';
import Filter from './Filter';
import WxAccountModal from './WxAccountModal';
import WxAccountTable from './WxAccountTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './index.less';

const defaultPage = { offset: 0, limit: 10 };

@connect(state => ({
  wxaccount: state.wxaccount,
  accountId: state.wxaccount.accountId,
}))
@Form.create()
class WxAccount extends React.PureComponent {
  state = {
    accountId: undefined,
    searchValues: {},
    selectedRows: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'wxaccount/fetch',
      payload: defaultPage,
    });
  }

  handleTableChange = (params) => {
    const { dispatch } = this.props;
    const { searchValues } = this.state;

    dispatch({
      type: 'wxaccount/fetch',
      payload: { ...params, ...searchValues },
    });
  };

  handleSearch = (params) => {
    const { dispatch } = this.props;
    this.setState({
      searchValues: params,
    });
    dispatch({
      type: 'wxaccount/fetch',
      payload: params,
    });
  };

  handleFilterReset = () => {
    const { dispatch } = this.props;
    this.setState({
      searchValues: {},
    });
    dispatch({
      type: 'wxaccount/fetch',
      payload: defaultPage,
    });
  };

  handleSelectRows = (rows) => {
    let accountId;
    if (rows && rows.length > 0) {
      const row = rows[0];
      const { id } = row;
      accountId = id;
    }
    this.setState({
      accountId,
      selectedRows: rows,
    });
  };

  handleEditItem = (item) => {
    const { dispatch } = this.props;
    const { id } = item;
    dispatch({
      type: 'wxaccount/fetchAccount',
      payload: { id },
    });
    dispatch({
      type: 'wxaccount/showModal',
      payload: {
        modalType: 'update',
        modalVisible: true,
        modalTitle: formatMessage({ id: 'wxaccount.update.title', defaultMessage: 'Update WxAccount' }),
      },
    });
  };

  handleDeleteItem = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'wxaccount/delete',
      payload: id,
    });
    dispatch({
      type: 'wxaccount/fetch',
      payload: defaultPage,
    });
  };

  showCreateModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'wxaccount/showModal',
      payload: {
        currentItem: {},
        modalType: 'create',
        modalVisible: true,
        modalTitle: formatMessage({ id: 'wxaccount.create.title' }),
      },
    });
  };

  hideModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'wxaccount/hideModal',
    });
  };

  handleModelOk = (data) => {
    const { wxaccount: { modalType, currentItem }, dispatch } = this.props;
    const payload = { ...data };
    if (modalType === 'update') {
      payload.id = currentItem.id;
    }
    dispatch({
      type: `wxaccount/${modalType}`,
      payload,
    });
  };

  refreshToken = () => {
    const { dispatch } = this.props;
    const { accountId } = this.state;
    if (accountId) {
      dispatch({
        type: 'wxaccount/syncAccessToken',
        payload: { id: accountId },
      });
    } else {
      message.error(formatMessage({ id: 'wxaccount.select.account' }));
    }
  };

  render() {
    const {
      wxaccount: {
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
              <Button icon="sync" onClick={() => this.refreshToken()}>
                {formatMessage({ id: 'wxaccount.refreshToken' })}
              </Button>
            </div>
            <WxAccountTable
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
            <WxAccountModal
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

export default WxAccount;
