<script setup lang="ts">
import { Page } from '@vben/common-ui';

import EditTree from '#/components/tree/EditTree.vue';
import { listDelete, listItemDelete, listQuery, listSelect } from '#/utils/page/list';

import DrawerEdit from './edit.vue';

const state = reactive({
  url: '/wf/org/tree',
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
  state.form.catid = node.id;
  await listQuery(state);
};

const editRef = ref() as any;

const editClose = async () => {
  await listQuery(state);
};

const router = useRouter();
const toNode = (data: any) => {
  router.push({ path: '/wf/org/node', query: data });
};
</script>

<template>
  <Page auto-content-height>
    <div class="flex h-full gap-[8px]">
      <div class="w-[260px]">
        <EditTree @node-click="nodeClick" url="/wf/org/treec" tip="组织树分类" :type="0" />
      </div>
      <el-card style="height: 100%" body-style="height: 100%" class="box-card flex-1 overflow-hidden">
        <template #header>
          <div class="flex justify-between">
            <el-space>
              <el-input style="width: 180px" v-model="state.form.name" placeholder="流程组织树" clearable @keyup.enter="listQuery(state)" />
              <el-button type="primary" @click="listQuery(state)" icon="Search"> 查询</el-button>
            </el-space>
            <el-space>
              <el-button icon="Plus" type="success" plain @click="editRef.open({ catid: state.form.catid })">新增 </el-button>
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
          <el-table-column label="组织树名称" align="center" prop="name" width="180">
            <template #default="scope">
              <span class="link_span" @click="toNode({ treid: scope.row.id,trena: scope.row.name })">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="crtim" width="164" />
          <el-table-column label="更新时间" align="center" prop="uptim" width="164" />
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
