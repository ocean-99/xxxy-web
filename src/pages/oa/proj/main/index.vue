<template>
  <div>
    <el-card class='box-card'>
      <template #header>
        <el-row>
          <el-col :span='8'>
            <el-input v-model='state.form.name' placeholder='输入名称回车查询' class='list-search' clearable @keyup.enter='listQuery(state)'/>
            <el-button type='primary' @click='listQuery(state)' plain>查 询</el-button>
            <el-button class='more-button' :icon='state.moreParams?ArrowUp:ArrowDown' plain @click='state.moreParams=!state.moreParams'/>
          </el-col>
          <el-col :span='16' style='text-align: right'>
            <el-button type='success' :icon='Plus' @click='tabAdd(state.url)' plain>新增</el-button>
            <el-button type='warning' :icon='Upload' @click='importDdOldProj' plain>导入钉钉项目</el-button>
            <el-button type='warning' :icon='Switch' @click='importOaTask' plain>同步OA工单</el-button>
            <el-button type='danger' :icon='Delete' :disabled='state.multiple' @click='listDelete(state)' plain>删除</el-button>
          </el-col>
        </el-row>
        <div v-show='state.moreParams' class='more-params'>
          <el-form :inline='true' label-width='100px'>
            <el-form-item label='更多参数1'>
              <el-input v-model='state.form.xxx' placeholder='更多参数1'/>
            </el-form-item>
            <el-form-item label='更多参数2'>
              <el-input v-model='state.form.yyy' placeholder='更多参数2'/>
            </el-form-item>
            <el-form-item/>
          </el-form>
        </div>
      </template>

      <el-table height='400' :cell-style="{padding:'2px'}" :row-style="{height: '36px'}"
                v-loading='state.loading' :data='state.list'
                border stripe @selection-change='listSelect($event,state)'>
        <el-table-column type='selection' width='55' align='center'/>
        <el-table-column label='序号' type='index' width='55' align='center'/>
        <el-table-column label='项目名称' width='200'>
          <template #default='scope'>
						<span style='cursor:pointer;color: #3e9ece' @click='tabView(state.url,scope.row.id)'>
							{{ scope.row.name }}
						</span>
          </template>
        </el-table-column>
        <el-table-column label='备注' prop='notes'/>
        <el-table-column label='创建时间' prop='crtim' width='160'/>
        <el-table-column label='更新时间' prop='uptim' width='160'/>
      </el-table>

      <el-pagination
          @size-change='listQuery(state)' @current-change='listQuery(state)'
          class='mt8' :pager-count='5' :page-sizes='[10, 20, 30]' background
          :total='state.total' v-model:current-page='state.form.page'
          v-model:page-size='state.form.pageSize'
          layout='total, sizes, prev, pager, next, jumper'
      />
    </el-card>
    <GenUpload ref='uploadModal'/>
  </div>
</template>

<script lang='ts' setup>
import {Plus, Delete, ArrowDown, ArrowUp,Upload,Switch} from '@element-plus/icons-vue';
import {onMounted, reactive, ref} from 'vue';
import {listQuery, listDelete, tabAdd, tabView, listSelect} from '/@/comps/page';
import GenUpload from '/@/comps/gen/GenUpload.vue';
import request from "/@/utils/request";

const state = reactive({
  url: '/oa/proj/main', loading: true, ids: [],
  form: {}, single: true, multiple: true, list: [], total: 0,
});

onMounted(() => {
  listQuery(state);
});


const uploadModal = ref();
const importDdOldProj=()=>{
  uploadModal.value.openModal('oa/proj/main/impdd');
}

const importOaTask=async()=>{
  await request({
    url: '/si/oa/flow/impoa',
    method: 'post',
  });
}


</script>
