<template>
  <el-dialog v-model='state.show' title='编号策略配置' draggable width='500px'>
    <el-form ref='formRef' :model='form' label-width='120px'>
      <el-form-item label='策略代码：' prop='id' :rules="[{ required: true, message: '策略代码不能为空'}]">
        <el-input v-model='form.id' placeholder="字母编码" :disabled='form.crtim?true:false'></el-input>
      </el-form-item>
      <el-form-item label='策略名称：' prop='name' :rules="[{ required: true, message: '策略名称不能为空'}]">
        <el-input v-model='form.name'></el-input>
      </el-form-item>
      <el-form-item label='编号生成模式：' prop='numod' :rules="[{ required: true, message: '生成模式不能为空'}]">
        <el-select v-model='form.numod' placeholder='请选择' style='width: 100%'>
          <el-option :value="'nodate'" :label="'无日期，纯流水号'"></el-option>
          <el-option :value="'yyyymmdd'" :label="'年月日YYYYMMDD+流水号'"></el-option>
          <el-option :value="'yymmdd'" :label="'年月日YYMMDD+流水号'"></el-option>
          <el-option :value="'yyyymm'" :label="'年月YYYYMM+流水号'"></el-option>
          <el-option :value="'yymm'" :label="'年月YYMM+流水号'"></el-option>
          <el-option :value="'yy'" :label="'年YY+流水号'"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='编号前缀：' prop='nupre'>
        <el-input v-model='form.nupre'></el-input>
      </el-form-item>
      <el-form-item label='编号长度：' prop='nulen' :rules="[{ required: true, message: '编号长度不能为空'}]">
        <el-input-number v-model='form.nulen' controls-position='right' style='width: 100%'/>
      </el-form-item>
      <el-form-item label='下一个编号：' prop='nunex'>
        <el-input v-model='form.nunex'></el-input>
      </el-form-item>
      <el-form-item label='是否可用：' prop='avtag'>
        <el-switch v-model='form.avtag'>
        </el-switch>
      </el-form-item>
      <el-form-item label='排序号：' prop='ornum'>
        <el-input-number v-model='form.ornum' controls-position='right' style='width: 100%'/>
      </el-form-item>
      <el-form-item label='备注：' prop='notes'>
        <el-input v-model='form.notes'></el-input>
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

const state = reactive({
  url: '/ass/num/main', show: false,
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


</script>
<style scoped>

</style>
