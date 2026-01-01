<script setup lang="tsx">
import { Page } from '@vben/common-ui';
import { VbenIcon } from '@vben/icons';

import { treeItemDelete, treeQuery } from '#/utils/page/tree';

import DrawerEdit from './edit.vue';

const state = reactive({
  url: '/sys/menu',
  list: [] as any,
  form: { name: '' } as any,
});

const columns = [
  { key: 'id', dataKey: 'id', title: 'ID', width: 120, hidden: true },
  { key: 'name', dataKey: 'name', title: '菜单名称', width: 180 },
  {
    align: 'center',
    key: 'icon',
    title: '图标',
    width: 60,
    cellRenderer: (row: any) => <VbenIcon icon={row.rowData.icon} />,
  },
  {
    align: 'center',
    key: 'icon',
    title: '类型',
    width: 60,
    cellRenderer: (row: any) => (
      <>
        <el-button icon="Folder" link type="primary" v-show={row.rowData.type === '1'} />
        <el-button icon="Menu" link style="margin-left: 0" type="success" v-show={row.rowData.type === '2'} />
      </>
    ),
  },
  { key: 'pid', dataKey: 'pid', title: '父ID', width: 100, hidden: true },
  { key: 'ornum', dataKey: 'ornum', title: '排序', width: 50 },
  { key: 'crtim', dataKey: 'crtim', title: '创建时间', width: 180 },
  { key: 'cruna', dataKey: 'cruna', title: '创建人', width: 100 },
  { key: 'uptim', dataKey: 'uptim', title: '更新时间', width: 180 },
  { key: 'upuna', dataKey: 'upuna', title: '更新人', width: 100 },
  { key: 'notes', dataKey: 'notes', title: '备注', width: 150 },
  {
    align: 'center',
    key: 'operate',
    title: '操作',
    width: 100,
    fixed: 'right',
    cellRenderer: (row: any) => (
      <>
        <el-tooltip content="修改" placement="top">
          <el-button icon="Edit" link onClick={() => editRef.value.open({ id: row.rowData.id })} type="primary" />
        </el-tooltip>
        <el-tooltip content="新增" placement="top">
          <el-button icon="Plus" link onClick={() => editRef.value.open({ pid: row.rowData.id })} type="primary" />
        </el-tooltip>
        <el-tooltip content="删除" placement="top">
          <el-button icon="Delete" link onClick={() => treeItemDelete(state, row.rowData.id)} type="primary" />
        </el-tooltip>
      </>
    ),
  },
] as any;

onMounted(async () => {
  await treeQuery(state);
});

const editRef = ref() as any;

const editClose = async () => {
  await treeQuery(state);
};
</script>

<template>
  <Page auto-content-height>
    <el-card class="box-card" style="height: 100%" body-style="height: 100%">
      <template #header>
        <div class="flex justify-between">
          <el-space>
            <el-input style="width: 180px" v-model="state.form.name" placeholder="输入菜单名称可回车查询" clearable @keyup.enter="treeQuery(state)" />
            <el-button type="primary" icon="Search" @click="treeQuery(state)">查询</el-button>
          </el-space>
          <el-space>
            <el-button icon="Plus" type="success" plain @click="editRef.open({})">新增</el-button>
          </el-space>
        </div>
      </template>

      <div :style="{ height: 'calc(100% - 50px)' }">
        <el-auto-resizer>
          <template #default="{ height, width }">
            <el-table-v2 :columns="columns" :data="state.list" :width="width" expand-column-key="name" :height="height" fixed scrollbar-always-on />
          </template>
        </el-auto-resizer>
      </div>
    </el-card>
    <DrawerEdit ref="editRef" @close="editClose" />
  </Page>
</template>
