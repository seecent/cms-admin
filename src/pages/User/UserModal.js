import React from 'react';
import { Form, Input, Select, TreeSelect, Radio, Modal, Checkbox, Spin } from 'antd';
import { formatMessage } from 'umi/locale';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

@Form.create()
class UserModel extends React.PureComponent {
  state = {
    checkboxMsg: '',
  };

  handleSubmit = (e) => {
    const { form, onOk } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const data = values;
        if (data.usertype) {
          data.usertype = data.usertype.replace('UserType.', '');
        }
        if (data.status) {
          data.status = data.status.replace('UserStatus.', '');
        }
        onOk(data);
      }
    });
  }

  handleCheckRolesChange = (checkedValues) => {
    if (checkedValues.length === 0) {
      this.setState({ checkboxMsg: '至少为用户选择一种角色' });
    } else {
      this.setState({ checkboxMsg: '' });
    }
  }

  handleTreeSelectSearch = (v, n) => {
    if (n && n.props && n.props.title) {
      return n.props.title.indexOf(v) > -1;
    }
    return false;
  }

  render() {
    const { item, roles, orgTreeDatas, departments,
      modalType, visible, title, onCancel, form, loading,
    } = this.props;
    const { getFieldDecorator } = form;
    const { checkboxMsg } = this.state;

    const roleIds = item.roles.map((it) => it.id);

    let isSysAdmin = false;
    const roleCheckOptions = [];
    item.roles.forEach((it) => {
      if (it.code === 'sysadmin') {
        isSysAdmin = true;
        roleCheckOptions.push({ label: it.name, value: it.id, disabled: true });
      } else {
        roleCheckOptions.push({ label: it.name, value: it.id });
      }
    });

    if (!isSysAdmin) {
      roles.forEach((it) => {
        roleCheckOptions.push({ label: it.name, value: it.id });
      });
    }

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

    const userStatusList = [{
      label: formatMessage({ id: 'UserStatus.Active' }),
      value: 'UserStatus.Active',
    }, {
      label: formatMessage({ id: 'UserStatus.Locked' }),
      value: 'UserStatus.Locked',
    }];

    return (
      <Modal {...modalProps}>
        {loading ? (
          <div style={{ textAlign: 'center' }}>
            <Spin size="large" />
          </div>) : (
            <Form onSubmit={this.handleSubmit} layout="horizontal" style={{ marginTop: 8 }}>
              <FormItem {...formItemLayout} label={formatMessage({ id: 'User.username' })}>
                {getFieldDecorator('username', {
                  initialValue: item.username,
                  rules: [{
                    required: true, message: formatMessage({ id: 'User.username.required' }),
                  }],
                })(
                  <Input placeholder="" />
                )}
              </FormItem>
              <FormItem label={formatMessage({ id: 'User.fullname' })} hasFeedback {...formItemLayout}>
                {getFieldDecorator('fullname', {
                  initialValue: item.fullname,
                })(<Input />)}
              </FormItem>
              <FormItem label={formatMessage({ id: 'User.enname' })} hasFeedback {...formItemLayout}>
                {getFieldDecorator('enname', {
                  initialValue: item.enname,
                })(<Input />)}
              </FormItem>
              <FormItem label={formatMessage({ id: 'User.organization' })} hasFeedback {...formItemLayout}>
                {getFieldDecorator('organization_id', {
                  initialValue: item.organization_id ? item.organization_id.toString() : '',
                })(
                  <TreeSelect
                    showSearch
                    filterTreeNode={this.handleTreeSelectSearch}
                    style={{ width: 200 }}
                    dropdownStyle={{ maxHeight: 280, overflow: 'auto' }}
                    treeData={orgTreeDatas}
                    placeholder={formatMessage({ id: 'Msg.please.select' })}
                    allowClear
                  />
                )}
              </FormItem>
              <FormItem label={formatMessage({ id: 'User.mobile' })} hasFeedback {...formItemLayout}>
                {getFieldDecorator('mobile', {
                  initialValue: item.mobile,
                  rules: [
                    {
                      required: true,
                      pattern: /^1[34578]\d{9}$/,
                      message: formatMessage({ id: 'Msg.mobile.validate' }),
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <FormItem label={formatMessage({ id: 'User.email' })} hasFeedback {...formItemLayout}>
                {getFieldDecorator('email', {
                  initialValue: item.email,
                  rules: [
                    {
                      required: true,
                      pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                      message: formatMessage({ id: 'Msg.email.validate' }),
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <FormItem label={formatMessage({ id: 'User.department' })} hasFeedback {...formItemLayout}>
                {getFieldDecorator('department', {
                  initialValue: item.department,
                })(
                  <Select name="department" style={{ width: 120 }} allowClear>
                    {departments.map(it => <Option key={it.id} value={it.name}>{it.name}</Option>)}
                  </Select>
                )}
              </FormItem>
              <FormItem label={formatMessage({ id: 'User.role' }, { msg: checkboxMsg })} {...formItemLayout}>
                {getFieldDecorator('roleIds', {
                  initialValue: roleIds,
                  rules: [
                    (rule, value, callback) => {
                      const errors = [];
                      if (value.length === 0) {
                        errors.push(new Error('至少选择一种角色', rule.field));
                      }
                      callback(errors);
                    },
                  ],
                })(
                  <CheckboxGroup
                    options={roleCheckOptions}
                    onChange={this.handleCheckRolesChange}
                  />
                )}
              </FormItem>
              { modalType === 'update' &&
                (
                  <FormItem label={formatMessage({ id: 'User.status' })} {...formItemLayout}>
                    {getFieldDecorator('status', {
                      initialValue: item.status,
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'User.status.required' }),
                        },
                      ],
                    })(
                      <RadioGroup name="status" options={userStatusList} />
                    )}
                  </FormItem>
                )
              }
            </Form>)}
      </Modal>
    );
  }
}

export default UserModel;
