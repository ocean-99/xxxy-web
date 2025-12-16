<script setup lang="ts">
import { ref } from 'vue';

import { Page } from '@vben/common-ui';
import { useTabs } from '@vben/hooks';

import FcDesigner from '@form-create/designer';

import { requestClient } from '#/api/request';
import { tabSave } from '#/utils/page/edit';

const designer = ref(null) as any;
const config = {
  fieldReadonly: false,
};

const state = reactive({
  url: '/tool/form',
  form: {} as any,
});
const formRef = ref();
const { form } = toRefs(state);

onMounted(async () => {
  const id = useRoute().query?.id;
  state.form = id ? await requestClient.get(`${state.url}/info/${id}`) : { avtag: true };
  formRef?.value?.clearValidate();
  if (id) {
    designer.value?.setRule(state.form.frule);
  }
});

const { closeCurrentTab } = useTabs();
const save = async () => {
  state.form.frule = designer.value?.getJson();
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
          <el-space>在线表单</el-space>
          <el-space>
            <el-button type="primary" @click="save">保 存</el-button>
            <el-button @click="closeCurrentTab()">关 闭</el-button>
          </el-space>
        </div>
      </template>
      <div style="height: calc(100% - 50px); overflow: auto; padding-top: 5px; padding-left: 0; padding-right: 0">
        <el-form :inline="true" ref="formRef" :model="form" label-width="140px" class="zform">
          <FcDesigner ref="designer" :config="config" style="height: 1250px" />
        </el-form>
      </div>
    </el-card>
  </Page>
</template>

<style scoped lang="scss"></style>
