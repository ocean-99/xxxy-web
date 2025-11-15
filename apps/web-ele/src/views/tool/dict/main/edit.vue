<script lang="ts" setup>
import { requestClient } from '#/api/request';
import { modalSave, reset } from '#/utils/page/edit';

const emits = defineEmits(['close']);

const state = reactive({
  url: '/tool/dict/main',
  show: false,
  form: {} as any,
});
const { form } = toRefs(state);
const formRef = ref();

const open = async (data: any) => {
  state.form = data && data.id ? await requestClient.get(`${state.url}/info/${data.id}`) : { avtag: true };
  await reset({ formRef: formRef.value, state });
};
defineExpose({ open });

const save = async () => {
  await modalSave({ formRef: formRef.value, state });
  emits('close');
};
</script>

<template>
  <el-dialog v-model="state.show" title="字典维护" draggable width="600px">
    <el-form ref="formRef" :model="form" label-width="140px" class="zform">
      <el-form-item label="字典名称" prop="name" :rules="[{ required: true, message: '字典名称不能为空' }]">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item prop="code" :rules="[{ required: true, message: '字典代码不能为空' }]">
        <template #label>
          <span>
            <el-tooltip content="使用英文/下划线命名, 如:sys_normal_disable" placement="top">
              <el-icon><question-filled /></el-icon>
            </el-tooltip>
            字典代码
          </span>
        </template>
        <el-input v-model="form.code" />
      </el-form-item>
      <el-form-item label="排序号" prop="ornum" :rules="[{ required: true, message: '排序号不能为空' }]" style="width: 50%">
        <el-input-number v-model="form.ornum" controls-position="right" />
      </el-form-item>
      <el-form-item label="是否可用" prop="avtag" style="width: 50%">
        <el-switch v-model="form.avtag" />
      </el-form-item>
      <el-form-item label="备注" prop="notes">
        <el-input v-model="form.notes" :rows="2" type="textarea" />
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
