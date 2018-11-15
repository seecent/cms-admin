import * as departmentService from '@/services/department';

export default {
  namespace: 'department',

  state: {
    list: [],
    pagination: {},
    loading: false,
    departments: [],
    modalVisible: false,
    modalTitle: '',
    modalType: 'create',
    currentItem: {},
    selectedRowKeys: [],
    errors: undefined,
  },
  effects: {
    *fetch({ payload = {} }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(departmentService.query, payload);
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
    *fetchAllDepartments({ payload = {} }, { call, put }) {
      const departments = yield call(departmentService.getAllDepartments, payload);
      yield put({
        type: 'updateState',
        payload: {
          departments,
        },
      });
    },
    *delete({ payload }, { call, put, select }) {
      yield call(departmentService.remove, { id: payload });
      const { selectedRowKeys } = yield select(_ => _.user);
      yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } });
      yield put({ type: 'fetch' });
    },

    *multiDelete({ payload }, { call, put }) {
      const data = yield call(departmentService.batchRemove, payload);
      if (data) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } });
        yield put({ type: 'fetch' });
      }
    },

    *create({ payload }, { call, put }) {
      const data = yield call(departmentService.create, payload);
      if (data) {
        yield put({ type: 'hideModal' });
        yield put({ type: 'fetch' });
      }
    },

    *update({ payload }, { call, put }) {
      const data = yield call(departmentService.update, payload);
      if (data) {
        yield put({ type: 'hideModal' });
        yield put({ type: 'fetch' });
      }
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
