<script lang="ts" setup>
import type { Api } from '@form-create/element-ui';

import type { Ref } from 'vue';

import { ref } from 'vue';

import { Page } from '@vben/common-ui';
import { useTabs } from '@vben/hooks';

import formCreate from '@form-create/element-ui';

import { requestClient } from '#/api/request';
import WfView from '#/components/bpm/inst/iview.vue';
import { checkSubmit, tabSave } from '#/utils/page/edit';

const formComp = shallowRef(null as any);

// const FormComponent = defineAsyncComponent(() => import('#/views/bpm/bus/leave/view.vue'));
const formRef = ref();

const state = reactive({
  url: '/bpm/bus/main',
  form: {} as any,
});

const tmplData = ref({} as any);

const { form } = toRefs(state);

const modules = import.meta.glob('/src/views/bpm/bus/*/*.vue');
console.log("modules2", modules);
onMounted(async () => {
  const id = useRoute().query?.id;
  state.form = await requestClient.get(`${state.url}/info/${id}`);
  tmplData.value = await requestClient.get(`bpm/bus/tmpl/info/${state.form.tmpid}`);
  rule.value = JSON.parse(tmplData.value.frule);
  console.log(state.form);
  initTag.value = true;
  await nextTick();
  // const viewFpath = tmplData.value.fpath.replace('edit', 'view');
  if (tmplData.value.ftype === 1) {
    // formComp.value = defineAsyncComponent(() =>
    //   import(`../../../${tmplData.value.fpath}`).catch((error) => {
    //     console.error('组件加载失败:', error);
    //   }),
    // );
    formComp.value = defineAsyncComponent(modules[`/src/views/${tmplData.value.fpath}`]);
  } else if (tmplData.value.ftype === 2) {
    console.log(JSON.parse(state.form.fdata));
    console.log(formApi.value);
    formApi.value.setValue(JSON.parse(state.form.fdata));
  }

  formRef?.value?.clearValidate();
});

const { closeCurrentTab } = useTabs();
const save = async () => {
  const canSubmit = await checkSubmit(formRef.value);
  if (!canSubmit) {
    return false;
  }

  if (tmplData.value.ftype === 1) {
    const back = await formCompRef.value.save(state.form);
    console.log(back);
    if (back) {
      await closeCurrentTab();
    }
  } else if (tmplData.value.ftype === 2) {
    formApi.value
      .validate()
      .then(async () => {
        form.value.fdata = JSON.stringify(formApi.value.formData());
        const back2 = await tabSave({
          formRef: formRef.value,
          state,
        });
        if (back2) {
          await closeCurrentTab();
        }
      })
      .catch((error) => {
        ElMessage.warning('表单验证不通过');
      });
  }
};

const submit = async (zproc: any) => {
  form.value.zproc = zproc;
  await save();
};

const activeName = ref('p2');

// WF相关
const wfViewRef = ref();
const formCompRef = ref();
const initTag = ref(false);

const formApi = ref({}) as Ref<Api>;
const rule = ref();
</script>

<template>
  <Page auto-content-height>
    <el-card class="box-card">
      <template #header>
        <div class="flex justify-between">
          <el-space>
            <el-text class="w-150px mb-2" truncated> {{ form.name }}</el-text>
          </el-space>
          <el-space>
<!--            <el-button type="primary" @click="save">提交</el-button>-->
            <el-button @click="closeCurrentTab()">关闭</el-button>
          </el-space>
        </div>
      </template>
      <el-form :inline="true" ref="formRef" :model="form" label-width="140px" class="zform" label-suffix="：">
        <el-tabs v-model="activeName" type="card" style="width: 100%">
          <el-tab-pane label="基本信息" name="p1">
            <el-form-item label="所属流程模板">
              {{ tmplData.name }}
            </el-form-item>
            <el-form-item label="流程编号" prop="orderNum"> {{ form.orderNum }}</el-form-item>
            <el-form-item label="流程主题" prop="name" style="width: 100%">
              {{ form.name }}
            </el-form-item>
            <el-form-item label="备注" prop="remark" style="width: 100%">
              {{ form.remark }}
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="审批内容" name="p2">
            <component :is="formComp" ref="formCompRef" v-if="initTag && tmplData.ftype === 1" :busid="form.id" />
            <formCreate v-model:api="formApi" :rule="rule" v-else-if="tmplData.ftype === 2" />
          </el-tab-pane>
          <el-tab-pane label="流程信息" name="p3">
            <WfView v-if="initTag" ref="wfViewRef" :prdid="tmplData.prdid" :proid="form.id" @submit="submit" busty="bus" />
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </Page>
</template>
