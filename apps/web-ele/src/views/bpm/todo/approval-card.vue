<script setup lang="ts">
import { VbenAvatar } from '@vben/common-ui';
</script>

<template>
  <div class="cursor-pointer rounded-lg border-[1px] border-solid p-3 transition-shadow duration-300 ease-in-out hover:shadow-lg"  style="margin-bottom:8px ">
    <el-descriptions :column="1">
      <el-descriptions-item label="手机号码：">4321431</el-descriptions-item>
      <el-descriptions-item label="邮箱：">4313 </el-descriptions-item>
    </el-descriptions>
    <div class="flex w-full items-center justify-between text-[14px]">
      <div class="flex items-center gap-1 overflow-hidden whitespace-nowrap">
        <VbenAvatar class="bg-primary size-[24px] rounded-full text-[10px] text-white" src="" />
        <span class="overflow-hidden text-ellipsis opacity-50"> 5555 </span>
      </div>
      <div class="text-nowrap opacity-50">
        <el-tooltip placement="top" title="更新时间">
          <div class="flex items-center gap-1">
            <span class="icon-[mdi--clock-outline] size-[16px]"></span>
            <span>前更新</span>
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.ant-descriptions .ant-descriptions-header) {
  margin-bottom: 12px !important;
}

:deep(.ant-descriptions-item) {
  padding-bottom: 8px !important;
}
</style>
