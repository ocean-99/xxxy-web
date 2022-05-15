<template>
	<div>
		<el-card class='box-card'>
			<template #header>
				<el-row>
					<el-col :span='11'>
						<el-input v-model='state.form.name' placeholder='输入名称回车查询' clearable style='width: 200px;margin-right: 10px' @keyup.enter='listQuery(state)' />
						<el-button type='primary' @click='listQuery(state)' plain>查 询</el-button>
					</el-col>
					<el-col :span='13' style='text-align: right'>
						<el-button type='danger' :icon='Delete' :disabled='state.multiple' @click='listDelete(state)' plain>删除</el-button>
					</el-col>
				</el-row>
			</template>

			<el-table height='400' :cell-style="{padding:'2px'}" :row-style="{height: '36px'}" v-loading='state.loading' :data='state.list'
								border stripe @selection-change='listSelect($event,state)'>
				<el-table-column type='selection' width='55' align='center' />
				<el-table-column label='序号' type='index' width='55' align='center' />
				<el-table-column label='任务名称' width='300'>
					<template #default='scope'>
						<span style='cursor:pointer;color: #3e9ece' @click='drawer.open(scope.row.id)'>{{ scope.row.name }}</span>
					</template>
				</el-table-column>
				<el-table-column label='开始时间' prop='sttim' width='160' />
				<el-table-column label='结束时间' prop='entim' width='160' />
				<el-table-column label='是否成功' prop='ret' width='120' />
				<el-table-column label='MSG信息' prop='msg' />
			</el-table>

			<el-pagination
				@size-change='listQuery(state)' @current-change='listQuery(state)'
				class='mt8' :pager-count='5' :page-sizes='[10, 20, 30]' background
				:total='state.total' v-model:current-page='state.form.page' v-model:page-size='state.form.pageSize'
				layout='total, sizes, prev, pager, next, jumper'
			/>
		</el-card>
		<DrawerView ref='drawer' @listQuery='listQuery(state)'/>
	</div>
</template>
<script lang='ts' setup>
import { Delete } from '@element-plus/icons-vue';
import { onMounted, reactive, ref } from 'vue';
import { listQuery, listDelete, listSelect } from '/@/comps/page/index';
import DrawerView from './view.vue';
const drawer = ref();

const state = reactive({
	url: '/sys/job/log', loading: true, ids: [],
	form: {}, single: true, multiple: true, list: [], total: 0,
});

onMounted(() => {
	listQuery(state);
});


</script>

<style scoped>

</style>
