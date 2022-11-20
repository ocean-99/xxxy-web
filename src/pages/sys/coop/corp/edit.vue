<template>
	<div>
		<el-drawer v-model='state.show' size='70%'>
			<template #header>
				<h4>外部公司编辑</h4>
			</template>
			<template #default>
				<div style='padding: 20px;'>
					<el-form ref='formRef' class='xform' :inline='true' :model='form' label-width='160px'>
						<div class='zform-div'>
							<el-form-item label='公司名称：' style='width: 100%' prop='name' :rules="[{ required: true, message: '名称不能为空'}]">
								<el-input v-model='form.name'></el-input>
							</el-form-item>
							<el-form-item label='所属分类：' prop='catid' :rules="[{ required: true, message: '分类不能为空'}]">
								<el-tree-select placeholder='请选择' default-expand-all :props="{value:'id',label:'name'}" v-model='form.catid' :data='state.cates'
																check-strictly style='width: 100%;' clearable />
							</el-form-item>
							<el-form-item label='是否可用：'>
								<el-switch v-model='form.avtag'>
								</el-switch>
							</el-form-item>
							<el-form-item label='公司地址：' style='width: 100%'>
								<!--							<el-input v-model='form.addre' readonly @click='chooseAddr'></el-input>-->
								<el-input v-model='form.addre' />
							</el-form-item>
							<el-form-item label='税务登记号：'>
								<el-input v-model='form.renum' />
							</el-form-item>
							<el-form-item label='法人代表：'>
								<el-input v-model='form.leman' />
							</el-form-item>
							<el-form-item label='公司电话：'>
								<el-input v-model='form.cotel' />
							</el-form-item>
							<el-form-item label='公司传真：'>
								<el-input v-model='form.cofax' />
							</el-form-item>
							<el-form-item label='成立日期：'>
								<el-input v-model='form.redat' />
							</el-form-item>
							<el-form-item label='注册资金（万）：'>
								<el-input v-model='form.recap' />
							</el-form-item>
							<el-form-item label='邮编：'>
								<el-input v-model='form.cozip' />
							</el-form-item>
							<el-form-item label='公司邮箱：'>
								<el-input v-model='form.comai' />
							</el-form-item>
							<el-form-item label='关联企业：' style='width: 100%'>
								<el-input v-model='form.licos' />
							</el-form-item>
							<el-form-item label='创建人：' v-show='form.crtim'>
								<div class='zinput'>{{ form.crman ? form.crman.name : '' }}</div>
							</el-form-item>
							<el-form-item label='创建时间：' v-show='form.crtim'>
								<div class='zinput'>{{ form.crtim }}</div>
							</el-form-item>
							<el-form-item label='更新人：' v-show='form.uptim'>
								<div class='zinput'>{{ form.upman ? form.upman.name : '' }}</div>
							</el-form-item>
							<el-form-item label='更新时间：' v-show='form.uptim'>
								<div class='zinput'>{{ form.uptim }}</div>
							</el-form-item>
							<el-form-item label='备注：' style='width: 100%'>
								<el-input v-model='form.notes' type='textarea' rows='4' />
							</el-form-item>
						</div>
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
	</div>
</template>

<script lang='ts' setup>
import { onMounted, reactive, ref, toRefs } from 'vue';
import { drawerOpen, drawerSave } from '/@/comps/page/edit';
import request from '/@/utils/request';

const state = reactive({
	url: '/sys/coop/corp', show: false, cates: [] as any,
	form: { avtag: true } as any,
	list: [] as any,
});

const { form, cates } = toRefs(state);
//暴露open方法给父组件调用
const formRef = ref();
const open = async (data: any) => {
	if (data.id) {
		await drawerOpen({ state, id: data.id });
	} else {
		await drawerOpen({ state, id: '' });
		state.form.catid = data.catid;
		// formRef.value.resetFields();
	}
};
defineExpose({ open });

//取得父组件listQuery方法的调用权
const emits = defineEmits(['listQuery']);
const confirm = async () => {
	await drawerSave({ formRef: formRef.value, state });
	emits('listQuery');
};

const catesInit = async () => {
	cates.value = await request({
		url: '/sys/coop/cate/treea',
		method: 'get',
	});
};
onMounted(() => {
	catesInit();
});
</script>
