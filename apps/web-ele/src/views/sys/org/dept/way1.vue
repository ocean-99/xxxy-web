<script setup lang="ts">
import { Page } from '@vben/common-ui';

import { listDelete, listItemDelete, listQuery, listSelect } from '#/utils/page/list';

import ModalEdit from './medit.vue';
import DeptTree from './tree.vue';

const emits = defineEmits(['toggle']);

const state = reactive({
  url: '/sys/org/dept',
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
  state.form.pid = node.id;
  await listQuery(state);
};

const toggle = () => {
  emits('toggle');
};

const meditRef = ref() as any;
const meditClose = async () => {
  await listQuery(state);
};
</script>

<template>
  <Page auto-content-height>
    <div class="flex h-full gap-[8px]">
      <div class="w-[260px]">
        <DeptTree @node-click="nodeClick" />
      </div>
      <el-card style="height: 100%" body-style="height: 100%" class="box-card flex-1 overflow-hidden">
        <template #header>
          <div class="flex justify-between">
            <el-space>
              <el-input style="width: 180px" v-model="state.form.name" placeholder="输入名称回车查询" clearable @keyup.enter="listQuery(state)" />
              <el-button type="primary" @click="listQuery(state)" icon="Search">查询</el-button>
              <el-button type="warning" icon="Operation" @click="toggle()" plain>切换</el-button>
            </el-space>
            <el-space>
              <el-button icon="Plus" type="success" plain @click="meditRef.open({ pid: state.form.pid })">新增</el-button>
              <el-button icon="Delete" type="danger" plain @click="listDelete(state)" :disabled="state.multiple">删除</el-button>
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
          <el-table-column label="部门名称" width="250">
            <template #default="scope">
              <span class="link_span" @click="meditRef.open({ id: scope.row.id })">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" prop="notes" />
          <el-table-column label="创建人" align="center" prop="cruna" />
          <el-table-column label="创建时间" align="center" prop="crtim" width="164">
            <template #default="scope">
              <span>{{ scope.row.crtim }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" align="center" width="86" class-name="small-padding fixed-width">
            <template #default="scope">
              <el-tooltip content="修改" placement="top">
                <el-button link type="primary" icon="Edit" @click="meditRef.open({ id: scope.row.id })" />
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
    <ModalEdit ref="meditRef" @close="meditClose" />
  </Page>
</template>
