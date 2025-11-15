import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      order: 999,
      title: '测试',
    },
    name: 'Test',
    path: '/test',
    children: [
      {
        name: 'Workspace1',
        path: '/workspace1',
        component: () => import('#/views/dashboard/workspace/test.vue'),
        meta: {
          title: '设计器',
          keepAlive: true,
        },
      },
      {
        name: 'Workspace2',
        path: '/workspace2',
        component: () => import('#/views/dashboard/workspace/test2.vue'),
        meta: {
          title: '渲染器2',
          keepAlive: true,
        },
      },
      {
        name: 'Workspace3',
        path: '/workspace3',
        component: () => import('#/views/dashboard/workspace/test3.vue'),
        meta: {
          title: '渲染器3',
          keepAlive: true,
        },
      },
      {
        name: 'Workspace4',
        path: '/workspace4',
        component: () => import('#/views/dashboard/workspace/test4.vue'),
        meta: {
          title: '设计器2',
          keepAlive: true,
        },
      },
      {
        name: 'Workspace5',
        path: '/workspace5',
        component: () => import('#/views/dashboard/workspace/test5.vue'),
        meta: {
          title: '设计器3',
          keepAlive: true,
        },
      },
    ],
  },
];

// export default routes;
