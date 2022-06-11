<template>
  <el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
    <template #header>
      <el-row>
        <el-col :span='10'>
          <div style='line-height: 32px'>客户维护</div>
        </el-col>
        <el-col :span='14' style='text-align: right'>
          <el-button type='success' @click='tabSave({formRef,state,proxy,route})' plain>保 存</el-button>
          <el-button type='info' @click='tabClose({proxy,route})' plain>关 闭</el-button>
        </el-col>
      </el-row>
    </template>
    <div style='margin-top: 8px;margin-bottom: 8px'>
      <el-form ref="formRef" :inline="true" class='yform' :model='form' label-width='140px'>
        <el-tabs type='card' v-model='activeName'>
          <el-tab-pane label='基本信息' name='tab1'>
            <div class="yform-div">
              <el-form-item label='客户名称：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]" style="width: 100%">
                  <el-input v-model='form.name'></el-input>
              </el-form-item>
              <el-form-item label='客户地址：'>
                  <el-input v-model='form.addre'></el-input>
              </el-form-item>
              <el-form-item label='是否可用：'>
                  <el-switch v-model='form.avtag'>
                  </el-switch>
              </el-form-item>
            </div>
          </el-tab-pane>
          <el-tab-pane label='其他信息' name='tab9'>
            <div class="yform-div">
              <el-form-item label='备注：' style="width: 100%">
                <el-input style="font-family: 'Courier New', Helvetica, Arial, sans-serif; font-size:16px"
                          type='textarea' :rows='4' v-model='form.notes'>
                </el-input>
              </el-form-item>
              <el-form-item label='创建人：' style="width: 25%">
                {{ form.crman ? form.crman.name : '' }}
              </el-form-item>
              <el-form-item label='创建时间：' style="width: 25%">
                <div class='zinput'> {{ form.crtim }}</div>
              </el-form-item>
              <el-form-item label='更新人：' style="width: 25%">
                {{ form.upman ? form.upman.name : '' }}
              </el-form-item>
              <el-form-item label='更新时间：' style="width: 25%">
                <div class='zinput'> {{ form.uptim }}</div>
              </el-form-item>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
  </el-card>
</template>
<script lang='ts'>
export default {name: 'SaCustMainEdit'};
</script>
<script lang='ts' setup>
import {getCurrentInstance, onMounted, reactive, ref,  toRefs} from 'vue';
import {editInit, tabSave, tabClose} from '/@/comps/page/edit';
import {useRoute} from 'vue-router';
import {FormInstance} from "element-plus";

const route = useRoute();
const formRef = ref<FormInstance>();
const {proxy} = getCurrentInstance() as any;
const activeName = ref('tab1');

const state = reactive({
  url: '/sa/cust/main',
  params: {path: '', query: ''}, checks: [] as any,
  form: {avtag: true, items: [] as any} as any,
});

const {form} = toRefs(state);


onMounted(async () => {
  await editInit({state, route});
});


</script>

<style scoped>

</style>
