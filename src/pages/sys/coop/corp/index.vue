<template>
	<div>
		<el-card class='box-card'>
			<template #header>
        <div class='zjustify'>
          <div>
						<el-tree-select placeholder='请选择' default-expand-all :props="{value:'id',label:'name'}" v-model='state.form.catid' :data='state.cates'
														check-strictly style='width: 200px;margin-right: 10px;' clearable/>
            <el-input v-model='state.form.name' placeholder='输入名称回车查询' style='top:1px' clearable class='list-search' @keyup.enter='listQuery(state)' />
            <el-button type='primary' @click='listQuery(state)' plain>查 询</el-button>
          </div>
          <div>
            <el-button type='success' :icon='Plus' @click='drawer.open({catid:state.form.catid})' plain>新增</el-button>
            <el-button type='danger' :icon='Delete' :disabled='state.multiple' @click='listDelete(state)' plain>删除</el-button>
          </div>
        </div>
			</template>

			<el-table height='400' :cell-style="{padding:'2px'}" :row-style="{height: '36px'}" v-loading='state.loading' :data='state.list'
								border stripe @selection-change='listSelect($event,state)'>
				<el-table-column type='selection' width='55' align='center' />
				<el-table-column label='序号' type='index' width='55' align='center' />
				<el-table-column label='公司名称' width='180'>
					<template #default='scope'>
						<span style='cursor:pointer;color: #3e9ece' @click='drawer.open({id:scope.row.id})'>{{ scope.row.name }}</span>
					</template>
				</el-table-column>
				<el-table-column label='所属分类' prop='catna' />
				<el-table-column label='备注' prop='notes' />
				<el-table-column label='创建人' prop='crman' width='60' />
				<el-table-column label='创建时间' prop='crtim' width='148' />
				<el-table-column label='更新人' prop='upman' width='60' />
				<el-table-column label='更新时间' prop='uptim' width='148' />
			</el-table>

			<el-pagination
				@size-change='listQuery(state)' @current-change='listQuery(state)'
				class='mt8' :pager-count='5' :page-sizes='[10, 20, 30]' background
				:total='state.total' v-model:current-page='state.form.page' v-model:page-size='state.form.pageSize'
				layout='total, sizes, prev, pager, next, jumper'
			/>

		</el-card>
		<DrawerEdit ref='drawer' @listQuery='listQuery(state)' />
	</div>
</template>
<script lang='ts'>
export default { name: 'SysCoopCorp' };
</script>
<script lang='ts' setup>
import { Plus, Delete } from '@element-plus/icons-vue';
import { onMounted, reactive, ref } from 'vue';
import { listQuery, listDelete, listSelect } from '/@/comps/page/index';
import DrawerEdit from './edit.vue';
import request from '/@/utils/request';

const drawer = ref();

const state = reactive({
	url: '/sys/coop/corp', loading: true, ids: [], cates: [] as any,
	form: {}, single: true, multiple: true, list: [] as any, total: 0,cupage:true
});

onMounted(() => {
	listQuery(state);
	catesInit();
});


const catesInit = async () => {
	state.cates = await request({
		url: '/sys/coop/cate/treea',
		method: 'get',
	});
};

const select2Show = (info: any, value: any) => {
	for (const item of state[info]) {
		if (item.id == value) {
			return item.name;
		}
		if (item.children) {
			for (const item2 of item.children) {
				if (item2.id == value) {
					return item2.name;
				}
				if (item2.children) {
					for (const item3 of item2.children) {
						if (item3.id == value) {
							return item3.name;
						}
						if (item3.children) {
							for (const item4 of item3.children) {
								if (item4.id == value) {
									return item4.name;
								}
							}
						}
					}
				}
			}
		}
	}
};
</script>
