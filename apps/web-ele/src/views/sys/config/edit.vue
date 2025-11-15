<script lang="ts" setup>
import { requestClient } from '#/api/request';
import { drawerSave, reset } from '#/utils/page/edit';

const emits = defineEmits(['close']);
const state = reactive({
  url: '/sys/config',
  show: false,
  form: {} as any,
});
const formRef = ref();
const { form } = toRefs(state);

const open = async (data: any) => {
  state.form = data && data.id ? await requestClient.get(`${state.url}/info/${data.id}`) : { intag: true, avtag: true };
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
        <el-form-item label="参数名称" prop="name" :rules="[{ required: true, message: '参数名称不能为空' }]">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="参数键名" prop="kenam" :rules="[{ required: true, message: '参数键名不能为空' }]">
          <el-input v-model="form.kenam" />
        </el-form-item>
        <el-form-item label="参数键值" prop="keval" :rules="[{ required: true, message: '参数键值不能为空' }]">
          <el-input v-model="form.keval" />
        </el-form-item>
        <el-form-item label="是否内置" prop="avtag">
          <el-switch v-model="form.intag" />
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
