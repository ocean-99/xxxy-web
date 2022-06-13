<template>
	<div>
		<el-card class='box-card'>
			<template #header>
				<el-row>
					<el-col :span='14'>
						<el-input v-model='state.form.name' placeholder='输入名称回车查询' clearable class='list-search' @keyup.enter='listQuery()' />
						<el-button type='primary' @click='listQuery()' :icon='Search' plain>查询</el-button>
					</el-col>
					<el-col :span='10' style='text-align: right'>
						<!--						<el-button type='warning' :icon='Delete' @click='listDelete(state)' plain>删除</el-button>-->
						<!--						<el-button type='danger' :icon='Delete' @click='listDeleteAll()' plain>清空</el-button>-->
					</el-col>
				</el-row>
			</template>

			<el-table height='400' :cell-style="{padding:'2px'}" :row-style="{height: '36px'}" v-loading='state.loading' :data='state.list'
								border stripe @selection-change='listSelect($event,state)'>
				<el-table-column type='selection' width='55' align='center' />
				<el-table-column label='序号' type='index' width='55' align='center' />
				<el-table-column label='用户姓名' width='100' prop='name' />
				<el-table-column label='用户账号' prop='usnam' width='100' />
				<el-table-column label='登录时间' prop='crtim' width='180'/>
				<el-table-column label='登录IP' prop='ip' width='120' />
				<el-table-column label='登录地点' prop='addre' width='160' />
				<el-table-column label='操作系统' prop='ageos' width='150' />
				<el-table-column label='浏览器' prop='agbro' />
        <el-table-column label='强退' prop='notes' width='46' align='center'>
          <template #default='scope'>
            <el-icon :size='20' style='top:3px;color: green;cursor: pointer' @click='kickOut(scope.row.onkey)'  title="强退">
              <Football />
            </el-icon>
          </template>
        </el-table-column>
			</el-table>

			<el-pagination
				@size-change='pageChange' @current-change='pageChange'
				class='mt8' :pager-count='5' :page-sizes='[10, 20, 30]' background
				:total='state.total' v-model:current-page='state.form.page' v-model:page-size='state.form.pageSize'
				layout='total, sizes, prev, pager, next, jumper'
			/>
		</el-card>
	</div>
</template>
<script lang='ts'>
export default { name: 'MonLogLogin' };
</script>
<script lang='ts' setup>
import { Search ,Football} from '@element-plus/icons-vue';
import { onMounted, reactive } from 'vue';
import { listSelect } from '/@/comps/page';
import request from '/@/utils/request';
import {ElMessageBox} from "element-plus";


const state = reactive({
	url: '/mon/online/user', loading: true, ids: [], totalList: [] as any,
	form: { page: 1, pageSize: 10 }, single: true, multiple: true, list: [], total: 0,
});

onMounted(() => {
	listQuery();
});

async function listQuery() {
	state.totalList = await request({
		url: state.url+"/list",
		method: 'get',
		params: state.form,
	});
	state.total = state.totalList.length;
	state.loading = false;
	state.list = state.totalList.slice(
		(state.form.page - 1) * state.form.pageSize,
		state.form.pageSize * state.form.pageSize,
	);
}

const pageChange = () => {
	state.list = state.totalList.slice(
		(state.form.page - 1) * state.form.pageSize,
		state.form.pageSize * state.form.pageSize,
	);
}

const kickOut = async (onkey: string) => {
  ElMessageBox.confirm('确定要强退用户吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info',
  }).then(async () => {
    await request({
      url: state.url + '/close',
      method: 'post',
      params:{onkey:onkey}
    });
    await listQuery();
  });
};


</script>

<style scoped>

</style>
