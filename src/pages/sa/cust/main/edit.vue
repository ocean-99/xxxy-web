<template>
	<el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
		<template #header>
			<el-row>
				<el-col :span='10'>
					<div style='line-height: 32px'>客户编辑</div>
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
							<el-form-item label='客户名称：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]">
								<el-input v-model='form.name'></el-input>
							</el-form-item>
							<el-form-item label='客户分类：' prop='catid' :rules="[{ required: true, message: '分类不能为空'}]" style='width: 25%'>
								<el-select v-model='form.catid' style='width: 100%'>
									<el-option v-for='item in state.cates' :key='item.id' :label='item.name' :value='item.id' />
								</el-select>
							</el-form-item>
							<el-form-item label='客户编号：' style='width: 25%'>
								<span v-show='form.id' style='margin-left: 5px;color: green'>{{ form.senum }}</span>
								<span v-show='!form.id' style='margin-left: 5px;color: #b9abab'>提交后自动生成</span>
							</el-form-item>
							<el-form-item label='客户地址：' style='width: 100%'>
								<el-input v-model='form.addre' readonly @click='chooseAddr'></el-input>
							</el-form-item>
						</div>
					</el-tab-pane>

					<el-tab-pane label='权限信息' name='tab9'>
						<Perm ref='permRef' :form='form' v-if='state.permShow' @update='update' :orgModal='orgModal' />
					</el-tab-pane>
				</el-tabs>
			</el-form>
		</div>
		<div id='simpleSquare'></div>
		<OrgModal ref='orgModal' @close='closeOrgModal' />
		<Amap ref='amapRef' @close='closeAmap' />
	</el-card>
</template>
<script lang='ts'>
export default { name: 'SaCustMainEdit' };
</script>
<script lang='ts' setup>
import {getCurrentInstance, onMounted, reactive, ref, toRaw, toRefs } from 'vue';
import { editInit, tabSave, tabClose } from '/@/comps/page/edit';
import { useRoute } from 'vue-router';
import OrgModal from '/@/comps/sys/OrgModal.vue';
import Amap from '/@/comps/ass/amap.vue';
import { FormInstance } from 'element-plus';
import request from '/@/utils/request';
import Perm from './perm.vue';

const route = useRoute();
const formRef = ref<FormInstance>();
const { proxy } = getCurrentInstance() as any;
const activeName = ref('tab1');

const state = reactive({
	url: '/sa/cust/main',permShow: false,
	params: { path: '', query: '' }, levels: [] as any, cates: [] as any,
	form: { avtag: true, items: [] as any } as any,
});

const { form } = toRefs(state);

onMounted(async () => {
	await editInit({ state, route });
	await catesInit();
	state.permShow=true;
});

//region 组织架构选择逻辑
const orgModal = ref();
const permRef = ref();
const closeOrgModal = (data: any) => {
	permRef.value.closeOrgModal(data);
};
const update = (props: any) => {
	for (const prop in props) {
		form.value[prop] = toRaw(props[prop]);
	}
};
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
const catesInit = async () => {
	state.cates = await request({
		url: '/sa/agent/cate/list',
		method: 'get',
	});
};
//endregion

</script>

<style scoped>

</style>
