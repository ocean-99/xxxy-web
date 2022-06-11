<template>
  <div></div>
</template>


<script lang='ts' setup>
import {onMounted, reactive} from 'vue';
import request from "/@/utils/request";

const state = reactive({
  url: '/mon/server/main', loading: true, ids: [], cates: [] as any,
  form: {}, single: true, multiple: true, list: [], total: 0,
});

onMounted(async () => {
  const data= await request({
    url: state.url,
    method: 'get',
  });
  console.log(data);
});

</script>


<style scoped>

</style>
