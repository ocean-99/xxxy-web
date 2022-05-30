<template>
	<div>
		<el-card class='box-card'>
			<template #header>
				<el-row>
					<el-col :span='14'>
						<el-input v-model='state.form.name' placeholder='输入名称回车查询' class='list-search' clearable @keyup.enter='listQuery(state)' />
						<el-button type='primary' @click='listQuery(state)' plain>查 询</el-button>
					</el-col>
					<el-col :span='10' style='text-align: right'>
						<el-button type='success' :icon='Plus' @click='tabAdd(state.url)' plain>新增</el-button>
						<el-button type='danger' :icon='Delete' :disabled='state.multiple' @click='listDelete(state)' plain>删除</el-button>
					</el-col>
				</el-row>
			</template>

			<el-table height='400' :cell-style="{padding:'2px'}" :row-style="{height: '36px'}"
								v-loading='state.loading' :data='state.list'
								border stripe @selection-change='listSelect($event,state)'>
				<el-table-column type='selection' width='55' align='center' />
				<el-table-column label='序号' type='index' width='55' align='center' />
				<el-table-column label='门户名称' width='180'>
					<template #default='scope'>
						<span style='cursor:pointer;color: #3e9ece' @click='tabEdit(state.url,scope.row.id)'>
							{{ scope.row.name }}
						</span>
					</template>
				</el-table-column>
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
	</div>
</template>

<script lang='ts' setup>
import { Plus, Delete } from '@element-plus/icons-vue';
import { onMounted, reactive } from 'vue';
import { listQuery, listDelete, tabAdd, tabEdit, listSelect } from '/@/comps/page/index';

const state = reactive({
	url: '/sys/portal/main', loading: true, ids: [], cates: [] as any,
	form: {}, single: true, multiple: true, list: [], total: 0,
});

onMounted(() => {
	listQuery(state);
});

</script>

<style scoped>

</style>
