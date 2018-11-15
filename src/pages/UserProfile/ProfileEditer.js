import React, { Component } from 'react';
import { Button, Card, Divider, Form, Input, Select } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import { formatMessage } from 'umi/locale';
import { formatDateTimeStr } from '@/utils/common';

const { Description } = DescriptionList;
const { Option } = Select;
const FormItem = Form.Item;

@Form.create()
class ProfileEditer extends Component {
  state = {
    language: undefined,
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { handleSave, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { language } = this.state;
        handleSave(values, language);
      }
    });
  }

  handleChange = (value) => {
    this.setState({ language: value });
  }

  render() {
    const { user, form, handleCancel } = this.props;
    const { preference } = user;
    const { getFieldDecorator } = form;

    const baseInfoMsg = formatMessage({ id: 'User.baseInfo' });
    const preferenceMsg = formatMessage({ id: 'User.preference' });

    const inputStyle = { width: '200px', marginLeft: '14px' };
    const moblieStyle = { width: '200px' };

    return (
      <Card bordered={false}>
        <Form onSubmit={this.handleSubmit} layout="horizontal" style={{ marginTop: 8 }}>
          <DescriptionList size="large" col={1} title={baseInfoMsg} style={{ marginBottom: 32 }}>
            <Description term={formatMessage({ id: 'User.username' })}>
              {user.username}
            </Description>
            <Description term={formatMessage({ id: 'User.firstname' })}>
              <FormItem>
                {getFieldDecorator('firstname', {
                  initialValue: user.firstname,
                })(<Input style={inputStyle} />)}
              </FormItem>
            </Description>
            <Description term={formatMessage({ id: 'User.lastname' })}>
              <FormItem>
                {getFieldDecorator('lastname', {
                  initialValue: user.lastname,
                })(<Input style={inputStyle} />)}
              </FormItem>
            </Description>
            <Description term={formatMessage({ id: 'User.mobile' })}>
              <FormItem>
                {getFieldDecorator('mobile', {
                  initialValue: user.mobile,
                  rules: [
                    {
                      required: true,
                      pattern: /^1[34578]\d{9}$/,
                      message: formatMessage({ id: 'Msg.mobile.validate' }),
                    },
                  ],
                })(<Input style={moblieStyle} />)}
              </FormItem>
            </Description>
            <Description term={formatMessage({ id: 'User.email' })}>
              <FormItem>
                {getFieldDecorator('email', {
                  initialValue: user.email,
                  rules: [
                    {
                      required: true,
                      pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                      message: formatMessage({ id: 'Msg.email.validate' }),
                    },
                  ],
                })(<Input style={inputStyle} />)}
              </FormItem>
            </Description>
            <Description term={formatMessage({ id: 'User.type' })}>
              {user.usertype && formatMessage({ id: `${user.usertype}` })}
            </Description>
            <Description term={formatMessage({ id: 'User.status' })}>
              {user.status && formatMessage({ id: `${user.status}` })}
            </Description>
            <Description term={formatMessage({ id: 'User.created_at' })}>
              {formatDateTimeStr(user.created_at)}
            </Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          {preference && (
            <DescriptionList size="large" col={1} title={preferenceMsg} style={{ marginBottom: 32 }}>
              <Description term={formatMessage({ id: 'User.preference.language' })}>
                <Select
                  name="language"
                  style={{ width: 120 }}
                  defaultValue={preference.language}
                  onChange={this.handleChange}
                >
                  <Option value="zh-CN">简体中文</Option>
                  <Option value="en">English</Option>
                </Select>
              </Description>
              <Description term={formatMessage({ id: 'User.preference.timezone' })}>
                {preference.timezone}
              </Description>
              <Description term="">
                <Button type="primary" htmlType="submit">
                  {formatMessage({ id: 'Ops.save' })}
                </Button>
                <Button type="default" onClick={handleCancel} style={{ marginLeft: '20px' }}>
                  {formatMessage({ id: 'Ops.cancel' })}
                </Button>
              </Description>
            </DescriptionList>
          )}
        </Form>
      </Card>
    );
  }
}

export default ProfileEditer;
