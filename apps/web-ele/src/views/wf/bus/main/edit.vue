<script lang="ts" setup>
import type { Api } from '@form-create/element-ui';
import type { TabsPaneContext } from 'element-plus';

import type { Ref } from 'vue';

import { ref } from 'vue';

import { Page } from '@vben/common-ui';
import { useTabs } from '@vben/hooks';

import formCreate from '@form-create/element-ui';

import { requestClient } from '#/api/request';
import WfEdit from '#/components/wf/inst/iedit.vue';
import { checkSubmit, tabSave } from '#/utils/page/edit';

import { emitter } from './mitt';

const formRef = ref();

const formComp = shallowRef(null as any);

// const ComponentA = () => import('./ComponentA.vue');
const state = reactive({
  url: '/wf/bus/main',
  form: { prxml: '' } as any,
});

const tmplData = ref({} as any);

const { form } = toRefs(state);
const modules = import.meta.glob('/src/views/wf/bus/*/*.vue');
console.log("modules", modules);
onMounted(async () => {
  const id = useRoute().query?.id;
  state.form = id ? await requestClient.get(`${state.url}/info/${id}`) : {};
  if (!id) {
    state.form.tmpid = useRoute().query?.tmpid;
    state.form.tmpna = useRoute().query?.tmpna;
  }
  tmplData.value = await requestClient.get(`wf/bus/tmpl/info/${state.form.tmpid}`);
  rule.value = JSON.parse(tmplData.value.frule);
  state.form.prdid = tmplData.value.prdid;
  if (tmplData.value.ftype === 1) {
    // const topath = `/src/views/${tmplData.value.fpath}`;
    // formComp.value = defineAsyncComponent(() =>
    //   // import(`../../../${tmplData.value.fpath}`).catch((error) => {
    //   //   console.error('组件加载失败:', error);
    //   // }),
    //   import(topath).catch((error) => {
    //     console.error('组件加载失败:', error);
    //   }),
    // );
    formComp.value = defineAsyncComponent(modules[`/src/views/${tmplData.value.fpath}`]);
  }
  wfShowTag.value = true;
  formRef?.value?.clearValidate();
});

const { closeCurrentTab } = useTabs();
const save = async () => {
  const canSubmit = await checkSubmit(formRef.value);
  if (!canSubmit) {
    return false;
  }
  state.form.wfStartBo = wfEditRef.value.getOperateInfo();
  if (tmplData.value.ftype === 1) {
    const back = await formCompRef.value.save(state.form);
    console.log(back);
    if (back) {
      emitter.emit('flowMainEditClose');
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
          emitter.emit('flowMainEditClose');
          await closeCurrentTab();
        }
      })
      .catch((error) => {
        ElMessage.warning('表单验证不通过');
      });
  }
};

const activeName = ref('p2');

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};

// WF相关
const wfEditRef = ref();
const formCompRef = ref();
const wfShowTag = ref(false);

const formApi = ref({}) as Ref<Api>;
const rule = ref();
</script>

<template>
  <Page auto-content-height>
    <el-card class="box-card">
      <template #header>
        <div class="flex justify-between">
          <el-space>
            <el-text class="w-150px mb-2" truncated> {{ form.tmpna }}--{{ form.id ? form.name : '新增' }} </el-text>
          </el-space>
          <el-space>
            <el-button type="primary" @click="save">提交</el-button>
            <el-button @click="closeCurrentTab()">关闭</el-button>
          </el-space>
        </div>
      </template>
      <el-form :inline="true" ref="formRef" :model="form" label-width="140px" class="zform">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick" style="width: 100%">
          <el-tab-pane label="基本信息" name="p1">
            <el-form-item label="所属流程模板">
              {{ form.tmpna }}
            </el-form-item>
            <el-form-item label="流程编号" prop="ornum">
              <el-input-number v-model="form.ornum" controls-position="right" :min="0" style="width: 100%" />
            </el-form-item>
            <el-form-item label="流程主题" prop="name" :rules="[{ required: true, message: '流程主题不能为空' }]" style="width: 100%">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="备注" prop="remark" style="width: 100%">
              <el-input v-model="form.notes" :rows="3" type="textarea" />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="审批内容" name="p2">
            <component :is="formComp" ref="formCompRef" v-if="tmplData.ftype === 1" />
            <formCreate v-model:api="formApi" :rule="rule" v-else-if="tmplData.ftype === 2" />
          </el-tab-pane>
          <el-tab-pane label="流程信息" name="p3">
            <WfEdit v-if="wfShowTag" ref="wfEditRef" :prdid="tmplData.prdid" busty="bus" />
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </Page>
</template>
