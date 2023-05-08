<template>
	<div :style='{ height: `calc(100vh)`}' class='zpage'>
		<el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
			<template #header>
				<div class='zjustify'>
					<div>
						<div style='line-height: 32px'>流程实例</div>
					</div>
					<div>
						<el-button type='success' @click='save' plain>提 交</el-button>
						<el-button type='info' @click='pageClose()' plain>关 闭</el-button>
					</div>
				</div>
			</template>
			<div style='margin-top: 8px;margin-bottom: 8px'>
				<el-form ref='formRef' :model='form' label-width='140px'>
					<el-tabs type='card' v-model='activeName'>
						<el-tab-pane label='基本信息' class='zform zform100' name='tab1'>
							<div class='zform-div'>
								<el-form-item label='主题：' prop='name' :rules="[{ required: true, message: '主题不能为空'}]">
									<el-input v-model='form.name'></el-input>
								</el-form-item>
								<el-form-item label='备注：'>
									<el-input v-model='form.notes' type='textarea' :rows='4'></el-input>
								</el-form-item>
							</div>
						</el-tab-pane>
						<el-tab-pane label='审批内容' name='tab2'>
							<v-form-render v-if='state.vformShow' :form-json='formJson' :form-data='formData' :option-data='optionData' ref='vFormRef'>
							</v-form-render>
							<div style='color: green'>注：此页面内容通过在线表单设计器渲染</div>
						</el-tab-pane>
						<el-tab-pane label='流程处理' name='tab3'>
							<BpmEdit v-if='form.protd' :temid='form.protd' ref='bpmRef' />
						</el-tab-pane>
						<el-tab-pane label='权限信息' name='tab4'>
							<!--						<img :src='qx' style='width:100%' />-->
						</el-tab-pane>
					</el-tabs>
				</el-form>
			</div>
		</el-card>
	</div>
</template>
<script lang='ts' setup>
import { onMounted, reactive, ref, toRefs } from 'vue';
import { pageSave, pageClose } from '/@/comps/page/edit';
import { useRoute } from 'vue-router';
import BpmEdit from '/@/comps/bpm/edit.vue';
import request from '/@/utils/request';
import { NextLoading } from '/@/utils/loading';
import { ElMessage, FormInstance } from 'element-plus';

const route = useRoute();
const formRef = ref<FormInstance>();
const activeName = ref('tab1');

const bpmRef = ref() as any;


const state = reactive({
	url: '/oa/flow/main',
	params: { path: '', query: '' },
	form: { avtag: true } as any,
	formJson: {} as any,
	formData: {} as any,
	vformShow: false,
});

const { form, formJson, formData } = toRefs(state);

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
		formData.value = {};
		// formData.value={};
		// formJson.value ={"widgetList":[{"key":47519,"type":"input","icon":"text-field","formItemFlag":true,"options":{"name":"input65266","label":"input","labelAlign":"","type":"text","defaultValue":"","placeholder":"","columnWidth":"200px","size":"","labelWidth":null,"labelHidden":false,"readonly":false,"disabled":false,"hidden":false,"clearable":true,"showPassword":false,"required":false,"requiredHint":"","validation":"","validationHint":"","customClass":[],"labelIconClass":null,"labelIconPosition":"rear","labelTooltip":null,"minLength":null,"maxLength":null,"showWordLimit":false,"prefixIcon":"","suffixIcon":"","appendButton":false,"appendButtonDisabled":false,"buttonIcon":"custom-search","onCreated":"","onMounted":"","onInput":"","onChange":"","onFocus":"","onBlur":"","onValidate":""},"id":"input65266"}],"formConfig":{"modelName":"formData","refName":"vForm","rulesName":"rules","labelWidth":80,"labelPosition":"left","size":"","labelAlign":"label-left-align","cssCode":"","customClass":"","functions":"","layoutType":"PC","jsonVersion":3,"onFormCreated":"","onFormMounted":"","onFormDataChange":""}};
		state.vformShow = true;

	}
};

// const formData = reactive({})
const optionData = reactive({});
const vFormRef = ref(null) as any;

const save = async () => {
	vFormRef.value.getFormData().then(async formData => {
		// Form Validation OK
		form.value.zform = JSON.stringify(formData);
		form.value.zbpm = bpmRef.value.getOperateInfo();
		// alert(JSON.stringify(formData));
		await pageSave({ formRef: formRef.value, state });
	}).catch(error => {
		ElMessage.error(error);
	});
};


</script>

<style scoped>
.zpage {
	overflow: auto;
}


</style>
