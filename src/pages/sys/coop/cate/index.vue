<template>
	<div>
		<el-card class='box-card'>
			<vxe-toolbar ref='xToolbar' custom>
				<template #buttons>
					<vxe-input v-model='state.filterName' placeholder='请输入名称' @keyup='searchEvent'></vxe-input>
					<vxe-button status='primary' @click='searchEvent'>查 询</vxe-button>
					<vxe-button @click='drawer.open({})'>新 增</vxe-button>
					<vxe-button @click='$refs.xTree.setAllTreeExpand(true)'>展 开</vxe-button>
					<vxe-button @click='$refs.xTree.clearTreeExpand()'>折 叠</vxe-button>
				</template>
			</vxe-toolbar>
			<vxe-table ref='xTree' max-height='600' :loading='state.loading' :data='state.tableData' :tree-config="{children: 'children'}">
				<vxe-column field='name' title='分类名称' tree-node width='250'>
					<template #default='{ row }'>
						<span style='cursor:pointer;color: #3e9ece' @click='$refs.xTree.toggleTreeExpand(row)'>{{ row.name }}</span>
					</template>
				</vxe-column>
				<vxe-column field='notes' title='备注' />
				<vxe-column field='crtim' title='创建时间' width='160' />
<!--				<vxe-column field='crman' title='创建人' width='100' />-->
				<vxe-column field='uptim' title='更新时间' width='160' />
<!--				<vxe-column field='upman' title='更新人' width='100' />-->
				<vxe-column title='操作' width='100' show-overflow header-align='center' align='right'>
					<template #default='{ row }'>
						<el-icon @click='drawer.open({porid:state.form.porid,pid:row.id,pname:row.name})' style='cursor: pointer;font-size: 18px;top:2px;margin-right: 8px;color: #52C41A'>
							<circle-plus />
						</el-icon>
						<el-icon @click='drawer.open({id:row.id})' style='cursor: pointer;font-size: 18px;top:2px;margin-right: 8px;color: #2874C5'>
							<edit />
						</el-icon>
						<el-icon @click='removeEvent(row.id)' style='cursor: pointer;font-size: 18px;top:2px;margin-right: 8px;color: #ED6F6F'>
							<delete />
						</el-icon>
					</template>
				</vxe-column>
			</vxe-table>
		</el-card>
		<DrawerEdit ref='drawer' @treeQuery='fetch()' />
	</div>
</template>
<script lang='ts'>
export default { name: 'SysCoopCate' };
</script>
<script lang='ts' setup>
import { Delete, Edit, CirclePlus } from '@element-plus/icons-vue';
import { onMounted, reactive, ref, nextTick } from 'vue';
import DrawerEdit from './edit.vue';
import { VXETable, VxeTableInstance, VxeToolbarInstance } from 'vxe-table';
import XEUtils from 'xe-utils';
import request from '/@/utils/request';

const state = reactive({
	url: '/sys/coop/cate', ids: [],
	form: {},
	filterName: '', loading: false, originData: [] as any, tableData: [] as any[],
});

const drawer = ref();

const xTree = ref({} as VxeTableInstance);
const xToolbar = ref({} as VxeToolbarInstance);

const handleSearch = () => {
	const filterName = XEUtils.toValueString(state.filterName).trim();
	if (filterName) {
		const options = { children: 'children' };
		const searchProps = ['name'];
		state.tableData = XEUtils.searchTree(state.originData, item => searchProps.some(key => XEUtils.toValueString(item[key]).indexOf(filterName) > -1), options);
		nextTick(() => {
			const $table = xTree.value;
			$table.setAllTreeExpand(true);
		});
	} else {
		state.tableData = state.originData;
	}
};

const searchEvent = XEUtils.debounce(function() {
	handleSearch();
}, 500, { leading: false, trailing: true });

async function fetch() {
	state.originData = await request({
		url: '/sys/coop/cate/tree',
		method: 'get',
		params: state.form,
	});
	handleSearch();
}

onMounted(async () => {
	await fetch();
	await nextTick(() => {
		const $table = xTree.value;
		const $toolbar = xToolbar.value;
		$table.connect($toolbar);
	});
});

async function removeEvent(id: string) {
	const type = await VXETable.modal.confirm('您确定要删除吗？');
	if (type === 'confirm') {
		await request({
			url: '/sys/coop/cate/' + id,
			method: 'delete',
		});
		await fetch();
	}
}
</script>
