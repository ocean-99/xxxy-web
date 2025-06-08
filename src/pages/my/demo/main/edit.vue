<template>
	<el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
		<template #header>
			<div class='zjustify'>
				<div>
					<div style='line-height: 32px'>DEMO编辑</div>
				</div>
				<div>
					<el-button type='success' @click='save' plain>保 存</el-button>
					<el-button type='info' @click='tabClose({proxy,route})' plain>关 闭</el-button>
				</div>
			</div>
		</template>
		<div style='margin-top: 8px;margin-bottom: 8px'>
			<el-form ref='formRef' :inline='true' class='zform' :model='form' label-width='140px'>
				<el-tabs type='card' v-model='activeName'>
					<el-tab-pane label='基本信息' name='tab1'>
						<div class='zform-div'>
							<el-form-item label='DEMO名称：' prop='name' style='width:50%' :rules="[{ required: true, message: '名称不能为空'}]">
								<el-input v-model='form.name' />
							</el-form-item>
							<el-form-item label='DEMO分类：' prop='catid' style='width:25%' :rules="[{ required: true, message: '客户分类不能为空'}]">
								<div class='zinput'>{{ select2Show('cates', form.catid) }}</div>
								<!--								<el-tree-select placeholder='请选择' default-expand-all :props="{value:'id',label:'name'}" v-model='form.catid' :data='state.cates'-->
								<!--																check-strictly style='width: 100%;' clearable />-->
							</el-form-item>
							<el-form-item label='DEMO编号：' style='width: 25%'>
								<span class='zinput' v-show='form.id' style='margin-left: 5px;color: green'>{{ form.senum }}</span>
								<span class='zinput' v-show='!form.id' style='margin-left: 5px;color: #b9abab'>提交后自动生成</span>
							</el-form-item>
							<el-form-item label='DEMO地址：' style='width: 100%'>
								<el-input v-model='form.addre' readonly @click='chooseAddr'></el-input>
							</el-form-item>
							<el-form-item label='DEMO等级：' style='width: 50%'>
								<el-select v-model='form.grade' placeholder='请选择' style='width: 100%'>
									<el-option v-for='item in state.grades' :key='item.id' :value='item.id' :label='item.name' />
								</el-select>
							</el-form-item>
							<el-form-item label='经办人：' style='width: 50%'>
								<el-input v-model='cdata.opman' @click='opmanModal' readonly></el-input>
							</el-form-item>
							<el-form-item label='DEMO明细行：' style='width: 100%'>
								<el-table size='small' border :data='form.items' :row-style="{height: '36px'}" style='width: 100%'>
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
              <el-form-item label='更新人：' style='width: 50%'>
                <div class='zinput'> {{ form.upman ? form.upman.name : '' }}</div>
              </el-form-item>
              <el-form-item label='更新时间：' style='width: 50%'>
                <div class='zinput'> {{ form.uptim }}</div>
              </el-form-item>
<!--              <el-form-item />-->
						</div>
					</el-tab-pane>
					<el-tab-pane label='权限信息' name='tab9'>
						<div class='zform-div'>
							<el-form-item label='备注：' style='width: 100%'>
								<el-input type='textarea' :rows='4' v-model='form.notes' />
							</el-form-item>
							<el-form-item label='可查看者：' style='width: 50%'>
								<el-input type='textarea' :rows='4' v-model='cdata.vimen' readonly @click='vimenModal'>
								</el-input>
							</el-form-item>
							<el-form-item label='可编辑者：' style='width: 50%'>
								<el-input type='textarea' :rows='4' v-model='cdata.edmen' readonly @click='edmenModal'>
								</el-input>
							</el-form-item>
							<el-form-item label='创建人：' style='width: 50%'>
								<div class='zinput'>{{ form.crman ? form.crman.name : '' }}</div>
							</el-form-item>
							<el-form-item label='创建时间：' style='width: 50%'>
								<div class='zinput'> {{ form.crtim }}</div>
							</el-form-item>
							<el-form-item label='更新人：' style='width: 50%'>
								<div class='zinput'> {{ form.upman ? form.upman.name : '' }}</div>
							</el-form-item>
							<el-form-item label='更新时间：' style='width: 50%'>
								<div class='zinput'> {{ form.uptim }}</div>
							</el-form-item>
						</div>
					</el-tab-pane>
					<el-tab-pane label='流程信息' name='tab11' v-if='form.protd'>
						<BpmEdit :temid='form.protd' ref='bpmRef' />
					</el-tab-pane>
				</el-tabs>
			</el-form>
		</div>
		<Amap ref='amapRef' @close='closeAmap' />
		<OrgModal ref='orgModal' @close='closeOrgModal' />
	</el-card>
</template>
<script lang='ts'>
export default { name: 'MyDemoMainEdit' };
</script>
<script lang='ts' setup>
import { computed, getCurrentInstance, onMounted, reactive, ref, toRaw, toRefs } from 'vue';
import { editInit, tabClose, tabSave } from '/@/comps/page/edit';
import { useRoute } from 'vue-router';
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus';
import {get} from '/@/utils/req';
import OrgModal from '/@/comps/sys/OrgModal.vue';
import Amap from '/@/comps/ass/amap.vue';
import { uuid } from '/@/utils/xutil';
import type { UploadProps } from 'element-plus';
import { Session } from '/@/utils/storage';
import BpmEdit from '/@/comps/bpm/edit.vue';

const route = useRoute();
const formRef = ref<FormInstance>();
const { proxy } = getCurrentInstance() as any;
const activeName = ref('tab1');

const state = reactive({
	url: '/my/demo/main', cates: [] as any, grades: [] as any,
	params: { path: '', query: '' },
	form: { avtag: true, items: [] as any, atts: [] as any, edmen: [] as any, vimen: [] as any } as any,
	uploadUrl: '', headers: {} as any,
}) as any;

const { form } = toRefs(state);
const bpmRef = ref() as any;


onMounted(async () => {
	state.uploadUrl = `${import.meta.env.VITE_API_URL}gen/oss/upload`;
	state.headers = { 'Authorization': Session.get('token') };
	await editInit({ state, route });
	if (!route.query?.id) {
		form.value.catid = route.query?.catid;
	}
	state.cate = await get({
		url: '/my/demo/cate/one/' + form.value.catid,
	});
	if(state.cate.prtag){
		form.value.protd = state.cate.protd;
	}
	await catesInit();
	await gradesInit();
});

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
const orgModal = ref();
const cdata = reactive({}) as any;

const opmanModal = () => {
	orgModal.value.openModal({
		opener: 'opman',
		orgType: 8,
	});
};

const vimenModal = () => {
	orgModal.value.openModal({
		opener: 'vimen',
		orgType: 11,
		selectMode: 2,
		orgs: toRaw(form.value.vimen),
	});
};

const edmenModal = () => {
	orgModal.value.openModal({
		opener: 'edmen',
		orgType: 11,
		selectMode: 2,
		orgs: toRaw(form.value.edmen),
	});
};

const closeOrgModal = (data: any) => {
	if (data.opener == 'vimen') {
		if (data.orgs && data.orgs.length > 0) {
			form.value.vimen = data.orgs;
		} else {
			form.value.vimen = null;
		}
	} else if (data.opener == 'edmen') {
		if (data.orgs && data.orgs.length > 0) {
			form.value.edmen = data.orgs;
		} else {
			form.value.edmen = null;
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
	if (form.value.items.length > 0) {
		newOrnum = form.value.items[form.value.items.length - 1].ornum + 1;
	}
	if (form.value.id) {
		form.value.items.push({
			id: uuid(), maiid: form.value.id, ornum: newOrnum,
		});
	} else {
		form.value.items.push({
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
		await get({
			url: '/gen/oss/download',
			// params: { name: uploadFile.name, path: uploadFile.addre + '/' + uploadFile.id + '.' + uploadFile.sname },
			params: { table: 'my_demo_att', id: uploadFile.id },
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

const save = async () => {
	if(form.value.protd){
		form.value.zbpm = bpmRef.value.getOperateInfo();
	}
	await tabSave({formRef:formRef.value,state,proxy,route,flush:state.url})
};


</script>
