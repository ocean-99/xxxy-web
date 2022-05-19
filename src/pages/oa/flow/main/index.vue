<template>
	<div>
		<el-card class='box-card'>
			<template #header>
				<el-row>
					<el-col :span='14'>
						<el-input v-model='state.form.name' placeholder='输入名称回车查询' clearable class="list-search" @keyup.enter='listQuery(state)' />
						<el-button type='primary' @click='listQuery(state)' plain>查 询</el-button>
            <span style="margin-left: 10px;color: green">流程测试：张三账号z3,李四账号l4,王五账号w5,赵六账号zhao6。密码都是1</span>
<!--						<el-button class='more-button' :icon='state.moreParams?ArrowUp:ArrowDown' plain @click='state.moreParams=!state.moreParams'>更多</el-button>-->
					</el-col>
					<el-col :span='10' style='text-align: right'>
						<el-button type='success' :icon='Plus' @click='openFlowModal()' plain>新增</el-button>
						<el-button type='danger' :icon='Delete' :disabled='state.multiple' @click='listDelete(state)' plain>删除</el-button>
					</el-col>
				</el-row>
				<div v-show='state.moreParams' class='more-params'>
					<el-form :inline='true' label-width='100px'>
						<el-form-item label='备注'>
							<el-input v-model='state.form.notes' placeholder='输入备注' />
						</el-form-item>
						<el-form-item label='xxxxx'>
							<el-input v-model='state.form.xx' />
						</el-form-item>
						<el-form-item />
					</el-form>
				</div>
			</template>
			<FlowModal ref='flowModalRef' @close='closeFlowModal'/>
			<TempModal url='oa/flow/temp/tree' ref='tempModal' />

			<el-table height='400' :cell-style="{padding:'2px'}" :row-style="{height: '36px'}" v-loading='state.loading' :data='state.list'
								border stripe @selection-change='listSelect($event,state)'>
				<el-table-column type='selection' width='55' align='center' />
				<el-table-column label='序号' type='index' width='55' align='center' />
				<el-table-column label='流程名称' width='180'>
					<template #default='scope'>
						<span style='cursor:pointer;color: #3e9ece' @click='pageView("ofmv?id="+scope.row.id)'>{{ scope.row.name }}</span>
					</template>
				</el-table-column>
				<el-table-column label='所属模板' prop='temna' />
				<el-table-column label='备注' prop='notes' />
				<el-table-column label='申请人' prop='crman' width='76' />
				<el-table-column label='申请时间' prop='crtim' width='160' />
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
<script lang="ts">
export default {name: 'oaFlowMain'}
</script>
<script lang='ts' setup>
import { Plus, Delete,ArrowDown, ArrowUp } from '@element-plus/icons-vue';
import { onMounted, reactive, ref } from 'vue';
import { listQuery, listDelete, listSelect,pageView} from '/@/comps/page/index';
import TempModal from '/@/comps/gen/GenModal.vue';
import FlowModal from './FlowModal.vue';

const state = reactive({
	url: '/oa/flow/main', loading: true, ids: [],	moreParams: false,
	form: {}, single: true, multiple: true, list: [], total: 0,
});

onMounted(() => {
	listQuery(state);
});



//分类弹框逻辑
// const tempModal = ref();
// const openTempModal = () => {
// 	tempModal.value.openModal();
// };
// const tempModalClose=(node:any)=>{
//   if(node.type=="temp"){
//     window.open("#/page/ofme?temid="+node.id);
//   }else if(node.type=="cate"){
//     ElMessage.info("当前选择的是流程分类，请选择最下级的流程模板节点，比如请假申请");
//   }
// }

//弹框逻辑
const flowModalRef = ref();
const openFlowModal = () => {
	flowModalRef.value.openModal();
};
const closeFlowModal=(node:any)=>{
  setTimeout(() => {
    if(node&&node.id){
      window.open("#/page/ofme?temid="+node.id);
    }
  }, 50);
}


</script>

<style scoped>

</style>
