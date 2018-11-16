import React from 'react';
import { connect } from 'dva';
import { Card, Form, Button, Dropdown, Icon, Menu, Modal } from 'antd';
import { formatMessage } from 'umi/locale';
import Filter from './Filter';
import FolderModal from './FolderModal';
import FolderTable from './FolderTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './index.less';

const defaultPage = { offset: 0, limit: 10 };

@connect(state => ({
  mediafolder: state.mediafolder,
  parentId: state.mediafolder.parentId,
}))
@Form.create()
class Folder extends React.PureComponent {
  state = {
    searchValues: {},
    selectedRows: [],
  };

  componentDidMount() {
    const { parentId, dispatch } = this.props;
    dispatch({
      type: 'mediafolder/fetch',
      payload: { parentId, ...defaultPage },
    });
    dispatch({
      type: 'mediafolder/fetchFolderTreeDatas',
    });
  }

  handleOrgTableChange = (params) => {
    const { dispatch } = this.props;
    const { searchValues } = this.state;

    dispatch({
      type: 'mediafolder/fetch',
      payload: { ...params, ...searchValues },
    });
  }

  handleSearch = (params) => {
    const { dispatch } = this.props;
    this.setState({
      searchValues: params,
    });
    dispatch({
      type: 'mediafolder/fetch',
      payload: { ...params, ...defaultPage },
    });
  }

  handleFilterReset = () => {
    const { dispatch } = this.props;
    this.setState({
      searchValues: {},
    });
    dispatch({
      type: 'mediafolder/fetch',
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
              type: 'mediafolder/multiDelete',
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
      type: 'mediafolder/showModal',
      payload: {
        currentItem: item,
        modalType: 'update',
        modalVisible: true,
        modalTitle: formatMessage({ id: 'Folder.update' }),
      },
    });
  }

  handleDeleteItem = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mediafolder/delete',
      payload: id,
    });
  }

  showCreateModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mediafolder/showModal',
      payload: {
        currentItem: {
          org_type: 'OrgType.Department',
          status: 'OrgStatus.Active',
        },
        modalType: 'create',
        modalVisible: true,
        modalTitle: formatMessage({ id: 'Folder.create' }),
      },
    });
  }

  hideModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mediafolder/hideModal',
    });
  }

  handleModelOk = (data) => {
    const { mediafolder: { modalType, currentItem }, dispatch } = this.props;
    const payload = { ...data };
    if (modalType === 'update') {
      payload.id = currentItem.id;
    }
    dispatch({
      type: `mediafolder/${modalType}`,
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
      mediafolder: {
        loading,
        list,
        pagination,
        folderTreeDatas,
        currentItem,
        modalType,
        modalVisible,
        modalTitle,
      },
    } = this.props;

    const { selectedRows } = this.state;
    const folderTableData = { list, pagination };
    const foldersTreeDatas = this.formatTreeDatas(folderTreeDatas);

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
                folderTreeDatas={foldersTreeDatas}
                onSearch={this.handleSearch}
                onReset={this.handleFilterReset}
              />
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.showCreateModal()}>
                {formatMessage({ id: 'Ops.create', defaultMessage: 'Create'})}
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
            <FolderTable
              selectedRows={selectedRows}
              loading={loading}
              data={folderTableData}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleOrgTableChange}
              onEditItem={this.handleEditItem}
              onDeleteItem={this.handleDeleteItem}
            />
          </div>
        </Card>
        {
          modalVisible && (
            <FolderModal
              modalType={modalType}
              visible={modalVisible}
              title={modalTitle}
              item={currentItem}
              folderTreeDatas={foldersTreeDatas}
              onOk={this.handleModelOk}
              onCancel={this.hideModal}
            />
          )
        }
      </PageHeaderWrapper>
    );
  }
}

export default Folder;
