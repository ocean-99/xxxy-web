<script lang="ts" setup>
import { requestClient } from '#/api/request';
import { Tinymce } from '#/components/tinymce';
import { modalSave } from '#/utils/page/edit';

const emits = defineEmits(['close']);
const state = reactive({
  url: '/sys/notice',
  show: false,
  form: {} as any,
});
const formRef = ref();
const { form } = toRefs(state);

const open = async (data: any) => {
  state.show = true;
  await nextTick();
  formRef.value?.resetFields();
  state.form = data && data.id ? await requestClient.get(`${state.url}/info/${data.id}`) : { avtag: true, type: 1 };
};
defineExpose({ open });

const save = async () => {
  await modalSave({ formRef: formRef.value, state });
  emits('close');
};
</script>

<template>
  <el-dialog v-model="state.show" title="公告维护" draggable width="800px">
    <el-form ref="formRef" :model="form" label-width="140px" class="zform">
      <el-form-item label="公告名称" prop="name" :rules="[{ required: true, message: '公告名称不能为空' }]">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="公告类型" style="width: 50%" prop="type" :rules="[{ required: true, message: '公告类型不能为空' }]">
        <el-radio-group v-model="form.type">
          <el-radio-button label="通知" :value="1" />
          <el-radio-button label="公告" :value="2" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="公告状态" prop="avtag" style="width: 50%">
        <el-radio-group v-model="form.avtag">
          <el-radio-button label="正常" :value="true" />
          <el-radio-button label="关闭" :value="false" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="公告内容" prop="content" style="width: 100%" :rules="[{ required: true, message: '公告内容不能为空' }]">
        <Tinymce v-model="form.content" />
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
