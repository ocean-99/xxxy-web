<template>
	<el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
		<template #header>
			<div class='zjustify'>
				<div>
					<div style='line-height: 32px'>DEMO查看</div>
				</div>
				<div>
					<el-button type='success' @click='viewToEdit({proxy,route,state})' plain>编 辑</el-button>
					<el-button type='info' @click='tabClose({proxy,route})' plain>关 闭</el-button>
				</div>
			</div>
		</template>
		<div style='margin-top: 8px;margin-bottom: 8px'>
			<el-form ref='formRef' disabled :inline='true' class='zform' :model='form' label-width='140px'>
				<el-tabs type='card' v-model='activeName'>
					<el-tab-pane label='基本信息' name='tab1'>
						<div class='zform-div'>
							<el-form-item label='DEMO名称：'>
								<div class='zinput'>{{ form.name }}</div>
							</el-form-item>
							<el-form-item label='DEMO分类：' style='width:25%'>
								<div class='zinput'>{{ select2Show("cates", form.catid) }}</div>
							</el-form-item>
							<el-form-item label='DEMO编号：' style='width: 25%'>
								<span class='zinput' style='margin-left: 5px;color: green'>{{ form.senum }}</span>
							</el-form-item>
							<el-form-item label='DEMO地址：' style='width: 100%'>
								<div class='zinput'>{{ form.addre }}</div>
							</el-form-item>
							<el-form-item label='DEMO等级：' style='width: 50%'>
								<div class='zinput'>{{ select1Show("grades", form.grade) }}</div>
							</el-form-item>
							<el-form-item label='经办人：' style='width: 50%'>
								<div class='zinput'>{{ cdata['opman'] }}</div>
							</el-form-item>
							<el-form-item label='DEMO明细行：' style='width: 100%'>
								<el-table size='small' border :data='form.items' :row-style="{height: '36px'}" style='width: 100%'>
									<el-table-column label='#' width='40' prop='ornum' header-align='center' align='center'/>
									<el-table-column label='姓名' width='100' prop='name'/>
									<el-table-column label='手机号' width='150' prop='monum'/>
									<el-table-column label='邮箱' width='150' prop='email'/>
									<el-table-column label='性别' width='80'>
										<template #default='scope'>
											{{ select1Show("genders", scope.row.gender) }}
										</template>
									</el-table-column>
									<el-table-column label='职务' width='180' prop='post'/>
									<el-table-column label='备注'>
										<template #header>
											<div style='height: 32px;line-height: 32px'>备注</div>
										</template>
										<template #default='scope'>
											{{scope.row.notes}}
										</template>
									</el-table-column>
								</el-table>
							</el-form-item>
							<el-form-item label='相关附件：' style='width: 100%'>
								<ul>
									<li :key='att.id' v-for='att in form.atts' @click='handleAtt(att.id)' style='cursor: pointer;list-style: none;'>{{ att.name }}</li>
								</ul>
							</el-form-item>
						</div>
					</el-tab-pane>
					<el-tab-pane label='权限信息' name='tab9'>
						<div class='zform-div'>
							<el-form-item label='备注：' style='width: 100%'>
								<div class='ztextarea'>{{ form.notes }}</div>
							</el-form-item>
							<el-form-item label='可查看者：' style='width: 50%'>
								<div class='ztextarea'>{{ cdata['vimen'] }}</div>
							</el-form-item>
							<el-form-item label='可编辑者：' style='width: 50%'>
								<div class='ztextarea'>{{ cdata['edmen'] }}</div>
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
					<el-tab-pane label='流程流转' name='tab11' v-if='form.protd'>
							<BpmView @submit='submit' :proid='form.id' modty="app_demo"/>
					</el-tab-pane>
				</el-tabs>
			</el-form>
		</div>
		<Amap ref='amapRef' />
	</el-card>
</template>
<script lang='ts' setup>
import { computed, getCurrentInstance, onMounted, reactive, ref, toRefs } from 'vue';
import { viewInit, tabClose, viewToEdit } from '/@/comps/page/view';
import { useRoute } from 'vue-router';
import { ElMessageBox, FormInstance } from 'element-plus';
import request from '/@/utils/request';
import Amap from '/@/comps/ass/amap.vue';
import BpmView from '/@/comps/bpm/view.vue';
import { tabSave } from '/@/comps/page/edit';

const route = useRoute();
const formRef = ref<FormInstance>();
const { proxy } = getCurrentInstance() as any;
const activeName = ref('tab1');

const state = reactive({
	url: '/my/demo/main', cates: [] as any, grades: [] as any,
	params: { path: '', query: '' }, cate: {} as any, tabs: [] as any, links: [] as any,
	form: { avtag: true, items: [] as any, atts: [] as any, edmen: [] as any, vimen: [] as any } as any,
	genders:[{id:'m',name:'男'},{id:"f",name:'女'}]
}) as any;

const { form } = toRefs(state);

onMounted(async () => {
	await viewInit({ state, route });
	state.cate = await request({
		url: '/my/demo/cate/one/' + form.value.catid,
		method: 'get',
	});
	await catesInit();
	await gradesInit();
});


// const _click = (func: any) => {
//   proxy[func]();
// };
const select1Show = (info: any, value: any) => {
	for (const option of state[info]) {
		if (option.id == value) {
			return option.name;
		}
	}
};

const select2Show = (info: any, value: any) => {
	for (const item of state[info]) {
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
		await request({
			url: '/gen/oss/download',
			method: 'get',
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
	state.cates = await request({
		url: '/my/demo/cate/treea',
		method: 'get',
	});
};

const gradesInit = async () => {
	state.grades = await request({
		url: '/ass/dict/data/list?maiid=DEMO_GRADE',
		method: 'get',
	});
};
//endregion

const submit = async (zbpm: any) => {
	form.value.zbpm = zbpm;
	await tabSave({formRef:formRef.value,state,proxy,route})
};
</script>
