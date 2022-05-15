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
						<el-button type='success' @click='viewEdit(state,proxy,route)' plain>编 辑</el-button>
						<el-button type='info' @click='viewClose(proxy,route)' plain>关 闭</el-button>
					</el-col>
				</el-row>
			</template>
			<div style='margin-top: 8px;margin-bottom: 8px'>
				<el-form class='zform' :model='form' label-width='140px'>
					<el-tabs type='card' v-model='activeName'>
						<el-tab-pane label='审批内容' name='tab1'>
							<el-row style='border-top: 1px solid #d2d2d2;'>
								<el-col :span='24'>
									<el-form-item label='申请标题：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]">
										<div class='zinput'>
											{{ form.name }}
										</div>
									</el-form-item>
								</el-col>
							</el-row>
						</el-tab-pane>
						<el-tab-pane label='流程处理' name='tab2'>
							<template v-if='form.id'>
								<BpmView @submit='submit' :proid='form.id' />
							</template>
						</el-tab-pane>
						<el-tab-pane label='权限信息' name='tab3'>
							<img :src='qx' style='width:100%' />
						</el-tab-pane>
					</el-tabs>
				</el-form>
			</div>
		</el-card>
	</div>
</template>
<script lang='ts'>
export default { name: 'oaFlowMainView' };
</script>
<script lang='ts' setup>
import { getCurrentInstance, onMounted, reactive, ref, toRefs } from 'vue';
import { viewEdit, viewClose } from '/@/comps/page/view';
import { useRoute } from 'vue-router';
import BpmView from '/@/comps/bpm/view.vue';
import request from '/@/utils/request';


const route = useRoute();
const { proxy } = getCurrentInstance() as any;

const state = reactive({
	url: '/oa/flow/main',
	params: { path: '', query: '' },
	form: {} as any,
});

const { form } = toRefs(state);
const activeName = ref('tab1');


const viewInitx = async (state: any, route: any) => {
	state.params = <any>route;
	let id = state.params.query?.id;
	if (id) {
		state.form = await request({
			url: state.url + '/one/' + id,
			method: 'get',
		});
	}
};


const submit = () => {
	console.log('submit');
};

onMounted(() => {
	viewInitx(state, route);
});


</script>

<style scoped>
.zpage {
	overflow: auto;
}

</style>
