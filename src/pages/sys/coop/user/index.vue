<template>
  <div>
    <el-card class='box-card'>
      <template #header>
        <div class='zjustify'>
          <div>
						<el-input v-model='state.form.corna' @click='openCorpModal' style=' height: 32px;  width: 300px;margin-right: 10px' placeholder='公司名称' readonly :suffix-icon='Search'/>
            <el-input v-model='state.form.name' placeholder='输入用户名称回车查询' class='list-search' clearable @keyup.enter='listQuery(state)' />
            <el-button type='primary' @click='listQuery(state)' plain>查 询</el-button>
            <el-button class='more-button' :icon='state.moreParams?ArrowUp:ArrowDown' plain @click='state.moreParams=!state.moreParams' />
						<span style='margin-left: 10px;color: red'>外部用户可分配权限登陆系统，默认密码1</span>
          </div>
          <div>
            <el-button type='success' :icon='Plus' @click='editRef.open({depid:state.form.depid,depna:state.form.depna})' plain>新增</el-button>
            <el-button type='danger' :icon='Delete' :disabled='state.multiple' @click='listDelete(state)' plain>删除</el-button>
          </div>
        </div>
        <div v-show='state.moreParams' class='more-params'>
          <el-form :inline='true' label-width='100px'>
            <el-form-item label='更多参数1'>
              <el-input v-model='state.form.xxx' placeholder='更多参数1' />
            </el-form-item>
            <el-form-item label='更多参数2'>
              <el-input v-model='state.form.yyy' placeholder='更多参数2' />
            </el-form-item>
            <el-form-item />
          </el-form>
        </div>
      </template>

      <el-table height='400' :cell-style="{padding:'2px'}" :row-style="{height: '36px'}"
                v-loading='state.loading' :data='state.list'
                border stripe @selection-change='listSelect($event,state)'>
        <el-table-column type='selection' width='55' align='center' />
        <el-table-column label='#' type='index' width='35' align='center' />
        <el-table-column label='用户名称' width='200'>
          <template #default='scope'>
						<span style='cursor:pointer;color: #3e9ece' @click='editRef.open({id:scope.row.id})'>
							{{ scope.row.name }}
						</span>
          </template>
        </el-table-column>
        <!--				<el-table-column label='名称' prop='name' width='180' />-->
        <el-table-column label='所属公司' prop='corna' />
        <el-table-column label='账号类型' prop='type' />
        <el-table-column label='备注' prop='notes' />
        <el-table-column label='创建时间' prop='crtim' width='160' />
        <el-table-column label='更新时间' prop='uptim' width='160' />
      </el-table>

      <el-pagination
          @size-change='listQuery(state)' @current-change='listQuery(state)'
          class='mt8' :pager-count='5' :page-sizes='[10, 20, 30]' background
          :total='state.total' v-model:current-page='state.form.page'
          v-model:page-size='state.form.pageSize'
          layout='total, sizes, prev, pager, next, jumper'
      />
    </el-card>
		<CorpModal ref='corpModal' @close='closeCorpModal' url='sys/coop/corp/tree'/>
    <Medit ref='editRef' @close='listQuery(state)' />
  </div>
</template>
<script lang='ts'>
export default { name: 'SysCoopUser' };
</script>

<script lang='ts' setup>
import {Search, Plus, Delete, ArrowDown, ArrowUp } from '@element-plus/icons-vue';
import { onMounted, reactive, ref } from 'vue';
import { listQuery, listDelete, listSelect } from '/@/comps/page';
import Medit from './medit.vue';
import CorpModal from '/@/comps/gen/GenTreeModal.vue';
import { ElMessage } from 'element-plus';

const editRef = ref() as any;

const state = reactive({
  url: '/sys/coop/user', loading: true, ids: [],
  form: {} as any, single: true, multiple: true, list: [], total: 0,
});

onMounted(() => {
  listQuery(state);
});

//region a 公司选择逻辑
const corpModal = ref();

const openCorpModal = () => {
	corpModal.value.openModal();
};

const closeCorpModal = async (node: any) => {
	if (node) {
		if (!node.pid) {
			ElMessage.warning("请选择公司，而非分类")
		} else {
			state.form.corp = {id: node.id, name: node.name};
			state.form.corna = node.name;
			state.form.corid = node.id;
		}
	}
};
//endregion
</script>
