import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      order: 21,
      title: '销售管理',
    },
    name: 'Sa',
    path: '/sa',
    children: [
      {
        name: 'SaOrgMain',
        path: '/sa/org/main',
        component: () => import('#/views/sa/org/main/index.vue'),
        meta: {
          title: '销售组织',
        },
      },
      {
        name: 'SaCustCate',
        path: '/sa/cust/cate',
        component: () => import('#/views/sa/cust/cate/index.vue'),
        meta: {
          title: '客户分类',
        },
      },
      {
        name: 'SaCustCateEdit',
        path: '/sa/cust/cate/edit',
        component: () => import('#/views/sa/cust/cate/edit.vue'),
        meta: {
          title: '客户分类编辑',
          hideInMenu: true,
          keepAlive: true,
        },
      },
      {
        name: 'SaCustMain',
        path: '/sa/cust/main',
        component: () => import('#/views/sa/cust/main/index.vue'),
        meta: {
          title: '客户信息',
        },
      },
      {
        name: 'SaCustMainEdit',
        path: '/sa/cust/main/edit',
        component: () => import('#/views/sa/cust/main/edit.vue'),
        meta: {
          title: '客户编辑',
          hideInMenu: true,
          keepAlive: true,
        },
      },
      {
        name: 'SaChanCate',
        path: '/sa/chan/cate',
        component: () => import('#/views/sa/chan/cate/index.vue'),
        meta: {
          title: '渠道商分类',
        },
      },
      {
        name: 'SaChanCateEdit',
        path: '/sa/chan/cate/edit',
        component: () => import('#/views/sa/chan/cate/edit.vue'),
        meta: {
          title: '渠道商分类编辑',
          hideInMenu: true,
          keepAlive: true,
        },
      },
      {
        name: 'SaChanMain',
        path: '/sa/chan/main',
        component: () => import('#/views/sa/chan/main/index.vue'),
        meta: {
          title: '渠道商信息',
        },
      },
      {
        name: 'SaChanMainEdit',
        path: '/sa/chan/main/edit',
        component: () => import('#/views/sa/chan/main/edit.vue'),
        meta: {
          title: '渠道商编辑',
          hideInMenu: true,
          keepAlive: true,
        },
      },
      {
        name: 'SaProjCate',
        path: '/sa/proj/cate',
        component: () => import('#/views/sa/proj/cate/index.vue'),
        meta: {
          title: '项目分类',
        },
      },
      {
        name: 'SaProjCateEdit',
        path: '/sa/proj/cate/edit',
        component: () => import('#/views//sa/proj/cate/edit.vue'),
        meta: {
          title: '项目分类编辑',
          hideInMenu: true,
          keepAlive: true,
        },
      },
      {
        name: 'SaProjMain',
        path: '/sa/proj/main',
        component: () => import('#/views/sa/proj/main/index.vue'),
        meta: {
          title: '项目信息',
        },
      },
      {
        name: 'SaProjMainEdit',
        path: '/sa/proj/main/edit',
        component: () => import('#/views/sa/proj/main/edit.vue'),
        meta: {
          title: '项目编辑',
          hideInMenu: true,
          keepAlive: true,
        },
      },
      {
        name: 'SaScheMain',
        path: '/sa/sche/main',
        component: () => import('#/views/sa/sche/main/index.vue'),
        meta: {
          title: '方案信息',
        },
      },
      {
        name: 'SaScheMainEdit',
        path: '/sa/sche/main/edit',
        component: () => import('#/views/sa/sche/main/edit.vue'),
        meta: {
          title: '方案编辑',
          hideInMenu: true,
          keepAlive: true,
        },
      },
    ],
  },
  {
    meta: {
      order: 22,
      title: '技术管理',
    },
    name: 'Te',
    path: '/te',
    children: [
      {
        name: 'TeProdCate',
        path: '/te/prod/cate',
        component: () => import('#/views/te/prod/cate/index.vue'),
        meta: {
          title: '产品分类',
        },
      },
      {
        name: 'TeProdModel',
        path: '/te/prod/model',
        component: () => import('#/views/te/prod/model/index.vue'),
        meta: {
          title: '产品型号',
        },
      },
      {
        name: 'TeProdTmpl',
        path: '/te/prod/tmpl',
        component: () => import('#/views/te/prod/tmpl/index.vue'),
        meta: {
          title: '产品模板',
        },
      },
      {
        name: 'TeProdTmplEdit',
        path: '/te/prod/tmpl/edit',
        component: () => import('#/views/te/prod/tmpl/edit.vue'),
        meta: {
          title: '产品模板编辑',
          hideInMenu: true,
          keepAlive: true,
        },
      },
      {
        name: 'TeProdMain',
        path: '/te/prod/main',
        component: () => import('#/views/te/prod/main/index.vue'),
        meta: {
          title: '产品信息',
        },
      },
      {
        name: 'TeProdMainEdit',
        path: '/te/prod/main/edit',
        component: () => import('#/views/te/prod/main/edit.vue'),
        meta: {
          title: '产品编辑',
          hideInMenu: true,
          keepAlive: true,
        },
      },
      {
        name: 'TeFeatGroup',
        path: '/te/feat/group/',
        component: () => import('#/views/te/feat/group/index.vue'),
        meta: {
          title: '特性分组',
        },
      },
      {
        name: 'TeFeatTab',
        path: '/te/feat/tab/',
        component: () => import('#/views/te/feat/tab/index.vue'),
        meta: {
          title: '特性页签',
        },
      },
      {
        name: 'TeFeatParam',
        path: '/te/feat/param/',
        component: () => import('#/views/te/feat/param/index.vue'),
        meta: {
          title: '特性参数',
        },
      },
      {
        name: 'TeFeatParamEdit',
        path: '/te/feat/param/edit',
        component: () => import('#/views/te/feat/param/edit.vue'),
        meta: {
          title: '参数编辑',
          hideInMenu: true,
          keepAlive: true,
        },
      },
      {
        name: 'TeFeatLink',
        path: '/te/feat/link/',
        component: () => import('#/views/te/feat/link/index.vue'),
        meta: {
          title: '特性联动',
          keepAlive: true,
        },
      },
      {
        name: 'TeFeatLinkEdit',
        path: '/te/feat/link/edit',
        component: () => import('#/views/te/feat/link/edit.vue'),
        meta: {
          title: '联动编辑',
          hideInMenu: true,
          keepAlive: true,
        },
      },
      {
        name: 'TeFeatCheck',
        path: '/te/feat/check/',
        component: () => import('#/views/te/feat/check/index.vue'),
        meta: {
          title: '特性校验',
        },
      },
      {
        name: 'TeFeatCheckEdit',
        path: '/te/feat/check/edit',
        component: () => import('#/views/te/feat/check/edit.vue'),
        meta: {
          title: '校验编辑',
          hideInMenu: true,
          keepAlive: true,
        },
      },
      {
        name: 'TeFeatComp',
        path: '/te/feat/comp/',
        component: () => import('#/views/te/feat/comp/index.vue'),
        meta: {
          title: '特性组件',
        },
      },
      {
        name: 'TeFeatCompEdit',
        path: '/te/feat/comp/edit',
        component: () => import('#/views/te/feat/comp/edit.vue'),
        meta: {
          title: '组件编辑',
          hideInMenu: true,
          keepAlive: true,
        },
      },
      {
        name: 'TeMateCate',
        path: '/te/mate/cate/',
        component: () => import('#/views/te/mate/cate/index.vue'),
        meta: {
          title: '物料分类',
        },
      },
      {
        name: 'TeMateMain',
        path: '/te/mate/main/',
        component: () => import('#/views/te/mate/main/index.vue'),
        meta: {
          title: '物料信息',
        },
      },
      {
        name: 'TeMateMainEdit',
        path: '/te/mate/main/edit',
        component: () => import('#/views/te/mate/main/edit.vue'),
        meta: {
          title: '物料编辑',
          hideInMenu: true,
          keepAlive: true,
        },
      },
    ],
  },
];

export default routes;
