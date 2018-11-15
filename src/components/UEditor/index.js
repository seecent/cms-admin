import React from 'react';

const UEDITOR_LOADED_KEY = '__RICH_UEDITOR_LOADED_STATUS__';

// ueditor 默认值
const initConfig = {
  autoClearinitialContent: false,
  autoFloatEnabled: true, // 是否保持 toolbar 滚动时不动
  focus: false,
  wordCount: true,
  elementPathEnabled: false,
  pasteplain: false, // 是否默认为纯文本粘贴。false为不使用纯文本粘贴，true为使用纯文本粘贴
  initialFrameWidth: 640, // 初始化编辑器宽度
  initialFrameHeight: 200,
  maximumWords: 10000,
};

class UEditor extends React.Component {
  static defaultProps = {
    uid: undefined,
    value: '',
    ueditorUrl: '/ueditor/ueditor.all.min.js',
    ueditorConfigUrl: '/ueditor/ueditor.config.js',
    ueditorHomeUrl: '/ueditor/',
    ueditorIframeUrl: '',
    editorConfig: {}, // ueditor 默认值
    className: '',
    prefix: 'rich',
    onChange: () => { },
  };

  constructor(props) {
    super(props);
    const { uid } = this.props;
    if (uid) {
      this.uuid = `rich-ueditor-${uid}`;
    } else {
      const now = +(new Date());
      this.uuid = `rich-ueditor-${now}-${Math.floor(Math.random()*100)}`;
    }
  }

  componentDidMount() {
    let timer = null;

    if (window.UE) {
      this.initRichText();
    } else {
      timer = setInterval(() => {
        const status = window[UEDITOR_LOADED_KEY];
        if (status === 2) {
          clearInterval(timer);
          this.initRichText();
        } else if (status !== 1){
          this.loadUEditorScript();
        }
      }, 50);
    }
  }

  componentWillUnmount() {
    if (!this.editor) return;
    this.editor.destroy();
  }

  loadUEditorScript = () => {
    if (window[UEDITOR_LOADED_KEY] !== undefined) {
      return;
    }
    window[UEDITOR_LOADED_KEY] = 1; // 加载中
    const {
      ueditorHomeUrl,
      ueditorIframeUrl,
      ueditorUrl,
      ueditorConfigUrl,
    } = this.props;

    window.UEDITOR_HOME_URL = ueditorHomeUrl;
    window.UEDITOR_IFRAME_URL = ueditorIframeUrl;

    this.createScriptDom(ueditorConfigUrl, () => {
      this.createScriptDom(ueditorUrl, () => {
        window[UEDITOR_LOADED_KEY] = 2; // 加载完成
      });
    });
  }

  createScriptDom = (url, callback) => {
    const scriptDom = document.createElement('script');
    scriptDom.type = 'text/javascript';
    scriptDom.async = true;
    scriptDom.src = url;

    scriptDom.onload = () => {
      callback();
    }
    document.body.appendChild(scriptDom);
  }

  initRichText = () => {
    if (window.UE) {
      const target = document.getElementById(this.uuid);
      if (!target) {
        return false;
      }

      const { value, editorConfig } = this.props;
      const conf = { ...initConfig, ...editorConfig };
      const editor = new window.UE.ui.Editor(conf);
      this.editor = editor;

      editor.addListener('blur contentChange', () => {
        this.handleOnChange();
      });
      editor.render(target);
      editor.ready(() => {
        editor.setContent(value);
      });
    }
    return true;
  }

  handleOnChange = () => {
    const { onChange } = this.props;
    const value = this.editor.getContent();
    if (onChange) {
      onChange(value);
    }
  }

  render() {
    const { prefix, className } = this.props;
    return (
      <div className={`${prefix}-richtext ${className}`}>
        <div id={this.uuid} />
      </div>
    )
  }
}

export default UEditor;
