<template>
	<el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
		<template #header>
			<div class='zjustify'>
				<div>
					<div style='line-height: 32px'>角色信息</div>
				</div>
				<div>
					<el-button type='success' @click='save' plain>保 存</el-button>
					<el-button type='info' @click='tabClose({proxy,route})' plain>关 闭</el-button>
				</div>
			</div>
		</template>
		<div style='margin-top: 8px;margin-bottom: 8px'>
			<el-form ref='formRef' :inline='true' class='zform' :model='form' label-width='140px'>
				<el-tabs type='card' v-model='activeName'>
					<el-tab-pane label='基本信息' name='tab1'>
						<div class='zform-div'>
							<el-form-item label='角色名称：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]">
								<el-input v-model='form.name' />
							</el-form-item>
							<el-form-item label='所属门户：' prop='porid' :rules="[{ required: true, message: '门户不能为空'}]">
								<el-select v-model='form.porid' placeholder='请选择门户' @change='portalChange' style='width: 100%'>
									<el-option
										v-for='item in portals'
										:key='item.id'
										:label='item.name'
										:value='item.id'
									/>
								</el-select>
							</el-form-item>
							<el-form-item label='指派用户：' prop='orgs' :rules="[{ required: true, message: '用户不能为空'}]" style='width: 100%'>
								<el-input type='textarea' placeholder='这里可以选择用户，部门，岗位，群组或者外部协同公司与用户。权限都会生效' :rows='4' v-model='orgsName' readonly @click='openOrgsModal' />
							</el-form-item>
							<el-form-item label='排序号：'>
								<el-input-number v-model='form.ornum' controls-position='right' style='width: 100%' />
							</el-form-item>
							<el-form-item label='是否可用：'>
								<el-switch v-model='form.avtag' />
							</el-form-item>
							<el-form-item label='备注：' style='width: 100%'>
								<el-input type='textarea' :rows='4' v-model='form.notes' />
							</el-form-item>
							<div v-show='form.crtim'>
								<el-form-item label='创建人：' style='width: 25%'>
									<div class='zinput'> {{ form.crman ? form.crman.name : '' }}</div>
								</el-form-item>
								<el-form-item label='创建时间：' style='width: 25%'>
									<div class='zinput'> {{ form.crtim }}</div>
								</el-form-item>
								<el-form-item label='更新人：' style='width: 25%'>
									<div class='zinput'> {{ form.upman ? form.upman.name : '' }}</div>
								</el-form-item>
								<el-form-item label='更新时间：' style='width: 25%'>
									<div class='zinput'> {{ form.uptim }}</div>
								</el-form-item>
							</div>
						</div>
					</el-tab-pane>
					<el-tab-pane label='菜单分配' name='tab3'>
						<div style='margin-bottom: 10px'>
							<el-button @click='expandAll' plain>展 开</el-button>
							<el-button @click='collapseAll' plain>折 叠</el-button>
						</div>
						<div style='border: 1px solid #eee'>
							<el-tree ref='treeRef' :data='treeData' show-checkbox node-key='id' :props="{children: 'children',label: 'name'}" />
						</div>
					</el-tab-pane>
				</el-tabs>
			</el-form>
		</div>
		<OrgModal ref='orgModal' @close='closeOrgModal' />
	</el-card>
</template>
<script lang='ts'>
export default { name: 'SysPortalRoleEdit' };
</script>
<script lang='ts' setup>
import { computed, getCurrentInstance, onMounted, reactive, ref, toRaw, toRefs } from 'vue';
import { tabSave, tabClose } from '/@/comps/page/edit';
import { useRoute } from 'vue-router';
import OrgModal from '/@/comps/sys/OrgModal.vue';
import request from '/@/utils/request';
import { FormInstance } from 'element-plus';

const route = useRoute();
const formRef = ref<FormInstance>();
const { proxy } = getCurrentInstance() as any;
const activeName = ref('tab1');

const state = reactive({
	url: '/sys/portal/role',
	params: { path: '', query: '' },
	form: { avtag: true, menus: [] } as any,
	treeData: [] as any,
	portals: [] as any,
});

const { form, treeData, portals } = toRefs(state);

onMounted(async () => {
	await portalsInit();
	state.params = <any>route;
	let id = state.params.query?.id;
	if (id) {
		state.form = await request({
			url: state.url + '/one/' + id,
			method: 'get',
		});
		await treeDataInit();
	}
});

const portalsInit = async () => {
	portals.value = await request({
		url: '/sys/portal/main/list',
		method: 'get',
	});
};

const portalChange = async () => {
	await treeDataInit();
};


//region -----d 展开折叠逻辑-----
const expandAll = () => {
	for (let i = 0; i < treeRef.value!.store._getAllNodes().length; i++) {
		treeRef.value!.store._getAllNodes()[i].expanded = true;
	}
};

const collapseAll = () => {
	for (let i = 0; i < treeRef.value!.store._getAllNodes().length; i++) {
		treeRef.value!.store._getAllNodes()[i].expanded = false;
	}
};
//


//region -----c 保存逻辑-----
const treeRef = ref();
const save = async () => {
	const nodes = treeRef.value.getCheckedNodes();
	const menus = [];
	for (const node of nodes) {
		if(node.type) {
			menus.push({ id: node.id, name: node.name });
		}
	}
	form.value.menus = menus;
	await tabSave({ formRef: formRef.value, state, proxy, route, flush: state.url });
};
//endregion


//region -----a 指派成员逻辑-----
const orgModal = ref();

const openOrgsModal = () => {
	orgModal.value.openModal({
		orgType: 31,
		coopType: 7,
		selectMode: 2,
		orgs: toRaw(form.value.orgs),
	});
};

const closeOrgModal = (data: any) => {
	form.value.orgs = data.orgs;
};

const orgsName = computed(() => {
	let names = '';
	if (form.value.orgs && form.value.orgs.length > 0) {
		for (const user of form.value.orgs) {
			names += user.name + '；';
		}
	}
	return names;
});
//endregion

//region -----b 菜单分配逻辑-----
async function treeDataInit() {
	treeData.value = await request({ url: '/sys/portal/menu/tree?porid=' + form.value.porid, method: 'get' });
	const menus = [];
	for (const menu of form.value.menus) {
		menus.push(menu.id);
	}
	treeRef.value.setCheckedKeys(menus);
}

//endregion


</script>

<style scoped>

</style>
