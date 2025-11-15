<script setup lang="ts">
import { Page } from '@vben/common-ui';

import { listDelete, listItemDelete, listQuery, listSelect } from '#/utils/page/list';

const state = reactive({
  url: '/wf/todo/main',
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

const router = useRouter();

function handleAdd() {
  router.push('/wf/todo/main/edit');
}

function handleEdit(row: any) {
  router.push({ path: '/wf/todo/main/edit', query: { id: row.id } });
}

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
            <el-input style="width: 180px" v-model="state.form.name" placeholder="输入主题回车查询" clearable @keyup.enter="listQuery(state)" />
            <el-button type="primary" @click="listQuery(state)" icon="Search">查询</el-button>
          </el-space>
          <el-space>
            <el-button icon="Plus" type="success" plain @click="handleAdd">新增</el-button>
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
        <el-table-column label="流程主题" prop="name" width="250" />
        <el-table-column label="备注" prop="notes" />
        <el-table-column label="流程发起人" prop="cruna" width="102" />
        <el-table-column label="当前处理人" prop="hauna" width="102" />
        <el-table-column label="接收时间" prop="crtim" width="164" />
        <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleEdit({ id: scope.row.id })" />
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
  </Page>
</template>
