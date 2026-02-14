<script lang="ts" setup>
import { requestClient } from '#/api/request';
import { drawerSave, reset } from '#/utils/page/edit';

const emits = defineEmits(['close']);
const state = reactive({
  url: '/codeApi',
  show: false,
  form: {} as any,
});
const formRef = ref();
const { form } = toRefs(state);

const open = async (data: any) => {
  state.form = data && data.id ? await requestClient.get(`${state.url}/info/${data.id}`) : { enable: true, creditScore: 100 };
  await reset({ formRef: formRef.value, state });
};
defineExpose({ open });

const save = async () => {
  await drawerSave({ formRef: formRef.value, state });
  emits('close');
};
</script>

<template>
  <el-drawer v-model="state.show" size="46%">
    <template #header>
      <h4>代码API维护</h4>
    </template>
    <template #default>
      <el-form ref="formRef" :model="form" label-width="100px">
        <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '名称不能为空' }]">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="是否启用" prop="enable">
          <el-switch v-model="form.enable" />
        </el-form-item>
        <el-form-item label="基础URL" prop="baseUrl" :rules="[{ required: true, message: '基础URL不能为空' }]">
          <el-input v-model="form.baseUrl" placeholder="https://api.example.com" />
        </el-form-item>
        <el-form-item label="项目ID" prop="projectId">
          <el-input v-model="form.projectId" />
        </el-form-item>
        <el-form-item label="令牌" prop="token">
          <el-input v-model="form.token" type="password" show-password />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="余额" prop="balance">
          <el-input v-model="form.balance" />
        </el-form-item>
        <el-form-item label="信用分" prop="creditScore">
          <el-input-number v-model="form.creditScore" :min="0" :max="100" :precision="2" style="width: 100%" />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto; margin: 20px">
        <el-button type="primary" @click="save">保 存</el-button>
        <el-button @click="state.show = false">关 闭</el-button>
      </div>
    </template>
  </el-drawer>
</template>
