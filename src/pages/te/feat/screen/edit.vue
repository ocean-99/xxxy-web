<template>
	<el-drawer v-model='state.show' size='70%'>
		<template #title>
			<h4>特性屏幕</h4>
		</template>
		<template #default>
			<div style='padding: 20px;border-top: 1px solid #ccc'>
				<el-form ref='formRef' :model='form' label-width='160px'>
					<el-row style='height: 48px'>
						<el-col :span='12'>
							<el-form-item label='屏幕名称：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]">
								<el-input v-model='form.name'></el-input>
							</el-form-item>
						</el-col>
						<el-col :span='12'>
							<el-form-item label='所属分类：' prop='catid' :rules="[{ required: true, message: '分类不能为空'}]">
								<el-select v-model='form.catid' placeholder='请选择产品分类'>
									<el-option
										v-for='item in cates'
										:key='item.id'
										:label='item.name'
										:value='item.id'
									/>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row style='height: 48px'>
						<el-col :span='12'>
							<el-form-item label='排序号：'>
								<el-input-number v-model='form.ornum' controls-position='right' style='width: 100%' />
							</el-form-item>
						</el-col>
						<el-col :span='12'>
							<el-form-item label='是否可用：'>
								<el-switch v-model='form.avtag'>
								</el-switch>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row style='height: 48px' v-show='form.crtim'>
						<el-col :span='12'>
							<el-form-item label='创建人：'>
								{{ form.crman ? form.crman.name : '' }}
							</el-form-item>
						</el-col>
						<el-col :span='12'>
							<el-form-item label='创建时间：'>
								{{ form.crtim }}
							</el-form-item>
						</el-col>
					</el-row>
					<el-row style='height: 48px' v-show='form.crtim'>
						<el-col :span='12'>
							<el-form-item label='更新人：'>
								{{ form.upman ? form.upman.name : '' }}
							</el-form-item>
						</el-col>
						<el-col :span='12'>
							<el-form-item label='更新时间：'>
								{{ form.uptim }}
							</el-form-item>
						</el-col>
					</el-row>
					<el-row style='height: 48px'>
						<el-col :span='24'>
							<el-form-item label='备注：'>
								<el-input v-model='form.notes' type='textarea' />
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
		</template>
		<template #footer>
			<div style='flex: auto;margin: 20px'>
				<el-button type='primary' @click='confirm'>确认</el-button>
				<el-button @click='state.show = false'>取消</el-button>
			</div>
		</template>
	</el-drawer>
</template>

<script lang='ts' setup>
import { onMounted, reactive, ref, toRefs } from 'vue';
import { drawerOpen, drawerSave } from '/@/comps/page/edit';
import request from '/@/utils/request';

const state = reactive({
	url: '/te/feat/screen', show: false, cates: [] as any,
	form: { avtag: true } as any,
});

const { form, cates } = toRefs(state);

//暴露open方法给父组件调用
const formRef = ref();
const open = async (id: string) => {
	await drawerOpen({state, id});
	if(!id){
		formRef.value.resetFields();
	}
};
defineExpose({ open });

//取得父组件listQuery方法的调用权
const emits = defineEmits(['listQuery']);
const confirm = async () => {
  await drawerSave({formRef:formRef.value, state});
	emits('listQuery');
};

const catesInit = async () => {
	cates.value = await request({
		url: '/te/prod/cate/list',
		method: 'get',
	});
};

onMounted(() => {
	catesInit();
});

</script>

<style scoped>
</style>
