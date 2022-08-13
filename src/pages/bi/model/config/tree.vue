<template>
  <el-card class='box-card' style='height: 100%;' body-style='height: 100%;overflow: auto'>
    <template #header>
      <div class='card-header' style="height: 72px;">
        <div class='tree-h-flex'>
          <div class='tree-h-left'>
            <div>
              <el-select v-model='state.basid' style='width: 100%;margin-bottom: 8px'>
                <el-option v-for='item in state.bases' :key='item.id' :label='item.name' :value='item.id'/>
              </el-select>
              <el-input :prefix-icon='Search' v-model='filterText' placeholder='输入名称查询'/>
            </div>
          </div>
          <div class='tree-h-right'>
            <div>
              <el-button style='margin-left: 8px;width: 34px;margin-bottom: 8px'>
                <el-icon class='el-icon--center' @click="initTreeData()">
                  <Refresh/>
                </el-icon>
              </el-button>

              <el-dropdown @command='handleCommand'>
                <el-button style='margin-left: 8px;width: 34px'>
                  <el-icon class='el-icon--center'>
                    <MoreFilled/>
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command='expandAll'>全部展开</el-dropdown-item>
                    <el-dropdown-item command='collapseAll'>全部折叠</el-dropdown-item>
                    <el-dropdown-item command='rootNode'>根节点</el-dropdown-item>
                    <el-dropdown-item command='refresh'>刷新</el-dropdown-item>
                    <el-dropdown-item command='addGroup'>新增组</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div style="margin-bottom: 58px;font-family: 'Courier New', Helvetica, Arial, sans-serif;">
      <el-tree highlight-current @node-contextmenu="rightClick" ref='treeRef' class='filter-tree' :data='state.data'
               :props='defaultProps' :filter-node-method='filterNode' @node-click="nodeClick"
               draggable :allow-drop="allowDrop" :allow-drag="allowDrag"
               @node-drag-start="handleDragStart" @node-drag-enter="handleDragEnter" @node-drag-leave="handleDragLeave"
               @node-drag-over="handleDragOver" @node-drag-end="handleDragEnd" @node-drop="handleDrop"/>
      <div :style="{
            'z-index': 9999,//防止被覆盖
            position: 'fixed',left:state.optionCardX + 'px',top: state.optionCardY + 'px', }"
           v-show="state.optionCardShow" id="option-button-group">
        <el-button class="option-card-button" @click="addChildGroup">新建组</el-button>
        <el-button class="option-card-button" @click="editGroup">修改组</el-button>
        <el-button class="option-card-button" @click="deleteGroup">删除组</el-button>
      </div>
      <ModelGroup ref="groupRef" @close="groupUpdate"/>
    </div>
  </el-card>
</template>

<script lang='ts' setup>
import {onMounted, reactive, ref, watch} from 'vue';
import type {ElTree} from 'element-plus';
import {Search, MoreFilled, Refresh} from '@element-plus/icons-vue';
import request from '/@/utils/request';
import ModelGroup from './group.vue';
import {DragEvents} from "element-plus/es/components/tree/src/model/useDragNode";
import {DropType} from "element-plus/es/components/tree/src/tree.type";

const props = defineProps({
  url: String,
  maInit: Boolean,
});

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
  data: [] as any, bases: [] as any, basid: '',
  optionCardX: "", optionCardY: "", optionCardShow: false, optionData: []
});

const groupRef = ref();

const handleCommand = async (command: string | number | object) => {
  if ('expandAll' == command) {
    for (let i = 0; i < treeRef.value!.store._getAllNodes().length; i++) {
      treeRef.value!.store._getAllNodes()[i].expanded = true;
    }
  } else if ('collapseAll' == command) {
    for (let i = 0; i < treeRef.value!.store._getAllNodes().length; i++) {
      treeRef.value!.store._getAllNodes()[i].expanded = false;
    }
  } else if ('refresh' == command) {
    await initTreeData();
  } else if ('rootNode' == command) {
    emits('node-click', {id: '', name: ''});
  } else if ('addGroup' == command) {
    groupRef.value.openModal({basid: state.basid});
  }
};

const groupUpdate = async () => {
  await initTreeData();
}

const emits = defineEmits(['node-click']);
const nodeClick = (node: any) => {
  state.optionCardShow = false;
  emits('node-click', {id: node.id, name: node.name, basid: state.basid});
};

//右键菜单参考 https://www.cnblogs.com/shenhuanjie/p/15888430.html
const rightClick = (e: any, data: any, n: any, t: any) => {
  state.optionCardShow = false;
  state.optionCardX = e.x;
  state.optionCardY = e.y;
  state.optionData = data;
  state.optionCardShow = true;
  document.addEventListener('click', rightClose)
}

const rightClose = () => {
  state.optionCardShow = false;
  document.removeEventListener('click', rightClose);
}


onMounted(async () => {
  await initBases();
  await initTreeData();
});

const initBases = async () => {
  state.bases = await request({
    url: '/bi/model/base/list',
    method: 'get',
  });
  if (state.bases && state.bases.length > 0) {
    state.basid = state.bases[0].id;
  }
};

const initTreeData = async () => {
  state.data = await request({
    url: '/bi/model/table/tree',
    // params:{basid:state.basid,name:filterText.value},
    params: {basid: state.basid},
    method: 'get',
  });
};





const handleDragStart = (node: any, ev: DragEvents) => {
  // console.log('drag start', node)
}
const handleDragEnter = (
    draggingNode: any,
    dropNode: any,
    ev: DragEvents
) => {
  // console.log('tree drag enter:', dropNode.label)
}
const handleDragLeave = (
    draggingNode: any,
    dropNode: any,
    ev: DragEvents
) => {
  // console.log('tree drag leave:', dropNode.label)
}
const handleDragOver = (draggingNode: any, dropNode: Node, ev: DragEvents) => {
  // console.log('tree drag over:', dropNode.label)
}
const handleDragEnd = async (
    draggingNode: any,
    dropNode: any,
    dropType: DropType,
    ev: DragEvents
) => {
  if(dropType=='inner'){
    if(draggingNode.data.name.startsWith("#")){
      await request({
        url: '/bi/model/group/move',
        // params:{basid:state.basid,name:filterText.value},
        data: {draid: draggingNode.data.id,droid:dropNode.data.id,basid:state.basid},
        method: 'post',
      });
    }else{
      await request({
        url: '/bi/model/table/move',
        // params:{basid:state.basid,name:filterText.value},
        data: {draid: draggingNode.data.id,droid:dropNode.data.id,basid:state.basid},
        method: 'post',
      });
    }
  }
}
const handleDrop = (
    draggingNode: any,
    dropNode: any,
    dropType: DropType,
    ev: DragEvents
) => {
  console.log('tree drop:', dropNode.label, dropType)
}
const allowDrop = (draggingNode: any, dropNode: any, type: DropType) => {
  // console.log(draggingNode);
  // console.log(dropNode);
  // console.log(type);
  if(type=='inner'&&dropNode.data.name.startsWith("#")){
    return true;
  }

  // if (dropNode.data.label === 'Level two 3-1') {
  //   return type !== 'inner'
  // } else {
  //   return true
  // }
}
const allowDrag = (draggingNode: any) => {
  // console.log(draggingNode);
  return true;
  // return !draggingNode.data.label.includes('Level three 3-1-1')
}







const addChildGroup=()=>{

}
const editGroup=()=>{

}
const deleteGroup=()=>{

}



</script>
<style scoped>
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
</style>
