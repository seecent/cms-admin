import React from 'react';
import { Button, Form, Input, Row, Col, Select, TreeSelect } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class Filter extends React.PureComponent {
  handleSearch = (e) => {
    e.preventDefault();

    const { form, onSearch } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      onSearch(values);
    });
  }

  handleReset = () => {
    const { form, onReset } = this.props;
    form.resetFields();
    onReset();
  }

  handleTreeSelectSearch = (v, n) => {
    if (n && n.props && n.props.title) {
      return n.props.title.indexOf(v) > -1;
    }
    return false;
  }

  render() {
    const { orgTreeDatas, form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={16}>
            <FormItem label={formatMessage({ id: 'Organization.filter.query' })}>
              {getFieldDecorator('q')(
                <Input placeholder={formatMessage({ id: 'Organization.filter.input' })} />
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={16}>
            <FormItem label={formatMessage({ id: 'Organization.org_type' })}>
              {getFieldDecorator('org_type')(
                <Select placeholder={formatMessage({ id: 'Msg.please.select' })} style={{ width: '100%' }}>
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
          <Col md={8} sm={16}>
            <FormItem label={formatMessage({ id: 'Organization.parent' })}>
              {getFieldDecorator('parent_id')(
                <TreeSelect
                  showSearch
                  filterTreeNode={this.handleTreeSelectSearch}
                  style={{ width: 300 }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={orgTreeDatas}
                  placeholder={formatMessage({ id: 'Msg.please.select' })}
                  allowClear
                />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                {formatMessage({ id: 'Ops.search' })}
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                {formatMessage({ id: 'Ops.reset' })}
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Filter;
