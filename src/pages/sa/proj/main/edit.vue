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
import { FormInstance } from 'element-plus';
import request from '/@/utils/request';
import { tabSave, tabClose } from '/@/comps/page/edit';
import Amap from '/@/comps/ass/amap.vue';
import OrgModal from '/@/comps/sys/OrgModal.vue';
import CustModal from '/@/comps/gen/GenModal.vue';
import AgentModal from '/@/comps/gen/GenModal.vue';
import Perm from './perm.vue';

const route = useRoute();
const formRef = ref<FormInstance>();
const { proxy } = getCurrentInstance() as any;
const activeName = ref('tab1');

const state = reactive({
	url: '/sa/proj/main', permShow: false,
	params: { path: '', query: '' }, levels: [] as any,
	form: { avtag: true, items: [] as any } as any,
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

//region ------客户与代理商选择逻辑------
const agentModal = ref();
const chooseAgent = () => {
	agentModal.value.openModal();
};
const agentModalChoose = (data:any) => {
		form.value.ageid=data?data.id:null;
		form.value.agena=data?data.name:null;
};


const custModal = ref();
const chooseCust = () => {
	custModal.value.openModal();
};
const custModalChoose = (data: any) => {
	form.value.cusid=data.id;
	form.value.cusna=data.name;
};

//endregion


//region ------组织架构选择逻辑------
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


</script>

<style scoped>

</style>
