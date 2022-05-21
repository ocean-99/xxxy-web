<template>
	<div>
		<el-card class='box-card'>
			<template #header>
				<el-row>
					<el-col :span='14'>
						<el-input v-model='state.form.name' placeholder='输入名称回车查询' clearable class="list-search" @keyup.enter='treeQuery(state)' />
						<el-button type='primary' @click='treeQuery(state)' :icon="Search" plain>查询</el-button>
					</el-col>
					<el-col :span='10' style='text-align: right'>
						<el-button type='success' :icon='Plus' @click='drawer.open()' plain>新增</el-button>
						<el-button type='danger' :icon='Delete' :disabled='state.multiple' @click='treeDelete(state)' plain>删除</el-button>
					</el-col>
				</el-row>
			</template>

			<el-table ref='tableRef' row-key='id' :cell-style="{padding:'2px'}" :row-style="{height: '36px'}" v-loading='state.loading' :data='state.list'
								border stripe @selection-change='treeSelect($event,state)'
								:tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
				<el-table-column type='selection' width='55' align='center' />
				<el-table-column label='序号' type='index' width='55' align='center' />
				<el-table-column label='名称' width='250'>
					<template #default='scope'>
						<span style='cursor:pointer;color:#972fcb' @click='toggle(scope.row)'>{{ scope.row.name }}</span>
					</template>
				</el-table-column>
				<el-table-column label='类型' prop='type' width='60' header-align='center'>
					<template #default="scope">
						<el-tag v-show="scope.row.type==='D'" type="success" size="small">目录</el-tag>
						<el-tag v-show="scope.row.type==='M'" type="warning" size="small">菜单</el-tag>
						<el-tag v-show="scope.row.type==='B'" type="primary" size="small">按钮</el-tag>
					</template>
				</el-table-column>
				<el-table-column label='备注' prop='notes' />
				<el-table-column label='创建时间' prop='crtim' width='150' />
				<el-table-column label='更新时间' prop='uptim' width='150' />
				<el-table-column label='操作' width='105' header-align='center' align="right">
					<template #default="scope">
						<el-icon @click='drawer.open({pid:scope.row.id,pname:scope.row.name})' v-show="scope.row.type==='D'||scope.row.type==='M'" style="cursor: pointer;font-size: 18px;top:2px;margin-right: 8px;color: #52C41A"><circle-plus/></el-icon>
						<el-icon @click='drawer.open({id:scope.row.id})' style="cursor: pointer;font-size: 18px;top:2px;margin-right: 8px;color: #2874C5"><edit/></el-icon>
						<el-icon @click='treeItemDelete(state,scope.row.id)' style="cursor: pointer;font-size: 18px;top:2px;margin-right: 8px;color: #ED6F6F"><delete/></el-icon>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<DrawerEdit ref='drawer' @treeQuery='treeQuery(state)'/>
	</div>
</template>
<script lang='ts'>
export default { name: 'sysPermMenu' };
</script>
<script lang='ts' setup>
import {Search, Plus, Delete,Edit,CirclePlus } from '@element-plus/icons-vue';
import { onMounted, reactive, ref } from 'vue';
import { treeDelete,treeItemDelete,treeSelect,treeQuery } from '/@/comps/page/index';
import DrawerEdit from './edit.vue';
const drawer = ref();

const state = reactive({
	url: '/sys/perm/menu', loading: true, ids: [],
	form: {}, single: true, multiple: true, list: [], total: 0,
});

const tableRef = ref();

onMounted(() => {
	treeQuery(state);
});


const toggle=(row:any)=>{
	tableRef.value.toggleRowExpansion(row);
}

</script>

<style scoped>

</style>
