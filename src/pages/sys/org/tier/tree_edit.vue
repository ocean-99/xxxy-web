<template>
	<el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
		<template #header>
			<el-row>
				<el-col :span='10'>
					<div style='line-height: 32px'>层级树编辑</div>
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
							<el-form-item label='层级树名称：' prop='name' style='width:100%' :rules="[{ required: true, message: '名称不能为空'}]">
								<el-input v-model='form.name' />
							</el-form-item>
							<el-form-item label='层级角色：' style='width: 100%'>
								<el-table size='small' border :data='form.roles' :row-style="{height: '36px'}" style='width: 100%'>
									<el-table-column label='排序号' width='90'>
										<template #default='scope'>
											<el-input-number v-model='scope.row.ornum' controls-position='right' style='width: 100%' />
										</template>
									</el-table-column>
									<el-table-column label='角色名称' width='200'>
										<template #default='scope'>
											<el-input v-model='scope.row.name' required></el-input>
										</template>
									</el-table-column>
									<el-table-column label='是否有效' width='180'>
										<template #default='scope'>
											<el-input v-model='scope.row.avtag'></el-input>
										</template>
									</el-table-column>
									<el-table-column label='角色描述'>
										<template #default='scope'>
											<el-input v-model='scope.row.notes' required></el-input>
										</template>
									</el-table-column>
									<el-table-column fixed='right' label='操作' width='50' align='center'>
										<template #header>
											<el-icon :size='22' style='top: 5px;cursor: pointer' color='#666'>
												<ele-CirclePlus @click='addItem' />
											</el-icon>
										</template>
										<template #default='scope'>
											<el-icon :size='22' style='top: 3px;cursor: pointer'>
												<ele-CircleClose @click='form.roles.splice(scope.$index, 1)' />
											</el-icon>
										</template>
									</el-table-column>
								</el-table>
							</el-form-item>
						</div>
					</el-tab-pane>
					<el-tab-pane label='其他信息' name='tab9'>
						<div class='yform-div'>
							<el-form-item label='备注：' style='width: 100%'>
								<el-input type='textarea' :rows='4' v-model='form.notes' />
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
		<Amap ref='amapRef' @close='closeAmap' />
	</el-card>
</template>
<script lang='ts'>
export default { name: 'SysOrgTierEdit}' };
</script>
<script lang='ts' setup>
import { getCurrentInstance, onMounted, reactive, ref, toRefs } from 'vue';
import { editInit, tabSave, tabClose } from '/@/comps/page/edit';
import { useRoute } from 'vue-router';
import {  FormInstance } from 'element-plus';
import { uuid } from '/@/utils/xutil';

const route = useRoute();
const formRef = ref<FormInstance>();
const { proxy } = getCurrentInstance() as any;
const activeName = ref('tab1');

const state = reactive({
	url: '/sys/org/ttree', cates: [] as any,
	params: { path: '', query: '' },
	form: { avtag: true, roles: [] as any, }
});

const { form } = toRefs(state);

onMounted(async () => {
	await editInit({ state, route });
});


//region -----层级角色逻辑-----
const addItem = () => {
	let newOrnum = 1;
	if (form.value.roles.length > 0) {
		newOrnum = form.value.roles[form.value.roles.length - 1].ornum + 1;
	}
	if (form.value.id) {
		form.value.roles.push({
			id: uuid(), tieid: form.value.id, ornum: newOrnum,
		});
	} else {
		form.value.roles.push({
			id: uuid(), ornum: newOrnum,
		});
	}
};
//endregiton


</script>
