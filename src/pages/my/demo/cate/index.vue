<template>
	<div>
		<el-card class='box-card'>
			<vxe-toolbar ref='toolbarRef' custom>
				<template #buttons>
					<vxe-input v-model='state.filterName' placeholder='请输入名称' @keyup='treeSearch'/>
					<vxe-button status='primary' @click='treeSearch'>查 询</vxe-button>
					<vxe-button @click='tabAdd(state.url)'>新 增</vxe-button>
					<vxe-button @click='tableRef.setAllTreeExpand(true)'>展 开</vxe-button>
					<vxe-button @click='tableRef.clearTreeExpand()'>折 叠</vxe-button>
				</template>
			</vxe-toolbar>
			<vxe-table ref='tableRef' max-height='600' :loading='state.loading' :data='state.list' :tree-config="{children: 'children'}">
				<vxe-column field='name' title='分类名称' tree-node width='250'>
					<template #default='{ row }'>
						<span style='cursor:pointer;color: #3e9ece' @click='tabEdit(state.url,row.id)'>{{ row.name }}</span>
					</template>
				</vxe-column>
				<vxe-column field='crtim' title='创建时间' width='160' />
				<vxe-column field='uptim' title='更新时间' width='160' />
				<vxe-column field='notes' title='备注' />
				<vxe-column title='操作' width='100' show-overflow header-align='center' align='right'>
					<template #default='{ row }'>
						<el-icon @click='tabAdd(state.url,{pid:row.id,pname:row.name})' style='cursor: pointer;font-size: 18px;top:2px;margin-right: 8px;color: #52C41A'>
							<CirclePlus />
						</el-icon>
						<el-icon @click='tabEdit(state.url,row.id)' style='cursor: pointer;font-size: 18px;top:2px;margin-right: 8px;color: #2874C5'>
							<Edit />
						</el-icon>
						<el-icon @click='vTreeDelete(state,tableRef,row.id)' style='cursor: pointer;font-size: 18px;top:2px;margin-right: 8px;color: #ED6F6F'>
							<Delete />
						</el-icon>
					</template>
				</vxe-column>
			</vxe-table>
		</el-card>
	</div>
</template>
<script lang='ts' setup>
import { Delete, Edit, CirclePlus } from '@element-plus/icons-vue';
import { onMounted, reactive, ref, nextTick } from 'vue';
import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table';
import { tabAdd,tabEdit} from '/@/comps/page/index';
import { vTreeQuery, vTreeFetch, vTreeDelete } from '/@/comps/vxe';
import XEUtils from 'xe-utils';

const state = reactive({
	url: '/my/demo/cate', form: {},
	filterName: '', loading: false, odata: [] as any, list: [] as any[],
});

const tableRef = ref({} as VxeTableInstance);
const toolbarRef = ref({} as VxeToolbarInstance);

const treeSearch = XEUtils.debounce(async () => {
	await vTreeQuery(state, tableRef.value);
}, 500, { leading: false, trailing: true });

onMounted(async () => {
	await vTreeFetch(state, tableRef.value);
	await nextTick(() => {
		tableRef.value.connect(toolbarRef.value);
	});
});

</script>
