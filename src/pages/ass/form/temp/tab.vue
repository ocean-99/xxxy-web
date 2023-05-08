<template>
  <el-dialog v-model='state.show' title='页签维护' draggable width='500px'>
    <el-table border :data='state.tabs' :row-style="{height: '36px'}" row-key='id' style='width: 100%'>
      <el-table-column label='排序' width='50'>
        <template #default='scope'>
          <el-input v-model='scope.row.ornum'></el-input>
        </template>
      </el-table-column>
      <el-table-column label='页签代码' width='120'>
        <template #default='scope'>
          <el-input v-model='scope.row.name'></el-input>
        </template>
      </el-table-column>
      <el-table-column label='页签名称'>
        <template #default='scope'>
          <el-input v-model='scope.row.label'></el-input>
        </template>
      </el-table-column>
      <el-table-column fixed='right' label='操作' width='50' align='center'>
        <template #header>
          <el-icon :size='22' style='top: 5px;cursor: pointer' color='#666'>
            <ele-CirclePlus @click='addTab'/>
          </el-icon>
        </template>
        <template #default='scope'>
          <el-icon :size='22' style='top: 3px;cursor: pointer'>
            <ele-CircleClose @click='delTab(scope.$index)'/>
          </el-icon>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <span class='dialog-footer'>
				<el-button type='primary' @click='handleConfirm'>确 认</el-button>
        <el-button @click='state.show = false'>取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang='ts' setup>
import {defineExpose, reactive} from 'vue';

const state = reactive({
  show: false,
  tabs: [] as any,
});


const openModal = async (data: any) => {
  state.tabs = data.tabs;
  state.show = true;
};
defineExpose({openModal});

const emits = defineEmits(['close']);
const handleConfirm = async () => {
  emits('close', state.tabs);
  state.show = false;
};

const addTab = () => {
  state.tabs.push({ornum: state.tabs.length + 1,fields:[]});
};

const delTab = ($index: any) => {
  state.tabs.splice($index, 1);
};


</script>
