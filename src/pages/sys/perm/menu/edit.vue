<template>

	<el-drawer v-model='state.show' size='70%'>
		<template #title>
			<h4>菜单信息</h4>
		</template>
		<template #default>
			<div style='padding: 20px;border-top: 1px solid #ccc'>
				<el-form ref='formRef' :model='form' label-width='160px'>
					<el-row style='height: 48px'>
						<el-col :span='24'>
							<el-form-item label='菜单类型：' prop='type' :rules="[{ required: true, message: '类型不能为空'}]">
								<el-radio-group v-model='form.type'>
									<el-radio-button label='D'>目录</el-radio-button>
									<el-radio-button label='M'>菜单</el-radio-button>
									<el-radio-button label='B'>按钮</el-radio-button>
								</el-radio-group>
							</el-form-item>
						</el-col>

					</el-row>
					<el-row style='height: 48px'>
						<el-col :span='12'>
							<el-form-item label='菜单名称：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]">
								<el-input v-model='form.name'></el-input>
							</el-form-item>
						</el-col>
						<el-col :span='12'>
							<el-form-item label='上级菜单：'>
								<el-input v-model='form.parna' readonly :suffix-icon='Search' @click='openParentModal'></el-input>
								<ParentModal url='/sys/perm/menu/tree' ref='parentModal' @close='closeParentModal' />
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
							<el-form-item label='是否启用：'>
								<el-switch v-model='form.avtag'>
								</el-switch>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row style='height: 48px' v-show="form.type === 'M'||form.type === 'D'">
						<el-col :span='12'>
							<el-form-item label='菜单代码：'>
								<el-input v-model='form.code'></el-input>
							</el-form-item>
						</el-col>
						<el-col :span='12'>
							<el-form-item label='路由地址：' prop='path' :rules="[{ required: true, message: '名称不能为空'}]">
								<el-input v-model='form.path'></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row style='height: 48px'>
						<el-col :span='12'>
							<el-form-item label='权限标识：' prop='perm' :rules="[{ required: true, message: '名称不能为空'}]">
								<el-select v-model='form.perm' placeholder='请选择权限标识' clearable filterable style='width: 100%'>
									<el-option
										v-for='item in state.apis'
										:key='item.id'
										:label='item.name'
										:value='item.id'
									/>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span='12' v-show="form.type === 'M'">
							<el-form-item label='组件路径：' prop='comp' :rules="[{ required: true, message: '名称不能为空'}]">
								<el-input v-model='form.comp'></el-input>
							</el-form-item>
						</el-col>
					</el-row>

					<el-row style='height: 48px' v-show="form.type === 'M'||form.type === 'D'">
						<el-col :span='12'>
							<el-form-item label='图标：'>
								<IconSelector placeholder='请输入菜单图标' v-model='form.icon' type='all' style='width: 100%' />
							</el-form-item>
						</el-col>
						<el-col :span='12'>
							<el-form-item label='是否缓存：'>
								<el-switch v-model='form.catag' />
							</el-form-item>
						</el-col>
					</el-row>


					<el-row style='height: 48px' v-show="form.type === 'M'||form.type === 'D'">
						<el-col :span='12'>
							<el-form-item label='是否显示：'>
								<el-switch v-model='form.shtag' />
							</el-form-item>
						</el-col>
						<el-col :span='12'>
							<el-form-item label='是否外链：'>
								<el-switch v-model='form.extag' />
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
import IconSelector from '/@/components/iconSelector/index.vue';
import request from '/@/utils/request';
import ParentModal from '/@/comps/gen/GenModal.vue';
import {FormInstance} from "element-plus";

const formRef = ref<FormInstance>();

const state = reactive({
	url: '/sys/perm/menu', show: false, apis: [] as any,
	form: {
		avtag: true,
		catag: true,
		shtag: true,
	} as any,
});

const { form } = toRefs(state);

//暴露open方法给父组件调用
const open = async (data: any) => {
	if (!data) {
		await drawerOpen(state, '');
	} else if (data.pid) {
		state.form = {
			avtag: true,
			parna: data.pname,
			pid: data.pid,
		};
		state.show = true;
	} else if (data.id) {
		await drawerOpen(state, data.id);
	}

};
defineExpose({ open });

//取得父组件listQuery方法的调用权
const emits = defineEmits(['treeQuery']);
const confirm = async () => {
	await drawerSave(formRef.value,state);
	emits('treeQuery');
};


//页面初始化
const apisInit = async () => {
	state.apis = await request({
		url: '/sys/perm/api/list',
		method: 'get',
	});
};

onMounted(() => {
	apisInit();
});


//region -----上级菜单选择逻辑-----
const parentModal = ref();

const openParentModal = () => {
	parentModal.value.openModal();
};

const closeParentModal = (node: any) => {
	form.value.pid = node.id;
	form.value.parna = node.name;
};
//endregion


</script>

<style scoped>
</style>
