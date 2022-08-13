<template>
	<el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
		<template #header>
			<el-row>
				<el-col :span='10'>
					<div style='line-height: 32px'>模块编辑</div>
				</el-col>
				<el-col :span='14' style='text-align: right'>
					<el-button type='success' @click='tabSave({formRef,state,proxy,route})' plain>保 存</el-button>
					<el-button type='info' @click='tabClose({proxy,route})' plain>关 闭</el-button>
				</el-col>
			</el-row>
		</template>
		<div style='margin-top: 8px;margin-bottom: 8px'>
			<el-form ref='formRef' :inline='true' class='yform' :model='form' label-width='140px'>
				<el-tabs type='card' v-model='activeName'>
					<el-tab-pane label='基本信息' name='tab1'>
						<div class='yform-div'>
							<el-form-item label='模块名称：' prop='name' style='width:50%' :rules="[{ required: true, message: '名称不能为空'}]">
								<el-input v-model='form.name' />
							</el-form-item>
							<el-form-item label='排序号：' style='width: 25%' prop='ornum' :rules="[{ required: true, message: '排序号不能为空'}]">
								<el-input-number v-model='form.ornum' controls-position='right' style='width: 100%'/>
							</el-form-item>
							<el-form-item label='是否可用：' style='width: 25%'>
								<el-switch v-model='form.avtag'>
								</el-switch>
							</el-form-item>
							<el-form-item label='备注：' style='width: 100%'>
								<el-input type='textarea' :rows='4' v-model='form.notes' />
							</el-form-item>
						</div>
					</el-tab-pane>
					<el-tab-pane label='权限信息' name='tab9'>
						<div class='yform-div'>
							<el-form-item label='可使用者：' style='width: 100%'>
								<el-input type='textarea' :rows='4' v-model='usersName' readonly @click='openUsersModal'>
								</el-input>
							</el-form-item>
							<el-form-item label='创建人：' style='width: 25%'>
								{{ form.crman ? form.crman.name : '' }}
							</el-form-item>
							<el-form-item label='创建时间：' style='width: 25%'>
								<div class='zinput'> {{ form.crtim }}</div>
							</el-form-item>
							<el-form-item label='更新人：' style='width: 25%'>
								{{ form.upman ? form.upman.name : '' }}
							</el-form-item>
							<el-form-item label='更新时间：' style='width: 25%'>
								<div class='zinput'> {{ form.uptim }}</div>
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
export default { name: 'BiGlobalModEdit}' };
</script>
<script lang='ts' setup>
import { computed, getCurrentInstance, onMounted, reactive, ref, toRaw, toRefs } from 'vue';
import { editInit, tabSave, tabClose } from '/@/comps/page/edit';
import { useRoute } from 'vue-router';
import { FormInstance } from 'element-plus';
import OrgModal from '/@/comps/sys/OrgModal.vue';

const route = useRoute();
const formRef = ref<FormInstance>();
const { proxy } = getCurrentInstance() as any;
const activeName = ref('tab1');

const state = reactive({
	url: '/bi/global/mod',
	params: { path: '', query: '' },
	form: { avtag: true } as any,
});

const { form } = toRefs(state);

onMounted(async () => {
	await editInit({ state, route });
});

//region -----组织架构逻辑-----
const orgModal = ref();

const openUsersModal = () => {
	orgModal.value.openModal({
		opener: 'users',
		orgType: 11,
		selectMode: 2,
		orgs: toRaw(form.value.viewers),
	});
};

const closeOrgModal = (data: any) => {
	if (data.opener == 'users') {
		if (data.orgs && data.orgs.length > 0) {
			form.value.users = data.orgs;
		} else {
			form.value.users = null;
		}
	}
};

const usersName = computed(() => {
	let names = '';
	if (form.value.users && form.value.users.length > 0) {
		for (const user of form.value.users) {
			names += user.name + '；';
		}
	}
	return names;
});

//endregion


//region-----业务字典-----

//endregion


</script>
