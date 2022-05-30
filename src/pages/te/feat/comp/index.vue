<template>
  <el-card class='box-card'>
    <template #header>
      <el-row>
        <el-col :span='14'>
          <el-input v-model='qform.name' placeholder='输入名称回车查询' clearable class='list-search' @keyup.enter='handleQuery'/>
          <el-button type='primary' @click='handleQuery' plain>查 询</el-button>
          <el-button class='more-button' :icon='moreParams?ArrowUp:ArrowDown' plain @click='moreParams=!moreParams'/>
        </el-col>
        <el-col :span='10' style='text-align: right'>
          <el-button type='success' :icon='Plus' @click='handleAdd' plain>新增</el-button>
          <el-button type='warning' :icon='Delete' @click='handleDelete' plain>测试</el-button>
          <el-button type='info' :icon='Upload' plain>导入</el-button>
          <el-button type='danger' :icon='Delete' :disabled='multiple' @click='handleDelete' plain>删除</el-button>
        </el-col>
      </el-row>
      <div v-show='moreParams' class='more-params'>
        <el-form :inline='true' label-width='100px'>
          <el-form-item label='备注'>
            <el-input v-model='qform.notes' placeholder='输入备注'/>
          </el-form-item>
          <el-form-item label='xxxxx'>
            <el-input v-model='qform.xx'/>
          </el-form-item>
          <el-form-item label='yyyyy'>
            <el-input v-model='qform.yy'/>
          </el-form-item>
          <el-form-item label='zzzzz'>
            <el-input v-model='qform.zz'/>
          </el-form-item>
          <el-form-item/>
        </el-form>
      </div>
    </template>

    <el-table height='400' :cell-style="{padding:'2px'}" :row-style="{height: '36px'}" v-loading='loading' :data='list'
              border stripe @selection-change='handleSelectionChange'>
      <el-table-column type='selection' width='55' align='center'/>
      <el-table-column label='序号' type='index' width='55' align='center'/>
      <el-table-column label='组件名称' width='180'>
        <template #default='scope'>
          <span style='cursor:pointer;color: #3e9ece' @click='handleEdit(scope.row.id)'>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label='备注' prop='notes'/>
      <el-table-column label='创建时间' prop='crtim' width='160'/>
      <el-table-column label='更新时间' prop='uptim' width='160'/>
    </el-table>

    <el-pagination
        @size-change='handleQuery' @current-change='handleQuery'
        class='mt8' :pager-count='5' :page-sizes='[10, 20, 30]' background
        :total='total' v-model:current-page='qform.page' v-model:page-size='qform.pageSize'
        layout='total, sizes, prev, pager, next, jumper'
    />


  </el-card>
</template>

<script lang='ts' setup>
import {Plus, Delete, ArrowDown, ArrowUp, Upload} from '@element-plus/icons-vue';
import {onMounted, reactive, ref, toRefs} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import request from '/@/utils/request';
import {useRouter} from 'vue-router';

const router = useRouter();


const qform = reactive({});

const state = reactive({
  loading: true,
  ids: [],// 选中ID数组
  single: true,	// 非单个禁用
  multiple: true,	// 非多个禁用
  moreParams: false,
  list: [],
  total: 0,
});

const {
  loading,
  ids,
  single,
  multiple,
  moreParams,
  list,
  total,
} = toRefs(state);

async function handleQuery() {
  const xx: any = await request({
    url: '/te/feat/comp',
    method: 'get',
    params: qform,
  });
  state.list = xx.items;
  state.total = xx.total;
  state.loading = false;
}


function handleSelectionChange(selection: any) {
  state.ids = selection.map((item: any) => item.id);
  state.single = selection.length !== 1;
  state.multiple = !selection.length;
}


function handleDelete() {
  const delIds = ids.value.join(',');
  if (delIds.length <= 0) {
    ElMessage.warning('请选择后再进行删除');
    return;
  }
  ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
      .then(async () => {
        await request({
          url: '/te/feat/comp/' + delIds,
          method: 'delete',
        });
        await handleQuery();
      })
      .catch(() => ElMessage.info('已取消删除'));
}


onMounted(() => {
  handleQuery();
});

const handleAdd = () => {
  router.push({
    path: '/te/feat/comp/edit',
    query: {},
  });
};

const handleEdit = (id: string) => {
  router.push({
    path: '/te/feat/comp/edit',
    query: {id: id},
  });
};


</script>

<style scoped>

</style>
