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
				name: 'home',
				component: () => import('/@/views/home/index.vue'),
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
			{
				path: '/sys',
				name: 'Sys',
				component: () => import('/@/layout/routerView/parent.vue'),
				redirect: '/sys/org/user',
				meta: {
					title: '系统管理',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
					roles: ['admin', 'common'],
					icon: 'iconfont icon-xitongshezhi',
				},
				children: [
					{
						path: '/sys/org',
						name: 'SysOrg',
						component: () => import('/@/layout/routerView/parent.vue'),
						redirect: '/sys/org/user',
						meta: {
							title: '组织架构',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin', 'common'],
							icon: 'ele-OfficeBuilding',
						},
						children: [
							{
								path: '/sys/org/dept',
								name: 'sysOrgDept',
								component: () => import('/@/pages/sys/org/dept/index.vue'),
								meta: {
									title: '部门管理',
									isLink: '',
									isHide: false,
									isKeepAlive: true,
									isAffix: false,
									isIframe: false,
									roles: ['admin', 'common'],
									icon: 'ele-SetUp',
								},
							},
							{
								path: '/sys/org/dept/edit',
								name: 'sysOrgDeptEdit',
								component: () => import('/@/pages/sys/org/dept/edit.vue'),
								meta: {
									title: '部门编辑',
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
								path: '/sys/org/user',
								name: 'sysOrgUser',
								component: () => import('/@/pages/sys/org/user/index.vue'),
								meta: {
									title: '用户管理',
									isLink: '',
									isHide: false,
									isKeepAlive: true,
									isAffix: false,
									isIframe: false,
									roles: ['admin'],
									icon: 'ele-User',
								},
							},
							{
								path: '/sys/org/user/edit',
								name: 'sysOrgUserEdit',
								component: () => import('/@/pages/sys/org/user/edit.vue'),
								meta: {
									title: '用户编辑',
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
								path: '/sys/org/post',
								name: 'sysOrgPost',
								component: () => import('/@/pages/sys/org/post/index.vue'),
								meta: {
									title: '岗位管理',
									isLink: '',
									isHide: false,
									isKeepAlive: true,
									isAffix: false,
									isIframe: false,
									roles: ['admin'],
									icon: 'ele-Help',
								},
							},
							{
								path: '/sys/org/post/edit',
								name: 'sysOrgPostEdit',
								component: () => import('/@/pages/sys/org/post/edit.vue'),
								meta: {
									title: '岗位编辑',
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
								path: '/sys/org/group',
								name: 'sysOrgGroup',
								component: () => import('/@/pages/sys/org/group/index.vue'),
								meta: {
									title: '群组管理',
									isLink: '',
									isHide: false,
									isKeepAlive: true,
									isAffix: false,
									isIframe: false,
									roles: ['admin'],
									icon: 'ele-Guide',
								},
							},
							{
								path: '/sys/org/group/edit',
								name: 'sysOrgGroupEdit',
								component: () => import('/@/pages/sys/org/group/edit.vue'),
								meta: {
									title: '群组编辑',
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
						path: '/sys/perm',
						name: 'sysPerm',
						component: () => import('/@/layout/routerView/parent.vue'),
						redirect: '/sys/perm/menu',
						meta: {
							title: '权限管理',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'ele-Lock',
						},
						children: [
							{
								path: '/sys/perm/menu',
								name: 'sysPermMenu',
								component: () => import('/@/pages/sys/perm/menu/index.vue'),
								meta: {
									title: '菜单管理',
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
								path: '/sys/perm/role',
								name: 'sysPermRole',
								component: () => import('/@/pages/sys/perm/role/index.vue'),
								meta: {
									title: '角色管理',
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
								path: '/sys/perm/role/edit',
								name: 'sysPermRoleEdit',
								component: () => import('/@/pages/sys/perm/role/edit.vue'),
								meta: {
									title: '角色编辑',
									isLink: '',
									isHide: true,
									isKeepAlive: true,
									isAffix: false,
									isIframe: false,
									roles: ['admin'],
								},
							},
						],
					},
					{
						path: '/sys/job',
						name: 'SysJob',
						component: () => import('/@/layout/routerView/parent.vue'),
						redirect: '/sys/job/main',
						meta: {
							title: '定时任务',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'ele-AlarmClock',
						},
						children: [
							{
								path: '/sys/job/main',
								name: 'sysJobMain',
								component: () => import('/@/pages/sys/job/main/index.vue'),
								meta: {
									title: '任务清单',
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
								path: '/sys/job/main/edit',
								name: 'sysJobMainEdit',
								component: () => import('/@/pages/sys/job/main/edit.vue'),
								meta: {
									title: '任务编辑',
									isLink: '',
									isHide: true,
									isKeepAlive: true,
									isAffix: false,
									isIframe: false,
									roles: ['admin'],
								},
							},
							{
								path: '/sys/job/log',
								name: 'sysJobLog',
								component: () => import('/@/pages/sys/job/log/index.vue'),
								meta: {
									title: '任务日志',
									isLink: '',
									isHide: false,
									isKeepAlive: false,
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
			{
				path: '/oa/flow',
				name: 'OaFlow',
				component: () => import('/@/layout/routerView/parent.vue'),
				redirect: '/oa/flow/main',
				meta: {
					title: '流程管理',
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
						path: '/oa/flow/cate',
						name: 'oaFlowCate',
						component: () => import('/@/pages/oa/flow/cate/index.vue'),
						meta: {
							title: '流程分类',
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
						path: '/oa/flow/cate/edit',
						name: 'oaFlowCateEdit',
						component: () => import('/@/pages/oa/flow/cate/edit.vue'),
						meta: {
							title: '流程分类编辑',
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
						path: '/oa/flow/temp',
						name: 'oaFlowTemp',
						component: () => import('/@/pages/oa/flow/temp/index.vue'),
						meta: {
							title: '流程模板',
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
						path: '/oa/flow/temp/edit',
						name: 'oaFlowTempEdit',
						component: () => import('/@/pages/oa/flow/temp/edit.vue'),
						meta: {
							title: '流程模板编辑',
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
						path: '/oa/flow/main',
						name: 'oaFlowMain',
						component: () => import('/@/pages/oa/flow/main/index.vue'),
						meta: {
							title: '流程实例',
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
						path: '/oa/flow/main/view',
						name: 'oaFlowMainView',
						component: () => import('/@/pages/oa/flow/main/view.vue'),
						meta: {
							title: '流程查看',
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
						path: '/oa/flow/main/edit',
						name: 'oaFlowMainEdit',
						component: () => import('/@/pages/oa/flow/main/edit.vue'),
						meta: {
							title: '流程编辑',
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
				path: '/sys/todo',
				name: 'SysTodo',
				component: () => import('/@/layout/routerView/parent.vue'),
				redirect: '/sys/todo/main',
				meta: {
					title: '待办管理',
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
						path: '/sys/todo/main',
						name: 'sysTodoMain',
						component: () => import('/@/pages/sys/todo/main/index.vue'),
						meta: {
							title: '待办清单',
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
						path: '/sys/todo/main/edit',
						name: 'sysTodoMainEdit',
						component: () => import('/@/pages/sys/todo/main/edit.vue'),
						meta: {
							title: '待办编辑',
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
				path: '/demo',
				name: 'Demo',
				component: () => import('/@/layout/routerView/parent.vue'),
				redirect: '/sa/cust/main',
				meta: {
					title: 'DEMO',
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
						path: '/sa/agent/main',
						name: 'saAgentMain',
						component: () => import('/@/pages/sa/agent/main/index.vue'),
						meta: {
							title: '代理商清单',
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
						path: '/sa/agent/main/edit',
						name: 'saAgentMainEdit',
						component: () => import('/@/pages/sa/agent/main/edit.vue'),
						meta: {
							title: '代理商维护',
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
			title: 'OA模板设置',
		},
	},
	{
		path: '/page/ofme',
		name: 'pageOfme',
		component: () => import('/@/pages/oa/flow/main/edit.vue'),
		meta: {
			title: '流程编辑',
		},
	},
	{
		path: '/page/ofmv',
		name: 'pageOfmv',
		component: () => import('/@/pages/oa/flow/main/view.vue'),
		meta: {
			title: '流程查看',
		},
	},
];
