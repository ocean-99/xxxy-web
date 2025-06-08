<template>
	<el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
		<template #header>
			<div class='zjustify'>
				<div>
					<div style='line-height: 32px'>公司信息查看</div>
				</div>
				<div>
					<el-button type='success' @click='viewToEdit({proxy,route,state})' plain>编 辑</el-button>
					<el-button type='info' @click='tabClose({proxy,route})' plain>关 闭</el-button>
				</div>
			</div>
		</template>
		<div style='margin-top: 8px;margin-bottom: 8px'>
			<el-form ref='formRef' disabled :inline='true' class='zform' :model='form' label-width='140px'>
				<div class='zform-div'>
					<el-form-item label='公司名称：' style='width: 100%'>
						<div class='zinput'>{{ form.name }}</div>
					</el-form-item>
					<el-form-item label='公司地址：' style='width: 100%'>
						<div class='zinput'>{{ form.addre }}</div>
					</el-form-item>
					<el-form-item label='公司编号：'>
						<span class='zinput' style='margin-left: 5px;color: green'>{{ form.senum }}</span>
					</el-form-item>
					<el-form-item label='销售机构：'>
						<div class='zinput'>{{ form.brana }}</div>
					</el-form-item>
					<el-form-item label='税务登记号：'>
						<div class='zinput'>{{ form.renum }}</div>
					</el-form-item>
					<el-form-item label='法人代表：'>
						<div class='zinput'>{{ form.leman }}</div>
					</el-form-item>
					<el-form-item label='公司电话：'>
						<div class='zinput'>{{ form.cotel }}</div>
					</el-form-item>
					<el-form-item label='公司传真：'>
						<div class='zinput'>{{ form.cofax }}</div>
					</el-form-item>
					<el-form-item label='成立日期：'>
						<div class='zinput'>{{ form.redat }}</div>
					</el-form-item>
					<el-form-item label='注册资金（万）：'>
						<div class='zinput'>{{ form.recap }}</div>
					</el-form-item>
					<el-form-item label='邮编：'>
						<div class='zinput'>{{ form.cozip }}</div>
					</el-form-item>
					<el-form-item label='公司邮箱：'>
						<div class='zinput'>{{ form.comai }}</div>
					</el-form-item>
					<el-form-item label='关联企业：' style='width: 100%'>
						<div class='zinput'>{{ form.licos }}</div>
					</el-form-item>
					<el-form-item label='备注：' style='width: 100%'>
						<div class='ztextarea'>{{ form.notes }}</div>
					</el-form-item>
					<el-form-item label='相关附件：' style='width: 100%'>
						<ul>
							<li :key='att.id' v-for='att in form.atts' @click='handleAtt(att.id)' style='cursor: pointer;list-style: none;'>{{ att.name }}</li>
						</ul>
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
			</el-form>
		</div>
		<Amap ref='amapRef' />
	</el-card>
</template>
<script lang='ts' setup>
import { computed, getCurrentInstance, onMounted, reactive, ref, toRefs } from 'vue';
import { tabClose, viewToEdit } from '/@/comps/page/view';
import { useRoute } from 'vue-router';
import { ElMessageBox, FormInstance } from 'element-plus';
import {get} from '/@/utils/req';
import Amap from '/@/comps/ass/amap.vue';

const route = useRoute();
const formRef = ref<FormInstance>();
const { proxy } = getCurrentInstance() as any;

const state = reactive({
	url: '/dc/dist/corp', cates: [] as any, grades: [] as any,
	params: { path: '', query: '' }, cate: {} as any, tabs: [] as any, links: [] as any,
	form: { avtag: true, items: [] as any, atts: [] as any, edmen: [] as any, vimen: [] as any } as any,
	genders: [{ id: 'm', name: '男' }, { id: 'f', name: '女' }],
}) as any;

const { form } = toRefs(state);

onMounted(async () => {
	state.form = await get({url: state.url + '/info'});
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
			params: { table: 'dc_dist_att', id: id },
			responseType: 'blob',
		});
	}).catch(() => {

	});
};
//endregion
</script>
