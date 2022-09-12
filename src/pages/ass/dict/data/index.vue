<template>
	<div>
		<el-card class='box-card'>
			<template #header>
				<div class='zjustify'>
					<div>
						<el-select v-model='state.form.maiid' @change='listQuery(state)' filterable clearable placeholder='字典名称' style='margin-right:10px;width: 180px'>
							<el-option v-for='item in state.dicts' :key='item.id' :label='item.name' :value='item.id' />
						</el-select>
						<el-input v-model='state.form.name' placeholder='字典值编码/名称' class='list-search' style='width: 180px' clearable @keyup.enter='listQuery(state)' />
						<el-button type='primary' @click='listQuery(state)' plain>查 询</el-button>
					</div>
					<div>
						<el-button type='success' :icon='Plus' @click='editRef.openModal({maiid:state.form.maiid})' plain>新增</el-button>
						<el-button type='danger' :icon='Delete' :disabled='state.multiple' @click='listDelete(state)' plain>删除</el-button>
					</div>
				</div>
			</template>

			<el-table height='400' :cell-style="{padding:'2px'}" :row-style="{height: '36px'}"
								v-loading='state.loading' :data='state.list'
								border stripe @selection-change='listSelect($event,state)'>
				<el-table-column type='selection' width='55' align='center' />
				<el-table-column label='序号' type='index' width='55' align='center' />
				<el-table-column label='字典值编码' width='180'>
					<template #default='scope'>
						<span style='cursor:pointer;color: #3e9ece' @click='editRef.openModal({id:scope.row.id})'>
							{{ scope.row.code }}
						</span>
					</template>
				</el-table-column>
				<el-table-column label='字典值名称' prop='name' width='160' />
				<el-table-column label='字典值排序' prop='ornum' width='160' />
				<el-table-column label='创建时间' prop='crtim' width='160' />
				<el-table-column label='更新时间' prop='uptim' width='160' />
				<el-table-column label='备注' prop='notes' />
			</el-table>

			<el-pagination
				@size-change='listQuery(state)' @current-change='listQuery(state)'
				class='mt8' :pager-count='5' :page-sizes='[10, 20, 30]' background
				:total='state.total' v-model:current-page='state.form.page'
				v-model:page-size='state.form.pageSize'
				layout='total, sizes, prev, pager, next, jumper'
			/>
		</el-card>
		<Edit ref='editRef' @close='listQuery(state)' />
	</div>
</template>

<script lang='ts' setup>
import { Plus, Delete } from '@element-plus/icons-vue';
import { onMounted, reactive, ref } from 'vue';
import { listQuery, listDelete, listSelect } from '/@/comps/page/index';
import Edit from './edit.vue';
import request from '/@/utils/request';
import { useRoute } from 'vue-router';

const route = useRoute();


const editRef = ref() as any;
const state = reactive({
	url: '/ass/dict/data', loading: true, ids: [], dicts: [] as any,
	form: {} as any, single: true, multiple: true, list: [], total: 0,
});

onMounted(() => {
	state.form.maiid = route.query?.maiid;
	listQuery(state);
	dictsInit();
});


const dictsInit = async () => {
	state.dicts = await request({
		url: '/ass/dict/main/list',
		method: 'get',
	});
};


</script>

<style scoped>

</style>
