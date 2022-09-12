<template>
	<Wrap>
		<div class='p-left'>
			<DeptTree @node-click='nodeClick' />
		</div>
		<div class='p-right'>
			<el-card class='box-card'>
				<template #header>
					<div class='zjustify'>
						<div>
							<el-input v-model='state.form.name' placeholder='输入名称回车查询' clearable class='list-search' @keyup.enter='listQuery(state)' />
							<el-button type='primary' @click='listQuery(state)' :icon='Search' plain>查询</el-button>
							<el-button class='more-button' :icon='state.moreParams?ArrowUp:ArrowDown' plain @click='state.moreParams=!state.moreParams' />
						</div>
						<div>
							<el-button type='success' :icon='Plus' @click='editRef.open({depid:state.form.depid,depna:state.form.depna})' plain>新增 [弹框]</el-button>
							<el-button type='success' :icon='Plus' @click='tabAdd(state.url,{depid:state.form.depid,depna:state.form.depna},{flush})' plain>
								新增 [页签]
							</el-button>
							<el-button type='danger' :icon='Delete' :disabled='state.multiple' @click='listDelete(state)' plain>删除</el-button>
						</div>
					</div>
					<div v-show='state.moreParams' class='more-params'>
						<el-form :inline='true' label-width='100px'>
							<el-form-item label='用户工号'>
								<el-input v-model='state.form.usnam' placeholder='用户工号' style='width:120px' />
							</el-form-item>
							<el-form-item label='用户昵称'>
								<el-input v-model='state.form.ninam' placeholder='用户昵称' style='width:120px' />
							</el-form-item>
							<el-form-item label='手机号'>
								<el-input v-model='state.form.monum' placeholder='手机号' style='width:120px' />
							</el-form-item>
							<el-form-item />
						</el-form>
					</div>
				</template>

				<el-table height='400' :cell-style="{padding:'2px'}" :row-style="{height: '36px'}" v-loading='state.loading' :data='state.list'
									border stripe @selection-change='listSelect($event,state)'>
					<el-table-column type='selection' width='55' align='center' />
					<el-table-column label='序号' type='index' width='55' align='center' />
					<el-table-column label='用户名称' width='180'>
						<template #default='scope'>
							<span style='cursor:pointer;color: #3e9ece' @click='editRef.open({id:scope.row.id})'>{{ scope.row.name }}</span>
						</template>
					</el-table-column>
					<el-table-column label='备注' prop='notes' />
					<el-table-column label='创建时间' prop='crtim' width='160' />
					<el-table-column label='更新时间' prop='uptim' width='160' />
					<el-table-column label='操作' width='80' header-align='center' align='center'>
						<template #default='scope'>
							<el-icon @click='tabEdit(state.url,scope.row.id)' style='cursor: pointer;font-size: 18px;top:2px;margin-left: 11px;color: #2874C5'>
								<Edit />
							</el-icon>
							<el-icon @click='listItemDelete(state,scope.row.id)' style='cursor: pointer;font-size: 18px;top:2px;margin-left: 10px;color: #ED6F6F'>
								<Delete />
							</el-icon>
						</template>
					</el-table-column>
				</el-table>

				<el-pagination
					@size-change='listQuery(state)' @current-change='listQuery(state)'
					class='mt8' :pager-count='5' :page-sizes='[10, 20, 30]' background
					:total='state.total' v-model:current-page='state.form.page' v-model:page-size='state.form.pageSize'
					layout='total, sizes, prev, pager, next, jumper'
				/>

			</el-card>
			<Medit ref='editRef' @close='listQuery(state)' />
		</div>
	</Wrap>
</template>
<script lang='ts'>
export default { name: 'SysOrgUser' };
</script>
<script lang='ts' setup>
import { Search, Plus, Delete, ArrowDown, ArrowUp, Edit } from '@element-plus/icons-vue';
import { onMounted, reactive, ref } from 'vue';
import { listQuery, listDelete, listSelect, tabAdd, tabEdit, listItemDelete } from '/@/comps/page/index';
import Wrap from '/@/comps/page/Wrap.vue';
import DeptTree from '/@/comps/sys/DeptTree.vue';
import Medit from './medit.vue';

const state = reactive({
	url: '/sys/org/user', loading: true, ids: [], moreParams: false,
	form: {} as any, single: true, multiple: true, list: [], total: 0,
});

const editRef = ref() as any;

onMounted(() => {
	listQuery(state);
});

const flush = async () => {
	await listQuery(state);
};

//region a 左侧部门树点击
const nodeClick = async (node: any) => {
	state.form.depid = node.id;
	state.form.depna = node.name;
	await listQuery(state);
};
//endregion
</script>
