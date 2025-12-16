<script setup lang="ts">
import { Page } from '@vben/common-ui';

import dayjs from 'dayjs';

import { requestClient } from '#/api/request';
import { renderBrowserIcon, renderOsIcon } from '#/utils/render';

const state = reactive({
  url: '/mon/online/user',
  loading: true,
  ids: [],
  form: {
    pageSize: 10,
    pageNum: 1,
  } as any,
  single: true,
  multiple: true,
  rows: [],
  total: 0,
  totalList: [] as any,
});

const listQuery = async () => {
  state.totalList = await requestClient.get(`${state.url}/list`, { params: state.form });
  state.total = state.totalList.length;
  state.loading = false;
  state.rows = state.totalList.slice((state.form.pageNum - 1) * state.form.pageSize, state.form.pageSize * state.form.pageNum);
};

const pageChange = () => {
  state.rows = state.totalList.slice((state.form.pageNum - 1) * state.form.pageSize, state.form.pageSize * state.form.pageNum);
};

onMounted(async () => {
  await listQuery();
});

const osShow = (os: any) => {
  if (os) {
    const split = os.split(' or ');
    if (split.length === 2) {
      return split[0];
    }
  }
  return os;
};

const kick = async (row: any) => {
  ElMessageBox.confirm(`确认要强制下线${row.userName}码？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      await requestClient.deleteWithMsg<void>(`${state.url}/kick/${row.tokenId}`);
    })
    .catch(() => ElMessage.info('已取消操作'));
};
</script>

<template>
  <Page auto-content-height>
    <el-card class="box-card" style="height: 100%" body-style="height: 100%">
      <template #header>
        <div class="flex justify-between">
          <el-space>
            <el-input style="width: 180px" v-model="state.form.name" placeholder="输入名称回车查询" clearable @keyup.enter="listQuery()" />
            <el-button type="primary" @click="listQuery()" icon="Search"> 查询</el-button>
            <div>.NET版本需要在.env中开启SignalR</div>
          </el-space>
        </div>
      </template>

      <el-table style="height: calc(100% - 90px)" :cell-style="{ padding: '2px' }" :row-style="{ height: '36px' }" v-loading="state.loading" :data="state.rows" border stripe>
        <el-table-column label="#" type="index" width="50" align="center" />
        <el-table-column label="用户账号" prop="usena" width="110" min-width="110" />
        <el-table-column label="登录平台" prop="detyp" width="86">PC</el-table-column>
        <el-table-column label="部门名称" prop="depna" width="150" min-width="150" />
        <el-table-column label="IP地址" prop="ip" />
        <el-table-column label="IP地点" prop="loginLocation" />
        <el-table-column label="系统" prop="os" width="150">
          <template #default="scope">
            <component :is="renderOsIcon(osShow(scope.row.os))" />
          </template>
        </el-table-column>
        <el-table-column label="浏览器" prop="browser" width="120">
          <template #default="scope">
            <component :is="renderBrowserIcon(scope.row.browser)" />
          </template>
        </el-table-column>
        <el-table-column label="登录时间" prop="loginTime" width="164">
          <template #default="scope">
            {{ dayjs(scope.row.loginTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="56" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="强制下线" placement="top">
              <el-button link type="danger" icon="Football" @click="kick(scope.row)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        style="margin-top: 10px"
        @size-change="pageChange"
        @current-change="pageChange"
        :pager-count="5"
        :page-sizes="[10, 20, 30]"
        background
        :total="state.total"
        v-model:current-page="state.form.pageNum"
        v-model:page-size="state.form.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </el-card>
  </Page>
</template>
