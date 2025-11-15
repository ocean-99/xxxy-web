<script lang="ts" setup>
import { defineExpose, reactive, ref, toRefs } from 'vue';

import { requestClient } from '#/api/request';
import { modalSave } from '#/utils/page/edit';

const emits = defineEmits(['close']);

const state = reactive({
  url: '/sys/org/dept',
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
    state.form = { children: [], avtag: true, type: 8 };
    state.form.pid = data.pid ?? null;
  }
  rdata.depts = await requestClient.get(`${state.url}/tree?id=${data?.id}`);
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
    <el-form ref="formRef" :model="form" label-width="140px" class="zform">
      <el-form-item label="上级部门">
        <el-tree-select clearable v-model="form.pid" :data="rdata.depts" :props="{ value: 'id', label: 'name' } as any" value-key="id" placeholder="选择上级部门" check-strictly />
      </el-form-item>
      <el-form-item label="部门名称" prop="name" :rules="[{ required: true, message: '部门名称不能为空' }]">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="部门类型" style="width: 50%" prop="type" :rules="[{ required: true, message: '部门类型不能为空' }]">
        <el-select v-model="form.type">
          <el-option :value="1" label="集团" />
          <el-option :value="2" label="公司" />
          <el-option :value="4" label="机构" />
          <el-option :value="8" label="部门" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门标签" prop="label" style="width: 50%">
        <el-input v-model="form.label" />
      </el-form-item>
      <el-form-item label="排序号" prop="ornum" :rules="[{ required: true, message: '排序号不能为空' }]" style="width: 50%">
        <el-input-number v-model="form.ornum" controls-position="right" :min="0" style="width: 100%" />
      </el-form-item>
      <el-form-item label="是否可用" prop="avtag" style="width: 50%">
        <el-switch v-model="form.avtag" />
      </el-form-item>
      <el-form-item label="备注" prop="notes">
        <el-input v-model="form.notes" :rows="3" type="textarea" />
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
