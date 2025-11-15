<script lang="ts" setup>
import type { TabsPaneContext } from 'element-plus';

import { Page } from '@vben/common-ui';
import { useTabs } from '@vben/hooks';

import FcDesigner from '@form-create/designer';

import { requestClient } from '#/api/request';
import OrgModal from '#/components/sys/OrgModal.vue';
import WfDefEdit from '#/components/wf/def/dedit.vue';
import { tabSave } from '#/utils/page/edit';

import { emitter } from './mitt';

const formRef = ref();

const state = reactive({
  url: '/wf/bus/tmpl',
  form: { prxml: '' } as any,
});

const { form } = toRefs(state);

onMounted(async () => {
  const id = useRoute().query?.id;
  state.form = id ? await requestClient.get(`${state.url}/info/${id}`) : { ftype: 2 };
  if (!id) {
    const catid = useRoute().query?.catid;
    if (catid) {
      state.form.catid = catid;
    }
  }
  cateOptions.value = await requestClient.get('/wf/bus/cate/tree');
  wfShowTag.value = true;
  formRef?.value?.clearValidate();
  if (id) {
    designer.value?.setRule(state.form.frule);
  }
});

const { closeCurrentTab } = useTabs();
const save = async () => {
  if (state.form.ftype === 2) {
    state.form.frule = designer.value?.getJson();
  }
  state.form.wfXml = await wfDefEditRef.value.getXml();
  const back = await tabSave({
    formRef: formRef.value,
    state,
  });
  if (back) {
    emitter.emit('flowTmplEditClose');
    await closeCurrentTab();
  }
};

const activeName = ref('p2');

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};

const cateOptions = ref([]);

// WF相关
const wfShowTag = ref(false);
const wfDefEditRef = ref();

// region -----组织架构逻辑-----
const orgModal = ref();
const cdata = reactive({}) as any;

const openUsmenModal = () => {
  orgModal.value.open({
    opener: 'usmen',
    orgType: 15,
    selectMode: 2,
    orgs: toRaw(form.value.usmen),
  });
};

const openDvmenModal = () => {
  orgModal.value.open({
    opener: 'dvmen',
    orgType: 15,
    selectMode: 2,
    orgs: toRaw(form.value.dvmen),
  });
};

const closeOrgModal = (data: any) => {
  if (data.opener === 'usmen') {
    form.value.usmen = data.orgs && data.orgs.length > 0 ? data.orgs : null;
  } else if (data.opener === 'dvmen') {
    form.value.dvmen = data.orgs && data.orgs.length > 0 ? data.orgs : null;
  }
};

cdata.usmen = computed(() => {
  let names = '';
  if (form.value.usmen && form.value.usmen.length > 0) {
    for (const user of form.value.usmen) {
      names += `${user.name}；`;
    }
  }
  return names;
});

cdata.dvmen = computed(() => {
  let names = '';
  if (form.value.dvmen && form.value.dvmen.length > 0) {
    for (const user of form.value.dvmen) {
      names += `${user.name}；`;
    }
  }
  return names;
});
// endregion

const designer = ref(null as any);
const config = {
  fieldReadonly: false,
};
</script>

<template>
  <Page auto-content-height>
    <el-card class="box-card" style="height: 100%" body-style="height: 100%">
      <template #header>
        <div class="flex justify-between">
          <el-space>
            <el-text class="w-150px mb-2" truncated> 流程模板--{{ form.id ? form.name : '新增' }} </el-text>
          </el-space>
          <el-space>
            <el-button type="primary" @click="save">保 存</el-button>
            <el-button @click="closeCurrentTab()">关 闭</el-button>
          </el-space>
        </div>
      </template>
      <div style="height: calc(100% - 50px); overflow: auto; padding-top: 5px; padding-left: 0; padding-right: 0">
        <el-form :inline="true" ref="formRef" :model="form" label-width="140px" class="zform">
          <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick" style="width: 100%">
            <el-tab-pane label="基本信息" name="p1">
              <el-form-item label="所属流程分类" prop="catid" :rules="[{ required: true, message: '流程分类不能为空' }]" style="width: 50%">
                <el-tree-select v-model="form.catid" :data="cateOptions" :props="{ value: 'id', label: 'name' } as any" value-key="id" placeholder="选择流程分类" check-strictly />
              </el-form-item>
              <el-form-item label="排序号" prop="ornum" :rules="[{ required: true, message: '排序号不能为空' }]" style="width: 50%">
                <el-input-number v-model="form.ornum" controls-position="right" :min="0" style="width: 100%" />
              </el-form-item>
              <el-form-item label="表单类型" prop="ftype" :rules="[{ required: true, message: '表单类型不能为空' }]" style="width: 50%">
                <el-select v-model="form.ftype" placeholder="请选择表单类型">
                  <el-option label="自定义路径" :value="1" />
                  <el-option label="可视化表单" :value="2" />
                </el-select>
              </el-form-item>
              <el-form-item label="流程模板名称" prop="name" :rules="[{ required: true, message: '模板名称不能为空' }]" style="width: 100%">
                <el-input v-model="form.name" />
              </el-form-item>
              <el-form-item label="备注" prop="notes" style="width: 100%">
                <el-input v-model="form.notes" :rows="3" type="textarea" />
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="表单配置" name="p2">
              <el-form-item label="表单路径" prop="fpath" style="width: 100%" v-if="form.ftype === 1">
                <el-input v-model="form.fpath" />
              </el-form-item>
              <FcDesigner ref="designer" :config="config" v-else-if="form.ftype === 2" style="height: 1250px" />
            </el-tab-pane>
            <el-tab-pane label="流程配置" name="p3">
              <div style="width: 100%; height: 800px">
                <WfDefEdit ref="wfDefEditRef" v-if="wfShowTag" :prdid="form.prdid" />
              </div>
            </el-tab-pane>
            <el-tab-pane label="权限配置" name="p4">
              <el-form-item label="可使用此模板创建流程者" style="width: 100%">
                <el-input type="textarea" :rows="4" v-model="cdata.usmen" readonly @click="openUsmenModal" />
              </el-form-item>
              <el-form-item label="默认可阅读此模板流程者" style="width: 100%">
                <el-input type="textarea" :rows="4" v-model="cdata.dvmen" readonly @click="openDvmenModal" />
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </div>
    </el-card>
    <OrgModal ref="orgModal" @close="closeOrgModal" />
  </Page>
</template>
