import analysis from './en-US/analysis';
import exception from './en-US/exception';
import form from './en-US/form';
import globalHeader from './en-US/globalHeader';
import login from './en-US/login';
import menu from './en-US/menu';
import monitor from './en-US/monitor';
import result from './en-US/result';
import settingDrawer from './en-US/settingDrawer';
import settings from './en-US/settings';
import pwa from './en-US/pwa';
import apps from './en-US/apps';
import file from './en-US/file';
import folder from './en-US/folder';
import menus from './en-US/menus';
import msg from './en-US/msg';
import operationlog from './en-US/operationlog';
import ops from './en-US/ops';
import organization from './en-US/organization';
import role from './en-US/role';
import user from './en-US/user';

export default {
  'navBar.lang': 'Languages',
  'layout.user.link.help': 'Help',
  'layout.user.link.privacy': 'Privacy',
  'layout.user.link.terms': 'Terms',
  'app.home.introduce': 'introduce',
  'app.forms.basic.title': 'Basic form',
  'app.forms.basic.description':
    'Form pages are used to collect or verify information to users, and basic forms are common in scenarios where there are fewer data items.',
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
};
