<template>
	<el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
		<template #header>
			<el-row>
				<el-col :span='10'>
					<div style='line-height: 32px'>项目查看</div>
				</el-col>
				<el-col :span='14' style='text-align: right'>
					<el-button type='success' @click='viewToEdit({proxy,route,state})' plain>编 辑</el-button>
					<el-button type='success' @click='editProd' plain>产品维护</el-button>
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
								<span class='zinput'>{{ form.addre }}</span>
							</el-form-item>
							<el-form-item label='代理商经办人：'>
								<span class='zinput'>{{ form.opmna }}</span>
							</el-form-item>

						</div>
					</el-tab-pane>
					<el-tab-pane label='产品信息' name='tab2'>
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
		<Amap ref='amapRef' @close='closeAmap' />
	</el-card>
</template>
<script lang='ts' setup>
import { computed, getCurrentInstance, onMounted, reactive, ref,  toRefs } from 'vue';
import { viewInit, tabClose, viewToEdit } from '/@/comps/page/view';
import { useRoute } from 'vue-router';
import OrgModal from '/@/comps/sys/OrgModal.vue';
import Amap from '/@/comps/ass/amap.vue';
import { FormInstance } from 'element-plus';
import request from '/@/utils/request';
import router from '/@/router';

const route = useRoute();
const formRef = ref<FormInstance>();
const { proxy } = getCurrentInstance() as any;
const activeName = ref('tab1');

const state = reactive({
	url: '/sa/proj/main',
	params: { path: '', query: '' }, levels: [] as any,
	form: { avtag: true, items: [] as any } as any,
});

const { form } = toRefs(state);


onMounted(async () => {
	await viewInit({ state, route });
	await levelsInit();
});


const editProd = async () => {
	proxy.mittBus.emit('onCurrentContextmenuClick', Object.assign({}, { contextMenuClickId: 1, ...route }));
	await router.push({
		path: '/sa/prod/main',
		query: { proj:state.form.id },
	});
};


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

//region 业务字典逻辑
const levelsInit = async () => {
	state.levels = await request({
		url: '/ass/dict/data/list?maiid=AG_LEVEL',
		method: 'get',
	});
};
//endregion

</script>

<style scoped>

</style>
