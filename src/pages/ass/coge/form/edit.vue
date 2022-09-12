<template>
  <el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
    <template #header>
			<div class='zjustify'>
				<div>
					<div style='line-height: 32px'>[预览与生成代码的按钮需要高分辨率屏幕才显示] <a target="_blank" href="https://www.vform666.com/" style="color: green">VForm表单设计器地址</a></div>
				</div>
				<div>
					<el-button type='success' @click='tabSave({formRef,state,proxy,route,flush:state.url})' plain>保 存</el-button>
					<el-button type='info' @click='tabClose({proxy,route})' plain>关 闭</el-button>
				</div>
			</div>
    </template>
    <div style='margin-top: 8px;margin-bottom: 8px'>
      <el-form ref="formRef"  :model='form' label-width='140px'>
        <el-tabs type='card' v-model='activeName'>
          <el-tab-pane label='基本信息' name='tab1' class='el-form--inline zform'>
            <div class="zform-div">
              <el-form-item label='名称：' prop='name' style="width:100%" :rules="[{ required: true, message: '名称不能为空'}]">
                <el-input v-model='form.name'/>
              </el-form-item>
              <el-form-item label='备注：' style="width: 100%">
                <el-input type='textarea' :rows='4' v-model='form.notes'/>
              </el-form-item>
              <el-form-item label='创建人：' style="width: 25%">
								<div class='zinput'> {{ form.crman ? form.crman.name : '' }}</div>
              </el-form-item>
              <el-form-item label='创建时间：' style="width: 25%">
                <div class='zinput'> {{ form.crtim }}</div>
              </el-form-item>
              <el-form-item label='更新人：' style="width: 25%">
								<div class='zinput'>   {{ form.upman ? form.upman.name : '' }}</div>
              </el-form-item>
              <el-form-item label='更新时间：' style="width: 25%">
                <div class='zinput'> {{ form.uptim }}</div>
              </el-form-item>
            </div>
          </el-tab-pane>
          <el-tab-pane label='表单设计' name='tab2'>
            <div style="border: 1px solid #ccc">
              <v-form-designer v-if='state.vformShow' ref='vFormRef'/>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
    <div class="aaaz"></div>
  </el-card>
</template>
<script lang='ts'>
export default {name: 'AssCogeFormEdit}'};
</script>
<script lang='ts' setup>
import {getCurrentInstance, onMounted, onUpdated, reactive, ref, toRefs} from 'vue';
import {tabSave, tabClose} from '/@/comps/page/edit';
import {useRoute} from 'vue-router';
import {FormInstance} from "element-plus";
import request from "/@/utils/request";

const route = useRoute();
const formRef = ref<FormInstance>();
const {proxy} = getCurrentInstance() as any;
const activeName = ref('tab2');


const state = reactive({
  url: '/ass/coge/form',vformShow: true,
  params: {path: '', query: ''},
  form: {avtag: true} as any,
});

const {form} = toRefs(state);

onUpdated(()=>{
  const $toolbar=document.getElementsByClassName('right-toolbar')[0];
  $toolbar.setAttribute("style","width: 566px;");
})

const vFormRef = ref(null) as any;
onMounted(async () => {

  //right-toolbar
  state.params = <any>route;
  let id = state.params.query?.id;
  if (id) {
    state.form = await request({
      url: state.url + '/one/' + id,
      method: 'get',
    });
    vFormRef.value.setFormJson(JSON.parse(state.form.vform));
    // state.vformShow=true;
    // console.log(vFormRef.value);
    // console.log(state.form.vform);
  } else {
    state.form.avtag = true;
    vFormRef.value.setFormJson({
      "widgetList": [],
      "formConfig": {
        "modelName": "formData",
        "refName": "vForm",
        "rulesName": "rules",
        "labelWidth": 80,
        "labelPosition": "left",
        "size": "",
        "labelAlign": "label-left-align",
        "cssCode": "",
        "customClass": "",
        "functions": "",
        "layoutType": "PC",
        "jsonVersion": 3,
        "onFormCreated": "",
        "onFormMounted": "",
        "onFormDataChange": "",
        "onFormValidate": ""
      }
    });
  }
});


</script>
