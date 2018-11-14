import React from 'react';
import { Form, Modal, Tree, Spin } from 'antd';
import { formatMessage } from 'umi/locale';

const { TreeNode } = Tree;

@Form.create()
class TreeModal extends React.PureComponent {
  state = {
    checkedKeys: [],
    halfCheckedKeys: [],
  };

  componentWillReceiveProps(nextProps) {
    const { menuMetadata } = nextProps;
    const { menus } = nextProps.item;

    if (menus) {
      const checked = [];
      const menuIds = [];
      menus.forEach((menu) => {
        menuIds.push(menu.menu_id);
      });

      menuMetadata.forEach((parent) => {
        if (parent.children) {
          let isHalfChecked = false;
          const { children } = parent;
          children.forEach((menu) => {
            if (menuIds.includes(menu.id)) {
              checked.push(menu.id.toString());
            } else {
              isHalfChecked = true;
            }
          });
          if (!isHalfChecked) {
            checked.push(parent.id.toString());
          }
        } else if (menuIds.includes(parent.id)) {
          checked.push(parent.id.toString());
        }
      });

      this.setState({
        checkedKeys: checked,
      });
    }
  }

  onCheck = (checkedKeys, info) => {
    const { halfCheckedKeys } = info;
    this.setState({ checkedKeys, halfCheckedKeys });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { onOk } = this.props;
    const { checkedKeys, halfCheckedKeys } = this.state;
    const menuKeys = [];
    menuKeys.push(...checkedKeys, ...halfCheckedKeys);
    onOk({ menuIds: menuKeys.map((i) => parseInt(i, 10))});
  };

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

  renderTreeNodes = (data) => {
    data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  };

  render() {
    const { item, visible, onCancel, menuMetadata, loading } = this.props;
    const { checkedKeys } = this.state;
    const treeData = this.formattedTreeData(menuMetadata);

    const title = formatMessage({ id: 'Menu.role.treeModal' });
    const modalProps = {
      maskClosable: false,
      width: 680,
      visible,
      title: `${title}-${item.name}`,
      wrapClassName: 'vertical-center-modal',
      onOk: this.handleSubmit,
      onCancel,
    };

    return (
      <Modal {...modalProps}>
        {loading ? (
          <div style={{ textAlign: 'center' }}>
            <Spin size="large" />
          </div>) : (
            <div className="tree-modal-wrapper" style={{ maxHeight: '300px', overflow: 'auto' }}>
              <Tree
                checkable
                // checkStrictly
                defaultExpandAll
                // onExpand={this.onExpand}
                onCheck={this.onCheck}
                checkedKeys={checkedKeys}
              >
                {this.renderTreeNodes(treeData)}
              </Tree>
            </div>
        )}
      </Modal>
    );
  }
}

export default TreeModal;
