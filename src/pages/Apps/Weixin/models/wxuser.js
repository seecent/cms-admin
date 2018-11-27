import pathToRegexp from 'path-to-regexp';
import queryString from 'query-string';
import * as wxaccountService from '@/services/apps/Weixin/wxaccount';
import * as wxuserService from '@/services/apps/Weixin/wxuser';

export default {
  namespace: 'wxuser',

  state: {
    list: [],
    pagination: {},
    loading: false,
    modalVisible: false,
    modalTitle: '',
    modalType: 'create',
    currentItem: {},
    selectedRowKeys: [],
    accountId: undefined,
    accounts: [],
    errors: undefined,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname, search }) => {
        if (pathname.indexOf('weixin/wxuser/show') !== -1) {
          const match = pathToRegexp('/weixin/wxuser/show').exec(pathname);
          if (match) {
            const query = queryString.parse(search);
            dispatch({
              type: 'updateSearchState',
              payload: {
                accountId: query.id,
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
      const response = yield call(wxuserService.query, payload);
      const total = response.headers['x-total-count'];
      const offset = Number(payload.offset) || 0;
      const limit = Number(payload.limit) || 10;
      yield put({
        type: 'save',
        payload: {
          list: response.list,
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
    *fetchAllAccounts({ payload = {} }, { call, put }) {
      const accounts = yield call(wxaccountService.getAllAccounts, payload);
      yield put({
        type: 'updateState',
        payload: {
          accounts,
        },
      });
    },
    *delete({ payload }, { call, put, select }) {
      yield call(wxuserService.remove, { id: payload });
      const { selectedRowKeys } = yield select(_ => _.user);
      yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } });
      yield put({ type: 'fetch' });
    },
    *create({ payload }, { call, put }) {
      const data = yield call(wxuserService.create, payload);
      if (data) {
        yield put({ type: 'hideModal' });
        yield put({ type: 'fetch' });
      }
    },
    *update({ payload }, { call, put }) {
      const data = yield call(wxuserService.update, payload);
      if (data) {
        yield put({ type: 'hideModal' });
        yield put({ type: 'fetch' });
      }
    },
    *updateSearchState({ payload }, { put }) {
      yield put({ type: 'updateState', payload });
    },
    *syncAllUsers({ payload }, { call }) {
      yield call(wxuserService.syncAllWxUsers, payload);
    },
    *syncUser({ payload }, { call }) {
      yield call(wxuserService.syncWxUser, payload);
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
