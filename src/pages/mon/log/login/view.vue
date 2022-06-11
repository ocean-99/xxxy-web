<template>
	<el-drawer v-model='state.show' size='70%'>
		<template #title>
			<h4>登录日志</h4>
		</template>
		<template #default>
			<div style='padding: 20px;'>
				<el-form ref='formRef' :model='form' label-width='160px'>
					<el-row style='height: 48px'>
						<el-col :span='12'>
							<el-form-item label='用户姓名：'>
								{{ form.name }}
							</el-form-item>
						</el-col>
						<el-col :span='12'>
							<el-form-item label='用户账号：'>
								{{ form.usnam }}
							</el-form-item>
						</el-col>
					</el-row>
					<el-row style='height: 48px'>
						<el-col :span='12'>
							<el-form-item label='登录时间：'>
								{{ form.crtim }}
							</el-form-item>
						</el-col>
						<el-col :span='12'>
							<el-form-item label='IP地址：'>
								{{ form.ip }}
							</el-form-item>
						</el-col>
					</el-row>
					<el-row style='height: 48px'>
						<el-col :span='12'>
							<el-form-item label='登录地点：'>
								{{ form.addre }}
							</el-form-item>
						</el-col>
						<el-col :span='12'>
							<el-form-item label='操作系统：'>
								{{ form.ageos }}
							</el-form-item>
						</el-col>
					</el-row>
					<el-row style='height: 48px'>
						<el-col :span='24'>
							<el-form-item label='浏览器：'>
								{{ form.agbro }}
							</el-form-item>
						</el-col>
					</el-row>
					<el-row style='height: 48px'>
						<el-col :span='24'>
							<el-form-item label='客户端详情：'>
								<el-input v-model='form.agdet' type='textarea' rows='10' readonly />
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
	url: '/mon/log/login', show: false,
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
