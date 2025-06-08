<template>
	<div>
		<el-card class='box-card'>
			<template #header>
				<div class='zjustify'>
					<div>
						<el-input v-model='state.form.name' placeholder='输入名称回车查询' clearable class='list-search' @keyup.enter='listQuery(state)' />
						<el-button type='primary' @click='listQuery(state)' plain :icon='Search'>查询</el-button>
					</div>
					<div>
						<el-button type='success' :icon='Plus' @click='tabAdd(state.url,null,{flush})' plain>新增</el-button>
						<el-button type='warning' :icon='Refresh' @click='flushPerm()' plain>刷新权限</el-button>
						<el-button type='danger' :icon='Delete' :disabled='state.multiple' @click='listDelete(state)' plain>删除</el-button>
					</div>
				</div>
			</template>

			<el-table height='400' :cell-style="{padding:'2px'}" :row-style="{height: '36px'}" v-loading='state.loading' :data='state.list'
								border stripe @selection-change='listSelect($event,state)'>
				<el-table-column type='selection' width='55' align='center' />
				<el-table-column label='序号' type='index' width='55' align='center' />
				<el-table-column label='角色名称' width='180'>
					<template #default='scope'>
						<span style='cursor:pointer;color: #3e9ece' @click='tabEdit(state.url,scope.row.id)'>{{ scope.row.name }}</span>
					</template>
				</el-table-column>
				<el-table-column label='备注' prop='notes' />
				<el-table-column label='创建时间' prop='crtim' width='160' />
				<el-table-column label='更新时间' prop='uptim' width='160' />
			</el-table>

			<el-pagination
				@size-change='listQuery(state)' @current-change='listQuery(state)'
				class='mt8' :pager-count='5' :page-sizes='[10, 20, 30]' background
				:total='state.total' v-model:current-page='state.form.page' v-model:page-size='state.form.pageSize'
				layout='total, sizes, prev, pager, next, jumper'
			/>
		</el-card>
	</div>
</template>
<script lang='ts'>
export default { name: 'SysPortalRole' };
</script>
<script lang='ts' setup>
import { Search, Plus, Delete, Refresh } from '@element-plus/icons-vue';
import { onMounted, reactive } from 'vue';
import { listQuery, listDelete, tabAdd, tabEdit, listSelect } from '/@/comps/page/index';
import {post} from '/@/utils/req';
import { ElMessage } from 'element-plus';

const state = reactive({
	url: '/sys/portal/role', loading: true, ids: [],
	form: {}, single: true, multiple: true, list: [], total: 0,
});

onMounted(() => {
	listQuery(state);
});

const flush = async () => {
	await listQuery(state);
};

const flushPerm = async () => {
	await post({
		url: state.url + '/flush',
	});
	ElMessage.success('刷新成功');
};


</script>

<style scoped>

</style>
