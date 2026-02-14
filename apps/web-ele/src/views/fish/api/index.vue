<script setup lang="ts">
import { Page } from '@vben/common-ui';

import { listDelete, listItemDelete, listQuery, listSelect } from '#/utils/page/list';

import DrawerEdit from './edit.vue';

const state = reactive({
  url: '/codeApi',
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
</script>

<template>
  <Page auto-content-height>
    <el-card class="box-card" style="height: 100%" body-style="height: 100%">
      <template #header>
        <div class="flex justify-between">
          <el-space>
            <el-input style="width: 180px" v-model="state.form.name" placeholder="输入名称回车查询" clearable @keyup.enter="listQuery(state)" />
            <el-select style="width: 120px" v-model="state.form.enable" placeholder="选择状态" clearable @change="listQuery(state)">
              <el-option label="启用" :value="true" />
              <el-option label="禁用" :value="false" />
            </el-select>
            <el-button type="primary" @click="listQuery(state)" icon="Search"> 查询</el-button>
          </el-space>
          <el-space>
            <el-button icon="Plus" type="success" plain @click="editRef.open()">新增</el-button>
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
        <el-table-column label="名称">
          <template #default="scope">
            <span class="link_span" @click="editRef.open({ id: scope.row.id })">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="enable" width="86" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.enable ? 'success' : 'info'">{{ scope.row.enable ? '启用' : '禁用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="基础URL" prop="baseUrl" width="240" show-overflow-tooltip />
        <el-table-column label="项目ID" prop="projectId" width="180" />
        <el-table-column label="用户名" prop="username" width="120" />
        <el-table-column label="余额" prop="balance" width="100" align="right" />
        <el-table-column label="信用分" prop="creditScore" width="100" align="right">
          <template #default="scope">
            <span :style="{ color: scope.row.creditScore >= 80 ? '#67c23a' : scope.row.creditScore >= 60 ? '#e6a23c' : '#f56c6c' }">
              {{ scope.row.creditScore }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="164" />
        <el-table-column label="操作" align="center" width="86" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="editRef.open({ id: scope.row.id })" />
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
