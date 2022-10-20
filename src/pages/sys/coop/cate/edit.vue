<template>
	<el-drawer v-model='state.show' size='70%'>
		<template #header>
			<h4>分类维护</h4>
		</template>
		<template #default>
			<div style='padding: 20px;'>
				<el-form ref='formRef' :model='form' :inline='true' class='xform' label-width='160px'>
					<div class='zform-div'>
						<el-form-item label='分类名称：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]">
							<el-input v-model='form.name'></el-input>
						</el-form-item>
						<el-form-item label='上级分类：'>
							<el-input v-model='form.pname' readonly :suffix-icon='Search' @click='openParentModal'></el-input>
							<ParentModal url='/sys/coop/cate/tree' :maInit='true' ref='parentModal' @close='closeParentModal' />
						</el-form-item>
						<el-form-item label='排序号：'>
							<el-input-number v-model='form.ornum' controls-position='right' style='width: 100%' />
						</el-form-item>
						<el-form-item label='是否启用：'>
							<el-switch v-model='form.avtag' />
						</el-form-item>
						<el-form-item label='创建人：' v-show='form.crtim'>
							<div class='zinput'>{{ form.crman ? form.crman.name : '' }}</div>
						</el-form-item>
						<el-form-item label='创建时间：' v-show='form.crtim'>
							<div class='zinput'>{{ form.crtim }}</div>
						</el-form-item>
						<el-form-item label='更新人：' v-show='form.uptim'>
							<div class='zinput'> {{ form.upman ? form.upman.name : '' }}</div>
						</el-form-item>
						<el-form-item label='更新时间：' v-show='form.uptim'>
							<div class='zinput'>{{ form.uptim }}</div>
						</el-form-item>
						<el-form-item label='备注：' style='width: 100%'>
							<el-input v-model='form.notes' :rows='4' type='textarea' />
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

</template>

<script lang='ts' setup>
import { Search } from '@element-plus/icons-vue';
import { onMounted, reactive, ref, toRefs } from 'vue';
import { drawerOpen, drawerSave } from '/@/comps/page/edit';
import ParentModal from '/@/comps/gen/GenTreeModal.vue';
import { FormInstance } from 'element-plus';

const formRef = ref<FormInstance>();

const state = reactive({
	url: '/sys/coop/cate', show: false, apis: [] as any,
	form: {
		avtag: true,
		catag: true,
		shtag: true,
		type: 'M',
	} as any,
});

const { form } = toRefs(state);

//暴露open方法给父组件调用
const open = async (data: any) => {
	if (!data.id) {
		if (data.pid) {
			state.form = {
				avtag: true,
				pname: data.pname,
				pid: data.pid,
				parent:{id:data.pid,name:data.pname},
				type: 'M',
			};
			state.show = true;
		} else {
			state.form = {
				avtag: true,
				type: 'M',
			};
			state.show = true;
		}
	} else if (data.id) {
		await drawerOpen({ state, id: data.id });
		if(state.form.parent){
			state.form.pid=state.form.parent.id;
			state.form.pname=state.form.parent.name;
		}
	}
};
defineExpose({ open });

//取得父组件listQuery方法的调用权
const emits = defineEmits(['treeQuery']);
const confirm = async () => {
	await drawerSave({ formRef: formRef.value, state });
	emits('treeQuery');
};


//页面初始化

onMounted(() => {

});


//region -----上级菜单选择逻辑-----
const parentModal = ref();

const openParentModal = () => {
	parentModal.value.openModal({ reload: true, params: { porid: state.form.porid } });
};

const closeParentModal = (node: any) => {
	form.value.pid = node.id;
	form.value.pname = node.name;
	form.value.parent = {id:node.id,name:node.name};
};
//endregion


</script>

<style scoped>
</style>
