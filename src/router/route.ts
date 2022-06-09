import { RouteRecordRaw } from 'vue-router';

/**
 * 路由meta对象参数说明
 * meta: {
 *      title:          菜单栏及 tagsView 栏、菜单搜索名称（国际化）
 *      isLink：        是否超链接菜单，开启外链条件，`1、isLink: 链接地址不为空`
 *      isHide：        是否隐藏此路由
 *      isKeepAlive：   是否缓存组件状态
 *      isAffix：       是否固定在 tagsView 栏上
 *      isIframe：      是否内嵌窗口，开启条件，`1、isIframe:true 2、isLink：链接地址不为空`
 *      roles：         当前路由权限标识，取角色管理。控制路由显示、隐藏。超级管理员：admin 普通角色：common
 *      icon：          菜单、tagsView 图标，阿里：加 `iconfont xxx`，fontawesome：加 `fa xxx`
 * }
 */

/**
 * 定义动态路由
 * 前端添加路由，请在顶级节点的 `children 数组` 里添加
 * @description 未开启 isRequestRoutes 为 true 时使用（前端控制路由），开启时第一个顶级 children 的路由将被替换成接口请求回来的路由数据
 * @description 各字段请查看 `/@/views/system/menu/component/addMenu.vue 下的 ruleForm`
 * @returns 返回路由菜单数据
 */
export const dynamicRoutes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: '/',
		component: () => import('/@/layout/index.vue'),
		redirect: '/home',
		meta: {
			isKeepAlive: true,
		},
		children: [
			{
				path: '/home',
				name: 'Home',
				component: () => import('/@/pages/home/index.vue'),
				meta: {
					title: 'message.router.home',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: true,
					isIframe: false,
					roles: ['admin', 'common'],
					icon: 'iconfont icon-shouye',
				},
			},
			// {
			// 	path: '/sa',
			// 	name: 'sa',
			// 	component: () => import('/@/layout/routerView/parent.vue'),
			// 	redirect: '/sys/org/dept',
			// 	meta: {
			// 		title: '营销管理',
			// 		isLink: '',
			// 		isHide: false,
			// 		isKeepAlive: true,
			// 		isAffix: false,
			// 		isIframe: false,
			// 		roles: ['admin'],
			// 		icon: 'iconfont icon-xitongshezhi',
			// 	},
			// 	children: [
			// 		{
			// 			path: '/sa/proj/main',
			// 			name: 'saProjMain',
			// 			component: () => import('/@/pages/sa/proj/main/index.vue'),
			// 			meta: {
			// 				title: '项目清单',
			// 				isLink: '',
			// 				isHide: false,
			// 				isKeepAlive: true,
			// 				isAffix: false,
			// 				isIframe: false,
			// 				roles: ['admin'],
			// 				icon: 'iconfont icon-caidan',
			// 			},
			// 		},
			// 		{
			// 			path: '/sa/proj/main/add',
			// 			name: 'saProjMainAdd',
			// 			component: () => import('/@/pages/sa/proj/main/add.vue'),
			// 			meta: {
			// 				title: '项目新增',
			// 				isLink: '',
			// 				isHide: true,
			// 				isKeepAlive: true,
			// 				isAffix: false,
			// 				isIframe: false,
			// 				roles: ['admin'],
			// 				icon: 'iconfont icon-caidan',
			// 			},
			// 		},
			// 		{
			// 			path: '/sa/proj/main/edit',
			// 			name: 'saProjMainEdit',
			// 			component: () => import('/@/pages/sa/proj/main/edit.vue'),
			// 			meta: {
			// 				title: '项目修改',
			// 				isLink: '',
			// 				isHide: true,
			// 				isKeepAlive: true,
			// 				isAffix: false,
			// 				isIframe: false,
			// 				roles: ['admin'],
			// 				icon: 'iconfont icon-caidan',
			// 			},
			// 		},
			// 		{
			// 			path: '/sa/proj/main/view',
			// 			name: 'saProjMainView',
			// 			component: () => import('/@/pages/sa/proj/main/view.vue'),
			// 			meta: {
			// 				title: '项目信息',
			// 				isLink: '',
			// 				isHide: true,
			// 				isKeepAlive: true,
			// 				isAffix: false,
			// 				isIframe: false,
			// 				roles: ['admin'],
			// 				icon: 'iconfont icon-caidan',
			// 			},
			// 		},
			// 		{
			// 			path: '/sa/prod/feat/edit',
			// 			name: 'saProdFeatEdit',
			// 			component: () => import('/@/pages/sa/prod/feat/edit.vue'),
			// 			meta: {
			// 				title: '产品规格',
			// 				isLink: '',
			// 				isHide: true,
			// 				isKeepAlive: true,
			// 				isAffix: false,
			// 				isIframe: false,
			// 				roles: ['admin'],
			// 				icon: 'iconfont icon-caidan',
			// 			},
			// 		},
			// 		{
			// 			path: '/sa/draw/main/edit',
			// 			name: 'saDrawMainEdit',
			// 			component: () => import('/@/pages/sa/draw/main/edit.vue'),
			// 			meta: {
			// 				title: '土建图申请',
			// 				isLink: '',
			// 				isHide: true,
			// 				isKeepAlive: true,
			// 				isAffix: false,
			// 				isIframe: false,
			// 				roles: ['admin'],
			// 				icon: 'iconfont icon-caidan',
			// 			},
			// 		},
			// 		{
			// 			path: '/sa/prod/tem',
			// 			name: 'saProdTem',
			// 			component: () => import('/@/pages/sa/prod/tem/index.vue'),
			// 			meta: {
			// 				title: '偏好模板',
			// 				isLink: '',
			// 				isHide: false,
			// 				isKeepAlive: true,
			// 				isAffix: false,
			// 				isIframe: false,
			// 				roles: ['admin'],
			// 				icon: 'iconfont icon-caidan',
			// 			},
			// 		},
			// 		{
			// 			path: '/sa/prod/tem/edit',
			// 			name: 'saProdTemEdit',
			// 			component: () => import('/@/pages/sa/prod/tem/edit.vue'),
			// 			meta: {
			// 				title: '模板编辑',
			// 				isLink: '',
			// 				isHide: true,
			// 				isKeepAlive: true,
			// 				isAffix: false,
			// 				isIframe: false,
			// 				roles: ['admin'],
			// 				icon: 'iconfont icon-caidan',
			// 			},
			// 		},
			// 		// {
			// 		// 	path: '/sa/draw/main/edit2',
			// 		// 	name: 'saDrawMainEdit2',
			// 		// 	component: () => import('/@/layout/routerView/link.vue'),
			// 		// 	meta: {
			// 		// 		title: '土建图申请',
			// 		// 		isLink: `${import.meta.env.VITE_UI_URL}#/sa_draw`,
			// 		// 		isHide: true,
			// 		// 		isKeepAlive: false,
			// 		// 		isAffix: false,
			// 		// 		isIframe: false,
			// 		// 		roles: ['admin'],
			// 		// 		icon: 'iconfont icon-caozuo-wailian',
			// 		// 	},
			// 		// },
			// 	],
			// },
			{
				path: '/te/prod',
				name: 'teProd',
				component: () => import('/@/layout/routerView/parent.vue'),
				redirect: '/te/prod/model',
				meta: {
					title: '产品管理',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
					roles: ['admin'],
					icon: 'iconfont icon-xitongshezhi',
				},
				children: [
					{
						path: '/te/prod/cate',
						name: 'teProdCate',
						component: () => import('/@/pages/te/prod/cate/index.vue'),
						meta: {
							title: '产品分类',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-caidan',
						},
					},
					{
						path: '/te/prod/serie',
						name: 'teProdSerie',
						component: () => import('/@/pages/te/prod/serie/index.vue'),
						meta: {
							title: '产品系列',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-caidan',
						},
					},
					{
						path: '/te/prod/model',
						name: 'teProdModel',
						component: () => import('/@/pages/te/prod/model/index.vue'),
						meta: {
							title: '产品型号',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-caidan',
						},
					},
					{
						path: '/te/prod/version',
						name: 'teProdVersion',
						component: () => import('/@/pages/te/prod/version/index.vue'),
						meta: {
							title: '产品版本',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-caidan',
						},
					},
					{
						path: '/te/prod/version/edit',
						name: 'teProdVersionEdit',
						component: () => import('/@/pages/te/prod/version/edit.vue'),
						meta: {
							title: '产品版本编辑',
							isLink: '',
							isHide: true,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-caidan',
						},
					},
					{
						path: '/te/prod/test',
						name: 'teProdTest',
						component: () => import('/@/pages/te/prod/test/index.vue'),
						meta: {
							title: '产品测试',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-caidan',
						},
					},
					{
						path: '/te/prod/test/edit',
						name: 'teProdTestEdit',
						component: () => import('/@/pages/te/prod/test/edit.vue'),
						meta: {
							title: '产品测试编辑',
							isLink: '',
							isHide: true,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-caidan',
						},
					},
				],
			},
			{
				path: '/te/feat',
				name: 'teFeat',
				component: () => import('/@/layout/routerView/parent.vue'),
				redirect: '/te/feat/param',
				meta: {
					title: '特性管理',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
					roles: ['admin'],
					icon: 'iconfont icon-xitongshezhi',
				},
				children: [
					{
						path: '/te/feat/screen',
						name: 'teFeatScreen',
						component: () => import('/@/pages/te/feat/screen/index.vue'),
						meta: {
							title: '特性屏幕',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-caidan',
						},
					},
					{
						path: '/te/feat/param',
						name: 'teFeatParam',
						component: () => import('/@/pages/te/feat/param/index.vue'),
						meta: {
							title: '特性参数',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-caidan',
						},
					},
					{
						path: '/te/feat/param/edit',
						name: 'teFeatParamEdit',
						component: () => import('/@/pages/te/feat/param/edit.vue'),
						meta: {
							title: '参数编辑',
							isLink: '',
							isHide: true,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'ele-Comment',
						},
					},
					{
						path: '/te/feat/link',
						name: 'teFeatLink',
						component: () => import('/@/pages/te/feat/link/index.vue'),
						meta: {
							title: '特性联动',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-caidan',
						},
					},
					{
						path: '/te/feat/link/edit',
						name: 'teFeatLinkEdit',
						component: () => import('/@/pages/te/feat/link/edit.vue'),
						meta: {
							title: '联动编辑',
							isLink: '',
							isHide: true,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-caidan',
						},
					},
					{
						path: '/te/feat/check',
						name: 'teFeatCheck',
						component: () => import('/@/pages/te/feat/check/index.vue'),
						meta: {
							title: '特性校验',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-caidan',
						},
					},
					{
						path: '/te/feat/check/edit',
						name: 'teFeatCheckEdit',
						component: () => import('/@/pages/te/feat/check/edit.vue'),
						meta: {
							title: '校验编辑',
							isLink: '',
							isHide: true,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-caidan',
						},
					},
					{
						path: '/te/feat/drive',
						name: 'teFeatDrive',
						component: () => import('/@/pages/te/feat/drive/index.vue'),
						meta: {
							title: '特性驱动',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-caidan',
						},
					},
					{
						path: '/te/feat/drive/edit',
						name: 'teFeatDriveEdit',
						component: () => import('/@/pages/te/feat/drive/edit.vue'),
						meta: {
							title: '驱动编辑',
							isLink: '',
							isHide: true,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-caidan',
						},
					},
					// {
					// 	path: '/te/feat/comp',
					// 	name: 'teFeatComp',
					// 	component: () => import('/@/pages/te/feat/comp/index.vue'),
					// 	meta: {
					// 		title: '特性组件',
					// 		isLink: '',
					// 		isHide: false,
					// 		isKeepAlive: true,
					// 		isAffix: false,
					// 		isIframe: false,
					// 		roles: ['admin'],
					// 		icon: 'iconfont icon-caidan',
					// 	},
					// },
					// {
					// 	path: '/te/feat/comp/edit',
					// 	name: 'teFeatCompEdit',
					// 	component: () => import('/@/pages/te/feat/comp/edit.vue'),
					// 	meta: {
					// 		title: '组件编辑',
					// 		isLink: '',
					// 		isHide: true,
					// 		isKeepAlive: true,
					// 		isAffix: false,
					// 		isIframe: false,
					// 		roles: ['admin'],
					// 		icon: 'iconfont icon-caidan',
					// 	},
					// },
				],
			},
			{
				path: '/te/allot',
				name: 'teAllot',
				component: () => import('/@/layout/routerView/parent.vue'),
				redirect: '/te/allot/param',
				meta: {
					title: '分配管理',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
					roles: ['admin'],
					icon: 'iconfont icon-xitongshezhi',
				},
				children: [
					{
						path: '/te/allot/param',
						name: 'teAllotParam',
						component: () => import('/@/pages/te/allot/param/index.vue'),
						meta: {
							title: '参数分配',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-caidan',
						},
					},
					{
						path: '/te/allot/param/edit',
						name: 'teAllotParamEdit',
						component: () => import('/@/pages/te/allot/param/edit.vue'),
						meta: {
							title: '参数分配编辑',
							isLink: '',
							isHide: true,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'ele-Comment',
						},
					},
					{
						path: '/te/allot/link',
						name: 'teAllotLink',
						component: () => import('/@/pages/te/allot/link/index.vue'),
						meta: {
							title: '联动分配',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-caidan',
						},
					},
					{
						path: '/te/allot/link/edit',
						name: 'teAllotLinkEdit',
						component: () => import('/@/pages/te/allot/link/edit.vue'),
						meta: {
							title: '联动分配编辑',
							isLink: '',
							isHide: true,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'ele-Comment',
						},
					},
					{
						path: '/te/allot/check',
						name: 'teAllotCheck',
						component: () => import('/@/pages/te/allot/check/index.vue'),
						meta: {
							title: '校验分配',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-caidan',
						},
					},
					{
						path: '/te/allot/check/edit',
						name: 'teAllotCheckEdit',
						component: () => import('/@/pages/te/allot/check/edit.vue'),
						meta: {
							title: '校验分配编辑',
							isLink: '',
							isHide: true,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'ele-Comment',
						},
					},
					{
						path: '/te/allot/drive',
						name: 'teAllotDrive',
						component: () => import('/@/pages/te/allot/drive/index.vue'),
						meta: {
							title: '驱动分配',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-caidan',
						},
					},
					{
						path: '/te/allot/drive/edit',
						name: 'teAllotDriveEdit',
						component: () => import('/@/pages/te/allot/drive/edit.vue'),
						meta: {
							title: '驱动分配编辑',
							isLink: '',
							isHide: true,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'ele-Comment',
						},
					},
				],
			},
			{
				path: '/te/tran',
				name: 'teTran',
				component: () => import('/@/layout/routerView/parent.vue'),
				redirect: '/te/tran/main',
				meta: {
					title: '转换管理',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
					roles: ['admin'],
					icon: 'iconfont icon-xitongshezhi',
				},
				children: [
					{
						path: '/te/tran/cate',
						name: 'teTranCate',
						component: () => import('/@/pages/te/tran/cate/index.vue'),
						meta: {
							title: '转换分类',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-caidan',
						},
					},
					{
						path: '/te/tran/main',
						name: 'teTranMain',
						component: () => import('/@/pages/te/tran/main/index.vue'),
						meta: {
							title: '转换映射',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-caidan',
						},
					},
					{
						path: '/te/tran/main/edit',
						name: 'teTranMainEdit',
						component: () => import('/@/pages/te/tran/main/edit.vue'),
						meta: {
							title: '转换编辑',
							isLink: '',
							isHide: true,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-caidan',
						},
					},
				],
			},
		],
	},
];

/**
 * 定义404、401界面
 * @link 参考：https://next.router.vuejs.org/zh/guide/essentials/history-mode.html#netlify
 */
export const notFoundAndNoPower = [
	{
		path: '/:path(.*)*',
		name: 'notFound',
		component: () => import('/@/views/error/404.vue'),
		meta: {
			title: 'message.staticRoutes.notFound',
			isHide: true,
		},
	},
	{
		path: '/401',
		name: 'noPower',
		component: () => import('/@/views/error/401.vue'),
		meta: {
			title: 'message.staticRoutes.noPower',
			isHide: true,
		},
	},
];

/**
 * 定义静态路由（默认路由）
 * 此路由不要动，前端添加路由的话，请在 `dynamicRoutes 数组` 中添加
 * @description 前端控制直接改 dynamicRoutes 中的路由，后端控制不需要修改，请求接口路由数据时，会覆盖 dynamicRoutes 第一个顶级 children 的内容（全屏，不包含 layout 中的路由出口）
 * @returns 返回路由菜单数据
 */
export const staticRoutes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: '/',
		component: () => import('/@/layout/index.vue'),
		meta: {
			title: '布局界面',
		},
		children: [
			// 请不要往这里 `children` 中添加内容，此内容为了防止 No match found for location with path "xxx" 问题
			...notFoundAndNoPower,
		],
	},
	{
		path: '/login',
		name: 'login',
		component: () => import('/@/views/login/index.vue'),
		meta: {
			title: '登录',
		},
	},
	/**
	 * 提示：写在这里的为全屏界面，不建议写在这里
	 * 请写在 `dynamicRoutes` 路由数组中
	 */
	{
		path: '/visualizingDemo1',
		name: 'visualizingDemo1',
		component: () => import('/@/views/visualizing/demo1.vue'),
		meta: {
			title: 'message.router.visualizingLinkDemo1',
		},
	},
	{
		path: '/visualizingDemo2',
		name: 'visualizingDemo2',
		component: () => import('/@/views/visualizing/demo2.vue'),
		meta: {
			title: 'message.router.visualizingLinkDemo2',
		},
	},
	{
		path: '/page/ofte',
		name: 'pageOfte',
		component: () => import('/@/pages/oa/flow/temp/edit.vue'),
		meta: {
			title: '流程模板配置',
		},
	},
	{
		path: '/page/ofme',
		name: 'pageOfme',
		component: () => import('/@/pages/oa/flow/main/edit.vue'),
		meta: {
			title: '流程实例编辑',
		},
	},
	{
		path: '/page/ofmv',
		name: 'pageOfmv',
		component: () => import('/@/pages/oa/flow/main/view.vue'),
		meta: {
			title: '流程实例查看',
		},
	},
];
