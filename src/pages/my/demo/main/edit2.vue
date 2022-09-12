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
					<el-tab-pane :label='item.label' v-for='item in state.tabs' :key='item.id' :name='item.name'>
						<div class='zform-div'>
							<el-form-item :key='field.label' v-for='field in item.fields' :label='field.shtag?field.label+"：":" "' :prop='field.name' :style='{ width: `${field.width}` }'
														:rules="[{ required: field.retag, message: field.label+'不能为空'}]" v-show='field.shtag||(!field.shtag&&field.width!=="100%")'>
								<div class='zinput' v-if='field.shtag===false' style='height: 32px'/>
								<el-input v-else-if='field.type==="input1"' v-model='form[field.name]' @change='fieldChange(field.name)' :disabled='field.ditag' />
								<el-select v-else-if='field.type==="select1"' v-model='form[field.name]' :disabled='field.ditag' style='width: 100%'>
									<el-option v-for='item in state[field.info]' :key='item.id' :value='item.id' :label='item.name' />
								</el-select>
								<el-tree-select v-else-if='field.type==="select2"' placeholder='请选择' default-expand-all :props="{value:'id',label:'name'}"
																v-model='form[field.name]' :data='state[field.info]'
																check-strictly style='width: 100%;' clearable filterable />
								<el-input v-else-if='field.type==="popup1"' v-model='form[field.name]' @click='_click(field.name+"Modal")' readonly
													input-style='cursor: pointer'>
									<template #suffix>
										<el-icon class='el-input__icon'>
											<Search @click='opmanModal' />
										</el-icon>
									</template>
								</el-input>
								<el-input v-else-if='field.type==="popup2"' v-model='cdata[field.name]' @click='_click(field.name+"Modal")' readonly
													input-style='cursor: pointer'>
									<template #suffix>
										<el-icon class='el-input__icon'>
											<Search @click='opmanModal' />
										</el-icon>
									</template>
								</el-input>
								<el-input v-else-if='field.type==="popup3"' type='textarea' :rows='4' v-model='cdata[field.name]' readonly
													@click='_click(field.name+"Modal")' />
								<el-input v-else-if='field.type==="textarea"' type='textarea' :rows='4' v-model='form[field.name]' :disabled='field.ditag' />
								<el-switch v-else-if='field.type==="switch"' v-model='form[field.name]' />
								<span class='zinput' v-else-if='field.type==="senum"' style='margin-left: 5px;color: green'>{{ form.senum ? form.senum : '提交后自动生成' }}</span>
								<span v-else-if='field.type==="readonly1"' class='zinput'>{{ form[field.name] ? form[field.name] : '#' }}</span>
								<span v-else-if='field.type==="readonly2"' class='zinput'>{{ form[field.name] ? form[field.name][field.info] : '#' }}</span>
								<el-upload v-else-if='field.type==="att"' :action='state.uploadUrl' :headers='state.headers' :on-preview='handlePreview' style='width:800px'
													 :on-success='handleSuccess' :on-remove='handleRemove' multiple :limit='10' :on-exceed='handleExceed'
													 v-model:file-list='form[field.name]'>
									<el-button type='primary'>上传附件</el-button>
								</el-upload>
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
					<el-tab-pane label='流程信息' name='tab11' v-if='state.flowShow&&form.protd'>
						<BpmEdit :tmpid='form.protd' ref='bpmRef' />
					</el-tab-pane>
				</el-tabs>
			</el-form>
		</div>
		<Amap ref='amapRef' @close='closeAmap' />
		<OrgModal ref='orgModal' @close='closeOrgModal' />
	</el-card>
</template>
<script lang='ts'>
export default { name: 'MyDemoMainEdit2' };
</script>
<script lang='ts' setup>
import { Search } from '@element-plus/icons-vue';
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
import BpmEdit from '/@/comps/bpm/edit.vue';

const route = useRoute();
const formRef = ref<FormInstance>();
const { proxy } = getCurrentInstance() as any;
const activeName = ref('tab1');

const state = reactive({
	url: '/my/demo/main', cates: [] as any, branchs: [] as any, grades: [] as any,
	params: { path: '', query: '' }, cate: {} as any, tabs: [] as any, links: [] as any,
	form: { avtag: true, items: [] as any, atts: [] as any, edmen: [] as any, vimen: [] as any } as any,
	uploadUrl: '', headers: {} as any,flowShow:false,
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

	state.cate = await request({
		url: '/my/demo/cate/one/' + form.value.catid,
		method: 'get',
	});

	state.tabs = JSON.parse(state.cate.tjson);
	state.links = JSON.parse(state.cate.ljson);
	if(state.cate.prtag){
		form.value.protd = state.cate.protd;
	}
	await catesInit();
	await gradesInit();
	linkInit();
	state.flowShow=true;
});

const fieldChange = (name: string) => {
	for (const link of state.links) {
		if (link.trkey == name) {
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
				// console.log('满足');
				for (const right of link.rights) {
					if (right.efway == 'e1') {
						state.form[right.efkey] = right.efval;
					} else if (right.efway == 'e2') {
						for (const tab of state.tabs) {
							for (const field of tab.fields) {
								if (field.name == right.efkey) {
									state[field.info] = JSON.parse(right.efval);
									break;
								}
							}
						}
					} else if (right.efway == 'e3') {
						for (const tab of state.tabs) {
							for (const field of tab.fields) {
								if (field.name == right.efkey) {
									field.retag = (right.efval == 'true' ? true : right.efval == 1);
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
					} else if (right.efway == 'e5') {
						for (const tab of state.tabs) {
							for (const field of tab.fields) {
								if (field.name == right.efkey) {
									field.ditag = (right.efval == 'true' ? true : right.efval == 1);
									break;
								}
							}
						}
					}
				}
			}
			// break;
		}
	}
};

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
			console.log('满足');
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
				} else if (right.efway == 'e3') {
					for (const tab of state.tabs) {
						for (const field of tab.fields) {
							if (field.name == right.efkey) {
								field.retag = (right.efval == 'true' ? true : right.efval == 1);
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
				} else if (right.efway == 'e5') {
					for (const tab of state.tabs) {
						for (const field of tab.fields) {
							if (field.name == right.efkey) {
								field.ditag = (right.efval == 'true' ? true : right.efval == 1);
								break;
							}
						}
					}
				}
			}
		}
	}
};


const _click = (func: any) => {
	proxy[func]();
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
const addreModal = () => {
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

//region -----明细行逻辑-----
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
		await request({
			url: '/gen/oss/download',
			method: 'get',
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

const save = async () => {
	if(form.value.protd){
		form.value.zbpm = bpmRef.value.getOperateInfo();
	}
	await tabSave({formRef:formRef.value,state,proxy,route,flush:state.url})
};
</script>
