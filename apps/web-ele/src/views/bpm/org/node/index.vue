<script setup lang="ts">
import { useRoute } from 'vue-router';

import { Page } from '@vben/common-ui';

import { treeDelete, treeItemDelete, treeQuery, treeSelect } from '#/utils/page/tree';

import DrawerEdit from './edit.vue';

const state = reactive({
  url: '/bpm/org/node',
  loading: false,
  ids: [],
  form: {} as any,
  single: true,
  multiple: true,
  list: [],
});
const treeProps = reactive({
  checkStrictly: true,
});
const nodeTableRef = ref();

const route = useRoute();
onMounted(async () => {
  const treid = route.query?.treid;
  const trena = route.query?.trena;
  state.form = { treid, trena };
  await treeQuery(state);
});

const editRef = ref() as any;

const editClose = async () => {
  await treeQuery(state);
};
</script>

<template>
  <Page auto-content-height>
    <el-card style="height: 100%" body-style="height: 100%" class="box-card flex-1 overflow-hidden">
      <template #header>
        <div class="flex justify-between">
          <el-space>
            {{ state.form.trena }}
            <el-input style="width: 180px" v-model="state.form.name" placeholder="组织节点名称" clearable @keyup.enter="treeQuery(state)" />
            <el-button type="primary" @click="treeQuery(state)" icon="Search"> 查询</el-button>
          </el-space>
          <el-space>
            <el-button icon="Plus" type="success" plain @click="editRef.open({ treid: state.form.treid })">新增</el-button>
            <el-button icon="Delete" type="danger" plain @click="treeDelete(state)" :disabled="state.multiple">删除</el-button>
          </el-space>
        </div>
      </template>
      <div :style="{ height: 'calc(100% - 50px)' }">
        <el-auto-resizer>
          <template #default="{ height, width }">
            <el-table
              @selection-change="treeSelect($event, state)"
              ref="nodeTableRef"
              :width="width"
              :height="height"
              :tree-props="treeProps"
              :data="state.list"
              style="width: 100%; margin-bottom: 20px"
              row-key="id"
              border
              default-expand-all
            >
              <el-table-column type="selection" width="46" align="center" />
              <el-table-column prop="name" label="节点名称" width="160" />
              <el-table-column prop="ornum" label="排序号" width="70" align="center" />
              <el-table-column label="节点成员" prop="memna" width="200">
                <template #default="scope">
                  <span>{{ scope.row.memna }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="notes" label="备注" />
              <el-table-column label="操作" fixed="right" align="center" width="110" class-name="small-padding fixed-width">
                <template #default="scope">
                  <el-tooltip content="修改" placement="top">
                    <el-button link type="primary" icon="Edit" @click="editRef.open({ id: scope.row.id })" />
                  </el-tooltip>
                  <el-tooltip content="新增" placement="top">
                    <el-button link type="primary" icon="Plus" @click="editRef.open({ treid: state.form.treid, pid: scope.row.id })" />
                  </el-tooltip>
                  <el-tooltip content="删除" placement="top">
                    <el-button link type="primary" icon="Delete" @click="treeItemDelete(state, scope.row.id)" />
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-auto-resizer>
      </div>
    </el-card>
    <DrawerEdit ref="editRef" @close="editClose" />
  </Page>
</template>
