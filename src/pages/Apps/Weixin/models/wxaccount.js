import pathToRegexp from 'path-to-regexp';
import queryString from 'query-string';
import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import * as wxaccountService from '@/services/apps/Weixin/wxaccount';

export default {
  namespace: 'wxaccount',

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
    errors: undefined,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname, search }) => {
        if (pathname.indexOf('weixin/wxaccount/show') !== -1) {
          const match = pathToRegexp('/weixin/wxaccount/show').exec(pathname);
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
      const response = yield call(wxaccountService.query, payload);
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
    *fetchAccount({ payload = {} }, { call, put }) {
      const account = yield call(wxaccountService.get, payload);
      yield put({
        type: 'updateState',
        payload: {
          currentItem: account,
        },
      });
    },
    *delete({ payload }, { call, put, select }) {
      yield call(wxaccountService.remove, { id: payload });
      const { selectedRowKeys } = yield select(_ => _.user);
      yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } });
      yield put({ type: 'fetch' });
    },
    *create({ payload }, { call, put }) {
      const data = yield call(wxaccountService.create, payload);
      if (data) {
        yield put({ type: 'hideModal' });
        yield put({ type: 'fetch' });
      }
    },
    *update({ payload }, { call, put }) {
      const data = yield call(wxaccountService.update, payload);
      if (data) {
        yield put({ type: 'hideModal' });
        yield put({ type: 'fetch' });
      }
    },
    *updateSearchState({ payload }, { put }) {
      yield put({ type: 'updateState', payload });
    },
    *syncAccessToken({ payload }, { call }) {
      const data = yield call(wxaccountService.syncAccessToken, payload);
      if (data.code === 0) {
        message.success(formatMessage({ id: 'Msg.refreshAccessToken.success' }));
      } else {
        const title = formatMessage({ id: 'Msg.refreshAccessToken.fail' });
        const errorMsg = formatMessage({ id: 'Msg.errorMsg' });
        message.error(`${title}${errorMsg}${data.message}`);
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
