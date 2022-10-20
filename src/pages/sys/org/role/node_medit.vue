<template>
	<el-dialog v-model='state.show' title='角色节点编辑' draggable width='1000px'>
		<el-form ref='formRef' :inline='true' class='zform' :model='form' label-width='120px'>
			<div class='zform-div'>
				<el-form-item label='名称：' style='width:100%' prop='name' :rules="[{ required: true, message: '名称不能为空'}]">
					<el-input v-model='form.name'></el-input>
				</el-form-item>
				<el-form-item label='节点成员：' style='width:100%'>
					<el-input v-model='form.memna' @click='openOrgModal' readonly :suffix-icon='Search' placeholder='可维护用户，部门，岗位。部门需要在最低层'/>
				</el-form-item>
<!--				<el-form-item label='排序号：'>-->
<!--					<el-input-number v-model='form.ornum' controls-position='right' style='width: 100%' />-->
<!--				</el-form-item>-->
<!--				<el-form-item label='是否启用：'>-->
<!--					<el-switch v-model='form.avtag'/>-->
<!--				</el-form-item>-->
				<el-form-item label='创建时间：'>
					<div class='zinput'>{{ form.crtim }}</div>
				</el-form-item>
				<el-form-item label='更新时间：'>
					<div class='zinput'>{{ form.uptim }}</div>
				</el-form-item>
				<el-form-item label='备注：' style='width: 100%'>
					<el-input v-model='form.notes' type='textarea' :rows='4'/>
				</el-form-item>
			</div>
		</el-form>
		<template #footer>
      <span class='dialog-footer'>
				<el-button type='primary' @click='handleConfirm'>确 认</el-button>
        <el-button @click='state.show = false'>取 消</el-button>
      </span>
		</template>
		<OrgModal ref='orgModal' @close='closeOrgModal' />
	</el-dialog>
</template>

<script lang='ts' setup>
import { defineExpose, reactive, ref, toRefs } from 'vue';
import {modalSave} from '/@/comps/page/edit';
import request from "/@/utils/request";
import { ElMessage } from 'element-plus';
import OrgModal from '/@/comps/sys/OrgModal.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const state = reactive({
	url: '/sys/org/rnode', show: false,
	form: {avtag: true} as any,type:'add',
});

const {form} = toRefs(state);

const formRef = ref();
const open = async (data: any) => {
	if (data && data.id) {
		state.form = await request({
			url: state.url + '/one/' + data.id,
			method: 'get',
		});
		if (state.form.member) {
			state.form.memid = state.form.member.id;
			state.form.memna = state.form.member.name;
		}
		state.type='edit';
	} else {
		state.type='add';
		state.form = {avtag: true,children:[]};
		if(data.pid){
			state.form.pid=data.pid;
		}
		if (formRef.value) {
			formRef.value.resetFields();
		}
	}
	state.form.treid=route.query?.id
	state.show = true;
};
defineExpose({open});


const emits = defineEmits(['close']);
const handleConfirm = async () => {
	if(!state.form.name){
		ElMessage.warning("节点名称必须填写");
		return;
	}
	const backNode={} as any;
	backNode.id=await modalSave({formRef: formRef.value, state});
	backNode.name=state.form.name;
	backNode.notes=state.form.notes;
	backNode.pid=state.form.pid;
	backNode.children=state.form.children;
	emits('close',backNode,state.type);
};

//region a 部门选择逻辑
const orgModal = ref();

const openOrgModal = () => {
	orgModal.value.openModal({ orgType: 15 });
};

const closeOrgModal = (data: any) => {
	if (data.orgs && data.orgs.length > 0) {
		form.value.member = { id: data.orgs[0].id, name: data.orgs[0].name };
		form.value.memna = data.orgs[0].name;
		form.value.memid = data.orgs[0].id;
	}
};
//endregion
</script>
