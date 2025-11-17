<script lang="ts" setup>
import { ref } from 'vue';

import { buildUUID } from '@vben/utils';

import { requestClient } from '#/api/request';
import { drawerSave } from '#/utils/page/edit';

const emits = defineEmits(['close']);

const formRef = ref();

const state = reactive({
  url: '/bpm/org/tree',
  show: false,
  form: {} as any,
});
const rdata = reactive({} as any);
const { form } = toRefs(state);

// 暴露open方法给父组件调用
const open = async (data: any) => {
  if (data && data.id) {
    state.form = await requestClient.get(`${state.url}/info/${data.id}`);
  } else {
    state.form = { avtag: true, roles: [] };
    if (data && data.catid) {
      state.form.catid = data.catid;
    }
  }
  rdata.cates = await requestClient.get(`/bpm/org/treec/tree`);
  state.show = true;
  formRef?.value?.clearValidate();
};
defineExpose({ open });

const save = async () => {
  await drawerSave({ formRef: formRef.value, state });
  emits('close');
};

const addItem = () => {
  let newOrnum = 1;
  if (form.value.roles.length > 0) {
    newOrnum = form.value.roles[form.value.roles.length - 1].ornum + 1;
  }
  if (form.value.id) {
    form.value.roles.push({
      id: buildUUID(),
      tieid: form.value.id,
      ornum: newOrnum,
    });
  } else {
    form.value.roles.push({
      id: buildUUID(),
      ornum: newOrnum,
    });
  }
};
</script>

<template>
  <el-drawer v-model="state.show" size="46%">
    <template #header>
      <h4>流程组织树</h4>
    </template>
    <template #default>
      <el-form ref="formRef" :model="form" label-width="140px" class="zform">
        <el-form-item label="所属分类" prop="catid">
          <el-tree-select v-model="form.catid" :data="rdata.cates" :props="{ value: 'id', label: 'name', children: 'children' } as any" value-key="catid" placeholder="选择所属分类" check-strictly />
        </el-form-item>
        <el-form-item label="组织树名称" prop="name" :rules="[{ required: true, message: '组织树名称不能为空' }]">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="排序号" prop="ornum" :rules="[{ required: true, message: '排序号不能为空' }]" style="width: 50%">
          <el-input-number v-model="form.ornum" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="是否可用" prop="avtag" style="width: 50%">
          <el-switch v-model="form.avtag" />
        </el-form-item>
        <el-form-item label="包含角色：" style="width: 100%">
          <el-table size="small" border :data="form.roles" :row-style="{ height: '36px' }" style="width: 100%">
            <el-table-column label="排序号" width="90" align="center">
              <template #default="scope">
                <el-input-number v-model="scope.row.ornum" controls-position="right" style="width: 100%" />
              </template>
            </el-table-column>
            <el-table-column label="角色名称" width="200">
              <template #default="scope">
                <el-input v-model="scope.row.name" required />
              </template>
            </el-table-column>
            <el-table-column label="角色描述">
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
                  <CircleClose @click="form.roles.splice(scope.$index, 1)" />
                </el-icon>
              </template>
            </el-table-column>
          </el-table>
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
