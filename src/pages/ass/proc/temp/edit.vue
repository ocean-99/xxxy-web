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
					<el-button type='info' @click='tabClose({proxy,route})' plain>关 闭</el-button>
				</div>
			</div>
		</template>
		<div style='margin-top: 8px;margin-bottom: 8px'>
			<el-form ref='formRef' :model='form' label-width='140px'>
				<el-tabs type='card' v-model='activeName'>

					<el-tab-pane label='基本信息' name='tab1' class='zform el-form--inline'>
						<div class="zform-div">
							<el-form-item label='模板名称：' style='width:100%' prop='name' :rules="[{ required: true, message: '名称不能为空'}]">
								<el-input v-model='form.name'></el-input>
							</el-form-item>
							<el-form-item label='排序号：'>
								<el-input-number v-model='form.ornum' controls-position='right' style='width: 100%'/>
							</el-form-item>
							<el-form-item label='是否可用：'>
								<el-switch v-model='form.avtag'>
								</el-switch>
							</el-form-item>
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

					<el-tab-pane label='流程配置' name='tab3'>
						<div style='width: 100%;height: 720px'>
							<BpmTempEdit ref="bpmTempEditRef" v-if='state.bpmShowTag' :prxml='form.orxml'/>
						</div>
					</el-tab-pane>

				</el-tabs>
			</el-form>
		</div>
	</el-card>
</template>
<script lang='ts'>
export default { name: 'AssProcTempEdit' };
</script>
<script lang='ts' setup>
import { getCurrentInstance, onMounted, reactive, ref, toRefs } from 'vue';
import { tabClose, tabSave } from '/@/comps/page/edit';
import { useRoute } from 'vue-router';
import BpmTempEdit from '/@/comps/bpm/temp/edit.vue';
import { FormInstance } from 'element-plus';
import request from '/@/utils/request';

const route = useRoute();
const formRef = ref<FormInstance>();
const activeName = ref('tab1');
const { proxy } = getCurrentInstance() as any;

const state = reactive({
	url: '/bpm/proc/temp',bpmShowTag:false,
	params: { path: '', query: {} as any},
	form: { avtag: true,orxml:'',type:''} as any,
});

const { form } = toRefs(state);

onMounted(async () => {
	state.params = <any>route;
	let id = state.params.query?.id;
	if (id) {
		state.form = await request({
			url: state.url + '/one/' + id,
			method: 'get',
		});
	} else {
		let type = state.params.query?.type;
		if (type) {
			state.form.type = type;
		}
		state.form.avtag = true;
	}
	state.bpmShowTag=true;
});

const bpmTempEditRef=ref();

async function save(state: any) {
	form.value.orxml =await bpmTempEditRef.value.getXml();
	await tabSave({ formRef: formRef.value, state, proxy, route });
}
</script>
