const EnumRoleType = {
  ADMIN: 'admin',
  DEFAULT: 'admin',
  DEVELOPER: 'developer',
};

const Permission = {
  VIEW: 1,
  CREATE: 2,
  UPDATE: 3,
  DELETE: 4,
  IMPORT: 5,
  EXPORT: 6,
  UPLOAD: 7,
  DOWNLOAD: 8,
  CHANGE_STATUS: 9,
  ASSIGN: 10,
};

const Operation = {
  SHOW: '1',
  CREATE: '2',
  UPDATE: '3',
  DELETE: '4',
  IMPORT: '5',
  EXPORT: '6',
  UPLOAD: '7',
  DOWNLOAD: '8',
  CHANGE_STATUS: '9',
  ASSIGN: '10',
};

module.exports = {
  EnumRoleType,
  Permission,
  Operation,
};
