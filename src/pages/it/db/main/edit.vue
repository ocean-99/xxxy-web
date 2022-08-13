<template>
	<el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
		<template #header>
			<el-row>
				<el-col :span='10'>
					<div style='line-height: 32px'>数据库编辑</div>
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
							<el-form-item label='数据库名称：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]">
								<el-input v-model='form.name' />
							</el-form-item>
							<el-form-item label='数据库分类：' prop='catid' :rules="[{ required: true, message: '数据库分类不能为空'}]">
								<el-tree-select placeholder='请选择' default-expand-all :props="{value:'id',label:'name'}" v-model='form.catid' :data='state.cates'
																check-strictly style='width: 100%;' clearable />
							</el-form-item>
<!--							<el-form-item label='管理员：' style='width: 50%'>-->
<!--								<el-input v-model='opmanName' @click='openOpmanModal' readonly></el-input>-->
<!--							</el-form-item>-->
              <el-form-item label='JdbcUrl：' style="width: 100%" prop='url' :rules="[{ required: true, message: 'JdbcUrl不能为空'}]">
                <el-input v-model='form.url' />
              </el-form-item>
              <el-form-item label='数据库类型：' style="width: 25%" prop='type' :rules="[{ required: true, message: '数据库类型不能为空'}]">
                <el-select v-model='form.type' placeholder='请选择' style='width: 100%'>
                  <el-option :value="'mysql'" :label="'mysql'"></el-option>
                  <el-option :value="'oracle'" :label="'oracle'"></el-option>
                  <el-option :value="'sqlserver'" :label="'sqlserver'"></el-option>
                  <el-option :value="'db2'" :label="'db2'"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label='账号：' style="width: 25%" prop='acnum' :rules="[{ required: true, message: '账号不能为空'}]">
                <el-input v-model='form.acnum' />
              </el-form-item>
              <el-form-item label='密码：' prop='pacod' :rules="[{ required: true, message: '密码不能为空'}]">
                <el-input v-model='form.pacod' type="password" style="width:200px;margin-right: 10px"/>
                <el-button type='success' @click='test({formRef,state,proxy,route})' plain>测 试</el-button>
              </el-form-item>
							<el-form-item label='账号清单：' style='width: 100%'>
								<el-table size='small' border :data='form.accounts' :row-style="{height: '36px'}" style='width: 100%'>
									<el-table-column label='排序号' width='90'>
										<template #default='scope'>
											<el-input-number v-model='scope.row.ornum' controls-position='right' style='width: 100%' />
										</template>
									</el-table-column>
									<el-table-column label='账号' width='100'>
										<template #default='scope'>
											<el-input v-model='scope.row.acnum' required></el-input>
										</template>
									</el-table-column>
									<el-table-column label='密码' width='150'>
										<template #default='scope'>
											<el-input v-model='scope.row.pacod' type="password" required></el-input>
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
												<ele-CircleClose @click='form.accounts.splice(scope.$index, 1)' />
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
									multiple :limit='10' :on-exceed='handleExceed' v-model:file-list='form.atts'>
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
	</el-card>
</template>
<script lang='ts'>
export default { name: 'ItDbMainEdit}' };
</script>
<script lang='ts' setup>
import { computed, getCurrentInstance, onMounted, reactive, ref, toRaw, toRefs } from 'vue';
import { editInit, tabSave, tabClose } from '/@/comps/page/edit';
import { useRoute } from 'vue-router';
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus';
import request from '/@/utils/request';
import OrgModal from '/@/comps/sys/OrgModal.vue';
import { uuid } from '/@/utils/xutil';
import type { UploadProps } from 'element-plus';
import { Session } from '/@/utils/storage';

const route = useRoute();
const formRef = ref<FormInstance>();
const { proxy } = getCurrentInstance() as any;
const activeName = ref('tab1');

const state = reactive({
	url: '/it/db/main', cates: [] as any,
	params: { path: '', query: '' },
	form: { avtag: true, accounts: [] as any, atts: [] as any } as any,
	uploadUrl: '', headers: {} as any,
});

const { form } = toRefs(state);


onMounted(async () => {
	await editInit({ state, route });
	await catesInit();
	state.uploadUrl = `${import.meta.env.VITE_API_URL}gen/oss/upload`;
	state.headers = { 'Authorization': Session.get('token') };
});


const test=async ()=>{
  const result= await request({
    url: state.url+'/test',
    method: 'post',
    data: state.form,
  });
  if(result){
    ElMessage.success("测试成功");
  }else{
    ElMessage.error("测试失败");
  }
}

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


//region -----联系人逻辑-----
const addItem = () => {
	let newOrnum = 1;
	if (form.value.accounts.length > 0) {
		newOrnum = form.value.accounts[form.value.accounts.length - 1].ornum + 1;
	}
	if (form.value.id) {
		form.value.accounts.push({
			id: uuid(), maiid: form.value.id, ornum: newOrnum,
		});
	} else {
		form.value.accounts.push({
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
			params: { name: uploadFile.name, path: uploadFile.addre + '/' + uploadFile.id + '.' + uploadFile.sname },
			responseType: 'blob',
		});
	}).catch(() => {

	});
};

const handleSuccess = (a: any, b: any, c: any) => {
	c[c.length - 1] = { ...a };
	c[c.length - 1].name = a.pname + '.' + a.sname;
  if(form.value.id){
    c[c.length - 1].maiid=form.value.id;
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
		url: '/it/db/cate/treea',
		method: 'get',
	});
};
//endregion


</script>
