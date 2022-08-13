<template>
  <el-card class='box-card' style='height: 100%;' body-style='height: 100%;overflow: auto'>
    <template #header>
      <div class='card-header' style="height: 72px;">
        <div class='tree-h-flex'>
          <div class='tree-h-left'>
            <div>
              <el-select v-model='state.proid' style='width: 100%;margin-bottom: 8px' @change="projChange">
                <el-option v-for='item in state.projs' :key='item.id' :label='item.name' :value='item.id'/>
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
                    <el-dropdown-item command='addTlist'>新增任务清单</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div style="margin-bottom: 88px;font-family: 'Courier New', Helvetica, Arial, sans-serif;">
      <el-tree highlight-current @node-contextmenu="rightClick" ref='treeRef' class='filter-tree' :data='state.data'
               :props='defaultProps' :filter-node-method='filterNode' @node-click="nodeClick"
               draggable :allow-drop="allowDrop" :allow-drag="allowDrag"
               @node-drag-start="handleDragStart" @node-drag-enter="handleDragEnter" @node-drag-leave="handleDragLeave"
               @node-drag-over="handleDragOver" @node-drag-end="handleDragEnd" @node-drop="handleDrop"/>
      <div :style="{
            'z-index': 9999,//防止被覆盖
            position: 'fixed',left:state.optionCardX + 'px',top: state.optionCardY + 'px', }"
           v-show="state.optionCardShow" id="option-button-group">
        <el-button class="option-card-button" @click="addChildTlist">新建任务清单</el-button>
        <el-button class="option-card-button" @click="editTlist">修改任务清单</el-button>
        <el-button class="option-card-button" @click="deleteTlist">删除任务清单</el-button>
      </div>
      <TlistEdit ref="tlistRef" @close="tlistUpdate"/>
    </div>
  </el-card>
</template>

<script lang='ts' setup>
import {onMounted, reactive, ref, watch} from 'vue';
import type {ElTree} from 'element-plus';
import {Search, MoreFilled, Refresh} from '@element-plus/icons-vue';
import request from '/@/utils/request';
import TlistEdit from './edit.vue';
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
  data: [] as any, projs: [] as any, proid: '',
  optionCardX: "", optionCardY: "", optionCardShow: false, optionData: []
});

const tlistRef = ref();

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
  } else if ('addTlist' == command) {
    tlistRef.value.openModal({proid: state.proid});
  }
};

const tlistUpdate = async () => {
  await initTreeData();
}

let currNode= {} as any;
const emits = defineEmits(['node-click']);
const nodeClick = (node: any) => {
  state.optionCardShow = false;
  currNode = {id: node.id, name: node.name};
  emits('node-click', {id: node.id, name: node.name, proid: state.proid});
};

const projChange=async ()=>{
  await initTreeData();
  emits('node-click', {id: '', name: '', proid: state.proid});
}

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
  await initProjs();
  await initTreeData();
});

const initProjs = async () => {
  state.projs = await request({
    url: '/oa/proj/main/list',
    method: 'get',
  });
  if (state.projs && state.projs.length > 0) {
    state.proid = state.projs[0].id;
  }
};

const initTreeData = async () => {
  state.data = await request({
    url: '/oa/proj/tlist/tree',
    // params:{proid:state.proid,name:filterText.value},
    params: {proid: state.proid},
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
        url: '/oa/proj/tlist/move',
        // params:{proid:state.proid,name:filterText.value},
        data: {draid: draggingNode.data.id,droid:dropNode.data.id,proid:state.proid},
        method: 'post',
      });
    }else{
      await request({
        url: '/oa/proj/tlist/move',
        // params:{proid:state.proid,name:filterText.value},
        data: {draid: draggingNode.data.id,droid:dropNode.data.id,proid:state.proid},
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







const addChildTlist=()=>{

}
const editTlist=()=>{
  tlistRef.value.openModal({id: currNode.id});
}
const deleteTlist=()=>{

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
