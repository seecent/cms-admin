import React from 'react';
import { Form, Input, Modal, Spin } from 'antd';
import { formatMessage } from 'umi/locale';

const FormItem = Form.Item;

@Form.create()
class WxUserModal extends React.PureComponent {
  handleSubmit = (e) => {
    e.preventDefault();
    const { form, onOk } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const data = values;
        onOk(data);
      }
    });
  };

  render() {
    const { item, visible, title, onCancel, form, loading } = this.props;
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

    return (
      <Modal {...modalProps}>
        {loading ? (
          <div style={{ textAlign: 'center' }}>
            <Spin size="large" />
          </div>) : (
            <Form onSubmit={this.handleSubmit} layout="horizontal" style={{ marginTop: 8 }}>
              <FormItem {...formItemLayout} label={formatMessage({ id: 'wxuser.nickname' })}>
                {getFieldDecorator('nickname', {
              initialValue: item.nickname,
              rules: [{
                required: true,
              }],
            })(
              <Input placeholder="" />
            )}
              </FormItem>
              <FormItem {...formItemLayout} label={formatMessage({ id: 'wxuser.name' })}>
                {getFieldDecorator('name', {
              initialValue: item.name,
              rules: [{
                required: true,
              }],
            })(
              <Input placeholder="" />
            )}
              </FormItem>
              <FormItem {...formItemLayout} label={formatMessage({ id: 'wxuser.city' })}>
                {getFieldDecorator('city', {
              initialValue: item.city,
            })(
              <Input placeholder="" />
            )}
              </FormItem>
            </Form>)}
      </Modal>
    );
  }
}

export default WxUserModal;
