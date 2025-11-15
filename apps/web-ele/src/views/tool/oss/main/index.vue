<script setup lang="ts">
import type { OssFile } from '#/api/system/oss/model';

import { Page } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { ossDownload } from '#/api/system/oss';
import FileUpload2 from '#/components/tool/FileUpload2.vue';
import { calculateFileSize } from '#/utils/file';
import { downloadByData } from '#/utils/file/download';
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
  localShow: `${import.meta.env.VITE_GLOB_API_URL}/tool/oss/main/show`,
});

onMounted(async () => {
  await listQuery(state);
});

const preview = ref(true);

function isImageFile(ext: string) {
  const supportList = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  return supportList.some((item) => ext.toLocaleLowerCase().includes(item));
}

async function handleDownload(row: any) {
  const downloadSize = ref($t('pages.common.downloadLoading'));
  const loading = ElLoading.service({
    lock: true,
    text: downloadSize.value,
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  try {
    const data = await ossDownload(row.id, (e) => {
      // 计算下载进度
      const percent = Math.floor((e.loaded / e.total!) * 100);
      // 已经下载
      const current = calculateFileSize(e.loaded);
      // 总大小
      const total = calculateFileSize(e.total!);
      downloadSize.value = `已下载: ${current}/${total} (${percent}%)`;
    });
    downloadByData(data, row.name);
    ElMessage.success('下载完成');
  } finally {
    loading.close();
  }
}

const dialog = reactive({
  visible: false,
  title: '',
});

const initFormData = {
  file: undefined,
};
const data = reactive({
  form: { ...initFormData },
  rules: {
    file: [{ required: true, message: '文件不能为空', trigger: 'blur' }],
  },
});

const { form, rules } = toRefs(data);

/** 提交按钮 */
const submitForm = async () => {
  dialog.visible = false;
  await listQuery(state);
  // getList();
};

const ossFormRef = ref();

/** 表单重置 */
function reset() {
  form.value = { ...initFormData };
  ossFormRef.value?.resetFields();
}

const type = ref(0);
/** 文件按钮操作 */
const handleFile = () => {
  reset();
  type.value = 0;
  dialog.visible = true;
  dialog.title = '上传文件';
};
/** 图片按钮操作 */
const handleImage = () => {
  reset();
  type.value = 1;
  dialog.visible = true;
  dialog.title = '上传图片';
};

const cancel = () => {
  dialog.visible = false;
};

const uploadModal = ref();

const uploadFile = () => {
  uploadModal.value.open();
};

const closeUploadModal = async () => {
  await listQuery(state);
};
</script>

<template>
  <Page auto-content-height>
    <el-card class="box-card" style="height: 100%" body-style="height: 100%">
      <template #header>
        <div class="flex justify-between">
          <el-space>
            <el-input style="width: 180px" v-model="state.form.name" placeholder="输入名称回车查询" clearable @keyup.enter="listQuery(state)" />
            <el-button type="primary" @click="listQuery(state)" icon="Search"> 查询</el-button>
          </el-space>
          <el-space>
            <el-tooltip content="预览图片" placement="top">
              <el-switch v-model="preview" />
            </el-tooltip>
            <el-button plain @click="uploadFile">文件上传</el-button>
<!--            <el-button plain @click="handleImage">图片上传</el-button>-->
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
        <el-table-column label="#" type="index" width="50" align="center" />
        <el-table-column label="文件名" prop="name" width="220" />
        <el-table-column label="文件预览" prop="url" width="150" align="center" show-overflow-tooltip>
          <template #default="scope">
            <el-image
              fit="cover"
              :key="scope.row.id"
              v-if="preview && isImageFile(scope.row.type)"
              :src="scope.row.service === 'local' ? `${state.localShow}?id=${scope.row.id}` : scope.row.path"
              style="width: 50px; height: 50px"
              :preview-src-list="[scope.row.service === 'local' ? `${state.localShow}?id=${scope.row.id}` : scope.row.path]"
              preview-teleported
            >
              <template #placeholder>
                <div class="flex size-full items-center justify-center">
                  <el-icon class="is-loading" :size="22" style="height: 50px" color="#999">
                    <Loading />
                  </el-icon>
                </div>
              </template>
              <template #error>
                <div class="image-slot">
                  <el-icon :size="22" style="height: 50px" color="#999">
                    <Picture />
                  </el-icon>
                </div>
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="文件路径" prop="path" show-overflow-tooltip />
        <el-table-column label="扩展名" prop="type" width="90" />
        <el-table-column label="文件大小" prop="fsize" width="90">
          <template #default="scope">
            {{ calculateFileSize(scope.row.fsize) }}
          </template>
        </el-table-column>
        <el-table-column label="上传时间" prop="crtim" width="164" />
        <el-table-column label="上传人" prop="cruna" width="80" />
        <el-table-column label="服务商" prop="service" width="80" />
        <el-table-column label="操作" align="center" width="86" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="下载" placement="top">
              <el-button link type="primary" icon="Download" @click="handleDownload(scope.row)" />
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
    <FileUpload2 ref="uploadModal" @close="closeUploadModal" />
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
