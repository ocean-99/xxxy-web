<script lang="ts" setup>
import { requestClient } from '#/api/request';
import CateTree from '#/components/tree/ViewTree.vue';

const emits = defineEmits(['close']);

const state = reactive({
  show: false,
  receSearch: '' as string,
  receItems: [] as any,
  tierItems: [] as any,
  selectedItem: {} as any,
});

const { receItems, tierItems } = toRefs(state);

const activeName = ref('k1');

// region x.1 最近使用

async function onSearch() {
  receItems.value = await requestClient.get(`/gen/org/main?name=${state.receSearch}`);
}

const receInit = async () => {
  const res = await requestClient.get(`/bpm/bus/tmpl/list`);
  receItems.value = res.rows;
};

function receItemClick(item: any) {
  item.checked = !item.checked;
  state.selectedItem = item;
}

// endregion

// region x.2 分类查询

async function nodeClick(node: any) {
  if (node && node.id) {
    tierItems.value = await requestClient.get(`/bpm/bus/tmpl/list?catid=${node.id}`);
  }
}

function tierItemClick(item: any) {
  item.checked = !item.checked;
  for (const tier of tierItems.value) {
    if (tier.id !== item.id) {
      tier.checked = false;
    }
  }
  state.selectedItem = item;
}

// region 与父组件的交互逻辑
const openModal = async (data: any) => {
  state.show = true;
  tierItems.value = await requestClient.get(`/bpm/bus/tmpl/list`);
};

defineExpose({ openModal });

const closeModal = async () => {
  emits('close', state.selectedItem);
  state.show = false;
};

const clearAndcloseModal = () => {
  emits('close', state.selectedItem);
  state.show = false;
};
// endregion

const tabChange = () => {};

onMounted(async () => {
  await receInit();
});
</script>

<template>
  <el-dialog v-model="state.show" title="流程模板选择" width="700px" draggable>
    <div style="height: 440px">
      <el-tabs v-model="activeName" type="card" @tab-click="tabChange">
        <el-tab-pane label="按分类查询" name="k1">
          <el-row>
            <el-col :span="12">
              <div style="height: 390px">
                <CateTree @node-click="nodeClick" url="/bpm/bus/cate/tree" />
              </div>
            </el-col>
            <el-col :span="12">
              <div style="border: 1px solid #ccc; height: 390px; margin-left: 5px; overflow: auto">
                <ul class="z-org-tree">
                  <li v-for="item in tierItems" :key="item.id" title=" " @click="tierItemClick(item)" style="display: flex">
                    <el-checkbox v-model="item.checked" />
                    <el-text truncated style="margin-left: 5px">{{ item.name }}</el-text>
                  </li>
                </ul>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="最近使用" name="k2">
          <div>
            <el-input v-model="state.receSearch" placeholder="请输入关键字查询" style="width: 200px" @keyup.enter="onSearch" />
            <el-button type="primary" style="margin-left: 10px" @click="onSearch">查询</el-button>
          </div>
          <div style="margin-top: 5px; overflow: auto; height: 353px; border: 1px solid #ccc">
            <ul class="z-org-search" id="zOrgSearch" style="padding: 2px">
              <li v-for="item in receItems" :key="item.id" title=" " @click="receItemClick(item)" style="display: flex">
                <el-checkbox v-model="item.checked" />
                <el-text truncated style="margin-left: 5px">{{ item.name }}</el-text>
              </li>
            </ul>
          </div>
        </el-tab-pane>
        <el-tab-pane label="我的收藏" name="k9">待开发</el-tab-pane>
      </el-tabs>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="closeModal">确认</el-button>
        <el-button @click="state.show = false">取消</el-button>
        <el-button @click="clearAndcloseModal" style="margin-left: 20px">清空选择</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}

/*搜索查询*/
.z-org-search li {
  /*width: 280px;*/
  width: 50%;
  float: left;
  cursor: pointer;
  padding: 2px;
  list-style-type: none;
  /*margin: 3px;*/
}

.z-org-search li:hover {
  background-color: #f7efec;
}

.dark .z-org-search li:hover {
  background-color: #1f1f1f;
}

/*!*组织架构树*!*/
.z-org-tree li {
  margin: 3px;
  cursor: pointer;
  padding: 3px;
  list-style-type: none;
}

.z-org-tree li:hover {
  background-color: #f7efec;
}

.dark .z-org-tree li:hover {
  background-color: #1f1f1f;
}
</style>
