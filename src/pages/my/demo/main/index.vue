<template>
	<div>
		<el-card class='box-card'>
			<template #header>
				<div class='zjustify'>
					<div>
						<el-input v-model='state.form.name' placeholder='输入名称回车查询' class='list-search' clearable @keyup.enter='listQuery(state)' />
						<el-button type='primary' @click='listQuery(state)' plain>查 询</el-button>
						<el-button class='more-button' :icon='state.moreParams?ArrowUp:ArrowDown' plain @click='state.moreParams=!state.moreParams' />
					</div>
					<div>
						<el-button type='success' :icon='Plus' @click='openCateModal' plain>新增</el-button>
						<el-button type='danger' :icon='Delete' :disabled='state.multiple' @click='listDelete(state)' plain>删除</el-button>
					</div>
				</div>
				<div v-show='state.moreParams' class='more-params'>
					<el-form :inline='true' label-width='100px'>
						<el-form-item label='更多参数1'>
							<el-input v-model='state.form.xxx' placeholder='更多参数1' />
						</el-form-item>
						<el-form-item label='更多参数2'>
							<el-input v-model='state.form.yyy' placeholder='更多参数2' />
						</el-form-item>
						<el-form-item />
					</el-form>
				</div>
			</template>

			<el-table height='400' :cell-style="{padding:'2px'}" :row-style="{height: '36px'}"
								v-loading='state.loading' :data='state.list'
								border stripe @selection-change='listSelect($event,state)'>
				<el-table-column type='selection' width='55' align='center' />
				<el-table-column label='#' type='index' width='35' align='center' />
				<!--				<el-table-column label='DEMO编号' width='145'>-->
				<!--					<template #default='scope'>-->
				<!--						<span style='cursor:pointer;color: #3e9ece' @click='goView(scope.row)'>-->
				<!--							{{ scope.row.senum }}-->
				<!--						</span>-->
				<!--					</template>-->
				<!--				</el-table-column>-->
				<el-table-column label='DEMO名称' width='200'>
					<template #default='scope'>
						<span style='cursor:pointer;color: #3e9ece' @click='goView(scope.row)'>
							{{ scope.row.name }}
						</span>
					</template>
				</el-table-column>
				<!--				<el-table-column label='DEMO名称' prop='name' width='180' />-->
				<el-table-column label='DEMO分类' prop='catna' />
				<el-table-column label='申请人' prop='crman' width='66' />
				<el-table-column label='申请时间' prop='crtim' width='148' />
				<el-table-column label='送审时间' prop='uptim' width='148'>
					<template #default='scope'>
						<span v-show="scope.row.state!=='30'">{{ scope.row.uptim }}</span>
					</template>
				</el-table-column>
				<el-table-column label='状态' prop='state' width='60' header-align='center' align='center'>
					<template #default='scope'>
						<el-tag v-show="scope.row.state==='30'" type='success' size='small'>结束</el-tag>
						<el-tag v-show="scope.row.state==='20'" type='warning' size='small'>待审</el-tag>
						<el-tag v-show="scope.row.state==='11'" type='danger' size='small'>驳回</el-tag>
						<el-tag v-show="scope.row.state==='10'" size='small'>草稿</el-tag>
						<el-tag v-show="scope.row.state==='00'" type='info' size='small'>废弃</el-tag>
					</template>
				</el-table-column>
				<el-table-column label='当前环节' prop='facno' width='160' />
				<el-table-column label='当前处理人' prop='exmen' width='160' />
			</el-table>

			<el-pagination
				@size-change='listQuery(state)' @current-change='listQuery(state)'
				class='mt8' :pager-count='5' :page-sizes='[10, 20, 30]' background
				:total='state.total' v-model:current-page='state.form.page'
				v-model:page-size='state.form.pageSize'
				layout='total, sizes, prev, pager, next, jumper'
			/>
		</el-card>
		<CateModal url='my/demo/cate/treea' ref='cateModal' @close='cateChoose' />
	</div>
</template>
<script lang='ts'>
export default { name: 'MyDemoMain' };
</script>

<script lang='ts' setup>
import { Plus, Delete, ArrowDown, ArrowUp } from '@element-plus/icons-vue';
import { onMounted, reactive, ref } from 'vue';
import { listQuery, listDelete, tabAdd, tabAdd2, tabView, listSelect } from '/@/comps/page';
import CateModal from '/@/comps/gen/GenTreeModal.vue';
import router from '/@/router';

const state = reactive({
	url: '/my/demo/main', loading: true, ids: [],
	form: {}, single: true, multiple: true, list: [], total: 0,
});

onMounted(() => {
	listQuery(state);
});

const cateModal = ref();
const openCateModal = () => {
	cateModal.value.openModal();
};

const flush = async () => {
	await listQuery(state);
};

const cateChoose = async (node: any) => {
	if (node.type == 'm1') {
		await tabAdd(state.url, { catid: node.id }, { flush });
	} else if (node.type == 'm2') {
		await tabAdd2(state.url, { catid: node.id }, { flush });
	}
};

const goView = async (row: any) => {
	if (row.type == 'm1') {
		await tabView(state.url, row.id);
	} else if (row.type == 'm2') {
		await router.push({
			path: state.url + '/view2',
			query: { id: row.id },
		});
	}
};
</script>
