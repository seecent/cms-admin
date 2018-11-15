import React from 'react';
import { Alert, Form, Input, Modal } from 'antd';
import { formatMessage } from 'umi/locale';

const FormItem = Form.Item;

@Form.create()
class PasswordModal extends React.PureComponent {
  state = {
    showAlert: false,
  };

  handleSubmit = (e) => {
    const { form, onOk } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { newPassword, confirmPassword } = values;
        if (newPassword === confirmPassword) {
          onOk(values);
        } else {
          this.setState({ showAlert: true });
        }
      }
    });
  }

  render() {
    const { visible, onCancel, form } = this.props;
    const { showAlert } = this.state;
    const { getFieldDecorator } = form;

    const modalProps = {
      maskClosable: false,
      visible,
      title:formatMessage({ id: 'User.changePassword' }),
      wrapClassName: 'vertical-center-modal',
      onOk: this.handleSubmit,
      onCancel,
    };

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    return (
      <Modal {...modalProps}>
        <Form onSubmit={this.handleSubmit} layout="horizontal" style={{ marginTop: 8 }}>
          {
            showAlert && (
              <Alert
                style={{ marginBottom: 20 }}
                message={formatMessage({ id: 'User.passwords.different' })}
                type="warning"
                closable
              />
            )
          }
          <FormItem {...formItemLayout} label={formatMessage({ id: 'User.old.password' })}>
            {getFieldDecorator('oldPassword', {
              rules: [{
                required: true, message:formatMessage({ id: 'User.oldPassword.required' }),
              }],
            })(
              <Input size="large" type="password" placeholder="" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({ id: 'User.new.password' })}>
            {getFieldDecorator('newPassword', {
              rules: [
                {
                  required: true,
                  pattern: /^.*(?=.{6,})(?=.*\d)(?=.*[A-Za-z])(?=.*[!@#$%^&*?]).*$/,
                  message:formatMessage({ id: 'User.password.security' }),
                },
              ],
            })(
              <Input size="large" type="password" placeholder="" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({ id: 'User.confirm.password' })}>
            {getFieldDecorator('confirmPassword', {
              rules: [{
                required: true, message:formatMessage({ id: 'User.confirmPassword.required' }),
              }],
            })(
              <Input size="large" type="password" placeholder="" />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default PasswordModal;
