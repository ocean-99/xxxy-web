<script lang="ts" setup>
import type { ElTree } from 'element-plus';

import { reactive, ref, toRefs } from 'vue';
import AppvCard from './approval-card.vue';

const props = defineProps({
  url: {
    type: String,
    required: true,
  },
  tip: {
    type: String,
    default: '分类',
    required: false,
  },
  type: {
    type: Number,
    default: 1,
    required: false,
  },
});

const filterText = ref('');
const treeRef = ref<InstanceType<typeof ElTree>>();

const defaultProps = {
  children: 'children',
  label: 'name',
};

watch(filterText, (val) => {
  treeRef.value!.filter(val);
});

const state = reactive({
  data: [] as any,
  optionCardX: '',
  optionCardY: '',
  optionCardShow: false,
  optionData: [],
  show: false,
  form: {} as any,
  type: 'add',
  url: '',
});

onMounted(async () => {});

// region -----树拖拽逻辑-----
// endregion

// edit逻辑
const { form } = toRefs(state);

const options = ['待办任务', '已办任务'];
</script>

<template>
  <el-card class="box-card" style="height: 100%" body-style="height: 100%;overflow: auto">
    <template #header>
      <div class="card-header">
        <el-segmented v-model="state.form.type" :options="options" size="default" style="margin-bottom: 8px; width: 100%" />
        <div class="tree-h-flex">
          <div class="tree-h-left">
            <div>
              <el-input prefix-icon="Search" v-model="filterText" :placeholder="`${props.tip} 可拖拽可右键`" />
            </div>
          </div>
          <div class="tree-h-right">
            <div>
              <el-button style="margin-left: 4px; width: 34px">
                <el-icon class="el-icon--center">
                  <Refresh />
                </el-icon>
              </el-button>
              <el-dropdown @command="handleCommand">
                <el-button style="margin-left: 4px; width: 34px">
                  <el-icon class="el-icon--center">
                    <MoreFilled />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="addCate">新增</el-dropdown-item>
                    <el-dropdown-item command="refresh">测试</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
      </div>
      <div class="" style="border: 1px solid red; height: calc(100% - 190px); overflow: scroll">
      <AppvCard />
      <AppvCard />
      <AppvCard />
      <AppvCard />
      <AppvCard />
      <AppvCard />
      <AppvCard />
      </div>
    </template>
  </el-card>
</template>

<style scoped>
.tree-h-flex {
  display: flex;
}

.tree-h-left {
  flex: 1;
  width: 100%;
}

.tree-h-right {
  width: 76px;
  min-width: 76px;
}
</style>
