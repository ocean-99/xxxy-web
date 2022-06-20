<template>
	<Wrap>
		<div class='p-left'>
			<NodeTree @node-click='nodeClick'/>
		</div>
		<div class='p-right'>
			<el-card class='box-card'>
				<template #header>
					<el-row>
						<el-col :span='14'>
							<el-input v-model='state.form.name' placeholder='输入名称回车查询' clearable class='list-search'
												@keyup.enter='listQuery(state)'/>
							<el-button type='primary' @click='listQuery(state)' :icon="Search" plain>查询</el-button>
							<el-button class='more-button' :icon='state.moreParams?ArrowUp:ArrowDown' plain @click='state.moreParams=!state.moreParams'/>
						</el-col>
						<el-col :span='10' style='text-align: right'>
							<el-button type='success' :icon='Plus' @click='drawer.open({pid:state.pid})' plain>新增</el-button>
							<el-button type='danger' :icon='Delete' :disabled='state.multiple' @click='listDelete(state)' plain>删除</el-button>
						</el-col>
					</el-row>
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

				<el-table height='400' :cell-style="{padding:'2px'}" :row-style="{height: '36px'}" v-loading='state.loading' :data='state.list'
									border stripe @selection-change='listSelect($event,state)'>
					<el-table-column type='selection' width='55' align='center'/>
					<el-table-column label='序号' type='index' width='55' align='center'/>
					<el-table-column label='层级节点名称' width='180'>
						<template #default='scope'>
							<span style='cursor:pointer;color: #3e9ece' @click='drawer.open({id:scope.row.id,pid:state.pid})'>{{ scope.row.name }}</span>
						</template>
					</el-table-column>
					<el-table-column label='备注' prop='notes'/>
					<el-table-column label='创建时间' prop='crtim' width='160'/>
					<el-table-column label='更新时间' prop='uptim' width='160'/>
				</el-table>

				<el-pagination
					@size-change='listQuery(state)' @current-change='listQuery(state)'
					class='mt8' :pager-count='5' :page-sizes='[10, 20, 30]' background
					:total='state.total' v-model:current-page='state.form.page' v-model:page-size='state.form.pageSize'
					layout='total, sizes, prev, pager, next, jumper'
				/>
			</el-card>
		</div>
		<NodeEdit ref='drawer' @nodeRefresh='nodeRefresh'/>
	</Wrap>
</template>
<script lang='ts'>
export default {name: 'SysOrgTierNode'};
</script>
<script lang='ts' setup>
import {Search,Plus, Delete, ArrowDown, ArrowUp} from '@element-plus/icons-vue';
import { onMounted, reactive, ref } from 'vue';
import {listQuery, listDelete, listSelect} from '/@/comps/page/index';
import Wrap from '/@/comps/page/Wrap.vue';
import NodeTree from './node_tree.vue';
import NodeEdit from './node_edit.vue';

const state = reactive({
	url: '/sys/org/tnode', loading: true, ids: [], moreParams: false,
	form: {} as any, single: true, multiple: true, list: [], total: 0,
});

onMounted(() => {
	listQuery(state);
});


//region a 左侧层级树点击
const nodeClick = async (node: any) => {
	state.form.pid = node.id;
	state.form.pname = node.name;
	await listQuery(state);
};
//endregion

const drawer = ref();

const nodeRefresh=async ()=>{
	await listQuery(state);
}

</script>

<style scoped>

</style>
