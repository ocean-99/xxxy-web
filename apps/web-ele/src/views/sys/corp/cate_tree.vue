<script lang="ts" setup>
import type { ElTree } from 'element-plus';

import { requestClient } from '#/api/request';

import Tedit from './cate_edit.vue';

const emits = defineEmits(['node-click']);

interface Tree {
  id: number;
  name: string;
  children?: Tree[];
}

const filterText = ref('');
const treeRef = ref<InstanceType<typeof ElTree>>();

const defaultProps = {
  children: 'children',
  label: 'name',
};

watch(filterText, (val) => {
  treeRef.value!.filter(val);
});

const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.name.includes(value);
};

const state = reactive({
  data: [] as any,
  cates: [] as any,
  catid: '',
  optionCardX: '',
  optionCardY: '',
  optionCardShow: false,
  optionData: [],
});

const cateRef = ref();

const handleCommand = async (command: number | object | string) => {
  if (command === 'expandAll') {
    for (let i = 0; i < treeRef.value!.store._getAllNodes().length; i++) {
      treeRef.value!.store._getAllNodes()[i].expanded = true;
    }
  } else if (command === 'collapseAll') {
    for (let i = 0; i < treeRef.value!.store._getAllNodes().length; i++) {
      treeRef.value!.store._getAllNodes()[i].expanded = false;
    }
  } else if (command === 'refresh') {
    await initTreeData();
  } else if (command === 'rootNode') {
    emits('node-click', { id: '', name: '' });
  } else if (command === 'addCate') {
    cateRef.value.openModal({});
  }
};

const cateUpdate = async (updateNode: any, type: string) => {
  if (type === 'add') {
    if (updateNode.pid === 0 || updateNode.pid === null) {
      state.data.push(updateNode);
    } else {
      for (const targetNode of state.data) {
        const back = recAddUpdate(updateNode, targetNode);
        if (back) {
          break;
        }
      }
    }
  } else if (type === 'edit') {
    for (const targetNode of state.data) {
      const back = recEditUpdate(updateNode, targetNode);
      if (back) {
        break;
      }
    }
    currNode.name = updateNode.name;
    currNode.notes = updateNode.notes;
  }
};

const recAddUpdate = (updateNode: any, targetNode: any) => {
  if (targetNode.id === updateNode.pid) {
    if (targetNode.children === null) {
      targetNode.children = [];
    }
    targetNode.children.push(updateNode);
    return true;
  }
  if (targetNode.children) {
    for (const targetSunNode of targetNode.children) {
      const back = recAddUpdate(updateNode, targetSunNode);
      if (back) {
        return true;
      }
    }
  }
  return false;
};

const recEditUpdate = (updateNode: any, targetNode: any) => {
  if (targetNode.id === updateNode.id) {
    targetNode.name = updateNode.name;
    targetNode.notes = updateNode.notes;
    return true;
  }
  if (targetNode.children) {
    for (const targetSunNode of targetNode.children) {
      const back = recEditUpdate(updateNode, targetSunNode);
      if (back) {
        return true;
      }
    }
  }
  return false;
};

let currNode = {} as any;
const nodeClick = (node: any) => {
  state.optionCardShow = false;
  currNode = { id: node.id, name: node.name };
  emits('node-click', { id: node.id, name: node.name });
};

const rightClick = (e: any, data: any, n: any, t: any) => {
  state.optionCardShow = false;
  state.optionCardX = e.x;
  state.optionCardY = e.y;
  state.optionData = data;
  state.optionCardShow = true;
  document.addEventListener('click', rightClose);
};

const rightClose = () => {
  state.optionCardShow = false;
  document.removeEventListener('click', rightClose);
};

onMounted(async () => {
  await initTreeData();
});

const initTreeData = async () => {
  state.data = await requestClient.get('/sys/corpc/tree');
};

// region -----树拖拽逻辑-----
const handleDragStart = (node: any, ev: any) => {
  console.log('DragStart');
};
const handleDragEnter = (draggingNode: any, dropNode: any, ev: any) => {
  console.log('DragEnter');
};
const handleDragLeave = (draggingNode: any, dropNode: any, ev: any) => {
  console.log('DragLeave');
};
const handleDragOver = (draggingNode: any, dropNode: Node, ev: any) => {
  console.log('DragOver');
};
const handleDragEnd = async (draggingNode: any, dropNode: any, dropType: any, ev: any) => {
  console.log('DragEnd');
};
const handleDrop = async (draggingNode: any, dropNode: any, dropType: any, ev: any) => {
  await requestClient.post('/sys/corpc/move', {
    type: dropType,
    draid: draggingNode.data.id,
    droid: dropNode.data.id,
  });
  console.log('handleDrop');
};
const allowDrop = (draggingNode: any, dropNode: any, type: any) => {
  return true;
};
const allowDrag = (draggingNode: any) => {
  return true;
};
// endregion

const addChildCate = () => {
  cateRef.value.openModal({ pid: currNode.id });
};
const editCate = () => {
  cateRef.value.openModal({ id: currNode.id });
};
const deleteCate = async () => {
  await requestClient.delete(`/sys/corpc/${currNode.id}`);
  treeRef.value!.remove(currNode);
};
</script>

<template>
  <el-card class="box-card" style="height: 100%" body-style="height: 100%;overflow: auto" body-class="thin-scrollbar">
    <template #header>
      <div class="card-header">
        <div class="tree-h-flex">
          <div class="tree-h-left">
            <div>
              <el-input prefix-icon="Search" v-model="filterText" placeholder="公司分类 可拖拽可右键" />
            </div>
          </div>
          <div class="tree-h-right">
            <div>
              <el-dropdown @command="handleCommand">
                <el-button style="margin-left: 8px; width: 34px">
                  <el-icon class="el-icon--center">
                    <MoreFilled />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="addCate">新增分类</el-dropdown-item>
                    <el-dropdown-item command="expandAll">全部展开</el-dropdown-item>
                    <el-dropdown-item command="collapseAll">全部折叠</el-dropdown-item>
                    <el-dropdown-item command="rootNode">根分类</el-dropdown-item>
                    <el-dropdown-item command="refresh">刷新</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div style="margin-bottom: 88px; font-family: 'Courier New', Helvetica, Arial, sans-serif">
      <el-tree
        highlight-current
        @node-contextmenu="rightClick"
        node-key="id"
        ref="treeRef"
        class="filter-tree"
        :data="state.data"
        :props="defaultProps"
        :filter-node-method="filterNode"
        @node-click="nodeClick"
        draggable
        :allow-drop="allowDrop"
        :allow-drag="allowDrag"
        @node-drag-start="handleDragStart"
        @node-drag-enter="handleDragEnter"
        @node-drag-leave="handleDragLeave"
        @node-drag-over="handleDragOver"
        @node-drag-end="handleDragEnd"
        @node-drop="handleDrop"
      />

      <div
        class="op-group"
        :style="{ 'z-index': 9999, width: '100px', position: 'fixed', left: `${state.optionCardX}px`, top: `${state.optionCardY}px` }"
        v-show="state.optionCardShow"
        id="option-button-group"
      >
        <el-button class="option-card-button" @click="addChildCate" style="border-bottom: 0"> 新增分类 </el-button>
        <el-button class="option-card-button" @click="editCate" style="border-bottom: 0"> 修改分类 </el-button>
        <el-button class="option-card-button" @click="deleteCate">删除分类</el-button>
      </div>
      <Tedit ref="cateRef" @close="cateUpdate" />
    </div>
  </el-card>
</template>

<style scoped lang="less">
.tree-h-flex {
  display: flex;
}

.tree-h-left {
  flex: 1;
  width: 100%;
}

.tree-h-right {
  width: 42px;
  min-width: 42px;
}

.option-card-button {
  width: 100%;
  margin-left: 0;
  font-size: 10px;
  border-radius: 0;
}

.op-group {
  background-color: #1f1f1f;
}

.thin-scrollbar {
  &::-webkit-scrollbar {
    width: 5px;
  }
}

:deep(.el-card__body) {
  @apply thin-scrollbar;
}
</style>
