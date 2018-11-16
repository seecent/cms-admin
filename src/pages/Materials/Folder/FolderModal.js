import React from 'react';
import { Form, Input, Select, TreeSelect, Row, Col, Modal } from 'antd';
import { formatMessage } from 'umi/locale';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@Form.create()
class FolderModel extends React.PureComponent {
  handleSubmit = (e) => {
    const { form, onOk } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const data = values;
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
    const { item, visible, title, folderTreeDatas, onCancel, form } = this.props;
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
              <FormItem label={formatMessage({ id: 'Folder.parent' })} hasFeedback {...formItemLayout}>
                {getFieldDecorator('parent_id', {
                  initialValue: item.parent_id ? item.parent_id.toString() : '',
                })(
                  <TreeSelect
                    showSearch
                    filterTreeNode={this.handleTreeSelectSearch}
                    style={{ width: 200 }}
                    dropdownStyle={{ maxHeight: 280, overflow: 'auto' }}
                    treeData={folderTreeDatas}
                    placeholder={formatMessage({ id: 'Msg.please.input' })}
                    allowClear
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={formatMessage({ id: 'Folder.name' })}>
                {getFieldDecorator('name', {
                  initialValue: item.name,
                  rules: [{
                    required: true, message: formatMessage({ id: 'Folder.name.required' }),
                  }],
                })(
                  <Input style={{ width: 200 }} placeholder="" />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <FormItem label={formatMessage({ id: 'Folder.description' })} hasFeedback {...formItemOneColLayout}>
                {getFieldDecorator('description', {
                  initialValue: item.description,
                })(<TextArea rows={3} cols={60} width={200} />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default FolderModel;
