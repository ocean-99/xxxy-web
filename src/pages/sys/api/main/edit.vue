<template>
	<el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
		<template #header>
			<div class='zjustify'>
				<div>
					<div style='line-height: 32px'>接口信息</div>
				</div>
				<div>
					<el-button type='success' @click='tabSave({formRef,state,proxy,route})' plain>保 存</el-button>
					<el-button type='info' @click='tabClose({proxy,route})' plain>关 闭</el-button>
				</div>
			</div>
		</template>
		<div style='margin-top: 8px;margin-bottom: 8px'>
			<el-form ref='formRef' :inline='true' class='zform' :model='form' label-width='140px'>
				<el-tabs type='card' v-model='activeName'>
					<el-tab-pane label='基本信息' name='tab1'>
						<div class='zform-div'>
							<el-form-item label='接口名称：'>
								{{ form.id }}
							</el-form-item>
							<el-form-item label='是否可用：'>
								<el-switch v-model='form.avtag' />
							</el-form-item>
							<el-form-item label='备注：' style='width: 100%;'>
								<el-input type='textarea' :rows='4' v-model='form.notes' />
							</el-form-item>
							<el-form-item label='创建时间：' v-show='form.crtim'>
								{{ form.crtim }}
							</el-form-item>
							<el-form-item label='更新时间：' v-show='form.crtim'>
								{{ form.uptim }}
							</el-form-item>
						</div>
					</el-tab-pane>
				</el-tabs>
			</el-form>
		</div>
	</el-card>
</template>
<script lang='ts'>
export default { name: 'SysApiMainEdit' };
</script>
<script lang='ts' setup>
import { getCurrentInstance, onMounted, reactive, ref, toRefs } from 'vue';
import { editInit, tabSave, tabClose } from '/@/comps/page/edit';
import { useRoute } from 'vue-router';
import { FormInstance } from 'element-plus';

const route = useRoute();
const formRef = ref<FormInstance>();
const { proxy } = getCurrentInstance() as any;
const activeName = ref('tab1');

const state = reactive({
	url: '/sys/api/main',
	params: { path: '', query: '' },
	form: { avtag: true, menus: [] } as any,
});

const { form } = toRefs(state);

onMounted(async () => {
	await editInit({ state, route });
});


</script>

<style scoped>

</style>
