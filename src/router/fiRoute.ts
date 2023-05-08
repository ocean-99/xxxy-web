import { RouteRecordRaw } from 'vue-router';

export const fiRoutes: Array<RouteRecordRaw> = [
    {
        path: '/fi',
        name: 'Fi',
        component: () => import('/@/layout/routerView/parent.vue'),
        redirect: '/fi/bank/main',
        meta: {
            title: '财务管理',
            isLink: '',
            isHide: false,
            isKeepAlive: true,
            isAffix: false,
            isIframe: false,
            roles: ['admin'],
            icon: 'ele-Menu',
        },
        children: [
            {
                path: '/fi/bank',
                name: 'FiBank',
                component: () => import('/@/layout/routerView/parent.vue'),
                redirect: '/fi/bank/main',
                meta: {
                    title: '银行数据',
                    isLink: '',
                    isHide: false,
                    isKeepAlive: true,
                    isAffix: false,
                    isIframe: false,
                    roles: ['admin'],
                    icon: 'ele-Postcard',
                },
                children: [
                    {
                        path: '/fi/bank/cate',
                        name: 'FiBankCate',
                        component: () => import('/@/pages/fi/bank/cate/index.vue'),
                        meta: {
                            title: '银行类别',
                            isLink: '',
                            isHide: false,
                            isKeepAlive: true,
                            isAffix: false,
                            isIframe: false,
                            roles: ['admin'],
                            icon: 'ele-Tickets',
                        },
                    },
                    {
                        path: '/fi/bank/main',
                        name: 'FiBankMain',
                        component: () => import('/@/pages/fi/bank/main/index.vue'),
                        meta: {
                            title: '银行网点',
                            isLink: '',
                            isHide: false,
                            isKeepAlive: true,
                            isAffix: false,
                            isIframe: false,
                            roles: ['admin'],
                            icon: 'ele-Tickets',
                        },
                    },
                ],
            },
        ],
    },
];

