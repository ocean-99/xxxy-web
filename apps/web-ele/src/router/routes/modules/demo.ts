import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      order: 22,
      title: '使用案例',
    },
    name: 'Demo',
    path: '/demo',
    children: [
      {
        name: 'DemoSingleMain',
        path: '/demo/single/main',
        component: () => import('#/views/demo/single/main/index.vue'),
        meta: {
          title: '单一主表案例',
        },
      },
      {
        name: 'DemoSingleCate',
        path: '/demo/single/cate',
        component: () => import('#/views/demo/single/cate/index.vue'),
        meta: {
          title: '单一树表案例',
        },
      },
      {
        name: 'DemoLink',
        path: '/demo/Link',
        component: () => import('#/views/demo/link/index.vue'),
        meta: {
          title: '关联主分子案例',
        },
      },
      {
        name: 'DemoGiteeVote',
        path: '/demo/gitee/vote',
        component: () => import('#/views/demo/gitee/vote/index.vue'),
        meta: {
          title: '开源投票',
        },
      },
    ],
  },
];

export default routes;
