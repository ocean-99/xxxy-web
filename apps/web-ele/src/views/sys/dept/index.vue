<script setup lang="ts">
import Way1 from './way1.vue';
import Way2 from './way2.vue';

const state = reactive({
  way: 'way1',
});
</script>

<template>
  <div>
    <Way1 v-if="state.way === 'way1'" @toggle="state.way = 'way2'" />
    <Way2 v-if="state.way === 'way2'" @toggle="state.way = 'way1'" />
  </div>
</template>
