<template>
	<div>
		<el-card class='box-card'>
			<template #header>
				<div class='zjustify'>
					<div>
						<el-input v-model='state.form.name' placeholder='输入名称回车查询' class='list-search' clearable @keyup.enter='listQuery(state)' />
						<!--						<el-button type='primary' @click='chooseAddr()' plain>地图弹框</el-button>-->
						<el-button type='primary' @click='listQuery(state)' plain v-waves='purple'>查 询</el-button>
						<el-button class='more-button' :icon='state.moreParams?ArrowUp:ArrowDown' plain @click='state.moreParams=!state.moreParams' />
						<span style='margin-left: 10px;color: red'>数据通过高德API拉取</span>
					</div>
					<div>
<!--						<el-button type='success' :icon='Plus' @click='tabAdd(state.url)' plain>新增</el-button>-->
						<el-button type='info' :icon='Upload' @click='listImp' plain>导入</el-button>
						<el-button type='info' :icon='Download' plain @click='listExp' >导出</el-button>
						<el-button type='warning' :icon='Lightning' @click='dataAsync()' plain>高德同步</el-button>
						<el-button type='danger' :icon='Delete' :disabled='state.multiple' @click='listDelete(state)' plain>删除</el-button>
					</div>
				</div>
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

			<el-table height='400' :cell-style="{padding:'2px'}" :row-style="{height: '36px'}"
								v-loading='state.loading' :data='state.list'
								border stripe @selection-change='listSelect($event,state)'>
				<el-table-column type='selection' width='55' align='center' />
				<el-table-column label='序号' type='index' width='55' align='center' />
				<el-table-column label='地址编码' width='162'>
					<template #default='scope'>
						<span style='cursor:pointer;color: #3e9ece' @click='chooseAddr2(scope.row.cecoo)'>
							{{ scope.row.id }}
						</span>
					</template>
				</el-table-column>
				<el-table-column label='地址名称' prop='name' width='150' />
				<el-table-column label='所属地区' prop='p2name' width='150' />
				<el-table-column label='所属城市' prop='p3name' width='150' />
				<el-table-column label='所属省份' prop='p4name' width='120' />
				<el-table-column label='类型' prop='type' width='60' />
				<el-table-column label='备注' prop='notes' />
				<el-table-column label='创建时间' prop='crtim' width='160' />
				<el-table-column label='更新时间' prop='uptim' width='160' />
			</el-table>

			<el-pagination
				@size-change='listQuery(state)' @current-change='listQuery(state)'
				class='mt8' :pager-count='5' :page-sizes='[10, 20, 30]' background
				:total='state.total' v-model:current-page='state.form.page'
				v-model:page-size='state.form.pageSize'
				layout='total, sizes, prev, pager, next, jumper'
			/>
		</el-card>
    <GenUpload ref='uploadModal' @close='closeOrgModal'/>
    <Amap ref='amapRef' />
	</div>
</template>

<script lang='ts' setup>
import { Plus, Delete, ArrowDown, ArrowUp,Upload,Download,Lightning } from '@element-plus/icons-vue';
import {onMounted, reactive, ref} from 'vue';
import { listQuery, listDelete, tabAdd, listSelect } from '/@/comps/page/index';
import request from "/@/utils/request";
import GenUpload from '/@/comps/gen/GenUpload.vue';
import Amap from '/@/comps/ass/amap.vue';
import {ElMessage} from "element-plus";

const state = reactive({
	url: '/ass/addr/main', loading: true, ids: [], cates: [] as any,
	form: {}, single: true, multiple: true, list: [], total: 0,
});

onMounted(() => {
	listQuery(state);
});

const listExp=async ()=>{
  await request({
    url: state.url+"/exp",
    method: 'get',
    params: state.form,
    responseType: "blob",
  });
}


const uploadModal = ref();

const listImp = () => {
  uploadModal.value.openModal();
};

const amapRef=ref();
const chooseAddr=()=>{
  amapRef.value.openModal();
}

const chooseAddr2=(cecoo:string)=>{
  amapRef.value.openModal({adcoo:cecoo,adreg:'',addet:'',adzoo:''});
}


const dataAsync=async ()=>{
  // ElMessage.warning("演示模式不支持同步操作")
  ElMessage.warning("需要在后台维护高德API的key")
  await request({
    url: state.url+"/addrupdate",
    method: 'put'
  });
}
</script>

<style scoped>

</style>
