<template>
	<div>
		<el-card class='box-card'>
			<template #header>
				<el-row>
					<el-col :span='14'>
						<el-input v-model='state.form.name' placeholder='输入名称回车查询' clearable class="list-search" @keyup.enter='listQuery(state)' />
						<el-button type='primary' @click='listQuery(state)' plain>查 询</el-button>
					</el-col>
					<el-col :span='10' style='text-align: right'>
						<el-button type='success' :icon='Plus' @click='tabAdd(state.url)' plain>新增</el-button>
						<el-button :disabled='state.multiple' @click='startEvent(state)' plain>启 用</el-button>
						<el-button :disabled='state.multiple' @click='stopEvent(state)' plain>禁 用</el-button>
						<el-button type='danger' :icon='Delete' :disabled='state.multiple' @click='listDelete(state)' plain>删除</el-button>
					</el-col>
				</el-row>
			</template>

			<el-table height='400' :cell-style="{padding:'2px'}" :row-style="{height: '36px'}" v-loading='state.loading' :data='state.list'
								border stripe @selection-change='listSelect($event,state)'>
				<el-table-column type='selection' width='55' align='center' />
				<el-table-column label='序号' type='index' width='55' align='center' />
				<el-table-column label='任务名称' width='180'>
					<template #default='scope'>
						<span style='cursor:pointer;color: #3e9ece' @click='tabEdit(state.url,scope.row.id)'>{{ scope.row.name }}</span>
					</template>
				</el-table-column>
				<el-table-column label='任务代码' prop='code' width='200' />
				<el-table-column label='请求地址' prop='reurl' width='200' />
				<el-table-column label='执行表达式' prop='cron' width='200' />
				<el-table-column label='更新时间' prop='crtim' width='160' />
				<el-table-column label='状态' prop='crtim' width='60'>
					<template #default='scope'>
						<span v-show='scope.row.avtag===true'>启用</span>
						<span v-show='scope.row.avtag===false'>禁用</span>
					</template>
				</el-table-column>
				<el-table-column label='备注' prop='notes' />
				<el-table-column label='操作' prop='notes' width='56'>
					<template #default='scope'>
						<el-icon :size='20' style='top:3px;color: green;cursor: pointer' @click='doOnce(scope.row.id)'  title="立即执行一次">
							<video-play />
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
	</div>
</template>
<script lang='ts'>
export default { name: 'sysJobMain' };
</script>
<script lang='ts' setup>
import { Plus, Delete, VideoPlay } from '@element-plus/icons-vue';
import { onMounted, reactive } from 'vue';
import { listQuery, listDelete, tabAdd, tabEdit, listSelect } from '/@/comps/page/index';
import { ElMessage, ElMessageBox } from 'element-plus';
import request from '/@/utils/request';

const state = reactive({
	url: '/sys/job/main', loading: true, ids: [],
	form: {}, single: true, multiple: true, list: [], total: 0,
});

onMounted(() => {
	listQuery(state);
});


async function startEvent(state: any) {
	const selIds = state.ids.join(',');
	if (selIds.length <= 0) {
		ElMessage.warning('请选择后再进行启动');
		return;
	}
	ElMessageBox.confirm('确认要启动选择项吗?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'info',
	})
		.then(async () => {
			await request({
				url: state.url + '/start/' + selIds,
				method: 'post',
			});
			await listQuery(state);
		})
		.catch(() => ElMessage.info('已取消启动'));
}


async function stopEvent(state: any) {
	const selIds = state.ids.join(',');
	if (selIds.length <= 0) {
		ElMessage.warning('请选择后再进行关闭');
		return;
	}
	ElMessageBox.confirm('确认要关闭选择项吗?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'info',
	})
		.then(async () => {
			await request({
				url: state.url + '/stop/' + selIds,
				method: 'post',
			});
			await listQuery(state);
		})
		.catch(() => ElMessage.info('已取消关闭'));
}


const doOnce = async (id: string) => {
	ElMessageBox.confirm('确定立即执行一次吗？', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'info',
	}).then(async () => {
		await request({
			url: state.url + '/once/' + id,
			method: 'post',
		});
	});
};


</script>

<style scoped>

</style>
