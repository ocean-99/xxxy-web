<script setup lang="ts">
import { Page } from '@vben/common-ui';

import { requestClient } from '#/api/request';
import { listDelete, listQuery, listSelect } from '#/utils/page/list';

import DrawerEdit from './edit.vue';

const state = reactive({
  url: '/mon/job/main',
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

async function startEvent(state: any) {
  const selIds = state.ids.join(',');
  if (selIds.length <= 0) {
    ElMessage.warning('请选择后再进行启动');
    return;
  }
  ElMessageBox.confirm('确认要启动选择项吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info',
  })
    .then(async () => {
      await requestClient.post(`${state.url}/start?ids=${selIds}`);
      // await post({url: state.url + '/start?ids=' + selIds});
      await listQuery(state);
    })
    .catch(() => ElMessage.info('已取消启动'));
}

async function stopEvent(state: any) {
  const selIds = state.ids.join(',');
  if (selIds.length <= 0) {
    ElMessage.warning('请选择后再进行关闭');
    return;
  }
  ElMessageBox.confirm('确认要关闭选择项吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info',
  })
    .then(async () => {
      await requestClient.post(`${state.url}/stop?ids=${selIds}`);
      // await post({url: state.url + '/stop?ids=' + selIds});
      await listQuery(state);
    })
    .catch(() => ElMessage.info('已取消关闭'));
}

const doOnce = async (id: string) => {
  ElMessageBox.confirm('确定立即执行一次吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info',
  }).then(async () => {
    await requestClient.post(`${state.url}/once?id=${id}`);
  });
};

const router = useRouter();

function openLog() {
  router.push('/mon/job/log');
}
</script>

<template>
  <Page auto-content-height>
    <el-card class="box-card" style="height: 100%" body-style="height: 100%">
      <template #header>
        <div class="flex justify-between">
          <el-space>
            <el-input style="width: 180px" v-model="state.form.name" placeholder="输入名称回车查询" clearable @keyup.enter="listQuery(state)" />
            <el-button type="primary" @click="listQuery(state)" icon="Search">查询</el-button>
            <el-button icon="Operation" @click="openLog()" plain>日志</el-button>
          </el-space>
          <el-space>
            <el-button icon="Plus" type="primary" plain @click="editRef.open()">新增</el-button>
            <el-button type="success" :disabled="state.multiple" @click="startEvent(state)" plain>启 用</el-button>
            <el-button :disabled="state.multiple" @click="stopEvent(state)" plain>禁 用</el-button>
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
        <el-table-column label="任务名称">
          <template #default="scope">
            <span class="link_span" @click="editRef.open({ id: scope.row.id })">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="任务代码" prop="code" width="120" />
        <el-table-column label="请求类型" prop="retyp" width="86" />
        <el-table-column label="请求URL" prop="reurl" />
        <el-table-column label="任务状态" prop="avtag" width="86" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.avtag ? 'success' : 'info'">{{ scope.row.avtag ? '启用' : '禁用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="crtim" width="164" />
        <el-table-column label="操作" align="center" width="56" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="立即执行一次" placement="top">
              <el-button link type="primary" icon="VideoPlay" @click="doOnce(scope.row.id)" />
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
