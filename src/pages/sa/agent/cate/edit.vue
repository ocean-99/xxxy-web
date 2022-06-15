<template>
	<el-dialog v-model='state.show' title='代理商分类' draggable width='500px'>
		<el-form ref='formRef' :model='form' label-width='120px'>
			<el-form-item label='分类名称：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]">
				<el-input v-model='form.name'></el-input>
			</el-form-item>
			<el-form-item label='排序号：' prop='ornum'>
				<el-input-number v-model='form.ornum' controls-position='right' style='width: 100%' />
			</el-form-item>
			<el-form-item label='是否可用：' prop='avtag'>
				<el-switch v-model='form.avtag'>
				</el-switch>
			</el-form-item>
			<el-form-item label='备注：' prop='notes'>
				<el-input type='textarea' :rows='4' v-model='form.notes'>
				</el-input>
			</el-form-item>
		</el-form>
		<template #footer>
      <span class='dialog-footer'>
				<el-button type='primary' @click='handleConfirm'>确 认</el-button>
        <el-button @click='state.show = false'>取 消</el-button>
      </span>
		</template>
	</el-dialog>
</template>

<script lang='ts' setup>
import { defineExpose, reactive, ref, toRefs } from 'vue';
import { modalSave } from '/@/comps/page/edit';
import request from '/@/utils/request';

const state = reactive({
	url: '/sa/agent/cate', show: false,
	form: { avtag: true } as any,
});

const { form } = toRefs(state);

const formRef = ref();
const openModal = async (data: any) => {
	if (data && data.id) {
		state.form = await request({
			url: state.url + '/one/' + data.id,
			method: 'get',
		});
	} else {
		state.form = { avtag: true };
		if (formRef.value) {
			formRef.value.resetFields();
		}
	}
	state.show = true;
};
defineExpose({ openModal });


const emits = defineEmits(['close']);
const handleConfirm = async () => {
	await modalSave({ formRef: formRef.value, state });
	emits('close');
};
</script>
