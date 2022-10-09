<template>
	<el-dialog v-model='state.show' title='部门编辑' draggable width='1000px'>
		<el-form ref='formRef' :inline='true' class='zform' :model='form' label-width='140px'>
			<el-tabs type='card' v-model='activeName'>
				<el-tab-pane label='基本信息' name='tab1' style='min-height: 500px'>
					<div class='zform-div'>
						<el-form-item label='姓名：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]">
							<el-input v-model='form.name' />
						</el-form-item>
						<el-form-item label='昵称：'>
							<el-input v-model='form.ninam' />
						</el-form-item>
						<el-form-item label='登录名：' prop='usnam' :rules="[{ required: true, message: '登录名不能为空'}]">
							<el-input v-model='form.usnam' />
						</el-form-item>
						<el-form-item label='密码：' prop='pacod' :rules="[{ required: !form.id, message: '密码不能为空'}]">
							<el-input type='password' v-model='form.pacod' show-password v-if='!form.id'/>
							<el-input v-model='state.pacod' v-if='form.id' style='width: 135px;margin-right: 10px'/>
							<el-button type='success' @click='randomPassword' v-if='form.id'>随机设置</el-button>
							<el-button type='warning' @click='resetPassword' v-if='form.id'>重置密码</el-button>
						</el-form-item>
						<el-form-item label='所属部门：' prop='depna' :rules="[{ required: true, message: '所属部门不能为空'}]" style='width: 50%'>
							<el-input v-model='form.depna' @click='openOrgModal' readonly :suffix-icon='Search' />
						</el-form-item>
						<el-form-item label='排序号：'>
							<el-input-number v-model='form.ornum' controls-position='right' style='width: 100%' />
						</el-form-item>
						<el-form-item label='是否可用：'>
							<el-switch v-model='form.avtag' />
						</el-form-item>
						<el-form-item label='职务：' style='width: 50%'>
							<el-input v-model='form.job' />
						</el-form-item>
						<el-form-item label='手机号：'>
							<el-input v-model='form.monum' />
						</el-form-item>
						<el-form-item label='email：'>
							<el-input v-model='form.email' />
						</el-form-item>
					</div>
				</el-tab-pane>
				<el-tab-pane label='其他信息' name='tab9' style='min-height: 500px'>
					<div class='zform-div'>
						<el-form-item label='备注：' style='width: 100%'>
							<el-input type='textarea' :rows='4' v-model='form.notes' />
						</el-form-item>
						<el-form-item label='创建时间：' style='width: 50%'>
							{{ form.crtim ? form.crtim : '#' }}
						</el-form-item>
						<el-form-item label='更新时间：' style='width: 50%'>
							{{ form.uptim ? form.uptim : '#' }}
						</el-form-item>
					</div>
				</el-tab-pane>
			</el-tabs>
		</el-form>
		<template #footer>
      <span class='dialog-footer'>
				<el-button type='primary' @click='handleConfirm'>确 认</el-button>
        <el-button @click='state.show = false'>取 消</el-button>
      </span>
		</template>
		<OrgModal ref='orgModal' @close='closeOrgModal'/>
	</el-dialog>
</template>

<script lang='ts' setup>
import { Search} from '@element-plus/icons-vue';
import {defineExpose, reactive, ref, toRefs} from 'vue';
import {modalSave } from '/@/comps/page/edit';
import OrgModal from '/@/comps/sys/OrgModal.vue';
import request from '/@/utils/request';
import { ElMessage } from 'element-plus';

const state = reactive({
	url: '/sys/org/user', show: false,pacod:'',
	form: {avtag: true} as any,
});

const {form} = toRefs(state);
const activeName = ref('tab1');


//region -----弹框开启逻辑-----
const formRef = ref();
const open = async (data: any) => {
	if (data && data.id) {
		state.form = await request({
			url: state.url + '/one/' + data.id,
			method: 'get',
		});
		if(state.form.dept){
			state.form.depid = state.form.dept.id;
			form.value.depna = state.form.dept.name;
		}
	} else {
		state.form = {avtag: true};
		if (formRef.value) {
			formRef.value.resetFields();
		}
		if (data && data.depid) {
			form.value.dept = {id: data.depid, name: data.depna};
			form.value.depna = data.depna;
			form.value.depid = data.depid;
		}
		// console.log(form.value);
	}
	state.show = true;
};

defineExpose({open});
//endregion


//region -----弹框关闭逻辑-----
const emits = defineEmits(['close']);
const handleConfirm = async () => {
	if (form.value.depid) {
		form.value.dept = {id: form.value.depid};
	} else {
		form.value.dept = null;
	}
	await modalSave({formRef: formRef.value, state});
	emits('close');
};
//endregion


//region a 部门选择逻辑
const orgModal = ref();

const openOrgModal = () => {
	orgModal.value.openModal({ orgType: 3 });
};

const closeOrgModal = (data: any) => {
	if (data.orgs && data.orgs.length > 0) {
		form.value.dept = { id: data.orgs[0].id, name: data.orgs[0].name };
		form.value.depna = data.orgs[0].name;
		form.value.depid = data.orgs[0].id;
	}
};
//endregion

const randomPassword=()=>{
	const amm=['!','@','#','$','%','&','*','(',')','_'];//定义特殊字符数组
	let num=Math.floor(Math.random()*1000) as any;//生成0-9随机数
	let tmp=Math.floor(Math.random()*10) as any;//生成0-9随机数
	let s="";
	//生成大写字母
	for(let i=0;i<3;i++){
		tmp=Math.floor(Math.random()*26);
		s=s+String.fromCharCode(65+tmp);
	}
	s=s+amm[Math.floor(Math.random()*10)];//取特殊字符
	s=s+num;
	//生成小写字母
	for(let i=0;i<3;i++){
		tmp=Math.floor(Math.random()*26);
		s=s+String.fromCharCode(97+tmp);
	}
	state.pacod=s;
}

const resetPassword=async ()=>{
	if(!state.pacod){
		ElMessage.warning("请先填写新密码");
		return ;
	}
	await request({
		url: state.url + '/pacod',
		method: 'post',
		data:{id:state.form.id,pacod:state.pacod}
	});
	ElMessage.success("重置密码成功");
}
</script>
