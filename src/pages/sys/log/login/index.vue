<template>
	<div>
		<el-card class='box-card'>
			<template #header>
				<el-row>
					<el-col :span='14'>
						<el-input v-model='state.form.name' placeholder='输入名称回车查询' clearable class='list-search' @keyup.enter='listQuery(state)' />
						<el-button type='primary' @click='listQuery(state)' plain>查 询</el-button>
					</el-col>
					<el-col :span='10' style='text-align: right'>
						<el-button type='danger' :icon='Delete' :disabled='state.multiple' @click='listDelete(state)' plain>删除</el-button>
					</el-col>
				</el-row>
			</template>

			<el-table height='400' :cell-style="{padding:'2px'}" :row-style="{height: '36px'}" v-loading='state.loading' :data='state.list'
								border stripe @selection-change='listSelect($event,state)'>
				<el-table-column type='selection' width='55' align='center' />
				<el-table-column label='序号' type='index' width='55' align='center' />
				<el-table-column label='用户姓名' width='100' prop='name'/>
				<el-table-column label='用户账号' prop='usnam' width='100' />
				<el-table-column label='登录时间' prop='crtim' width='160' >
					<template #default='scope'>
						<span style='cursor:pointer;color: #3e9ece' @click='drawer.open(scope.row.id)'>{{ scope.row.crtim }}</span>
					</template>
				</el-table-column>
				<el-table-column label='登录IP' prop='ip' width='120' />
				<el-table-column label='登录地点' prop='addre' width='160' />
				<el-table-column label='操作系统' prop='ageos' width='150' />
				<el-table-column label='浏览器' prop='agbro' />
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
<script lang='ts'>
export default { name: 'sysJobMain' };
</script>
<script lang='ts' setup>
import { Delete } from '@element-plus/icons-vue';
import { onMounted, reactive, ref } from 'vue';
import { listQuery, listDelete, listSelect } from '/@/comps/page/index';
import DrawerView from './view.vue';
const drawer = ref();

const state = reactive({
	url: '/sys/log/login', loading: true, ids: [],
	form: {}, single: true, multiple: true, list: [], total: 0,
});

onMounted(() => {
	listQuery(state);
});


</script>

<style scoped>

</style>
