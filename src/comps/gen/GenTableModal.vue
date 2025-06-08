<template>
  <el-dialog v-model='dialogVisible' title='弹框选择' draggable width='900px'>

    <div class='zjustify' style="margin-bottom: 10px">
      <div>
        <el-input v-model='state.form.name' placeholder='输入名称回车查询' class='list-search' clearable @keyup.enter='listQuery()'/>
        <el-button type='primary' @click='listQuery()' plain>查 询</el-button>
      </div>
      <div>
        <el-button type='primary' @click='handleConfirm'>确 认</el-button>
        <el-button @click='dialogVisible = false'>取 消</el-button>
      </div>
    </div>

    <el-table height='400' :cell-style="{padding:'2px'}" :row-style="{height: '36px'}"
              v-loading='state.loading' :data='state.list'
              border stripe @selection-change='listSelect($event,state)'>
      <el-table-column type='selection' width='55' align='center'/>
      <el-table-column label='#' type='index' width='35' align='center'/>
      <el-table-column label='名称' prop='name' width='300'/>
      <el-table-column label='备注' prop='notes'/>
    </el-table>

    <el-pagination
        @size-change='listQuery()' @current-change='listQuery()'
        class='mt8' :pager-count='5' :page-sizes='[10, 20, 30]' background
        :total='state.total' v-model:current-page='state.form.page'
        v-model:page-size='state.form.pageSize'
        layout='total, sizes, prev, pager, next, jumper'
    />

  </el-dialog>
</template>


<script lang='ts' setup>
import {defineExpose, onMounted, reactive, ref} from 'vue';
import {ElMessage} from "element-plus";
import {get} from "/@/utils/req";

const state = reactive({
  loading: true, ids: [],
  form: {}, single: true, multiple: true, list: [], total: 0,
});

const props = defineProps({
  url: String,
  maInit: Boolean,
});

onMounted(() => {
  listQuery();
});


const listQuery = async () => {
  const data: any = await get({
    url: props.url,
    params: state.form,
  });
  state.list = data.items;
  state.total = data.total;
  state.loading = false;
}

const listSelect = (selection: any, state: any) => {
  state.ids = selection.map((item: any) => item.id);
  state.single = selection.length !== 1;
  state.multiple = !selection.length;
}


const dialogVisible = ref(false);
const open = async (data: any) => {
  if (data && data.params) {
    state.form = data.params;
  } else {
    state.form = {};
  }
  if (data && data.reload) {
    await listQuery();
  }
  dialogVisible.value = true;
};
defineExpose({open});

const emits = defineEmits(['close']);
const handleConfirm = () => {
  const chooseIds = state.ids.join(',');
  if (chooseIds.length <= 0) {
    ElMessage.warning('请先点击选择项');
    return;
  } else if (state.ids.length >= 2) {
    ElMessage.warning('请选择单个选择项，不要多选');
    return;
  }
  emits('close', {ids: chooseIds});
  dialogVisible.value = false;
};

</script>

<style scoped>
</style>
