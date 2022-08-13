<template>
	<el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
		<template #header>
			<el-row>
				<el-col :span='10'>
					<div style='line-height: 32px;color: green'>{{ form.name }}</div>
				</el-col>
				<el-col :span='14' style='text-align: right'>
					<el-button type='success' @click='viewToEdit({proxy,route,state})' plain>编辑项目</el-button>
					<!--					<el-button type='success' @click='editProd' plain>产品维护</el-button>-->
					<el-button type='info' @click='tabClose({proxy,route})' plain>关 闭</el-button>
				</el-col>
			</el-row>
		</template>
		<div style='margin-top: 8px;margin-bottom: 8px'>
			<el-form ref='formRef' :inline='true' class='yform' :model='form' label-width='140px'>
				<el-tabs type='card' v-model='activeName'>
					<el-tab-pane label='基本信息' name='tab1'>
						<div class='yform-div'>
							<el-form-item label='项目名称：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]">
								<span class='zinput'>{{ form.name }}</span>
							</el-form-item>
							<el-form-item label='项目编号：'>
								<span class='zinput'>{{ form.senum }}</span>
							</el-form-item>
							<el-form-item label='项目地址：' style='width: 100%'>
								<span class='zinput' @click='chooseAddr' style='cursor: pointer;color: #1f86d5'>{{ form.addre }}</span>
							</el-form-item>
							<el-form-item label='代理商经办人：'>
								<span class='zinput'>{{ form.opmna }}</span>
							</el-form-item>

						</div>
					</el-tab-pane>
					<el-tab-pane label='产品信息' name='tab2'>
						<div style='padding-bottom: 300px;' @click='prodDivClick'>
							<el-row style='background-color: white;margin-bottom: 10px;border: 0'>
								<el-col :span='14'>
									<el-input v-model='state.senam' placeholder='输入梯号回车查下' clearable style='height: 32px;width: 160px;margin-right: 10px' @keyup.enter='handleQuery' />
									<el-button type='primary' @click='handleQuery' plain>查 询</el-button>
									<el-button type='primary' @click.stop='addGroup' plain>新 增</el-button>
									<el-button type='primary' @click='upGroup' plain>上 移</el-button>
									<el-button type='primary' @click='downGroup' plain>下 移</el-button>
									<el-button type='primary' @click='copyGroup' plain>复 制</el-button>
									<el-button type='primary' @click='delsGroup' plain>删 除</el-button>
									<el-dropdown @command='handleCommand' style='margin-left: 10px;top:1px'>
										<el-button type='primary' plain>更 多</el-button>
										<template #dropdown>
											<el-dropdown-menu>
												<el-dropdown-item command='expandAll'>测试1</el-dropdown-item>
												<el-dropdown-item command='collapseAll'>测试2</el-dropdown-item>
												<el-dropdown-item command='refresh'>测试3</el-dropdown-item>
											</el-dropdown-menu>
										</template>
									</el-dropdown>
								</el-col>
								<el-col :span='10' style='text-align: right'>
									<el-button type='info' :icon='Upload' @click='handleImpQuote' plain>导入产品</el-button>
									<el-button type='success' :icon='Upload' @click='handleDraw' plain>土建图申请</el-button>
									<el-button type='danger' :icon='Upload' @click='handlePinshen' plain>土建图评审</el-button>
								</el-col>
							</el-row>

							<el-table @row-click='(row,column,event)=>rowClick(row,column,event)' row-key='id' size='small' border :data='form.groups'
												:row-style="{height: '36px'}" style='width: 100%' @selection-change='groupSelect'>
								<el-table-column type='selection' width='30' align='center' />

								<el-table-column label='排序' width='40'>
									<template #default='scope'>
										<span>{{ scope.row.ornum }}</span>
									</template>
								</el-table-column>
								<!--							<el-table-column label='组名' width='40'>-->
								<!--								<template #default='scope'>-->
								<!--									{{ scope.row.grnam }}-->
								<!--								</template>-->
								<!--							</el-table-column>-->
								<!--							<el-table-column label='版本号' width='90'>-->
								<!--								<template #default='scope'>-->
								<!--									<el-select size='small' v-model='scope.row.venum' placeholder=' ' style='width: 50px'>-->
								<!--										<el-option size='small' :value="'V1'" :label="'V1'"></el-option>-->
								<!--										<el-option size='small' :value="'V2'" :label="'V2'"></el-option>-->
								<!--										<el-option size='small' :value="'V3'" :label="'V3'"></el-option>-->
								<!--									</el-select>-->
								<!--									<el-icon :size='18' style='top:4px;margin-left: 3px;cursor: pointer' @click='addVersion()'>-->
								<!--										<ele-CirclePlus />-->
								<!--									</el-icon>-->
								<!--								</template>-->
								<!--							</el-table-column>-->
								<el-table-column label='产品分类' width='80'>
									<template #default='scope'>
										<el-select v-show='scope.row.edtag' size='small' v-model='scope.row.cate' placeholder=' ' @change='cateChange(scope.row)'>
											<el-option size='small' :value="'dt'" :label="'电梯'"></el-option>
											<el-option size='small' :value="'ft'" :label="'扶梯'"></el-option>
										</el-select>
										<span v-show='!scope.row.edtag'>
											{{ scope.row.cate == 'dt' ? '电梯' : '扶梯' }}
									</span>
									</template>
								</el-table-column>
								<el-table-column label='布局方式' width='100'>
									<template #default='scope'>
										<el-select v-show='scope.row.edtag' size='small' v-model='scope.row.layout' placeholder=' ' @change='layoutChange(scope.row)'>
											<el-option :value="'dt1'" :label="'单梯'" v-show="scope.row.cate=='dt'"></el-option>
											<el-option :value="'dt21'" :label="'并联相同'" v-show="scope.row.cate=='dt'"></el-option>
											<el-option :value="'dt22'" :label="'并联不同'" v-show="scope.row.cate=='dt'"></el-option>
											<el-option :value="'dt3'" :label="'3台群控'" v-show="scope.row.cate=='dt'"></el-option>
											<el-option :value="'dt4'" :label="'4台群控'" v-show="scope.row.cate=='dt'"></el-option>
											<el-option :value="'dt5'" :label="'5台群控'" v-show="scope.row.cate=='dt'"></el-option>
											<el-option :value="'dt6'" :label="'6台群控'" v-show="scope.row.cate=='dt'"></el-option>
											<el-option :value="'dt7'" :label="'7台群控'" v-show="scope.row.cate=='dt'"></el-option>
											<el-option :value="'dt8'" :label="'8台群控'" v-show="scope.row.cate=='dt'"></el-option>
											<el-option :value="'ft1'" :label="'单台'" v-show="scope.row.cate=='ft'"></el-option>
											<el-option :value="'ft21'" :label="'并列'" v-show="scope.row.cate=='ft'"></el-option>
											<el-option :value="'ft22'" :label="'交叉'" v-show="scope.row.cate=='ft'"></el-option>
										</el-select>
										<span v-show='!scope.row.edtag'>
											{{ layoutShow(scope.row.layout) }}
									</span>
									</template>
								</el-table-column>
								<el-table-column label='组数' width='46'>
									<template #default='scope'>
										<el-input v-show='scope.row.edtag' size='small' v-model.number='scope.row.gramo' required @change='gramoChange(scope.row)'></el-input>
										<span v-show='!scope.row.edtag'>{{ scope.row.gramo }}</span>
									</template>
								</el-table-column>
								<el-table-column label='台数' width='46'>
									<template #default='scope'>
										{{ scope.row.seamo }}
									</template>
								</el-table-column>
								<el-table-column label='梯号' width='100'>
									<template #default='scope'>
										<el-input v-show='scope.row.edtag' size='small' v-model='prod.itnum' :key='prod.id' v-for='prod of scope.row.prods'
															style='margin-top: 2px;margin-bottom: 2px' @change='itnumChange(scope.row)'></el-input>
										<div v-show='!scope.row.edtag' :key='prod.id' v-for='prod of scope.row.prods' class='prod-row-view'>
											{{ prod.itnum }}
										</div>
									</template>
								</el-table-column>
								<el-table-column label='型号规格' width='260'>
									<template #default='scope'>
										<div style='margin-top: 2px;margin-bottom: 2px;' :key='prod.id' v-for='prod of scope.row.prods'>
											<el-icon :size='18' style='top:4px;margin-right: 3px;cursor: pointer' @click='prodChoose'>
												<ele-Edit />
											</el-icon>
											<el-icon :size='18' style='top:4px;margin-right: 3px;cursor: pointer' @click='prodCopy'>
												<ele-CopyDocument />
											</el-icon>
											<el-icon :size='18' style='top:4px;margin-right: 3px;cursor: pointer' @click='prodCompare'>
												<ele-ScaleToOriginal />
											</el-icon>
											<span style='color: green;cursor: pointer' @click='featEdit(scope.row)'>KLKS-1000kg-1.0m/s-10/10/10</span>
										</div>

										<!--									<el-input :readonly='!scope.row.edtag'  size='small' v-model='prod.model' :key='prod.id' v-for='prod of scope.row.prods' style='margin-top: 2px;margin-bottom: 2px'></el-input>-->
									</template>
								</el-table-column>
								<el-table-column label='状态' width='40'>
									待审
								</el-table-column>
								<el-table-column label='备注'>
									<template #default='scope'>
										<el-input v-show='scope.row.edtag' size='small' v-model='prod.notes' :key='prod.id' v-for='prod of scope.row.prods'
															style='margin-top: 2px;margin-bottom: 2px' @change='notesChange(scope.row)'></el-input>
										<div v-show='!scope.row.edtag' :key='prod.id' v-for='prod of scope.row.prods' class='prod-row-view'>
											{{ prod.notes }}
										</div>
									</template>
								</el-table-column>

								<el-table-column fixed='right' label='操作' width='70' align='center'>
									<template #header>
										<el-icon :size='22' style='top: 5px;cursor: pointer' color='#666'>
											<ele-CirclePlus @click='addGroup' />
										</el-icon>
									</template>
									<template #default='scope'>
										<!--									<el-button size='small'  @click='handleEdit(scope.row)' plain v-show='!scope.row.edtag'>编 辑</el-button>-->
										<!--									<el-button size='small'   @click="form.groups.splice(scope.$index, 1)" plain v-show='!scope.row.edtag'>删 除</el-button>-->
										<el-button size='small' @click.stop='updateGroup(scope.row)' plain v-show='scope.row.edtag'>保 存</el-button>
										<!--									<el-button size='small'  @click='handleCancel(scope.row)' plain v-show='scope.row.edtag'>取 消</el-button>-->
									</template>
								</el-table-column>


								<!--							<el-table-column label="Name" width="180">-->
								<!--								<template #default="scope">-->
								<!--									<el-popover effect="light" trigger="hover" placement="top" width="auto">-->
								<!--										<template #default>-->
								<!--											<div>name: {{ scope.row.name }}</div>-->
								<!--											<div>address: {{ scope.row.id }}</div>-->
								<!--										</template>-->
								<!--										<template #reference>-->
								<!--											<el-tag>{{ scope.row.name }}</el-tag>-->
								<!--										</template>-->
								<!--									</el-popover>-->
								<!--								</template>-->
								<!--							</el-table-column>-->
							</el-table>

							<el-pagination
								@size-change='handleQuery' @current-change='handleQuery'
								class='mt8' :pager-count='5' :page-sizes='[10, 20, 30]' background
								:total='25' :current-page='1' :page-size='10'
								layout='total, sizes, prev, pager, next, jumper'
							/>
						</div>

					</el-tab-pane>
					<el-tab-pane label='权限信息' name='tab9'>
						<div class='yform-div'>
							<el-form-item label='备注：' style='width: 100%'>
								<el-input type='textarea' :rows='4' v-model='form.notes' readonly />
							</el-form-item>
							<el-form-item label='可查看者：' style='width: 50%'>
								<el-input type='textarea' :rows='4' v-model='viewersName' readonly />
							</el-form-item>
							<el-form-item label='可编辑者：' style='width: 50%'>
								<el-input type='textarea' :rows='4' v-model='editorsName' readonly />
							</el-form-item>
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
					</el-tab-pane>
				</el-tabs>
			</el-form>
		</div>
		<div id='simpleSquare'></div>
		<OrgModal ref='orgModal' @close='closeOrgModal' />
		<Amap ref='amapRef' />
	</el-card>
</template>
<script lang='ts' setup>
import { computed, getCurrentInstance, onMounted, reactive, ref, toRefs } from 'vue';
import { viewInit, tabClose, viewToEdit } from '/@/comps/page/view';
import { useRoute } from 'vue-router';
import OrgModal from '/@/comps/sys/OrgModal.vue';
import Amap from '/@/comps/ass/amap.vue';
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus';
import request from '/@/utils/request';
import { uuid } from '/@/utils/xutil';

const route = useRoute();
const formRef = ref<FormInstance>();
const { proxy } = getCurrentInstance() as any;
const activeName = ref('tab1');

const state = reactive({
	url: '/sa/proj/main', senam: '',
	params: { path: '', query: '' }, grades: [] as any,
	form: { avtag: true, items: [] as any } as any,
	groupSelectedIds: [],
});

const { form } = toRefs(state);


onMounted(async () => {
	await viewInit({ state, route });
	await gradesInit();
});


// const editProd = async () => {
// 	proxy.mittBus.emit('onCurrentContextmenuClick', Object.assign({}, { contextMenuClickId: 1, ...route }));
// 	await router.push({
// 		path: '/sa/prod/main',
// 		query: { proj:state.form.id },
// 	});
// };


//region 经办人与可查看者选择逻辑
const viewersName = computed(() => {
	let names = '';
	if (form.value.viewers && form.value.viewers.length > 0) {
		for (const user of form.value.viewers) {
			names += user.name + '；';
		}
	}
	return names;
});

const editorsName = computed(() => {
	let names = '';
	if (form.value.editors && form.value.editors.length > 0) {
		for (const user of form.value.editors) {
			names += user.name + '；';
		}
	}
	return names;
});
//endregion

//region 地址选择逻辑
const amapRef = ref();
const chooseAddr = () => {
	amapRef.value.openModal({ adcoo: form.value.adcoo, adreg: form.value.adreg, addet: form.value.addet, adzoo: '' });
};
//endregion

//region 业务字典逻辑
const gradesInit = async () => {
	state.grades = await request({
		url: '/ass/dict/data/list?maiid=AG_LEVEL',
		method: 'get',
	});
};
//endregion


//region-----产品逻辑-----
const addGroup = async () => {
	const uid = uuid();
	const newGroup = { chtag:false,prjid: form.value.id, id: uid, cate: 'dt', gramo: '1', edtag: true, ornum: form.value.groups.length + 1 };
	form.value.groups.push(newGroup);
	await insertGroup(newGroup);
	if (lastId) {
		for (const group of form.value.groups) {
			if (group.id == lastId) {
				group.edtag = false;
				await updateGroup(group);
				break;
			}
		}
	}
	lastId = uid;
};

const insertGroup = async (group: any) => {
	await request({
		url: '/sa/prod/group',
		method: 'post',
		data: group,
	});
};

const updateGroup = async (group: any) => {
	group.edtag = false;
	console.log('是否保存到后台?');
	if (group.chtag == true) {
		console.log('保存到后台!');
		await request({
			url: '/sa/prod/group',
			method: 'put',
			data: group,
		});
		group.chtag = false;
	}
};


const groupSelect = (selection: any) => {
	state.groupSelectedIds = selection.map((item: any) => item.id);
};


// const delGroup = ($index: any) => {
// 	form.value.groups.splice($index, 1);
// 	for (let i = $index; i < form.value.groups.length; i++) {
// 		form.value.groups[i].ornum = i + 1;
// 	}
// };

const delsGroup = () => {
	if (state.groupSelectedIds.length <= 0) {
		ElMessage.warning('请选择后再进行删除');
		return;
	}
	ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			for (let index = form.value.groups.length - 1; index >= 0; index--) {
				for (let i = 0; i < state.groupSelectedIds.length; i++) {
					if (state.groupSelectedIds[i] == form.value.groups[index].id) {
						console.log(index);
						form.value.groups.splice(index, 1);
						break;
					}
				}
			}
			for (let i = 0; i < form.value.groups.length; i++) {
				form.value.groups[i].ornum = i + 1;
			}
		})
		.catch(() => ElMessage.info('已取消删除'));
};

const upGroup = () => {
	if (state.groupSelectedIds.length <= 0) {
		ElMessage.warning('请选择后再进行操作');
		return;
	}
	for (let i = 0; i <= form.value.groups.length - 1; i++) {
		for (let j = 0; j < state.groupSelectedIds.length; j++) {
			if (state.groupSelectedIds[j] == form.value.groups[i].id) {
				if (i == 0) {
					ElMessage.warning('已经是第一项');
					return;
				} else {
					let swap = form.value.groups[i - 1];
					form.value.groups[i - 1] = form.value.groups[i];
					form.value.groups[i - 1].ornum--;
					form.value.groups[i] = swap;
					form.value.groups[i].ornum++;
				}
				break;
			}
		}
	}
};

const downGroup = () => {
	if (state.groupSelectedIds.length <= 0) {
		ElMessage.warning('请选择后再进行操作');
		return;
	}
	for (let i = form.value.groups.length - 1; i >= 0; i--) {
		for (let j = state.groupSelectedIds.length - 1; j >= 0; j--) {
			if (state.groupSelectedIds[j] == form.value.groups[i].id) {
				if (i == form.value.groups.length - 1) {
					ElMessage.warning('已经是最后一项');
					return;
				} else {
					console.log(111);
					let swap = form.value.groups[i + 1];
					form.value.groups[i + 1] = form.value.groups[i];
					form.value.groups[i + 1].ornum++;
					form.value.groups[i] = swap;
					form.value.groups[i].ornum--;
				}
				break;
			}
		}
	}
};

const copyGroup = () => {
	if (state.groupSelectedIds.length <= 0) {
		ElMessage.warning('请选择后再进行操作');
		return;
	}
	for (let i = 0; i <= form.value.groups.length - 1; i++) {
		for (let j = 0; j < state.groupSelectedIds.length; j++) {
			if (state.groupSelectedIds[j] == form.value.groups[i].id) {
				const newGroup: any = deepClone(form.value.groups[i]);
				newGroup.id = uuid();
				newGroup.edtag = false;
				newGroup.ornum = form.value.groups.length + 1;
				form.value.groups.push(newGroup);
				insertGroup(newGroup);
				break;
			}
		}
	}
};

function deepClone(obj: any) {
	if (obj === null)
		return;
	const newObj: any = obj.push ? [] : {};
	for (const attr in obj) {
		if (typeof obj[attr] == 'object')
			newObj[attr] = deepClone(obj[attr]);
		else
			newObj[attr] = obj[attr];
	}
	return newObj;
}

const itnumChange=(row:any)=>{
	row.chtag = true;
}

const notesChange=(row:any)=>{
	row.chtag = true;
}

const cateChange = (row: any) => {
	row.layout = '';
	row.gramo = '';
	row.seamo = '';
	row.prods = [];
	row.chtag = true;
};

const layoutChange = (row: any) => {
	if (!row.gramo) {
		row.gramo = 1;
	}
	switch (row.layout) {
		case 'dt1':
			row.seamo = row.gramo;
			row.prods = [{ id: uuid() }];
			break;
		case 'dt21':
			row.seamo = row.gramo * 2;
			row.prods = [{ id: uuid() }];
			break;
		case 'dt22':
			row.seamo = row.gramo * 2;
			row.prods = [{ id: uuid() }, { id: uuid() }];
			break;
		case 'dt3':
			row.seamo = row.gramo * 3;
			row.prods = [{ id: uuid() }, { id: uuid() }, { id: uuid() }];
			break;
		case 'dt4':
			row.seamo = row.gramo * 4;
			row.prods = [{ id: uuid() }, { id: uuid() }, { id: uuid() }, { id: uuid() }];
			break;
		case 'dt5':
			row.seamo = row.gramo * 5;
			row.prods = [{ id: uuid() }, { id: uuid() }, { id: uuid() }, { id: uuid() }, { id: uuid() }];
			break;
		case 'dt6':
			row.seamo = row.gramo * 6;
			row.prods = [{ id: uuid() }, { id: uuid() }, { id: uuid() }, { id: uuid() }, { id: uuid() }, { id: uuid() }];
			break;
		case 'dt7':
			row.seamo = row.gramo * 7;
			row.prods = [{ id: uuid() }, { id: uuid() }, { id: uuid() }, { id: uuid() }, { id: uuid() }, { id: uuid() }, { id: uuid() }];
			break;
		case 'dt8':
			row.seamo = row.gramo * 8;
			row.prods = [{ id: uuid() }, { id: uuid() }, { id: uuid() }, { id: uuid() }, { id: uuid() }, { id: uuid() }, { id: uuid() }, { id: uuid() }];
			break;
		case 'ft1':
			row.seamo = row.gramo;
			row.prods = [{ id: uuid() }];
			break;
		case 'ft21':
			row.seamo = row.gramo * 2;
			row.prods = [{ id: uuid() }, { id: uuid() }];
			break;
		case 'ft22':
			row.seamo = row.gramo * 2;
			row.prods = [{ id: uuid() }, { id: uuid() }];
			break;
		default :
			row.seamo = '';
	}
	row.chtag = true;
};

const gramoChange = (row: any) => {
	if (row.gramo) {
		switch (row.layout) {
			case 'dt1':
				row.seamo = row.gramo;
				break;
			case 'dt21':
				row.seamo = row.gramo * 2;
				break;
			case 'dt22':
				row.seamo = row.gramo * 2;
				break;
			case 'dt3':
				row.seamo = row.gramo * 3;
				break;
			case 'dt4':
				row.seamo = row.gramo * 4;
				break;
			case 'dt5':
				row.seamo = row.gramo * 5;
				break;
			case 'dt6':
				row.seamo = row.gramo * 6;
				break;
			case 'dt7':
				row.seamo = row.gramo * 7;
				break;
			case 'dt8':
				row.seamo = row.gramo * 8;
				break;
			case 'ft1':
				row.seamo = row.gramo;
				break;
			case 'ft2':
				row.seamo = row.gramo * 2;
				break;
			case 'ft3':
				row.seamo = row.gramo * 3;
				break;
			default :
				row.seamo = '';
		}
	}
	row.chtag = true;
};


const layoutShow = (layout: string) => {
	switch (layout) {
		case 'dt1':
			return '单梯';
		case 'dt21':
			return '并联相同';
		case 'dt22':
			return '并联不同';
		case 'dt3':
			return '3台群控';
		case 'dt4':
			return '4台群控';
		case 'dt5':
			return '5台群控';
		case 'dt6':
			return '6台群控';
		case 'dt7':
			return '7台群控';
		case 'dt8':
			return '8台群控';
		case 'ft1':
			return '单台';
		case 'ft21':
			return '并列';
		case 'ft22':
			return '交叉';
		default :
			return '';
	}
};


let lastId = '';
const rowClick = async (row: any, column: any, event: any) => {
	if (lastId && lastId != row.id) {
		for (const group of form.value.groups) {
			if (group.id == lastId) {
				// group.edtag = false;
				await updateGroup(group);
				break;
			}
		}
	}
	lastId = row.id;
	row.edtag = true;
	event.stopPropagation();
};


const prodDivClick = async () => {
	// console.log("prodDivClick");
	// console.log(lastId);
	for (const group of form.value.groups) {
		if (group.id == lastId) {
			if (group.edtag) {
				await updateGroup(group);
				// group.edtag = false;
			}
			break;
		}
	}
};

//endregion

</script>

<style scoped>
.prod-row-view {
	margin-top: 3px;
	margin-bottom: 3px;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}
</style>
