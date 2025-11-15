<script setup lang="ts">
import { Page } from '@vben/common-ui';

import { listDelete, listItemDelete, listQuery, listSelect } from '#/utils/page/list';
import { parseTime } from '#/utils/ruoyi';

import DrawerEdit from './edit.vue';

const state = reactive({
  url: '/wf/bus/leave',
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

const editRef = ref() as any;

const editClose = async () => {
  await listQuery(state);
};

onMounted(async () => {
  await listQuery(state);
});

const options = [
  {
    value: '1',
    label: '事假',
  },
  {
    value: '2',
    label: '调休',
  },
  {
    value: '3',
    label: '病假',
  },
  {
    value: '4',
    label: '婚假',
  },
];
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
            <el-button icon="Plus" type="success" plain @click="editRef.open()">新增</el-button>
            <el-button icon="Delete" type="danger" plain @click="listDelete(state)" :disabled="state.multiple">删除 </el-button>
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
        <el-table-column label="请假类型" align="center" width="90">
          <template #default="scope">
            <el-tag>{{ options.find((e) => e.value === scope.row.type)?.label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" align="center" prop="sttim" width="120">
          <template #default="scope">
            <span>{{ parseTime(scope.row.sttim, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结束时间" align="center" prop="entim" width="120">
          <template #default="scope">
            <span>{{ parseTime(scope.row.entim, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="请假原因" prop="reason" />
        <el-table-column label="操作" align="center" width="82" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button v-access:code="['system:config:edit']" link type="primary" icon="Edit" @click="editRef.open({ id: scope.row.id })" />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button v-access:code="['system:config:remove']" link type="primary" icon="Delete" @click="listItemDelete(state, scope.row.id)" />
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
