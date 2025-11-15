<script setup lang="ts">
import type { DragRule } from '@form-create/designer';
import type { Rule } from '@form-create/element-ui';

import FcDesigner from '@form-create/designer';

import MemberSelect from '#/components/biz/MemberSelect';
// import AnalyticsTrends from '#/views/dashboard/analytics/analytics-trends.vue';
import AnalyticsTrends from '#/views/dashboard/analytics/analytics-trends.vue';
import Test5 from './test5.vue';

import MemberSelectRule from './rules/MemberSelectRule';

let index = 1;
const AnalyticsTrendsRule: DragRule = {
  // 插入菜单位置
  menu: 'biz',
  // 图标
  icon: 'icon-select',
  // 名称
  label: '图表测试',
  // id,唯一!
  name: 'AnalyticsTrends',
  // 是否可以操作, 除了容器类组件建议为true !
  mask: true,
  // 定义组件的渲染规则
  rule({ t }) {
    // 组件的生成规则
    return {
      type: 'AnalyticsTrends',
      // field不能重复!!!
      field: `AnalyticsTrends${++index}`,
      title: t?.('AnalyticsTrends.title') || '用户选择',
      info: '',
      native: true,
      $required: false,
      props: {},
    };
  },
  // 组件的属性配置
};

const designer = useTemplateRef('designer') as Ref<InstanceType<typeof import('@form-create/designer').FcDesigner>>;
// const designer = ref(null as any);

const modalVisible = ref(false);

const json = ref('');
const handelOption = () => {
  modalVisible.value = true;
  json.value = designer.value?.getOptionsJson();
};
const handleRule = () => {
  modalVisible.value = true;
  json.value = designer.value?.getJson();
};

onMounted(() => {
  FcDesigner.component('MemberSelect', MemberSelect);
  FcDesigner.component('AnalyticsTrends', AnalyticsTrends);
  designer.value.addComponent(MemberSelectRule);
  designer.value.addComponent(AnalyticsTrendsRule);
  designer.value.addMenu({
    name: 'biz',
    title: '业务组件',
    list: [
      {
        name: 'MemberSelect',
        label: '成员选择',
        icon: 'icon-select',
      },
      {
        name: 'AnalyticsTrends',
        label: '图标测试',
        icon: 'icon-select',
      },
    ],
  });
});
</script>

<template>
  <div class="fd-container">
    <div class="flex justify-center p-2">
      <el-button type="primary" @click="handelOption">导出 Option</el-button>
      <el-button type="success" @click="handleRule">导出 Rule</el-button>
    </div>
    <FcDesigner ref="designer" />
    <el-dialog v-model="modalVisible" title="导出JSON" width="40%" @close="() => (json = '')">
      <el-input v-model="json" type="textarea" :rows="10" />
    </el-dialog>
    <Test5/>
  </div>
</template>

<style lang="scss">
.fd-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 8px 24px;
  margin: 0 !important;
}
</style>
