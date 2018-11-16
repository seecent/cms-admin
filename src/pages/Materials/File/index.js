import React from 'react';
import { connect } from 'dva';
import { Button, Card, Form, Icon, Upload, message, Spin } from 'antd';
import { formatMessage } from 'umi/locale';
import Filter from './Filter';
import FileTable from './FileTable';
import FileTypeIconsBar from '@/components/FileTypeIconsBar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './index.less';

const defaultPage = { offset: 0, limit: 10 };

@connect(state => ({
  mediafile: state.mediafile,
  folders: state.mediafile.folders,
  filterName: state.mediafile.filterName,
  existSubdFolders: state.mediafile.existSubdFolders,
}))
@Form.create()
class File extends React.PureComponent {
  state = {
    searchValues: {},
    folderId: undefined,
    fileName: undefined,
    uploading: false,
  };

  componentDidMount() {
    const { filterName, dispatch } = this.props;
    dispatch({
      type: 'mediafile/fetchFolders',
      payload: {
        filterName,
        offset: 0,
        limit: 1000,
      },
    });
    dispatch({
      type: 'mediafile/fetch',
      payload: defaultPage,
    });
  }

  beforeUpload = (file) => {
    const { folderId } = this.state;
    if (!folderId) {
      message.error('请先点击上门目录名称选择文件目录!');
      return false;
    }
    // const isCSV = file.name.toUpperCase().endsWith('CSV');
    // if (!isCSV) {
    //   message.error('必须上传CSV格式文件!');
    // } else {
    //   this.setState({ fileName: file.name, uploading: true });
    // }
    this.setState({ fileName: file.name, uploading: true });
    return true;
  }

  handleUploadChange = (info) => {
    if (info.file.status === 'done') {
      // const { file: { response: { uid } } } = info;
      const { dispatch } = this.props;
      const { folderId } = this.state;
      this.setState({ uploading: false });
      dispatch({
        type: 'mediafile/fetch',
        payload: { folderId, ...defaultPage },
      });
      message.success(`文件${info.file.name}上传成功！`);
    } else if (info.file.status === 'error') {
      this.setState({ uploading: false });
      message.error(`文件${info.file.name}上传失败！`);
    }
  }

  handleTableChange = (params) => {
    const { dispatch } = this.props;
    const { searchValues } = this.state;

    dispatch({
      type: 'mediafile/fetch',
      payload: { ...params, ...searchValues },
    });
  }

  handleSearch = (params) => {
    const { filterName, dispatch } = this.props;
    const { folderId } = params;
    dispatch({
      type: 'mediafile/fetchFolders',
      payload: {
        parentId: folderId,
        filterName,
        offset: 0,
        limit: 1000,
      },
    });
    dispatch({
      type: 'mediafile/fetch',
      payload: {
        ...params,
        ...defaultPage,
      },
    });
    this.setState({
      folderId,
      searchValues: params,
    });
  }

  handleFilterReset = () => {
    const { dispatch } = this.props;
    const { folderId } = this.state;
    this.setState({
      searchValues: {},
    });
    dispatch({
      type: 'mediafile/fetch',
      payload: {
        folderId,
        ...defaultPage,
      },
    });
  }

  render() {
    const {
      mediafile: {
        loading,
        list,
        pagination,
      },
      folders,
      existSubdFolders,
    } = this.props;
    const tableData = { list, pagination };
    const { folderId, fileName, uploading } = this.state;

    const uploadProps = {
      name: 'file',
      action: '/api/media/files/upload',
      data: { file_name: fileName, folder_id: folderId },
      beforeUpload: this.beforeUpload,
      onChange: this.handleUploadChange,
      className: 'upload-list-inline',
    };

    // const uploadButton = (
    //   <div>
    //     <Icon type="upload" />
    //     <div className="ant-upload-text">
          
    //     </div>
    //   </div>
    // );

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Spin tip="Uploading..." spinning={uploading}>
              <div className={styles.tableListForm}>
                <Filter
                  folders={folders}
                  existSubdFolders={existSubdFolders}
                  onSearch={this.handleSearch}
                  onReset={this.handleFilterReset}
                />
              </div>
              <div style={{ marginBottom: 8 }}>
                <FileTypeIconsBar />
              </div>
              <div style={{ marginBottom: 8 }}>
                <Upload {...uploadProps}>
                  <Button type="primary">
                    <Icon type="upload" /> {formatMessage({ id: 'Ops.upload' })}
                  </Button>
                </Upload>
              </div>
              <FileTable
                loading={loading}
                data={tableData}
                onChange={this.handleTableChange}
              />
            </Spin>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default File;
