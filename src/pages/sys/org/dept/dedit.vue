<template>
  <el-drawer v-model='state.show' size='70%'>
    <template #header>
      <h4>部门编辑</h4>
    </template>
    <template #default>
      <div style='padding: 20px;'>
				<el-form ref='formRef' :inline="true" class='zform' :model='form' label-width='140px'>
					<el-tabs type='card' v-model='activeName'>
						<el-tab-pane label='基本信息' name='tab1'>
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
						<el-tab-pane label='其他信息' name='tab9'>
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
      </div>
			<OrgModal ref='orgModal' @close='closeOrgModal'/>
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
import {reactive, ref, toRefs} from 'vue';
import {drawerOpen, drawerSave} from '/@/comps/page/edit';
import {FormInstance} from "element-plus";
import OrgModal from '/@/comps/sys/OrgModal.vue';

const formRef = ref<FormInstance>();

const state = reactive({
  url: '/sys/org/dept', show: false,
  form: {avtag: true} as any,
});
const activeName = ref('tab1');


const {form} = toRefs(state);

//暴露open方法给父组件调用
const open = async (data:any) => {
  await drawerOpen({state, id:data.id});
	if (form.value.parent) {
		form.value.pname = form.value.parent.name;
	}
	if(!data.id){
		form.value.type = 2;
		form.value.pname = data.pname;
		form.value.pid = data.pid;
		form.value.parent = {id:data.pid,name:data.pname};
	}
};
defineExpose({open});

//取得父组件listQuery方法的调用权
const emits = defineEmits(['listQuery']);
const confirm = async () => {
  await drawerSave({formRef: formRef.value, state, iouField: 'crtim'});
  emits('listQuery');
};

//region a 部门选择逻辑
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
//endregion

</script>

<style scoped>
</style>
