import React from 'react';
import { Form, Input, Modal, Select, Icon, InputNumber, TreeSelect, Radio } from 'antd';
import { formatMessage } from 'umi/locale';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { Option } = Select;
const icons = [
  'lock',
  'unlock',
  'area-chart',
  'pie-chart',
  'bar-chart',
  'dot-chart',
  'bars',
  'book',
  'calendar',
  'cloud',
  'cloud-download',
  'code',
  'code-o',
  'copy',
  'credit-card',
  'delete',
  'desktop',
  'download',
  'edit',
  'ellipsis',
  'file',
  'file-text',
  'file-unknown',
  'file-pdf',
  'file-word',
  'file-excel',
  'file-jpg',
  'file-ppt',
  'file-markdown',
  'file-add',
  'folder',
  'folder-open',
  'folder-add',
  'hdd',
  'frown',
  'frown-o',
  'meh',
  'meh-o',
  'smile',
  'smile-o',
  'inbox',
  'laptop',
  'appstore-o',
  'appstore',
  'line-chart',
  'link',
  'mail',
  'mobile',
  'notification',
  'paper-clip',
  'picture',
  'poweroff',
  'reload',
  'search',
  'setting',
  'share-alt',
  'shopping-cart',
  'tablet',
  'tag',
  'tag-o',
  'tags',
  'tags-o',
  'to-top',
  'upload',
  'user',
  'video-camera',
  'home',
  'loading',
  'loading-3-quarters',
  'cloud-upload-o',
  'cloud-download-o',
  'cloud-upload',
  'cloud-o',
  'star-o',
  'star',
  'heart-o',
  'heart',
  'environment',
  'environment-o',
  'eye',
  'eye-o',
  'camera',
  'camera-o',
  'save',
  'team',
  'solution',
  'phone',
  'filter',
  'exception',
  'export',
  'customer-service',
  'qrcode',
  'scan',
  'like',
  'like-o',
  'dislike',
  'dislike-o',
  'message',
  'pay-circle',
  'pay-circle-o',
  'calculator',
  'pushpin',
  'pushpin-o',
  'bulb',
  'select',
  'switcher',
  'rocket',
  'bell',
  'disconnect',
  'database',
  'compass',
  'barcode',
  'hourglass',
  'key',
  'flag',
  'layout',
  'printer',
  'sound',
  'usb',
  'skin',
  'tool',
  'sync',
  'wifi',
  'car',
  'schedule',
  'user-add',
  'user-delete',
  'usergroup-add',
  'usergroup-delete',
  'man',
  'woman',
  'shop',
  'gift',
  'idcard',
  'medicine-box',
  'red-envelope',
  'coffee',
  'copyright',
  'trademark',
  'safety',
  'wallet',
  'bank',
  'trophy',
  'contacts',
  'global',
  'shake',
  'api',
  'fork',
  'dashboard',
  'form',
  'table',
  'profile',
];

@Form.create()
class MenusModal extends React.PureComponent {
  state = {
    menuType: 1,
  }

  componentWillMount() {
    const { item } = this.props;
    let selectedMenuType = 1;
    if (item && item.url) {
      if (item.path === item.url) {
        selectedMenuType = 2;
      } else {
        selectedMenuType = 1;
      }
    }
    this.setState({
      menuType: selectedMenuType,
    });
  }

  handleSubmit = (e) => {
    const { form, onOk } = this.props;
    const { menuType } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const data = values;
        if (menuType === 2) {
          const { url } = data;
          data.path = url;
        }
        onOk(data);
      }
    });
  };

  handleMenuTypeChange = (e) => {
    this.setState({
      menuType: e.target.value,
    });
  }

  render() {
    const { item, visible, title, onCancel, form, menuTreeDatas } = this.props;
    const { menuType } = this.state;
    const { getFieldDecorator } = form;
    const modalProps = {
      maskClosable: false,
      width: 680,
      visible,
      title,
      wrapClassName: 'vertical-center-modal',
      onOk: this.handleSubmit,
      onCancel,
    };

    const formItemLayout = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 8 },
      },
    };

    // let selectedMenuType = menuType;
    // if (item && item.url) {
    //   if (item.path === item.url) {
    //     selectedMenuType = 2;
    //   } else {
    //     selectedMenuType = 1;
    //   }
    // }
    // if (menuType !== selectedMenuType) {
    //   this.setState({
    //     menuType: selectedMenuType,
    //   });
    // }

    return (
      <Modal {...modalProps}>
        <Form onSubmit={this.handleSubmit} layout="horizontal" style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label={formatMessage({ id: 'Menus.code' })}>
            {getFieldDecorator('code', {
              initialValue: item.code,
              rules: [{
                required: true,
              }],
            })(
              <Input placeholder="" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({ id: 'Menus.name' })}>
            {getFieldDecorator('name', {
              initialValue: item.name,
              rules: [{
                required: true,
              }],
            })(
              <Input placeholder="" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({ id: 'Menus.parent_id' })}>
            {getFieldDecorator('parent_id', {
              initialValue: item.parent_id ? item.parent_id.toString() : '',
            })(
              <TreeSelect
                dropdownStyle={{ maxHeight: 320, overflow: 'auto' }}
                treeData={menuTreeDatas}
                placeholder={formatMessage({ id: 'Msg.please.input' })}
                allowClear
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="菜单类型">
            <RadioGroup onChange={this.handleMenuTypeChange} value={menuType}>
              <Radio value={1}>菜单</Radio>
              <Radio value={2}>URL集成</Radio>
            </RadioGroup>
          </FormItem>
          {menuType === 1 && (
            <FormItem {...formItemLayout} label={formatMessage({ id: 'Menus.path' })}>
              {getFieldDecorator('path', {
                initialValue: item.path,
                rules: [{
                  required: true,
                }],
              })(
                <Input placeholder="" />
              )}
            </FormItem>
          )}
          {menuType === 1 && (
            <FormItem {...formItemLayout} label={formatMessage({ id: 'Menus.icon' })}>
              {getFieldDecorator('icon', {
                initialValue: item.icon,
              })(
                <Select>
                  <Option key="no-icon">&nbsp;</Option>
                  {
                    icons.map((value) => <Option key={value} value={value}><Icon type={value} />&nbsp;&nbsp;{value}</Option>)
                  }
                </Select>
              )}
            </FormItem>
          )}
          {menuType === 2 && (
            <FormItem {...formItemLayout} label={formatMessage({ id: 'Menus.url' })}>
              {getFieldDecorator('url', {
                initialValue: item.url,
              })(
                <Input placeholder="" />
              )}
            </FormItem>
          )}
          {menuType === 2 && (
            <FormItem {...formItemLayout} label={formatMessage({ id: 'Menus.url_params' })}>
              {getFieldDecorator('url_params', {
                initialValue: item.url_params,
              })(
                <Input placeholder="" />
              )}
            </FormItem>
          )}
          {menuType === 2 && (
            <FormItem {...formItemLayout} label={formatMessage({ id: 'Menus.target' })}>
              {getFieldDecorator('target', {
                initialValue: item.target,
              })(
                <Select>
                  <Option key="blank" value="_blank">新页面</Option>
                  <Option key="self" value="_self">本页面</Option>
                </Select>
              )}
            </FormItem>
          )}
          <FormItem {...formItemLayout} label={formatMessage({ id: 'Menus.order_no' })}>
            {getFieldDecorator('order_no', {
              initialValue: item.order_no,
            })(
              <InputNumber min={0} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({ id: 'Menus.permissions' })}>
            {getFieldDecorator('permissions', {
              initialValue: item.permissions,
            })(
              <Input placeholder="" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({ id: 'Menus.memo' })}>
            {getFieldDecorator('memo', {
              initialValue: item.memo,
            })(
              <TextArea placeholder="" />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default MenusModal;
