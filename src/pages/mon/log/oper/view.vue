<template>
  <el-dialog v-model='state.show'  title='操作日志' draggable width='90%'>
    <el-form ref='formRef' :inline="true" :model='form' label-width='120px'>
      <el-form-item label='操作名称：' style="width: 45%;">
        {{ form.name }}
      </el-form-item>
      <el-form-item label='用户姓名：' style="width: 45%;">
        {{ form.usena }}
      </el-form-item>
      <el-form-item label='请求时间：' style="width: 45%;">
        {{ form.crtim }}
      </el-form-item>
      <el-form-item label='请求耗时：' style="width: 45%;">
        {{ form.time }}
      </el-form-item>
      <el-form-item label='操作系统：' style="width: 45%;">
        {{ form.ageos }}
      </el-form-item>
      <el-form-item label='浏览器：' style="width: 45%;">
        {{ form.agbro }}
      </el-form-item>
    </el-form>
    <template #footer>
      <span class='dialog-footer'>
        <el-button @click='state.show = false'>关 闭</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script lang='ts' setup>
import {defineExpose, reactive, ref, toRefs} from 'vue';
import request from "/@/utils/request";

const state = reactive({
  url: '/mon/log/oper', show: false,
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
  }
  state.show = true;
};
defineExpose({openModal});


</script>
<style scoped>

</style>
