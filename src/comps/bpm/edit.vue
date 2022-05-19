<template>
  <el-form class='zform' :model='form' label-width='180px'>
    <el-row style='border-top: 1px solid #d2d2d2;'>
      <el-col :span='24'>
        <el-form-item label='流程说明：'>
          <div class='zinput'>
            这是一个测试的流程，目前功能还不完善
          </div>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span='24'>
        <el-form-item label='紧急程度：'>
          <div class='zinput'>
            <el-radio-group v-model='form.opurg'>
              <el-radio :label='1'><span style='color:red'>紧急</span></el-radio>
              <el-radio :label='2'><span style='color:blue'>急</span></el-radio>
              <el-radio :label='3'><span>一般</span></el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span='24'>
        <el-form-item label='即将流向：'>
          <div class='zinput'>
            N5.部门负责人(张三)
          </div>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span='24'>
        <el-form-item label='处理意见：'>
          <div class='zinput' style='height: auto'>
            <el-input v-model='form.opnot' type='textarea' :rows='5' placeholder=' '/>
          </div>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span='24'>
        <el-form-item label='附件：'>
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
        <div style='padding-left: 105px;border-right: 1px solid #ccc'>
          <el-checkbox v-model="checked2">流程图</el-checkbox>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span='24'>

      </el-col>
    </el-row>
  </el-form>
</template>

<script lang='ts' setup>
import {onMounted, reactive, toRaw, toRefs} from 'vue';
import {useRoute} from 'vue-router';
import request from "/@/utils/request";
import {BpmnStore} from "/@/bpmn/store";

const route = useRoute();

const state = reactive({
  form: {},
  params: {
    path: '',
    query: '',
  },
  xml: null as any,
});

const {
  form, params,
} = toRefs(state);


onMounted(async () => {
  state.params = <any>route;
  if (params.value.query?.id) {

  }
  await toggleFlowChart();
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
    state.xml = await request({
      url: '/bpm/proc/main/texml/' + props.temid,
      method: 'get',
    });
    console.log(state.xml)
    await BpmnStore.importXML(state.xml);

    // const bpmnViewer = new Viewer({
    // 	container: '#modeler-container',
    // }) as any;
    // try {
    // 	const { warnings } = await bpmnViewer.importXML(state.xml);
    // 	// bpmnViewer.get("canvas").zoom("fit-viewport", "auto");
    // 	console.log('rendered');
    // } catch (err) {
    // 	console.log('error rendering', err);
    // }

    const elementRegistry = BpmnStore.getModeler().get('elementRegistry');
    // const userTaskList = elementRegistry.filter(
    // 	(item) => item.type === 'bpmn:Task'
    // );
    console.log(elementRegistry);
    const list1 = [] as any;
    elementRegistry.forEach((item: any) => {
      if (item.id == 'L7' || item.id == 'N1' || item.id == 'N2') {
        list1.push(item);
      }
    });

    const list2 = [] as any;
    elementRegistry.forEach((item: any) => {
      if (item.id == 'N4') {
        list2.push(item);
      }
    });

    const list3 = [] as any;
    elementRegistry.forEach((item: any) => {
      if (item.id == 'L1' || item.id == 'L3') {
        list3.push(item);
      }
    });
    let modeling = BpmnStore.modeler.get('modeling');
    modeling.setColor(list1, {fill: '#e4feef'});
    modeling.setColor(list2, {fill: '#fed6d6'});
    modeling.setColor(list3, {stroke: '#009900'});
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
