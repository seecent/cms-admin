import React from 'react';
import { Form, Input, Radio, Modal, Spin } from 'antd';
import { formatMessage } from 'umi/locale';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

@Form.create()
class WxAccountModal extends React.PureComponent {
  handleSubmit = (e) => {
    e.preventDefault();
    const { form, onOk } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const data = values;
        if (data.status) {
          data.status = data.status.replace('AccountStatus.', '');
        }
        onOk(data);
      }
    });
  };

  render() {
    const { item, visible, modalType, title, onCancel, form, loading } = this.props;
    const { getFieldDecorator } = form;

    const accountStatusList = [
      {
        label: formatMessage({ id: 'AccountStatus.Active' }),
        value: 'AccountStatus.Active',
      }, {
        label: formatMessage({ id: 'AccountStatus.Locked' }),
        value: 'AccountStatus.Locked',
      },
    ];

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
              <FormItem {...formItemLayout} label={formatMessage({ id: 'wxaccount.code' })}>
                {getFieldDecorator('code', {
                  initialValue: item.code,
                  rules: [{
                    required: true,
                  }],
                })(
                  <Input placeholder="" />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label={formatMessage({ id: 'wxaccount.name' })}>
                {getFieldDecorator('name', {
                  initialValue: item.name,
                  rules: [{
                    required: true,
                  }],
                })(
                  <Input placeholder="" />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label={formatMessage({ id: 'wxaccount.app_id' })}>
                {getFieldDecorator('app_id', {
                  initialValue: item.app_id,
                  rules: [{
                    required: true,
                  }],
                })(
                  <Input placeholder="" />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label={formatMessage({ id: 'wxaccount.app_secret' })}>
                {getFieldDecorator('app_secret', {
                  initialValue: item.app_secret,
                  rules: [{
                    required: true,
                  }],
                })(
                  <Input placeholder="" />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label={formatMessage({ id: 'wxaccount.access_token' })}>
                {getFieldDecorator('access_token', {
                  initialValue: item.access_token,
                })(
                  <Input placeholder="" />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label={formatMessage({ id: 'wxaccount.description' })}>
                {getFieldDecorator('description', {
                  initialValue: item.description,
                })(
                  <Input placeholder="" />
                )}
              </FormItem>
              { modalType === 'update' &&
                (
                  <FormItem label={formatMessage({ id: 'wxaccount.status' })} {...formItemLayout}>
                    {getFieldDecorator('status', {
                      initialValue: item.status,
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'wxaccount.status.required' }),
                        },
                      ],
                    })(
                      <RadioGroup name="status" options={accountStatusList} />
                    )}
                  </FormItem>
                )
              }
            </Form>)}
      </Modal>
    );
  }
}

export default WxAccountModal;
