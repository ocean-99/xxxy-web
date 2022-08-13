<template>
	<el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
		<template #header>
			<el-row>
				<el-col :span='10'>
					<div style='line-height: 32px'>项目编辑</div>
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
							<el-form-item label='项目名称：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]">
								<el-input v-model='form.name'></el-input>
							</el-form-item>
							<el-form-item label='项目类型：' style='width: 25%'>
								<el-select v-model='form.type' placeholder='请选择' style='width: 100%'>
									<el-option value='1' label='代销（买断合同）' />
									<el-option value='2' label='直销有代理' />
									<el-option value='3' label='直销无代理' />
								</el-select>
							</el-form-item>
							<el-form-item label='项目编号：' style='width: 25%'>
								<span class='zinput' v-show='form.id' style='margin-left: 5px;color: green'>{{ form.senum }}</span>
								<span class='zinput' v-show='!form.id' style='margin-left: 5px;color: #b9abab'>提交后自动生成</span>
							</el-form-item>
							<el-form-item label='客户：' prop='cusna' :rules="[{ required: form.type==3, message: '客户不能为空'}]"
														style='width: 100%' v-show='form.type==2||form.type==3'>
								<el-input v-model='form.cusna' readonly @click='chooseCust'></el-input>
							</el-form-item>
							<el-form-item label='代理商：' prop='agena' :rules="[{ required: form.type==1||form.type==2, message: '代理商不能为空'}]"
														style='width:100%' v-show='form.type==1||form.type==2'>
								<el-input v-model='form.agena' readonly @click='chooseAgent'></el-input>
							</el-form-item>
							<el-form-item label='项目地址：' prop='addre' :rules="[{ required: true, message: '地址不能为空'}]" style='width: 100%'>
								<el-input v-model='form.addre' readonly @click='chooseAddr'></el-input>
							</el-form-item>
							<el-form-item label='项目经办人：' style='width: 100%'>
								<el-input v-model='opmanName' @click='openOrgModal' readonly></el-input>
							</el-form-item>
						</div>
					</el-tab-pane>
					<el-tab-pane label='产品信息' name='tab2'>
						<el-row style='background-color: white;margin-bottom: 10px;border: 0'>
							<el-col :span='14'>
								<el-input v-model='xname' placeholder='输入梯号回车查下' clearable style='height: 32px;width: 160px;margin-right: 10px' @keyup.enter='handleQuery' />
								<el-button type='primary' @click='queryGroup' plain>查 询</el-button>
								<el-button type='primary' @click='addGroup' plain>新 增</el-button>
								<el-button type='primary' @click='upGroup' plain>上 移</el-button>
								<el-button type='primary' @click='downGroup' plain>下 移</el-button>
								<el-button type='primary' @click='handleQuery' plain>复 制</el-button>
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

						<el-table size='small' border :data='form.groups' :row-style="{height: '36px'}" row-key="id"
											@selection-change='groupSelect' style='width: 100%'>
							<el-table-column type='expand'>
								<template #default='props'>
									<el-row :gutter='10' style='background-color: white;border: 0;margin-left: 4px;margin-right: 4px'>
										<el-col :span='12'>
											<el-input size='small' style="font-family: 'Courier New', sans-serif; font-size:16px"
																type='textarea' :rows='10' placeholder='更多信息1'
																v-model='props.row.func1'>
											</el-input>
										</el-col>
										<el-col :span='12'>
											<el-input size='small' style="font-family: 'Courier New', sans-serif; font-size:16px"
																type='textarea' :rows='10' placeholder='更多信息2'
																v-model='props.row.func2'>
											</el-input>
										</el-col>
									</el-row>
								</template>
							</el-table-column>

							<el-table-column type='selection' width='30' align='center' />

							<el-table-column label='排序' width='40'>
								<template #default='scope'>
									<span>{{ scope.row.ornum }}</span>
								</template>
							</el-table-column>
							<el-table-column label='组名' width='40'>
								<template #default='scope'>
									{{ scope.row.grnam }}
								</template>
							</el-table-column>
							<el-table-column label='版本号' width='90'>
								<template #default='scope'>
									<el-select size='small' v-model='scope.row.venum' placeholder=' ' style='width: 50px'>
										<el-option size='small' :value="'V1'" :label="'V1'"></el-option>
										<el-option size='small' :value="'V2'" :label="'V2'"></el-option>
										<el-option size='small' :value="'V3'" :label="'V3'"></el-option>
									</el-select>
									<el-icon :size='18' style='top:4px;margin-left: 3px;cursor: pointer' @click='addVersion()'>
										<ele-CirclePlus />
									</el-icon>
								</template>
							</el-table-column>
							<el-table-column label='产品分类' width='80'>
								<template #default='scope'>
									<el-select size='small' v-model='scope.row.cate' placeholder=' ' @change='cateChange(scope.row)'>
										<el-option size='small' :value="'dt'" :label="'电梯'"></el-option>
										<el-option size='small' :value="'ft'" :label="'扶梯'"></el-option>
									</el-select>
								</template>
							</el-table-column>
							<el-table-column label='布局方式' width='100'>
								<template #default='scope'>
									<el-select size='small' v-model='scope.row.layout' placeholder=' ' @change='layoutChange(scope.row)'>
										<el-option size='small' :value="'dt1'" :label="'单梯'" v-show="scope.row.cate=='dt'"></el-option>
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
								</template>
							</el-table-column>
							<el-table-column label='组数' width='46'>
								<template #default='scope'>
									<el-input size='small' v-model.number='scope.row.gramo' required @change='gramoChange(scope.row)'></el-input>
								</template>
							</el-table-column>
							<el-table-column label='台数' width='46'>
								<template #default='scope'>
									{{ scope.row.seamo }}
								</template>
							</el-table-column>
							<el-table-column label='梯号' width='100'>
								<template #default='scope'>
									<el-input size='small' v-model='prod.itnum' :key='prod.id' v-for='prod of scope.row.prods' style='margin-top: 2px;margin-bottom: 2px'></el-input>
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
								</template>
							</el-table-column>
							<el-table-column label='备注'>
								<template #default='scope'>
									<el-input size='small' v-model='prod.notes' :key='prod.id' v-for='prod of scope.row.prods' style='margin-top: 2px;margin-bottom: 2px'></el-input>
								</template>
							</el-table-column>

							<el-table-column fixed='right' label='操作' width='50' align='center'>
								<template #header>
									<el-icon :size='22' style='top: 5px;cursor: pointer' color='#666'>
										<ele-CirclePlus @click='addGroup' />
									</el-icon>
								</template>
								<template #default='scope'>
									<el-icon :size='22' style='top: 3px;cursor: pointer'>
										<ele-CircleClose @click='delGroup(scope.$index)' />
									</el-icon>
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
					</el-tab-pane>
					<el-tab-pane label='权限信息' name='tab9'>
						<Perm ref='permRef' :form='form' v-if='state.permShow' @update='update' :orgModal='orgModal' />
					</el-tab-pane>
				</el-tabs>
			</el-form>
		</div>
		<div id='simpleSquare'></div>
		<Amap ref='amapRef' @close='closeAmap' />
		<OrgModal ref='orgModal' @close='closeOrgModal' />
		<CustModal url='sa/cust/main/list' ref='custModal' @close='custModalChoose' />
		<AgentModal url='sa/agent/main/list' ref='agentModal' @close='agentModalChoose' />
	</el-card>
</template>
<script lang='ts'>
export default { name: 'SaProjMainEdit' };
</script>
<script lang='ts' setup>
import { computed, getCurrentInstance, onMounted, reactive, ref, toRaw, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import Cookies from 'js-cookie';
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus';
import request from '/@/utils/request';
import { tabSave, tabClose } from '/@/comps/page/edit';
import Amap from '/@/comps/ass/amap.vue';
import OrgModal from '/@/comps/sys/OrgModal.vue';
import CustModal from '/@/comps/gen/GenModal.vue';
import AgentModal from '/@/comps/gen/GenModal.vue';
import Perm from './perm.vue';
import { uuid } from '/@/utils/xutil';

const route = useRoute();
const formRef = ref<FormInstance>();
const { proxy } = getCurrentInstance() as any;
const activeName = ref('tab1');

const state = reactive({
	url: '/sa/proj/main', permShow: false,
	params: { path: '', query: '' },
	form: { avtag: true, groups: [] as any } as any,
	groupSelectedIds: [],
});

const { form } = toRefs(state);

onMounted(async () => {
	await editInit();
});

const editInit = async () => {
	let id = route.query?.id;
	if (id) {
		form.value = await request({
			url: state.url + '/one/' + id,
			method: 'get',
		});
	} else {
		state.form.avtag = true;
		const userName = Cookies.get('userName');
		const userId = Cookies.get('userId');
		form.value.opman = { id: userId, name: userName };
	}
	state.permShow = true;
};

//region -----客户与代理商选择逻辑-----
const agentModal = ref();
const chooseAgent = () => {
	agentModal.value.openModal();
};
const agentModalChoose = (data: any) => {
	form.value.ageid = data ? data.id : null;
	form.value.agena = data ? data.name : null;
};


const custModal = ref();
const chooseCust = () => {
	custModal.value.openModal();
};
const custModalChoose = (data: any) => {
	form.value.cusid = data.id;
	form.value.cusna = data.name;
};

//endregion


//region -----组织架构选择逻辑-----
const orgModal = ref();
const openOrgModal = () => {
	orgModal.value.openModal({
		opener: 'opman',
		orgType: 8,
	});
};

const opmanName = computed(() => {
	return form.value.opman ? form.value.opman.name : '';
});

const permRef = ref();
const closeOrgModal = (data: any) => {
	if (!permRef.value.closeOrgModal(data)) {
		if (data.opener == 'opman') {
			if (data.orgs && data.orgs.length > 0) {
				form.value.opman = {};
				form.value.opman = { id: data.orgs[0].id, name: data.orgs[0].name };
				form.value.opmid = data.orgs[0].id;
			} else {
				form.value.opman = null;
				form.value.opmid = null;
			}
		}
	}
};
const update = (props: any) => {
	for (const prop in props) {
		form.value[prop] = toRaw(props[prop]);
	}
};
//endregion


//region -----地址选择逻辑------
const amapRef = ref();
const chooseAddr = () => {
	amapRef.value.openModal({ adcoo: form.value.adcoo, adreg: form.value.adreg, addet: form.value.addet, adzoo: '' });
};

const closeAmap = (data: any) => {
	if (data) {
		form.value.addre = data.adreg + data.addet;
		form.value.adcoo = data.adcoo;
		form.value.adreg = data.adreg;
		form.value.addet = data.addet;
		form.value.adpro = data.adpro;
		form.value.adcit = data.adcit;
		form.value.addis = data.addis;
	}
};
//endregion


//region -----产品页签逻辑------


const groupSelect = (selection: any) => {
	state.groupSelectedIds = selection.map((item: any) => item.id);
};

const addGroup = () => {
	const uid = uuid();
	form.value.groups.push({ id: uid, cate: 'dt', gramo: '1', ornum: form.value.groups.length + 1 });
};

const delGroup = ($index: any) => {
	form.value.groups.splice($index, 1);
	for (let i = $index; i < form.value.groups.length; i++) {
		form.value.groups[i].ornum = i + 1;
	}
};

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
					form.value.groups[i - 1]=form.value.groups[i];
					form.value.groups[i - 1].ornum--;
					form.value.groups[i]=swap;
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
	for (let i = form.value.groups.length - 1; i >=0 ; i--) {
		for (let j = state.groupSelectedIds.length-1; j>=0; j--) {
			if (state.groupSelectedIds[j] == form.value.groups[i].id) {
				if (i == form.value.groups.length-1) {
					ElMessage.warning('已经是最后一项');
					return;
				} else {
					console.log(111);
					let swap = form.value.groups[i + 1];
					form.value.groups[i + 1]=form.value.groups[i];
					form.value.groups[i + 1].ornum++;
					form.value.groups[i]=swap;
					form.value.groups[i].ornum--;
				}
				break;
			}
		}
	}
};


const cateChange = (row: any) => {
	row.layout = '';
	row.gramo = '';
	row.seamo = '';
	row.prods = [];
};

const layoutChange = (row: any) => {
	if (!row.gramo) {
		row.gramo = 1;
	}
	switch (row.layout) {
		case 'dt1':
			row.seamo = row.gramo;
			row.prods = [{}];
			break;
		case 'dt21':
			row.seamo = row.gramo * 2;
			row.prods = [{}];
			break;
		case 'dt22':
			row.seamo = row.gramo * 2;
			row.prods = [{}, {}];
			break;
		case 'dt3':
			row.seamo = row.gramo * 3;
			row.prods = [{}, {}, {}];
			break;
		case 'dt4':
			row.seamo = row.gramo * 4;
			row.prods = [{}, {}, {}, {}];
			break;
		case 'dt5':
			row.seamo = row.gramo * 5;
			row.prods = [{}, {}, {}, {}, {}];
			break;
		case 'dt6':
			row.seamo = row.gramo * 6;
			row.prods = [{}, {}, {}, {}, {}, {}];
			break;
		case 'dt7':
			row.seamo = row.gramo * 7;
			row.prods = [{}, {}, {}, {}, {}, {}, {}];
			break;
		case 'dt8':
			row.seamo = row.gramo * 8;
			row.prods = [{}, {}, {}, {}, {}, {}, {}, {}];
			break;
		case 'ft1':
			row.seamo = row.gramo;
			row.prods = [{}];
			break;
		case 'ft21':
			row.seamo = row.gramo * 2;
			row.prods = [{}, {}];
			break;
		case 'ft22':
			row.seamo = row.gramo * 2;
			row.prods = [{}, {}];
			break;
		default :
			row.seamo = '';
	}
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
};


//endregion

</script>

<style scoped>

</style>
