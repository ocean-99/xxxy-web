<template>
	<el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
		<template #header>
			<el-row>
				<el-col :span='10'>
					<div style='line-height: 32px'>联动分配</div>
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
								<el-form-item label='排序号：'>
									<div class='zinput'>
										<el-input-number v-model='form.ornum' controls-position='right' style='width: 100%' />
									</div>
								</el-form-item>
							</el-col>
							<el-col :span='12'>
								<el-form-item label='是否可用：'>
									<div class='zinput'>
										<el-switch v-model='form.avtag'>
										</el-switch>
									</div>
								</el-form-item>
							</el-col>
						</el-row>
					</el-tab-pane>
					<el-tab-pane label='联动分配' name='tab2'>
						<div style='margin-left: 15px;margin-right: 15px'>
							<el-table ref='listTableRef' :data='links' style='width: 100%;height: 500px'>
								<el-table-column type='selection' width='55' />
								<el-table-column prop='name' label='联动名称' width='180' />
								<el-table-column prop='ornum' label='排序号' width='100' />
								<el-table-column prop='notes' label='备注' />
							</el-table>
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
export default { name: 'teAllotLink' };
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
	url: '/te/allot/link', cates: [] as any,
	params: { path: '', query: '' }, links: [] as any,
	form: { avtag: true, items: [] as any } as any,
});

const { form, cates, links } = toRefs(state);
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


const listTableRef = ref();
const save = async () => {
	form.value.items = [];
	for (let i = 0; i < listTableRef.value.getSelectionRows().length; i++) {
		form.value.items.push({ linid: listTableRef.value.getSelectionRows()[i].id });
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

const cateChange = async () => {
	links.value = await request({
		url: '/te/allot/link/links/',
		method: 'get',
		params: { id: form.value.catid },
	});

	await nextTick(() => {
		links.value.forEach((item: any) => {
			for (const fitem of form.value.items) {
				if (fitem.linid == item.id) {
					listTableRef.value.toggleRowSelection(item, true);
					break;
				}
			}
		});
	});
};

</script>

<style scoped>

</style>
