<template>
  <div>
    <el-card class='box-card'>
      <template #header>
        <el-row>
          <el-col :span='14'>
            <el-input v-model='state.form.name' placeholder='输入名称回车查询' class='list-search' clearable @keyup.enter='vxeQuery($refs.gridRef)'/>
            <el-button type='primary' @click='vxeQuery($refs.gridRef)' plain>查 询</el-button>
          </el-col>
          <el-col :span='10' style='text-align: right'>
            <el-button type='success' :icon='Plus' @click='tabAdd(state.url)' plain>新增</el-button>
            <el-button type='danger' :icon='Delete' :disabled='state.multiple' @click='vxeDelete($refs.gridRef,state.url)' plain>删除</el-button>
          </el-col>
        </el-row>
      </template>

      <vxe-grid ref='gridRef' v-bind="gridOptions">
        <template #name_default="{ row }">
          <span @click="tabEdit(state.url,row.id)" style="cursor:pointer;color: #3e9ece">
            {{ row.name }}
          </span>
        </template>
      </vxe-grid>

    </el-card>
  </div>
</template>

<script lang='ts' setup>
import {Plus, Delete} from '@element-plus/icons-vue';
import {onMounted, reactive} from 'vue';
import {VxeGridProps} from 'vxe-table'
import {tabAdd, tabEdit} from '/@/comps/page';
import {vxeInit, vxeQuery, vxeDelete} from '/@/comps/vxe';

const state = reactive({
  url: '/de/supp/main',
  form: {},
});

const gridOptions = reactive<VxeGridProps>({
  columns: [
    {type: 'checkbox', align: 'center', width: 42, fixed: 'left'},
    {type: 'seq', align: 'center', width: 50, fixed: 'left'},
    {field: 'name', title: '供应商名称', width: 300, fixed: 'left', slots: {default: 'name_default'}},
    {field: 'crtim', title: '创建时间', width: 160},
    {field: 'notes', title: '备注'}
  ],
});

onMounted(() => {
  vxeInit(state, gridOptions);
});
</script>
