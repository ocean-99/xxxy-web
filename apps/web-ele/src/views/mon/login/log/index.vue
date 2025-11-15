<script setup lang="ts">
import { Page } from '@vben/common-ui';

import { listDelete, listQuery, listSelect } from '#/utils/page/list';
import { renderBrowserIcon, renderOsIcon } from '#/utils/render';

import DrawerView from './view.vue';

const state = reactive({
  url: '/mon/login/log',
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

const osShow = (os: any) => {
  if (os) {
    const split = os.split(' or ');
    if (split.length === 2) {
      return split[0];
    }
  }
  return os;
};
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
        <el-table-column type="selection" width="46" align="center" />
        <el-table-column label="用户账号" prop="usnam" width="110" />
        <el-table-column label="登录平台" prop="clkey" width="86" align="center"> PC </el-table-column>
        <el-table-column label="IP地址" prop="loip" />
        <el-table-column label="IP地点" prop="loloc" />
        <el-table-column label="系统" prop="os">
          <template #default="scope">
            <component :is="renderOsIcon(osShow(scope.row.os))" />
          </template>
        </el-table-column>
        <el-table-column label="浏览器" prop="browser">
          <template #default="scope">
            <component :is="renderBrowserIcon(scope.row.browser)" />
          </template>
        </el-table-column>
        <el-table-column label="操作状态" prop="sutag" width="86" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.sutag ? 'success' : 'danger'">{{ scope.row.sutag ? '成功' : '失败' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="提示信息" prop="himsg" width="160" />
        <el-table-column label="登录时间" prop="lotim" width="164" />
        <el-table-column label="操作" align="center" width="56" class-name="small-padding fixed-width">
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
        :page-sizes="[10, 20, 30]"
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
