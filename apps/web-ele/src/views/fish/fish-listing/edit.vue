<script lang="ts" setup>
import { requestClient } from '#/api/request';
import { drawerSave, reset } from '#/utils/page/edit';

const emits = defineEmits(['close']);
const state = reactive({
  url: '/fish-listing',
  show: false,
  form: {} as any,
});
const formRef = ref();
const { form } = toRefs(state);

const open = async (data: any) => {
  state.form = data && data.id ? await requestClient.get(`${state.url}/info/${data.id}`) : { isVideo: false, fishTags: [] };
  await reset({ formRef: formRef.value, state });
};
defineExpose({ open });

const save = async () => {
  await drawerSave({ formRef: formRef.value, state });
  emits('close');
};

// 标签输入
const tagInputVisible = ref(false);
const tagInputValue = ref('');
const tagInputRef = ref();

const handleTagClose = (tag: string) => {
  form.value.fishTags?.splice(form.value.fishTags.indexOf(tag), 1);
};

const showTagInput = () => {
  tagInputVisible.value = true;
  nextTick(() => {
    tagInputRef.value?.input?.focus();
  });
};

const handleTagInputConfirm = () => {
  if (tagInputValue.value) {
    if (!form.value.fishTags) {
      form.value.fishTags = [];
    }
    form.value.fishTags.push(tagInputValue.value);
  }
  tagInputVisible.value = false;
  tagInputValue.value = '';
};
</script>

<template>
  <el-drawer v-model="state.show" size="50%">
    <template #header>
      <h4>渔场商品详情</h4>
    </template>
    <template #default>
      <el-form ref="formRef" :model="form" label-width="100px">
        <el-form-item label="任务ID" prop="taskId">
          <el-input v-model="form.taskId" type="number" />
        </el-form-item>
        <el-form-item label="商品ID" prop="itemId" :rules="[{ required: true, message: '商品ID不能为空' }]">
          <el-input v-model="form.itemId" />
        </el-form-item>
        <el-form-item label="商品类型" prop="itemType">
          <el-input v-model="form.itemType" />
        </el-form-item>
        <el-form-item label="标题" prop="title" :rules="[{ required: true, message: '标题不能为空' }]">
          <el-input v-model="form.title" :rows="2" type="textarea" />
        </el-form-item>
        <el-form-item label="商品图片" prop="picUrl">
          <el-input v-model="form.picUrl" placeholder="请输入图片URL" />
          <el-image v-if="form.picUrl" :src="form.picUrl" fit="cover" style="width: 120px; height: 120px; margin-top: 8px; border-radius: 4px" />
        </el-form-item>
        <el-form-item label="图片高度" prop="picHeight">
          <el-input v-model="form.picHeight" type="number" />
        </el-form-item>
        <el-form-item label="是否视频" prop="isVideo">
          <el-switch v-model="form.isVideo" />
        </el-form-item>
        <el-form-item label="用户昵称" prop="userNick">
          <el-input v-model="form.userNick" />
        </el-form-item>
        <el-form-item label="用户头像" prop="userAvatarUrl">
          <el-input v-model="form.userAvatarUrl" placeholder="请输入头像URL" />
          <el-avatar v-if="form.userAvatarUrl" :src="form.userAvatarUrl" :size="48" style="margin-top: 8px" />
        </el-form-item>
        <el-form-item label="售价" prop="soldPrice">
          <el-input v-model="form.soldPrice" type="number" step="0.01">
            <template #prepend>¥</template>
          </el-input>
        </el-form-item>
        <el-form-item label="地区" prop="area">
          <el-input v-model="form.area" />
        </el-form-item>
        <el-form-item label="发布时间" prop="publishTime">
          <el-date-picker v-model="form.publishTime" type="datetime" placeholder="选择发布时间" style="width: 100%" />
        </el-form-item>
        <el-form-item label="目标URL" prop="targetUrl">
          <el-input v-model="form.targetUrl" placeholder="请输入目标链接" />
        </el-form-item>
        <el-form-item label="标签" prop="fishTags">
          <div>
            <el-tag v-for="tag in form.fishTags" :key="tag" closable @close="handleTagClose(tag)" style="margin-right: 8px; margin-bottom: 8px">
              {{ tag }}
            </el-tag>
            <el-input v-if="tagInputVisible" ref="tagInputRef" v-model="tagInputValue" style="width: 100px" size="small" @keyup.enter="handleTagInputConfirm" @blur="handleTagInputConfirm" />
            <el-button v-else size="small" @click="showTagInput">+ 添加标签</el-button>
          </div>
        </el-form-item>
        <el-form-item label="想要数" prop="wantCount">
          <el-input v-model="form.wantCount" type="number" />
        </el-form-item>
        <el-form-item label="浏览数" prop="viewCount">
          <el-input v-model="form.viewCount" type="number" />
        </el-form-item>
        <el-form-item label="收藏数" prop="collectCount">
          <el-input v-model="form.collectCount" type="number" />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto; margin: 20px">
        <el-button type="primary" @click="save">保 存</el-button>
        <el-button @click="state.show = false">关 闭</el-button>
      </div>
    </template>
  </el-drawer>
</template>
