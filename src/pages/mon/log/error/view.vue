<template>
  <el-dialog v-model='state.show' title='错误日志' draggable width='90%'>
    <el-form ref='formRef' :model='form' label-width='120px'>
      <el-form-item label='操作名称：'>
        {{ form.name }}
      </el-form-item>
      <el-form-item label='异常详情：'>
        {{ form.error }}
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
  url: '/mon/log/error', show: false,
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
