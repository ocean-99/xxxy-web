<template>
	<el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
		<template #header>
			<el-row>
				<el-col :span='10'>
					<div style='line-height: 32px'>供应商编辑</div>
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
							<el-form-item label='供应商名称：' prop='name' style='width:50%' :rules="[{ required: true, message: '名称不能为空'}]">
								<el-input v-model='form.name' />
							</el-form-item>
							<el-form-item label='供应商分类：' prop='catid' style='width:25%' :rules="[{ required: true, message: '客户分类不能为空'}]">
								<el-tree-select placeholder='请选择' default-expand-all :props="{value:'id',label:'name'}" v-model='form.catid' :data='state.cates'
																check-strictly style='width: 100%;' clearable />
							</el-form-item>
							<el-form-item label='供应商编号：' style='width: 25%'>
								<span class='zinput' v-show='form.id' style='margin-left: 5px;color: green'>{{ form.senum }}</span>
								<span class='zinput' v-show='!form.id' style='margin-left: 5px;color: #b9abab'>提交后自动生成</span>
							</el-form-item>
							<el-form-item label='供应商地址：' style='width: 100%'>
								<el-input v-model='form.addre' readonly @click='chooseAddr'></el-input>
							</el-form-item>
							<el-form-item label='供应商资质：' style='width: 50%'>
								<el-select v-model='form.level' placeholder='请选择' style='width: 100%'>
									<el-option v-for='item in state.levels' :key='item.id' :value='item.id' :label='item.name' />
								</el-select>
							</el-form-item>
							<el-form-item label='经办人：' style='width: 50%'>
								<el-input v-model='opmanName' @click='openOpmanModal' readonly></el-input>
							</el-form-item>
							<el-form-item label='联系人：' style='width: 100%'>
								<el-table size='small' border :data='form.contacts' :row-style="{height: '36px'}" style='width: 100%'>
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
												<ele-CircleClose @click='form.contacts.splice(scope.$index, 1)' />
											</el-icon>
										</template>
									</el-table-column>
								</el-table>
							</el-form-item>
							<el-form-item label='相关附件：' style='width: 100%'>
								<el-upload
									:action='state.uploadUrl' :headers='state.headers'
									:on-preview='handlePreview' style='width:500px' :on-success='handleSuccess'
									:on-remove='handleRemove'
									multiple :limit='10' :on-exceed='handleExceed' :file-list='form.atts'>
									<el-button type='primary'>上传附件</el-button>
								</el-upload>
							</el-form-item>
						</div>
					</el-tab-pane>
					<el-tab-pane label='权限信息' name='tab9'>
						<div class='yform-div'>
							<el-form-item label='备注：' style='width: 100%'>
								<el-input type='textarea' :rows='4' v-model='form.notes' />
							</el-form-item>
							<el-form-item label='可查看者：' style='width: 50%'>
								<el-input type='textarea' :rows='4' v-model='viewersName' readonly @click='openViewersModal'>
								</el-input>
							</el-form-item>
							<el-form-item label='可编辑者：' style='width: 50%'>
								<el-input type='textarea' :rows='4' v-model='editorsName' readonly @click='openEditorsModal'>
								</el-input>
							</el-form-item>
							<el-form-item label='创建人：' style='width: 25%'>
								{{ form.crman ? form.crman.name : '' }}
							</el-form-item>
							<el-form-item label='创建时间：' style='width: 25%'>
								<div class='zinput'> {{ form.crtim }}</div>
							</el-form-item>
							<el-form-item label='更新人：' style='width: 25%'>
								{{ form.upman ? form.upman.name : '' }}
							</el-form-item>
							<el-form-item label='更新时间：' style='width: 25%'>
								<div class='zinput'> {{ form.uptim }}</div>
							</el-form-item>
						</div>
					</el-tab-pane>
				</el-tabs>
			</el-form>
		</div>
		<OrgModal ref='orgModal' @close='closeOrgModal' />
		<Amap ref='amapRef' @close='closeAmap' />
	</el-card>
</template>
<script lang='ts'>
export default { name: 'DeCustMainEdit}' };
</script>
<script lang='ts' setup>
import { computed, getCurrentInstance, onMounted, reactive, ref, toRaw, toRefs } from 'vue';
import { editInit, tabSave, tabClose } from '/@/comps/page/edit';
import { useRoute } from 'vue-router';
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus';
import request from '/@/utils/request';
import OrgModal from '/@/comps/sys/OrgModal.vue';
import Amap from '/@/comps/ass/amap.vue';
import { uuid } from '/@/utils/xutil';
import type { UploadProps } from 'element-plus';
import { Session } from '/@/utils/storage';

const route = useRoute();
const formRef = ref<FormInstance>();
const { proxy } = getCurrentInstance() as any;
const activeName = ref('tab1');

const state = reactive({
	url: '/de/supp/main', cates: [] as any, levels: [] as any,
	params: { path: '', query: '' },
	form: { avtag: true, contacts: [] as any, atts: [] as any } as any,
	uploadUrl: '', headers: {} as any,
});

const { form } = toRefs(state);


onMounted(async () => {
	await editInit({ state, route });
	await catesInit();
	await levelsInit();
	state.uploadUrl = `${import.meta.env.VITE_API_URL}gen/att/up`;
	state.headers = { 'Authorization': Session.get('token') };
});

//region -----组织架构逻辑-----
const orgModal = ref();

const openOpmanModal = () => {
	orgModal.value.openModal({
		opener: 'opman',
		orgType: 8,
	});
};

const openViewersModal = () => {
	orgModal.value.openModal({
		opener: 'viewers',
		orgType: 11,
		selectMode: 2,
		orgs: toRaw(form.value.viewers),
	});
};

const openEditorsModal = () => {
	orgModal.value.openModal({
		opener: 'editors',
		orgType: 11,
		selectMode: 2,
		orgs: toRaw(form.value.editors),
	});
};

const closeOrgModal = (data: any) => {
	if (data.opener == 'viewers') {
		if (data.orgs && data.orgs.length > 0) {
			form.value.viewers = data.orgs;
		} else {
			form.value.viewers = null;
		}
	} else if (data.opener == 'editors') {
		if (data.orgs && data.orgs.length > 0) {
			form.value.editors = data.orgs;
		} else {
			form.value.editors = null;
		}
	} else if (data.opener == 'opman') {
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

const opmanName = computed(() => {
	return form.value.opman ? form.value.opman.name : '';
});

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

//region -----联系人逻辑-----
const addItem = () => {
	let newOrnum = 1;
	if (form.value.contacts.length > 0) {
		newOrnum = form.value.contacts[form.value.contacts.length - 1].ornum + 1;
	}
	if (form.value.id) {
		form.value.contacts.push({
			id: uuid(), maiid: form.value.id, ornum: newOrnum,
		});
	} else {
		form.value.contacts.push({
			id: uuid(), ornum: newOrnum,
		});
	}
};
//endregiton


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
		await request({
			url: '/gen/att/path',
			method: 'get',
			params: { name: uploadFile.name, path: uploadFile.addre + '/' + uploadFile.id + '.' + uploadFile.sname },
			responseType: 'blob',
		});
	}).catch(() => {

	});
};

const handleSuccess = (a: any, b: any, c: any) => {
	c[c.length - 1] = { ...a };
	c[c.length - 1].name = a.pname + '.' + a.sname;
};

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
	ElMessage.warning(
		`The limit is 3, you selected ${files.length} files this time, add up to ${
			files.length + uploadFiles.length
		} totally`,
	);
};
//endregion


//region-----业务字典-----
const catesInit = async () => {
	state.cates = await request({
		url: '/de/supp/cate/treea',
		method: 'get',
	});
};

const levelsInit = async () => {
	state.levels = await request({
		url: '/ass/dict/data/list?maiid=SU_LEVEL',
		method: 'get',
	});
};
//endregion


</script>
