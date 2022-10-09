<template>
	<el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
		<template #header>
			<div class='zjustify'>
				<div>
					<div style='line-height: 32px'>流程模板</div>
				</div>
				<div>
					<el-button type='success' @click='save(state)' plain>保 存</el-button>
					<el-button type='info' plain>复 制</el-button>
					<el-button type='info' @click='pageClose' plain>关 闭</el-button>
				</div>
			</div>
		</template>
		<CateModal url='oa/flow/cate/tree' ref='cateModal' @close='cateChoose' />
		<div style='margin-top: 8px;margin-bottom: 8px'>
			<el-form ref='formRef' :model='form' label-width='140px'>
				<el-tabs type='card' v-model='activeName'>

					<el-tab-pane label='基本信息' name='tab1' class='zform el-form--inline'>
						<div class="zform-div">
							<el-form-item label='模板名称：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]">
								<el-input v-model='form.name'></el-input>
							</el-form-item>
							<el-form-item label='所属分类：' prop='cate' :rules="[{ required: true, message: '分类不能为空'}]">
								<el-input :value='form.cate?.name' :suffix-icon='Search' :readonly='true' @click='openCateModal'></el-input>
							</el-form-item>
							<el-form-item label='排序号：'>
								<el-input-number v-model='form.ornum' controls-position='right' style='width: 100%'/>
							</el-form-item>
							<el-form-item label='是否可用：'>
								<el-switch v-model='form.avtag'>
								</el-switch>
							</el-form-item>
						</div>
					</el-tab-pane>

					<el-tab-pane label='表单配置' name='tab2'>
						<el-row style='border-top: 1px solid #d2d2d2;'>
							<el-col :span='24'>
								<v-form-designer v-if='state.vformShow' ref='vFormRef'/>
							</el-col>
						</el-row>
					</el-tab-pane>

					<el-tab-pane label='流程配置' name='tab3'>
						<div style='width: 100%;height: 720px'>
							<BpmTmplEdit ref="bpmTmplEditRef" v-if='state.bpmShowTag' :prxml='form.prxml'/>
						</div>
					</el-tab-pane>

					<el-tab-pane label='其他信息' name='tab9' class='zform el-form--inline'>
						<div class="zform-div">
							<el-form-item label='备注：' style="width: 100%">
								<el-input style="font-family: 'Courier New', Helvetica, Arial, sans-serif; font-size:16px"
													type='textarea' :rows='4' v-model='form.notes'>
								</el-input>
							</el-form-item>
							<el-form-item label='创建人：' style="width: 25%">
								<div class='zinput'> {{ form.crman ? form.crman.name : '' }}</div>
							</el-form-item>
							<el-form-item label='创建时间：' style="width: 25%">
								<div class='zinput'> {{ form.crtim }}</div>
							</el-form-item>
							<el-form-item label='更新人：' style="width: 25%">
								<div class='zinput'> {{ form.upman ? form.upman.name : '' }}</div>
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
export default { name: 'OaFlowTmplEditNew' };
</script>
<script lang='ts' setup>
import { onMounted, reactive, ref, toRefs } from 'vue';
import { pageSave, pageClose } from '/@/comps/page/edit';
import { useRoute } from 'vue-router';
import { NextLoading } from '/@/utils/loading';
import CateModal from '/@/comps/gen/GenTreeModal.vue';
import BpmTmplEdit from '/@/comps/bpm/tmpl/edit.vue';
import { FormInstance } from 'element-plus';
import request from '/@/utils/request';

const route = useRoute();
const formRef = ref<FormInstance>();
const activeName = ref('tab1');

const vFormRef = ref(null) as any;

const state = reactive({
	url: '/oa/flow/tmpl',bpmShowTag:false,
	params: { path: '', query: {} as any},
	form: { avtag: true,protd:'',prxml:'' } as any,
	vformShow: true
});

const { form } = toRefs(state);


onMounted(async () => {
	NextLoading.done();
	state.params = <any>route;
	let id = state.params.query?.id;
	if (id) {
		state.form = await request({
			url: state.url + '/one/' + id,
			method: 'get',
		});
		vFormRef.value.setFormJson(JSON.parse(state.form.vform));
	} else {
		let catid = state.params.query?.catid;
		if (catid) {
			state.form.cate = { id: catid, name: state.params.query?.catna };
		}
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
	state.bpmShowTag=true;
});

const bpmTmplEditRef=ref();

async function save(state: any) {
	// xFlow.value.getData();
	// form.value.vform = JSON.stringify(vFormRef.value.getFormJson());
	form.value.prxml =await bpmTmplEditRef.value.getXml();
	form.value.vform = JSON.stringify(vFormRef.value.getFormJson());
	await pageSave({formRef:formRef.value, state});
}


//region -----分类弹框逻辑-----
const cateModal = ref();
const openCateModal = () => {
	cateModal.value.openModal();
};
const cateChoose = (node: any) => {
	if (node == null) {
		form.value.cate = null;
	} else {
		form.value.cate = { id: node.id, name: node.name };
	}
};
//endregion

</script>

<style scoped>

</style>
