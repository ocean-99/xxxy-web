import type { RouteRecordRaw } from 'vue-router';

import { $t } from '@vben/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      order: 3,
      title: '系统管理',
    },
    name: 'Sys',
    path: '/sys',
    children: [
      {
        name: 'SysOrgDept',
        path: '/sys/org/dept',
        component: () => import('#/views/sys/org/dept/index.vue'),
        meta: {
          // affixTab: true,
          title: '部门管理',
        },
      },
      {
        name: 'SysOrgUser',
        path: '/sys/org/user',
        component: () => import('#/views/sys/org/user/index.vue'),
        meta: {
          title: '用户管理',
          keepAlive: true,
        },
      },
      {
        name: 'SysOrgUserEdit',
        path: '/sys/org/user/edit',
        component: () => import('#/views/sys/org/user/tedit.vue'),
        meta: {
          title: '用户编辑',
          hideInMenu: true,
          keepAlive: true,
          activePath: '/sys/org/user',
        },
      },
      {
        name: 'Profile',
        path: '/profile',
        component: () => import('#/views/_core/profile/index.vue'),
        meta: {
          icon: 'mingcute:profile-line',
          title: $t('ui.widgets.profile'),
          hideInMenu: true,
          requireHomeRedirect: true,
        },
      },
      {
        name: 'SysOrgPost',
        path: '/sys/org/post',
        component: () => import('#/views/sys/org/post/index.vue'),
        meta: {
          title: '岗位管理',
        },
      },
      {
        name: 'SysOrgGroup',
        path: '/sys/org/group',
        component: () => import('#/views/sys/org/group/index.vue'),
        meta: {
          title: '群组管理',
        },
      },
      {
        name: 'SysPermMenu',
        path: '/sys/perm/menu',
        component: () => import('#/views/sys/perm/menu/index.vue'),
        meta: {
          title: '菜单管理',
        },
      },
      {
        name: 'SysPermApi',
        path: '/sys/perm/api',
        component: () => import('#/views/sys/perm/api/index.vue'),
        meta: {
          title: '接口管理',
        },
      },
      {
        name: 'SysPermRole',
        path: '/sys/perm/role',
        component: () => import('#/views/sys/perm/role/index.vue'),
        meta: {
          title: '角色管理',
        },
      },
      {
        name: 'SysPermRoleEdit',
        path: '/sys/perm/role/edit',
        component: () => import('#/views/sys/perm/role/edit.vue'),
        meta: {
          title: '角色编辑',
          hideInMenu: true,
          keepAlive: true,
          activePath: '/sys/perm/role',
        },
      },
      {
        name: 'SysConfig',
        path: '/sys/config',
        component: () => import('#/views/sys/config/index.vue'),
        meta: {
          title: '参数设置',
        },
      },
      {
        name: 'SysNotice',
        path: '/sys/notice',
        component: () => import('#/views/sys/notice/index.vue'),
        meta: {
          title: '通知公告',
        },
      },
    ],
  },
  {
    meta: {
      order: 4,
      title: '监控中心',
    },
    name: 'Mon',
    path: '/mon',
    children: [
      {
        name: 'MonOnlineUser',
        path: '/mon/online/user',
        component: () => import('#/views/mon/online/user/index.vue'),
        meta: {
          title: '在线用户',
        },
      },
      {
        name: 'MonLoginLog',
        path: '/mon/login/log',
        component: () => import('#/views/mon/login/log/index.vue'),
        meta: {
          title: '登录日志',
        },
      },
      {
        name: 'MonOperLog',
        path: '/mon/oper/log',
        component: () => import('#/views/mon/oper/log/index.vue'),
        meta: {
          title: '操作日志',
        },
      },
      {
        name: 'MonServer',
        path: '/mon/server',
        component: () => import('#/views/mon/server/index.vue'),
        meta: {
          title: '服务监控',
        },
      },
      {
        name: 'MonCache',
        path: '/mon/cache',
        component: () => import('#/views/mon/cache/index.vue'),
        meta: {
          title: '缓存监控',
        },
      },
      {
        name: 'MonJobMain',
        path: '/mon/job/main',
        component: () => import('#/views/mon/job/main/index.vue'),
        meta: {
          title: '定时任务',
        },
      },
      {
        name: 'MonJobLog',
        path: '/mon/job/log',
        component: () => import('#/views/mon/job/log/index.vue'),
        meta: {
          title: '任务日志',
          hideInMenu: true,
        },
      },
    ],
  },
  {
    meta: {
      order: 5,
      title: '辅助工具',
    },
    name: 'Tool',
    path: '/tool',
    children: [
      {
        name: 'ToolDict',
        path: '/tool/dict',
        component: () => import('#/views/tool/dict/index.vue'),
        meta: {
          title: '字典工具',
        },
      },
      {
        name: 'ToolNum',
        path: '/tool/num',
        component: () => import('#/views/tool/num/index.vue'),
        meta: {
          title: '编号工具',
        },
      },
      {
        name: 'ToolOss',
        path: '/tool/oss',
        component: () => import('#/views/tool/oss/main/index.vue'),
        meta: {
          title: '文件工具',
        },
      },
      {
        name: 'ToolForm',
        path: '/tool/form',
        component: () => import('#/views/tool/form/index.vue'),
        meta: {
          title: '在线表单',
        },
      },
      {
        name: 'ToolFormEdit',
        path: '/tool/form/edit',
        component: () => import('#/views/tool/form/edit.vue'),
        meta: {
          title: '在线表单',
          hideInMenu: true,
          keepAlive: true,
          activePath: '/tool/form',
        },
      },
      {
        name: 'ToolCode',
        path: '/tool/code',
        component: () => import('#/views/tool/code/index.vue'),
        meta: {
          title: '代码生成',
        },
      },
      {
        name: 'ToolCodeEdit',
        path: '/tool/code/edit',
        component: () => import('#/views/tool/code/edit.vue'),
        meta: {
          title: '代码生成',
          hideInMenu: true,
          keepAlive: true,
          activePath: '/tool/code',
        },
      },
    ],
  },
];

export default routes;
