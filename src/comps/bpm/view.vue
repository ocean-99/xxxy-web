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
				<div style='padding-left: 10px;border-right: 1px solid #ccc'>
					<el-checkbox v-model='state.autag'>显示审批记录</el-checkbox>
				</div>
			</el-col>
		</el-row>
		<el-row v-show='state.autag'>
			<el-col :span='24' style='background-color: white;'>
				<div style='border-right: 1px solid #ccc'>
					<el-table :data='audits' style='width: 100%'>
						<el-table-column prop='crtim' label='时间' width='160' />
						<el-table-column prop='facno' label='节点编号' width='80' />
						<el-table-column prop='facna' label='节点名称' width='200' />
						<el-table-column prop='haman' label='操作者' width='90' />
						<el-table-column prop='opinf' label='操作' width='300' />
						<el-table-column prop='opnot' label='处理意见' />
					</el-table>
				</div>
			</el-col>
		</el-row>

		<div v-if='state.cutag'>
			<el-row>
				<el-col :span='24'>
					<el-form-item label='通知紧急程度' style='margin-left: 10px'>
						<div class='zinput'>
							<el-radio-group v-model='form.opurg'>
								<el-radio label='a'><span>一般</span></el-radio>
								<el-radio label='b'><span style='color:blue'>急</span></el-radio>
								<el-radio label='c'><span style='color:red'>紧急</span></el-radio>
							</el-radio-group>
						</div>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span='24'>
					<el-form-item label='操作' style='margin-left: 10px'>
						<div class='zinput'>
							<el-radio-group v-model='form.opkey'>
								<el-radio label='pass'>通过</el-radio>
								<el-radio label='refuse'>驳回</el-radio>
								<el-radio label='commission'>转办</el-radio>
								<el-radio label='communicate'>沟通</el-radio>
								<el-radio label='abandon'>废弃</el-radio>
							</el-radio-group>
						</div>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row v-if="form.opkey=='refuse'">
				<el-col :span='24'>
					<el-form-item label='驳回到' style='margin-left: 10px'>
						<div class='zinput'>
							<el-select v-model='form.refno' placeholder='请选择' style='width:300px;margin-right: 8px' @change='refChange'>
								<el-option v-for='item in state.refNodes' :key='item.id' :value='item.id' :label="item.id+'.'+item.name"></el-option>
							</el-select>
							<el-checkbox v-model='form.retag'>驳回的节点通过后直接返回本节点</el-checkbox>
						</div>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row v-if="form.opkey=='pass'">
				<el-col :span='24'>
					<el-form-item label='即将流向' style='margin-left: 10px'>
						<div class='zinput'>
							{{ state.toExmen }}
						</div>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span='24'>
					<el-form-item label='处理意见' style='margin-left: 10px'>
						<div class='zinput' style='height: auto'>
							<div class='au-flex'>
								<div class='au-msg' style='padding:3px'>
									<el-input v-model='form.opnot' type='textarea' :rows='4' placeholder=' ' />
								</div>

								<div class='au-button'>
									<el-button type='primary' @click='bpmSubmit()' style='width: 94px;height: 94px;margin-top: 3px;margin-left: 6px'>提 交</el-button>
								</div>
							</div>
						</div>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span='24'>
					<el-form-item label='附件' style='margin-left: 10px'>
						<div class='zinput' style='height: auto'>
							<el-upload class='upload-demo' action='https://jsonplaceholder.typicode.com/posts/' :file-list='fileList'>
								<el-button type='primary'>上 传</el-button>
							</el-upload>
						</div>
					</el-form-item>
				</el-col>
			</el-row>
		</div>
		<el-row>
			<el-col :span='24'>
				<el-form-item label='当前处理人' style='margin-left: 10px'>
					<div class='zinput'>
						{{ form.facno + '.' + form.facna + '(' + state.cuExmen + ')' }}
					</div>
				</el-form-item>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span='24'>
				<el-form-item label='已经处理人' style='margin-left: 10px'>
					<div class='zinput'>
						{{ state.hiHamen }}
					</div>
				</el-form-item>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span='24'>
				<div style='padding-left: 10px;border-right: 1px solid #ccc'>
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
import { onMounted, reactive, toRaw, toRefs } from 'vue';
import request from '/@/utils/request';
// import { useRoute } from 'vue-router';
// import { Cookie, Session } from '/@/utils/storage';
// import { store } from '/@/store';
// const route = useRoute();
import Modeler2 from '/@/comps/Activiti/modeler2/index';
import { BpmnStore } from '/@/bpmn/store';
// import Viewer from 'bpmn-js/lib/NavigatedViewer';
// import Viewer from 'bpmn-js/lib/Modeler';
// import Viewer from 'bpmn-js/lib/Viewer';


const state = reactive({
	form: {
		items: [],
	} as any,
	params: {
		path: '',
		query: '',
	},
	audits: [] as any,
	chtag: true,
	autag: true,
	xml: null as any,
	refNodes: [] as any,
	cutag: false,
	hiHamen: '',
	cuExmen: '',
	toExmen: '',
});

const {
	form, params, audits,
} = toRefs(state);

state.refNodes = [
	{ id: 'N2', name: '起草节点', exman: 'sa' },
	{ id: 'N4', name: '张三', exman: 'z3' },
	{ id: 'N5', name: '王五', exman: 'w5' },
];


const props = defineProps({
	proid: String,
});


onMounted(async () => {
	await bpmInit();
  await toggleFlowChart();
	// state.params = <any>route;
	// if (params.value.query?.id) {
	//也可以拿到alert(params.value.query?.id);
	// }
});


const bpmInit = async () => {
	// form.value.proid = props.proid;
	const result: any = await request({
		url: '/bpm/proc/main/zbpm/' + props.proid,
		method: 'get',
	});
	audits.value = result.audits;
	state.hiHamen = result.hiHamen;
	state.cuExmen = result.cuExmen;

	state.cutag = result.cutag;
	form.value = result.zbpm;
	if (state.cutag) {
		const target: any = await request({
			url: '/bpm/proc/main/target',
			method: 'get',
			params: { proid: form.value.proid, facno: form.value.facno },
		});
		form.value.tarno = target.tarno;
		form.value.tarna = target.tarna;
		form.value.tamen = target.tamen;
		form.value.bacid = target.bacid;
		if (target.tarno == 'N3') {
			state.toExmen = target.tarno + '.' + target.tarna;
		} else {
			state.toExmen = target.tarno + '.' + target.tarna + '(' + target.tamen + ')';
		}

		form.value.opkey = 'pass';
		form.value.opurg = 'a';
	}


	// audits.value = await request({
	// 	url: '/bpm/audit/main/list/' + props.proid,
	// 	method: 'get',
	// });

	// form.value = await request({
	// 	url: '/bpm/proc/main/zbpm/' + props.proid,
	// 	method: 'get',
	// });

};

const emit = defineEmits(['submit']);

const bpmSubmit = async () => {

	if (form.value.opkey == 'pass') {
		await request({
			url: '/bpm/proc/main/hpass',
			method: 'post',
			data: form.value,
		});
	} else if (form.value.opkey == 'refuse') {
		const refInfo = toRaw(form.value);
		refInfo.tarno=refInfo.refno;
		refInfo.tarna=refInfo.refna;
		refInfo.exman=refInfo.reman;
		await request({
			url: '/bpm/proc/main/hrefuse',
			method: 'post',
			data: refInfo,
		});
	}

  console.log('86811');
  emit('submit');
  console.log('86822');
};

const toggleFlowChart = async () => {
	if (!state.xml) {
		state.xml = await request({
			url: '/bpm/proc/main/xml/' + props.proid,
			method: 'get',
		});
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
		modeling.setColor(list1, { fill: '#e4feef' });
		modeling.setColor(list2, { fill: '#fed6d6' });
		modeling.setColor(list3, { stroke: '#009900' });
	}
};


const refChange = (id: any) => {
	for (let i = 0; i < state.refNodes.length; i++) {
		if (state.refNodes[i].id == id) {
			form.value.refna = state.refNodes[i].name;
			form.value.reman = state.refNodes[i].exman;
			break;
		}
	}
};

</script>

<style scoped>
.au-flex {
	display: flex;
	background-color: white;
}

.au-msg {
	flex: 1;
	width: 100%;
}

.au-button {
	width: 105px;
	min-width: 105px;
}
</style>
