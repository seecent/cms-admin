import React from 'react';
import { Icon } from 'antd';
import { formatMessage } from 'umi/locale';

const iconStyle = { fontSize: 24 };
// const imageIcon = <Icon type="picture" style={iconStyle} theme="twoTone" twoToneColor="#00CD00" />;
const videoIcon = <Icon type="video-camera" style={iconStyle} theme="twoTone" twoToneColor="#9370DB" />;
const voiceIcon = <Icon type="sound" style={iconStyle} theme="twoTone" twoToneColor="#eb2f96" />;
const txtIcon = <Icon type="file-text" style={iconStyle} theme="twoTone" twoToneColor="#D3D3D3" />;
const csvIcon = <Icon type="file" style={iconStyle} theme="twoTone" twoToneColor="#eb2f96" />;
const pdfIcon = <Icon type="file-pdf" style={iconStyle} theme="twoTone" twoToneColor="#CD0000" />;
const wordIcon = <Icon type="file-word" style={iconStyle} theme="twoTone" twoToneColor="#1C86EE" />;
const excelIcon = <Icon type="file-excel" style={iconStyle} theme="twoTone" twoToneColor="#00CD00" />;
const pptIcon = <Icon type="file-ppt" style={iconStyle} theme="twoTone" twoToneColor="#FF0000" />;

class FileTypeIcon extends React.PureComponent {

  creatImage = (no, url, style, onClick) => {
    if (url) {
      if (onClick) {
        return (<a onClick={() => onClick(no)}><img src={url} style={style} alt='' /></a>);
      }
      return (<img src={url} style={style} alt='' />);
    }
    return '';
  };

  getIcon = (no, type, url, style, onClick) => {
    switch(type)
    {
      case 'FileType.IMAGE':
        return this.creatImage(no, url, style, onClick);
      case 'FileType.VIDEO':
        return videoIcon;
      case 'FileType.VOICE':
        return voiceIcon;
      case 'FileType.TXT':
        return txtIcon;
      case 'FileType.CSV':
        return csvIcon;
      case 'FileType.PDF':
        return pdfIcon;
      case 'FileType.EXCEL':
        return excelIcon;
      case 'FileType.WORD':
        return wordIcon;
      case 'FileType.PPT':
        return pptIcon;
      default:
        return formatMessage({ id: type });
    }
  }

  render() {
    const {
      no,
      type,
      url,
      style={ width: 48, height: 48 },
      onClick,
    } = this.props;

    const text = formatMessage({ id: type });
    const icon = this.getIcon(no, type, url, style, onClick);
    
    return (
      <span>{text} {icon}</span>
    );
  }
}

export default FileTypeIcon;
