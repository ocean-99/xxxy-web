<template>
  <el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
    <template #header>
			<div class='zjustify'>
				<div>
					<div style='line-height: 32px'>待办信息</div>
				</div>
				<div>
					<el-button type='success' @click='tabSave({formRef,state,proxy,route})' plain>保 存</el-button>
					<el-button type='info' @click='tabClose({proxy,route})' plain>关 闭</el-button>
				</div>
			</div>
    </template>
    <div style='margin-top: 8px;margin-bottom: 8px'>
      <el-form ref="formRef" :inline="true" class='zform zform100' :model='form' label-width='140px'>
        <el-tabs type='card' v-model='activeName'>
          <el-tab-pane label='基本信息' name='tab1'>
            <div class="zform-div">
              <el-form-item label='待办名称：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]">
                <el-input v-model='form.name'/>
              </el-form-item>
            </div>
          </el-tab-pane>
          <el-tab-pane label='其他信息' name='tab3'>
            <div class="zform-div">
              <el-form-item label='备注：'>
                <el-input type='textarea' :rows='4' v-model='form.notes'/>
              </el-form-item>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
  </el-card>
</template>
<script lang='ts' setup>
import {getCurrentInstance, onMounted, reactive, ref, toRefs} from 'vue';
import {editInit, tabSave, tabClose} from '/@/comps/page/edit';
import {useRoute} from 'vue-router';
import {FormInstance} from "element-plus";

const route = useRoute();
const formRef = ref<FormInstance>();
const {proxy} = getCurrentInstance() as any;
const activeName = ref('tab1');

const state = reactive({
  url: '/sys/todo/main',
  params: {path: '', query: ''},
  form: {avtag: true} as any,
});

const {form} = toRefs(state);


onMounted(async () => {
  await editInit({state, route});
});
</script>
