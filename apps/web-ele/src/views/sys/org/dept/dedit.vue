<script lang="ts" setup>
import { requestClient } from '#/api/request';
import { drawerSave } from '#/utils/page/edit';

const emits = defineEmits(['close']);

const formRef = ref();
const state = reactive({
  url: '/sys/org/dept',
  show: false,
  form: {} as any,
});
const rdata = reactive({} as any);
const { form } = toRefs(state);

// 暴露open方法给父组件调用
const open = async (data: any) => {
  if (data && data.id) {
    state.form = await requestClient.get(`${state.url}/info/${data.id}`);
  } else {
    state.form = { avtag: true, type: 8 };
    state.form.pid = data && data.pid ? data.pid : null;
  }
  rdata.depts = await requestClient.get(`${state.url}/tree?id=${data?.id}`);
  state.show = true;
  formRef?.value?.clearValidate();
};
defineExpose({ open });

const save = async () => {
  await drawerSave({ formRef: formRef.value, state });
  emits('close');
};
</script>

<template>
  <el-drawer v-model="state.show" size="40%">
    <template #header>
      <h4>部门信息--{{ form.id ? '修改' : '新增' }}</h4>
    </template>
    <template #default>
      <el-form ref="formRef" :model="form" label-width="100px" class="zform">
        <el-form-item label="上级部门">
          <el-tree-select v-model="form.pid" clearable :data="rdata.depts" :props="{ value: 'id', label: 'name' } as any" value-key="id" placeholder="选择上级部门" check-strictly />
        </el-form-item>
        <el-form-item label="部门名称" prop="name" :rules="[{ required: true, message: '部门名称不能为空' }]">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="部门类型" style="width: 50%" prop="type" :rules="[{ required: true, message: '部门类型不能为空' }]">
          <el-select v-model="form.type">
            <el-option :value="1" label="部门" />
            <el-option :value="2" label="机构" />
            <el-option :value="4" label="公司" />
            <el-option :value="8" label="集团" />
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
    </template>
    <template #footer>
      <div style="flex: auto; margin: 20px">
        <el-button type="primary" @click="save">保 存</el-button>
        <el-button @click="state.show = false">关 闭</el-button>
      </div>
    </template>
  </el-drawer>
</template>
