<template>
	<div>
		<el-card class='box-card'>
			<template #header>
				<div class='zjustify'>
					<div>
						<el-input v-model='state.form.name' placeholder='输入名称回车查询' clearable class='list-search' @keyup.enter='listQuery(state)' />
						<el-button type='primary' :icon='Search' @click='listQuery(state)' plain>查询</el-button>
						<el-button class='more-button' :icon='state.moreParams?ArrowUp:ArrowDown' plain @click='state.moreParams=!state.moreParams' />
						<span style='margin-left: 10px;color: red'>可切换登录用户，模拟流程流转</span>
					</div>
					<div>
						<el-button type='success' :icon='Plus' @click='openFlowModal()' plain>新增</el-button>
						<el-button type='danger' :icon='Delete' :disabled='state.multiple' @click='listDelete(state)' plain>删除</el-button>
					</div>
				</div>
				<div v-show='state.moreParams' class='more-params'>
					<el-form :inline='true' label-width='100px'>
						<el-form-item label='更多参数1'>
							<el-input v-model='state.form.notes' placeholder='更多参数1' />
						</el-form-item>
						<el-form-item label='更多参数2'>
							<el-input v-model='state.form.xx' placeholder='更多参数2' />
						</el-form-item>
						<el-form-item />
					</el-form>
				</div>
			</template>
			<FlowModal ref='flowModalRef' @close='closeFlowModal' />
			<TmplModal url='oa/flow/tmpl/tree' ref='tmplModal' />

			<el-table height='400' :cell-style="{padding:'2px'}" :row-style="{height: '36px'}" v-loading='state.loading' :data='state.list'
								border stripe @selection-change='listSelect($event,state)'>
				<el-table-column type='selection' width='55' align='center' />
				<el-table-column label='序号' type='index' width='55' align='center' />
				<el-table-column label='流程主题' width='200'>
					<template #default='scope'>
						<span style='cursor:pointer;color: #3e9ece' @click='pageView("ofmv?id="+scope.row.id)'>{{ scope.row.name }}</span>
					</template>
				</el-table-column>
				<el-table-column label='所属模板' prop='temna' />
				<!--				<el-table-column label='备注' prop='notes' />-->
				<el-table-column label='申请人' prop='crman' width='76' />
				<el-table-column label='申请时间' prop='crtim' width='150' />
				<el-table-column label='送审时间' prop='uptim' width='150'>
					<template #default='scope'>
						<span v-show="scope.row.state!=='30'">{{ scope.row.uptim }}</span>
					</template>
				</el-table-column>
				<el-table-column label='状态' prop='state' width='60' header-align='center' align='center'>
					<template #default='scope'>
						<el-tag v-show="scope.row.state==='30'" type='success' size='small'>结束</el-tag>
						<el-tag v-show="scope.row.state==='20'" type='warning' size='small'>待审</el-tag>
						<el-tag v-show="scope.row.state==='11'" type='danger' size='small'>驳回</el-tag>
						<el-tag v-show="scope.row.state==='10'" type='primary' size='small'>草稿</el-tag>
						<el-tag v-show="scope.row.state==='00'" type='info' size='small'>废弃</el-tag>
					</template>
				</el-table-column>
				<el-table-column label='当前环节' prop='facno' width='160' />
				<el-table-column label='当前处理人' prop='exmen' width='160' />
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
<!--<script lang="ts">-->
<!--export default {name: 'OaFlowMain'}-->
<!--</script>-->
<script lang='ts' setup>
import { Search, Plus, Delete, ArrowDown, ArrowUp } from '@element-plus/icons-vue';
import { onMounted, reactive, ref } from 'vue';
import { listQuery, listDelete, listSelect, pageView } from '/@/comps/page/index';
import TmplModal from '/@/comps/gen/GenTreeModal.vue';
import FlowModal from './FlowModal.vue';

const state = reactive({
	url: '/oa/flow/main', loading: true, ids: [], moreParams: false,
	form: {}, single: true, multiple: true, list: [], total: 0,
});

onMounted(() => {
	listQuery(state);
});


//分类弹框逻辑
// const tmplModal = ref();
// const openTmplModal = () => {
// 	tmplModal.value.openModal();
// };
// const tmplModalClose=(node:any)=>{
//   if(node.type=="tmpl"){
//     window.open("#/page/ofme?tmpid="+node.id);
//   }else if(node.type=="cate"){
//     ElMessage.info("当前选择的是流程分类，请选择最下级的流程模板节点，比如请假申请");
//   }
// }

//弹框逻辑
const flowModalRef = ref();
const openFlowModal = () => {
	flowModalRef.value.openModal();
};
const closeFlowModal = (node: any) => {
	setTimeout(() => {
		if (node && node.id) {
			window.open('#/page/ofme?tmpid=' + node.id);
		}
	}, 50);
};


</script>

<style scoped>

</style>
