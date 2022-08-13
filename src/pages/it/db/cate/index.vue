<template>
  <div>
    <el-card class='box-card'>
      <template #header>
        <el-row>
          <el-col :span='14'>
            <el-input v-model='state.form.name' placeholder='输入名称回车查询' clearable class="list-search" @keyup.enter='treeQuery(state)'/>
            <el-button type='primary' @click='treeQuery(state)' :icon="Search" plain>查询</el-button>
          </el-col>
          <el-col :span='10' style='text-align: right'>
            <el-button type='success' :icon='Plus' @click='editRef.openModal()' plain>新增</el-button>
            <el-button type='danger' :icon='Delete' :disabled='state.multiple' @click='treeDelete(state)' plain>删除</el-button>
          </el-col>
        </el-row>
      </template>

      <el-table ref='tableRef' row-key='id' :cell-style="{padding:'2px'}" :row-style="{height: '36px'}" v-loading='state.loading' :data='state.list'
                border stripe @selection-change='treeSelect($event,state)'
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
        <el-table-column type='selection' width='55' align='center'/>
        <el-table-column label='序号' type='index' width='55' align='center'/>
        <el-table-column label='分类名称' width='180'>
          <template #default='scope'>
            <span style='cursor:pointer;color: #972fcb' @click='toggle(scope.row)'>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label='创建时间' prop='crtim' width='160'/>
        <el-table-column label='更新时间' prop='uptim' width='160'/>
        <el-table-column label='备注' prop='notes'/>
        <el-table-column label='操作' width='110' header-align='center' align="center">
          <template #default="scope">
            <el-icon @click='editRef.openModal({pname:scope.row.name,pid:scope.row.id})' style="cursor: pointer;font-size: 18px;top:2px;color: #52C41A">
              <circle-plus/>
            </el-icon>
            <el-icon @click='editRef.openModal({id:scope.row.id})' style="cursor: pointer;font-size: 18px;top:2px;margin-left: 11px;color: #2874C5">
              <edit/>
            </el-icon>
            <el-icon @click='treeItemDelete(state,scope.row.id)' style="cursor: pointer;font-size: 18px;top:2px;margin-left: 10px;color: #ED6F6F">
              <delete/>
            </el-icon>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <CateEdit ref='editRef' @close='treeQuery(state)'/>
  </div>
</template>
<script lang='ts' setup>
import {Search, Plus, Delete, Edit, CirclePlus} from '@element-plus/icons-vue';
import {onMounted, reactive, ref} from 'vue';
import {treeDelete, treeItemDelete, treeSelect, treeQuery} from '/@/comps/page';
import CateEdit from './edit.vue';

const state = reactive({
  url: '/it/db/cate', loading: true, ids: [],
  form: {}, single: true, multiple: true, list: [], total: 0,
});

const tableRef = ref();
const editRef = ref() as any;

onMounted(() => {
  treeQuery(state);
});

const toggle = (row: any) => {
  tableRef.value.toggleRowExpansion(row);
}


</script>

<style scoped>

</style>
