<template>
	<el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
		<template #header>
			<div class='zjustify'>
				<div>
					<div style='line-height: 32px'>公司信息编辑</div>
				</div>
				<div>
					<el-button type='success' @click='save' plain>保 存</el-button>
					<el-button type='info' @click='tabClose({proxy,route})' plain>关 闭</el-button>
				</div>
			</div>
		</template>
		<div style='margin-top: 8px;margin-bottom: 8px'>
			<el-form ref='formRef' :inline='true' class='zform' :model='form' label-width='140px'>
				<div class='zform-div'>
					<el-form-item label='代理商名称：' prop='name' style='width:100%' :rules="[{ required: true, message: '名称不能为空'}]">
						<el-input v-model='form.name' />
					</el-form-item>
					<el-form-item label='公司地址：' style='width: 100%'>
						<el-input v-model='form.addre'/>
					</el-form-item>
					<el-form-item label='销售机构：'>
						<el-input v-model='form.brana' disabled/>
					</el-form-item>
					<el-form-item label='代理商编号：'>
						<span class='zinput' v-show='form.id' style='margin-left: 5px;color: green'>{{ form.senum }}</span>
						<span class='zinput' v-show='!form.id' style='margin-left: 5px;color: #b9abab'>提交后自动生成</span>
					</el-form-item>
					<el-form-item label='税务登记号：'>
						<el-input v-model='form.renum' />
					</el-form-item>
					<el-form-item label='法人代表：'>
						<el-input v-model='form.leman' />
					</el-form-item>
					<el-form-item label='公司电话：' >
						<el-input v-model='form.cotel' />
					</el-form-item>
					<el-form-item label='公司传真：' >
						<el-input v-model='form.cofax' />
					</el-form-item>
					<el-form-item label='成立日期：' >
						<el-input v-model='form.redat' />
					</el-form-item>
					<el-form-item label='注册资金（万）：' >
						<el-input v-model='form.recap' />
					</el-form-item>
					<el-form-item label='邮编：' >
						<el-input v-model='form.cozip' />
					</el-form-item>
					<el-form-item label='公司邮箱：' >
						<el-input v-model='form.comai' />
					</el-form-item>
					<el-form-item label='关联企业：' style='width: 100%'>
						<el-input v-model='form.licos' />
					</el-form-item>
					<el-form-item label='备注：' style='width: 100%'>
						<el-input type='textarea' :rows='4' v-model='form.notes' />
					</el-form-item>
					<el-form-item label='相关附件：' style='width: 100%'>
						<el-upload
							:action='state.uploadUrl' :headers='state.headers'
							:on-preview='handlePreview' style='width:800px' :on-success='handleSuccess'
							:on-remove='handleRemove'
							multiple :limit='10' :on-exceed='handleExceed' v-model:file-list='form.atts'>
							<el-button type='primary'>上传附件</el-button>
						</el-upload>
					</el-form-item>
					<el-form-item label='创建人：' style='width: 25%'>
						<div class='zinput'>{{ form.crman ? form.crman.name : '' }}</div>
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
			</el-form>
		</div>
		<Amap ref='amapRef' @close='closeAmap' />
		<OrgModal ref='orgModal' @close='closeOrgModal' />
	</el-card>
</template>
<script lang='ts'>
export default { name: 'DcDistCorpEdit' };
</script>
<script lang='ts' setup>
import { computed, getCurrentInstance, onMounted, reactive, ref, toRaw, toRefs } from 'vue';
import { tabClose, tabSave } from '/@/comps/page/edit';
import { useRoute } from 'vue-router';
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus';
import {get} from '/@/utils/req';
import OrgModal from '/@/comps/sys/OrgModal.vue';
import Amap from '/@/comps/ass/amap.vue';
import { uuid } from '/@/utils/xutil';
import type { UploadProps } from 'element-plus';
import { Session } from '/@/utils/storage';

const route = useRoute();
const formRef = ref<FormInstance>();
const { proxy } = getCurrentInstance() as any;

const state = reactive({
	url: '/dc/dist/corp', cates: [] as any, grades: [] as any,
	params: { path: '', query: '' },
	form: { avtag: true, items: [] as any, atts: [] as any } as any,
	uploadUrl: '', headers: {} as any,
}) as any;

const { form } = toRefs(state);
const bpmRef = ref() as any;


onMounted(async () => {
	state.uploadUrl = `${import.meta.env.VITE_API_URL}gen/oss/upload`;
	state.headers = { 'Authorization': Session.get('token') };

	state.form = await get({url: state.url + '/info'});
});

//region -----组织架构逻辑-----
const orgModal = ref();
const cdata = reactive({}) as any;

const opmanModal = () => {
	orgModal.value.openModal({
		opener: 'opman',
		orgType: 8,
	});
};



const closeOrgModal = (data: any) => {
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
};

cdata.opman = computed(() => {
	return form.value.opman ? form.value.opman.name : '';
});

//endregion

//region -----地址选择逻辑-----
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


//region -----附件逻辑-----
const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
	console.log(file, uploadFiles);
};

const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
	console.log(uploadFile);
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
			params: { table: 'sa_dist_att', id: uploadFile.id },
			responseType: 'blob',
		});
	}).catch(() => {

	});
};

const handleSuccess = (a: any, b: any, c: any) => {
	// c[c.length - 1] = { ...a };
	c[c.length - 1].id = a.id;
	// c[c.length - 1].name = a.name+" ["+a.size+"]";
	c[c.length - 1].name = a.name;
	c[c.length - 1].filid = a.filid;
	c[c.length - 1].filna = a.filna;
	c[c.length - 1].path = a.path;
	c[c.length - 1].ornum = c.length;
	if (form.value.id) {
		c[c.length - 1].busid = form.value.id;
	}
};

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
	ElMessage.warning(
		`The limit is 3, you selected ${files.length} files this time, add up to ${
			files.length + uploadFiles.length
		} totally`,
	);
};
//endregion


const save = async () => {
	await tabSave({formRef:formRef.value,state,proxy,route,flush:state.url})
};


</script>
