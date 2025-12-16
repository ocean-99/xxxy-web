<script setup lang="ts">
import { Page } from '@vben/common-ui';

import { requestClient } from '#/api/request';
import { calculateFileSize } from '#/utils/file';
import { downloadByData } from '#/utils/file/download';
import { listDelete, listItemDelete, listQuery, listSelect } from '#/utils/page/list';

import Show from './show.vue';

const state = reactive({
  url: '/tool/code/table',
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
  router.push(`/tool/code/edit`);
}

function handleEdit(row: any) {
  router.push({ path: `/tool/code/edit`, query: { id: row.id } });
}

onMounted(async () => {
  await listQuery(state);
});

const genCode = async (id: string) => {
  const data = await requestClient.get<Blob>(`${state.url}/zip?id=${id}`, {
    responseType: 'blob',
    timeout: 30 * 1000,
    isTransformResponse: false,
    onDownloadProgress: (e) => {
      // 计算下载进度
      const percent = Math.floor((e.loaded / e.total!) * 100);
      // 已经下载
      const current = calculateFileSize(e.loaded);
      // 总大小
      const total = calculateFileSize(e.total!);
      console.log(`已下载: ${current}/${total} (${percent}%)`);
    },
  });
  downloadByData(data, `${id}.zip`);
};

const showRef = ref() as any;
const showCode = async (id: string) => {
  // const data = await get({
  //   url: `${state.url}/show`,
  //   params: { id },
  // });
  const data = await requestClient.get(`${state.url}/show?id=${id}`);
  showRef.value.openModal(data);
};
</script>

<template>
  <Page auto-content-height>
    <el-card class="box-card" style="height: 100%" body-style="height: 100%">
      <template #header>
        <div class="flex justify-between">
          <el-space>
            <el-input style="width: 180px" v-model="state.form.name" placeholder="输入名称回车查询" clearable @keyup.enter="listQuery(state)" />
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
        <el-table-column label="物理表名称" prop="name" width="250">
          <template #default="scope">
            <span class="link_span" @click="handleEdit({ id: scope.row.id })">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="crtim" width="164" />
        <el-table-column label="备注" prop="notes" />
        <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="预览" placement="top">
              <el-button link type="primary" icon="View" @click="showCode(scope.row.id)" />
            </el-tooltip>
            <el-tooltip content="生成代码" placement="top">
              <el-button link type="primary" icon="Download" @click="genCode(scope.row.id)" />
            </el-tooltip>
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
    <Show ref="showRef" />
  </Page>
</template>
