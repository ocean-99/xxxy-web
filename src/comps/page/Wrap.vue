<template>
  <div class='p-flex' :style='{ height: `calc(100vh - ${initTagViewHeight}`}'>
    <slot></slot>
  </div>
</template>

<script lang='ts' setup>

//设置高度为100%
import {storeToRefs} from 'pinia';
import {computed} from 'vue';
import {useTagsViewRoutes} from '/@/stores/tagsViewRoutes';
import {useThemeConfig} from '/@/stores/themeConfig';

const initTagViewHeight = computed(() => {
  const storesTagsViewRoutes = useTagsViewRoutes();
  const storesThemeConfig = useThemeConfig();
  const {themeConfig} = storeToRefs(storesThemeConfig);
  const {isTagsViewCurrenFull} = storeToRefs(storesTagsViewRoutes);
  // 设置 header 的高度
  let {isTagsview} = themeConfig.value;
  if (isTagsViewCurrenFull.value) {
    return `13px`;
  } else {
    if (isTagsview) return `97px`;
    else return `63px`;
  }
});

</script>
