import React from 'react';
import { Button, DatePicker, Form, Input, Select, Row, Col, Icon } from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
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
    this.setState({
      expandForm: !this.state.expandForm,
      beginDate: undefined,
      endDate: undefined,
    });
  }

  renderSimpleForm() {
    const { intl } = this.props;
    const { getFieldDecorator } = this.props.form;
    const pleaseInput = intl.formatMessage({ id: 'OperationLog.filter.input' });

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label={intl.formatMessage({ id: 'OperationLog.filter.query' })}>
              {getFieldDecorator('q')(
                <Input placeholder={pleaseInput} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label={intl.formatMessage({ id: 'OperationLog.create_date' })}>
              <RangePicker style={{ width: '100%' }} onChange={this.handleCreateDateChange} />
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                <FormattedMessage id="Ops.search" />
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                <FormattedMessage id="Ops.reset" />
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                <FormattedMessage id="Ops.expand" />
                <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { intl } = this.props;
    const { getFieldDecorator } = this.props.form;
    const pleaseInput = intl.formatMessage({ id: 'Msg.please.input' });
    const pleaseSelect = intl.formatMessage({ id: 'Msg.please.select' });

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label={intl.formatMessage({ id: 'OperationLog.name' })}>
              {getFieldDecorator('l_name')(
                <Input placeholder={pleaseInput} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label={intl.formatMessage({ id: 'OperationLog.detail' })}>
              {getFieldDecorator('l_detail')(
                <Input placeholder={pleaseInput} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label={intl.formatMessage({ id: 'OperationLog.create_date' })}>
              <RangePicker style={{ width: '100%' }} onChange={this.handleCreateDateChange} />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label={intl.formatMessage({ id: 'OperationLog.type' })}>
              {getFieldDecorator('type')(
                <Select placeholder={pleaseSelect} style={{ width: '100%' }}>
                  <Option value="Login"><FormattedMessage id="OperationType.Login" /></Option>
                  <Option value="Logout"><FormattedMessage id="OperationType.Logout" /></Option>
                  <Option value="Create"><FormattedMessage id="OperationType.Create" /></Option>
                  <Option value="Update"><FormattedMessage id="OperationType.Update" /></Option>
                  <Option value="Delete"><FormattedMessage id="OperationType.Delete" /></Option>
                  <Option value="Import"><FormattedMessage id="OperationType.Import" /></Option>
                  <Option value="Upload"><FormattedMessage id="OperationType.Upload" /></Option>
                  <Option value="Download"><FormattedMessage id="OperationType.Download" /></Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label={intl.formatMessage({ id: 'OperationLog.result' })}>
              {getFieldDecorator('result')(
                <Select placeholder={pleaseSelect} style={{ width: '100%' }}>
                  <Option value="Success"><FormattedMessage id="Msg.success" /></Option>
                  <Option value="Fail"><FormattedMessage id="Msg.fail" /></Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <Button type="primary" htmlType="submit">
              <FormattedMessage id="Ops.search" />
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              <FormattedMessage id="Ops.reset" />
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              <FormattedMessage id="Ops.collapse" />
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

export default injectIntl(Filter);
