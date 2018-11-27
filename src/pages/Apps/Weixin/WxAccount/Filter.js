import React from 'react';
import { Button, Form, Input, Row, Col } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.less';

const FormItem = Form.Item;

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
  };

  handleReset = () => {
    const { form, onReset } = this.props;
    form.resetFields();
    onReset();
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label={formatMessage({ id: 'wxaccount.code' })}>
              {getFieldDecorator('code')(
                <Input placeholder={formatMessage({ id: 'Msg.please.input' })} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <FormItem label={formatMessage({ id: 'wxaccount.name' })}>
              {getFieldDecorator('l_name')(
                <Input placeholder={formatMessage({ id: 'Msg.please.input' })} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
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
