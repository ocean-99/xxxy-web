<template>

	<el-drawer v-model='state.show' size='70%'>
		<template #title>
			<h4>定时任务日志</h4>
		</template>
		<template #default>
			<div style='padding: 20px;border-top: 1px solid #ccc'>
				<el-form ref='formRef' :model='form' label-width='160px'>
					<el-row style='height: 48px'>
						<el-col :span='12'>
							<el-form-item label='任务名称：'>
								{{form.name}}
							</el-form-item>
						</el-col>
						<el-col :span='12'>
							<el-form-item label='执行结果：'>
								{{form.ret}}
							</el-form-item>
						</el-col>
					</el-row>
					<el-row style='height: 48px'>
						<el-col :span='12'>
							<el-form-item label='开始时间：'>
								{{form.sttim}}
							</el-form-item>
						</el-col>
						<el-col :span='12'>
							<el-form-item label='结束时间：'>
								{{form.sttim}}
							</el-form-item>
						</el-col>
					</el-row>
					<el-row style='height: 48px'>
						<el-col :span='24'>
							<el-form-item label='返回信息：'>
								<el-input v-model='form.msg' type='textarea' rows='10' readonly/>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
		</template>
		<template #footer>
			<div style='flex: auto;margin: 20px'>
				<el-button @click='state.show = false'>关闭</el-button>
			</div>
		</template>
	</el-drawer>

</template>

<script lang='ts' setup>
import { reactive, toRefs } from 'vue';
import { drawerOpen } from '/@/comps/page/edit';

const state = reactive({
	url: '/sys/job/log', show: false,
	form: { avtag: true } as any,
});

const { form } = toRefs(state);

//暴露open方法给父组件调用
const open = async (id: string) => {
	await drawerOpen({state, id});
};
defineExpose({ open });

</script>

<style scoped>
</style>
