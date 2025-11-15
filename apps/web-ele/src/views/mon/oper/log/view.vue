<script lang="ts" setup>
import { requestClient } from '#/api/request';
import { renderJsonPreview } from '#/utils/render';

const state = reactive({
  url: '/mon/oper/log',
  show: false,
  form: { avtag: true } as any,
});
const rdata = reactive({} as any);
const { form } = toRefs(state);

// 暴露open方法给父组件调用
const open = async (data: any) => {
  state.form = await requestClient.get(`${state.url}/info/${data.id}`);
  rdata.butyps = data.butyps;
  state.show = true;
};
defineExpose({ open });

const actionInfo = computed(() => {
  if (!form.value) {
    return '-';
  }
  return `账号: ${form.value.opuna} / ${form.value.opdna ?? '未知部门'} / ${form.value.opip} / ${form.value.oploc}`;
});
</script>

<template>
  <el-drawer v-model="state.show" size="46%">
    <template #header>
      <h4>日志详情</h4>
    </template>
    <template #default>
      <el-descriptions class="margin-top" :column="1" border label-width="100">
        <el-descriptions-item min-width="100">
          <template #label>
            <div class="cell-item">日志编号</div>
          </template>
          {{ form.id }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">操作结果</div>
          </template>
          <el-tag type="success" v-show="form.sutag">成功</el-tag>
          <el-tag type="danger" v-show="!form.sutag">失败</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">操作模块</div>
          </template>
          <el-tag>{{ form.opmod }}</el-tag>
          <DictTag :options="rdata.butyps" :value="form.butyp" style="display: inline-block; margin-left: 10px" />
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">操作信息</div>
          </template>
          {{ actionInfo }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">请求信息</div>
          </template>
          <el-tag type="primary">{{ form.reway }}</el-tag>
          {{ form.reurl }}
        </el-descriptions-item>
        <el-descriptions-item v-show="!form.sutag">
          <template #label>
            <div class="cell-item">异常信息</div>
          </template>
          {{ form.ermsg }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">请求方法</div>
          </template>
          {{ form.remet }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">请求参数</div>
          </template>
          <div class="max-h-[300px] overflow-y-auto">
            <component :is="renderJsonPreview(form.repar)" />
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">响应参数</div>
          </template>
          <div class="max-h-[300px] overflow-y-auto">
            <component :is="renderJsonPreview(form.bapar)" />
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">请求耗时</div>
          </template>
          {{ form.cotim }}ms
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">操作时间</div>
          </template>
          {{ form.optim }}
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
