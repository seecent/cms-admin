import analysis from './zh-CN/analysis';
import exception from './zh-CN/exception';
import form from './zh-CN/form';
import globalHeader from './zh-CN/globalHeader';
import login from './zh-CN/login';
import menu from './zh-CN/menu';
import monitor from './zh-CN/monitor';
import result from './zh-CN/result';
import settingDrawer from './zh-CN/settingDrawer';
import settings from './zh-CN/settings';
import pwa from './zh-CN/pwa';
import apps from './zh-CN/apps';
import file from './zh-CN/file';
import folder from './zh-CN/folder';
import menus from './zh-CN/menus';
import msg from './zh-CN/msg';
import operationlog from './zh-CN/operationlog';
import ops from './zh-CN/ops';
import organization from './zh-CN/organization';
import role from './zh-CN/role';
import user from './zh-CN/user';
import wxaccount from './zh-CN/apps/Weixin/wxaccount';
import wxuser from './zh-CN/apps/Weixin/wxuser';

export default {
  'navBar.lang': '语言',
  'layout.user.link.help': '帮助',
  'layout.user.link.privacy': '隐私',
  'layout.user.link.terms': '条款',
  'app.home.introduce': '介绍',
  'app.forms.basic.title': '基础表单',
  'app.forms.basic.description':
    '表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。',
  ...analysis,
  ...exception,
  ...form,
  ...globalHeader,
  ...login,
  ...menu,
  ...monitor,
  ...result,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...apps,
  ...file,
  ...folder,
  ...menus,
  ...msg,
  ...operationlog,
  ...ops,
  ...organization,
  ...role,
  ...user,
  ...wxaccount,
  ...wxuser,
};
