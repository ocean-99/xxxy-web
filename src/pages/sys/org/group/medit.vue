<template>
	<el-dialog v-model='state.show' title='群组编辑' draggable width='1000px'>
		<el-form ref='formRef' :inline='true' class='zform' :model='form' label-width='140px'>
			<el-tabs type='card' v-model='activeName'>
				<el-tab-pane label='基本信息' name='tab1' style='min-height: 500px'>
					<div class='zform-div'>
						<el-form-item label='群组名称：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]" style='width: 100%'>
							<el-input v-model='form.name'></el-input>
						</el-form-item>
						<el-form-item label='群组分类：' style='width: 100%'>
							<el-tree-select placeholder='请选择' default-expand-all :props="{value:'id',label:'name'}" v-model='form.catid' :data='state.cates'
															check-strictly style='width: 100%;' clearable/>
						</el-form-item>
						<el-form-item label='排序号：'>
							<el-input-number v-model='form.ornum' controls-position='right' style='width: 100%' />
						</el-form-item>
						<el-form-item label='是否可用：'>
							<el-switch v-model='form.avtag' />
						</el-form-item>
						<el-form-item label='成员列表：' style='width: 100%;'>
							<el-input type='textarea' :rows='4' placeholder='可维护用户，部门，岗位' v-model='membersName' readonly @click='openOrgsModal' />
						</el-form-item>
					</div>
				</el-tab-pane>
				<el-tab-pane label='其他信息' name='tab9' style='min-height: 500px'>
					<div class='zform-div'>
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
				</el-tab-pane>
			</el-tabs>
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
import { defineExpose, reactive, ref, toRefs, toRaw, computed } from 'vue';
import { modalSave } from '/@/comps/page/edit';
import OrgModal from '/@/comps/sys/OrgModal.vue';
import {get} from '/@/utils/req';

const state = reactive({
	url: '/sys/org/group', show: false,cates: [] as any,
	form: { avtag: true} as any,
});

const { form } = toRefs(state);
const activeName = ref('tab1');

const catesInit=async ()=>{
	state.cates = await get({
		url: '/sys/org/group/cate/treea',
	});
}


//region -----弹框开启逻辑-----
const formRef = ref();
const open = async (data: any) => {
	await catesInit();
	if (data && data.id) {
		state.form = await get({
			url: state.url + '/one/' + data.id,
		});
	} else {
		state.form = { avtag: true };
		if (formRef.value) {
			formRef.value.resetFields();
		}
		if (data && data.catid) {
			form.value.catid = data.catid;
		}else{
			form.value.catid = null;
		}
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


//region a 所属部门与员工成员逻辑
const orgModal = ref();

const openOrgsModal = () => {
	orgModal.value.openModal({
		orgType: 14,
		selectMode: 2,
		orgs: toRaw(form.value.members),
	});
};

const closeOrgModal = (data: any) => {
	form.value.members = data.orgs;
};

const membersName = computed(() => {
	let names = '';
	if (form.value.members && form.value.members.length > 0) {
		for (const user of form.value.members) {
			names += user.name + '；';
		}
	}
	return names;
});
//endregion


</script>
