<script setup lang="ts">
import { Page } from '@vben/common-ui';

import { debounce } from 'lodash-es';

import AppvCard from './approval-card.vue';

const state = reactive({
  url: '/wf/org/tree',
  loading: false,
  ids: [],
  form: {
    pageSize: 10,
  } as any,
  single: true,
  multiple: true,
  rows: [],
  total: 0,
});

const options = ['待办任务', '已办任务'];
const filterText = ref('');

const handleScroll = debounce(async (e: Event) => {
  if (!e.target) {
    return;
  }
  const { scrollTop, clientHeight, scrollHeight } = e.target as HTMLElement;
  // 判断是否滚动到底部
  console.log('scrollTop + clientHeight', scrollTop + clientHeight);
  console.log('scrollHeight', scrollHeight);
}, 200);
</script>

<template>
  <Page auto-content-height>
    <div class="flex h-full gap-[8px]">
      <div class="w-[320px]">
        <el-card style="height: 100%" body-style="height: 100%" class="box-card nopadding">
          <template #header>
            <div class="card-header">
              <el-segmented v-model="state.form.type" :options="options" size="default" style="margin-bottom: 8px; width: 100%" />
              <div class="tree-h-flex">
                <div class="tree-h-left">
                  <div>
                    <el-input prefix-icon="Search" v-model="filterText"  />
                  </div>
                </div>
                <div class="tree-h-right">
                  <div>
                    <el-button style="margin-left: 4px; width: 34px">
                      <el-icon class="el-icon--center">
                        <Refresh />
                      </el-icon>
                    </el-button>
                    <el-dropdown>
                      <el-button style="margin-left: 4px; width: 34px">
                        <el-icon class="el-icon--center">
                          <MoreFilled />
                        </el-icon>
                      </el-button>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item command="addCate">新增</el-dropdown-item>
                          <el-dropdown-item command="refresh">测试</el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <div style="height: calc(100% - 90px); overflow: auto; padding: 8px" class="thin-scrollbar" @scroll="handleScroll">
            <AppvCard />
            <AppvCard />
            <AppvCard />
            <AppvCard />
            <AppvCard />
            <AppvCard />
            <AppvCard />
            <AppvCard />
            <AppvCard />
            <AppvCard />
            <AppvCard />
            <AppvCard />
            <AppvCard />
            <AppvCard />
          </div>
        </el-card>
      </div>
      <el-card style="height: 100%" body-style="height: 100%" class="box-card flex-1 overflow-hidden">
        <template #header>
          <div class="flex justify-between">
            <el-space>
              <el-input style="width: 180px" v-model="state.form.name" placeholder="流程组织树" clearable @keyup.enter="listQuery(state)" />
              <el-button type="primary" @click="listQuery(state)" icon="Search"> 查询</el-button>
            </el-space>
            <el-space>
              222
            </el-space>
          </div>
        </template>
        aaa
      </el-card>
    </div>
  </Page>
</template>

<style scoped>
.tree-h-flex {
  display: flex;
}

.tree-h-left {
  flex: 1;
  width: 100%;
}

.tree-h-right {
  width: 76px;
  min-width: 76px;
}

.thin-scrollbar {
  &::-webkit-scrollbar {
    width: 5px;
  }
}
</style>
