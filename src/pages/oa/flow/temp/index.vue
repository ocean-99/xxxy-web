<template>
  <Wrap>
    <div class='p-left'>
      <CateTree url='/oa/flow/cate/tree' @node-click='nodeClick'/>
    </div>
    <div class='p-right'>
      <el-card class='box-card'>
        <template #header>
          <el-row>
            <el-col :span='14'>
              <el-input v-model='state.form.name' placeholder='输入名称回车查询' clearable class="list-search" @keyup.enter='listQuery(state)'/>
              <el-button type='primary' @click='listQuery(state)' plain>查 询</el-button>
              <el-button class='more-button' :icon='state.moreParams?ArrowUp:ArrowDown' plain @click='state.moreParams=!state.moreParams'>更多</el-button>
            </el-col>
            <el-col :span='10' style='text-align: right'>
              <el-button type='success' :icon='Plus' @click='pageAdd("ofte")' plain>新增</el-button>
              <el-button type='danger' :icon='Delete' :disabled='state.multiple' @click='listDelete(state)' plain>删除</el-button>
            </el-col>
          </el-row>
          <div v-show='state.moreParams' class='more-params'>
            <el-form :inline='true' label-width='100px'>
              <el-form-item label='备注'>
                <el-input v-model='state.form.notes' placeholder='输入备注'/>
              </el-form-item>
              <el-form-item label='xxxxx'>
                <el-input v-model='state.form.xx'/>
              </el-form-item>
              <el-form-item/>
            </el-form>
          </div>
        </template>

        <el-table height='400' :cell-style="{padding:'2px'}" :row-style="{height: '36px'}" v-loading='state.loading' :data='state.list'
                  border stripe @selection-change='listSelect($event,state)'>
          <el-table-column type='selection' width='55' align='center'/>
          <el-table-column label='序号' type='index' width='55' align='center'/>
          <el-table-column label='模板名称'>
            <template #default='scope'>
              <span style='cursor:pointer;color: #3e9ece' @click='pageEdit("ofte?id="+scope.row.id)'>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label='所属分类' prop='catna' width='90'/>
          <el-table-column label='创建人' prop='crman' width='60'/>
          <el-table-column label='创建时间' prop='crtim' width='150'/>
          <el-table-column label='更新人' prop='upman' width='60'/>
          <el-table-column label='更新时间' prop='uptim' width='150'/>
        </el-table>

        <el-pagination
            @size-change='listQuery(state)' @current-change='listQuery(state)'
            class='mt8' :pager-count='5' :page-sizes='[10, 20, 30]' background
            :total='state.total' v-model:current-page='state.form.page' v-model:page-size='state.form.pageSize'
            layout='total, sizes, prev, pager, next, jumper'
        />

      </el-card>
    </div>
  </Wrap>
</template>
<script lang='ts'>
export default {name: 'oaFlowTemp'};
</script>
<script lang='ts' setup>
import {Plus, Delete, ArrowDown, ArrowUp} from '@element-plus/icons-vue';
import {onMounted, reactive} from 'vue';
import {listQuery, listDelete, listSelect, pageAdd, pageEdit} from '/@/comps/page/index';
import Wrap from '/@/comps/page/Wrap.vue';
import CateTree from '/@/comps/gen/GenTree.vue';

const state = reactive({
  url: '/oa/flow/temp', loading: true, ids: [], moreParams: false,
  form: {}, single: true, multiple: true, list: [], total: 0,
});

onMounted(() => {
  listQuery(state);
});

//region a 左侧部门树点击
const nodeClick = async (node: any) => {
  state.form.catid = node.id;
  await listQuery(state);
};
//endregion

</script>

<style scoped>

</style>
