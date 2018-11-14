import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs, Card, Tree, Table } from 'antd';
import { Link } from 'react-router-dom';
import { formatMessage } from 'umi/locale';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import DescriptionList from '@/components/DescriptionList';

import { formatDateTimeStr } from '@/utils/common';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

const { TabPane } = Tabs;
const { TreeNode } = Tree;
const { Description } = DescriptionList;

@connect(state => ({
  roleid: state.role.roleid,
  role: state.role.currentItem,
  menuTreeDatas: state.role.menuTreeDatas,
  userList: state.role.userList,
  userListPagination: state.role.userListPagination,
}))
class Show extends Component {
  state = {
    checkedKeys: [],
  };

  componentDidMount() {
    const { roleid, dispatch } = this.props;
    if (roleid) {
      // fetch basic info
      dispatch({
        type: 'role/fetchRole',
        payload: { id: roleid },
      });
      // fetch users info
      dispatch({
        type: 'role/fetchUsers',
        payload: {
          id: roleid,
          offset: 0,
          limit: 10,
        },
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { menus } = nextProps.role;
    if (menus) {
      this.setState({
        checkedKeys: menus.map((i) => i.menu_id),
      });
    }
  }

  formattedTreeData = (treeData) => {
    const datas = [];
    for (let i = 0; i < treeData.length; i += 1) {
      const data = {};
      if (treeData[i].children) {
        data.children = this.formattedTreeData(treeData[i].children);
      }
      const tid = `${treeData[i].id}`;
      data.title = formatMessage({ id: treeData[i].name });
      data.value = tid;
      data.key = tid;
      datas.push(data);
    }
    return datas;
  };

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
    const { dispatch, roleid } = this.props;

    dispatch({
      type: 'role/fetchUsers',
      payload: { ...params, id: roleid },
    });
  };

  renderTreeNodes = (data) => {
    data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item} disableCheckbox>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} disableCheckbox />;
    });
  };

  render() {
    const {
      role,
      loading,
      menuTreeDatas,
      userList,
      userListPagination,
    } = this.props;

    const { checkedKeys } = this.state;

    const treeData = this.formattedTreeData(menuTreeDatas);

    const columns = [
      {
        title: formatMessage({ id: 'User.username' }),
        dataIndex: 'username',
        key: 'username',
        render: (text, record) => <Link to={`/system/users/show?id=${record.id}`}>{text}</Link>,
        sorter: true,
      }, {
        title: formatMessage({ id: 'User.fullname' }),
        dataIndex: 'fullname',
        key: 'fullname',
      }, {
        title: formatMessage({ id: 'User.enname' }),
        dataIndex: 'enname',
        key: 'enname',
      }, {
        title: formatMessage({ id: 'User.mobile' }),
        dataIndex: 'mobile',
        key: 'mobile',
      }, {
        title: formatMessage({ id: 'User.email' }),
        dataIndex: 'email',
        key: 'email',
      }, {
        title: formatMessage({ id: 'User.department' }),
        dataIndex: 'department',
        key: 'department',
      }, {
        title: formatMessage({ id: 'User.status' }),
        dataIndex: 'status',
        key: 'status',
        filterMultiple: false,
        render: (text) => formatMessage({ id: text }),
        sorter: true,
      }, {
        title: formatMessage({ id: 'User.create_date' }),
        dataIndex: 'date_created',
        key: 'date_created',
        render: (text) => formatDateTimeStr(text),
        sorter: true,
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...userListPagination,
    };

    return (
      <PageHeaderLayout>
        <Tabs defaultActiveKey="1">
          <TabPane tab={formatMessage({ id: 'Menu.role.show.detail' })} key="1">
            <Card bordered={false}>
              <DescriptionList size="large" col={1} title="角色详情" style={{ marginBottom: 32 }}>
                <Description term={formatMessage({ id: 'Role.code' })}>
                  {role.code}
                </Description>
                <Description term={formatMessage({ id: 'Role.name' })}>
                  {role.name}
                </Description>
                <Description term={formatMessage({ id: 'Role.description' })}>
                  {role.description}
                </Description>
              </DescriptionList>
            </Card>
          </TabPane>
          <TabPane tab={formatMessage({ id: 'Menu.role.show.menus' })} key="2">
            <Card bordered={false}>
              <Tree
                checkable
                defaultExpandAll={false}
                checkedKeys={checkedKeys}
              >
                {this.renderTreeNodes(treeData)}
              </Tree>
            </Card>
          </TabPane>
          <TabPane tab={formatMessage({ id: 'Menu.role.show.users' })} key="3">
            <Card bordered={false}>
              <Table
                loading={loading}
                dataSource={userList}
                rowKey={record => record.id}
                columns={columns}
                pagination={paginationProps}
                onChange={this.handleTableChange}
              />
            </Card>
          </TabPane>
        </Tabs>
      </PageHeaderLayout>
    );
  }
}

export default Show;
