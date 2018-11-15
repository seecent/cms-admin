import * as menuService from '@/services/menus';
import { parseTree } from '@/utils/utils';

const defaultPage = { offset: 0, limit: 1000 };

export default {
  namespace: 'menus',

  state: {
    list: [],
    pagination: {},
    loading: false,
    modalVisible: false,
    modalTitle: '',
    modalType: 'create',
    currentItem: {},
    selectedRowKeys: [],
    errors: undefined,
    expandedRows: [],
    menuTreeDatas: [],
  },
  effects: {
    *fetch({ payload = {} }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(menuService.query, payload);
      const total = response.headers['x-total-count'];
      const offset = Number(payload.offset) || 0;
      const limit = Number(payload.limit) || 10;
      const treeList = parseTree(response.list, 'id', 'parent_id');
      yield put({
        type: 'save',
        payload: {
          list: treeList,
          pagination: {
            current: (offset / limit) + 1,
            pageSize: limit,
            total: Number(total),
          },
        },
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchMenuTreeDatas({ payload = {} }, { call, put }) {
      const response = yield call(menuService.query, payload);
      const treeList = parseTree(response.list, 'id', 'parent_id');
      yield put({
        type: 'updateState',
        payload: {
          menuTreeDatas: treeList,
        },
      });
    },
    *delete({ payload }, { call, put }) {
      yield call(menuService.remove, { id: payload.id });
      yield put({ type: 'fetch', payload: defaultPage });
    },
    *create({ payload }, { call, put }) {
      const data = yield call(menuService.create, payload);
      if (data) {
        yield put({ type: 'hideModal' });
        yield put({ type: 'fetch', payload: defaultPage });
      }
    },

    *update({ payload }, { call, put }) {
      const data = yield call(menuService.update, payload);
      if (data) {
        yield put({ type: 'hideModal' });
        yield put({ type: 'fetch', payload: defaultPage });
      }
    },
  },

  reducers: {
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
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
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
