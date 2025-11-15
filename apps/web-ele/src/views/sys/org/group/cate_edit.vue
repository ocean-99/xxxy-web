<script lang="ts" setup>
import { defineExpose, reactive, ref, toRefs } from 'vue';

import { requestClient } from '#/api/request';
import { modalSave } from '#/utils/page/edit';

const emits = defineEmits(['close']);

const state = reactive({
  url: '/sys/org/groupc',
  show: false,
  form: {} as any,
  type: 'add',
});
const rdata = reactive({} as any);
const { form } = toRefs(state);

const formRef = ref();
const openModal = async (data: any) => {
  if (data && data.id) {
    state.form = await requestClient.get(`${state.url}/info/${data.id}`);
    state.type = 'edit';
  } else {
    state.type = 'add';
    state.form = { children: [], avtag: true };
    state.form.pid = data.pid ?? null;
  }
  rdata.cates = await requestClient.get(`${state.url}/tree?id=${data?.id}`);
  state.show = true;
  formRef?.value?.clearValidate();
};
defineExpose({ openModal });

const save = async () => {
  if (!state.form.name) {
    ElMessage.warning('分类名称必须填写');
    return;
  }
  const backNode = {} as any;
  backNode.id = await modalSave({ formRef: formRef.value, state });
  if (backNode.id) {
    backNode.name = state.form.name;
    backNode.notes = state.form.notes;
    backNode.pid = state.form.pid;
    backNode.children = state.form.children;
    emits('close', backNode, state.type);
  }
};
</script>

<template>
  <el-dialog v-model="state.show" title="部门编辑" draggable width="600px">
    <el-form ref="formRef" :model="form" label-width="140px">
      <el-form-item label="上级分类">
        <el-tree-select v-model="form.pid" :data="rdata.cates" :props="{ value: 'id', label: 'name' } as any" value-key="id" placeholder="选择上级分类" check-strictly />
      </el-form-item>
      <el-form-item label="分类名称" prop="name" :rules="[{ required: true, message: '分类名称不能为空' }]">
        <el-input v-model="form.name" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="save">保 存</el-button>
        <el-button @click="state.show = false">取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>
