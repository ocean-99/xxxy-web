<template>
  <el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
    <template #header>
      <el-row>
        <el-col :span='10'>
          <div style='line-height: 32px'>报表编辑</div>
        </el-col>
        <el-col :span='14' style='text-align: right'>
          <el-button type='success' @click='tabSave({formRef,state,proxy,route})' plain>保 存</el-button>
          <el-button type='info' plain>复 制</el-button>
          <el-button type='info' @click='tabClose({proxy,route})' plain>关 闭</el-button>
        </el-col>
      </el-row>
    </template>
    <div style='margin-top: 8px;margin-bottom: 8px'>
      <el-form ref='formRef' :inline="true" class='yform yform25' :model='form' label-width='140px'>
        <el-tabs type='card' v-model='activeName'>
          <el-tab-pane label='基本信息' name='tab1'>
            <div class="yform-div">
              <el-form-item label='报表名称：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]">
                <el-input v-model='form.name'/>
              </el-form-item>
              <el-form-item label='排序号：'>
                <el-input-number v-model='form.ornum' controls-position='right' style='width: 100%'/>
              </el-form-item>
              <el-form-item label='是否可用：'>
                <el-switch v-model='form.avtag'/>
              </el-form-item>
            </div>
          </el-tab-pane>
          <el-tab-pane label='其他信息' name='tab9'>
            <div class="yform-div">
              <el-form-item label='备注：' style="width: 100%">
                <el-input type='textarea' :rows='4' v-model='form.notes'/>
              </el-form-item>
              <el-form-item label='创建时间：' style="width: 50%">
                {{ form.crtim?form.crtim:'#' }}
              </el-form-item>
              <el-form-item label='更新时间：' style="width: 50%">
                {{ form.uptim?form.uptim:'#' }}
              </el-form-item>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
  </el-card>
</template>
<script lang='ts'>
export default {name: 'BiReportMainEdit'};
</script>
<script lang='ts' setup>
import {getCurrentInstance, onMounted, reactive, ref, toRefs} from 'vue';
import {editInit, tabSave, tabClose} from '/@/comps/page/edit';
import {useRoute} from 'vue-router';
import {FormInstance} from 'element-plus';

const route = useRoute();
const formRef = ref<FormInstance>();
const {proxy} = getCurrentInstance() as any;
const activeName = ref('tab1');

const state = reactive({
  url: '/bi/report/main',
  params: {path: '', query: {} as any},
  form: {avtag: true} as any,
});

const {form} = toRefs(state);

onMounted(async () => {
  state.params = <any>route;
  const catid = state.params.query?.catid;
  const catna = state.params.query?.catna;
  if (catid) {
    form.value.cate = {id: catid, name: catna};
    form.value.catid = catid;
    form.value.catna = catna;
  }
  await editInit({state, route});
  if (form.value.cate) {
    form.value.catna = form.value.cate.name;
  }
});

</script>
