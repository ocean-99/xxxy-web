<script lang="ts" setup>
import { requestClient } from '#/api/request';
import { renderJsonPreview } from '#/utils/render';

const state = reactive({
  url: '/mon/job/log',
  show: false,
  form: { avtag: true } as any,
});

const { form } = toRefs(state);

const open = async (data: any) => {
  state.form = await requestClient.get(`${state.url}/info/${data.id}`);
  state.show = true;
};
defineExpose({ open });
</script>

<template>
  <el-drawer v-model="state.show" size="60%">
    <template #header>
      <h4>日志详情</h4>
    </template>
    <template #default>
      <el-descriptions class="margin-top" :column="1" border label-width="120">
        <el-descriptions-item min-width="120">
          <template #label>
            <div class="cell-item">任务名称</div>
          </template>
          {{ form.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">任务开始时间</div>
          </template>
          {{ form.sttim }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">任务结束时间</div>
          </template>
          {{ form.entim }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">执行结果</div>
          </template>
          <el-tag type="success" v-show="form.ret === '成功'">成功</el-tag>
          <el-tag type="danger" v-show="form.ret === '失败'">失败</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">日志信息</div>
          </template>
          {{ form.msg }}
        </el-descriptions-item>
      </el-descriptions>
    </template>
    <template #footer>
      <div style="flex: auto; margin: 20px">
        <el-button @click="state.show = false">关 闭</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped>
.cell-item {
  text-align: right;
}
</style>
