import pathToRegexp from 'path-to-regexp';
import queryString from 'query-string';
import * as roleService from '../services/role';
import * as menuService from '../services/menus';
import { parseTree } from '../utils/utils';

export default {
  namespace: 'role',

  state: {
    list: [],
    pagination: {},
    loading: false,
    roles: [],
    modalVisible: false,
    modalTitle: '',
    modalType: 'create',
    currentItem: {},
    selectedRowKeys: [],
    errors: undefined,
    treeModalVisible: false,
    menuTreeDatas: [],
    roleid: undefined,
    userList: [],
    userListPagination: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname, search }) => {
        if (pathname.indexOf('system/role/show') !== -1) {
          const match = pathToRegexp('/system/role/show').exec(pathname);
          if (match) {
            const query = queryString.parse(search);
            dispatch({
              type: 'updateSearchState',
              payload: {
                roleid: query.id,
              },
            });
          }
        }
        if (pathname.indexOf('system/role') !== -1) {
          dispatch({
            type: 'fetchMenuTreeDatas',
            payload: { offset: 0, limit: 1000 },
          });
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
      const response = yield call(roleService.query, payload);
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
    *fetchAllRoles({ payload = {} }, { call, put }) {
      const roles = yield call(roleService.getAllRoles, payload);
      yield put({
        type: 'updateState',
        payload: {
          roles,
        },
      });
    },
    *delete({ payload }, { call, put, select }) {
      yield call(roleService.remove, { id: payload });
      const { selectedRowKeys } = yield select(_ => _.user);
      yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } });
      yield put({ type: 'fetch' });
    },
    *create({ payload }, { call, put }) {
      const data = yield call(roleService.create, payload);
      if (data) {
        yield put({ type: 'hideModal' });
        yield put({ type: 'fetch' });
      }
    },

    *update({ payload }, { call, put }) {
      const data = yield call(roleService.update, payload);
      if (data) {
        yield put({ type: 'hideModal' });
        yield put({ type: 'fetch' });
      }
    },

    *updateSearchState({ payload }, { put }) {
      yield put({ type: 'updateState', payload });
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

    *fetchMenus({ payload }, { call, put, select }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const list = yield select(state => state.role.list);
      const menus = yield call(roleService.getMenus, payload);
      if (payload.id) {
        list.forEach((item) => {
          if (item.id === payload.id) {
            /* eslint-disable no-param-reassign */
            item.menus = menus;
          }
        });
      }
      yield put({
        type: 'updateState',
        payload: {
          list,
        },
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    *updateMenus({ payload }, { call, put }) {
      const data = yield call(roleService.updateMenus, payload);
      if (data) {
        yield put({ type: 'hideTreeModal' });
        yield put({ type: 'fetch' });
      }
    },

    *fetchRole({ payload = {} }, { call, put }) {
      const role = yield call(roleService.get, payload);
      if (role) {
        const menus = yield call(roleService.getMenus, payload);
        role.menus = menus;
        yield put({
          type: 'updateState',
          payload: {
            currentItem: role,
          },
        });
      }
    },

    *fetchUsers({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(roleService.getAllUsers, payload);
      const total = response.headers['x-total-count'];
      const offset = Number(payload.offset) || 0;
      const limit = Number(payload.limit) || 10;
      yield put({
        type: 'updateState',
        payload: {
          userList: response.list,
          userListPagination: {
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
    showTreeModal(state, { payload }) {
      return { ...state, ...payload, treeModalVisible: true };
    },
    hideTreeModal(state) {
      return { ...state, treeModalVisible: false };
    },
  },
};
