import React from 'react';
import { Button, DatePicker, Form, Input, Row, Col } from 'antd';
import { formatMessage } from 'umi/locale';
import StandardFormRow from '@/components/StandardFormRow';
import FolderSelect from '@/components/FolderSelect';
import styles from './index.less';

const FormItem = Form.Item;
const FolderOption = FolderSelect.Option;
const { RangePicker } = DatePicker;

@Form.create()
class Filter extends React.PureComponent {
  state = {
    beginDate: undefined,
    endDate: undefined,
    folderId: undefined,
    parentFolder: undefined,
    selectedFolderId: undefined,
  }

  handleSearch = (e) => {
    e.preventDefault();
    const { folderId } = this.state;
    const { form, onSearch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { beginDate, endDate } = this.state;
      const values = {
        ...fieldsValue,
        folderId,
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

  handleFolderSelectChange = (value) => {
    const { onSearch } = this.props;
    onSearch({ folderId: value });
    this.setState({
      folderId: value,
      selectedFolderId: value,
    });
  }

  handleFormReset = () => {
    const { form, onReset } = this.props;
    form.resetFields();
    this.setState({
      beginDate: undefined,
      endDate: undefined,
    });
    onReset();
  }

  handleBack = () => {
    const { onSearch } = this.props;
    const { parentFolder } = this.state;
    if (parentFolder && parentFolder.parent_id) {
      onSearch({
        folderId: parentFolder.parent_id,
      });
      this.setState({
        folderId: parentFolder.parent_id,
        selectedFolderId: undefined,
      });
    } else {
      onSearch({
        folderId: undefined,
      });
      this.setState({
        folderId: undefined,
        selectedFolderId: undefined,
      });
    }
  }

  checkShowBack = () => {
    const { folders } = this.props;
    for (let i = 0; i < folders.length; i += 1) {
      const f = folders[i];
      if (f.parent && f.parent.id) {
        this.setState({
          parentFolder: f.parent,
        });
        return true;
      }
    }
    return false;
  }

  renderSimpleForm() {
    const { form, folders } = this.props;
    const { selectedFolderId } = this.state;
    const { getFieldDecorator } = form;
    const pleaseInput = formatMessage({ id: 'Msg.please.input' });
    const showBack = this.checkShowBack(folders);
    const expandable = false;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <StandardFormRow title="所属目录" block style={{ paddingBottom: 8 }}>
          <FormItem>
            <FolderSelect
              expandable={expandable}
              value={[selectedFolderId]}
              showback={showBack}
              onBack={this.handleBack}
              onChange={this.handleFolderSelectChange}
            >
              {folders.map(folder => (
                <FolderOption
                  key={`folder-${folder.id}`}
                  checked={false}
                  value={folder.id}
                >
                  {folder.name}
                </FolderOption>
              ))}
            </FolderSelect>
          </FormItem>
        </StandardFormRow>
        <StandardFormRow grid last>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <FormItem label={formatMessage({ id: 'File.name' })}>
                {getFieldDecorator('q')(
                  <Input placeholder={pleaseInput} />
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label={formatMessage({ id: 'File.created_date' })}>
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
              </span>
            </Col>
          </Row>
        </StandardFormRow>
      </Form>
    );
  }

  render() {
    return this.renderSimpleForm();
  }
}

export default Filter;
