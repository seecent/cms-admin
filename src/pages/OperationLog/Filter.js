import React from 'react';
import { Button, DatePicker, Form, Input, Select, Row, Col, Icon } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@Form.create()
class Filter extends React.PureComponent {
  state = {
    expandForm: false,
    beginDate: undefined,
    endDate: undefined,
  }

  handleSearch = (e) => {
    e.preventDefault();
    const { form, onSearch } = this.props;
    const { beginDate, endDate } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        begin_date: beginDate,
        end_date: endDate,
      };
      onSearch(values);
    });
  }

  handleCreateDateChange = (value) => {
    const beginDate = value[0].format('YYYY-MM-DD');
    const endDate = value[1].format('YYYY-MM-DD');
    this.setState({ beginDate, endDate });
  }

  handleCollectDateChange = (value) => {
    const beginDate = value[0].format('YYYY-MM-DD');
    const endDate = value[1].format('YYYY-MM-DD');
    this.setState({ beginDate, endDate });
  }

  handleFormReset = () => {
    const { form, onReset } = this.props;
    form.resetFields();
    onReset();
  }

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
      beginDate: undefined,
      endDate: undefined,
    });
  }

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const pleaseInput = formatMessage({ id: 'OperationLog.filter.input' });

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'OperationLog.filter.query' })}>
              {getFieldDecorator('q')(
                <Input placeholder={pleaseInput} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'OperationLog.create_date' })}>
              <RangePicker style={{ width: '100%' }} onChange={this.handleCreateDateChange} />
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                {formatMessage({ id: 'Ops.search' })}
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                {formatMessage({ id: 'Ops.reset' })}
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                {formatMessage({ id: 'Ops.expand' })}
                <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const pleaseInput = formatMessage({ id: 'Msg.please.input' });
    const pleaseSelect = formatMessage({ id: 'Msg.please.select' });

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'OperationLog.name' })}>
              {getFieldDecorator('l_name')(
                <Input placeholder={pleaseInput} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'OperationLog.detail' })}>
              {getFieldDecorator('l_detail')(
                <Input placeholder={pleaseInput} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'OperationLog.create_date' })}>
              <RangePicker style={{ width: '100%' }} onChange={this.handleCreateDateChange} />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'OperationLog.type' })}>
              {getFieldDecorator('type')(
                <Select placeholder={pleaseSelect} style={{ width: '100%' }}>
                  <Option value="Login">{formatMessage({ id: 'OperationType.Login' })}</Option>
                  <Option value="Logout">{formatMessage({ id: 'OperationType.Logout' })}</Option>
                  <Option value="Create">{formatMessage({ id: 'OperationType.Create' })}</Option>
                  <Option value="Update">{formatMessage({ id: 'OperationType.Update' })}</Option>
                  <Option value="Delete">{formatMessage({ id: 'OperationType.Delete' })}</Option>
                  <Option value="Import">{formatMessage({ id: 'OperationType.Import' })}</Option>
                  <Option value="Upload">{formatMessage({ id: 'OperationType.Upload' })}</Option>
                  <Option value="Download">{formatMessage({ id: 'OperationType.Download' })}</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'OperationLog.result' })}>
              {getFieldDecorator('result')(
                <Select placeholder={pleaseSelect} style={{ width: '100%' }}>
                  <Option value="Success">{formatMessage({ id: 'Msg.success' })}</Option>
                  <Option value="Fail">{formatMessage({ id: 'Msg.fail' })}</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <Button type="primary" htmlType="submit">
              {formatMessage({ id: 'Ops.search' })}
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={this.handleFormReset}
            >
              {formatMessage({ id: 'Ops.reset' })}
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              {formatMessage({ id: 'Ops.collapse' })}
              <Icon type="up" />
            </a>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }
}

export default Filter;
