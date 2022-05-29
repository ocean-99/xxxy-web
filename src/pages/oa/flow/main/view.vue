<template>
	<!--	<div :style={height:`600px`,overflow:`auto`}>-->
	<!--	<div :style="{ height: zheight+ 'px' , overflow: 'auto' }">-->
	<div :style='{ height: `calc(100vh)`}' class='zpage'>
		<el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
			<template #header>
				<el-row>
					<el-col :span='10'>
						<div style='line-height: 32px'>流程实例</div>
					</el-col>
					<el-col :span='14' style='text-align: right'>
						<!--            <el-button type='success' @click='tabEdit(state,proxy,route)' plain>编 辑</el-button>-->
						<el-button type='info' @click='pageClose()' plain>关 闭</el-button>
					</el-col>
				</el-row>
			</template>
			<div style='margin-top: 8px;margin-bottom: 8px'>
				<el-form ref='formRef' :model='form' label-width='140px'>
					<el-tabs type='card' v-model='activeName'>
						<el-tab-pane label='基本信息' name='tab1' class='zform'>
							<el-row style='border-top: 1px solid #d2d2d2;'>
								<el-col :span='24'>
									<el-form-item label='主题：' prop='name' :rules="[{ required: true, message: '主题不能为空'}]">
										<div class='zinput'>
											<!--                      {{ form.name }}-->
											<el-input v-model='form.name'></el-input>
										</div>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span='24'>
									<el-form-item label='备注：'>
										<div class='zinput' style='height: auto'>
											{{form.notes}}
										</div>
									</el-form-item>
								</el-col>
							</el-row>
						</el-tab-pane>
						<el-tab-pane label='审批内容' name='tab2'>
							<v-form-render v-if='state.vformShow' :form-json='formJson' :form-data='formData' :option-data='optionData' ref='vFormRef'>
							</v-form-render>
							<div style='color: green'>注：此页面内容通过在线表单设计器渲染</div>
						</el-tab-pane>
						<el-tab-pane label='流程处理' name='tab3' class='zform'>
							<template v-if='form.id'>
								<BpmView @submit='submit' :proid='form.id' />
							</template>
						</el-tab-pane>
						<el-tab-pane label='权限信息' name='tab4' class='zform'>
							<img :src='qx' style='width:100%' />
						</el-tab-pane>
					</el-tabs>
				</el-form>
			</div>
		</el-card>
	</div>
</template>
<script lang='ts'>
export default { name: 'OaFlowMainView' };
</script>
<script lang='ts' setup>
import { getCurrentInstance, nextTick, onMounted, reactive, ref, toRefs } from 'vue';
import { tabEdit, pageSave, pageClose } from '/@/comps/page/view';
import { useRoute } from 'vue-router';
import BpmView from '/@/comps/bpm/view.vue';
import request from '/@/utils/request';
import { NextLoading } from '/@/utils/loading';
import { ElMessage, FormInstance } from 'element-plus';
import Cookies from 'js-cookie';


const route = useRoute();
const formRef = ref<FormInstance>();
const { proxy } = getCurrentInstance() as any;

const state = reactive({
	url: '/oa/flow/main',
	params: { path: '', query: '' },
	form: {} as any,
	formJson: {} as any,
	formData: {} as any,
	vformShow: false,
});

const { form, formJson, formData } = toRefs(state);
const activeName = ref('tab1');


const optionData = reactive({});
const vFormRef = ref(null) as any;

const viewInitx = async (state: any, route: any) => {
	state.params = <any>route;
	let id = state.params.query?.id;
	if (id) {
		state.form = await request({
			url: state.url + '/one/' + id,
			method: 'get',
		});

		const data: any = await request({
			url: '/oa/flow/temp/one/' + state.form.temid,
			method: 'get',
		});
		formJson.value = JSON.parse(data.vform);
		formData.value = JSON.parse(state.form.zform);
		state.vformShow = true;
		const userName = Cookies.get('userName');
		if(userName!=state.form.crman.name){
			nextTick(() => {
				vFormRef.value.disableForm();
			});
		}
	}
};

const submit = async (zbpm: any) => {
	form.value.zbpm = zbpm;
	// if(bpmData.opkey=='pass'){
	//
	//   await request({
	//     url: '/bpm/proc/main/hpass',
	//     method: 'post',
	//     data: form.value,
	//   });
	// }
	vFormRef.value.getFormData().then(async formData => {
		form.value.zform = JSON.stringify(formData);
		console.log('submit');
		await pageSave(formRef.value, state);
	}).catch(error => {
		ElMessage.error(error);
	});

};

onMounted(() => {
	NextLoading.done();
	viewInitx(state, route);
});


</script>

<style scoped>
.zpage {
	overflow: auto;
}

</style>
