<template>
  <div>
    <el-card class='box-card'>
      <template #header>
				<div class='zjustify'>
					<div>
						<el-input v-model='state.form.name' placeholder='输入名称回车查询' class='list-search' clearable @keyup.enter='listQuery(state)'/>
						<el-button type='primary' @click='listQuery(state)' plain>查 询</el-button>
						<el-button type='primary' @click='state.preview=!state.preview' plain>预览开关</el-button>
						<el-button type='warning' :icon="Operation" @click='openConfig()' plain>配 置</el-button>
						<el-button class='more-button' :icon='state.moreParams?ArrowUp:ArrowDown' plain @click='state.moreParams=!state.moreParams'/>
					</div>
					<div>
						<el-button type='success' :icon='Upload' @click='uploadFile' plain>上传</el-button>
						<el-button type='danger' :icon='Delete' :disabled='state.multiple' @click='listDelete(state)' plain>删除</el-button>
					</div>
				</div>
        <div v-show='state.moreParams' class='more-params'>
          <el-form :inline='true' label-width='100px'>
            <el-form-item label='更多参数1'>
              <el-input v-model='state.form.notes' placeholder='更多参数1'/>
            </el-form-item>
            <el-form-item label='更多参数2'>
              <el-input v-model='state.form.xx' placeholder='更多参数2'/>
            </el-form-item>
            <el-form-item/>
          </el-form>
        </div>
      </template>

      <el-table :cell-style="{padding:'2px'}" :row-style="{height: '36px'}"
                v-loading='state.loading' :data='state.list'
                border stripe @selection-change='listSelect($event,state)'>
        <el-table-column type='selection' width='55' align='center'/>
        <el-table-column label='序号' type='index' width='55' align='center'/>
        <el-table-column label='文件名称' prop='id' width='250'>
          <template #default='scope'>
						<span style='cursor:pointer;color: #3e9ece' @click='editRef.openModal({id:scope.row.id})'>
							{{ scope.row.name }}
						</span>
          </template>
        </el-table-column>
        <el-table-column label='文件后缀' prop='type' width='70'/>
        <el-table-column label='图片预览' width='78' v-if='state.preview'>
          <template #default='scope'>
            <el-image
                v-if="checkFileSuffix(scope.row.type)"
                style="width: 60px; height: 50px;"
                :src="scope.row.service==='local'?'http://localhost:5000/ass/oss/main/download?id='+scope.row.id:scope.row.path"
                :preview-src-list="[scope.row.path]"/>
            <span v-text="scope.row.name"
                  v-if="!checkFileSuffix(scope.row.type)"/>
          </template>
        </el-table-column>
        <el-table-column label='完整地址' prop='path'/>
        <el-table-column label='服务商' prop='service' width='80'/>
        <el-table-column label='上传时间' prop='crtim' width='150'/>
        <el-table-column label='上传人' prop='crman' width='60'/>
      </el-table>

      <el-pagination
          @size-change='listQuery(state)' @current-change='listQuery(state)'
          class='mt8' :pager-count='5' :page-sizes='[10, 20, 30]' background
          :total='state.total' v-model:current-page='state.form.page'
          v-model:page-size='state.form.pageSize'
          layout='total, sizes, prev, pager, next, jumper'
      />
    </el-card>
    <Edit ref='editRef' @close='listQuery(state)'/>
    <GenUpload ref='uploadModal' @close='closeUploadModal'/>
  </div>
</template>

<script lang='ts' setup>
import {Operation, Upload, Delete, ArrowDown, ArrowUp} from '@element-plus/icons-vue';
import {onMounted, reactive, ref} from 'vue';
import {listQuery, listDelete, listSelect} from '/@/comps/page/index';
import Edit from './edit.vue';
import GenUpload from '/@/comps/gen/GenUpload.vue';
import router from '/@/router';


const editRef = ref() as any;
const state = reactive({
  url: '/ass/oss/main', loading: true, ids: [], cates: [] as any, preview: true,
  form: {}, single: true, multiple: true, list: [], total: 0,
});

onMounted(async () => {
  await listQuery(state);
});

//通过这个方式给img 增加 token
//https://www.cnblogs.com/carriezhao/p/15878951.html


const uploadModal = ref();

const uploadFile = () => {
  uploadModal.value.openModal();
};

const closeUploadModal = async () => {
  await listQuery(state);
};

const checkFileSuffix = (fileSuffix: string) => {
  let arr = ["png", "jpg", "jpeg"];
  return arr.some(type => {
    return fileSuffix.indexOf(type) > -1;
  });
}

const openConfig = async () => {
  await router.push({
    path: '/ass/oss/config',
  });
}

</script>

<style scoped>

</style>
