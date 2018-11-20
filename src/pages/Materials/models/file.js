import * as fileService from '@/services/file';
import * as folderService from '@/services/folder';

export default {
  namespace: 'mediafile',

  state: {
    list: [],
    pagination: {},
    loading: false,
    folders: [],
    folderId: undefined,
    filterName: undefined,
    existSubdFolders: true,
    mediafileId: undefined,
    mediafile: {},
    images: [],
  },
  effects: {
    *fetch({ payload = {} }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(fileService.query, payload);
      const total = response.headers['x-total-count'];
      if (response.list) {
        const { list } = response;
        const images = [];
        for (let i = 0; i < list.length; i+=1) {
          const item = list[i];
          if(item.type === 'FileType.IMAGE') {
            item.no = i;
            images.push({ no: i, src: item.url });
          }
        }
        yield put({
          type: 'save',
          payload: {
            list,
            pagination: {
              pageSize: Number(payload.limit) || 10,
              total: Number(total),
            },
            images,
          },
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchFile({ payload = {} }, { call, put }) {
      const response = yield call(fileService.get, payload);
      yield put({
        type: 'updateState',
        payload: {
          mediafile: response,
        },
      });
    },
    *fetchFolders({ payload = {} }, { call, put }) {
      const response = yield call(folderService.query, payload);
      if (response) {
        const { parentId, filterName } = payload;
        const { list } = response;
        if (list && list.length > 0) {
          yield put({
            type: 'updateState',
            payload: {
              folderId: parentId,
              folders: list,
              existSubdFolders: true,
            },
          });
        } else if (!parentId && filterName) {
          yield put({
            type: 'updateState',
            payload: {
              folderId: parentId,
              folders: [],
              existSubdFolders: false,
            },
          });
        } else {
          yield put({
            type: 'updateState',
            payload: {
              existSubdFolders: false,
            },
          });
        }
      }
    },
    *updateSearchState({ payload }, { put }) {
      yield put({ type: 'updateState', payload });
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    save(state, { payload }) {
      const { list, pagination, images } = payload;
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
        images,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};
