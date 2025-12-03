<script lang="ts" setup>
import { requestClient } from '#/api/request';
import { drawerSave, reset } from '#/utils/page/edit';

const emits = defineEmits(['close']);
const state = reactive({
  url: '/demo/demo',
  show: false,
  form: {} as any,
});
const formRef = ref();
const { form } = toRefs(state);

const open = async (data: any) => {
  state.form = data && data.id ? await requestClient.get(`${state.url}/info/${data.id}`) : { avtag: true };
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
      <h4>参数维护</h4>
    </template>
    <template #default>
      <el-form ref="formRef" :model="form" label-width="140px">
        <el-form-item label="部门ID" prop="deptId" :rules="[{ required: true, message: '部门ID不能为空' }]">
          <el-input v-model="form.deptId" />
        </el-form-item>
        <el-form-item label="用户ID" prop="userId" :rules="[{ required: true, message: '用户ID不能为空' }]">
          <el-input v-model="form.userId" />
        </el-form-item>
        <el-form-item label="排序号" prop="orderNum" :rules="[{ required: true, message: '排序号不能为空' }]">
          <el-input v-model="form.orderNum" />
        </el-form-item>
        <el-form-item label="key键" prop="testKey" :rules="[{ required: true, message: '键不能为空' }]">
          <el-input v-model="form.testKey" />
        </el-form-item>
        <el-form-item label="值" prop="value" :rules="[{ required: true, message: '值不能为空' }]">
          <el-input v-model="form.value" />
        </el-form-item>
        <el-form-item label="备注" prop="notes">
          <el-input v-model="form.notes" :rows="2" type="textarea" />
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
