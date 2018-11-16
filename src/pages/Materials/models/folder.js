import pathToRegexp from 'path-to-regexp';
import queryString from 'query-string';
import { parseTree } from '@/utils/utils';

import * as folderService from '@/services/folder';

export default {
  namespace: 'mediafolder',

  state: {
    list: [],
    pagination: {},
    loading: false,
    folderTreeDatas: [],
    currentfolder: {},
    modalType: 'create',
    modalVisible: false,
    modalTitle: '',
    folderId: undefined,
    parentId: undefined,
    currentItem: {},
    selectedRowKeys: [],
    errors: undefined,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname, search }) => {
        if (pathname.indexOf('material/folder/show') !== -1) {
          const match = pathToRegexp('/material/folder/show').exec(pathname);
          if (match) {
            const query = queryString.parse(search);
            dispatch({
              type: 'updateSearchState',
              payload: {
                folderId: query.id,
              },
            });
          }
        } else if (pathname.indexOf('material/folder') !== -1) {
          const match = pathToRegexp('/material/folder').exec(pathname);
          if (match) {
            const query = queryString.parse(search);
            dispatch({
              type: 'updateSearchState',
              payload: {
                parentId: query.parentId,
              },
            });
          }
        }
      });
    },
  },
  effects: {
    *fetch({ payload = {} }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(folderService.query, payload);
      const total = response.headers['x-total-count'];
      yield put({
        type: 'save',
        payload: {
          list: response.list,
          pagination: {
            pageSize: Number(payload.limit) || 10,
            total: Number(total),
          },
        },
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchFolderTreeDatas({ payload = {} }, { call, put }) {
      const response = yield call(folderService.getAllFolders, payload);
      const treeList = parseTree(response, 'id', 'parent_id');
      yield put({
        type: 'updateState',
        payload: {
          folderTreeDatas: treeList,
        },
      });
    },
    *fetchFolder({ payload = {} }, { call, put }) {
      const folder = yield call(folderService.get, payload);
      if (folder) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: folder,
          },
        });
      }
    },
    *delete({ payload }, { call, put, select }) {
      yield call(folderService.remove, { id: payload });
      const { selectedRowKeys } = yield select(_ => _.folder);
      yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } });
      yield put({ type: 'fetch' });
    },

    *multiDelete({ payload }, { call, put }) {
      const data = yield call(folderService.batchRemove, payload);
      if (data) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } });
        yield put({ type: 'fetch' });
      }
    },

    *create({ payload }, { call, put }) {
      const data = yield call(folderService.create, payload);
      if (data) {
        yield put({ type: 'hideModal' });
        yield put({ type: 'fetch' });
      }
    },

    *update({ payload }, { call, put }) {
      const data = yield call(folderService.update, payload);
      if (data) {
        yield put({ type: 'hideModal' });
        yield put({ type: 'fetch' });
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
      const { list, pagination } = payload;
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true };
    },
    hideModal(state) {
      return { ...state, modalVisible: false };
    },
  },
};
