<template>

	<el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
		<template #header>
			<el-row>
				<el-col :span='10'>
					<div style='line-height: 32px'>参数分配</div>
				</el-col>
				<el-col :span='14' style='text-align: right'>
					<el-button type='success' @click='save()' plain>保 存</el-button>
					<el-button type='info' @click='tabClose({proxy,route})' plain>关 闭</el-button>
				</el-col>
			</el-row>
		</template>
		<div style='margin-top: 8px;margin-bottom: 8px'>
			<el-form ref="formRef" class='zform' :model='form' label-width='140px'>
				<el-tabs type='card' v-model='activeName'>
					<el-tab-pane label='基本信息' name='tab1'>
						<el-row style='border-top: 1px solid #d2d2d2;'>
							<el-col :span='12'>
								<el-form-item label='分配名称：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]">
									<div class='zinput'>
										<el-input v-model='form.name'></el-input>
									</div>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span='12'>
								<el-form-item label='所属产品分类：' prop='catid' :rules="[{ required: true, message: '分类不能为空'}]">
									<div class='zinput'>
										<el-select v-model='form.catid' placeholder='请选择产品分类' @change='cateChange'>
											<el-option
												v-for='item in cates'
												:key='item.id'
												:label='item.name'
												:value='item.id'
											/>
										</el-select>
									</div>
								</el-form-item>
							</el-col>
							<el-col :span='6'>
								<el-form-item label='所属产品系列：'>
									<div class='zinput'>
										<el-input v-model='form.serid' :suffix-icon='Search'></el-input>
									</div>
								</el-form-item>
							</el-col>
							<el-col :span='6'>
								<el-form-item label='所属产品型号：'>
									<div class='zinput'>
										<el-input v-model='form.modid' :suffix-icon='Search'></el-input>
									</div>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span='12'>
								<el-form-item label='驱动方式：'>
									<div class='zinput'>
										<el-select v-model='form.chway' style='width: 100%'>
											<el-option :value="'a'" :label="'excel公式'"></el-option>
											<el-option :value="'b'" :label="'js函数'"></el-option>
										</el-select>
									</div>
								</el-form-item>
							</el-col>
							<el-col :span='6'>
								<el-form-item label='排序号：'>
									<div class='zinput'>
										<el-input-number v-model='form.ornum' controls-position='right' style='width: 100%' />
									</div>
								</el-form-item>
							</el-col>
							<el-col :span='6'>
								<el-form-item label='是否可用：'>
									<div class='zinput'>
										<el-switch v-model='form.avtag'>
										</el-switch>
									</div>
								</el-form-item>
							</el-col>
						</el-row>
					</el-tab-pane>
					<el-tab-pane label='参数分配' name='tab2'>
						<div style='margin-left: 15px;margin-right: 15px'>
							<el-tabs v-model='activeScreen'>
								<el-tab-pane :label='screen.name' :name='screen.id' :key='screen.id' v-for='(screen,i) of screens'>
									<el-table :ref='el =>{ if (el) listTableRefs[i]= el}' :data='screen.params' style='width: 100%;height: 500px'>
										<el-table-column type='selection' width='55' />
										<el-table-column prop='code' label='参数代码' width='180' />
										<el-table-column prop='name' label='参数名称' width='180' />
										<el-table-column prop='ornum' label='排序号' width='100' />
										<el-table-column prop='notes' label='备注' />
									</el-table>
								</el-tab-pane>
							</el-tabs>
						</div>
					</el-tab-pane>
					<el-tab-pane label='其他信息' name='tab3'>
						<el-row style='border-top: 1px solid #d2d2d2;'>
							<el-col :span='24'>
								<el-form-item label='备注：'>
									<div class='zinput' style='height: auto'>
										<el-input style="font-family: 'Courier New', Helvetica, Arial, sans-serif; font-size:16px"
															type='textarea' :rows='4' v-model='form.notes'>
										</el-input>
									</div>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row v-show='form.crtim'>
							<el-col :span='6'>
								<el-form-item label='创建人：'>
									<div class='zinput'>
										{{ form.crman ? form.crman.name : '' }}
									</div>
								</el-form-item>
							</el-col>
							<el-col :span='6'>
								<el-form-item label='创建时间：'>
									<div class='zinput'>
										{{ form.crtim }}
									</div>
								</el-form-item>
							</el-col>
							<el-col :span='6'>
								<el-form-item label='更新人：'>
									<div class='zinput'>
										{{ form.upman ? form.upman.name : '' }}
									</div>
								</el-form-item>
							</el-col>
							<el-col :span='6'>
								<el-form-item label='更新时间：'>
									<div class='zinput'>
										{{ form.uptim }}
									</div>
								</el-form-item>
							</el-col>
						</el-row>
					</el-tab-pane>
				</el-tabs>
			</el-form>
		</div>
	</el-card>
</template>
<script lang='ts'>
export default { name: 'teAllotParam' };
</script>
<script lang='ts' setup>
import { getCurrentInstance, nextTick, onMounted, reactive, ref, toRefs } from 'vue';
import { editInit, tabSave, tabClose } from '/@/comps/page/edit';
import { useRoute } from 'vue-router';
import request from '/@/utils/request';

const formRef=ref();
const route = useRoute();
const { proxy } = getCurrentInstance() as any;

const state = reactive({
	url: '/te/allot/param', cates: [] as any, screens: [] as any,
	params: { path: '', query: '' },
	form: { avtag: true,items: [] as any } as any,
});

const { form, cates, screens } = toRefs(state);
const activeName = ref('tab1');

onMounted(async () => {
	await editInit({state, route});
	if (form.value.id) {
		await cateChange();
	} else {
		form.value.items = [];
	}
	await catesInit();
});


const listTableRefs = ref([]) as any;
const save = async () => {
	form.value.items = [];
	for (let j = 0; j < screens.value.length; j++) {
		for (let i = 0; i < listTableRefs.value[j].getSelectionRows().length; i++) {
			form.value.items.push({ parid: listTableRefs.value[j].getSelectionRows()[i].id });
		}
	}
	await tabSave({formRef:formRef.value,state, proxy, route});
};

//分类弹框逻辑
const catesInit = async () => {
	state.cates = await request({
		url: '/te/prod/cate/list',
		method: 'get',
	});
};

const activeScreen = ref('');
const cateChange = async () => {
	screens.value = await request({
		url: '/te/allot/param/screens/',
		method: 'get',
		params: { id: form.value.catid },
	});

	nextTick(() => {
		for (let j = 0; j < screens.value.length; j++) {
			screens.value[j].params.forEach((item: any) => {
				console.log(form.value.items);
				for (const formItem of form.value.items) {
					console.log(formItem.parid);
					if (formItem.parid == item.id) {
						listTableRefs.value[j].toggleRowSelection(item, true);
						break;
					}
				}
			});
		}
		if (screens.value.length > 0) {
			activeScreen.value = screens.value[0].id;
		}
	});
};

</script>

<style scoped>

</style>
