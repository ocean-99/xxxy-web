<script lang="ts" setup>
import { requestClient } from '#/api/request';

const state = reactive({
  url: '/sys/org/user',
  show: false,
  form: {} as any,
});
const { form } = toRefs(state);

// region -----弹框开启逻辑-----
const formRef = ref();
const open = async (data: any) => {
  if (data && data.id) {
    state.form = await requestClient.get(`${state.url}/info/${data.id}`);
    state.form.pacod = '';
  }
  state.show = true;
  formRef?.value?.clearValidate();
};
defineExpose({ open });
// endregion

// region -----弹框关闭逻辑-----
const save = async () => {
  const data = {
    id: form.value.id,
    pacod: form.value.pacod,
  };
  await requestClient.putWithMsg(`${state.url}/pacod`, data);
  // await requestClient.putWithMsg(`${state.url}/pacod`, data,{
  //   encrypt: true,
  // });
  state.show = false;
};
// endregion
</script>

<template>
  <el-dialog v-model="state.show" title="用户编辑" draggable width="600px">
    <el-form ref="formRef" :model="form" label-width="140px" class="zform">
      <el-form-item label="用户名称" prop="name" :rules="[{ required: true, message: '用户昵称不能为空' }]">
        {{ form.name }}
      </el-form-item>
      <el-form-item label="账号名称" prop="usnam" :rules="[{ required: true, message: '用户名称不能为空' }]">
        {{ form.usnam }}
      </el-form-item>
      <el-form-item label="用户密码" prop="pacod" :rules="[{ required: true, message: '用户密码不能为空' }]">
        <el-input v-model="form.pacod" type="password" maxlength="32" show-password />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="save">保 存</el-button>
        <el-button @click="state.show = false">关 闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>
