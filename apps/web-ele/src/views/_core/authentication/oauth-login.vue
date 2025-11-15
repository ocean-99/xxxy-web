<script setup lang="ts">
import { $t } from '@vben/locales';

import { ElCol, ElRow, ElTooltip } from 'element-plus';

import { accountBindList, handleAuthBinding } from '../oauth-common';

defineOptions({
  name: 'OAuthLogin',
});
</script>

<template>
  <div class="w-full sm:mx-auto md:max-w-md">
    <div class="my-4 flex items-center justify-between">
      <span class="border-input w-[35%] border-b dark:border-gray-600"></span>
      <span class="text-muted-foreground text-center text-xs uppercase">
        {{ $t('authentication.thirdPartyLogin') }}
      </span>
      <span class="border-input w-[35%] border-b dark:border-gray-600"></span>
    </div>
    <ElRow class="enter-x flex items-center justify-evenly">
      <!-- todo 这里在点击登录时要disabled -->
      <ElCol
        v-for="item in accountBindList"
        :key="item.source"
        :span="4"
        class="my-2"
      >
        <ElTooltip
          class="box-item"
          :content="`${item.title}登录`"
          placement="top"
        >
          <span class="flex cursor-pointer items-center justify-center">
            <component
              v-if="item.avatar"
              :is="item.avatar"
              :style="item?.style ?? {}"
              class="size-[24px]"
              @click="handleAuthBinding(item.source)"
            />
          </span>
        </ElTooltip>
      </ElCol>
    </ElRow>
  </div>
</template>
