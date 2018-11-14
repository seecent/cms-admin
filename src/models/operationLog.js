import * as oprationLogsService from '../services/operationLog';

export default {
  namespace: 'operationLog',

  state: {
    list: [],
    pagination: {},
    loading: false,
  },
  effects: {
    *fetch({ payload = {} }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(oprationLogsService.query, payload);
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
  },
};
