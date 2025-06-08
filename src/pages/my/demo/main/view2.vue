<template>
	<el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
		<template #header>
			<div class='zjustify'>
				<div>
					<div style='line-height: 32px'>DEMO查看</div>
				</div>
				<div>
					<el-button type='success' @click='viewToEdit2({proxy,route,state})' plain>编 辑</el-button>
					<el-button type='info' @click='tabClose({proxy,route})' plain>关 闭</el-button>
				</div>
			</div>
		</template>
		<div style='margin-top: 8px;margin-bottom: 8px'>
			<el-form ref='formRef' disabled :inline='true' class='zform' :model='form' label-width='140px'>
				<el-tabs type='card' v-model='activeName'>
					<el-tab-pane :label='item.label' v-for='item in state.tabs' :key='item.id' :name='item.name'>
						<div class='zform-div'>
							<el-form-item :key='field.label' v-for='field in item.fields' :label='field.label+"："' :prop='field.name' :style='{ width: `${field.width}` }'
														v-show='field.shtag||(!field.shtag&&field.width!=="100%")'>
								<div class='zinput' v-if='field.shtag===false' style='height: 32px'/>
								<div v-else-if='field.type==="input1"' class='zinput'>{{ form[field.name] }}</div>
								<div v-else-if='field.type==="select1"' class='zinput'>{{ select1Show(field, form[field.name]) }}</div>
								<div v-else-if='field.type==="select2"' class='zinput'>{{ select2Show(field, form[field.name]) }}</div>
								<div v-else-if='field.type==="popup1"' class='zinput'>{{ form[field.name] }}</div>
								<div v-else-if='field.type==="popup2"' class='zinput'>{{ cdata[field.name] }}</div>
								<div v-else-if='field.type==="popup3"' class='ztextarea'>{{ cdata[field.name] }}</div>
								<div v-else-if='field.type==="textarea"' class='ztextarea'>{{ form[field.name] }}</div>
								<el-switch v-else-if='field.type==="switch"' v-model='form[field.name]' />
								<span class='zinput' v-else-if='field.type==="senum"' style='margin-left: 5px;color: green'>{{ form.senum }}</span>
								<span v-else-if='field.type==="readonly1"' class='zinput'>{{ form[field.name] ? form[field.name] : '#' }}</span>
								<span v-else-if='field.type==="readonly2"' class='zinput'>{{ form[field.name] ? form[field.name][field.info] : '#' }}</span>
								<ul v-else-if='field.type==="att"'>
									<li :key='att.id' v-for='att in form[field.name]' @click='handleAtt(att.id)' style='cursor: pointer;list-style: none;'>{{ att.name }}</li>
								</ul>
								<el-table v-else-if='field.name==="items"' size='small' border :data='form.items' :row-style="{height: '36px'}" style='width: 100%'>
									<el-table-column label='排序号' width='90'>
										<template #default='scope'>
											<el-input-number v-model='scope.row.ornum' controls-position='right' style='width: 100%' />
										</template>
									</el-table-column>
									<el-table-column label='姓名' width='100'>
										<template #default='scope'>
											<el-input v-model='scope.row.name' required></el-input>
										</template>
									</el-table-column>
									<el-table-column label='手机号' width='150'>
										<template #default='scope'>
											<el-input v-model='scope.row.monum' required></el-input>
										</template>
									</el-table-column>
									<el-table-column label='邮箱' width='150'>
										<template #default='scope'>
											<el-input v-model='scope.row.email' required></el-input>
										</template>
									</el-table-column>
									<el-table-column label='性别' width='80'>
										<template #default='scope'>
											<el-select v-model='scope.row.gender' placeholder=' ' style='width: 100%'>
												<el-option value='m' label='男' />
												<el-option value='f' label='女' />
											</el-select>
										</template>
									</el-table-column>
									<el-table-column label='职务' width='180'>
										<template #default='scope'>
											<el-input v-model='scope.row.post'></el-input>
										</template>
									</el-table-column>
									<el-table-column label='备注'>
										<template #default='scope'>
											<el-input v-model='scope.row.notes'></el-input>
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
												<ele-CircleClose @click='form.items.splice(scope.$index, 1)' />
											</el-icon>
										</template>
									</el-table-column>
								</el-table>
								<span v-else class='zinput' style='color: red'>未找到处理方式</span>
							</el-form-item>
						</div>
					</el-tab-pane>
					<el-tab-pane label='流程流转' name='tab11' v-if='state.flowShow&&form.protd'>
							<BpmView @submit='submit' :proid='form.id' />
					</el-tab-pane>
				</el-tabs>
			</el-form>
		</div>
		<Amap ref='amapRef' />
	</el-card>
</template>
<script lang='ts' setup>
import { computed, getCurrentInstance, onMounted, reactive, ref, toRefs } from 'vue';
import { viewInit, tabClose, viewToEdit2 } from '/@/comps/page/view';
import { useRoute } from 'vue-router';
import { ElMessageBox, FormInstance } from 'element-plus';
import {get} from '/@/utils/req';
import Amap from '/@/comps/ass/amap.vue';
import BpmView from '/@/comps/bpm/view.vue';
import { tabSave } from '/@/comps/page/edit';

const route = useRoute();
const formRef = ref<FormInstance>();
const { proxy } = getCurrentInstance() as any;
const activeName = ref('tab1');

const state = reactive({
	url: '/my/demo/main', cates: [] as any, grades: [] as any,flowShow:false,
	params: { path: '', query: '' }, cate: {} as any, tabs: [] as any, links: [] as any,
	form: { avtag: true, items: [] as any, atts: [] as any, edmen: [] as any, vimen: [] as any } as any,
}) as any;

const { form } = toRefs(state);

onMounted(async () => {
	await viewInit({ state, route });
	state.cate = await get({
		url: '/my/demo/cate/one/' + form.value.catid,
	});
	state.tabs = JSON.parse(state.cate.tjson);
	state.links = JSON.parse(state.cate.ljson);
	await catesInit();
	await gradesInit();
	linkInit();
	state.flowShow=true;
});

const linkInit = () => {
	for (const link of state.links) {
		let count = 0;
		for (const left of link.lefts) {
			if (left.coway == '>') {
				if (state.form[left.cokey] - 0 > left.coval - 0) {
					count++;
				}
			} else if (left.coway == '>=') {
				if (state.form[left.cokey] - 0 <= left.coval - 0) {
					count++;
				}
			} else if (left.coway == '=') {
				if (state.form[left.cokey] == left.coval) {
					count++;
				}
			} else if (left.coway == '<') {
				if (state.form[left.cokey] - 0 < left.coval - 0) {
					count++;
				}
			} else if (left.coway == '<=') {
				if (state.form[left.cokey] - 0 <= left.coval - 0) {
					count++;
				}
			} else if (left.coway == '!=') {
				if (state.form[left.cokey] - 0 != left.coval - 0) {
					count++;
				}
			}
		}
		if (count == link.lefts.length) {
			for (const right of link.rights) {
				if (right.efway == 'e2') {
					for (const tab of state.tabs) {
						for (const field of tab.fields) {
							if (field.name == right.efkey) {
								state[field.info] = JSON.parse(right.efval);
								break;
							}
						}
					}
				} else if (right.efway == 'e4') {
					for (const tab of state.tabs) {
						for (const field of tab.fields) {
							if (field.name == right.efkey) {
								field.shtag = (right.efval == 'true' ? true : right.efval == 1);
								break;
							}
						}
					}
				}
			}
		}
	}
};

// const _click = (func: any) => {
//   proxy[func]();
// };
const select1Show = (field: any, value: any) => {
	for (const option of state[field.info]) {
		if (option.id == value) {
			return option.name;
		}
	}
};

const select2Show = (field: any, value: any) => {
	for (const item of state[field.info]) {
		if (item.id == value) {
			return item.name;
		}
		if (item.children) {
			for (const item2 of item.children) {
				if (item2.id == value) {
					return item2.name;
				}
				if (item2.children) {
					for (const item3 of item2.children) {
						if (item3.id == value) {
							return item3.name;
						}
						if (item3.children) {
							for (const item4 of item3.children) {
								if (item4.id == value) {
									return item4.name;
								}
							}
						}
					}
				}
			}
		}
	}
};

//region -----组织架构逻辑-----
const cdata = reactive({}) as any;

cdata.opman = computed(() => {
	return form.value.opman ? form.value.opman.name : '';
});

cdata.vimen = computed(() => {
	let names = '';
	if (form.value.vimen && form.value.vimen.length > 0) {
		for (const user of form.value.vimen) {
			names += user.name + '；';
		}
	}
	return names;
});

cdata.edmen = computed(() => {
	let names = '';
	if (form.value.edmen && form.value.edmen.length > 0) {
		for (const user of form.value.edmen) {
			names += user.name + '；';
		}
	}
	return names;
});
//endregion

//region -----地址选择逻辑-----
// const amapRef = ref();
// const addreModal = () => {
//   amapRef.value.openModal({ adcoo: form.value.adcoo, adreg: form.value.adreg, addet: form.value.addet, adzoo: '' });
// };
//endregion


//region -----附件逻辑-----
const handleAtt = async (id: string) => {
	ElMessageBox.confirm('请选择对应的附件操作', '附件操作',
		{
			confirmButtonText: '下载',
			cancelButtonText: '预览',
			type: 'info',
		},
	).then(async () => {
		await get({
			url: '/gen/oss/download',
			// params: { name: uploadFile.name, path: uploadFile.addre + '/' + uploadFile.id + '.' + uploadFile.sname },
			params: { table: 'my_demo_att', id: id },
			responseType: 'blob',
		});
	}).catch(() => {

	});
};
//endregion


//region-----业务字典-----
const catesInit = async () => {
	state.cates = await get({
		url: '/my/demo/cate/treea',
	});
};

const gradesInit = async () => {
	state.grades = await get({
		url: '/ass/dict/data/list?maiid=DEMO_GRADE',
	});
};
//endregion

const submit = async (zbpm: any) => {
	form.value.zbpm = zbpm;
	await tabSave({formRef:formRef.value,state,proxy,route})
};
</script>
