<script setup lang="ts">
import { Page } from '@vben/common-ui';

import { listDelete, listItemDelete, listQuery, listSelect } from '#/utils/page/list';

const state = reactive({
  url: '/tool/oss/main',
  loading: false,
  ids: [],
  form: {
    pageSize: 10,
  } as any,
  single: true,
  multiple: true,
  rows: [],
  total: 0,
  preview: true,
  localShow: 'ass/oss/main/show?token=',
});

onMounted(async () => {
  await listQuery(state);
});

const checkFileSuffix = (fileSuffix: string) => {
  const arr = ['png', 'jpg', 'jpeg'];
  return arr.some((type) => {
    return fileSuffix.includes(type);
  });
};

const openConfig = async () => {
  await router.push({
    path: '/ass/oss/config',
  });
};

const downloadFile = async (id: string) => {
  await request({
    url: '/gen/oss/download',
    method: 'get',
    params: { id: id },
    responseType: 'blob',
  });
};
</script>

<template>
  <Page auto-content-height>
    <el-card class="box-card" style="height: 100%" body-style="height: 100%">
      <template #header>
        <div class="flex justify-between">
          <el-space>
            <el-input style="width: 180px" v-model="state.form.name" placeholder="输入名称回车查询" clearable @keyup.enter="listQuery(state)" />
            <el-button type="primary" @click="listQuery(state)" plain>查 询</el-button>
            <el-button type="primary" @click="state.preview = !state.preview" plain>预览开关</el-button>
            <el-button type="warning" icon="Operation" @click="openConfig()" plain>配 置</el-button>
          </el-space>
          <el-space>
            <el-button type="success" icon="Upload" @click="uploadFile" plain>上传</el-button>
            <el-button icon="Delete" type="danger" plain @click="listDelete(state)" :disabled="state.multiple">删除 </el-button>
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
        <el-table-column label="序号" type="index" width="50" align="center" />
        <el-table-column label="文件名称" prop="id" width="250">
          <template #default="scope">
            <span style="cursor: pointer; color: #3e9ece" @click="downloadFile(scope.row.id)">
              {{ scope.row.name }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="文件后缀" prop="type" width="70" />
        <el-table-column label="图片预览" width="78" v-if="state.preview">
          <template #default="scope">
            <el-image v-if="checkFileSuffix(scope.row.type)" style="width: 60px; height: 50px" :src="scope.row.service === 'local' ? state.localShow + '&id=' + scope.row.id : scope.row.path" />
            <span v-text="'没有预览'" v-if="!checkFileSuffix(scope.row.type)" />
          </template>
        </el-table-column>
        <el-table-column label="完整地址" prop="path" />
        <el-table-column label="服务商" prop="service" width="80" />
        <el-table-column label="上传时间" prop="crtim" width="150" />
        <el-table-column label="上传人" prop="crman" width="60" />
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

    <!-- 添加或修改OSS对象存储对话框 -->
    <el-dialog v-model="dialog.visible" :title="dialog.title" width="500px" append-to-body>
      <el-form ref="ossFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="文件名">
          <fileUpload v-if="type === 0" v-model="form.file" />
          <imageUpload v-if="type === 1" v-model="form.file" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </Page>
</template>
