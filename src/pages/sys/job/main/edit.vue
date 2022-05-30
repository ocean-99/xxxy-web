<template>
  <el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
    <template #header>
      <el-row>
        <el-col :span='10'>
          <div style='line-height: 32px'>定时任务信息</div>
        </el-col>
        <el-col :span='14' style='text-align: right'>
          <el-button type='success' @click='tabSave({formRef,state,proxy,route})' plain>保 存</el-button>
          <el-button type='info' @click='tabClose({proxy,route})' plain>关 闭</el-button>
        </el-col>
      </el-row>
    </template>
    <div style='margin-top: 8px;margin-bottom: 8px'>
      <el-form ref="formRef" class='zform' :model='form' label-width='140px'>
        <el-tabs type='card' v-model='activeName'>
          <el-tab-pane label='基本信息' name='tab1'>
            <el-row style='border-top: 1px solid #d2d2d2;'>
              <el-col :span='12'>
                <el-form-item label='任务名称：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]">
                  <div class='zinput'>
                    <el-input v-model='form.name'></el-input>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span='12'>
                <el-form-item label='任务代码：' prop='code' :rules="[{ required: true, message: '代码不能为空'}]">
                  <div class='zinput'>
                    <el-input v-model='form.code'></el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span='12'>
                <el-form-item label='请求类型：'>
                  <div class='zinput'>
                    <el-radio-group v-model="form.retyp">
                      <el-radio :label="0">Run</el-radio>
                      <el-radio :label="1">Get</el-radio>
                      <el-radio :label="2">Post</el-radio>
                      <el-radio :label="3">Put</el-radio>
                      <el-radio :label="4">Delete</el-radio>
                    </el-radio-group>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span='6'>
                <el-form-item label='任务表达式：' prop='cron'>
                  <div class='zinput'>
                    <el-input v-model='form.cron'></el-input>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span='6'>
                <el-form-item label='执行类型：'>
                  <div class='zinput'>
                    <el-select v-model='form.type' style='width: 100%'>
                      <el-option :value='0' label='并行执行'></el-option>
                      <el-option :value='1' label='串行执行'></el-option>
                    </el-select>
                  </div>
                </el-form-item>
              </el-col>

            </el-row>
            <el-row>
              <el-col :span='12'>
                <el-form-item label='请求地址：' prop='reurl'>
                  <div class='zinput'>
                    <el-input v-model='form.reurl'></el-input>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span='12'>
                <el-form-item label='请求头：' prop='rehea'>
                  <div class='zinput'>
                    <el-input v-model='form.rehea'></el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span='24'>
                <el-form-item label='请求参数：' prop='repar'>
                  <div class='zinput' style='height: auto'>
                    <el-input v-model='form.repar' type='textarea' :rows='4'></el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span='12'>
                <el-form-item label='排序号：'>
                  <div class='zinput'>
                    <el-input-number v-model='form.ornum' controls-position='right' style='width: 100%'/>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span='12'>
                <el-form-item label='是否可用：'>
                  <div class='zinput'>
                    <el-switch v-model='form.avtag'>
                    </el-switch>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label='其他信息' name='tab3'>
            <el-row style='border-top: 1px solid #d2d2d2;'>
              <el-col :span='24'>
                <el-form-item label='备注：'>
                  <div class='zinput' style='height: auto'>
                    <el-input style="font-family: 'Courier New', Helvetica, Arial, sans-serif; font-size:16px"
                              type='textarea' :rows='4' v-model='form.notes'>
                    </el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-show='form.crtim'>
              <el-col :span='12'>
                <el-form-item label='创建时间：'>
                  <div class='zinput'>
                    {{ form.crtim }}
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span='12'>
                <el-form-item label='更新时间：'>
                  <div class='zinput'>
                    {{ form.uptim }}
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
    <OrgModal ref='orgModal' @close='closeOrgModal'/>
  </el-card>
</template>
<script lang='ts'>
export default {name: 'SysJobMain'};
</script>
<script lang='ts' setup>
import {getCurrentInstance, onMounted, reactive, ref, toRefs} from 'vue';
import {editInit, tabSave, tabClose} from '/@/comps/page/edit';
import {useRoute} from 'vue-router';
import OrgModal from '/@/comps/sys/OrgModal.vue';
import {FormInstance} from "element-plus";

const route = useRoute();
const formRef = ref<FormInstance>();
const {proxy} = getCurrentInstance() as any;
const activeName = ref('tab1');

const state = reactive({
  url: '/sys/job/main',
  params: {path: '', query: ''},
  form: {avtag: true} as any,
});

const {form} = toRefs(state);

onMounted(async () => {
  await editInit({state, route});
});


//region a 所属部门与员工成员逻辑


//endregion


</script>

<style scoped>

</style>
