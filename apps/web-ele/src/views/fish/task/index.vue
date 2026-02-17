<script setup lang="ts">
import { Page } from '@vben/common-ui';

import { ElMessage, ElMessageBox } from 'element-plus';

import { requestClient } from '#/api/request';
import { listDelete, listItemDelete, listQuery, listSelect } from '#/utils/page/list';

import DrawerEdit from './edit.vue';

const state = reactive({
  url: '/fish-task',
  loading: false,
  ids: [],
  form: {
    pageSize: 10,
  } as any,
  single: true,
  multiple: true,
  rows: [],
  total: 0,
  executorStatus: null as any,
});

const editRef = ref() as any;

const editClose = async () => {
  await listQuery(state);
};

// 获取线程池状态
const getExecutorStatus = async () => {
  try {
    const res = await requestClient.get(`${state.url}/executor-status`);
    state.executorStatus = res;
  } catch (error) {
    console.error('获取线程池状态失败', error);
  }
};

// 启动任务
const startTask = async (taskId: number) => {
  try {
    await ElMessageBox.confirm('确认启动该任务吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    await requestClient.post(`${state.url}/start/${taskId}`);
    ElMessage.success('任务已启动');
    await listQuery(state);
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '启动任务失败');
    }
  }
};

// 暂停任务
const pauseTask = async (taskId: number) => {
  try {
    await ElMessageBox.confirm('确认暂停该任务吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    await requestClient.post(`${state.url}/pause/${taskId}`);
    ElMessage.success('任务已暂停');
    await listQuery(state);
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '暂停任务失败');
    }
  }
};

// 恢复任务
const resumeTask = async (taskId: number) => {
  try {
    await ElMessageBox.confirm('确认恢复该任务吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    await requestClient.post(`${state.url}/resume/${taskId}`);
    ElMessage.success('任务已恢复');
    await listQuery(state);
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '恢复任务失败');
    }
  }
};

// 停止任务
const stopTask = async (taskId: number) => {
  try {
    await ElMessageBox.confirm('确认停止该任务吗？任务将被标记为失败。', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    await requestClient.post(`${state.url}/stop/${taskId}`);
    ElMessage.success('任务已停止');
    await listQuery(state);
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '停止任务失败');
    }
  }
};

// 获取任务类型标签
const getTaskTypeLabel = (taskType: string) => {
  const types: any = {
    collect_info: '采集信息',
    comment: '进行评论',
    like: '进行点赞',
  };
  return types[taskType] || taskType;
};

// 获取状态标签
const getStatusLabel = (status: number) => {
  const labels: any = {
    0: '待执行',
    1: '执行中',
    2: '执行成功',
    3: '执行失败',
  };
  return labels[status] || '未知';
};

// 获取状态类型
const getStatusType = (status: number) => {
  const types: any = {
    0: 'info',
    1: 'warning',
    2: 'success',
    3: 'danger',
  };
  return types[status] || '';
};

onMounted(async () => {
  await listQuery(state);
  await getExecutorStatus();
  // 定时刷新线程池状态
  setInterval(getExecutorStatus, 5000);
});
</script>

<template>
  <Page auto-content-height>
    <el-card class="box-card" style="height: 100%" body-style="height: 100%">
      <template #header>
        <div class="flex justify-between">
          <el-space>
            <el-select style="width: 140px" v-model="state.form.taskType" placeholder="选择任务类型" clearable @change="listQuery(state)">
              <el-option label="采集信息" value="collect_info" />
              <el-option label="进行评论" value="comment" />
              <el-option label="进行点赞" value="like" />
            </el-select>
            <el-select style="width: 140px" v-model="state.form.status" placeholder="选择状态" clearable @change="listQuery(state)">
              <el-option label="待执行" :value="0" />
              <el-option label="执行中" :value="1" />
              <el-option label="执行成功" :value="2" />
              <el-option label="执行失败" :value="3" />
            </el-select>
            <el-input style="width: 180px" v-model="state.form.accountId" placeholder="输入账号ID回车查询" clearable @keyup.enter="listQuery(state)" />
            <el-button type="primary" @click="listQuery(state)" icon="Search"> 查询</el-button>
          </el-space>
          <el-space>
            <el-button icon="Plus" type="success" plain @click="editRef.open()">新增</el-button>
            <el-button icon="Delete" type="danger" plain @click="listDelete(state)" :disabled="state.multiple">删除</el-button>
            <el-button icon="Refresh" plain @click="getExecutorStatus()">刷新状态</el-button>
          </el-space>
        </div>
        <!-- 线程池状态 -->
        <div v-if="state.executorStatus" style="margin-top: 10px; font-size: 12px; color: #666">
          <el-space>
            <span>
              活跃线程: <el-tag size="small" type="success">{{ state.executorStatus.activeCount }}</el-tag>
            </span>
            <span>
              核心线程: <el-tag size="small">{{ state.executorStatus.corePoolSize }}</el-tag>
            </span>
            <span>
              最大线程: <el-tag size="small">{{ state.executorStatus.maximumPoolSize }}</el-tag>
            </span>
            <span>
              队列任务: <el-tag size="small" type="warning">{{ state.executorStatus.queueSize }}</el-tag>
            </span>
            <span>
              已完成: <el-tag size="small" type="info">{{ state.executorStatus.completedTaskCount }}</el-tag>
            </span>
          </el-space>
        </div>
      </template>

      <el-table
        @selection-change="listSelect($event, state)"
        style="height: calc(100% - 90px)"
        :cell-style="{ padding: '2px' }"
        :row-style="{ height: '36px' }"
        v-loading="state.loading"
        :data="state.rows"
        border
        stripe
      >
        <el-table-column type="selection" width="44" align="center" />
        <el-table-column label="#" type="index" width="50" align="center" />
        <el-table-column label="任务ID" prop="id" width="80" align="center" />
        <el-table-column label="任务名称" prop="taskName" width="200" align="center" show-overflow-tooltip />
        <el-table-column label="任务类型" prop="taskType" width="120" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.taskType === 'collect_info' ? 'primary' : scope.row.taskType === 'comment' ? 'success' : 'warning'">
              {{ getTaskTypeLabel(scope.row.taskType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="账号名称" prop="accountName" width="200" align="center" />
        <el-table-column label="任务状态" prop="status" width="100" align="center">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusLabel(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="重试次数" prop="retryCount" width="90" align="center" />
        <el-table-column label="执行时间" prop="executeTime" width="164" />
        <el-table-column label="完成时间" prop="finishTime" width="164" />
        <el-table-column label="失败原因" prop="errorMsg" min-width="160" show-overflow-tooltip />
        <el-table-column label="创建时间" prop="createTime" width="164" />
        <el-table-column label="操作" align="center" width="240" class-name="small-padding fixed-width" fixed="right">
          <template #default="scope">
            <el-tooltip content="查看/编辑" placement="top">
              <el-button link type="primary" icon="Edit" @click="editRef.open({ id: scope.row.id })" />
            </el-tooltip>
            <el-tooltip content="启动" placement="top">
              <el-button link type="success" icon="VideoPlay" @click="startTask(scope.row.id)" :disabled="scope.row.status === 1" />
            </el-tooltip>
            <el-tooltip content="暂停" placement="top">
              <el-button link type="warning" icon="VideoPause" @click="pauseTask(scope.row.id)" :disabled="scope.row.status !== 1" />
            </el-tooltip>
            <el-tooltip content="恢复" placement="top">
              <el-button link type="info" icon="Refresh" @click="resumeTask(scope.row.id)" />
            </el-tooltip>
            <el-tooltip content="停止" placement="top">
              <el-button link type="danger" icon="CircleClose" @click="stopTask(scope.row.id)" :disabled="scope.row.status !== 1" />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="listItemDelete(state, scope.row.id)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        style="margin-top: 10px"
        @size-change="listQuery(state)"
        @current-change="listQuery(state)"
        :pager-count="5"
        :page-sizes="[10, 20, 30]"
        background
        :total="state.total"
        v-model:current-page="state.form.pageNum"
        v-model:page-size="state.form.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </el-card>
    <DrawerEdit ref="editRef" @close="editClose" />
  </Page>
</template>
