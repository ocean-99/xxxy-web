<script lang="ts" setup>
import { requestClient } from '#/api/request';
import { drawerSave } from '#/utils/page/edit';

const emits = defineEmits(['close']);

const formRef = ref();

const state = reactive({
  url: '/tool/dict/data',
  show: false,
  form: {} as any,
});
const rdata = reactive({} as any);
const { form } = toRefs(state);

// 暴露open方法给父组件调用
const open = async (data: any) => {
  if (data.id) {
    state.form = await requestClient.get(`${state.url}/info/${data.id}`);
  } else {
    state.form = { avtag: true };
    state.form.dicid = data.dicid;
  }
  rdata.dicts = await requestClient.get(`/tool/dict/main/list`);
  state.show = true;
  formRef?.value?.clearValidate();
};

defineExpose({ open });

const save = async () => {
  await drawerSave({ formRef: formRef.value, state });
  emits('close');
};

// 数据标签回显样式
const listClassOptions = ref<Array<{ label: string; value: string }>>([
  { value: 'default', label: '默认' },
  { value: 'primary', label: '主要' },
  { value: 'success', label: '成功' },
  { value: 'info', label: '信息' },
  { value: 'warning', label: '警告' },
  { value: 'danger', label: '危险' },
]);
</script>

<template>
  <el-drawer v-model="state.show" size="46%">
    <template #header>
      <h4>数据维护</h4>
    </template>
    <template #default>
      <el-form ref="formRef" :model="form" label-width="140px" class="zform">
        <el-form-item label="所属字典" prop="dicid" :rules="[{ required: true, message: '所属字典不能为空' }]">
          <el-select v-model="form.dicid">
            <el-option v-for="item in rdata.dicts" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="数据标签" prop="dalab" :rules="[{ required: true, message: '数据标签不能为空' }]">
          <el-input v-model="form.dalab" />
        </el-form-item>
        <el-form-item label="数据键值" prop="daval" :rules="[{ required: true, message: '数据键值不能为空' }]">
          <el-input v-model="form.daval" />
        </el-form-item>
        <el-form-item label="回显样式" prop="shsty">
          <el-select v-model="form.shsty">
            <el-option v-for="item in listClassOptions" :key="item.value" :label="`${item.label}(${item.value})`" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序号" prop="ornum" :rules="[{ required: true, message: '参数键值不能为空' }]" style="width: 50%">
          <el-input-number v-model="form.ornum" controls-position="right" />
        </el-form-item>
        <el-form-item label="是否可用" prop="avtag" style="width: 50%">
          <el-switch v-model="form.avtag" />
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
