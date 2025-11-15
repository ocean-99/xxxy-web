<script lang="ts" setup>
import { requestClient } from '#/api/request';
import { drawerSave, reset } from '#/utils/page/edit';

const emits = defineEmits(['close']);
const state = reactive({
  url: '/mon/job/main',
  show: false,
  form: {} as any,
});
const formRef = ref();
const { form } = toRefs(state);

const open = async (data: any) => {
  state.form = data && data.id ? await requestClient.get(`${state.url}/info/${data.id}`) : { avtag: true };
  await reset({ formRef: formRef.value, state });
};
defineExpose({ open });

const save = async () => {
  await drawerSave({ formRef: formRef.value, state });
  emits('close');
};

const activeName = ref('tab1');
</script>

<template>
  <el-drawer v-model="state.show" size="46%">
    <template #header>
      <h4>任务维护</h4>
    </template>
    <template #default>
      <el-form ref="formRef" :model="form" label-width="140px" class="zform" :inline="true">
        <el-tabs type="card" v-model="activeName" style="width: 100%">
          <el-tab-pane label="基本信息" name="tab1" class="zgrid">
            <el-form-item label="任务名称" prop="name" :rules="[{ required: true, message: '名称不能为空' }]">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="任务代码" prop="code" :rules="[{ required: true, message: '代码不能为空' }]">
              <el-input v-model="form.code" />
            </el-form-item>
            <el-form-item label="请求类型">
              <el-radio-group v-model="form.retyp">
                <el-radio :label="0">Run</el-radio>
                <el-radio :label="1">Get</el-radio>
                <el-radio :label="2">Post</el-radio>
                <el-radio :label="3">Put</el-radio>
                <el-radio :label="4">Delete</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="任务表达式" prop="cron" style="width: 50%">
              <el-input v-model="form.cron" />
            </el-form-item>
            <el-form-item label="执行类型" style="width: 50%">
              <el-select v-model="form.type">
                <el-option :value="0" label="并行执行" />
                <el-option :value="1" label="串行执行" />
              </el-select>
            </el-form-item>
            <el-form-item label="请求地址" prop="reurl">
              <el-input v-model="form.reurl" />
            </el-form-item>
            <el-form-item label="请求头" prop="rehea">
              <el-input v-model="form.rehea" />
            </el-form-item>
            <el-form-item label="请求参数" prop="repar">
              <el-input v-model="form.repar" type="textarea" :rows="4" />
            </el-form-item>
            <el-form-item label="排序号" style="width: 50%">
              <el-input-number v-model="form.ornum" controls-position="right" />
            </el-form-item>
            <el-form-item label="是否可用" style="width: 50%">
              <el-switch v-model="form.avtag" />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="其他信息" name="tab9" class="zgrid">
            <el-form-item label="备注" style="width: 100%">
              <el-input type="textarea" :rows="4" v-model="form.notes" />
            </el-form-item>
            <el-form-item label="创建时间" v-show="form.crtim" style="width: 50%">
              {{ form.crtim }}
            </el-form-item>
            <el-form-item label="更新时间" v-show="form.crtim" style="width: 50%">
              {{ form.uptim }}
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
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
