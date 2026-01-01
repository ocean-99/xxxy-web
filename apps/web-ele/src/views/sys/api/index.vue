<script setup lang="ts">
import { Page } from '@vben/common-ui';

import MenuTree from '#/components/tree/ViewTree.vue';
import { listDelete, listItemDelete, listQuery, listSelect } from '#/utils/page/list';

import DrawerEdit from './edit.vue';

const state = reactive({
  url: '/sys/api',
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

onMounted(async () => {
  await listQuery(state);
});

const nodeClick = async (node: any) => {
  if (node.id) {
    state.form.menid = node.id;
  } else {
    delete state.form.menid;
  }
  await listQuery(state);
};

const editRef = ref() as any;

const editClose = async () => {
  await listQuery(state);
};
</script>

<template>
  <Page auto-content-height>
    <div class="flex h-full gap-[8px]">
      <div class="w-[260px]">
        <MenuTree @node-click="nodeClick" url="/sys/menu/tree" tip="菜单名称" />
      </div>
      <el-card style="height: 100%" body-style="height: 100%" class="box-card flex-1 overflow-hidden">
        <template #header>
          <div class="flex justify-between">
            <el-space>
              <el-input style="width: 180px" v-model="state.form.name" placeholder="输入接口名称回车查询" clearable @keyup.enter="listQuery(state)" />
              <el-button type="primary" @click="listQuery(state)" icon="Search"> 查询</el-button>
            </el-space>
            <el-space>
              <el-button icon="Plus" type="success" plain @click="editRef.open({ menid: state.form.menid })">新增 </el-button>
              <el-button icon="Delete" type="danger" plain @click="listDelete(state)" :disabled="state.multiple">删除 </el-button>
            </el-space>
          </div>
        </template>

        <el-table
          style="height: calc(100% - 90px)"
          @selection-change="listSelect($event, state)"
          :cell-style="{ padding: '2px' }"
          :row-style="{ height: '36px' }"
          v-loading="state.loading"
          :data="state.rows"
          border
          stripe
        >
          <el-table-column type="selection" width="44" align="center" />
          <el-table-column label="#" type="index" width="50" align="center" />
          <el-table-column label="接口名称" align="center" prop="name" width="180">
            <template #default="scope">
              <span class="link_span" @click="editRef.open({ id: scope.row.id })">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="权限字符" prop="perm" width="160" />
          <el-table-column label="创建时间" align="center" prop="crtim" width="164" />
          <el-table-column label="备注" align="center" prop="notes" />
          <el-table-column label="操作" fixed="right" align="center" width="86" class-name="small-padding fixed-width">
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
          :total="state.total"
          v-model:current-page="state.form.pageNum"
          v-model:page-size="state.form.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </el-card>
    </div>
    <DrawerEdit ref="editRef" @close="editClose" />
  </Page>
</template>
