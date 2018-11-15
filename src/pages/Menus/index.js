import React from 'react';
import { connect } from 'dva';
import { Card, Form, Button } from 'antd';
import { formatMessage } from 'umi/locale';
import Filter from './Filter';
import MenusModal from './MenusModal';
import MenusTable from './MenusTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './index.less';

const defaultPage = { offset: 0, limit: 1000 };

@connect(state => ({
  menus: state.menus,
}))
@Form.create()
class Menus extends React.PureComponent {
  state = {
    searchValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menus/fetch',
      payload: defaultPage,
    });
    dispatch({
      type: 'menus/fetchMenuTreeDatas',
      payload: defaultPage,
    });
  }

  handleMenusTableChange = (params) => {
    const { dispatch } = this.props;
    const { searchValues } = this.state;

    dispatch({
      type: 'menus/fetch',
      payload: { ...params, ...searchValues, ...defaultPage },
    });
  };

  handleSearch = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menus/fetch',
      payload: { ...params, ...defaultPage },
    });
  };

  handleFilterReset = () => {
    const { dispatch } = this.props;
    this.setState({
      searchValues: {},
    });
    dispatch({
      type: 'menus/fetch',
      payload: defaultPage,
    });
  };

  handleEditItem = (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menus/showModal',
      payload: {
        currentItem: item,
        modalType: 'update',
        modalVisible: true,
        modalTitle: formatMessage({ id: 'Menus.update.title' }),
      },
    });
  };

  handleDeleteItem = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menus/delete',
      payload: { id },
    });
  };

  showCreateModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menus/showModal',
      payload: {
        currentItem: {},
        modalType: 'create',
        modalVisible: true,
        modalTitle: formatMessage({ id: 'Menus.create.title' }),
      },
    });
  };

  hideModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menus/hideModal',
    });
  };

  handleModelOk = (data) => {
    const { menus: { modalType, currentItem }, dispatch } = this.props;
    const payload = { ...data };
    if (modalType === 'update') {
      payload.id = currentItem.id;
    }
    dispatch({
      type: `menus/${modalType}`,
      payload,
    });
  };

  formatTreeDatas = (treeDatas) => {
    const datas = [];
    for (let i = 0; i < treeDatas.length; i += 1) {
      const data = {};
      if (treeDatas[i].children) {
        data.children = this.formatTreeDatas(treeDatas[i].children);
      }
      data.label = formatMessage({ id: treeDatas[i].name });
      data.value = `${treeDatas[i].id}`;
      data.key = treeDatas[i].code;
      datas.push(data);
    }
    return datas;
  };

  render() {
    const {
      menus: {
        loading,
        list,
        pagination,
        currentItem,
        modalType,
        modalVisible,
        modalTitle,
        menuTreeDatas,
      },
    } = this.props;

    const { selectedRows } = this.state;
    const menusTableData = { list, pagination };
    const menusTreeDatas = this.formatTreeDatas(menuTreeDatas);

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Filter
                onSearch={this.handleSearch}
                onReset={this.handleFilterReset}
                menuTreeDatas={menusTreeDatas}
              />
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.showCreateModal()}>
                {formatMessage({ id: 'Ops.create' })}
              </Button>
            </div>
            <MenusTable
              selectedRows={selectedRows}
              loading={loading}
              data={menusTableData}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleMenusTableChange}
              onEditItem={this.handleEditItem}
              onDeleteItem={this.handleDeleteItem}
            />
          </div>
        </Card>
        {
          modalVisible && (
            <MenusModal
              modalType={modalType}
              visible={modalVisible}
              title={modalTitle}
              item={currentItem}
              onOk={this.handleModelOk}
              onCancel={this.hideModal}
              menuTreeDatas={menusTreeDatas}
              allowClear
            />
          )
        }
      </PageHeaderWrapper>
    );
  }
}

export default Menus;
