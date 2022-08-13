<template>
  <el-dialog v-model='state.show' title='连接配置' draggable width='500px'>
    <el-form ref='formRef' :model='form' label-width='120px'>
      <el-form-item label='连接名称：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]">
        <el-input v-model='form.name' placeholder='英文且唯一'></el-input>
      </el-form-item>
      <el-form-item label='数据库类型：' prop='type' :rules="[{ required: true, message: '数据库类型不能为空'}]">
        <el-select v-model='form.type' placeholder='请选择' style='width: 100%' @change="typeChange">
          <el-option :value="'mysql'" :label="'mysql'"></el-option>
          <el-option :value="'oracle'" :label="'oracle'"></el-option>
          <el-option :value="'sqlserver'" :label="'sqlserver'"></el-option>
          <el-option :value="'db2'" :label="'db2'"></el-option>
        </el-select>
      </el-form-item>
			<el-form-item label='JdbcUrl：' prop='url' :rules="[{ required: true, message: 'JdbcUrl不能为空'}]">
				<el-input v-model='form.url' type='textarea' :rows='2'/>
			</el-form-item>
			<el-form-item label='账号：' prop='acnum' :rules="[{ required: true, message: '账号不能为空'}]">
				<el-input v-model='form.acnum' />
			</el-form-item>
			<el-form-item label='密码：' prop='pacod' :rules="[{ required: true, message: '密码不能为空'}]">
				<el-input v-model='form.pacod' type="password" style="width:272px;margin-right: 10px"/>
				<el-button type='success' @click='test({formRef,state,proxy,route})' plain>测 试</el-button>
			</el-form-item>
      <el-form-item label='是否启用：' prop='avtag'>
        <el-switch v-model='form.avtag'>
        </el-switch>
      </el-form-item>
      <el-form-item label='排序号：' prop='ornum'>
        <el-input-number v-model='form.ornum' controls-position='right' style='width: 100%'/>
      </el-form-item>
      <el-form-item label='备注：' prop='notes'>
        <el-input v-model='form.notes'  type='textarea' :rows='2'></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class='dialog-footer'>
				<el-button type='primary' @click='handleConfirm'>确 认</el-button>
        <el-button @click='state.show = false'>取 消</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script lang='ts' setup>
import {defineExpose, reactive, ref, toRefs} from 'vue';
import {modalSave} from '/@/comps/page/edit';
import request from "/@/utils/request";
import { ElMessage } from 'element-plus';
import {BpmnStore} from "/@/bpmn/store";

const state = reactive({
  url: '/bi/collect/conn', show: false,
  form: {avtag: true} as any,
});

const {form} = toRefs(state);

const formRef = ref();
const openModal = async (data: any) => {
  if (data && data.id) {
    state.form = await request({
      url: state.url + '/one/' + data.id,
      method: 'get',
    });
  } else {
    state.form = {avtag: true};
    // formRef.value.clearValidate();
    if (formRef.value) {
      formRef.value.resetFields();
    }
  }
  state.show = true;
};
defineExpose({openModal});


const emits = defineEmits(['close']);
const handleConfirm = async () => {
  await modalSave({formRef: formRef.value, state, iouField: "crtim"});
  emits('close');
};

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

const typeChange=(type:string)=>{
  switch (type) {
    case 'mysql':
      state.form.url='jdbc:mysql://127.0.0.1:3306/vboot-java?characterEncoding=utf-8&useSSL=false';
      break;
    case 'oracle':
      state.form.url='jdbc:oracle:thin:@10.0.0.47:1521:orcl';
      break;
    case 'sqlserver':
      state.form.url='jdbc:sqlserver://10.0.0.151:1433;SelectMethod=cursor;DatabaseName=vboot-java';
      break;
    default:
      state.form.url='jdbc:db2://10.0.0.252:5912/QAS';
  }
  console.log(type);
}

</script>
<style scoped>

</style>
