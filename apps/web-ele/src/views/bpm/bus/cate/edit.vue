<script lang="ts" setup>
import { requestClient } from '#/api/request';
import { drawerSave } from '#/utils/page/edit';

const emits = defineEmits(['close']);

const formRef = ref();
const state = reactive({
  url: '/bpm/bus/cate',
  show: false,
  form: {} as any,
});
const rdata = reactive({} as any);
const { form } = toRefs(state);

// 暴露open方法给父组件调用
const open = async (data: any) => {
  if (data && data.id) {
    state.form = await requestClient.get(`${state.url}/info/${data.id}`);
    if (state.form.pid === 0) {
      state.form.pid = undefined;
    }
    rdata.cates = await requestClient.get(`${state.url}/tree?id=${data.id}`);
    for (let i = 0; i < rdata.cates.length; i++) {
      if (rdata.cates[i].pid === data.id) {
        rdata.cates.splice(i, 1);
        break;
      }
    }
  } else {
    state.form = { avtag: true };
    state.form.pid = data && data.pid ? data.pid : null;
    rdata.cates = await requestClient.get(`${state.url}/tree`);
  }
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
  <el-drawer v-model="state.show" size="46%">
    <template #header>
      <h4>流程分类信息--{{ form.id ? '修改' : '新增' }}</h4>
    </template>
    <template #default>
      <el-form ref="formRef" :model="form" label-width="100px" class="zform">
        <el-form-item label="上级分类">
          <el-tree-select clearable v-model="form.pid" :data="rdata.cates" :props="{ value: 'id', label: 'name' } as any" value-key="id" placeholder="选择上级菜单" check-strictly />
        </el-form-item>
        <el-form-item label="排序号" prop="ornum" :rules="[{ required: true, message: '排序号不能为空' }]" style="width: 50%">
          <el-input-number v-model="form.ornum" controls-position="right" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="分类名称" prop="name" :rules="[{ required: true, message: '分类名称不能为空' }]">
          <el-input v-model="form.name" placeholder="请输入分类名称" maxlength="100" />
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
