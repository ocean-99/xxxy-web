<script setup lang="ts">
import AccountBind from './components/account-bind.vue';
import BaseSetting from './components/base-setting.vue';
import OnlineDevice from './components/online-device.vue';
import SecureSetting from './components/secure-setting.vue';

const settingList = [
  {
    component: BaseSetting,
    key: '1',
    name: '基本设置',
  },
  {
    component: SecureSetting,
    key: '2',
    name: '安全设置',
  },
  {
    component: AccountBind,
    key: '3',
    name: '账号绑定',
  },
  {
    component: OnlineDevice,
    key: '4',
    name: '在线设备',
  },
];
</script>

<template>
  <el-tabs class="bg-background rounded-[var(--radius)] px-[22px] lg:flex-1" style="padding-top: 10px">
    <el-tab-pane :label="item.name" v-for="item in settingList" :key="item.key">
      <component :is="item.component" v-bind="$attrs" />
    </el-tab-pane>
  </el-tabs>
</template>
