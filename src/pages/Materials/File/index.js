import React from 'react';
import { connect } from 'dva';
import { Card, Form } from 'antd';
import Filter from './Filter';
import FileTable from './FileTable';
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
    console.log(folders);

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Filter
                folders={folders}
                existSubdFolders={existSubdFolders}
                onSearch={this.handleSearch}
                onReset={this.handleFilterReset}
              />
            </div>
            <FileTable
              loading={loading}
              data={tableData}
              onChange={this.handleTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default File;
