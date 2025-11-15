<script lang="ts" setup>
import { requestClient } from '#/api/request';
import { modalSave } from '#/utils/page/edit';

const emits = defineEmits(['close']);

const state = reactive({
  url: '/sys/org/user',
  show: false,
  form: {} as any,
});
const rdata = reactive({} as any);
const { form } = toRefs(state);

// region -----弹框开启逻辑-----
const formRef = ref();
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
// endregion

// region -----弹框关闭逻辑-----
const save = async () => {
  await modalSave({ formRef: formRef.value, state });
  emits('close');
};
// endregion
</script>

<template>
  <el-dialog v-model="state.show" title="用户编辑" draggable width="600px">
    <el-form ref="formRef" :model="form" label-width="140px" class="zform">
      <el-form-item label="所属部门" prop="depid" :rules="[{ required: true, message: '所属部门不能为空' }]">
        <el-tree-select v-model="form.depid" :data="rdata.depts" :props="{ value: 'id', label: 'name' } as any" value-key="depid" placeholder="选择所属部门" check-strictly />
      </el-form-item>
      <el-form-item label="用户名称" prop="name" :rules="[{ required: true, message: '用户昵称不能为空' }]">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="账号名称" prop="usnam" :rules="[{ required: true, message: '用户名称不能为空' }]">
        <el-input v-model="form.usnam" />
      </el-form-item>
      <el-form-item label="用户密码" prop="pacod" :rules="[{ required: true, message: '用户密码不能为空' }]" v-if="!form.id">
        <el-input v-model="form.pacod" type="password" maxlength="32" show-password />
      </el-form-item>
      <el-form-item label="手机号码" prop="monum" :rules="[{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' }]">
        <el-input v-model="form.monum" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email" :rules="[{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="排序号" prop="ornum" :rules="[{ required: true, message: '排序号不能为空' }]" style="width: 50%">
        <el-input-number v-model="form.ornum" controls-position="right" :min="0" />
      </el-form-item>
      <el-form-item label="是否可用" prop="avtag" style="width: 50%">
        <el-switch v-model="form.avtag" />
      </el-form-item>
      <el-form-item label="备注" prop="notes">
        <el-input v-model="form.notes" :rows="2" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="save">保 存</el-button>
        <el-button @click="state.show = false">关 闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>
