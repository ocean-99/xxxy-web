<template>
	<el-dialog v-model='state.show' title='接口信息' draggable width='1000px'>
		<el-form ref='formRef' :inline='true' class='zform' :model='form' label-width='140px'>
			<div class='zform-div'>
				<el-form-item label='接口名称：'>
					{{ form.id }}
				</el-form-item>
				<el-form-item label='是否可用：'>
					<el-switch v-model='form.avtag' />
				</el-form-item>
				<el-form-item label='备注：' style='width: 100%'>
					<el-input type='textarea' :rows='4' v-model='form.notes' />
				</el-form-item>
				<el-form-item label='创建时间：'>
					{{ form.crtim }}
				</el-form-item>
				<el-form-item label='更新时间：'>
					{{ form.uptim }}
				</el-form-item>
			</div>
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
	url: '/sys/api/main', show: false,
	form: { avtag: true } as any,
});

const { form } = toRefs(state);


//region -----弹框开启逻辑-----
const formRef = ref();
const open = async (data: any) => {
	if (data && data.id) {
		state.form = await request({
			url: state.url + '/one/' + data.id,
			method: 'get',
		});
	}
	state.show = true;
};

defineExpose({ open });
//endregion

//region -----弹框关闭逻辑-----
const emits = defineEmits(['close']);
const handleConfirm = async () => {
	await modalSave({ formRef: formRef.value, state });
	emits('close');
};
//endregion
</script>
