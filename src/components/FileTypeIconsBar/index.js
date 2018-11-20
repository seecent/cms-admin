import React from 'react';
import { Icon } from 'antd';
import { formatMessage } from 'umi/locale';

const iconStyle = { fontSize: 24 };
const imageIcon = <Icon type="picture" style={iconStyle} theme="twoTone" twoToneColor="#00CD00" />;
const videoIcon = <Icon type="video-camera" style={iconStyle} theme="twoTone" twoToneColor="#9370DB" />;
const voiceIcon = <Icon type="sound" style={iconStyle} theme="twoTone" twoToneColor="#eb2f96" />;
const txtIcon = <Icon type="file-text" style={iconStyle} theme="twoTone" twoToneColor="#D3D3D3" />;
const csvIcon = <Icon type="file" style={iconStyle} theme="twoTone" twoToneColor="#eb2f96" />;
const pdfIcon = <Icon type="file-pdf" style={iconStyle} theme="twoTone" twoToneColor="#CD0000" />;
const wordIcon = <Icon type="file-word" style={iconStyle} theme="twoTone" twoToneColor="#1C86EE" />;
const excelIcon = <Icon type="file-excel" style={iconStyle} theme="twoTone" twoToneColor="#00CD00" />;
const pptIcon = <Icon type="file-ppt" style={iconStyle} theme="twoTone" twoToneColor="#FF0000" />;

class FileTypeIconsBar extends React.PureComponent {
  render() {
    const {
      key="ftib00001",
    } = this.props;

    return (
      <div key={key} style={{ marginBottom: 8 }}>
        <span style={{ marginBottom: 8 }}>{formatMessage({ id: 'File.type' })}： </span>
        <span style={{ margin: 8 }}>{imageIcon}</span>
        <span style={{ margin: 8 }}>{videoIcon}</span>
        <span style={{ margin: 8 }}>{voiceIcon}</span>
        <span style={{ margin: 8 }}>{wordIcon}</span>
        <span style={{ margin: 8 }}>{excelIcon}</span>
        <span style={{ margin: 8 }}>{pptIcon}</span>
        <span style={{ margin: 8 }}>{pdfIcon}</span>
        <span style={{ margin: 8 }}>{txtIcon}</span>
        <span style={{ margin: 8 }}>{csvIcon}</span>
      </div>
    );
  }
}

export default FileTypeIconsBar;
