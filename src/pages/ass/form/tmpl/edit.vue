<template>
	<el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
		<template #header>
			<div class='zjustify'>
				<div>
					<div style='line-height: 32px'>表单模板</div>
				</div>
				<div>
					<el-button type='success' @click='save' plain>保 存</el-button>
					<el-button type='info' plain>复 制</el-button>
					<el-button type='info' @click='tabClose({proxy,route})' plain>关 闭</el-button>
				</div>
			</div>
		</template>
		<div style='margin-top: 8px;margin-bottom: 8px'>
			<el-form ref='formRef' :model='form' label-width='140px'>
				<el-tabs type='border-card' v-model='activeName'>
					<el-tab-pane label='基本信息' name='tab1' class='zform el-form--inline'>
						<div class='zform-div'>
							<el-form-item label='模板名称：' prop='name' style='width:100%' :rules="[{ required: true, message: '名称不能为空'}]">
								<el-input v-model='form.name'></el-input>
							</el-form-item>
							<el-form-item label='排序号：' prop='ornum' :rules="[{ required: true, message: '排序号不能为空'}]">
								<el-input-number v-model='form.ornum' controls-position='right' style='width: 100%' />
							</el-form-item>
							<el-form-item label='是否可用：'>
								<el-switch v-model='form.avtag'>
								</el-switch>
							</el-form-item>
							<el-form-item label='备注：' style='width: 100%'>
								<el-input type='textarea' :rows='4' v-model='form.notes' />
							</el-form-item>
							<el-form-item label='创建人：' style='width: 25%'>
								<div class='zinput'>{{ form.crman ? form.crman.name : '' }}</div>
							</el-form-item>
							<el-form-item label='创建时间：' style='width: 25%'>
								<div class='zinput'> {{ form.crtim }}</div>
							</el-form-item>
							<el-form-item label='更新人：' style='width: 25%'>
								<div class='zinput'>{{ form.upman ? form.upman.name : '' }}</div>
							</el-form-item>
							<el-form-item label='更新时间：' style='width: 25%'>
								<div class='zinput'> {{ form.uptim }}</div>
							</el-form-item>
						</div>
					</el-tab-pane>

					<el-tab-pane label='表单字段' name='tab2' class='zform el-form--inline'>
						<div class='zjustify' style='margin-bottom: 10px;'>
							<div>
								<el-select v-model='state.xtab' filterable clearable placeholder='页签名称' style='width: 130px;margin-right: 6px' @change='tabChange'>
									<el-option v-for='item in state.form.tabs' :key='item.name' :value='item.name' :label='item.label'></el-option>
								</el-select>
								<el-icon style='font-size: 18px;margin-right: 6px;top:4px;cursor: pointer' @click='openTabEdit'>
									<Setting />
								</el-icon>
								<el-button type='primary' @click='addField(-1)' plain>新 增</el-button>
								<el-button type='primary' @click='upField' plain>上 移</el-button>
								<el-button type='primary' @click='downField' plain>下 移</el-button>
								<el-button type='primary' @click='delFields' plain>删 除</el-button>
							</div>
							<div>
							</div>
						</div>

						<vxe-table border ref='fieldTableRef' show-overflow='false' :data='form.tabs[state.xindex].fields' :column-config='{resizable: true}' :sortConfig='{remote:false}' :edit-config="{trigger: 'click', mode: 'cell'}">
							<vxe-column type='checkbox' width='40' />
							<vxe-column field='ornum' width='50' sort-type='number' title='#' sortable />
							<vxe-column field='name' width='100' title='字段名称' :edit-render="{autofocus: '.vxe-input--inner'}">
								<template #edit='{ row }'>
									<vxe-select v-model='row.name' transfer filterable @change='fieldChange(row)'>
										<vxe-option v-for='item in state.fields' :key='item.id' :value='item.id' :label='item.id' />
									</vxe-select>
								</template>
							</vxe-column>
							<vxe-column field='label' width='150' title='字段标题'>
								<template #default='{ row }'>
									<vxe-input v-model='row.label' />
								</template>
							</vxe-column>
							<vxe-column field='type' width='150' title='字段类型'>
								<template #default='{ row }'>
									<vxe-select v-model='row.type' :disabled='isDisabled(row.name)' transfer>
										<vxe-option :value="'input1'" :label="'单行输入框'" />
										<vxe-option :value="'input2'" :label="'数字输入框'" />
										<vxe-option :value="'textarea'" :label="'多行输入框'" />
										<vxe-option :value="'select1'" :label="'普通下拉框'" />
										<vxe-option :value="'select2'" :label="'树状下拉框'" />
										<vxe-option :value="'radio'" :label="'单选框'" />
										<vxe-option :value="'checkbox'" :label="'多选框'" />
										<vxe-option :value="'switch'" :label="'开关'" />
										<vxe-option :value="'popup1'" :label="'弹框1'" />
										<vxe-option :value="'popup2'" :label="'弹框2'" />
										<vxe-option :value="'popup3'" :label="'弹框3'" />
										<vxe-option :value="'readonly1'" :label="'只读字段1'" />
										<vxe-option :value="'readonly2'" :label="'只读字段2'" />
										<vxe-option :value="'senum'" :label="'流水号'" />
										<vxe-option :value="'att'" :label="'附件'" />
										<vxe-option :value="'special'" :label="'特殊类型'" />
									</vxe-select>
								</template>
							</vxe-column>
							<vxe-column field='info' width='150' title='辅助信息'>
								<template #default='{ row }'>
									<vxe-input v-model='row.info' :disabled='isDisabled(row.name)' />
								</template>
							</vxe-column>
							<vxe-column field='width' width='90' title='字段宽度'>
								<template #default='{ row }'>
									<vxe-select v-model='row.width' transfer>
										<vxe-option :value="'100%'" :label="'100%'" />
										<vxe-option :value="'50%'" :label="'50%'" />
										<vxe-option :value="'25%'" :label="'25%'" />
									</vxe-select>
								</template>
							</vxe-column>
							<vxe-column field='retag' width='50' title='必填' header-align='center' align='center'>
								<template #default='{ row }'>
									<vxe-checkbox v-model='row.retag' />
								</template>
							</vxe-column>
							<vxe-column field='shtag' width='50' title='显示' header-align='center' align='center'>
								<template #default='{ row }'>
									<vxe-checkbox v-model='row.shtag' />
								</template>
							</vxe-column>
							<vxe-column field='ditag' width='50' title='只读' header-align='center' align='center'>
								<template #default='{ row }'>
									<vxe-checkbox v-model='row.ditag' />
								</template>
							</vxe-column>
							<vxe-column field='notes' title='备注' :edit-render='{}'>
								<template #edit='{ row }'>
									<vxe-input v-model='row.notes' />
								</template>
							</vxe-column>
						</vxe-table>
					</el-tab-pane>

					<el-tab-pane label='表单联动' name='tab3' class='zform el-form--inline'>
						<vxe-toolbar style='margin-top: 0;padding-top: 0'>
							<template #buttons>
								<vxe-button @click='addLink(-1)'>新增</vxe-button>
								<vxe-button @click='delLinks'>删除选中</vxe-button>
							</template>
						</vxe-toolbar>
						<vxe-table border ref='linkTableRef' show-overflow='false' :data='form.links' :column-config='{resizable: true}' :edit-config="{trigger: 'click', mode: 'cell'}">
							<vxe-column type='checkbox' width='40' />
							<vxe-column type='seq' width='36' />
							<vxe-column field='trkey' width='100' title='触发字段' :edit-render="{autofocus: '.vxe-input--inner'}">
								<template #edit='{ row }'>
									<vxe-select v-model='row.trkey' transfer filterable>
										<vxe-option v-for='item in state.fields' :key='item.id' :value='item.id' :label='item.id' />
									</vxe-select>
								</template>
							</vxe-column>
							<vxe-column width='305' title='触发条件'>
								<template #default='{ row }'>
									<div>
										<vxe-button @click='addLeft(row)'>增加条件</vxe-button>
										<div :key='left.id' v-for='left of row.lefts' style='margin-top: 5px'>
											<vxe-select v-model='left.cokey' transfer filterable style='margin-right: 5px;width:100px;display: inline-block'>
												<vxe-option v-for='item in state.fields' :key='item.id' :value='item.id' :label='item.id' />
											</vxe-select>
											<vxe-select v-model='left.coway' transfer style='margin-right: 5px;width:46px;display: inline-block'>
												<vxe-option :value="'>'" :label="'>'"></vxe-option>
												<vxe-option :value="'>='" :label="'>='"></vxe-option>
												<vxe-option :value="'='" :label="'='"></vxe-option>
												<vxe-option :value="'<='" :label="'<='"></vxe-option>
												<vxe-option :value="'<'" :label="'<'"></vxe-option>
												<vxe-option :value="'!='" :label="'!='"></vxe-option>
												<vxe-option :value="'in'" :label="'in'"></vxe-option>
											</vxe-select>
											<vxe-input v-model='left.coval' type='text' placeholder=' ' style='margin-right: 5px;width:100px;display: inline-block' />
											<el-icon :size='22' style='top: 5px;cursor: pointer;display: inline-block'>
												<ele-CircleClose @click='row.lefts.splice(row.lefts.indexOf(left), 1)' />
											</el-icon>
										</div>
									</div>
								</template>
							</vxe-column>
							<vxe-column title='→' width='36'>
								<template #default>
									<span>→</span>
								</template>
							</vxe-column>
							<vxe-column width='505' title='影响字段'>
								<template #default='{ row }'>
									<div>
										<vxe-button @click='addRight(row)'>增加影响</vxe-button>
										<div :key='right.id' v-for='right of row.rights' style='margin-top: 5px'>
											<vxe-select v-model='right.efkey' transfer filterable style='margin-right: 5px;width:120px;display: inline-block'>
												<vxe-option v-for='item in state.fields' :key='item.id' :value='item.id' :label='item.id' />
											</vxe-select>
											<vxe-select v-model='right.efway' transfer style='margin-right: 5px;width:76px;display: inline-block'>
												<vxe-option :value="'e1'" :label="'值改变'"></vxe-option>
												<vxe-option :value="'e2'" :label="'可选项'"></vxe-option>
												<vxe-option :value="'e3'" :label="'必填？'"></vxe-option>
												<vxe-option :value="'e4'" :label="'显示？'"></vxe-option>
												<vxe-option :value="'e5'" :label="'只读？'"></vxe-option>
											</vxe-select>
											<vxe-input v-model='right.efval' type='text' placeholder=' ' style='margin-right: 5px;width:250px;display: inline-block' />
											<el-icon :size='22' style='top: 5px;cursor: pointer;display: inline-block'>
												<ele-CircleClose @click='row.rights.splice(row.rights.indexOf(right), 1)' />
											</el-icon>
										</div>
									</div>
								</template>
							</vxe-column>
							<vxe-column field='notes' title='备注' :edit-render='{}'>
								<template #edit='{ row }'>
									<vxe-textarea v-model='row.notes' />
								</template>
							</vxe-column>
						</vxe-table>
					</el-tab-pane>
				</el-tabs>
			</el-form>
		</div>
		<TabEdit ref='tabRef' @close='closeTabEdit' />
	</el-card>
</template>
<script lang='ts'>
export default { name: 'AssFormTmplEdit' };
</script>
<script lang='ts' setup>
import { Setting } from '@element-plus/icons-vue';
import { getCurrentInstance, onMounted, reactive, ref, toRefs } from 'vue';
import { tabSave, tabClose } from '/@/comps/page/edit';
import { useRoute } from 'vue-router';
import request from '/@/utils/request';
import { ElMessage, FormInstance } from 'element-plus';
import { uuid } from '/@/utils/xutil';
import TabEdit from './tab.vue';
import { VxeTableInstance } from 'vxe-table';


const route = useRoute();
const formRef = ref<FormInstance>();
const { proxy } = getCurrentInstance() as any;
const activeName = ref('tab1');

const state = reactive({
	url: '/ass/form/tmpl', fieldSelectedIds: [] as any,
	params: { path: '', query: '' }, xtab: '' as any, xindex: 0 as any,
	form: {
		avtag: true, fields: [] as any,links: [],
		tabs: [{ ornum: 1, label: '基本信息', name: 'tab1', fields: [] }, { ornum: 2, label: '其他信息', name: 'tab2', fields: [] }] as any,
	} as any,
	fields: [
		{ id: 'id', name: 'ID', width: '50%' },
		{ id: 'name', name: '渠道商名称', width: '50%', type: 'input1' },
		{ id: 'avtag', name: '是否可用', width: '50%', type: 'switch' },
		{ id: 'crman', name: '创建人', width: '50%', type: 'readonly2', info: 'name' },
		{ id: 'crtim', name: '创建时间', width: '50%', type: 'readonly1' },
		{ id: 'upman', name: '更新人', width: '50%', type: 'readonly2', info: 'name' },
		{ id: 'uptim', name: '更新时间', width: '50%', type: 'readonly1' },
		{ id: 'notes', name: '备注', width: '100%', type: 'textarea' },
		{ id: 'addre', name: '渠道商地址', width: '100%', type: 'popup1' },
		{ id: 'grade', name: '渠道商资质', width: '100%', type: 'select1', info: 'grades' },
		{ id: 'catid', name: '渠道商分类', width: '100%', type: 'select2', info: 'cates' },
		{ id: 'braid', name: '分支机构', width: '50%', type: 'select2', info: 'branchs' },
		{ id: 'opman', name: '经办人', width: '50%', type: 'popup2' },
		{ id: 'senum', name: '流水号', width: '50%', type: 'senum' },
		{ id: 'vimen', name: '可查看者', width: '50%', type: 'popup3' },
		{ id: 'edmen', name: '可编辑者', width: '50%', type: 'popup3' },
		{ id: 'atts', name: '附件', width: '100%', type: 'att' },
		{ id: 'items', name: '行项目明细', width: '100%', type: 'special' },
		{ id: 'key1', name: '自定义1', width: '50%', type: '' },
		{ id: 'key2', name: '自定义2', width: '50%', type: '' },
		{ id: 'key3', name: '自定义3', width: '50%', type: '' },
	] as any,
});

const { form } = toRefs(state);

onMounted(async () => {
	await editInitx();
});

const editInitx = async () => {
	state.params = <any>route;
	let id = state.params.query?.id;
	if (id) {
		state.form = await request({
			url: state.url + '/one/' + id,
			method: 'get',
		});
		state.form.tabs = JSON.parse(state.form.tjson);
		state.form.links = JSON.parse(state.form.ljson);
		state.xtab = state.form.tabs[0].name;
		tabChange();
	} else {
		let type = state.params.query?.type;
		if (type) {
			state.form.type = type;
		}
		state.form.avtag = true;
		state.xtab = 'tab1';
		tabChange();
	}
};

//------------表单字段开始--------------------------------
const fieldTableRef = ref<VxeTableInstance>() as any;

const tabRef = ref() as any;
const openTabEdit = () => {
	tabRef.value.openModal({ tabs: state.form.tabs });
};
const closeTabEdit = (tabs: any) => {
	state.form.tabs = tabs;
};
const tabChange = () => {
	for (let i = 0; i < state.form.tabs.length; i++) {
		if (state.form.tabs[i].name == state.xtab) {
			state.xindex = i;
			break;
		}
	}
	// fieldTableRef.value.reloadData(state.form.tabs[state.xindex].fields);
};

const addField = async (row: any) => {
	const uid = uuid();
	const $table = fieldTableRef.value as any;
	const record = { tabid: state.xtab, id: uid, ornum: form.value.tabs[state.xindex].fields.length + 1 };

	const { row: newRow } = await $table.insertAt(record, row);
	form.value.tabs[state.xindex].fields.push(newRow);
	// fieldTableRef.value.reloadData(state.form.tabs[state.xindex].fields);
	await $table.setEditCell(newRow, 'name');
};

const fieldChange = (row: any) => {
	for (const field of state.fields) {
		if (field.id == row.name) {
			row.label = field.name;
			row.type = field.type;
			row.info = field.info;
			row.shtag = true;
			break;
		}
	}
};


const upField = () => {
	const $table = fieldTableRef.value;
	const selectRecords = $table.getCheckboxRecords();
	if (selectRecords.length <= 0) {
		ElMessage.warning('请选择后再进行操作');
		return;
	}

	for (let i = 0; i <= form.value.tabs[state.xindex].fields.length - 1; i++) {
		for (let j = 0; j < selectRecords.length; j++) {
			if (selectRecords[j].id == form.value.tabs[state.xindex].fields[i].id) {
				if (i == 0) {
					ElMessage.warning('已经是第一项');
					return;
				} else {
					let swap = form.value.tabs[state.xindex].fields[i - 1];
					form.value.tabs[state.xindex].fields[i - 1] = form.value.tabs[state.xindex].fields[i];
					form.value.tabs[state.xindex].fields[i - 1].ornum--;
					form.value.tabs[state.xindex].fields[i] = swap;
					form.value.tabs[state.xindex].fields[i].ornum++;
				}
				break;
			}
		}
	}

	fieldTableRef.value.sort({ field: 'ornum', order: 'asc' });
};

const downField = () => {
	const $table = fieldTableRef.value;
	const selectRecords = $table.getCheckboxRecords();
	if (selectRecords.length <= 0) {
		ElMessage.warning('请选择后再进行操作');
		return;
	}

	for (let i = form.value.tabs[state.xindex].fields.length - 1; i >= 0; i--) {
		for (let j = selectRecords.length - 1; j >= 0; j--) {
			if (selectRecords[j].id == form.value.tabs[state.xindex].fields[i].id) {
				if (i == form.value.tabs[state.xindex].fields.length - 1) {
					ElMessage.warning('已经是最后一项');
					return;
				} else {
					let swap = form.value.tabs[state.xindex].fields[i + 1];
					form.value.tabs[state.xindex].fields[i + 1] = form.value.tabs[state.xindex].fields[i];
					form.value.tabs[state.xindex].fields[i + 1].ornum++;
					form.value.tabs[state.xindex].fields[i] = swap;
					form.value.tabs[state.xindex].fields[i].ornum--;
				}
				break;
			}
		}
	}

	fieldTableRef.value.sort({ field: 'ornum', order: 'asc' });
};

const delFields = async (row: any, left: any) => {
	// row.lefts.splice(row.lefts.indexOf(left), 1)
	// $refs.fieldTableRef.removeCheckboxRow()
	const $table = fieldTableRef.value;
	const selectRecords = $table.getCheckboxRecords();
	for (const tab of state.form.tabs) {
		// console.log(tab);
		// console.log(state.xtab);
		if (tab.name == state.xtab) {
			for (let index = tab.fields.length - 1; index >= 0; index--) {
				for (let i = 0; i < selectRecords.length; i++) {
					if (selectRecords[i].id == tab.fields[index].id) {
						tab.fields.splice(index, 1);
						break;
					}
				}
			}
			for (let i = 0; i < tab.fields.length; i++) {
				tab.fields[i].ornum = i + 1;
			}
			$table.reloadData(tab.fields);
			await $table.removeCheckboxRow();
		}
	}
};


const isDisabled = (name: string) => {
	if ((!name) || name.startsWith('key')) {
		return false;
	} else {
		return true;
	}
};


//------------表单联动开始--------------------------------
const linkTableRef = ref<VxeTableInstance>() as any;

const addLink = async (row: any) => {
	const uid = uuid();
	const $table = linkTableRef.value as any;
	const record = { id: uid, ornum: form.value.links.length + 1, lefts: [], rights: [] };
	const { row: newRow } = await $table.insertAt(record, row);
	form.value.links.push(newRow);
	// fieldTableRef.value.reloadData(state.form.tabs[state.xindex].fields);
	await $table.setEditCell(newRow, 'trkey');
};

const delLinks = async () => {
	const $table = linkTableRef.value;
	const selectRecords = $table.getCheckboxRecords();

	for (let index = form.value.links.length - 1; index >= 0; index--) {
		for (let i = 0; i < selectRecords.length; i++) {
			if (selectRecords[i].id == form.value.links[index].id) {
				form.value.links.splice(index, 1);
				break;
			}
		}
	}
	for (let i = 0; i < form.value.links.length; i++) {
		form.value.links[i].ornum = i + 1;
	}
	$table.reloadData(form.value.links);
	// await $table.removeCheckboxRow();
};

const addLeft = (row: any) => {
	let newOrnum = 1;
	if (row.lefts.length > 0) {
		newOrnum = row.lefts[row.lefts.length - 1].ornum + 1;
	}
	row.lefts.push({ id: uuid(), ornum: newOrnum });
};

const addRight = (row: any) => {
	let newOrnum = 1;
	if (row.rights.length > 0) {
		newOrnum = row.rights[row.rights.length - 1].ornum + 1;
	}
	row.rights.push({ id: uuid(), ornum: newOrnum });
};
//------------表单联动结束--------------------------------

const save = async () => {
	// form.value.fjson = JSON.stringify(form.value.fields);
	form.value.tjson = JSON.stringify(form.value.tabs);
	form.value.ljson = JSON.stringify(form.value.links);
	await tabSave({ formRef: formRef.value, state, proxy, route, iouField: 'crtim' });
};
</script>
