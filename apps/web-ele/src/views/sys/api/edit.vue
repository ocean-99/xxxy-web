<script lang="ts" setup>
import { ref } from 'vue';

import { requestClient } from '#/api/request';
import { drawerSave } from '#/utils/page/edit';

const emits = defineEmits(['close']);

const formRef = ref();

const state = reactive({
  url: '/sys/api',
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
    if (data && data.menid) {
      state.form.menid = data.menid;
    }
  }
  rdata.menus = await requestClient.get(`/sys/menu/tree`);
  state.show = true;
  formRef?.value?.clearValidate();
};
defineExpose({ open });

const save = async () => {
  await drawerSave({ formRef: formRef.value, state });
  emits('close');
};
</script>

<template>
  <el-drawer v-model="state.show" size="40%">
    <template #header>
      <h4>岗位</h4>
    </template>
    <template #default>
      <el-form ref="formRef" :model="form" label-width="140px" class="zform">
        <el-form-item label="所属菜单" prop="menid" :rules="[{ required: true, message: '所属菜单不能为空' }]">
          <el-tree-select v-model="form.menid" :data="rdata.menus" :props="{ value: 'id', label: 'name', children: 'children' } as any" value-key="menid" placeholder="选择所属菜单" check-strictly />
        </el-form-item>
        <el-form-item label="接口名称" prop="name" :rules="[{ required: true, message: '接口名称不能为空' }]">
          <el-input v-model="form.name" placeholder="请输入接口名称" maxlength="100" />
          <template #label>
            <span>
              <el-tooltip content="支持i18n写法, 如: sys.org.user.list" placement="top">
                <el-icon>
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
              接口名称
            </span>
          </template>
        </el-form-item>
        <el-form-item label="权限字符" prop="perm" :rules="[{ required: true, message: '权限字符不能为空' }]">
          <el-input v-model="form.perm" placeholder="请输入权限标识" maxlength="100" />
          <template #label>
            <span>
              <el-tooltip content="控制器中定义的权限字符，如：@SaCheckPermission('system:user:list')" placement="top">
                <el-icon>
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
              权限字符
            </span>
          </template>
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
    </template>
    <template #footer>
      <div style="flex: auto; margin: 20px">
        <el-button type="primary" @click="save">保 存</el-button>
        <el-button @click="state.show = false">关 闭</el-button>
      </div>
    </template>
  </el-drawer>
</template>
