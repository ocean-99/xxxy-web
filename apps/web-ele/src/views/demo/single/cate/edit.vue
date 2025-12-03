<script lang="ts" setup>
import { requestClient } from '#/api/request';
import { drawerSave } from '#/utils/page/edit';

const emits = defineEmits(['close']);

const formRef = ref();
const state = reactive({
  url: '/demo/single/cate',
  show: false,
  form: {} as any,
});
const rdata = reactive({} as any);
const { form } = toRefs(state);

const open = async (data: any) => {
  if (data.id) {
    state.form = await requestClient.get(`${state.url}/info/${data.id}`);
    rdata.cates = await requestClient.get(`${state.url}/tree?id=${data.id}`);
  } else {
    state.form = { avtag: true, pid: data.pid };
    rdata.cates = await requestClient.get(`${state.url}/tree`);
  }
  if (state.form.pid === 0 || state.form.pid === '0' || state.form.pid === undefined) {
    delete state.form.pid;
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
      <h4>XX信息--{{ form.id ? '修改' : '新增' }}</h4>
    </template>
    <template #default>
      <el-form ref="formRef" :model="form" label-width="140px" class="zform">
        <el-form-item label="上级名称">
          <el-tree-select clearable v-model="form.pid" :data="rdata.cates" :props="{ value: 'id', label: 'name' } as any" value-key="id" placeholder="选择上级菜单" check-strictly />
        </el-form-item>
        <el-form-item label="排序号" prop="ornum" :rules="[{ required: true, message: '排序号不能为空' }]" style="width: 50%">
          <el-input-number v-model="form.ornum" controls-position="right" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="是否可用" style="width: 50%">
          <el-switch v-model="form.avtag" />
        </el-form-item>
        <el-form-item label="XX名称" prop="name" :rules="[{ required: true, message: 'XX名称不能为空' }]">
          <el-input v-model="form.name" placeholder="请输入XX名称" maxlength="100" />
        </el-form-item>
        <el-form-item label="备注" prop="notes">
          <el-input v-model="form.notes" :rows="3" type="textarea" />
        </el-form-item>
        <template v-if="form.crtim">
          <el-form-item label="创建人" style="width: 50%">
            <div>{{ form.cruna }}</div>
          </el-form-item>
          <el-form-item label="创建时间" style="width: 50%">
            <div>{{ form.crtim }}</div>
          </el-form-item>
          <el-form-item label="更新人" style="width: 50%">
            <div>{{ form.upuna }}</div>
          </el-form-item>
          <el-form-item label="更新时间" style="width: 50%">
            <div>{{ form.uptim }}</div>
          </el-form-item>
        </template>
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
