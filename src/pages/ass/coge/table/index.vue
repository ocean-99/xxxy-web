<template>
	<div>
		<el-card class='box-card'>
			<template #header>
				<el-row>
					<el-col :span='14'>
						<el-input v-model='state.form.name' placeholder='输入名称回车查询' clearable class='list-search' @keyup.enter='listQuery(state)' />
						<el-button type='primary' @click='listQuery(state)' plain>查 询</el-button>
						<el-button class='more-button' :icon='state.moreParams?ArrowUp:ArrowDown' plain @click='state.moreParams=!state.moreParams'/>
					</el-col>
					<el-col :span='10' style='text-align: right'>
						<el-button type='success' :icon='Plus' @click='tabAdd(state.url)' plain>新增</el-button>
<!--						<el-button type='info' :icon='Upload' plain>导入</el-button>-->
<!--            <el-button type='info' :icon='Download' plain @click='listExp' >导出</el-button>-->
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

			<el-table height='400' :cell-style="{padding:'2px'}" :row-style="{height: '36px'}" v-loading='state.loading' :data='state.list'
								border stripe @selection-change='listSelect($event,state)'>
				<el-table-column type='selection' width='55' align='center' />
				<el-table-column label='序号' type='index' width='55' align='center' />
				<el-table-column label='代码生成名称' width='180'>
					<template #default='scope'>
						<span style='cursor:pointer;color: #3e9ece' @click='tabEdit(state.url,scope.row.id)'>{{ scope.row.name }}</span>
					</template>
				</el-table-column>
				<el-table-column label='创建时间' prop='crtim' width='160' />
				<el-table-column label='更新时间' prop='uptim' width='160' />
        <el-table-column label='备注' prop='notes' />
        <el-table-column label='操作' width='80' header-align='center' align="right">
          <template #default="scope">
            <el-icon title="预览代码" @click='showCode(scope.row.id)' style="cursor: pointer;font-size: 18px;top:2px;margin-right: 8px;color: #52C41A">
              <View/>
            </el-icon>
            <el-icon title="生成代码" @click='genCode(scope.row.id)' style="cursor: pointer;font-size: 18px;top:2px;margin-right: 8px;color: #2874C5">
              <Download/>
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
    <Show ref="showRef"/>
	</div>
</template>
<script lang='ts'>
export default { name: 'AssCogeMain' };
</script>
<script lang='ts' setup>
import { Plus, Delete, ArrowDown, ArrowUp,Download,View} from '@element-plus/icons-vue';
import {onMounted, reactive, ref} from 'vue';
import { listQuery, listDelete, tabAdd, tabEdit, listSelect } from '/@/comps/page/index';
import request from "/@/utils/request";
import Show from './show.vue';

const state = reactive({
	url: '/ass/coge/table', loading: true, ids: [],moreParams: false,
	form: {}, single: true, multiple: true, list: [], total: 0,
});

onMounted(() => {
	listQuery(state);
});


const listExp=async ()=>{
  await request({
    url: state.url+"/download",
    method: 'get',
    params: {tanam:'aa'},
    responseType: "blob",
  });
}

const genCode=async (id:string)=>{
  await request({
    url: state.url+"/zip",
    method: 'get',
    params: {id},
    responseType: "blob",
  });
}

const showRef = ref() as any;
const showCode=async (id:string)=>{
  const data= await request({
    url: state.url+"/show",
    method: 'get',
    params: {id},
  });
  showRef.value.openModal(data)
}


</script>

<style scoped>

</style>
