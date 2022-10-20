<template>
  <el-dialog v-model='state.show' title='群组分类编辑' draggable width='500px'>
    <el-form ref='formRef' :model='form' label-width='120px'>
      <el-form-item label='分类名称：' prop='name' :rules="[{ required: true, message: '分类名称不能为空'}]">
        <el-input v-model='form.name'></el-input>
      </el-form-item>
      <el-form-item label='备注：' prop='notes'>
				<el-input type='textarea' :rows='4' v-model='form.notes'/>
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
import { defineExpose, reactive, ref, toRefs } from 'vue';
import {modalSave} from '/@/comps/page/edit';
import request from "/@/utils/request";
import { ElMessage } from 'element-plus';

const state = reactive({
  url: '/sys/org/group/cate', show: false,
  form: {avtag: true} as any,type:'add',
});

const {form} = toRefs(state);

const formRef = ref();
const openModal = async (data: any) => {
  if (data && data.id) {
    state.form = await request({
      url: state.url + '/one/' + data.id,
      method: 'get',
    });
		state.type='edit';
  } else {
		state.type='add';
    state.form = {avtag: true,children:[]};
		if(data.pid){
			state.form.pid=data.pid;
		}
    // formRef.value.clearValidate();
    if (formRef.value) {
      formRef.value.resetFields();
    }
  }
  state.show = true;
};
defineExpose({openModal});


const emits = defineEmits(['close']);
const handleConfirm = async () => {
	if(!state.form.name){
		ElMessage.warning("分类名称必须填写");
		return;
	}
	const backNode={} as any;
	backNode.id=await modalSave({formRef: formRef.value, state});
	backNode.name=state.form.name;
	backNode.notes=state.form.notes;
	backNode.pid=state.form.pid;
	backNode.children=state.form.children;
  emits('close',backNode,state.type);
};
</script>
