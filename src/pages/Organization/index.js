import React from 'react';
import { connect } from 'dva';
import { Card, Form, Button, Dropdown, Icon, Menu, Modal } from 'antd';
import { formatMessage } from 'umi/locale';
import Filter from './Filter';
import OrgModal from './OrgModal';
import OrgTable from './OrgTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './index.less';

const defaultPage = { offset: 0, limit: 10 };

@connect(state => ({
  organization: state.organization,
}))
@Form.create()
class Organization extends React.PureComponent {
  state = {
    searchValues: {},
    selectedRows: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'organization/fetch',
      payload: defaultPage,
    });
    dispatch({
      type: 'organization/fetchOrgTreeDatas',
    });
  }

  handleOrgTableChange = (params) => {
    const { dispatch } = this.props;
    const { searchValues } = this.state;

    dispatch({
      type: 'organization/fetch',
      payload: { ...params, ...searchValues },
    });
  }

  handleSearch = (params) => {
    const { dispatch } = this.props;
    this.setState({
      searchValues: params,
    });
    dispatch({
      type: 'organization/fetch',
      payload: { ...params, ...defaultPage },
    });
  }

  handleFilterReset = () => {
    const { dispatch } = this.props;
    this.setState({
      searchValues: {},
    });
    dispatch({
      type: 'organization/fetch',
      payload: defaultPage,
    });
  }

  handleMenuClick = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    const self = this;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        Modal.confirm({
          title: formatMessage({ id: 'Msg.delete.selected.confirm' }),
          onOk() {
            dispatch({
              type: 'organization/multiDelete',
              payload: {
                ids: selectedRows.map(row => row.id).join(','),
              },
              // callback: () => {
              //   this.setState({
              //     selectedRows: [],
              //   });
              // },
            }).then(() => {
              self.setState({
                selectedRows: [],
              });
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
      type: 'organization/showModal',
      payload: {
        currentItem: item,
        modalType: 'update',
        modalVisible: true,
        modalTitle: formatMessage({ id: 'Organization.update' }),
      },
    });
  }

  handleDeleteItem = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'organization/delete',
      payload: id,
    });
  }

  syncOrganizations = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'organization/syncOrgs',
    });
    dispatch({
      type: 'organization/fetch',
      payload: defaultPage,
    });
  }

  showCreateModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'organization/showModal',
      payload: {
        currentItem: {
          org_type: 'OrgType.Department',
          status: 'OrgStatus.Active',
        },
        modalType: 'create',
        modalVisible: true,
        modalTitle: formatMessage({ id: 'Organization.create' }),
      },
    });
  }

  hideModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'organization/hideModal',
    });
  }

  handleModelOk = (data) => {
    const { organization: { modalType, currentItem }, dispatch } = this.props;
    const payload = { ...data };
    if (modalType === 'update') {
      payload.id = currentItem.id;
    }
    console.log("handleModelOk");
    dispatch({
      type: `organization/${modalType}`,
      payload,
    });
  }

  formatTreeDatas = (treeDatas) => {
    const datas = [];
    for (let i = 0; i < treeDatas.length; i += 1) {
      const data = {};
      if (treeDatas[i].children) {
        data.children = this.formatTreeDatas(treeDatas[i].children);
      }
      data.title = treeDatas[i].name;
      data.value = `${treeDatas[i].id}`;
      data.key = treeDatas[i].code;
      datas.push(data);
    }
    return datas;
  };

  render() {
    const {
      organization: {
        loading,
        list,
        pagination,
        orgTreeDatas,
        currentItem,
        modalType,
        modalVisible,
        modalTitle,
      },
    } = this.props;

    const { selectedRows } = this.state;
    const orgTableData = { list, pagination };
    const orgsTreeDatas = this.formatTreeDatas(orgTreeDatas);

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">
          {formatMessage({ id: 'Ops.delete', defaultMessage: 'Delete'})}
        </Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Filter
                orgTreeDatas={orgsTreeDatas}
                onSearch={this.handleSearch}
                onReset={this.handleFilterReset}
              />
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.showCreateModal()}>
                {formatMessage({ id: 'Ops.create', defaultMessage: 'Create'})}
              </Button>
              <Button icon="sync" type="default" onClick={() => this.syncOrganizations()}>
                {formatMessage({ id: 'Organization.sync', defaultMessage: 'Sync'})}
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Dropdown overlay={menu}>
                    <Button>
                      批量操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <OrgTable
              selectedRows={selectedRows}
              loading={loading}
              data={orgTableData}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleOrgTableChange}
              onEditItem={this.handleEditItem}
              onDeleteItem={this.handleDeleteItem}
            />
          </div>
        </Card>
        {
          modalVisible && (
            <OrgModal
              modalType={modalType}
              visible={modalVisible}
              title={modalTitle}
              item={currentItem}
              orgTreeDatas={orgsTreeDatas}
              onOk={this.handleModelOk}
              onCancel={this.hideModal}
            />
          )
        }
      </PageHeaderWrapper>
    );
  }
}

export default Organization;
