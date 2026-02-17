<script setup lang="ts">
import { Page } from '@vben/common-ui';

import { ElMessage, ElMessageBox } from 'element-plus';

import { requestClient } from '#/api/request';
import { listDelete, listItemDelete, listQuery, listSelect } from '#/utils/page/list';

import DrawerEdit from './edit.vue';

const state = reactive({
  url: '/account-info',
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

const handleEditCookie = async (row: any) => {
  try {
    const { value } = await ElMessageBox.prompt('请输入Cookie', '修改Cookie', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputType: 'textarea',
      inputValue: row.cookie2 || '',
      inputPlaceholder: '请输入新的Cookie内容',
    });

    if (value !== null) {
      await requestClient.put(`${state.url}`, {
        id: row.id,
        cookie2: value,
      });
      ElMessage.success('修改成功');
      await listQuery(state);
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error);
    }
  }
};

const handleStatusChange = async (val: any, row: any) => {
  try {
    await ElMessageBox.confirm('确认修改认证状态吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    await requestClient.put(`${state.url}`, {
      id: row.id,
      status: val,
    });
    row.status = val;
    ElMessage.success('修改成功');
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error);
    }
  }
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
            <el-input style="width: 180px" v-model="state.form.phone" placeholder="输入手机号回车查询" clearable @keyup.enter="listQuery(state)" />
            <el-input style="width: 180px" v-model="state.form.platform" placeholder="输入平台回车查询" clearable @keyup.enter="listQuery(state)" />
            <el-select style="width: 140px" v-model="state.form.status" placeholder="选择状态" clearable @change="listQuery(state)">
              <el-option label="未检查" :value="0" />
              <el-option label="检查中" :value="1" />
              <el-option label="已认证" :value="2" />
              <el-option label="未认证" :value="3" />
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
        <el-table-column label="手机号" prop="phone" width="120" />
        <el-table-column label="昵称" prop="nickName" width="120">
          <template #default="scope">
            <div class="flex items-center">
              <el-avatar v-if="scope.row.avatar" :src="scope.row.avatar" :size="28" style="margin-right: 8px" />
              <span class="link_span" @click="editRef.open({ id: scope.row.id })">{{ scope.row.nickName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="账号名称" prop="accountName" width="140" />
        <el-table-column label="平台" prop="platform" width="100" />
        <el-table-column label="项目ID" prop="projectId" width="180" />
        <el-table-column label="认证状态" prop="status" width="120" align="center">
          <template #default="scope">
            <el-select :model-value="scope.row.status" size="small" placeholder="请选择" @change="(val) => handleStatusChange(val, scope.row)">
              <el-option label="未检查" :value="0" />
              <el-option label="检查中" :value="1" />
              <el-option label="已认证" :value="2" />
              <el-option label="未认证" :value="3" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="Cookie" prop="cookie2" width="200">
          <template #default="scope">
            <div class="flex items-center">
              <span class="truncate" style="display: inline-block; max-width: 140px" v-if="scope.row.cookie2">
                {{ scope.row.cookie2 }}
              </span>
              <span v-else>-</span>
              <el-button link type="primary" icon="Edit" @click="handleEditCookie(scope.row)" style="margin-left: 8px" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="原因" prop="reason" width="140" show-overflow-tooltip />
        <el-table-column label="创建时间" prop="createTime" width="164" />
        <el-table-column label="操作" align="center" width="86" class-name="small-padding fixed-width">
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
