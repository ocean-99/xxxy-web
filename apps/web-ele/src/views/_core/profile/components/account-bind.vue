<script setup lang="tsx">
import type { BindItem } from '../../oauth-common';

import { computed, ref, unref } from 'vue';

import { ElAlert, ElMessageBox } from 'element-plus';

import { authUnbinding } from '#/api';
import { socialList } from '#/api/system/social';

import { accountBindList, handleAuthBinding } from '../../oauth-common';

function buttonText(item: BindItem) {
  return item.bound ? '已绑定' : '绑定';
}

/**
 * 已经绑定的平台
 */
const boundPlatformsList = ref<string[]>([]);
const bindList = computed<BindItem[]>(() => {
  const list = [...accountBindList];
  list.forEach((item) => {
    item.bound = !!unref(boundPlatformsList).includes(item.source.toUpperCase());
  });
  return list;
});

/**
 * 解绑账号
 */
function handleUnbind(record: any) {
  ElMessageBox.confirm(`确定解绑[${record.source}]平台的[${record.userName}]账号吗？`, '提示', {
    type: 'warning',
  })
    .then(async () => {
      await authUnbinding(record.id);
      await listQuery();
    })
    .catch(() => {});
}

const state = reactive({
  list: [] as any,
});

onMounted(async () => {
  await listQuery();
});

const listQuery = async () => {
  boundPlatformsList.value = [];
  state.list = await socialList();
  for (const listQueryElement of state.list) {
    boundPlatformsList.value.push(listQueryElement.source);
  }
  console.log(boundPlatformsList.value);
};
</script>

<template>
  <div class="flex flex-col gap-[16px]">
    <el-table :data="state.list" style="width: 100%; height: 100%; font-size: 14px">
      <el-table-column label="序号" width="80" type="index" />
      <el-table-column label="绑定账号平台" width="140" align="center" prop="source" show-overflow-tooltip />
      <el-table-column label="头像" width="70" align="center" prop="avatar">
        <template #default="scope">
          <img :src="scope.row.avatar" style="width: 45px; height: 45px" />
        </template>
      </el-table-column>
      <el-table-column label="系统账号" align="center" prop="userName" :show-overflow-tooltip="true" />
      <el-table-column label="绑定时间" width="180" align="center" prop="createTime" />
      <el-table-column label="操作" width="80" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button size="small" type="text" @click="handleUnbind(scope.row)">解绑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pb-3">
      <el-row :gutter="20">
        <el-col v-for="item in bindList" :span="8" :key="item.title">
          <el-card style="margin-bottom: 10px">
            <div class="flex w-full items-center gap-4">
              <component :is="item.avatar" v-if="item.avatar" :style="item?.style ?? {}" class="size-[40px]" />
              <div class="flex flex-1 items-center justify-between">
                <div class="flex flex-col">
                  <h4 class="mb-[4px] text-[14px] text-black/85 dark:text-white/85">
                    {{ item.title }}
                  </h4>
                  <span class="text-black/45 dark:text-white/45">
                    {{ item.description }}
                  </span>
                </div>
                <el-button :disabled="item.bound" size="small" link @click="handleAuthBinding(item.source)" style="color: #5353d5">
                  {{ buttonText(item) }}
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <ElAlert title="说明" type="success" :closable="false">
        <template #default>
          <p>
            需要添加第三方账号在
            <span class="font-bold"> apps\web-antd\src\views\_core\oauth-common.ts </span>
            中accountBindList按模板添加
          </p>
        </template>
      </ElAlert>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/**
list item 间距
*/
:deep(.ant-list-item) {
  padding: 6px;
}
</style>
