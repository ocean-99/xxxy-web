<template>
  <el-form class='zform' :model='form' label-width='160px' label-position='left'>
    <el-row style='border-top: 1px solid #d2d2d2;'>
      <el-col :span='24'>
        <el-form-item label='流程说明' style='margin-left: 10px;'>
          <div class='zinput'>
            这是一个测试的流程，目前功能还不完善
          </div>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span='24'>
        <el-form-item label='紧急程度' style='margin-left: 10px;'>
          <div class='zinput'>
            <el-radio-group v-model='form.opurg'>
              <el-radio label='1'><span style='color:red'>紧急</span></el-radio>
              <el-radio label='2'><span style='color:blue'>急</span></el-radio>
              <el-radio label='3'><span>一般</span></el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span='24'>
        <el-form-item label='即将流向' style='margin-left: 10px;'>
          <div class='zinput'>
            {{ state.toExmen }}
          </div>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span='24'>
        <el-form-item label='处理意见' style='margin-left: 10px;'>
          <div class='zinput' style='height: auto'>
            <el-input v-model='form.opnot' type='textarea' :rows='5' placeholder=' '/>
          </div>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span='24'>
        <el-form-item label='附件' style='margin-left: 10px;'>
          <div class='zinput' style='height: auto'>
            <el-upload class='upload-demo' action='https://jsonplaceholder.typicode.com/posts/' :file-list='fileList'>
              <el-button type='primary'>上 传</el-button>
            </el-upload>
          </div>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span='24'>
        <div style='margin-left: 10px;border-right: 1px solid #ccc'>
          <el-checkbox v-model='state.chtag' @change='toggleFlowChart'>流程图</el-checkbox>
        </div>
      </el-col>
    </el-row>
    <el-row v-show='state.chtag'>
      <el-col :span='24' style='background-color: white;'>
        <div style='padding: 10px;border-right: 1px solid #ccc;height:1000px'>
          <Modeler2 />
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script lang='ts' setup>
import {defineExpose, onMounted, reactive, toRaw, toRefs} from 'vue';
import {useRoute} from 'vue-router';
import request from "/@/utils/request";
import Modeler2 from '/@/comps/Activiti/modeler2/index';
import {BpmnStore} from "/@/bpmn/store";

const route = useRoute();

const state = reactive({
  form: {opurg:'3'} as any,
  chtag: true,
  params: {
    path: '',
    query: '',
  },
  toExmen: '',
  tarno:'',
  xml: null as any,
});

const {
  form, params,
} = toRefs(state);


onMounted(async () => {
  state.params = <any>route;
  if (params.value.query?.id) {

  }
  toggleFlowChart();
});


const getOperateInfo = () => {
  return toRaw(form.value);
};


defineExpose({getOperateInfo});


const props = defineProps({
  temid: String,
});


const toggleFlowChart = async () => {
  if (!state.xml) {
    const map= await request({
      url: '/bpm/proc/main/texml/' + props.temid,
      method: 'get',
    }) as any;
    form.value.tarno = map.tarno;
    form.value.tarna = map.tarna;
    form.value.tamen = map.tamen;
    state.toExmen = map.tarno + '.' + map.tarna + '(' + map.tamen + ')';

    state.xml=map.xml;
    await BpmnStore.importXML(state.xml);
    const elementRegistry = BpmnStore.getModeler().get('elementRegistry');
    const list1 = [] as any;
    elementRegistry.forEach((item: any) => {
      if (item.id == 'N1') {
        list1.push(item);
      }
    });

    const list2 = [] as any;
    elementRegistry.forEach((item: any) => {
      if (item.id == 'L1') {
        list2.push(item);
      }
    });

    const list3 = [] as any;
    elementRegistry.forEach((item: any) => {
      if (item.id == 'N2') {
        list3.push(item);
      }
    });

    let modeling = BpmnStore.modeler.get('modeling');
    modeling.setColor(list1, {fill: '#e4feef'});
    modeling.setColor(list2, {stroke: '#009900'});
    modeling.setColor(list3, {fill: '#fed6d6'});
  }
};


// const fileList = ref<UploadUserFile[]>([
// 	{
// 		name: 'food.jpeg',
// 		url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
// 	},
// 	{
// 		name: 'food2.jpeg',
// 		url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
// 	},
// ])

</script>

<style scoped>

</style>
