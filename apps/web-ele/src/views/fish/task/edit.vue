<script lang="ts" setup>
import { requestClient } from '#/api/request';
import { drawerSave, reset } from '#/utils/page/edit';

const emits = defineEmits(['close']);
const state = reactive({
  url: '/fish-task',
  show: false,
  form: {} as any,
  accountList: [] as any[],
  paramsKvList: [] as { key: string; value: string }[],
  jsonPreviewVisible: false,
  jsonPreviewContent: '',
});
const formRef = ref();
const { form } = toRefs(state);

const getAccountList = async () => {
  try {
    state.accountList = await requestClient.get('account-info/available');
  } catch (error) {
    console.error(error);
  }
};

const open = async (data: any) => {
  await getAccountList();
  if (data && data.id) {
    state.form = await requestClient.get(`${state.url}/info/${data.id}`);
    state.paramsKvList = [];
    if (state.form.taskParams && typeof state.form.taskParams === 'object') {
      Object.entries(state.form.taskParams).forEach(([key, value]) => {
        state.paramsKvList.push({ key, value: String(value) });
      });
    }
    if (state.paramsKvList.length === 0) {
      state.paramsKvList.push({ key: '', value: '' });
    }
  } else {
    state.form = {
      status: 0,
      retryCount: 0,
    };
    state.paramsKvList = [{ key: '', value: '' }];
  }
  await reset({ formRef: formRef.value, state });
};
defineExpose({ open });

const save = async () => {
  const params: Record<string, any> = {};
  state.paramsKvList.forEach((item) => {
    if (item.key) {
      params[item.key] = item.value;
    }
  });
  state.form.taskParams = params;

  await drawerSave({ formRef: formRef.value, state });
  emits('close');
};

const addParam = () => {
  state.paramsKvList.push({ key: '', value: '' });
};

const removeParam = (index: number) => {
  state.paramsKvList.splice(index, 1);
};

const showJson = () => {
  const params: Record<string, any> = {};
  state.paramsKvList.forEach((item) => {
    if (item.key) {
      params[item.key] = item.value;
    }
  });
  state.jsonPreviewContent = JSON.stringify(params, null, 2);
  state.jsonPreviewVisible = true;
};

const handleAccountChange = (val: any) => {
  const account = state.accountList.find((item) => item.id === val);
  if (account) {
    state.form.accountName = `${account.nickName || account.phone || account.id} - ${account.platform}`;
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

        <el-form-item label="关联账号" prop="accountId" :rules="[{ required: form.taskType === 'collect_info', message: '请选择关联账号', trigger: 'change' }]">
          <el-select v-model="form.accountId" style="width: 100%" filterable placeholder="请选择关联账号" @change="handleAccountChange">
            <el-option v-for="item in state.accountList" :key="item.id" :label="`${item.nickName || item.phone || item.id} - ${item.platform}`" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="账号名称" prop="accountName">
          <el-input v-model="form.accountName" placeholder="自动填充账号名称" readonly />
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
            <div v-for="(item, index) in state.paramsKvList" :key="index" class="mb-2 flex gap-2">
              <el-input v-model="item.key" placeholder="Key" />
              <el-input v-model="item.value" placeholder="Value" />
              <el-button type="danger" icon="Delete" @click="removeParam(index)" circle />
            </div>
            <div class="flex gap-2">
              <el-button type="primary" plain class="w-full" @click="addParam">添加参数</el-button>
              <el-button class="w-full" @click="showJson">展示JSON</el-button>
            </div>
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
  <el-dialog v-model="state.jsonPreviewVisible" title="JSON预览" width="500px" append-to-body>
    <pre>{{ state.jsonPreviewContent }}</pre>
  </el-dialog>
</template>
