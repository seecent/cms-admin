import React from 'react';
import { Button, Card, Modal } from 'antd';
import UEditor from '@/components/UEditor';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

class Ueditor extends React.PureComponent {
  state = {
    value: 'test',
    content: '',
    modalVisible: false,
  };

  hanldeChage = (value) => {
    this.setState({
      value,
    });
  }

  render() {
    const { value, content, modalVisible } = this.state;
    const btnStyles = { marginTop: 16, marginRight: 8 };

    const modalProps = {
      maskClosable: false,
      width: 960,
      visible: modalVisible,
      title: "源码",
      wrapClassName: 'vertical-center-modal',
      onOk: this.hideModal,
      onCancel: this.hideModal,
    };

    return (
      <PageHeaderWrapper>
        <Card title="富文本编辑器">
          <UEditor onChange={this.hanldeChage} />
          <Button style={btnStyles} onClick={this.showModal}>Html</Button>
          <Button style={btnStyles} onClick={this.handlePreview}>Preview</Button>
        </Card>
        <Card title="预览内容">
          {value}
        </Card>
        {modalVisible && (
          <Modal {...modalProps}>
            <Card>
              {content}
            </Card>
          </Modal>
        )}
      </PageHeaderWrapper>
    );
  }
}

export default Ueditor;
