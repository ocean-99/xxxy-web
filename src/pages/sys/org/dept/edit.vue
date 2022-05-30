<template>
	<el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
		<template #header>
			<el-row>
				<el-col :span='10'>
					<div style='line-height: 32px'>部门信息</div>
				</el-col>
				<el-col :span='14' style='text-align: right'>
					<el-button type='success' @click='tabSave({formRef,state,proxy,route})' plain>保 存</el-button>
					<el-button type='info' plain>复 制</el-button>
					<el-button type='info' @click='tabClose({proxy,route})' plain>关 闭</el-button>
				</el-col>
			</el-row>
		</template>
		<div style='margin-top: 8px;margin-bottom: 8px'>
			<el-form ref='formRef' class='zform' :model='form' label-width='140px'>
				<el-tabs type='card' v-model='activeName'>
					<el-tab-pane label='基本信息' name='tab1'>
						<el-row style='border-top: 1px solid #d2d2d2;'>
							<el-col :span='12'>
								<el-form-item label='部门名称：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]">
									<div class='zinput'>
										<el-input v-model='form.name'></el-input>
									</div>
								</el-form-item>
							</el-col>
							<el-col :span='12'>
								<el-form-item label='上级部门：'>
									<div class='zinput'>
										<el-input v-model='form.pname' @click='openOrgModal' readonly :suffix-icon='Search'></el-input>
									</div>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span='12'>
								<el-form-item label='部门类型：'>
									<div class='zinput'>
										<el-select v-model='form.type' style='width: 100%'>
											<el-option :value='1' label='机构'></el-option>
											<el-option :value='2' label='部门'></el-option>
										</el-select>
									</div>
								</el-form-item>
							</el-col>
							<el-col :span='6'>
								<el-form-item label='排序号：'>
									<div class='zinput'>
										<el-input-number v-model='form.ornum' controls-position='right' style='width: 100%' />
									</div>
								</el-form-item>
							</el-col>
							<el-col :span='6'>
								<el-form-item label='是否可用：'>
									<div class='zinput'>
										<el-switch v-model='form.avtag'>
										</el-switch>
									</div>
								</el-form-item>
							</el-col>
						</el-row>
					</el-tab-pane>
					<el-tab-pane label='其他信息' name='tab3'>
						<el-row style='border-top: 1px solid #d2d2d2;'>
							<el-col :span='24'>
								<el-form-item label='备注：'>
									<div class='zinput' style='height: auto'>
										<el-input style="font-family: 'Courier New', Helvetica, Arial, sans-serif; font-size:16px"
															type='textarea' :rows='4' v-model='form.notes'>
										</el-input>
									</div>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row v-show='form.crtim'>
							<el-col :span='12'>
								<el-form-item label='创建时间：'>
									<div class='zinput'>
										{{ form.crtim }}
									</div>
								</el-form-item>
							</el-col>
							<el-col :span='12'>
								<el-form-item label='更新时间：'>
									<div class='zinput'>
										{{ form.uptim }}
									</div>
								</el-form-item>
							</el-col>
						</el-row>
					</el-tab-pane>
				</el-tabs>
			</el-form>
		</div>
		<OrgModal ref='orgModal' @close='closeOrgModal' />
	</el-card>
</template>
<script lang='ts'>
export default { name: 'SysOrgDeptEdit' };
</script>
<script lang='ts' setup>
import { Search } from '@element-plus/icons-vue';
import { getCurrentInstance, onMounted, reactive, ref, toRefs } from 'vue';
import { editInit, tabSave, tabClose } from '/@/comps/page/edit';
import { useRoute } from 'vue-router';
import OrgModal from '/@/comps/sys/OrgModal.vue';
import { FormInstance } from 'element-plus';

const route = useRoute();
const formRef = ref<FormInstance>();
const { proxy } = getCurrentInstance() as any;
const activeName = ref('tab1');

const state = reactive({
	url: '/sys/org/dept',
	params: { path: '', query: {} as any },
	form: { avtag: true, type: 2 } as any,
});

const { form } = toRefs(state);


onMounted(async () => {
	state.params = <any>route;
	let pid = state.params.query?.pid;
	let pname = state.params.query?.pname;
	if (pid) {
		form.value.parent = { id: pid, name: pname };
		form.value.pname = pname;
		form.value.pid = pid;
	}
	await editInit({state, route});
	if (form.value.parent) {
		form.value.pname = form.value.parent.name;
	}
});


//region a 部门选择逻辑
const orgModal = ref();

const openOrgModal = () => {
	orgModal.value.openModal({
		orgType: 3,
	});
};

const closeOrgModal = (data: any) => {
	if (data.orgs && data.orgs.length > 0) {
		form.value.parent = { id: data.orgs[0].id, name: data.orgs[0].name };
		form.value.pname = data.orgs[0].name;
		form.value.pid = data.orgs[0].id;
	}
};
//endregion


</script>

<style scoped>

</style>
