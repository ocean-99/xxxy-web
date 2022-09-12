<template>
  <div>
    <el-card class='box-card'>
      <template #header>
				<div class='zjustify'>
					<div>
						<el-input v-model='state.form.name' placeholder='字典编码/名称（回车可查询）' class='list-search' clearable @keyup.enter='listQuery(state)'/>
						<el-button type='primary' @click='listQuery(state)' plain>查 询</el-button>
						<el-button class='more-button' :icon='state.moreParams?ArrowUp:ArrowDown' plain @click='state.moreParams=!state.moreParams'/>
						<span style='margin-left: 10px;color: red'>数据字典主要服务于业务表单下拉框</span>
					</div>
					<div>
						<el-button type='success' :icon='Plus' @click='editRef.openModal()' plain>新增</el-button>
						<el-button type='danger' :icon='Delete' :disabled='state.multiple' @click='listDelete(state)' plain>删除</el-button>
					</div>
				</div>
        <div v-show='state.moreParams' class='more-params'>
          <el-form :inline='true' label-width='100px'>
            <el-form-item label='更多参数1'>
              <el-input v-model='state.form.notes'  placeholder='更多参数1'/>
            </el-form-item>
            <el-form-item label='更多参数2'>
              <el-input v-model='state.form.xx'  placeholder='更多参数2'/>
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
        <el-table-column label='字典编码' prop='id' width='160'>
          <template #default='scope'>
						<span style='cursor:pointer;color: #3e9ece' @click='configData(scope.row.id)'>
							{{ scope.row.id }}
						</span>
          </template>
        </el-table-column>
        <el-table-column label='字典名称' prop='name' width='180'/>
        <el-table-column label='创建时间' prop='crtim' width='160'/>
        <el-table-column label='更新时间' prop='uptim' width='160'/>
        <el-table-column label='备注' prop='notes'/>
        <el-table-column label='操作' prop='notes' width='46' align='center'>
          <template #default='scope'>
            <el-icon :size='18' style='top:3px;color: #972fcb;cursor: pointer' @click='editRef.openModal({id:scope.row.id})' title="修改">
              <Edit/>
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
    <DictEdit ref="editRef" @close="listQuery(state)"/>
  </div>
</template>

<script lang='ts' setup>
import {Plus, Delete, ArrowDown, ArrowUp,Edit } from '@element-plus/icons-vue';
import {onMounted, reactive, ref} from 'vue';
import {listQuery, listDelete, listSelect} from '/@/comps/page/index';
import router from "/@/router";
import DictEdit from './edit.vue';


const editRef = ref() as any;
const state = reactive({
  url: '/ass/dict/main', loading: true, ids: [], cates: [] as any,
  form: {}, single: true, multiple: true, list: [], total: 0,
});

onMounted(() => {
  listQuery(state);
});

const configData = async (rowid: string) => {
  await router.push({
    path: '/ass/dict/data',
    query: {maiid: rowid},
  });
}


</script>

<style scoped>

</style>
