import React from 'react';
import { Form, Input, Select, TreeSelect, Row, Col, Modal } from 'antd';
import { formatMessage } from 'umi/locale';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@Form.create()
class OrgModel extends React.PureComponent {
  handleSubmit = (e) => {
    const { form, onOk } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const data = values;
        if (data.org_type) {
          data.org_type = data.org_type.replace('OrgType.', '');
        }
        if (data.status) {
          data.status = data.status.replace('OrgStatus.', '');
        }
        onOk(data);
      }
    });
  }

  handleTreeSelectSearch = (v, n) => {
    if (n && n.props && n.props.title) {
      return n.props.title.indexOf(v) > -1;
    }
    return false;
  }

  render() {
    const { item, visible, title, orgTreeDatas, onCancel, form } = this.props;
    const { getFieldDecorator } = form;

    const modalProps = {
      maskClosable: false,
      visible,
      title,
      width: 720,
      wrapClassName: 'vertical-center-modal',
      onOk: this.handleSubmit,
      onCancel,
    };

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        md: { span: 6 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        md: { span: 12 },
        sm: { span: 12 },
      },
    };

    const formItemOneColLayout = {
      labelCol: {
        xs: { span: 24 },
        md: { span: 3 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        md: { span: 20 },
        sm: { span: 20 },
      },
    };

    return (
      <Modal {...modalProps}>
        <Form onSubmit={this.handleSubmit} layout="horizontal" style={{ marginTop: 8 }}>
          <Row gutter={24}>
            <Col span={12}>
              <FormItem {...formItemLayout} label={formatMessage({ id: 'Organization.code' })}>
                {getFieldDecorator('code', {
                  initialValue: item.code,
                  rules: [{
                    required: true, message: formatMessage({ id: 'Organization.code.required' }),
                  }],
                })(
                  <Input style={{ width: 200 }} placeholder="" />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={formatMessage({ id: 'Organization.name' })}>
                {getFieldDecorator('name', {
                  initialValue: item.name,
                  rules: [{
                    required: true, message: formatMessage({ id: 'Organization.name.required' }),
                  }],
                })(
                  <Input style={{ width: 200 }} placeholder="" />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <FormItem {...formItemLayout} label={formatMessage({ id: 'Organization.short_name' })}>
                {getFieldDecorator('short_name', {
                  initialValue: item.short_name,
                  rules: [{
                    required: true, message: formatMessage({ id: 'Organization.short_name.required' }),
                  }],
                })(
                  <Input style={{ width: 200 }} placeholder="" />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label={formatMessage({ id: 'Organization.org_type' })} hasFeedback {...formItemLayout}>
                {getFieldDecorator('org_type', {
                  initialValue: item.org_type,
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'Organization.type.required' }),
                    },
                  ],
                })(
                  <Select name="org_type" style={{ width: 200 }}>
                    <Option value="GroupCompany">
                      {formatMessage({ id: 'OrgType.GroupCompany' })}
                    </Option>
                    <Option value="Company">
                      {formatMessage({ id: 'OrgType.Company' })}
                    </Option>
                    <Option value="Branch">
                      {formatMessage({ id: 'OrgType.Branch' })}
                    </Option>
                    <Option value="Department">
                      {formatMessage({ id: 'OrgType.Department' })}
                    </Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <FormItem label={formatMessage({ id: 'Organization.parent' })} hasFeedback {...formItemLayout}>
                {getFieldDecorator('parent_id', {
                  initialValue: item.parent_id ? item.parent_id.toString() : '',
                })(
                  <TreeSelect
                    showSearch
                    filterTreeNode={this.handleTreeSelectSearch}
                    style={{ width: 200 }}
                    dropdownStyle={{ maxHeight: 280, overflow: 'auto' }}
                    treeData={orgTreeDatas}
                    placeholder={formatMessage({ id: 'Msg.please.input' })}
                    allowClear
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label={formatMessage({ id: 'Organization.mobilephone' })} hasFeedback {...formItemLayout}>
                {getFieldDecorator('mobilephone', {
                  initialValue: item.mobilephone,
                  rules: [
                    {
                      pattern: /^1[34578]\d{9}$/,
                      message: formatMessage({ id: 'Msg.mobile.validate' }),
                    },
                  ],
                })(<Input style={{ width: 200 }} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <FormItem label={formatMessage({ id: 'Organization.telephone' })} hasFeedback {...formItemLayout}>
                {getFieldDecorator('telephone', {
                  initialValue: item.telephone,
                })(<Input style={{ width: 200 }} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label={formatMessage({ id: 'Organization.fax' })} hasFeedback {...formItemLayout}>
                {getFieldDecorator('fax', {
                  initialValue: item.fax,
                })(<Input style={{ width: 200 }} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <FormItem label={formatMessage({ id: 'Organization.email' })} hasFeedback {...formItemLayout}>
                {getFieldDecorator('email', {
                  initialValue: item.email,
                  rules: [
                    {
                      pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                      message: formatMessage({ id: 'Msg.email.validate' }),
                    },
                  ],
                })(<Input style={{ width: 200 }} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label={formatMessage({ id: 'Organization.postcode' })} hasFeedback {...formItemLayout}>
                {getFieldDecorator('postcode', {
                  initialValue: item.postcode,
                })(<Input style={{ width: 200 }} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <FormItem label={formatMessage({ id: 'Organization.address' })} hasFeedback {...formItemOneColLayout}>
                {getFieldDecorator('address', {
                  initialValue: item.address,
                })(<TextArea rows={3} cols={60} width={200} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <FormItem label={formatMessage({ id: 'Organization.memo' })} hasFeedback {...formItemOneColLayout}>
                {getFieldDecorator('memo', {
                  initialValue: item.memo,
                })(<TextArea rows={3} cols={60} width={200} />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default OrgModel;
