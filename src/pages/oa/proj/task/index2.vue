<template>
  <Wrap>
    <div class='p-left'>
      <TlistTree @node-click='nodeClick'/>
    </div>
    <div class='p-right'>
      <el-card class='box-card' body-style="padding-top:0">
        <template #header>
          <el-row>
            <el-col :span='14'>
              <el-input v-model='state.form.name' placeholder='输入名称回车查询' clearable class='list-search' @keyup.enter='vxeQuery($refs.gridRef)'/>
              <el-button type='primary' @click='vxeQuery($refs.gridRef)' :icon="Search" plain>查询</el-button>
              <el-button class='more-button' :icon='state.moreParams?ArrowUp:ArrowDown' plain @click='state.moreParams=!state.moreParams'/>
            </el-col>
            <el-col :span='10' style='text-align: right'>
              <el-button type='success' :icon='Plus' @click='add()' plain>新增</el-button>
              <el-button type='danger' :icon='Delete' :disabled='state.multiple' @click='listDelete(state)' plain>删除</el-button>
            </el-col>
          </el-row>
          <div v-show='state.moreParams' class='more-params'>
            <el-form :inline='true' label-width='100px'>
              <el-form-item label='更多参数1'>
                <el-input v-model='state.form.notes' placeholder='更多参数1'/>
              </el-form-item>
              <el-form-item label='更多参数2'>
                <el-input v-model='state.form.xx' placeholder='更多参数2'/>
              </el-form-item>
              <el-form-item/>
            </el-form>
          </div>
        </template>

        <vxe-grid ref='gridRef' v-bind="gridOptions" style="margin-top: 10px">
          <template #name_default="{ row }">
          <span @click="drawer.open({id:row.id})" style="cursor:pointer;color: #3e9ece">
            {{ row.name }}
          </span>
          </template>
        </vxe-grid>

      </el-card>
      <DrawerEdit ref='drawer' @afterEdit='vxeQuery(gridRef)'/>
    </div>
  </Wrap>
</template>
<script lang='ts' setup>
import {Operation,Search, Plus, Delete, ArrowDown, ArrowUp} from '@element-plus/icons-vue';
import {onMounted, reactive, ref} from 'vue';
import { listDelete,  tabAdd} from '/@/comps/page';
import {vxeInit, vxeQuery} from '/@/comps/vxe';
import Wrap from '/@/comps/page/Wrap.vue';
import TlistTree from '../tlist/tree.vue';
import {VxeGridProps} from 'vxe-table';
import { useRoute } from 'vue-router';
import DrawerEdit from './edit.vue';
import {ElMessage} from "element-plus";

const route = useRoute();

const state = reactive({
  url: '/oa/proj/task', loading: true, ids: [], moreParams: false,
  form: {} as any, single: true, multiple: true, list: [], total: 0,
});


const drawer = ref();
onMounted(() => {
  state.form.proid = route.query?.proid;
  // listQuery(state);
  vxeInit(state, gridOptions);
});

//region a 左侧部门树点击
const nodeClick = async (node: any) => {
  if(node){
    state.form.tliid = node.id;
    // state.form.grona = node.name;
    state.form.proid = node.proid;
    await vxeQuery(gridRef.value);
  }
};
//endregion

const add=()=>{
  if(state.form.tliid){
    drawer.value.open({tliid:state.form.tliid})
  }else{
     ElMessage.warning("请先选择任务清单后再创建任务");
  }
}


const gridRef = ref();
const gridOptions = reactive<VxeGridProps>({
  columns: [
    {type: 'checkbox', align: 'center', width: 42, fixed: 'left'},
    {type: 'seq', align: 'center', width: 50, fixed: 'left'},
    {field: 'name', title: '任务名称', width: 160, fixed: 'left', slots: {default: 'name_default'}},
    {field: 'notes', title: '任务备注'}
  ],
  // toolbarConfig: {
  //   buttons: [
  //     {code: 'insert_actived', name: '新增'},
  //     {code: 'delete', name: '直接删除'},
  //     {code: 'mark_cancel', name: '删除/取消'},
  //     {code: 'save', name: '保存', status: 'success'}
  //   ],
  //   refresh: true,
  //   import: true,
  //   export: true,
  //   print: true,
  //   zoom: true,
  //   custom: true
  // },
});


</script>

<style scoped>

</style>
