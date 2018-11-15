import pathToRegexp from 'path-to-regexp';
import queryString from 'query-string';
import { parseTree } from '@/utils/utils';

import * as organizationService from '@/services/organization';

export default {
  namespace: 'organization',

  state: {
    list: [],
    pagination: {},
    loading: false,
    orgTreeDatas: [],
    currentOrganization: {},
    modalType: 'create',
    modalVisible: false,
    modalTitle: '',
    organizationId: undefined,
    currentItem: {},
    selectedRowKeys: [],
    errors: undefined,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname, search }) => {
        if (pathname.indexOf('system/organizations/show') !== -1) {
          const match = pathToRegexp('/system/organizations/show').exec(pathname);
          if (match) {
            const query = queryString.parse(search);
            dispatch({
              type: 'updateSearchState',
              payload: {
                organizationId: query.id,
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
      const response = yield call(organizationService.query, payload);
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
    *fetchOrgTreeDatas({ payload = {} }, { call, put }) {
      const response = yield call(organizationService.getAllOrgs, payload);
      const treeList = parseTree(response, 'id', 'parent_id');
      yield put({
        type: 'updateState',
        payload: {
          orgTreeDatas: treeList,
        },
      });
    },
    *fetchOrg({ payload = {} }, { call, put }) {
      const org = yield call(organizationService.get, payload);
      if (org) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: org,
          },
        });
      }
    },
    *syncOrgs({ payload = {} }, { call }) {
      yield call(organizationService.syncOrganizations, payload);
    },

    *delete({ payload }, { call, put, select }) {
      yield call(organizationService.remove, { id: payload });
      const { selectedRowKeys } = yield select(_ => _.organization);
      yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } });
      yield put({ type: 'fetch' });
    },

    *multiDelete({ payload }, { call, put }) {
      const data = yield call(organizationService.batchRemove, payload);
      if (data) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } });
        yield put({ type: 'fetch' });
      }
    },

    *create({ payload }, { call, put }) {
      const data = yield call(organizationService.create, payload);
      if (data) {
        yield put({ type: 'hideModal' });
        yield put({ type: 'fetch' });
      }
    },

    *update({ payload }, { call, put }) {
      const data = yield call(organizationService.update, payload);
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
