<template>
	<el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
		<template #header>
			<div class='zjustify'>
				<div>
					<div style='line-height: 32px'>用户信息</div>
				</div>
				<div>
					<el-button type='success' @click='tabSave({formRef,state,proxy,route,flush:state.url})' plain>保 存</el-button>
					<el-button type='info' plain>复 制</el-button>
					<el-button type='info' @click='tabClose({proxy,route})' plain>关 闭</el-button>
				</div>
			</div>
		</template>
		<div style='margin-top: 8px;margin-bottom: 8px'>
			<el-form ref='formRef' :inline='true' class='zform zform25' :model='form' label-width='140px'>
				<el-tabs type='card' v-model='activeName'>
					<el-tab-pane label='基本信息' name='tab1'>
						<div class='zform-div'>
							<el-form-item label='姓名：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]">
								<el-input v-model='form.name' />
							</el-form-item>
							<el-form-item label='昵称：'>
								<el-input v-model='form.ninam' />
							</el-form-item>
							<el-form-item label='登录名：' prop='usnam' :rules="[{ required: true, message: '登录名不能为空'}]">
								<el-input v-model='form.usnam' />
							</el-form-item>
							<el-form-item label='密码：' prop='pacod' :rules="[{ required: true, message: '密码不能为空'}]">
								<el-input type='password' v-model='form.pacod' show-password />
							</el-form-item>
							<el-form-item label='所属部门：' prop='depna' :rules="[{ required: true, message: '所属部门不能为空'}]" style='width: 50%'>
								<el-input v-model='form.depna' @click='openOrgModal' readonly :suffix-icon='Search' />
							</el-form-item>
							<el-form-item label='排序号：'>
								<el-input-number v-model='form.ornum' controls-position='right' style='width: 100%' />
							</el-form-item>
							<el-form-item label='是否可用：'>
								<el-switch v-model='form.avtag' />
							</el-form-item>
							<el-form-item label='职务：' style='width: 50%'>
								<el-input v-model='form.job' />
							</el-form-item>
							<el-form-item label='手机号：'>
								<el-input v-model='form.monum' />
							</el-form-item>
							<el-form-item label='email：'>
								<el-input v-model='form.email' />
							</el-form-item>
						</div>
					</el-tab-pane>
					<el-tab-pane label='其他信息' name='tab9'>
						<div class='zform-div'>
							<el-form-item label='备注：' style='width: 100%'>
								<el-input type='textarea' :rows='4' v-model='form.notes' />
							</el-form-item>
							<el-form-item label='创建时间：' style='width: 50%'>
								{{ form.crtim ? form.crtim : '#' }}
							</el-form-item>
							<el-form-item label='更新时间：' style='width: 50%'>
								{{ form.uptim ? form.uptim : '#' }}
							</el-form-item>
						</div>
					</el-tab-pane>
				</el-tabs>
			</el-form>
		</div>
		<OrgModal ref='orgModal' @close='closeOrgModal' />
	</el-card>
</template>
<script lang='ts'>
export default { name: 'SysOrgUserEdit' };
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
	url: '/sys/org/user',
	params: { path: '', query: {} as any },
	form: { avtag: true } as any,
});

const { form } = toRefs(state);


onMounted(async () => {
	state.params = <any>route;
	const depid = state.params.query?.depid;
	const depna = state.params.query?.depna;
	if (depid) {
		form.value.dept = { id: depid, name: depna };
		form.value.depid = depid;
		form.value.depna = depna;
	}
	await editInit({ state, route });
	if (form.value.dept) {
		form.value.depna = form.value.dept.name;
	}
});


//region a 部门选择逻辑
const orgModal = ref();

const openOrgModal = () => {
	orgModal.value.openModal({ orgType: 3 });
};

const closeOrgModal = (data: any) => {
	if (data.orgs && data.orgs.length > 0) {
		form.value.dept = { id: data.orgs[0].id, name: data.orgs[0].name };
		form.value.depna = data.orgs[0].name;
		form.value.depid = data.orgs[0].id;
	}
};
//endregion
</script>
