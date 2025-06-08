<template>
	<el-form size="large" class="login-content-form">
		<el-form-item class="login-animation1">
			<el-input text :placeholder="$t('message.mobile.placeholder1')" v-model="state.ruleForm.userName" clearable autocomplete="off">
				<template #prefix>
					<i class="iconfont icon-dianhua el-input__icon"></i>
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
			<el-input text placeholder="请设置用户名" v-model="state.ruleForm.nickName" clearable autocomplete="off">
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
import {reactive} from 'vue';
import {post} from "/@/utils/req";
import {ElMessage} from "element-plus";

// 定义变量内容
const state = reactive({
	ruleForm: {
		userName: '',
		code: '',
    password: '',
    nickName: '',
	},
  loading: {
    signIn: false,
  },
});

const sendCode=async ()=>{
  const result:any= await post({
    url: '/auth/sendCode',
    data:{phone:state.ruleForm.userName,type:"1"}
  });
  state.ruleForm.code=result.code;
}


// 登录
const onSignIn = async () => {
  await post({
    url: '/auth/register',
    data:{phone:state.ruleForm.userName,code:state.ruleForm.code,password:state.ruleForm.password,nickName:state.ruleForm.nickName}
  });
  ElMessage.success("注册成功");
  setTimeout(async () => {
    location.href="/#/login";
  }, 1500);
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
