<script lang="ts" setup>
import { Page } from '@vben/common-ui';
import { useTabs } from '@vben/hooks';

import { requestClient } from '#/api/request';
import { tabSave } from '#/utils/page/edit';

const formRef = ref();

const state = reactive({
  url: '/bpm/todo/main',
  show: true,
  form: { avtag: true } as any,
});

const { form } = toRefs(state);

onMounted(async () => {
  const id = useRoute().query?.id;
  if (id) {
    state.form = await requestClient.get(`${state.url}/info/${id}`);
  } else {
    state.form = { avtag: true };
  }
  formRef?.value?.clearValidate();
});

const { closeCurrentTab } = useTabs();
const save = async () => {
  const back = await tabSave({
    formRef: formRef.value,
    state,
  });
  if (back) {
    await closeCurrentTab();
  }
};
</script>

<template>
  <Page auto-content-height>
    <el-card class="box-card" style="height: 100%" body-style="height: 100%">
      <template #header>
        <div class="flex justify-between">
          <el-space>客户信息</el-space>
          <el-space>
            <el-button type="primary" @click="save">保 存</el-button>
            <el-button @click="closeCurrentTab()">关 闭</el-button>
          </el-space>
        </div>
      </template>
      <div style="height: calc(100% - 50px); overflow: auto; padding-top: 5px; padding-left: 0; padding-right: 0">
        <el-form :inline="true" ref="formRef" :model="form" label-width="140px" class="zform">
          <el-form-item label="客户名称" prop="name" :rules="[{ required: true, message: '客户名称不能为空' }]">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="备注" prop="notes">
            <el-input v-model="form.notes" :rows="2" type="textarea" />
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </Page>
</template>
