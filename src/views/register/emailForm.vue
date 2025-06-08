<template>
	<el-form size="large" class="login-content-form">
		<el-form-item class="login-animation1">
			<el-input text placeholder="请输入邮箱" v-model="state.ruleForm.userName" clearable autocomplete="off">
				<template #prefix>
					<el-icon class="el-input__icon"><ele-Message /></el-icon>
				</template>
			</el-input>
		</el-form-item>
		<div style='height: 18px'></div>
		<el-form-item class="login-animation2">
			<el-col :span="15">
				<el-input text maxlength="4" :placeholder="$t('message.mobile.placeholder2')" v-model="state.ruleForm.code" clearable autocomplete="off">
					<template #prefix>
						<el-icon class="el-input__icon"><ele-Position /></el-icon>
					</template>
				</el-input>
			</el-col>
			<el-col :span="1"></el-col>
			<el-col :span="8">
				<el-button v-waves class="login-content-code" @click="sendCode">{{ $t('message.mobile.codeText') }}</el-button>
			</el-col>
		</el-form-item>
		<div style='height: 20px'></div>
		<el-form-item class="login-animation3">
			<el-input text placeholder="请设置用户名" v-model="state.ruleForm.usnam" clearable autocomplete="off">
				<template #prefix>
					<el-icon class="el-input__icon"><ele-User /></el-icon>
				</template>
			</el-input>
		</el-form-item>
		<div style='height: 20px'></div>
		<el-form-item class="login-animation3">
			<el-input @keyup.enter='onSignIn'
								:type="state.isShowPassword ? 'text' : 'password'"
								placeholder="请设置密码"
								v-model="state.ruleForm.password"
								autocomplete="off"
			>
				<template #prefix>
					<el-icon class="el-input__icon"><ele-Unlock /></el-icon>
				</template>
				<template #suffix>
					<i
						class="iconfont el-input__icon login-content-password"
						:class="state.isShowPassword ? 'icon-yincangmima' : 'icon-xianshimima'"
						@click="state.isShowPassword = !state.isShowPassword"
					>
					</i>
				</template>
			</el-input>
		</el-form-item>
		<div style='height: 14px'></div>
		<el-form-item class="login-animation5">
			<el-button round type="primary" v-waves class="login-content-submit" @click="onSignIn">
				<span>{{ $t('message.mobile.btnText') }}</span>
			</el-button>
		</el-form-item>
	</el-form>
</template>

<script setup lang="ts" name="loginMobile">
import {computed, reactive} from 'vue';
import {post} from "/@/utils/req";
import {ElLoading, ElMessage} from "element-plus";
import {useLoginApi} from "/@/api/login";
import {Session} from "/@/utils/storage";
import Cookies from "js-cookie";
import {initFrontEndControlRoutes} from "/@/router/frontEnd";
import {initBackEndControlRoutesByLogin} from "/@/router/backEnd";
import {NextLoading} from "/@/utils/loading";
import {useI18n} from "vue-i18n";
import {useThemeConfig} from "/@/stores/themeConfig";
import {storeToRefs} from "pinia";
import {useRoute, useRouter} from "vue-router";
import {formatAxis} from "/@/utils/formatTime";

// 定义变量内容
const { t } = useI18n();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const route = useRoute();
const router = useRouter();
const state = reactive({
	ruleForm: {
		userName: '',
		code: '',
	},
	loading: {
		signIn: false,
	},
});

const sendCode=async ()=>{
	const result:any= await post({
		url: '/auth/sendCode',
		data:{phone:state.ruleForm.userName,type:"2"}
	});
	state.ruleForm.code=result.code;
}

// 时间获取
const currentTime = computed(() => {
	return formatAxis(new Date());
});

// 登录
const onSignIn = async () => {
	// state.loading.signIn = true;
	// // 存储 token 到浏览器缓存
	// Session.set('token', Math.random().toString(36).substr(0));
	// // 模拟数据，对接接口时，记得删除多余代码及对应依赖的引入。用于 `/src/stores/userInfo.ts` 中不同用户登录判断（模拟数据）
	// Cookies.set('userName', state.ruleForm.username);
	state.loading.signIn = true;
	const initLoading = ElLoading.service({
		lock: true,
		fullscreen: true,
		text: '',
		background: 'rgba(0, 0, 0, 0.1)',
	});

	const result:any=await useLoginApi().signInByCode({phone:state.ruleForm.userName,code:state.ruleForm.code}).catch(()=>{
		initLoading.close();
		state.loading.signIn = false;
	})


	// 存储 token 到浏览器缓存
	// Session.set('token', Math.random().toString(36).substr(0));
	Session.set('token', "Bearer "+result.token);
	// 模拟数据，对接接口时，记得删除多余代码及对应依赖的引入。用于 `/src/stores/userInfo.ts` 中不同用户登录判断（模拟数据）
	// Cookies.set('userName', state.ruleForm.userName);
	Cookies.set('userName', result.zuser.name);
	Cookies.set('userId', result.zuser.id);
	Cookies.set('avimg', result.zuser.avimg);

	if (!themeConfig.value.isRequestRoutes) {
		// 前端控制路由，2、请注意执行顺序
		const isNoPower = await initFrontEndControlRoutes();
		initLoading.close();
		state.loading.signIn = false;
		signInSuccess(isNoPower);
	} else {
		// 模拟后端控制路由，isRequestRoutes 为 true，则开启后端控制路由
		// 添加完动态路由，再进行 router 跳转，否则可能报错 No match found for location with path "/"
		await initBackEndControlRoutesByLogin(result);
		// const isNoPower = await initBackEndControlRoutes();
		// 执行完 initBackEndControlRoutes，再执行 signInSuccess
		initLoading.close();
		state.loading.signIn = false;
		signInSuccess(false);
	}
};

// 登录成功后的跳转
const signInSuccess = (isNoPower: boolean | undefined) => {
	if (isNoPower) {
		ElMessage.warning('抱歉，您没有登录权限');
		Session.clear();
	} else {
		// 初始化登录成功时间问候语
		let currentTimeInfo = currentTime.value;
		// 登录成功，跳到转首页
		// 如果是复制粘贴的路径，非首页/登录页，那么登录成功后重定向到对应的路径中
		if (route.query?.redirect) {
			router.push({
				path: <string>route.query?.redirect,
				query: Object.keys(<string>route.query?.params).length > 0 ? JSON.parse(<string>route.query?.params) : '',
			});
		} else {
			router.push('/');
		}
		// 登录成功提示
		const signInText = t('message.signInText');
		ElMessage.success(`${currentTimeInfo}，${signInText}`);
		// 添加 loading，防止第一次进入界面时出现短暂空白
		NextLoading.start();
	}
	state.loading.signIn = false;
};


</script>

<style scoped lang="scss">
.login-content-form .el-form-item{
	margin-bottom: 0;
}

.login-content-form {
	margin-top: 10px;
	@for $i from 1 through 4 {
		.login-animation#{$i} {
			opacity: 0;
			animation-name: error-num;
			animation-duration: 0.5s;
			animation-fill-mode: forwards;
			animation-delay: calc($i/10) + s;
		}
	}
	.login-content-code {
		width: 100%;
		padding: 0;
	}
	.login-content-submit {
		width: 100%;
		letter-spacing: 2px;
		font-weight: 300;
		margin-top: 5px;
	}
	.login-msg {
		color: var(--el-text-color-placeholder);
	}
}
</style>
