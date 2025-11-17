<script setup lang="ts">
import { Page } from '@vben/common-ui';

import CateTree from '#/components/tree/ViewTree.vue';
import { listDelete, listItemDelete, listQuery, listSelect } from '#/utils/page/list';

import { emitter } from './mitt';

const state = reactive({
  url: '/bpm/bus/tmpl',
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

const tableHeight = ref({ height: 'calc(100% - 90px)' });

// 更多参数查询逻辑
const moreParams = ref(false);
const moreParamsDiv = ref(null as any);
watch(moreParams, async () => {
  await nextTick();
  tableHeight.value = {
    height: moreParams.value ? `calc(100% - ${moreParamsDiv.value?.offsetHeight + 98}px)` : 'calc(100% - 90px)',
  };
});

async function refresh() {
  await listQuery(state);
}

onMounted(async () => {
  await listQuery(state);
  emitter.on('flowTmplEditClose', refresh);
});

onUnmounted(() => emitter.off('flowTmplEditClose'));

// 左侧树节点点击事件
const nodeClick = async (node: any) => {
  state.form.catid = node.id;
  await listQuery(state);
};

// 打开编辑页面逻辑
const router = useRouter();

function handleAdd() {
  router.push(`${state.url}/edit`);
}

function handleEdit(row: any) {
  router.push({ path: `${state.url}/edit`, query: { id: row.id } });
}
</script>

<template>
  <Page auto-content-height>
    <div class="flex h-full gap-[8px]">
      <div class="w-[260px]">
        <CateTree @node-click="nodeClick" url="/bpm/bus/cate/tree" />
      </div>
      <el-card style="height: 100%" body-style="height: 100%" class="box-card flex-1 overflow-hidden">
        <template #header>
          <div class="flex justify-between">
            <el-space>
              <el-input style="width: 180px" v-model="state.form.name" placeholder="输入名称回车查询" clearable @keyup.enter="listQuery(state)" />
              <el-button type="primary" @click="listQuery(state)" icon="Search"> 查询</el-button>
              <el-button class="more-button" :icon="moreParams ? 'ArrowUp' : 'ArrowDown'" plain @click="moreParams = !moreParams" />
            </el-space>
            <el-space>
              <el-button icon="Plus" type="success" plain @click="handleAdd">新增</el-button>
              <el-button icon="Delete" type="danger" plain @click="listDelete(state)" :disabled="state.multiple">删除 </el-button>
            </el-space>
          </div>
          <div v-show="moreParams" ref="moreParamsDiv" class="more-params">
            <el-form :inline="true" label-width="100px">
              <el-form-item label="更多参数1">
                <el-input v-model="state.form.xxx" placeholder="更多参数1" />
              </el-form-item>
              <el-form-item label="更多参数2">
                <el-input v-model="state.form.yyy" placeholder="更多参数2" />
              </el-form-item>
            </el-form>
          </div>
        </template>

        <el-table
          :style="tableHeight"
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
          <el-table-column label="模板名称" prop="name" min-width="200">
            <template #default="scope">
              <span class="link_span" @click="handleEdit({ id: scope.row.id })">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="crtim" width="164" />
          <el-table-column label="创建人" prop="cruna" width="80" />
          <el-table-column label="更新时间" prop="uptim" width="164" />
          <el-table-column label="更新人" prop="upuna" width="80" />
          <el-table-column label="操作" fixed="right" align="center" width="82" class-name="small-padding fixed-width">
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
          :total="state.total"
          v-model:current-page="state.form.pageNum"
          v-model:page-size="state.form.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </el-card>
    </div>
  </Page>
</template>
