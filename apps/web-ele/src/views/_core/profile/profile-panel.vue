<script setup lang="ts">
import type { UserProfile } from '#/api/system/profile/model';

import { computed } from 'vue';

import { preferences, usePreferences } from '@vben/preferences';

import { userUpdateAvatar } from '#/api/system/profile';
import { CropperAvatar } from '#/components/cropper';

const props = defineProps<{ profile?: UserProfile }>();

defineEmits<{
  // 头像上传完毕
  uploadFinish: [];
}>();

const avatar = computed(() => props.profile?.user.avatar || preferences.app.defaultAvatar);

const { isDark } = usePreferences();
const poetrySrc = computed(() => {
  const color = isDark.value ? 'white' : 'gray';
  return `https://v2.jinrishici.com/one.svg?font-size=12&color=${color}`;
});
</script>

<template>
  <el-card :loading="!profile" class="h-full lg:w-1/3">
    <div v-if="profile" class="flex flex-col items-center gap-[24px]">
      <div class="flex flex-col items-center gap-[20px]" style="margin-top: 20px">
        <el-tooltip content="点击上传头像" placement="top">
          <CropperAvatar :show-btn="false" :upload-api="userUpdateAvatar" :value="avatar" width="120" @change="$emit('uploadFinish')" />
        </el-tooltip>

        <div class="flex flex-col items-center gap-[8px]">
          <span class="text-foreground text-xl font-bold">
            {{ profile.user.nickName ?? '未知' }}
          </span>
          <!-- https://www.jinrishici.com/doc/#image -->
          <img :src="poetrySrc" />
        </div>
      </div>
      <div class="px-[24px]" style="width: 100%; padding-left: 40px">
        <el-descriptions :column="1">
          <el-descriptions-item label="账号：">{{ profile.user.userName }}</el-descriptions-item>
          <el-descriptions-item label="手机号码：">{{ profile.user.phonenumber || '未绑定手机号' }} </el-descriptions-item>
          <el-descriptions-item label="邮箱：">{{ profile.user.email || '未绑定邮箱' }} </el-descriptions-item>
          <el-descriptions-item label="部门：">
            <el-tag style="margin-right: 10px">{{ profile.user.deptName ?? '未分配部门' }}</el-tag>
            <el-tag v-if="profile.postGroup">{{ profile.postGroup }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="上次登录："> {{ profile.user.loginDate }} </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
  </el-card>
</template>
