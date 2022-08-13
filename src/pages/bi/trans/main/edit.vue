<template>
  <el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
    <template #header>
      <el-row>
        <el-col :span='10'>
          <div style='line-height: 32px'>转换编辑</div>
        </el-col>
        <el-col :span='14' style='text-align: right'>
          <el-button type='success' @click='save' plain>保 存</el-button>
          <el-button type='info' @click='tabClose({proxy,route})' plain>关 闭</el-button>
        </el-col>
      </el-row>
    </template>
    <div style='margin-top: 8px;margin-bottom: 8px'>
      <el-form ref="formRef" :inline="true" class='yform' :model='form' label-width='140px'>
        <el-tabs type='card' v-model='activeName'>
          <el-tab-pane label='基本信息' name='tab1'>
            <div class="yform-div">
              <el-form-item label='转换名称：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]">
                <el-input v-model='form.name'></el-input>
              </el-form-item>
              <el-form-item label='排序号：' style="width: 25%;">
                <el-input-number v-model='form.ornum' controls-position='right' style='width: 100%'/>
              </el-form-item>
              <el-form-item label='是否可用：' style="width: 25%;">
                <el-switch v-model='form.avtag'/>
              </el-form-item>
              <el-form-item label='备注：' style='width: 100%'>
                <el-input type='textarea' :rows='4' v-model='form.notes' />
              </el-form-item>
            </div>
          </el-tab-pane>
					<el-tab-pane label='转换设计' name='tab2'>
						<div style='width: 100%;height: 720px'>
							<div class="containers">
								<div class="canvas" ref="canvasRef" style='height: 1000px;'></div>
							</div>
						</div>
					</el-tab-pane>
          <el-tab-pane label='其他信息' name='tab9'>
            <div class='yform-div'>
              <el-form-item label='创建人：' style='width: 25%'>
                {{ form.crman ? form.crman.name : '' }}
              </el-form-item>
              <el-form-item label='创建时间：' style='width: 25%'>
                <div class='zinput'> {{ form.crtim }}</div>
              </el-form-item>
              <el-form-item label='更新人：' style='width: 25%'>
                {{ form.upman ? form.upman.name : '' }}
              </el-form-item>
              <el-form-item label='更新时间：' style='width: 25%'>
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
export default {name: 'BiTransMainEdit'};
</script>
<script lang='ts' setup>
import {getCurrentInstance, onMounted, reactive, ref, toRefs} from 'vue';
import {editInit, tabSave, tabClose} from '/@/comps/page/edit';
import {useRoute} from 'vue-router';
import {FormInstance} from "element-plus";

import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css' // 左边工具栏以及编辑节点的样式
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import customModule from './custom'
import CustomModeler from './customModeler'

const route = useRoute();
const formRef = ref<FormInstance>();
const {proxy} = getCurrentInstance() as any;
const activeName = ref('tab1');

const state = reactive({
  url: '/bi/trans/main',
  params: {path: '', query: ''},
  form: {avtag: true} as any,
	bpmnModeler: {} as any,
});

const {form,bpmnModeler} = toRefs(state);

const canvasRef = ref();

const save = () => {
	// form.value.graph= graphRef.value.test();
	bpmnModeler.value.saveXML({format: true}, function (err, xml) {
		form.value.graph = xml;
		tabSave({formRef: formRef.value, state, proxy, route});
	})
}

onMounted(async () => {
  await editInit({state, route});


	bpmnModeler.value=new CustomModeler({
		container: canvasRef.value,
		// additionalModules: [
		//   customModule
		// ]
		additionalModules: [{
			__init__: [
				"labelEditingProvider"
			],
			labelEditingProvider: ['value', null],
		}
		],
	})

	bpmnModeler.value.get('keyboard').bind(document);
	// bpmnModeler.value=new CustomModeler({
	// 	container: canvasRef.value,
	// 	additionalModules: [
	// 	]
	// })

	if (state.form.id) {
		bpmnModeler.value.importXML(state.form.graph, (err: any) => {
			if (err) {
				console.error(err)
			} else {
				console.log("ok")
			}
		})
	} else {
		bpmnModeler.value.importXML(xmlStr, (err: any) => {
			if (err) {
				console.error(err)
			} else {
				console.log("ok")
			}
		})
	}

	addModelerListener();
	addEventBusListener();



});


const addModelerListener = () => {
	// const bpmnjs = this.bpmnModeler
	// const that = this
	// 这里我是用了一个forEach给modeler上添加要绑定的事件
	const events = ['shape.added', 'shape.move.end', 'shape.removed', 'connect.end', 'connect.move']
	events.forEach(function (event) {
		bpmnModeler.value.on(event, e => {
			console.log(event, e)
			var elementRegistry = bpmnModeler.value.get('elementRegistry')
			var shape = e.element ? elementRegistry.get(e.element.id) : e.shape
			console.log(shape)
			if (event == "shape.added") {
				console.log(888)
			}
		})
	})
}

let currNode = {};

const addEventBusListener = () => {
	const eventBus = bpmnModeler.value.get('eventBus') // 需要使用eventBus
	const eventTypes = ['element.dblclick'] // 需要监听的事件集合
	eventTypes.forEach(function (eventType) {
		eventBus.on(eventType, function (e) {
			if (!e || e.element.type == 'bpmn:Process') return

			var elementRegistry = bpmnModeler.value.get('elementRegistry')
			var shape = elementRegistry.get(e.element.id) // 传递id进去


			// openTableModal();
			currNode = shape;

			console.log(shape.businessObject.id);
			// shape.businessObject.name='李四';
			// bpmnModeler.value.get('modeling').updateProperties(shape,{
			// 	name: '我是修改后的Task名称'
			// })

			// this.getModeling().updateProperties(this.getShape(), {
			// 	[modelName]: multiple ? [newElement] : newElement,
			// });
			console.log(shape) // {Shape}
			// console.log(e.element) // {Shape}
			// console.log(JSON.stringify(shape)===JSON.stringify(e.element)) // true

		})
	})
}




const xmlStr = '<?xml version="1.0" encoding="UTF-8"?>\n' +
	'<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" id="sample-diagram" targetNamespace="http://activiti.org/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">\n' +
	'  <bpmn2:process id="Process_1" name="1" isExecutable="true" />\n' +
	'  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n' +
	'    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1" />\n' +
	'  </bpmndi:BPMNDiagram>\n' +
	'</bpmn2:definitions>\n';


</script>

<style scoped>
.containers {
	position: absolute;
	background-color: #ffffff;
	width: 100%;
	height: 100%;
	background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMTBoNDBNMTAgMHY0ME0wIDIwaDQwTTIwIDB2NDBNMCAzMGg0ME0zMCAwdjQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlMGUwZTAiIG9wYWNpdHk9Ii4yIi8+PHBhdGggZD0iTTQwIDBIMHY0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+') repeat !important;
}

.canvas {
	width: 100%;
	height: 100%;
}

.panel {
	position: absolute;
	right: 0;
	top: 0;
	width: 300px;
}

</style>
