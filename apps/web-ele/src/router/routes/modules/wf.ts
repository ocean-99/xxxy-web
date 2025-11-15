import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      order: 11,
      title: '流程管理',
    },
    name: 'Wf',
    path: '/wf',
    children: [
      {
        name: 'WfBusCate',
        path: '/wf/bus/cate',
        component: () => import('#/views/wf/bus/cate/index.vue'),
        meta: {
          title: '流程分类',
        },
      },
      {
        name: 'WfBusTmpl',
        path: '/wf/bus/tmpl',
        component: () => import('#/views/wf/bus/tmpl/index.vue'),
        meta: {
          title: '流程模板',
        },
      },
      {
        name: 'WfBusTmplEdit',
        path: '/wf/bus/tmpl/edit',
        component: () => import('#/views/wf/bus/tmpl/edit.vue'),
        meta: {
          title: '流程模板编辑',
          hideInMenu: true,
          keepAlive: true,
          activePath: '/wf/bus/tmpl',
        },
      },
      {
        name: 'WfBusMain',
        path: '/wf/bus/main',
        component: () => import('#/views/wf/bus/main/index.vue'),
        meta: {
          title: '流程清单',
          affixTab: true,
        },
      },
      {
        name: 'WfBusMainEdit',
        path: '/wf/bus/main/edit',
        component: () => import('#/views/wf/bus/main/edit.vue'),
        meta: {
          title: '流程编辑',
          hideInMenu: true,
          keepAlive: true,
          activePath: '/wf/bus/main',
        },
      },
      {
        name: 'WfBusMainView',
        path: '/wf/bus/main/view',
        component: () => import('#/views/wf/bus/main/view.vue'),
        meta: {
          title: '流程查看',
          hideInMenu: true,
          keepAlive: true,
          activePath: '/wf/bus/main',
        },
      },
      {
        name: 'WfTodo',
        path: '/wf/todo',
        component: () => import('#/views/wf/todo/index.vue'),
        meta: {
          title: '流程待办',
        },
      },
      {
        name: 'WfOrgTree',
        path: '/wf/org/tree',
        component: () => import('#/views/wf/org/tree/index.vue'),
        meta: {
          title: '流程组织',
        },
      },
      {
        name: 'WfOrgNode',
        path: '/wf/org/node',
        component: () => import('#/views/wf/org/node/index.vue'),
        meta: {
          title: '组织节点',
          hideInMenu: true,
          keepAlive: true,
          activePath: '/wf/org/node',
        },
      },
      {
        name: 'WfOrgTree2',
        path: '/wf/org/tree2',
        component: () => import('#/views/wf/todo/index2.vue'),
        meta: {
          title: '待办测试',
        },
      },
    ],
  },
];

export default routes;
