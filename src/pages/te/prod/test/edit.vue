<template>

	<el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
		<template #header>
			<el-row>
				<el-col :span='10'>
					<div style='line-height: 32px'>
						<el-input v-model='form.aaa' placeholder='输入参数名回车查询' style='width: 200px'></el-input>
					</div>
				</el-col>
				<el-col :span='14' style='text-align: right'>
					<el-button type='success' @click='handleSave' plain>保 存</el-button>
					<el-button type='info' @click='handleClose' plain>关 闭</el-button>
				</el-col>
			</el-row>
		</template>
		<div style='margin-top: 8px;margin-bottom: 8px'>
			<el-row style='background:white'>
				<el-col :span='16'>
					<el-form :model='form' label-width='200px'>
						<el-tabs type='card' v-model='activeName'>
							<el-tab-pane :label='screen.name' :name='screen.id' :key='screen.id' v-for='(screen) of zmodel.screens'>
								<el-form-item :key='param.id' v-for='(param) of screen.params' :label='param.name'>
									<template v-if="param.shmod=='select'">
										<!--										<el-select v-model='form.feat[param.code]' placeholder='选择' style='width: 100%'>-->
										<!--											<el-option :value="'input'" :label="'A1 普通输入框'"></el-option>-->
										<!--											<el-option :value="'select'" :label="'B1 普通下拉框'"></el-option>-->
										<!--											<el-option :value="'select2'" :label="'B2 可输入下拉框'"></el-option>-->
										<!--											<el-option :value="'textarea'" :label="'C1 多行输入框'"></el-option>-->
										<!--											<el-option :value="'list'" :label="'D1 明细表'"></el-option>-->
										<!--											<el-option :value="'switch'" :label="'E1 开关（有，无）'"></el-option>-->
										<!--											<el-option :value="'fuhe'" :label="'复合参数'"></el-option>-->
										<!--										</el-select>-->
										<el-input v-model='form.feat[param.code]'></el-input>
									</template>
									<template v-else-if="param.shmod=='input'">
										<el-input v-model='form.feat[param.code]'></el-input>
									</template>
									<template v-else>

									</template>
								</el-form-item>

								<!--								<el-table :ref='el =>{ if (el) listTableRefs[i]= el}' :data='screen.params' style='width: 100%;height: 500px'>-->
								<!--									<el-table-column type='selection' width='55' />-->
								<!--									<el-table-column prop='code' label='参数代码' width='180' />-->
								<!--									<el-table-column prop='name' label='参数名称' width='180' />-->
								<!--									<el-table-column prop='ornum' label='排序号' width='100' />-->
								<!--									<el-table-column prop='notes' label='备注' />-->
								<!--								</el-table>-->
							</el-tab-pane>
						</el-tabs>
					</el-form>
				</el-col>
				<el-col :span='8'>
					<div style='font-size: 18px;margin-top: 8px;margin-bottom: 8px;margin-left: 8px'>土建示意图</div>
					<div style='margin-left: 10px;margin-right: 10px;border-left:1px solid #eee;border-right:1px solid #eee'>
						<el-collapse v-model='active2Name'>
							<el-collapse-item title='&nbsp;&nbsp;示意图1' name='1'>
								<img :src='png1' style='height: 400px' />
							</el-collapse-item>
							<el-collapse-item title='&nbsp;&nbsp;示意图2' name='2'>
							</el-collapse-item>
						</el-collapse>
					</div>

				</el-col>
			</el-row>


		</div>
	</el-card>


</template>

<script lang='ts' setup>
import { getCurrentInstance, onMounted, reactive, ref, toRefs } from 'vue';
import request from '/@/utils/request';
import { useRoute } from 'vue-router';
import png1 from './111.png';

const listTableRefs = ref([]);
const groupModal = ref();


const openGroupModal = () => {
	groupModal.value.openModal();
};

const { proxy } = getCurrentInstance() as any;
// import request from '/@/utils/request';
const route = useRoute();

const state = reactive({
	form: {
		avtag: true,
		options: [
			{ id: 1, name: 11, func1: '', func2: '' },
			{ id: 2, name: 22, func1: '', func2: '' },
		],
		feat: {},
	} as any,
	params: {
		path: '',
		query: '',
	},
	zmodel: {},
});

const {
	form, params, zmodel,
} = toRefs(state);

const addItem = () => {
	form.value.options.push({});
};

// const firstTab=zmodel.value.screens[0].id;
const activeName = ref('');


const handleClose = () => {
	proxy.mittBus.emit('onCurrentContextmenuClick', Object.assign({}, { contextMenuClickId: 1, ...route }));
};

async function handleSave() {
	if (!form.value.id) {
		await request({
			url: '/te/feat/param',
			method: 'post',
			data: form.value,
		});
	} else {
		await request({
			url: '/te/feat/param',
			method: 'put',
			data: form.value,
		});
	}
	handleClose();
}


const myEditInit = async (id: string) => {
	if (id) {
		form.value = await request({
			url: '/te/feat/param/one/' + id,
			method: 'get',
		});
	} else {
		form.value = { avtag: true };
	}
};

const zmodelInit = async (modid: string) => {
	zmodel.value = await request({
		url: '/te/prod/model/zmodel/' + modid,
		method: 'get',
	});
	if (zmodel.value.screens) {
		activeName.value = zmodel.value.screens[0].id;
	}
};

onMounted(() => {
	state.params = <any>route;
	if (params.value.query?.id) {
		myEditInit(params.value.query?.id);

	}
	if (params.value.query?.modid) {
		zmodelInit(params.value.query?.modid);
	}
});

</script>

<style scoped>

</style>
