import moment from 'moment';

export function formatDateStr(t) {
  if (t === 'None') {
    return '';
  }
  if (t) {
    if (t.indexOf(' ') !== -1) {
      const s = t.split(' ');
      return s[0];
    }
  }
  return t;
}

export function formatDateTimeStr(t) {
  if (t === 'None') {
    return '';
  }
  if (t) {
    if (typeof(t) === 'string') {
      if (t.indexOf('.') !== -1) {
        const s = t.split('.');
        return s[0];
      }
    } else if (typeof(t) === 'number') {
      return moment(t * 1000).format("YYYY-MM-DD HH:mm:ss");
    }
  }
  return t;
}



export function formatEnumStr(t, enums) {
  for (let i = 0; i < enums.length; i += 1) {
    const e = enums[i];
    if (e.value === t) {
      return e.text;
    }
  }
  return '';
}

export function formatListStr(id, list) {
  for (let i = 0; i < list.length; i += 1) {
    const e = list[i];
    if (e.id === id) {
      return e.name;
    }
  }
  return '';
}

export function formatLanguage(lang) {
  if (lang === 'zh-CN') {
    return '简体中文';
  }
  return 'English';
}

export function flattenMessages(nestedMessages, prefix = '') {
  return Object.keys(nestedMessages).reduce((messages, key) => {
    const value = nestedMessages[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      Object.assign(messages, { [prefixedKey]: value });
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }
    return messages;
  }, {});
}

export function jsonDelete(params) {
  return {
    method: 'DELETE',
    body: JSON.stringify(params),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
    },
  };
}

export function pageData(response) {
  return {
    list: response.list,
    pagination: {
      total: Number(response.headers['x-total-count']),
      pageSize: Number(response.limit) || 10,
    },
  };
}

export function formatTreeDatas(treeDatas) {
  const datas = [];
  for (let i = 0; i < treeDatas.length; i += 1) {
    const data = {};
    if (treeDatas[i].children) {
      data.children = formatTreeDatas(treeDatas[i].children);
    }
    data.title = treeDatas[i].name;
    data.value = `${treeDatas[i].id}`;
    data.key = treeDatas[i].code;
    datas.push(data);
  }
  return datas;
}

// 计算两个整数的百分比值
export function getPercent(num, total) {
  const n = parseFloat(num);
  const t = parseFloat(total);
  // if (isNaN(n) || isNaN(t)) {
  //   return '-';
  // }
  if (total <= 0) {
    return '0%';
  }
  const p = Math.round((n * 100) / t);
  return `${p}%`;
}

export function tableTreeData(data) {
  const ID_KEY = 'id';
  const PARENT_KEY = 'parent_id';
  const CHILDREN_KEY = 'children';

  const tree = [];
  const items = [];
  const childrenOf = {};
  let item;
  let id;
  let parentId;

  for (let i = 0; i < data.length; i += 1) {
    item = data[i];
    id = item[ID_KEY];
    parentId = item[PARENT_KEY] || 0;
    childrenOf[id] = childrenOf[id] || [];
    item[CHILDREN_KEY] = childrenOf[id] || [];
    const newItem = { key: id, ...item };
    items.push(newItem);
    if (parentId !== 0) {
      childrenOf[parentId] = childrenOf[parentId] || [];
      childrenOf[parentId].push(newItem);
    } else {
      tree.push(newItem);
    }
  }

  let children;
  for (let i = 0; i < items.length; i += 1) {
    item = items[i];
    children = item[CHILDREN_KEY];
    if (children && children.length === 0) {
      delete item[CHILDREN_KEY];
    }
  }

  return tree;
}

export function pageTreeData(response) {
  return {
    list: tableTreeData(response.list),
    pagination: {
      total: Number(response.headers['x-total-count']),
      pageSize: Number(response.limit) || 10,
    },
  };
}

export function selectTreeData(data, vkey, lkey) {
  const ID_KEY = 'id';
  const PARENT_KEY = 'parent_id';

  const tree = [];
  const items = [];
  const childrenOf = {};
  let item;
  let id;
  let parentId;
  let children;

  for (let i = 0; i < data.length; i += 1) {
    item = data[i];
    id = item[ID_KEY];
    parentId = item[PARENT_KEY] || 0;
    childrenOf[id] = childrenOf[id] || [];
    children = childrenOf[id] || [];
    const newItem = { key: id, value: `${item[vkey]}`, label: item[lkey], children };
    items.push(newItem);
    if (parentId !== 0) {
      childrenOf[parentId] = childrenOf[parentId] || [];
      childrenOf[parentId].push(newItem);
    } else {
      tree.push(newItem);
    }
  }

  for (let i = 0; i < items.length; i += 1) {
    item = items[i];
    if (item.children && item.children.length === 0) {
      delete item.children;
    }
  }

  return tree;
}

export class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = 'InternalServerError';
  }
}

export class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    // this.name = this.constructor.name;
    this.message = message;
    this.name = 'UnauthorizedError';
  }
}
// UnauthorizedError.prototype = Error.prototype;

export const isAuthError = (err) => err.name === 'UnauthorizedError';
