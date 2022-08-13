<template>
  <div>
    <el-card class='box-card'>

			<vxe-toolbar ref="xToolbar" custom>
				<template #buttons>
					<vxe-input v-model="tdata.filterName" placeholder="请输入名称" @keyup="searchEvent"></vxe-input>
					<vxe-button status="primary" @click="searchEvent">查 询</vxe-button>
					<vxe-button status="primary" @click="sync()">同 步</vxe-button>
					<vxe-button @click="editRef.openModal()">新 增</vxe-button>
					<vxe-button @click="$refs.xTree.setAllTreeExpand(true)">展 开</vxe-button>
					<vxe-button @click="$refs.xTree.clearTreeExpand()">折 叠</vxe-button>
				</template>
			</vxe-toolbar>

			<vxe-table ref="xTree" max-height="600" :loading="tdata.loading" :data="tdata.tableData" :tree-config="{children: 'children'}">
				<vxe-column field="name" title="本系统部门名称" tree-node>
					<template #default="{ row }">
						<span style="cursor:pointer;color: #3e9ece" @click="$refs.xTree.toggleTreeExpand(row)">{{ row.name }}</span>
					</template>
				</vxe-column>

				<vxe-column field="id" title="本系统部门ID" width="260">
				</vxe-column>

				<vxe-column field="ddid" title="钉钉部门ID" width="260">
				</vxe-column>

				<vxe-column field="uptim" title="更新时间" width="260">
				</vxe-column>

				<vxe-column title="操作" width="100" show-overflow header-align="center" align="right">
					<template #default="{ row }">
						<el-icon @click='editRef.openModal({pname:row.name,pid:row.id})' style="cursor: pointer;font-size: 18px;top:2px;margin-right: 8px;color: #52C41A">
							<circle-plus/>
						</el-icon>
						<el-icon @click='editRef.openModal({id:row.id})' style="cursor: pointer;font-size: 18px;top:2px;margin-right: 8px;color: #2874C5">
							<edit/>
						</el-icon>
						<el-icon @click="removeEvent(row.id)" style="cursor: pointer;font-size: 18px;top:2px;margin-right: 8px;color: #ED6F6F">
							<delete/>
						</el-icon>
					</template>
				</vxe-column>
			</vxe-table>
    </el-card>
    <CateEdit ref='editRef' @close='fetch()'/>
  </div>
</template>
<script lang='ts' setup>
import {Delete, Edit, CirclePlus} from '@element-plus/icons-vue';
import {onMounted, reactive, ref,nextTick} from 'vue';
import CateEdit from './edit.vue';
import {VXETable, VxeTableInstance, VxeToolbarInstance} from 'vxe-table';
import XEUtils from 'xe-utils'
import request from '/@/utils/request';
import { ElLoading, ElMessage } from 'element-plus';

// const state = reactive({
//   url: '/it/db/cate', loading: true, ids: [],
//   form: {}, single: true, multiple: true, list: [], total: 0,
// });

const editRef = ref() as any;

const xTree = ref({} as VxeTableInstance)
const xToolbar = ref({} as VxeToolbarInstance);

const tdata = reactive({
	filterName: '',
	loading: false,
	originData: [] as any,
	tableData: [] as any[],
	formData: {
		name: '',
	},
})

const handleSearch = () => {
	const filterName = XEUtils.toValueString(tdata.filterName).trim()
	if (filterName) {
		const options = {children: 'children'}
		const searchProps = ['name']
		tdata.tableData = XEUtils.searchTree(tdata.originData, item => searchProps.some(key => XEUtils.toValueString(item[key]).indexOf(filterName) > -1), options)
		nextTick(() => {
			const $table = xTree.value
			$table.setAllTreeExpand(true)
		})
	} else {
		tdata.tableData = tdata.originData
	}
}

const searchEvent = XEUtils.debounce(function () {
	handleSearch()
}, 500, {leading: false, trailing: true})

async function fetch() {
	tdata.originData = await request({
		url: '/dd/org/dept/tree',
		method: 'get',
	});
	handleSearch()
}

onMounted(async () => {
	await fetch();
	nextTick(() => {
		const $table = xTree.value
		const $toolbar = xToolbar.value
		$table.connect($toolbar)
	})
})

async function removeEvent(id:string){
	const type = await VXETable.modal.confirm('您确定要删除吗？');
	if (type === 'confirm') {
		await request({
			url: '/bi/report/cate/'+id,
			method: 'delete',
		});
		await fetch();
	}
}

const sync=async ()=>{

	const loading = ElLoading.service({
		lock: true,
		fullscreen: true,
		text:'正在进行OA部门同步到钉钉部门',
		background: 'rgba(0, 0, 0, 0.6)',
	});

	let isSuccess=true;

	await request({
		url: '/dd/org/dept/sync',
		method: 'post',
	}).catch(() => {
		isSuccess=false
	});

	if(isSuccess){
		ElMessage({
			showClose: true,
			message: '同步成功',
			type: 'success',
			duration:500
		})
		setTimeout(() => {
			loading.close();
		}, 500);
	}else{
		loading.close();
	}


}

</script>

<style scoped>

</style>
