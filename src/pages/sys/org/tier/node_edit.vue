<template>
	<el-drawer v-model='state.show' size='70%'>
		<template #title>
			<h4>层级节点编辑</h4>
		</template>
		<template #default>
			<div style='padding: 20px;border-top: 1px solid #ccc'>
				<el-form ref='formRef' :model='form' label-width='160px'>
					<el-row style='height: 48px'>
						<el-col :span='12'>
							<el-form-item label='名称：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]">
								<el-input v-model='form.name'></el-input>
							</el-form-item>
						</el-col>
						<el-col :span='12'>
							<el-form-item label='上一节点：'>
								<el-input v-model='form.parna' readonly :suffix-icon='Search' @click='openParentModal'></el-input>
								<ParentModal url='/sys/org/tnode/tree' :maInit="true" ref='parentModal' @close='closeParentModal'/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row style='height: 48px'>
						<el-col :span='12'>
							<el-form-item label='节点成员：'>
								<el-input v-model='form.memna' @click='openOrgModal' readonly :suffix-icon='Search'/>
								<OrgModal ref='orgModal' @close='closeOrgModal'/>
							</el-form-item>
						</el-col>
						<el-col :span='6'>
							<el-form-item label='排序号：'>
								<el-input-number v-model='form.ornum' controls-position='right' style='width: 100%'/>
							</el-form-item>
						</el-col>
						<el-col :span='6'>
							<el-form-item label='是否启用：'>
								<el-switch v-model='form.avtag'>
								</el-switch>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row style='height: 48px' v-show='form.crtim'>
						<el-col :span='12'>
							<el-form-item label='创建时间：'>
								{{ form.crtim }}
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
								<el-input v-model='form.notes' type='textarea'/>
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
import {onMounted, reactive, ref, toRefs} from 'vue';
import {Search} from '@element-plus/icons-vue';
import {drawerOpen, drawerSave} from '/@/comps/page/edit';
import {FormInstance} from "element-plus";
import ParentModal from '/@/comps/gen/GenModal.vue';
import OrgModal from '/@/comps/sys/OrgModal.vue';

const formRef = ref<FormInstance>();

const state = reactive({
	url: '/sys/org/tnode', show: false,
	form: {
		avtag: true,
		catag: true,
		shtag: true,
	} as any,
});

const {form} = toRefs(state);

//暴露open方法给父组件调用
const open = async (data: any) => {
	if (!data.id) {
		if (data.pid) {
			state.form = {
				avtag: true,
				pid: data.pid,
			};
			state.show = true;
		} else {
			state.form = {
				avtag: true,
			};
			state.show = true;
		}
	} else if (data.id) {
		await drawerOpen({state, id:data.id});
		if(state.form.member){
			state.form.memid=state.form.member.id;
			state.form.memna=state.form.member.name;
		}
	}
};
defineExpose({open});

//取得父组件listQuery方法的调用权
const emits = defineEmits(['nodeRefresh']);
const confirm = async () => {
	await drawerSave({formRef:formRef.value, state});
	emits('nodeRefresh');
};


//页面初始化

onMounted(() => {

});


//region -----上级节点选择逻辑-----
const parentModal = ref();

const openParentModal = () => {
	parentModal.value.openModal({reload:true,params:{treid:state.form.treid}});
};

const closeParentModal = (node: any) => {
	form.value.pid = node.id;
	form.value.parna = node.name;
	form.value.parent = node;
};
//endregion


//region a 部门选择逻辑
const orgModal = ref();

const openOrgModal = () => {
	orgModal.value.openModal({orgType: 15});
};

const closeOrgModal = (data: any) => {
	if (data.orgs && data.orgs.length > 0) {
		form.value.member = {id: data.orgs[0].id, name: data.orgs[0].name};
		form.value.memna = data.orgs[0].name;
		form.value.memid = data.orgs[0].id;
	}
};
//endregion



</script>

<style scoped>
</style>
