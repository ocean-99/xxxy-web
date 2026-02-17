<script setup lang="ts">
import { Page } from '@vben/common-ui';

import { listDelete, listItemDelete, listQuery, listSelect } from '#/utils/page/list';

import DrawerEdit from './edit.vue';

const state = reactive({
  url: '/fish-listing',
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

const editRef = ref() as any;

const editClose = async () => {
  await listQuery(state);
};

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
            <el-input style="width: 180px" v-model="state.form.title" placeholder="输入标题回车查询" clearable @keyup.enter="listQuery(state)" />
            <el-input style="width: 140px" v-model="state.form.userNick" placeholder="用户昵称" clearable @keyup.enter="listQuery(state)" />
            <el-input style="width: 120px" v-model="state.form.area" placeholder="地区" clearable @keyup.enter="listQuery(state)" />
            <el-select style="width: 120px" v-model="state.form.isVideo" placeholder="类型" clearable @change="listQuery(state)">
              <el-option label="图文" :value="false" />
              <el-option label="视频" :value="true" />
            </el-select>
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
        stripe
      >
        <el-table-column type="selection" width="44" align="center" />
        <el-table-column label="#" type="index" width="50" align="center" />
        <el-table-column label="商品图片" prop="picUrl" width="80" align="center">
          <template #default="scope">
            <el-image v-if="scope.row.picUrl" :src="scope.row.picUrl" :preview-src-list="[scope.row.picUrl]" preview-teleported />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="title" width="220" show-overflow-tooltip>
          <template #default="scope">
            <div class="flex items-center">
              <el-tag v-if="scope.row.isVideo" type="danger" size="small" style="margin-right: 4px">视频</el-tag>
              <span class="link_span" @click="editRef.open({ id: scope.row.id })">{{ scope.row.title }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="用户昵称" prop="userNick" width="140">
          <template #default="scope">
            <div class="flex items-center">
              <el-avatar v-if="scope.row.userAvatarUrl" :src="scope.row.userAvatarUrl" :size="28" style="margin-right: 6px" />
              <span>{{ scope.row.userNick }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="售价" prop="soldPrice" width="100" align="center">
          <template #default="scope">
            <span v-if="scope.row.soldPrice" style="font-weight: bold; color: #f56c6c">¥{{ scope.row.soldPrice }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="地区" prop="area" width="100" align="center" />
        <el-table-column label="标签" prop="fishTags" width="160" show-overflow-tooltip>
          <template #default="scope">
            <el-tag v-for="(tag, index) in scope.row.fishTags?.slice(0, 2)" :key="index" size="small" style="margin-right: 4px">
              {{ tag }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="想要" prop="wantCount" width="80" align="center" sortable />
        <el-table-column label="浏览" prop="viewCount" width="80" align="center" sortable />
        <el-table-column label="收藏" prop="collectCount" width="80" align="center" sortable />
        <el-table-column label="发布时间" prop="publishTime" width="164" />
        <el-table-column label="商品ID" prop="itemId" width="140" show-overflow-tooltip />
        <el-table-column label="创建时间" prop="createTime" width="164" />
        <el-table-column label="操作" align="center" width="86" class-name="small-padding fixed-width" fixed="right">
          <template #default="scope">
            <el-tooltip content="查看详情" placement="top">
              <el-button link type="primary" icon="View" @click="editRef.open({ id: scope.row.id })" />
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
    <DrawerEdit ref="editRef" @close="editClose" />
  </Page>
</template>
