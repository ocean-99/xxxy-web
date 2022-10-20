<template>
	<el-dialog v-model='state.show' title='岗位编辑' draggable width='1000px'>
		<el-form ref="formRef" :inline="true" class='zform' :model='form' label-width='140px'>
			<el-tabs type='card' v-model='activeName'>
				<el-tab-pane label='基本信息' name='tab1'  style='min-height: 500px'>
					<div class="zform-div">
						<el-form-item label='岗位名称：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]" style="width: 100%;">
							<el-input v-model='form.name'/>
						</el-form-item>
						<el-form-item label='所属部门：' prop='depna' :rules="[{ required: true, message: '所属部门不能为空'}]">
							<el-input v-model='form.depna' @click='openDeptModal' readonly :suffix-icon='Search'/>
						</el-form-item>
						<el-form-item label='排序号：' style="width: 25%">
							<el-input-number v-model='form.ornum' controls-position='right' style='width: 100%'/>
						</el-form-item>
						<el-form-item label='是否可用：' style="width: 25%">
							<el-switch v-model='form.avtag'/>
						</el-form-item>
						<el-form-item label='员工成员：' style="width: 100%;">
							<el-input type='textarea' :rows='4' v-model='usersName' readonly @click='openUsersModal'/>
						</el-form-item>
					</div>
				</el-tab-pane>
				<el-tab-pane label='其他信息' name='tab9'  style='min-height: 500px'>
					<div class="zform-div">
						<el-form-item label='备注：' style="width: 100%">
							<el-input type='textarea' :rows='4' v-model='form.notes'/>
						</el-form-item>
						<el-form-item label='创建时间：'>
							{{ form.crtim }}
						</el-form-item>
						<el-form-item label='更新时间：'>
							{{ form.uptim }}
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
import {defineExpose, reactive, ref, toRefs,toRaw,computed} from 'vue';
import {modalSave } from '/@/comps/page/edit';
import OrgModal from '/@/comps/sys/OrgModal.vue';
import request from '/@/utils/request';

const state = reactive({
	url: '/sys/org/post', show: false,
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


//region a 所属部门与员工成员逻辑
const orgModal = ref();

const openDeptModal = () => {
	orgModal.value.openModal({
		opener: 'dept',
		orgType: 3,
		selectMode: 1,
	});
};

const openUsersModal = () => {
	orgModal.value.openModal({
		opener: 'users',
		orgType: 8,
		selectMode: 2,
		orgs: toRaw(form.value.users),
	});
};

const closeOrgModal = (data: any) => {
	if (data.opener == 'dept') {
		if (data.orgs && data.orgs.length > 0) {
			form.value.dept = {id: data.orgs[0].id, name: data.orgs[0].name};
			form.value.depna = data.orgs[0].name;
			form.value.depid = data.orgs[0].id;
		}
	} else if (data.opener == 'users') {
		form.value.users = data.orgs;
	}
};

const usersName = computed(() => {
	let names = '';
	if (form.value.users && form.value.users.length > 0) {
		for (const user of form.value.users) {
			names += user.name + '；';
		}
	}
	return names;
});
//endregion

</script>
