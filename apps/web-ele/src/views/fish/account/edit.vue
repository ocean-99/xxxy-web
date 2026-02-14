<script lang="ts" setup>
import { requestClient } from '#/api/request';
import { drawerSave, reset } from '#/utils/page/edit';

const emits = defineEmits(['close']);
const state = reactive({
  url: '/account-info',
  show: false,
  form: {} as any,
});
const formRef = ref();
const { form } = toRefs(state);

const open = async (data: any) => {
  state.form = data && data.id ? await requestClient.get(`${state.url}/info/${data.id}`) : { status: 0 };
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
      <h4>账号维护</h4>
    </template>
    <template #default>
      <el-form ref="formRef" :model="form" label-width="100px">
        <el-form-item label="手机号" prop="phone" :rules="[{ required: true, message: '手机号不能为空' }]">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="平台" prop="platform" :rules="[{ required: true, message: '平台不能为空' }]">
          <el-input v-model="form.platform" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="form.nickName" />
        </el-form-item>
        <el-form-item label="账号名称" prop="accountName">
          <el-input v-model="form.accountName" />
        </el-form-item>
        <el-form-item label="项目ID" prop="projectId">
          <el-input v-model="form.projectId" />
        </el-form-item>
        <el-form-item label="认证状态" prop="status">
          <el-select v-model="form.status" style="width: 100%">
            <el-option label="未检查" :value="0" />
            <el-option label="检查中" :value="1" />
            <el-option label="已认证" :value="2" />
            <el-option label="未认证" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="账号状态" prop="accountStatus">
          <el-input v-model="form.accountStatus" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-input v-model="form.avatar" />
        </el-form-item>
        <el-form-item label="Cookie" prop="cookie2">
          <el-input v-model="form.cookie2" :rows="3" type="textarea" />
        </el-form-item>
        <el-form-item label="原因" prop="reason">
          <el-input v-model="form.reason" :rows="2" type="textarea" />
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
