<script setup lang="ts">
import { Page } from '@vben/common-ui';

import { listDelete, listQuery, listSelect } from '#/utils/page/list';

import DrawerView from './view.vue';

const state = reactive({
  url: '/mon/job/log',
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

const viewRef = ref() as any;

const viewClose = async () => {
  await listQuery(state);
};

onMounted(async () => {
  await listQuery(state);
});

</script>

<template>
  <Page auto-content-height>
    <el-card class="box-card" style="height: 100%" body-style="height: 100%">
      <template #header>
        <div class="flex justify-between">
          <el-space>
            <el-input style="width: 180px" v-model="state.form.name" placeholder="输入名称回车查询" clearable @keyup.enter="listQuery(state)" />
            <el-button type="primary" @click="listQuery(state)" icon="Search"> 查询</el-button>
          </el-space>
          <el-space>
            <el-button icon="Delete" type="danger" plain @click="listDelete(state)" :disabled="state.multiple">删除</el-button>
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
        <el-table-column label="任务名称" prop="name" />
        <el-table-column label="任务开始时间" prop="sttim" width="164" />
        <el-table-column label="任务结束时间" prop="entim" width="164" />
        <el-table-column label="执行结果" prop="ret" width="96" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.ret === '成功' ? 'success' : 'danger'">{{ scope.row.ret }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="查看" align="center" width="56" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="查看详情" placement="top">
              <el-button link type="primary" icon="View" @click="viewRef.open({ id: scope.row.id })" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        style="margin-top: 10px"
        @size-change="listQuery(state)"
        @current-change="listQuery(state)"
        :pager-count="5"
        :page-sizes="[10, 20, 30, 50, 100]"
        background
        :total="state.total"
        v-model:current-page="state.form.pageNum"
        v-model:page-size="state.form.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </el-card>
    <DrawerView ref="viewRef" @close="viewClose" />
  </Page>
</template>
