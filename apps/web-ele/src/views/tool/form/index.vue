<script setup lang="ts">
import { Page } from '@vben/common-ui';

import FcDesigner from '@form-create/designer';

const designer = ref(null);
const config = {
  fieldReadonly: false,
};
</script>

<template>
  <Page auto-content-height>
    <FcDesigner ref="designer" :config="config" />
  </Page>
</template>

<style scoped lang="scss"></style>
