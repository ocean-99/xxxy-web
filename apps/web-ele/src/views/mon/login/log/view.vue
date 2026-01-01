<script lang="ts" setup>
import { requestClient } from '#/api/request';
import { renderBrowserIcon, renderOsIcon } from '#/utils/render';

const state = reactive({
  url: '/mon/login/log',
  show: false,
  form: { avtag: true } as any,
});

const { form } = toRefs(state);

// 暴露open方法给父组件调用
const open = async (data: any) => {
  state.form = await requestClient.get(`${state.url}/info/${data.id}`);
  state.show = true;
};
defineExpose({ open });
</script>

<template>
  <el-drawer v-model="state.show" size="46%">
    <template #header>
      <h4>日志详情</h4>
    </template>
    <template #default>
      <el-descriptions class="margin-top" :column="1" border label-width="100">
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">登录状态</div>
          </template>
          <el-tag type="success" v-show="form.sutag">成功</el-tag>
          <el-tag type="danger" v-show="!form.sutag">失败</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">登录平台</div>
          </template>
          {{ form.clkey ?? 'PC' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">账号信息</div>
          </template>
          {{ `账号: ${form.username} / ${form.loip} / ${form.loloc}` }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">登录时间</div>
          </template>
          {{ form.lotim }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">登录信息</div>
          </template>
          <span class="font-semibold" :class="{ 'text-red-500': !form.sutag }">
            {{ form.himsg }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">登录设备</div>
          </template>
          <component :is="renderOsIcon(form.os)" />
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">浏览器</div>
          </template>
          <component :is="renderBrowserIcon(form.browser)" />
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
  text-align: center;
}
</style>
