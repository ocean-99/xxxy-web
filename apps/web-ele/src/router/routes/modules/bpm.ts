import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      order: 11,
      title: '流程管理',
    },
    name: 'Bpm',
    path: '/bpm',
    children: [
      {
        name: 'BpmBusCate',
        path: '/bpm/bus/cate',
        component: () => import('#/views/bpm/bus/cate/index.vue'),
        meta: {
          title: '流程分类',
        },
      },
      {
        name: 'BpmBusTmpl',
        path: '/bpm/bus/tmpl',
        component: () => import('#/views/bpm/bus/tmpl/index.vue'),
        meta: {
          title: '流程模板',
        },
      },
      {
        name: 'BpmBusTmplEdit',
        path: '/bpm/bus/tmpl/edit',
        component: () => import('#/views/bpm/bus/tmpl/edit.vue'),
        meta: {
          title: '流程模板编辑',
          hideInMenu: true,
          keepAlive: true,
          activePath: '/bpm/bus/tmpl',
        },
      },
      {
        name: 'BpmBusMain',
        path: '/bpm/bus/main',
        component: () => import('#/views/bpm/bus/main/index.vue'),
        meta: {
          title: '流程清单',
          affixTab: true,
        },
      },
      {
        name: 'BpmBusMainEdit',
        path: '/bpm/bus/main/edit',
        component: () => import('#/views/bpm/bus/main/edit.vue'),
        meta: {
          title: '流程编辑',
          hideInMenu: true,
          keepAlive: true,
          activePath: '/bpm/bus/main',
        },
      },
      {
        name: 'BpmBusMainView',
        path: '/bpm/bus/main/view',
        component: () => import('#/views/bpm/bus/main/view.vue'),
        meta: {
          title: '流程查看',
          hideInMenu: true,
          keepAlive: true,
          activePath: '/bpm/bus/main',
        },
      },
      {
        name: 'BpmTodo',
        path: '/bpm/todo',
        component: () => import('#/views/bpm/todo/index.vue'),
        meta: {
          title: '流程待办',
        },
      },
      {
        name: 'BpmOrgTree',
        path: '/bpm/org/tree',
        component: () => import('#/views/bpm/org/tree/index.vue'),
        meta: {
          title: '流程组织',
        },
      },
      {
        name: 'BpmOrgNode',
        path: '/bpm/org/node',
        component: () => import('#/views/bpm/org/node/index.vue'),
        meta: {
          title: '组织节点',
          hideInMenu: true,
          keepAlive: true,
          activePath: '/bpm/org/node',
        },
      },
      {
        name: 'BpmOrgTree2',
        path: '/bpm/org/tree2',
        component: () => import('#/views/bpm/todo/index2.vue'),
        meta: {
          title: '待办测试',
        },
      },
    ],
  },
];

export default routes;
