<template>
	<Wrap>
		<div class='p-left'>
			<div class="croppers-container" style='height: 100%;background-color: white'>
				<el-card shadow="hover" :body-style="{padding:'0'}" style='height: 100%'>
					<template #header>
						<div class="card-header">
							<span style='line-height: 36px;font-size: 16px;padding-left: 8px'>消息中心</span>
						</div>
					</template>
					<div class="my-personal" style='margin-top: 10px;' >
						<el-menu
							style='width: 246px'
							default-active="1-1"
							background-color="white"
							active-text-color="blue"
							text-color="black"
						>
							<el-menu-item index="1">
								<el-icon><ele-Location/></el-icon>
								<span>我的消息</span>
							</el-menu-item>
							<el-menu-item index="2">
								<el-icon><ele-Location/></el-icon>
								<span>门户设置</span>
							</el-menu-item>
							<el-menu-item index="3">
								<el-icon><ele-Location/></el-icon>
								<span>其他设置</span>
							</el-menu-item>
						</el-menu>
					</div>
				</el-card>
				<GenUpload ref='uploadModal' @close='uploadFinish'/>
				<CropperDialog ref="cropperDialogRef" @close='closeCropper'/>
			</div>
		</div>
		<div class='p-right'>
			<div style='height: 100%'>
				<el-card class="box-card" v-if='state.showItem==="1-1"'>
					<template #header>
						<div class="card-header">
							<span style='line-height: 36px;font-size: 16px;padding-left: 8px'>账号管理</span>
						</div>
					</template>
					<div style='padding: 8px'>
						<el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
							<el-tab-pane label="基本信息" name="tab1">
								<el-form :model="form1" label-width="120px">
									<el-form-item label="用户昵称"  prop='name' :rules="[{ required: true, message: '用户昵称不能为空'}]">
										<el-input v-model="form1.name" />
									</el-form-item>
									<el-form-item label="电子邮件">
										<el-input v-model="form2.email"/>
									</el-form-item>
									<el-form-item label="办公电话" >
										<el-input v-model="form2.ofnum"/>
									</el-form-item>
									<el-form-item label="性别">
										<el-radio-group v-model="form2.gender">
											<el-radio label="男" />
											<el-radio label="女" />
										</el-radio-group>
									</el-form-item>
									<el-form-item label="个性签名" >
										<el-input v-model="form2.signature" type='textarea' rows='5'/>
									</el-form-item>
									<el-form-item>
										<el-button type="primary" @click="form2Save">保 存</el-button>
									</el-form-item>
								</el-form>
							</el-tab-pane>
							<el-tab-pane label="密码修改" name="tab2">
								<el-form :model="form2" label-width="120px">
									<el-form-item label="旧密码"  prop='oldPassword' :rules="[{ required: true, message: '旧密码不能为空'}]">
										<el-input v-model="form2.oldPassword" />
									</el-form-item>
									<el-form-item label="新密码"  prop='newPassword' :rules="[{ required: true, message: '新密码不能为空'}]">
										<el-input v-model="form2.newPassword" />
									</el-form-item>
									<el-form-item label="确认密码"  prop='newPassword' :rules="[{ required: true, message: '确认密码不能为空'}]">
										<el-input v-model="form2.confirmPassword" />
									</el-form-item>
									<el-form-item>
										<el-button type="primary" @click="form2Save">保 存</el-button>
									</el-form-item>
								</el-form>
							</el-tab-pane>
							<el-tab-pane label="手机绑定" name="tab3">
								待开发
							</el-tab-pane>
						</el-tabs>
					</div>
				</el-card>


				<el-card class="box-card"  v-if='state.showItem==="1-2"'>
					<template #header>
						<div class="card-header">
							<span style='line-height: 36px;font-size: 16px'>收藏管理</span>
						</div>
					</template>
					<div style='padding: 8px'>
						待开发
					</div>
				</el-card>
			</div>
		</div>
	</Wrap>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, toRefs } from 'vue';
import 'splitpanes/dist/splitpanes.css';
import CropperDialog from '/@/components/cropper/index.vue';
import Wrap from '/@/comps/page/Wrap.vue';
import avatar from '/@/assets/avatar.png';
import GenUpload from '/@/comps/gen/GenUpload.vue';
import { Session } from '/@/utils/storage';
import {get} from '/@/utils/req';


const cropperDialogRef = ref();
const state = reactive({
	cropperImg: avatar,userInfo:{} as any,avatar:'',
	localShow:import.meta.env.VITE_API_URL+'ass/oss/main/show?token='+Session.get('token'),
	form1:{} as any,form2:{} as any,showItem:'1-1',
});

const {form1,form2} = toRefs(state);

onMounted(async () => {
	await userInfoQuery();
});

const userInfoQuery=async ()=>{
	state.userInfo = await get({
		url: '/gen/user/info',
		method: 'get',
	});
	state.avatar=state.localShow+'&id='+state.userInfo.avsrc;
	state.cropperImg=state.localShow+'&id='+state.userInfo.avimg;
}


const closeCropper=async (data:any)=>{
	// state.cropperImg=data.cropperImg;
	state.cropperImg=state.localShow+'&id='+data.cropperImg;
	// await request({
	// 	url: '/gen/user/clip?img='+state.cropperImg,
	// 	method: 'post',
	// });
}

// 打开裁剪弹窗
const onCropperDialogOpen = () => {
	cropperDialogRef.value.openDialog(state.avatar);
};


const uploadModal = ref();
const uploadAvatar=()=>{
	uploadModal.value.openModal('/gen/user/upload');
}

const uploadFinish=async (data:any)=>{
	if(data.uptag){
		await userInfoQuery();
	}
}


const item1Click=()=>{
	// alert(1);
	state.showItem='1-1';
}

const item2Click=()=>{
	state.showItem='1-2';
	// alert(2);
}

const activeName = ref('tab1');
</script>

<style scoped lang="scss">
.croppers-container {
	.cropper-img-warp {
		text-align: center;
		.cropper-img {
			margin: auto;
			width: 100px;
			height: 100px;
			border-radius: 100%;
		}
	}
}
.my-personal .el-menu .el-menu-item {
	color: #333 !important;
	width: 248px !important;
}

.my-personal .el-menu .el-menu-item.is-active{
	color: #3690f1 !important;
	width: 248px !important;
	//background-color: #ecf4ff !important;
	background-color: white !important;
}



.my-personal .el-menu .el-menu-item:hover {
	background-color: #eee !important;
	width: 248px !important;
}

.my-personal .el-menu .el-sub-menu .el-sub-menu__title:hover {
	background-color: #eee !important;
}
</style>
