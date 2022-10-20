<template>
	<div>
		<el-card class='box-card'>
			<template #header>
				<div class='zjustify'>
					<div>
						<el-input v-model='state.filterName' placeholder='输入名称回车查询' clearable class='list-search'
											@keyup.enter='treeSearch'/>
						<el-button type='primary' @click='treeSearch' :icon='Search' plain>查询</el-button>
						<el-button type='primary' @click='tableRef.setAllTreeExpand(true)' :icon='SortDown' plain>展开</el-button>
						<el-button type='primary' @click='tableRef.clearTreeExpand()' :icon='SortUp' plain>折叠</el-button>
						<el-button type='warning' :icon='Operation' @click='changeIndex()' plain>切换维护方式</el-button>
					</div>
					<div>
						<el-button type='success' :icon='Plus' @click='editRef.open()' plain>新增</el-button>
					</div>
				</div>
			</template>
			<vxe-table ref='tableRef' max-height='600' :loading='state.loading' :data='state.list' :tree-config="{children: 'children'}">
				<vxe-column field='name' title='部门名称' tree-node width='250'>
					<template #default='{ row }'>
						<span style='cursor:pointer;color: #3e9ece' @click='tableRef.toggleTreeExpand(row)'>{{ row.name }}</span>
					</template>
				</vxe-column>
				<vxe-column field='crtim' title='创建时间' width='160' />
				<vxe-column field='uptim' title='更新时间' width='160' />
				<vxe-column field='notes' title='备注' />
				<vxe-column title='操作' width='100' show-overflow header-align='center' align='right'>
					<template #default='{ row }'>
						<el-icon @click='editRef.open({pname:row.name,pid:row.id})' style='cursor: pointer;font-size: 18px;top:2px;margin-right: 8px;color: #52C41A'>
							<CirclePlus />
						</el-icon>
						<el-icon @click='editRef.open({id:row.id})' style='cursor: pointer;font-size: 18px;top:2px;margin-right: 8px;color: #2874C5'>
							<Edit />
						</el-icon>
						<el-icon @click='vTreeDelete(state,tableRef,row.id)' style='cursor: pointer;font-size: 18px;top:2px;margin-right: 8px;color: #ED6F6F'>
							<Delete />
						</el-icon>
					</template>
				</vxe-column>
			</vxe-table>
		</el-card>
		<Medit ref='editRef' @close='vTreeFetch(state, tableRef)' />
	</div>
</template>
<script lang='ts'>
export default { name: 'SysOrgDeptTindex' };
</script>
<script lang='ts' setup>
import { Delete, Edit, CirclePlus, Plus, Search, SortDown, SortUp, Operation } from '@element-plus/icons-vue';
import { onMounted, reactive, ref, getCurrentInstance } from 'vue';
import { VxeTableInstance } from 'vxe-table';
import { vTreeQuery, vTreeFetch, vTreeDelete } from '/@/comps/vxe';
import XEUtils from 'xe-utils';
import { useRoute } from 'vue-router';
import router from '/@/router';
import Medit from './medit.vue';

const state = reactive({
	url: '/sys/org/dept', form: {},
	filterName: '', loading: false, odata: [] as any, list: [] as any[],
});

const tableRef = ref({} as VxeTableInstance);
const editRef = ref() as any;

const treeSearch = XEUtils.debounce(async () => {
	await vTreeQuery(state, tableRef.value);
}, 500, { leading: false, trailing: true });

onMounted(async () => {
	await vTreeFetch(state, tableRef.value);
});

const { proxy } = getCurrentInstance() as any;
const route = useRoute();
const changeIndex = async () => {
	proxy.mittBus.emit('onCurrentContextmenuClick', Object.assign({}, { contextMenuClickId: 1, ...route }));
	await router.push({
		path: state.url,
	});
};

</script>
