<script lang="ts" setup>
import { requestClient } from '#/api/request';
import { drawerSave, reset } from '#/utils/page/edit';

const emits = defineEmits(['close']);
const state = reactive({
  url: '/fish-task',
  show: false,
  form: {} as any,
});
const formRef = ref();
const { form } = toRefs(state);

const open = async (data: any) => {
  if (data && data.id) {
    state.form = await requestClient.get(`${state.url}/info/${data.id}`);
    // 如果 params 是对象，转换为 JSON 字符串
    if (state.form.params && typeof state.form.params === 'object') {
      state.form.paramsStr = JSON.stringify(state.form.params, null, 2);
    }
  } else {
    state.form = {
      status: 0,
      retryCount: 0,
      paramsStr: '{}',
    };
  }
  await reset({ formRef: formRef.value, state });
};
defineExpose({ open });

const save = async () => {
  // 将 paramsStr 转换回 JSON 对象
  if (state.form.paramsStr) {
    try {
      state.form.params = JSON.parse(state.form.paramsStr);
    } catch {
      ElMessage.error('任务参数格式错误，请输入有效的 JSON');
      return;
    }
  }

  await drawerSave({ formRef: formRef.value, state });
  emits('close');
};

// 格式化 JSON
const formatJson = () => {
  try {
    const obj = JSON.parse(state.form.paramsStr || '{}');
    state.form.paramsStr = JSON.stringify(obj, null, 2);
  } catch {
    ElMessage.error('JSON 格式错误');
  }
};
</script>

<template>
  <el-drawer v-model="state.show" size="46%">
    <template #header>
      <h4>任务维护</h4>
    </template>
    <template #default>
      <el-form ref="formRef" :model="form" label-width="100px">
        <el-form-item label="任务类型" prop="taskType" :rules="[{ required: true, message: '任务类型不能为空' }]">
          <el-select v-model="form.taskType" style="width: 100%" placeholder="请选择任务类型">
            <el-option label="采集信息" value="collect_info" />
            <el-option label="进行评论" value="comment" />
            <el-option label="进行点赞" value="like" />
          </el-select>
        </el-form-item>

        <el-form-item label="关联账号ID" prop="accountId" :rules="[{ required: true, message: '账号ID不能为空' }]">
          <el-input-number v-model="form.accountId" :min="1" style="width: 100%" />
        </el-form-item>

        <el-form-item label="任务状态" prop="status">
          <el-select v-model="form.status" style="width: 100%">
            <el-option label="待执行" :value="0" />
            <el-option label="执行中" :value="1" />
            <el-option label="执行成功" :value="2" />
            <el-option label="执行失败" :value="3" />
          </el-select>
        </el-form-item>

        <el-form-item label="重试次数" prop="retryCount">
          <el-input-number v-model="form.retryCount" :min="0" style="width: 100%" />
        </el-form-item>

        <el-form-item label="任务参数">
          <div style="width: 100%">
            <el-input v-model="form.paramsStr" :rows="8" type="textarea" placeholder='请输入 JSON 格式参数，例如: {"key": "value"}' />
            <el-button size="small" style="margin-top: 5px" @click="formatJson"> 格式化 JSON </el-button>
            <div style="margin-top: 5px; font-size: 12px; color: #999">提示：不同任务类型需要不同的参数结构</div>
          </div>
        </el-form-item>

        <el-form-item label="执行时间" prop="executeTime">
          <el-date-picker v-model="form.executeTime" type="datetime" placeholder="选择执行时间" style="width: 100%" value-format="YYYY-MM-DD HH:mm:ss" />
        </el-form-item>

        <el-form-item label="完成时间" prop="finishTime">
          <el-date-picker v-model="form.finishTime" type="datetime" placeholder="选择完成时间" style="width: 100%" value-format="YYYY-MM-DD HH:mm:ss" />
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
