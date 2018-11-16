import React from 'react';
import { Table, Modal, Icon } from 'antd';
import { formatMessage } from 'umi/locale';
import DropOption from '@/components/DropOption';
import styles from './FileTable.less';
import { formatDateTimeStr } from '@/utils/common';
import { Operation } from '@/utils/enums';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const iconStyle = { fontSize: 24 };
const imageIcon = <Icon type="picture" style={iconStyle} theme="twoTone" twoToneColor="#00CD00" />;
const videoIcon = <Icon type="video-camera" style={iconStyle} theme="twoTone" twoToneColor="#9370DB" />;
const voiceIcon = <Icon type="sound" style={iconStyle} theme="twoTone" twoToneColor="#eb2f96" />;
const txtIcon = <Icon type="file-text" style={iconStyle} theme="twoTone" twoToneColor="#778899" />;
const csvIcon = <Icon type="file" style={iconStyle} theme="twoTone" twoToneColor="#eb2f96" />;
const pdfIcon = <Icon type="file-pdf" style={iconStyle} theme="twoTone" twoToneColor="#CD0000" />;
const wordIcon = <Icon type="file-word" style={iconStyle} theme="twoTone" twoToneColor="#1C86EE" />;
const excelIcon = <Icon type="file-excel" style={iconStyle} theme="twoTone" twoToneColor="#00CD00" />;
const pptIcon = <Icon type="file-ppt" style={iconStyle} theme="twoTone" twoToneColor="#FF0000" />;

class FileTable extends React.PureComponent {
  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    const filterValues = Object.keys(filters).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filters[key]);
      return newObj;
    }, {});

    const params = {
      offset: (pagination.current - 1) * pagination.pageSize,
      limit: pagination.pageSize,
      ...filterValues,
    };

    if (sorter.field) {
      if (sorter.order === 'ascend') {
        params.sort = `${sorter.field}`;
      } else {
        params.sort = `-${sorter.field}`;
      }
    }
    onChange(params);
  }

  render() {
    const {
      data: { list, pagination },
      loading,
      onEditItem,
      onDeleteItem,
    } = this.props;

    const handleMenuClick = (record, e) => {
      if (e.key === Operation.UPDATE) {
        onEditItem(record);
      } else if (e.key === Operation.DELETE) {
        Modal.confirm({
          title: formatMessage({ id: 'File.delete.confirm' }),
          onOk() {
            onDeleteItem(record.id);
          },
        });
      }
    };

    const updateMsg = formatMessage({ id: 'Ops.update' });
    const deleteMsg = formatMessage({ id: 'Ops.delete' });
    const menuOptions = [
      { key: Operation.UPDATE, name: updateMsg },
      { key: Operation.DELETE, name: deleteMsg },
    ];

    const fileTypeList = [
      {
        text: formatMessage({ id: 'FileType.IMAGE' }),
        value: 'IMAGE',
      }, {
        text: formatMessage({ id: 'FileType.VIDEO' }),
        value: 'VIDEO',
      }, {
        text: formatMessage({ id: 'FileType.VOICE' }),
        value: 'VOICE',
      }, {
        text: formatMessage({ id: 'FileType.TXT' }),
        value: 'TXT',
      }, {
        text: formatMessage({ id: 'FileType.CSV' }),
        value: 'CSV',
      }, {
        text: formatMessage({ id: 'FileType.EXCEL' }),
        value: 'EXCEL',
      }, {
        text: formatMessage({ id: 'FileType.WORD' }),
        value: 'WORD',
      }, {
        text: formatMessage({ id: 'FileType.PPT' }),
        value: 'PPT',
      }, {
        text: formatMessage({ id: 'FileType.PDF' }),
        value: 'PDF',
      },
    ];


    const creatIconSpan = (icon, text) => <span>{text} {icon}</span>;
    const creatImage = (url) => <img src={url} className={styles.fileImage} alt='' />;

    const renderFileTypeHtml = (record) => {
      const { type, url } = record;
      const typeText = formatMessage({ id: type });
      switch(type)
      {
        case 'FileType.IMAGE':
          return creatIconSpan(creatImage(url), typeText);
        case 'FileType.VIDEO':
          return creatIconSpan(videoIcon, typeText);
        case 'FileType.VOICE':
          return creatIconSpan(voiceIcon, typeText);
        case 'FileType.TXT':
          return creatIconSpan(txtIcon, typeText);
        case 'FileType.CSV':
          return creatIconSpan(csvIcon, typeText);
        case 'FileType.PDF':
          return creatIconSpan(pdfIcon, typeText);
        case 'FileType.EXCEL':
          return creatIconSpan(excelIcon, typeText);
        case 'FileType.WORD':
          return creatIconSpan(wordIcon, typeText);
        case 'FileType.PPT':
          return creatIconSpan(pptIcon, typeText);
        default:
          return typeText;
      }
    }

    const creatDropOption = (record) => <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={menuOptions} />;

    const columns = [
      {
        title: formatMessage({ id: 'File.name' }),
        key: 'Name',
        dataIndex: 'name',
       }, {
        title: formatMessage({ id: 'File.type' }),
        key: 'type',
        filters: fileTypeList,
        filterMultiple: false,
        render: (record) => renderFileTypeHtml(record),
      }, {
        title: formatMessage({ id: 'File.file_size' }),
        dataIndex: 'file_size',
        key: 'file_size',
      }, {
        title: formatMessage({ id: 'File.description' }),
        dataIndex: 'Description',
        key: 'Description',
      }, {
        title: formatMessage({ id: 'File.created_date' }),
        width: 180,
        dataIndex: 'created_date',
        key: 'created_date',
        render: (text) => formatDateTimeStr(text),
        sorter: true,
      }, {
        title: formatMessage({ id: 'File.operation' }),
        key: 'operation',
        width: 100,
        render: (record) => creatDropOption(record),
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    return (
      <div className={styles.fileTable}>
        <div style={{ marginBottom: 8 }}>
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
        <Table
          size="middle"
          loading={loading}
          rowKey={record => record.id}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default FileTable;
