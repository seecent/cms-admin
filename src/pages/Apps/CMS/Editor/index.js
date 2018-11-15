import React from 'react';
import { Button, Card, Modal } from 'antd';
import { formatMessage } from 'umi/locale';
import ReactQuill, { Quill } from 'react-quill'; 
import { ImageDrop } from 'quill-image-drop-module';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import 'react-quill/dist/quill.snow.css';
import './font.less';

// 在quiil中注册quill-image-drop-module
Quill.register('modules/imageDrop', ImageDrop);

class Editor extends React.PureComponent {
  state = {
    value: '<section data-role="outer" label="Powered by 135editor.com" style="font-size:16px;font-family:微软雅黑;"><section data-role="outer" label="Powered by 135editor.com" style="font-size:16px;font-family:微软雅黑;"><section class="_135editor" data-tools="135编辑器" data-id="93685" style="border: 0px none; box-sizing: border-box;"><section style="text-align: center;margin: 11px 0% 10px;box-sizing: border-box;"><section style="display: inline-block;width: 100%;vertical-align: top;border-color: #6ccbef;border-width: 2px;border-radius: 0px;border-style: solid;padding-right: 10px;padding-bottom: 10px;padding-left: 10px;box-shadow: #000000 0px 0px 0px;box-sizing: border-box;" data-width="100%"><section style="margin-top: -2px;margin-right: 0%;margin-left: 0%;box-sizing: border-box;"><section style="display: inline-block;min-width: 10%;max-width: 100%;vertical-align: top;padding-right: 10px;padding-left: 10px;border-width: 2px;border-radius: 0px;border-style: none dashed dashed;border-color: #6ccbef;background-color: #ffffff;box-sizing: border-box;"><section style="box-sizing: border-box;"><section style="text-align: left;font-size: 14px;letter-spacing: 2px;color: #6ccbef;box-sizing: border-box;" class="135brush" data-brushtype="text"><p>余生皆欢喜</p></section></section></section></section><section style="text-align: left;"><section style="padding: 1em 0.8em; text-align: justify; letter-spacing: 1.5px; color: rgb(63, 63, 63); font-size: 14px; line-height: 1.75em; background-color: rgba(33, 172, 237, 0.1); box-sizing: border-box;"><section class="135brush"><p>风吹起了蛰伏的发梢，露出了眼角那一点痣。 阳光将影子拉得修长，你的笑，我经年不忘。 一生短短长长，相逢自思量。 自从遇见你，余生皆是欢喜。 现在的我，会尽力助人。 虽然以前也会，但没有这么尽心，没有如此欢喜。 因为我知道，如果是你，你会这样做。</p></section></section></section></section></section></section><p><br></p></section></section>',
    content: '',
    modalVisible: false,
  };

  constructor(props) {
    super(props)
    this.editor = null;      // Quill instance
    this.quillRef = null;      // Quill instance
    this.reactQuillRef = null; // ReactQuill component
    this.pEditor = null;      // Quill instance
  }
  
  componentDidMount() {
    this.attachQuillRefs()
  }
  
  componentDidUpdate() {
    this.attachQuillRefs()
  }
  
  attachQuillRefs = () => {
    if (typeof this.reactQuillRef.getEditor !== 'function') return;
    this.editor = this.reactQuillRef.getEditor();
    this.pEditor = this.reactQuillRef.makeUnprivilegedEditor(this.reactQuillRef.getEditor());
  }
  
  insertText = () => {
    const range = this.editor.getSelection();
    const position = range ? range.index : 0;
    this.editor.insertText(position, 'Hello, World! ')
  }

  handleChange = (value) => {
    this.setState({
      value,
    })
  };

  handlePreview= () => {
    const content = this.editor.getText();
    this.setState({
      content,
      modalVisible: true,
    })
  };

  handleReset = () => {
    const { form, onReset } = this.props;
    form.resetFields();
    onReset();
  };
  
  showModal = () => {
    const content = this.pEditor.getHTML();
    this.setState({
      content,
      modalVisible: true,
    })
  };

  hideModal = () => {
    this.setState({
      modalVisible: false,
    })
  };

  getLength = () => {
    const content = this.editor.getLength();
    this.setState({
      content,
      modalVisible: true,
    })
  };

  getText = () => {
    const content = this.editor.getText();
    this.setState({
      content,
      modalVisible: true,
    })
  };

  getHTML = () => {
    const content = this.pEditor.getHTML();
    this.setState({
      content,
      modalVisible: true,
    })
  };

  getContents = () => {
    const content = this.pEditor.getContents();
    this.setState({
      content,
      modalVisible: true,
    })
  };

  getSelection = () => {
    const content = this.pEditor.getSelection();
    this.setState({
      content,
      modalVisible: true,
    })
  };

  getBounds = () => {
    const content = this.pEditor.getBounds();
    this.setState({
      content,
      modalVisible: true,
    })
  };

  render() {
    const { value, content, modalVisible } = this.state;
    const fonts = ['SimSun', '新宋体', 'FangSong', 'KaiTi', 'SimHei', 'Microsoft YaHei', 'Arial', 'Arial Black', 'Times New Roman', 'Courier New', 'Tahoma', 'Verdana'];
    const modules = {
        toolbar: [
          [{ 'header': [1, 2, 3, 4, 5, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ 'color': [] }, { 'background': [] }],          // 字体颜色，背景颜色
          [{ 'size': ['small', false, 'large', 'huge'] }],  // 字体大小
          [{ 'font': ['SimSun'] }],
          [{ 'align': [] }],
          [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
          ['link', 'image', 'video'],
          ['clean'],
        ],
        imageDrop: true,
      };

    const formats = [
      'header',
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'bullet', 'indent',
      'link', 'image',
    ];

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
          <ReactQuill
            ref={(el) => { this.reactQuillRef = el }}
            theme="snow"
            modules={modules}
            formats={formats}
            value={value}
            onChange={this.handleChange}
          />
          <Button style={btnStyles} onClick={this.showModal}>Html</Button>
          <Button style={btnStyles} onClick={this.handlePreview}>Preview</Button>
          <Button style={btnStyles} onClick={this.insertText}>InsertText</Button>
          <Button style={btnStyles} onClick={this.getLength}>getLength</Button>
          <Button style={btnStyles} onClick={this.getText}>getText</Button>
          <Button style={btnStyles} onClick={this.getHTML}>getHTML</Button>
          <Button style={btnStyles} onClick={this.getContents}>getContents</Button>
          <Button style={btnStyles} onClick={this.getSelection}>getSelection</Button>
          <Button style={btnStyles} onClick={this.getBounds}>getBounds</Button>
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

export default Editor;
