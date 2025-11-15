<script lang="ts" setup>
import { ref } from 'vue';

import { requestClient } from '#/api/request';
import OrgModal from '#/components/sys/OrgModal.vue';
import { drawerSave } from '#/utils/page/edit';

const emits = defineEmits(['close']);

const formRef = ref();

const state = reactive({
  url: '/sys/org/post',
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
    state.form = { avtag: true };
    if (data && data.depid) {
      state.form.depid = data.depid;
    }
  }
  rdata.depts = await requestClient.get(`/sys/org/dept/tree`);
  state.show = true;
  formRef?.value?.clearValidate();
};
defineExpose({ open });

const save = async () => {
  await drawerSave({ formRef: formRef.value, state });
  emits('close');
};

// region a 所属部门与员工成员逻辑
const orgModal = ref();

const openUsersModal = () => {
  orgModal.value.open({
    opener: 'users',
    orgType: 2,
    selectMode: 2,
    orgs: toRaw(form.value.users),
  });
};

const closeOrgModal = (data: any) => {
  if (data.opener === 'users') {
    form.value.users = data.orgs;
  }
};

const usersName = computed(() => {
  let names = '';
  if (form.value.users && form.value.users.length > 0) {
    for (const user of form.value.users) {
      names += `${user.name}；`;
    }
  }
  return names;
});
// endregion
</script>

<template>
  <el-drawer v-model="state.show" size="40%">
    <template #header>
      <h4>岗位</h4>
      <OrgModal ref="orgModal" @close="closeOrgModal" />
    </template>
    <template #default>
      <el-form ref="formRef" :model="form" label-width="140px">
        <el-form-item label="所属部门" prop="depid" :rules="[{ required: true, message: '所属部门不能为空' }]">
          <el-tree-select v-model="form.depid" :data="rdata.depts" :props="{ value: 'id', label: 'name', children: 'children' } as any" value-key="depid" placeholder="选择所属部门" check-strictly />
        </el-form-item>
        <el-form-item label="岗位名称" prop="name" :rules="[{ required: true, message: '岗位名称不能为空' }]">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="岗位标签" prop="label">
          <el-input v-model="form.label" />
        </el-form-item>
        <el-form-item label="排序号" prop="ornum" :rules="[{ required: true, message: '排序号不能为空' }]">
          <el-input-number v-model="form.ornum" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="是否可用" prop="avtag">
          <el-switch v-model="form.avtag" />
        </el-form-item>
        <el-form-item label="包含成员">
          <el-input type="textarea" :rows="4" v-model="usersName" readonly @click="openUsersModal" />
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
