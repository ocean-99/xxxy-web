<script lang="ts" setup>
import { requestClient } from '#/api/request';
import { drawerSave, reset } from '#/utils/page/edit';

const emits = defineEmits(['close']);

const state = reactive({
  url: '/tool/num',
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
  await drawerSave({ formRef: formRef.value, state, iouField: 'crtim' });
  emits('close');
};
</script>

<template>
  <el-drawer v-model="state.show" size="46%">
    <template #header>
      <h4>编号维护</h4>
    </template>
    <template #default>
      <el-form ref="formRef" :model="form" label-width="140px" class="zform">
        <el-form-item label="编号代码：" prop="id" :rules="[{ required: true, message: '编号代码不能为空' }]">
          <el-input v-model="form.id" placeholder="字母编码" :disabled="!!form.crtim" />
        </el-form-item>
        <el-form-item label="编号名称：" prop="name" :rules="[{ required: true, message: '编号名称不能为空' }]">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="编号生成模式：" prop="numod" :rules="[{ required: true, message: '生成模式不能为空' }]">
          <el-select v-model="form.numod" placeholder="请选择" style="width: 100%">
            <el-option value="nodate" label="无日期，纯流水号" />
            <el-option value="YYYYMMDD" label="年月日YYYYMMDD+流水号" />
            <el-option value="YYMMDD" label="年月日YYMMDD+流水号" />
            <el-option value="YYYYMM" label="年月YYYYMM+流水号" />
            <el-option value="YYMM" label="年月YYMM+流水号" />
            <el-option value="YY" label="年YY+流水号" />
          </el-select>
        </el-form-item>
        <el-form-item label="编号前缀：" prop="nupre">
          <el-input v-model="form.nupre" />
        </el-form-item>
        <el-form-item label="编号长度：" prop="nulen" :rules="[{ required: true, message: '编号长度不能为空' }]">
          <el-input-number v-model="form.nulen" controls-position="right" style="width: 100%" />
        </el-form-item>
        <el-form-item label="下一个编号：" prop="nunex">
          <el-input v-model="form.nunex" />
        </el-form-item>
        <el-form-item label="是否可用：" prop="avtag" style="width: 50%">
          <el-switch v-model="form.avtag" />
        </el-form-item>
        <el-form-item label="排序号：" prop="ornum" style="width: 50%">
          <el-input-number v-model="form.ornum" controls-position="right" />
        </el-form-item>
        <el-form-item label="备注：" prop="notes">
          <el-input v-model="form.notes" />
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
