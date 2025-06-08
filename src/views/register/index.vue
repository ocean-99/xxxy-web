<template>
	<div class='home-login' :style="{ backgroundImage: `url(${state.backgroundImage})` }">
<!--		<div class='retrieve-btn'>找回组织机构</div>-->
<!--		<img :src="logoMini" class='logo'/>-->
		<el-card class='box-card'>
			<div class="login-right-warp-main-title">Vben快速开发平台</div>
			<div class='to-login' @click='toLogin'>返回登录</div>
			<el-tabs v-model="state.tabsActiveName" style='margin-left: 20px;margin-right: 20px' >
				<el-tab-pane label="手机号注册" name="monum">
					<MonumForm />
				</el-tab-pane>
				<el-tab-pane label="邮箱注册" name="email">
					<EmailForm />
				</el-tab-pane>
			</el-tabs>
			<div style='height: 20px'></div>
		</el-card>
    <div class='login-footer'>
      <div class='footer-content'>
        <a class='el-tooltip verify' href="https://beian.miit.gov.cn/" target="_blank" style="text-decoration:none">
          <i class='icon-check-sign'></i> <span data-v-3888f2fd=''>苏ICP 备xxxxxx号</span>
        </a>
        <span data-v-3888f2fd=''>Vben 开发平台 V1.3.8.20230516</span>
      </div>
    </div>
	</div>
</template>

<script setup lang='ts' name='registerIndex'>
import { defineAsyncComponent, onMounted, reactive } from 'vue';
import { NextLoading } from '/@/utils/loading';
import logoMini from '/@/assets/vben.png';
import bgx from '/@/assets/bgx.png';

// 引入组件
const MonumForm = defineAsyncComponent(() => import('/@/views/register/monumForm.vue'));
const EmailForm = defineAsyncComponent(() => import('/@/views/register/emailForm.vue'));

const state = reactive({
	backgroundImage: bgx,
	tabsActiveName: 'monum'
});

const toLogin=()=>{
	location.href="/#/login";
}

onMounted(() => {
	NextLoading.done();
});
</script>

<style scoped lang='scss'>

.to-login{
	position: absolute;left:340px;top:120px;z-index: 100;cursor: pointer;
}
.to-login:hover{
	color:#bcbcbc
}

.home-login {
	-webkit-box-flex: 1;
	-webkit-box-orient: vertical;
	-webkit-box-direction: normal;
	-webkit-box-align: center;
	-ms-flex-align: center;
	-webkit-box-pack: center;
	-ms-flex-pack: center;
	align-items: center;
	background-color: #fff;
	background-position: 0 0;
	background-repeat: no-repeat;
	background-size: cover;
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	-ms-flex: 1 1;
	flex: 1 1;
	-ms-flex-direction: column;
	flex-direction: column;
	height: 100%;
	justify-content: center;
	min-height: 500px;
	position: relative;
}

.home-login .retrieve-btn{
	color: #2489F2;
}

.home-login .retrieve-btn{
	color: #2489f2;
	cursor: pointer;
	position: absolute;
	right: 100px;
	top: 50px;
}

.home-login .logo{
	left: 120px;
	position: absolute;
	top: 40px;
	width: 180px;
}

.home-login .box-card {
	border: none;
	border-radius: 8px;
	-webkit-box-shadow: 0 0 16px 0 rgba(0,18,46,.08);
	box-shadow: 0 0 16px 0 rgba(0,18,46,.08);
	position: relative;
	width: 430px;
	z-index: 100;
}

.home-login .login-right-warp-main-title {
	height: 100px;
	line-height: 100px;
	font-size: 24px;
	font-weight: bolder;
	text-align: center;
	letter-spacing: 3px;
	color: var(--el-text-color-primary);
}


.login-footer{
  background: hsla(0,0%,100%,.12);
  bottom: 0;
  left: 0;
  padding: 0 16px;
  position: absolute;
  right: 0;
  color: #7f8997;
}

.login-footer .footer-content{
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  align-items: center;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: row;
  flex-direction: row;
  font-size: 12px;
  height: 28px;
  justify-content: space-between;
  width: 100%;
}
</style>
