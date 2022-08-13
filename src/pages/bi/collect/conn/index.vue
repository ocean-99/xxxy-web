<template>
  <div>
    <el-card class='box-card'>
      <template #header>
        <el-row>
          <el-col :span='14'>
            <el-input v-model='state.form.name' placeholder='输入名称回车查询' class='list-search' clearable @keyup.enter='listQuery(state)'/>
            <el-button type='primary' @click='listQuery(state)' plain>查 询</el-button>
          </el-col>
          <el-col :span='10' style='text-align: right'>
            <el-button type='success' :icon='Plus' @click='editRef.openModal()' plain>新增</el-button>
            <el-button type='danger' :icon='Delete' :disabled='state.multiple' @click='listDelete(state)' plain>删除</el-button>
          </el-col>
        </el-row>
      </template>

      <el-table height='400' :cell-style="{padding:'2px'}" :row-style="{height: '36px'}"
                v-loading='state.loading' :data='state.list'
                border stripe @selection-change='listSelect($event,state)'>
        <el-table-column type='selection' width='55' align='center'/>
        <el-table-column label='序号' type='index' width='55' align='center'/>
        <el-table-column label='连接名称' prop='id' width='160'>
          <template #default='scope'>
						<span style='cursor:pointer;color: #3e9ece' @click='editRef.openModal({id:scope.row.id})'>
							{{ scope.row.name }}
						</span>
          </template>
        </el-table-column>
        <el-table-column label='备注' prop='notes'/>
				<el-table-column label='创建人' prop='crman' width='60' />
				<el-table-column label='创建时间' prop='crtim' width='150' />
				<el-table-column label='更新人' prop='upman' width='60' />
				<el-table-column label='更新时间' prop='uptim' width='150' />
        <el-table-column label='操作' prop='notes' width='46' align='center'>
          <template #default='scope'>
            <el-icon :size='18' style='top:3px;color: #972fcb;cursor: pointer' @click='sync(scope.row.id)' title="同步表结构">
              <SetUp/>
            </el-icon>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
          @size-change='listQuery(state)' @current-change='listQuery(state)'
          class='mt8' :pager-count='5' :page-sizes='[10, 20, 30]' background
          :total='state.total' v-model:current-page='state.form.page'
          v-model:page-size='state.form.pageSize'
          layout='total, sizes, prev, pager, next, jumper'
      />
    </el-card>
    <Edit ref="editRef" @close="listQuery(state)"/>
  </div>
</template>

<script lang='ts' setup>
import {SetUp,Plus, Delete} from '@element-plus/icons-vue';
import {onMounted, reactive, ref} from 'vue';
import {listQuery, listDelete, listSelect} from '/@/comps/page/index';
import Edit from './edit.vue';
import request from "/@/utils/request";
import {ElLoading, ElMessage} from "element-plus";


const editRef = ref() as any;
const state = reactive({
  url: '/bi/collect/conn', loading: true, ids: [], cates: [] as any,
  form: {}, single: true, multiple: true, list: [], total: 0,
});

onMounted(() => {
  listQuery(state);
});

const sync=async (id:string)=>{
  const loading = ElLoading.service({
    lock: true,
    fullscreen: true,
    text:'表结构同步中，请耐心等待',
    background: 'rgba(0, 0, 0, 0.6)',
  });

  let isSuccess=true;

  await request({
    url: state.url + '/sync?id=' + id,
    method: 'post',
  }).catch(() => {
    isSuccess=false
  });

  if(isSuccess){
    ElMessage({
      showClose: true,
      message: '同步成功',
      type: 'success',
      duration:500
    })
    setTimeout(() => {
      loading.close();
    }, 500);
  }else{
    loading.close();
  }

}


</script>

<style scoped>

</style>
