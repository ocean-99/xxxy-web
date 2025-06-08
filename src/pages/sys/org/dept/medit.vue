<template>
	<el-dialog v-model='state.show' title='部门编辑' draggable width='1000px'>
		<el-form ref='formRef' :inline="true" class='zform' :model='form' label-width='140px'>
			<el-tabs type='card' v-model='activeName'>
				<el-tab-pane label='基本信息' name='tab1' style='min-height: 500px'>
					<div class="zform-div">
						<el-form-item label='部门名称：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]">
							<el-input v-model='form.name'/>
						</el-form-item>
						<el-form-item label='上级部门：'>
							<el-input v-model='form.pname' @click='openOrgModal' readonly input-style='cursor: pointer'>
								<template #suffix>
									<el-icon class='el-input__icon'>
										<Search @click='openOrgModal' />
									</el-icon>
								</template>
							</el-input>
						</el-form-item>
						<el-form-item label='部门类型：'>
							<el-select v-model='form.type' style='width: 100%'>
								<el-option :value='1' label='机构'/>
								<el-option :value='2' label='部门'/>
							</el-select>
						</el-form-item>
						<el-form-item label='排序号：' style="width: 25%">
							<el-input-number v-model='form.ornum' controls-position='right' style='width: 100%'/>
						</el-form-item>
						<el-form-item label='是否可用：' style="width: 25%">
							<el-switch v-model='form.avtag'/>
						</el-form-item>
					</div>
				</el-tab-pane>
				<el-tab-pane label='其他信息' name='tab9' style='min-height: 500px'>
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
import {defineExpose, reactive, ref, toRefs} from 'vue';
import {modalSave } from '/@/comps/page/edit';
import OrgModal from '/@/comps/sys/OrgModal.vue';
import {get} from '/@/utils/req';

const state = reactive({
	url: '/sys/org/dept', show: false,
	form: {avtag: true, type: 2} as any,
});

const {form} = toRefs(state);
const activeName = ref('tab1');


//region -----弹框开启逻辑-----
const formRef = ref();
const open = async (data: any) => {
	if (data && data.id) {
		state.form = await get({url: state.url + '/one/' + data.id});
		if(state.form.parent){
			state.form.pid = state.form.parent.id;
			form.value.pname = state.form.parent.name;
		}
	} else {
		state.form = {avtag: true};
		if (formRef.value) {
			formRef.value.resetFields();
		}
		if (data && data.pid) {
			form.value.parent = {id: data.pid, name: data.pname};
			form.value.pname = data.pname;
			form.value.pid = data.pid;
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
	if (form.value.pid) {
		form.value.parent = {id: form.value.pid};
	} else {
		form.value.parent = null;
	}
	await modalSave({formRef: formRef.value, state});

	emits('close');
};
//endregion

const orgModal = ref();

const openOrgModal = () => {
	orgModal.value.openModal({
		orgType: 3,
	});
};

const closeOrgModal = (data: any) => {
	if (data.orgs && data.orgs.length > 0) {
		form.value.parent = {id: data.orgs[0].id, name: data.orgs[0].name};
		form.value.pname = data.orgs[0].name;
		form.value.pid = data.orgs[0].id;
	}
};

</script>
