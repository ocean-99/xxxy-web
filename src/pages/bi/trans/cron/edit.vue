<template>
  <el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
    <template #header>
      <el-row>
        <el-col :span='10'>
          <div style='line-height: 32px'>转换任务编辑</div>
        </el-col>
        <el-col :span='14' style='text-align: right'>
          <el-button type='success' @click='tabSave({formRef,state,proxy,route})' plain>保 存</el-button>
          <el-button type='info' @click='tabClose({proxy,route})' plain>关 闭</el-button>
        </el-col>
      </el-row>
    </template>
    <div style='margin-top: 8px;margin-bottom: 8px'>
      <el-form ref="formRef" :inline="true" class='yform' :model='form' label-width='140px'>
        <el-tabs type='card' v-model='activeName'>
          <el-tab-pane label='基本信息' name='tab1'>
            <div class="yform-div">
              <el-form-item label='任务名称：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]">
                <el-input v-model='form.name'></el-input>
              </el-form-item>
							<el-form-item label='任务代码：' style='width:25%' prop='name' :rules="[{ required: true, message: '代码不能为空'}]">
								<el-input v-model='form.code'></el-input>
							</el-form-item>
<!--              <el-form-item label='任务分类：' style='width:25%' >-->
<!--                <el-tree-select placeholder='请选择' default-expand-all :props="{value:'id',label:'name'}" v-model='form.catid' :data='state.cates'-->
<!--                                check-strictly style='width: 100%;' clearable />-->
<!--              </el-form-item>-->
              <el-form-item label='执行类型：' style="width: 25%;">
                <el-select v-model='form.type' style='width: 100%'>
                  <el-option :value='0' label='并行执行'></el-option>
                  <el-option :value='1' label='串行执行'></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label='任务表达式：' prop='crexp' style="width: 50%;">
                <el-input v-model='form.crexp'/>
              </el-form-item>
              <el-form-item label='排序号：' style="width: 25%;">
                <el-input-number v-model='form.ornum' controls-position='right' style='width: 100%'/>
              </el-form-item>
              <el-form-item label='是否可用：' style="width: 25%;">
                <el-switch v-model='form.avtag'/>
              </el-form-item>
              <el-form-item label='Kettle附件：' style='width: 100%'>
                <el-upload
                    :action='state.uploadUrl' :headers='state.headers'
                    :on-preview='handlePreview' style='width:500px' :on-success='handleSuccess'
                    :on-remove='handleRemove' ref="upload"
                    :limit='1' :on-exceed='handleExceed' v-model:file-list='form.atts'>
                  <el-button type='primary'>上传附件</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item label='备注：' style='width: 100%'>
                <el-input type='textarea' :rows='4' v-model='form.notes' />
              </el-form-item>
							<el-form-item label='常用表达式：' style='width: 100%'>
								<div class='zinput'>
									每隔5秒执行一次：*/5 * * * * ? <br/>
									每隔1分钟执行一次：0 */1 * * * ? <br/>
									每天23点执行一次：0 0 23 * * ? <br/>
									每天凌晨1点执行一次：0 0 1 * * ? <br/>
									每月1号凌晨1点执行一次：0 0 1 1 * ? <br/>
									每月最后一天23点执行一次：0 0 23 L * ? <br/>
									每周星期天凌晨1点实行一次：0 0 1 ? * L <br/>
									在26分、29分、33分执行一次：0 26,29,33 * * * ? <br/>
									每天的0点、13点、18点、21点都执行一次：0 0 0,13,18,21 * * ? <br/>
								</div>
							</el-form-item>
            </div>
          </el-tab-pane>
          <el-tab-pane label='其他信息' name='tab9'>
            <div class='yform-div'>
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
  </el-card>
</template>
<script lang='ts'>
export default {name: 'BiTransCronEdit'};
</script>
<script lang='ts' setup>
import {getCurrentInstance, onMounted, reactive, ref, toRefs} from 'vue';
import {editInit, tabSave, tabClose} from '/@/comps/page/edit';
import {useRoute} from 'vue-router';
import {ElMessageBox, FormInstance, UploadRawFile,genFileId } from "element-plus";
import type { UploadProps } from 'element-plus';
import request from "/@/utils/request";
import {Session} from "/@/utils/storage";

const route = useRoute();
const formRef = ref<FormInstance>();
const {proxy} = getCurrentInstance() as any;
const activeName = ref('tab1');

const state = reactive({
  url: '/bi/trans/cron',cates: [] as any,
  params: {path: '', query: ''},
  form: {avtag: true,atts: [] as any} as any,
  uploadUrl: '', headers: {} as any,
});

const {form} = toRefs(state);

onMounted(async () => {
  await catesInit();
  await editInit({state, route});
  state.uploadUrl = `${import.meta.env.VITE_API_URL}gen/oss/upload`;
  state.headers = { 'Authorization': Session.get('token') };
});

//region -----附件逻辑-----
const upload = ref();

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  console.log(file, uploadFiles);
};

const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
  console.log(uploadFile);
  ElMessageBox.confirm('请选择对应的附件操作', '附件操作',
      {
        confirmButtonText: '下载',
        cancelButtonText: '取消',
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
	c[c.length - 1].id = a.id;
	// c[c.length - 1].name = a.name+" ["+a.size+"]";
	c[c.length - 1].name = a.name;
	c[c.length - 1].filid = a.filid;
	c[c.length - 1].filna = a.filna;
	c[c.length - 1].path = a.path;
	c[c.length - 1].ornum = c.length;
	if(form.value.id){
		c[c.length - 1].busid=form.value.id;
	}
};

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
};
//endregion

//region-----业务字典-----
const catesInit = async () => {
  // state.cates = await request({
  //   url: '/bi/trans/cate/treea',
  //   method: 'get',
  // });
};

//endregion

</script>

<style scoped>

</style>
