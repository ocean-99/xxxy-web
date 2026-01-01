<script setup lang="ts">
import { Page } from '@vben/common-ui';

import { Pane, Splitpanes } from 'splitpanes';

import { requestClient } from '#/api/request';
import DeptTree from '#/components/tree/ViewTree.vue';
import { listDelete, listItemDelete, listQuery, listSelect } from '#/utils/page/list';

import DrawerEdit from './dedit.vue';
import ModalEdit from './medit.vue';
import PasswordEdit from './pedit.vue';

import 'splitpanes/dist/splitpanes.css';

const state = reactive({
  url: '/sys/user',
  loading: false,
  ids: [],
  form: {
    pageSize: 10,
  } as any,
  single: true,
  multiple: true,
  rows: [],
  total: 0,
  leftPaneSize: (250 / (window.innerWidth - 220)) * 100,
  editway: 'M',
  pageShow: false,
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

onMounted(async () => {
  await listQuery(state);
  state.pageShow = true;
});

const nodeClick = async (node: any) => {
  state.form.depid = node.id;
  // state.form.deptName = node.name;
  await listQuery(state);
};

const deditRef = ref() as any;
const deditClose = async () => {
  await listQuery(state);
};

const meditRef = ref() as any;
const meditClose = async () => {
  await listQuery(state);
};

const peditRef = ref() as any;

const router = useRouter();

const editOpen = (data: any) => {
  switch (state.editway) {
    case 'D': {
      deditRef.value.open(data);
      break;
    }
    case 'M': {
      meditRef.value.open(data);
      break;
    }
    case 'T': {
      router.push({ path: '/sys/user/edit', query: data });
      break;
    }
  }
};

const handleStatusChange = async (row: any) => {
  row.avtag = !(row.avtag === true || row.avtag === 1 || row.avtag === '1');
  const text = row.avtag ? '启用' : '停用';
  ElMessageBox.confirm(`确认要"${text}""${row.name}"用户吗?`, '提示')
    .then(async () => {
      await requestClient.put(`${state.url}/avtag`, {
        id: row.id,
        avtag: row.avtag,
      });
      ElMessage.success(`${text}成功`);
    })
    .catch(() => {
      row.avtag = !row.avtag;
      ElMessage.info('已取消');
    });
};

const isActive = (value: any) => {
  return value === true || value === 1 || value === '1';
};
</script>

<template>
  <Page auto-content-height>
    <Splitpanes class="default-theme" v-show="state.pageShow">
      <Pane :size="state.leftPaneSize">
        <DeptTree @node-click="nodeClick" url="/sys/dept/tree" tip="部门名称" :expand="true" />
      </Pane>
      <Pane>
        <el-card class="box-card" style="height: 100%" body-style="height: 100%">
          <template #header>
            <div v-show="moreParams" ref="moreParamsDiv" class="more-params">
              <el-form :inline="true" label-width="80px">
                <el-form-item label="用户账号">
                  <el-input v-model="state.form.username" placeholder="用户账号" />
                </el-form-item>
                <el-form-item label="手机号">
                  <el-input v-model="state.form.monum" placeholder="手机号" />
                </el-form-item>
                <el-form-item label="邮箱">
                  <el-input v-model="state.form.email" placeholder="用户邮箱" />
                </el-form-item>
                <el-form-item label="备注">
                  <el-input v-model="state.form.notes" placeholder="备注" />
                </el-form-item>
              </el-form>
            </div>
            <div class="flex justify-between">
              <el-space>
                <!--                <VbenAvatar alt="测试" src="http://localhost:5666/api/tool/oss/main/show?id=1977195329891160064" class="size-8" dot />-->
                <el-input style="width: 180px" v-model="state.form.name" placeholder="输入用户昵称回车查询" clearable @keyup.enter="listQuery(state)" />
                <el-button type="primary" @click="listQuery(state)" icon="Search"> 查询</el-button>
                <el-button class="more-button" :icon="moreParams ? 'ArrowUp' : 'ArrowDown'" plain @click="moreParams = !moreParams" />
              </el-space>
              <el-space>
                <el-select v-model="state.editway" placeholder="编辑模式" style="width: 100px">
                  <el-option label="弹框编辑" value="M" />
                  <el-option label="抽屉编辑" value="D" />
                  <el-option label="页签编辑" value="T" />
                </el-select>
                <el-button icon="Plus" v-access:code="['sys:user:edit']" type="success" plain @click="editOpen({ depid: state.form.depid })">新增 </el-button>
                <el-button icon="Delete" v-access:code="['sys:user:delete']" type="danger" plain @click="listDelete(state)" :disabled="state.multiple">删除 </el-button>
              </el-space>
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
            <el-table-column label="用户昵称" align="center" prop="name" width="116">
              <template #default="scope">
                <span class="link_span" @click="editOpen({ id: scope.row.id })" v-if="scope.row.id !== 'u1'">{{ scope.row.name }}</span>
                <span v-else>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="用户账号" align="center" prop="username" width="116" />
            <el-table-column label="所属机构/部门" align="center" prop="depna" width="200" />
            <el-table-column label="手机号码" align="center" prop="monum" width="120" />
            <el-table-column label="状态" align="center" width="82">
              <template #default="scope">
                <el-switch :model-value="isActive(scope.row.avtag)" :active-value="true" :inactive-value="false" @click="handleStatusChange(scope.row)" v-if="scope.row.id !== 'u1'" />
              </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="crtim" width="164">
              <template #default="scope">
                <span>{{ scope.row.crtim }}</span>
              </template>
            </el-table-column>
            <el-table-column label="备注" align="center" prop="notes" :show-overflow-tooltip="true" />
            <el-table-column label="操作" align="center" fixed="right" width="116" class-name="small-padding fixed-width">
              <template #default="scope">
                <el-tooltip v-if="scope.row.id !== 'u1'" content="修改" placement="top">
                  <el-button link type="primary" icon="Edit" @click="editOpen({ id: scope.row.id })" />
                </el-tooltip>
                <el-tooltip v-if="scope.row.id !== 'u1'" content="删除" placement="top">
                  <el-button link type="primary" icon="Delete" @click="listItemDelete(state, scope.row.id)" />
                </el-tooltip>
                <el-tooltip v-if="scope.row.id !== 'u1'" content="重置密码" placement="top">
                  <el-button link type="primary" icon="Key" @click="peditRef.open({ id: scope.row.id })" />
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
      </Pane>
    </Splitpanes>
    <DrawerEdit ref="deditRef" @close="deditClose" />
    <ModalEdit ref="meditRef" @close="meditClose" />
    <PasswordEdit ref="peditRef" />
  </Page>
</template>
