<template>

	<el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
		<template #header>
			<el-row>
				<el-col :span='10'>
					<div style='line-height: 32px'>流程实例</div>
				</el-col>
				<el-col :span='14' style='text-align: right'>
					<el-button type='success' @click='save' plain>保 存</el-button>
					<el-button type='info' @click='pageClose()' plain>关 闭</el-button>
				</el-col>
			</el-row>
		</template>
		<div style='margin-top: 8px;margin-bottom: 8px'>
			<el-form ref="formRef" :model='form' label-width='140px'>
				<el-tabs type='card' v-model='activeName'>
					<el-tab-pane label='基本信息' name='tab1'>
						<el-row>
							<el-col :span='24'>
								<el-form-item label='申请标题：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]">
									<div class='zinput'>
										<el-input v-model='form.name'></el-input>
									</div>
								</el-form-item>
							</el-col>
						</el-row>
					</el-tab-pane>
					<el-tab-pane label='审批内容' name='tab2'>
						<v-form-render v-if='state.vformShow' :form-json='formJson' :form-data='formData' :option-data='optionData' ref='vFormRef' />
						<!--						<el-button type='primary' @click='submitForm'>Submit</el-button>-->
					</el-tab-pane>
					<el-tab-pane label='流程处理' name='tab3' class='zform'>
						<BpmEdit :temid='form.protd' ref='bpmRef' />
					</el-tab-pane>
					<el-tab-pane label='权限信息' name='tab4' class='zform'>
						<img :src='qx' style='width:100%' />
					</el-tab-pane>
				</el-tabs>
			</el-form>
		</div>
	</el-card>
</template>
<script lang='ts' setup>
import { nextTick, onMounted, reactive, ref, toRefs } from 'vue';
import { pageSave, pageClose } from '/@/comps/page/edit';
import { useRoute } from 'vue-router';
import BpmEdit from '/@/comps/bpm/edit.vue';
import request from '/@/utils/request';
import {NextLoading} from "/@/utils/loading";
import {FormInstance} from "element-plus";

const route = useRoute();
const formRef = ref<FormInstance>();
const activeName = ref('tab1');

const bpmRef = ref() as any;


const state = reactive({
	url: '/oa/flow/main',
	params: { path: '', query: '' },
	form: { avtag: true } as any,
	formJson: {} as any,
	vformShow: false,
});

const { form, formJson } = toRefs(state);


onMounted(() => {
  NextLoading.done();
	editInitx(state, route);
});

const editInitx = async (state: any, route: any) => {
	state.params = <any>route;
	let id = state.params.query?.id;
	if (id) {
		state.form = await request({
			url: state.url + '/one/' + id,
			method: 'get',
		});
	} else {
		let temid = state.params.query?.temid;
		const data: any = await request({
			url: '/oa/flow/temp/one/' + temid,
			method: 'get',
		});
		form.value.protd = data.protd;
		form.value.temid = temid;
		form.value.avtag = true;
		formJson.value = JSON.parse(data.vform);
		state.vformShow = true;
	}
};

const save = async () => {
	form.value.zbpm = bpmRef.value.getOperateInfo();
	await pageSave(formRef.value,state);
};

/* 注意：formJson是指表单设计器导出的json，此处演示的formJson只是一个空白表单json！！ */
// const formJson = reactive({"widgetList":[],"formConfig":{"modelName":"formData","refName":"vForm","rulesName":"rules",
// 		"labelWidth":80,"labelPosition":"left","size":"","labelAlign":"label-left-align","cssCode":"","customClass":"",
// 		"functions":"","layoutType":"PC","jsonVersion":3,"onFormCreated":"","onFormMounted":"","onFormDataChange":"",
// 		"onFormValidate":""}}) as any;
const formData = reactive({});
const optionData = reactive({});
const vFormRef = ref(null);


</script>

<style scoped>

</style>
