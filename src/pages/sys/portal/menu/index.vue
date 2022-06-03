<template>
  <div>
    <el-card class='box-card'>
      <template #header>
        <el-row>
          <el-col :span='14'>
            <el-select v-model='state.form.porid' placeholder='门户名称' @change="treeQuery(state)" style='margin-right:10px;width: 180px'>
              <el-option
                  v-for='item in state.portals'
                  :key='item.id'
                  :label='item.name'
                  :value='item.id'
              />
            </el-select>
            <el-input v-model='state.form.name' placeholder='输入名称回车查询' style="width:180px"
                      clearable class="list-search" @keyup.enter='treeQuery(state)'/>
            <el-button type='primary' @click='treeQuery(state)' :icon="Search" plain>查询</el-button>
          </el-col>
          <el-col :span='10' style='text-align: right'>
            <el-button type='success' :icon='Plus' @click='drawer.open({porid:state.form.porid})' plain>新增</el-button>
            <el-button type='danger' :icon='Delete' :disabled='state.multiple' @click='treeDelete(state)' plain>删除</el-button>
          </el-col>
        </el-row>
      </template>

      <el-table ref='tableRef' row-key='id' :cell-style="{padding:'2px'}" :row-style="{height: '36px'}" v-loading='state.loading' :data='state.list'
                border stripe @selection-change='treeSelect($event,state)'
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
        <el-table-column type='selection' width='55' align='center'/>
        <el-table-column label='序号' type='index' width='55' align='center'/>
        <el-table-column label='名称' width='250'>
          <template #default='scope'>
            <span style='cursor:pointer;color:#972fcb' @click='toggle(scope.row)'>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label='类型' prop='type' width='60' header-align='center'>
          <template #default="scope">
            <el-tag v-show="scope.row.type==='D'" type="success" size="small">目录</el-tag>
            <el-tag v-show="scope.row.type==='M'" type="warning" size="small">菜单</el-tag>
          </template>
        </el-table-column>
        <el-table-column label='路由路径' prop='path'/>
        <el-table-column label='组件路径' prop='comp'/>
        <el-table-column label='状态' prop='type' width='60' header-align='center' align="center">
          <template #default="scope">
            <span v-show="scope.row.shtag===true">显示</span>
            <span v-show="scope.row.shtag===false">隐藏</span>
          </template>
        </el-table-column>
        <!--				<el-table-column label='创建时间' prop='crtim' width='150' />-->
        <!--				<el-table-column label='更新时间' prop='uptim' width='150' />-->
        <el-table-column label='操作' width='105' header-align='center' align="right">
          <template #default="scope">
            <el-icon @click='drawer.open({porid:state.form.porid,pid:scope.row.id,pname:scope.row.name})'
                     style="cursor: pointer;font-size: 18px;top:2px;margin-right: 8px;color: #52C41A">
              <circle-plus/>
            </el-icon>
            <el-icon @click='drawer.open({id:scope.row.id})' style="cursor: pointer;font-size: 18px;top:2px;margin-right: 8px;color: #2874C5">
              <edit/>
            </el-icon>
            <el-icon @click='treeItemDelete(state,scope.row.id)' style="cursor: pointer;font-size: 18px;top:2px;margin-right: 8px;color: #ED6F6F">
              <delete/>
            </el-icon>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <DrawerEdit ref='drawer' @treeQuery='treeQuery(state)'/>
  </div>
</template>
<script lang='ts'>
export default {name: 'SysPortalMenu'};
</script>
<script lang='ts' setup>
import {Search, Plus, Delete, Edit, CirclePlus} from '@element-plus/icons-vue';
import {onMounted, reactive, ref} from 'vue';
import {treeDelete, treeItemDelete, treeSelect, treeQuery} from '/@/comps/page/index';
import DrawerEdit from './edit.vue';
import request from "/@/utils/request";

const drawer = ref();

const state = reactive({
  url: '/sys/portal/menu', loading: true, ids: [],portals:[] as any,
  form: {porid:'sys'}, single: true, multiple: true, list: [], total: 0,
});

const tableRef = ref();

onMounted(() => {
  portalsInit();
  treeQuery(state);
});


const toggle = (row: any) => {
  tableRef.value.toggleRowExpansion(row);
}

const portalsInit = async () => {
  state.portals = await request({
    url: '/sys/portal/main/list',
    method: 'get',
  });
};

</script>

<style scoped>

</style>
