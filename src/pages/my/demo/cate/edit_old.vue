<template>
	<el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
		<template #header>
			<div class='zjustify'>
				<div>
					<div style='line-height: 32px'>DEMO分类</div>
				</div>
				<div>
					<el-button type='success' @click='save' plain>保 存</el-button>
					<el-button type='info' plain>复 制</el-button>
					<el-button type='info' @click='tabClose({proxy,route})' plain>关 闭</el-button>
				</div>
			</div>
		</template>
		<CateModal url='my/demo/cate/tree' ref='cateModal' @close='cateChoose' />
		<div style='margin-top: 8px;margin-bottom: 8px'>
			<el-form ref='formRef' :model='form' label-width='140px'>
				<el-tabs type='border-card' v-model='activeName'>

					<el-tab-pane label='基本信息' name='tab1' class='zform el-form--inline'>
						<div class='zform-div'>
							<el-form-item label='分类名称：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]">
								<el-input v-model='form.name'></el-input>
							</el-form-item>
							<el-form-item label='上级分类：'>
								<el-input :value='form.parent?.name' :suffix-icon='Search' :readonly='true' @click='openCateModal'></el-input>
							</el-form-item>
							<el-form-item label='表单模式：' style='width: 25%' prop='fomod' :rules="[{ required: true, message: '表单模式不能为空'}]">
								<el-select v-model='form.fomod' style='width: 100%' clearable>
									<el-option label='传统硬代码' value='m1' />
									<el-option label='自主可配置' value='m2' />
								</el-select>
							</el-form-item>
							<el-form-item label='是否有流程：' style='width: 25%'>
								<el-switch v-model='form.prtag' @change='prtagChange'>
								</el-switch>
							</el-form-item>
							<el-form-item label='排序号：' style='width: 25%' prop='ornum' :rules="[{ required: true, message: '排序号不能为空'}]">
								<el-input-number v-model='form.ornum' controls-position='right' style='width: 100%' />
							</el-form-item>
							<el-form-item label='是否可用：' style='width: 25%'>
								<el-switch v-model='form.avtag'>
								</el-switch>
							</el-form-item>
							<el-form-item label='备注：' style='width: 100%'>
								<el-input style="font-family: 'Courier New', Helvetica, Arial, sans-serif; font-size:16px"
													type='textarea' :rows='4' v-model='form.notes'>
								</el-input>
							</el-form-item>
							<el-form-item label='分类可使用者：' style='width: 50%'>
								<el-input type='textarea' :rows='4' v-model='cdata.usmen' placeholder='分类可使用者可使用此分类创建主数据，为空则所有人可使用' readonly @click='usmenModal'>
								</el-input>
							</el-form-item>
							<el-form-item label='数据可阅读者：' style='width: 50%'>
								<el-input type='textarea' :rows='4' v-model='cdata.remen' placeholder='数据可阅读者可默认阅读该分类下所有创建的主数据，为空则默认只有管理员可阅读' readonly @click='remenModal'>
								</el-input>
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

					<el-tab-pane label='表单字段' name='tab2' v-if='form.fomod==="m2"' class='zform el-form--inline'>
						<div class='zjustify' style='margin-bottom: 10px;'>
							<div>
								<el-select v-model='state.xtab' filterable clearable placeholder='页签名称' style='width: 130px;margin-right: 6px' @change='tabChange'>
									<el-option v-for='item in state.form.tabs' :key='item.name' :value='item.name' :label='item.label'></el-option>
								</el-select>
								<el-icon style='font-size: 18px;margin-right: 6px;top:4px;cursor: pointer' @click='openTabEdit'>
									<Setting />
								</el-icon>
								<!--                <el-input v-model='state.xname' placeholder='输入名称回车查下' clearable style='top:2px;width: 160px;margin-right: 10px' @keyup.enter='queryField'/>-->
								<!--                <el-button type='primary' @click='queryField' plain>查 询</el-button>-->
								<el-button type='primary' @click='addField(-1)' plain>新 增</el-button>
								<el-button type='primary' @click='upField' plain>上 移</el-button>
								<el-button type='primary' @click='downField' plain>下 移</el-button>
								<el-button type='primary' @click='delFields' plain>删 除</el-button>
								<!--                <el-dropdown @command='handleCommand' style='margin-left: 10px;top:1px'>-->
								<!--                  <el-button type='primary' plain>更 多</el-button>-->
								<!--                  <template #dropdown>-->
								<!--                    <el-dropdown-menu>-->
								<!--                      <el-dropdown-item command='expandAll'>测试1</el-dropdown-item>-->
								<!--                      <el-dropdown-item command='collapseAll'>测试2</el-dropdown-item>-->
								<!--                      <el-dropdown-item command='refresh'>测试3</el-dropdown-item>-->
								<!--                    </el-dropdown-menu>-->
								<!--                  </template>-->
								<!--                </el-dropdown>-->
							</div>
							<div>
								<!--                <el-button type='danger' :icon='Upload' @click='handlePinshen' plain>导 入</el-button>-->
								<!--                <el-button type='success' :icon='Upload' @click='handleDraw' plain>导 出</el-button>-->
							</div>
						</div>

						<vxe-table border ref='fieldTableRef' show-overflow='false' :data='form.tabs[state.xindex].fields'
											 :column-config='{resizable: true}' :sortConfig='{remote:false}'
											 :edit-config="{trigger: 'click', mode: 'cell'}">
							<vxe-column type='checkbox' width='40' />
							<!--              <vxe-column type="seq" width="36"/>-->
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

					<el-tab-pane label='表单联动' name='tab3' v-if='form.fomod==="m2"' class='zform el-form--inline'>

						<vxe-toolbar style='margin-top: 0;padding-top: 0'>
							<template #buttons>
								<vxe-button @click='addLink(-1)'>新增</vxe-button>
								<vxe-button @click='delLinks'>删除选中</vxe-button>
								<!--                <vxe-button @click="getSelectionEvent">获取选中</vxe-button>-->
								<!--                <vxe-button @click="getInsertEvent">获取新增</vxe-button>-->
								<!--                <vxe-button @click="$refs.linkTableRef.setEditCell(tableData[2], 'name')">激活第三行</vxe-button>-->
								<!--                <vxe-button @click="saveEvent">保存</vxe-button>-->
							</template>
						</vxe-toolbar>

						<vxe-table border ref='linkTableRef' show-overflow='false' :data='form.links'
											 :column-config='{resizable: true}'
											 :edit-config="{trigger: 'click', mode: 'cell'}">
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

					<el-tab-pane label='流程配置' name='tab4' v-if='form.prtag'>
						<div style='width: 100%;height: 720px'>
							<!--							<Modeler2 @bpmnMounted='bpmnMounted' />-->
							<Modeler @bpmnMounted='bpmnMounted' />
							<Panel />
							<BpmnActions />
						</div>
					</el-tab-pane>

					<!--          <el-tab-pane label='流程配置' name='tab4'>-->
					<!--            流程配置-->
					<!--          </el-tab-pane>-->


				</el-tabs>
			</el-form>
		</div>
		<TabEdit ref='tabRef' @close='closeTabEdit' />
		<OrgModal ref='orgModal' @close='closeOrgModal' />
	</el-card>
</template>
<script lang='ts'>
export default { name: 'MyDemoCateEdit' };
</script>
<script lang='ts' setup>
import { Search, Setting } from '@element-plus/icons-vue';
import { computed, getCurrentInstance, nextTick, onMounted, reactive, ref, toRaw, toRefs } from 'vue';
import { tabSave, tabClose } from '/@/comps/page/edit';
import { useRoute } from 'vue-router';
import CateModal from '/@/comps/gen/GenTreeModal.vue';
import OrgModal from '/@/comps/sys/OrgModal.vue';
import {get} from '/@/utils/req';
import { ElMessage, FormInstance } from 'element-plus';
import { uuid } from '/@/utils/xutil';
import TabEdit from './tab.vue';
import { VxeTableInstance } from 'vxe-table';
import Modeler from '/@/comps/Activiti/Modeler';
import Panel from '/@/comps/Activiti/panel';
import BpmnActions from '/@/comps/Activiti/bpmn-actions';
import { BpmnStore } from '/@/bpmn/store';


const route = useRoute();
const formRef = ref<FormInstance>();
const { proxy } = getCurrentInstance() as any;
const activeName = ref('tab1');

const state = reactive({
	url: '/my/demo/cate', fieldSelectedIds: [] as any,
	params: { path: '', query: '' }, xtab: '' as any, xindex: 0 as any,
	form: {
		avtag: true, fields: [] as any,remen: [] as any,
		tabs: [{ ornum: 1, label: '基本信息', name: 'tab1', fields: [] }, { ornum: 2, label: '其他信息', name: 'tab2', fields: [] }] as any,
		links: [], fomod: '', usmen: [],
	} as any,
	fields: [
		{ id: 'id', name: 'ID', width: '50%' },
		{ id: 'name', name: 'DEMO名称', width: '50%', type: 'input1' },
		{ id: 'avtag', name: '是否可用', width: '50%', type: 'switch' },
		{ id: 'crman', name: '创建人', width: '50%', type: 'readonly2', info: 'name' },
		{ id: 'crtim', name: '创建时间', width: '50%', type: 'readonly1' },
		{ id: 'upman', name: '更新人', width: '50%', type: 'readonly2', info: 'name' },
		{ id: 'uptim', name: '更新时间', width: '50%', type: 'readonly1' },
		{ id: 'notes', name: '备注', width: '100%', type: 'textarea' },
		{ id: 'addre', name: 'DEMO地址', width: '100%', type: 'popup1' },
		{ id: 'grade', name: 'DEMO资质', width: '100%', type: 'select1', info: 'grades' },
		{ id: 'catid', name: 'DEMO分类', width: '100%', type: 'select2', info: 'cates' },
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
	if (form.value.prtag && form.value.id) {
		await BpmnStore.importXML(form.value.prxml);
	}
});

const editInitx = async () => {
	state.params = <any>route;
	let id = state.params.query?.id;
	if (id) {
		state.form = await get({
			url: state.url + '/one/' + id,
		});
		state.form.tabs = JSON.parse(state.form.tjson);
		state.form.links = JSON.parse(state.form.ljson);
		state.xtab = state.form.tabs[0].name;
		tabChange();
	} else {
		let pname = state.params.query?.pname;
		if (pname) {
			form.value.parent = { id: state.params.query?.pid, name: pname };
		}
		state.form.avtag = true;
		state.xtab = 'tab1';
		tabChange();
	}
};

const prtagChange = async (value: any) => {
	if (value === true) {
		await nextTick(async () => {
			if (form.value.prxml) {
				await BpmnStore.importXML(form.value.prxml);
			} else {
				await BpmnStore.importXML(defxml);
			}
		});
	} else {
		const bpmn = await BpmnStore.getXML();
		form.value.prxml = bpmn.xml;
	}
};


//region -----组织架构逻辑-----
const orgModal = ref();
const cdata = reactive({}) as any;

const usmenModal = () => {
	orgModal.value.openModal({
		opener: 'usmen',
		orgType: 11,
		selectMode: 2,
		orgs: toRaw(form.value.usmen),
	});
};

const remenModal = () => {
	orgModal.value.openModal({
		opener: 'remen',
		orgType: 11,
		selectMode: 2,
		orgs: toRaw(form.value.remen),
	});
};

const closeOrgModal = (data: any) => {
	if (data.opener == 'usmen') {
		if (data.orgs && data.orgs.length > 0) {
			form.value.usmen = data.orgs;
		} else {
			form.value.usmen = null;
		}
	} else if (data.opener == 'remen') {
		if (data.orgs && data.orgs.length > 0) {
			form.value.remen = data.orgs;
		} else {
			form.value.remen = null;
		}
	}
};


cdata.usmen = computed(() => {
	let names = '';
	if (form.value.usmen && form.value.usmen.length > 0) {
		for (const user of form.value.usmen) {
			names += user.name + '；';
		}
	}
	return names;
});

cdata.remen = computed(() => {
	let names = '';
	if (form.value.remen && form.value.remen.length > 0) {
		for (const user of form.value.remen) {
			names += user.name + '；';
		}
	}
	return names;
});
//endregion


//分类弹框逻辑
const cateModal = ref();
const openCateModal = () => {
	cateModal.value.openModal();
};
const cateChoose = (node: any) => {
	form.value.parent = { id: node.id, name: node.name };
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

	if (form.value.prtag) {
		const bpmn = await BpmnStore.getXML();
		form.value.prxml = bpmn.xml;
	}

	await tabSave({ formRef: formRef.value, state, proxy, route });
};

const defxml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
	'<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:activiti="http://activiti.org/bpmn" id="sample-diagram" targetNamespace="http://activiti.org/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">\n' +
	'  <bpmn2:process id="Process_1" name="1" isExecutable="true">\n' +
	'    <bpmn2:startEvent id="N1" name="开始节点">\n' +
	'      <bpmn2:outgoing>L1</bpmn2:outgoing>\n' +
	'    </bpmn2:startEvent>\n' +
	'    <bpmn2:sequenceFlow id="L1" sourceRef="N1" targetRef="N2" />\n' +
	'    <bpmn2:endEvent id="N3" name="结束节点">\n' +
	'      <bpmn2:incoming>L2</bpmn2:incoming>\n' +
	'    </bpmn2:endEvent>\n' +
	'    <bpmn2:userTask id="N2" name="起草节点" activiti:assignee="l4" activiti:candidateUsers="">\n' +
	'      <bpmn2:documentation>起草节点，表单数据一般从绑定的表单提取</bpmn2:documentation>\n' +
	'      <bpmn2:extensionElements>\n' +
	'        <activiti:formProperty id="userid" type="string" />\n' +
	'        <activiti:formProperty id="money" type="int" />\n' +
	'        <activiti:properties>\n' +
	'          <activiti:property name="编辑" value="edit" />\n' +
	'          <activiti:property name="撤回" value="back" />\n' +
	'          <activiti:property name="提交" value="commit" />\n' +
	'        </activiti:properties>\n' +
	'      </bpmn2:extensionElements>\n' +
	'      <bpmn2:incoming>L1</bpmn2:incoming>\n' +
	'      <bpmn2:outgoing>L2</bpmn2:outgoing>\n' +
	'    </bpmn2:userTask>\n' +
	'    <bpmn2:sequenceFlow id="L2" sourceRef="N2" targetRef="N3" />\n' +
	'  </bpmn2:process>\n' +
	'  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n' +
	'    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">\n' +
	'      <bpmndi:BPMNEdge id="Flow_1u6pmzo_di" bpmnElement="L1">\n' +
	'        <di:waypoint x="360" y="78" />\n' +
	'        <di:waypoint x="360" y="160" />\n' +
	'      </bpmndi:BPMNEdge>\n' +
	'      <bpmndi:BPMNEdge id="Flow_0rj5mf6_di" bpmnElement="L2">\n' +
	'        <di:waypoint x="360" y="240" />\n' +
	'        <di:waypoint x="360" y="422" />\n' +
	'      </bpmndi:BPMNEdge>\n' +
	'      <bpmndi:BPMNShape id="Event_0byql27_di" bpmnElement="N1">\n' +
	'        <dc:Bounds x="342" y="42" width="36" height="36" />\n' +
	'        <bpmndi:BPMNLabel>\n' +
	'          <dc:Bounds x="339" y="12" width="43" height="14" />\n' +
	'        </bpmndi:BPMNLabel>\n' +
	'      </bpmndi:BPMNShape>\n' +
	'      <bpmndi:BPMNShape id="Activity_0g48n8q_di" bpmnElement="N2">\n' +
	'        <dc:Bounds x="310" y="160" width="100" height="80" />\n' +
	'      </bpmndi:BPMNShape>\n' +
	'      <bpmndi:BPMNShape id="Event_1h4oob7_di" bpmnElement="N3">\n' +
	'        <dc:Bounds x="342" y="422" width="36" height="36" />\n' +
	'        <bpmndi:BPMNLabel>\n' +
	'          <dc:Bounds x="339" y="465" width="43" height="14" />\n' +
	'        </bpmndi:BPMNLabel>\n' +
	'      </bpmndi:BPMNShape>\n' +
	'    </bpmndi:BPMNPlane>\n' +
	'  </bpmndi:BPMNDiagram>\n' +
	'</bpmn2:definitions>\n';

</script>

<style scoped>
/*需要放到vben.scss中才起作用*/
/*.el-select .el-input__inner{*/
/*	font-family: 'Courier New', Helvetica, Arial, sans-serif !important;*/
/*}*/
</style>
