<template>
  <el-dialog v-model='state.show' title='报表分类' draggable width='500px'>
    <el-form ref='formRef' :model='form' label-width='120px'>
      <el-form-item label='分类名称：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]">
        <el-input v-model='form.name'></el-input>
      </el-form-item>
      <el-form-item label='上级分类：'>
        <el-tree-select default-expand-all :props="{value:'id',label:'name'}" v-model="form.pid" :data="state.cates"
                        check-strictly style="width: 100%;" clearable/>
      </el-form-item>
      <el-form-item label='排序号：' prop='ornum'>
        <el-input-number v-model='form.ornum' controls-position='right' style='width: 100%'/>
      </el-form-item>
      <el-form-item label='是否可用：' prop='avtag'>
        <el-switch v-model='form.avtag'>
        </el-switch>
      </el-form-item>
      <el-form-item label='备注：' prop='notes'>
        <el-input type='textarea' :rows='4' v-model='form.notes'>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class='dialog-footer'>
				<el-button type='primary' @click='handleConfirm'>确 认</el-button>
        <el-button @click='state.show = false'>取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang='ts' setup>
import {defineExpose, reactive, ref, toRefs} from 'vue';
import {modalSave} from '/@/comps/page/edit';
import request from '/@/utils/request';

const state = reactive({
  url: '/bi/report/cate', show: false, cates: [] as any,
  form: {avtag: true} as any,
});

const {form} = toRefs(state);


//region -----弹框开启逻辑-----
const formRef = ref();
const openModal = async (data: any) => {
  if (data && data.id) {
    state.form = await request({
      url: state.url + '/one/' + data.id,
      method: 'get',
    });
    if(state.form.parent){
      state.form.pid = state.form.parent.id;
    }
  } else {
    state.form = {avtag: true};
    if (formRef.value) {
      formRef.value.resetFields();
    }
    if (data && data.pid) {
      form.value.parent = {id: data.pid, name: data.pname};
      form.value.pid = data.pid;
    }
    // console.log(form.value);
  }
  await catesInit();
  state.show = true;
};

const catesInit = async () => {
  state.cates = await request({
    url: '/bi/report/cate/treez',
    method: 'get',
    params:{id:form.value.id}
  });
};

defineExpose({openModal});
//endregion


//region -----弹框关闭逻辑-----
const emits = defineEmits(['close']);
const handleConfirm = async () => {
  if (form.value.pid) {
    form.value.parent = {id: form.value.pid};
  } else {
    form.value.parent = null;
  }
  await modalSave({formRef: formRef.value, state});
  emits('close');
};
//endregion

</script>
