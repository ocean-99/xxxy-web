<script lang="ts" setup>
import { ref } from 'vue';

import { buildUUID } from '@vben/utils';

import { requestClient } from '#/api/request';
import OrgModal from '#/components/sys/OrgModal.vue';
import { drawerSave } from '#/utils/page/edit';

const emits = defineEmits(['close']);

const formRef = ref();

const state = reactive({
  url: '/demo/link/main',
  show: false,
  form: {} as any,
});
const rdata = reactive({} as any);
const { form } = toRefs(state);

// 暴露open方法给父组件调用
const open = async (data: any) => {
  state.form = data && data.id ? await requestClient.get(`${state.url}/info/${data.id}`) : { avtag: true, items: [], catid: data.catid };
  rdata.cates = await requestClient.get(`/demo/link/cate/tree`);
  if (state.form.catid === 0 || state.form.catid === '0' || state.form.catid === undefined) {
    delete state.form.catid;
  }
  state.show = true;
  formRef?.value?.clearValidate();
};
defineExpose({ open });

const save = async () => {
  await drawerSave({ formRef: formRef.value, state });
  emits('close');
};

// region a 行项目逻辑
const addItem = () => {
  let newOrnum = 1;
  if (form.value.items.length > 0) {
    newOrnum = form.value.items[form.value.items.length - 1].ornum + 1;
  }
  if (form.value.id) {
    form.value.items.push({
      id: buildUUID(),
      maiid: form.value.id,
      ornum: newOrnum,
    });
  } else {
    form.value.items.push({
      id: buildUUID(),
      ornum: newOrnum,
    });
  }
};
// endregion

// region a 包含成员逻辑
const orgModal = ref();

const openOrgsModal = () => {
  orgModal.value.open({
    orgType: 15,
    selectMode: 2,
    orgs: toRaw(form.value.orgs),
  });
};

const closeOrgModal = (data: any) => {
  form.value.orgs = data.orgs;
};

const orgsName = computed(() => {
  let names = '';
  if (form.value.orgs && form.value.orgs.length > 0) {
    for (const org of form.value.orgs) {
      names += `${org.name}；`;
    }
  }
  return names;
});
// endregion
</script>

<template>
  <el-drawer v-model="state.show" size="40%">
    <template #header>
      <h4>XX信息维护</h4>
      <OrgModal ref="orgModal" @close="closeOrgModal" />
    </template>
    <template #default>
      <el-form ref="formRef" :model="form" label-width="140px" class="zform">
        <el-form-item label="所属分类">
          <el-tree-select clearable v-model="form.catid" :data="rdata.cates" :props="{ value: 'id', label: 'name' }" value-key="catid" placeholder="选择分类" check-strictly />
        </el-form-item>
        <el-form-item label="XX名称" prop="name" :rules="[{ required: true, message: 'XX名称不能为空' }]">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="行项目列表" style="width: 100%">
          <el-table size="small" border :data="form.items" :row-style="{ height: '36px' }" style="width: 100%">
            <el-table-column label="排序号" width="90" align="center">
              <template #default="scope">
                <el-input-number v-model="scope.row.ornum" controls-position="right" style="width: 100%" />
              </template>
            </el-table-column>
            <el-table-column label="行项目名称" width="200">
              <template #default="scope">
                <el-input v-model="scope.row.name" required />
              </template>
            </el-table-column>
            <el-table-column label="行项目描述">
              <template #default="scope">
                <el-input v-model="scope.row.notes" required />
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="50" align="center">
              <template #header>
                <el-icon :size="22" style="top: 5px; cursor: pointer" color="#666">
                  <CirclePlus @click="addItem" />
                </el-icon>
              </template>
              <template #default="scope">
                <el-icon :size="22" style="top: 3px; cursor: pointer">
                  <CircleClose @click="form.items.splice(scope.$index, 1)" />
                </el-icon>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="包含成员">
          <el-input type="textarea" placeholder="中间表测试" :rows="3" v-model="orgsName" readonly @click="openOrgsModal" />
        </el-form-item>
        <el-form-item label="XX备注" prop="notes">
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
