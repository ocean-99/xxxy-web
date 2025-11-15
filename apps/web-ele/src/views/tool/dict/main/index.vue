<script setup lang="ts">
import { listDelete, listQuery, listSelect } from '#/utils/page/list';

import { emitter } from '../mitt';
import EditModal from './edit.vue';

const state = reactive({
  url: '/tool/dict/main',
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

const rowClick = (row: any) => {
  emitter.emit('rowClick', row.id);
};

const editRef = ref() as any;

const editClose = async () => {
  await listQuery(state);
};
</script>

<template>
  <div>
    <el-card class="box-card" style="height: 100%" body-style="height: 100%">
      <template #header>
        <div class="flex justify-between">
          <el-space>
            <span style="min-width: 66px">字典列表</span>
            <el-input style="width: 120px" v-model="state.form.name" placeholder="字典名称" clearable @keyup.enter="listQuery(state)" />
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
        highlight-current-row
        class="dict-type-table"
        @row-click="rowClick"
      >
        <el-table-column type="selection" width="44" align="center" />
        <el-table-column label="字典名称" prop="name" width="100" min-width="100" />
        <el-table-column label="字典代码" prop="code" width="160" min-width="160" />
        <el-table-column label="备注" prop="notes" />
        <el-table-column label="创建时间" prop="crtim" width="164" />
        <el-table-column label="操作" align="center" width="56" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="editRef.open({ id: scope.row.id })" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        style="margin-top: 10px"
        @size-change="listQuery(state)"
        @current-change="listQuery(state)"
        :pager-count="5"
        background
        :total="state.total"
        v-model:current-page="state.form.pageNum"
        v-model:page-size="state.form.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </el-card>
    <EditModal ref="editRef" @close="editClose" />
  </div>
</template>

<style scoped>
.dict-type-table:hover {
  cursor: pointer;
}
</style>
