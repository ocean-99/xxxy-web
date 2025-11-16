<script setup lang="ts">
import { ref } from 'vue';

import { MarkdownPreviewer, Page, Spinner } from '@vben/common-ui';

import changelog from '../../../../../../CHANGELOG.md?raw';

const content = ref(changelog);

const loading = ref(true);
</script>

<template>
  <Page :auto-content-height="true">
    <Spinner :spinning="false">
      <MarkdownPreviewer v-model:value="content" height="100%" class="min-h-[50vh]" @mounted="loading = false" />
    </Spinner>
  </Page>
</template>
