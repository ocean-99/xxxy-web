<template>

	<el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
		<template #header>
			<el-row>
				<el-col :span='10'>
					<div style='line-height: 32px'>转换配置</div>
				</el-col>
				<el-col :span='14' style='text-align: right'>
					<el-button type='success' @click='tabSave({formRef,state,proxy,route})' plain>保 存</el-button>
					<el-button type='info' @click='tabClose({proxy,route})' plain>关 闭</el-button>
				</el-col>
			</el-row>
		</template>
		<CateModal url='oa/flow/cate/tree' ref='cateModal' @close='cateChoose'/>
		<div style='margin-top: 8px;margin-bottom: 8px'>
			<el-form ref="formRef" class='zform' :model='form' label-width='140px'>
				<el-tabs type='card' v-model='activeName'>
					<el-tab-pane label='基本信息' name='tab1'>
						<el-row style='border-top: 1px solid #d2d2d2;'>
							<el-col :span='12'>
								<el-form-item label='转换名称：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]">
									<div class='zinput'>
										<el-input v-model='form.name'></el-input>
									</div>
								</el-form-item>
							</el-col>
							<el-col :span='12'>
								<el-form-item label='所属分类：' prop='catid' :rules="[{ required: true, message: '分类不能为空'}]">
									<div class='zinput'>
										<el-select v-model='form.catid' placeholder='请选择转换分类'>
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
						</el-row>
						<el-row>
							<el-col :span='12'>
								<el-form-item label='转换方式：' prop='trway'>
									<div class='zinput'>
										<el-select v-model='form.trway' placeholder='请选择转换方式'>
											<el-option :value="'a'" :label="'函数'"></el-option>
											<el-option :value="'b'" :label="'概率'"></el-option>
											<el-option :value="'c'" :label="'矩阵'"></el-option>
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
						<el-row>
							<el-col :span='6'>
								<el-form-item label='参数a代码：' prop='trway'>
									<div class='zinput'>
										<el-input v-model='form.pacod'></el-input>
									</div>
								</el-form-item>
							</el-col>
							<el-col :span='6'>
								<el-form-item label='参数a名称：'>
									<div class='zinput'>
										<el-input v-model='form.panam'></el-input>
									</div>
								</el-form-item>
							</el-col>
							<el-col :span='6'>
								<el-form-item label='参数b代码：' prop='trway'>
									<div class='zinput'>
										<el-input v-model='form.pbcod'></el-input>
									</div>
								</el-form-item>
							</el-col>
							<el-col :span='6'>
								<el-form-item label='参数b名称：'>
									<div class='zinput'>
										<el-input v-model='form.pbnam'></el-input>
									</div>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span='6'>
								<el-form-item label='参数c代码：' prop='trway'>
									<div class='zinput'>
										<el-input v-model='form.pccod'></el-input>
									</div>
								</el-form-item>
							</el-col>
							<el-col :span='6'>
								<el-form-item label='参数c名称：'>
									<div class='zinput'>
										<el-input v-model='form.pcnam'></el-input>
									</div>
								</el-form-item>
							</el-col>
							<el-col :span='6'>
								<el-form-item label='参数d代码：' prop='trway'>
									<div class='zinput'>
										<el-input v-model='form.pdcod'></el-input>
									</div>
								</el-form-item>
							</el-col>
							<el-col :span='6'>
								<el-form-item label='参数d名称：'>
									<div class='zinput'>
										<el-input v-model='form.pdnam'></el-input>
									</div>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span='6'>
								<el-form-item label='参数x代码：' prop='trway'>
									<div class='zinput'>
										<el-input v-model='form.pxcod'></el-input>
									</div>
								</el-form-item>
							</el-col>
							<el-col :span='6'>
								<el-form-item label='参数x名称：'>
									<div class='zinput'>
										<el-input v-model='form.pxnam'></el-input>
									</div>
								</el-form-item>
							</el-col>
							<el-col :span='6'>
								<el-form-item label='参数y代码：' prop='trway'>
									<div class='zinput'>
										<el-input v-model='form.pycod'></el-input>
									</div>
								</el-form-item>
							</el-col>
							<el-col :span='6'>
								<el-form-item label='参数y名称：'>
									<div class='zinput'>
										<el-input v-model='form.pynam'></el-input>
									</div>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span='24'>
								<el-form-item label='转换函数：'>
									<div class='zinput' style='height: auto'>
										<el-input style="font-family: 'Courier New', Helvetica, Arial, sans-serif; font-size:14px"
															type='textarea' :rows='8' placeholder='通过后台JS引擎调用JS代码片段，实现abcd转换成xy'
															v-model='form.asfun'>
										</el-input>
									</div>
								</el-form-item>
							</el-col>
						</el-row>
					</el-tab-pane>
					<el-tab-pane label='转换矩阵' name='tab2'>


						<el-table border :data='form.items' :row-style="{height: '36px'}" style='width: 100%'>
							<el-table-column type="index" width="40"  />
							<el-table-column :label='form.panam' width='140'>
								<template #default='scope'>
									<el-input v-model='scope.row.paval' required></el-input>
								</template>
							</el-table-column>
							<el-table-column :label='form.pbnam' width='140'>
								<template #default='scope'>
									<el-input v-model='scope.row.pbval' required></el-input>
								</template>
							</el-table-column>
							<el-table-column :label='form.pcnam' width='140'>
								<template #default='scope'>
									<el-input v-model='scope.row.pcval' required></el-input>
								</template>
							</el-table-column>
							<el-table-column :label='form.pdnam' width='140'>
								<template #default='scope'>
									<el-input v-model='scope.row.pdval' required></el-input>
								</template>
							</el-table-column>
							<el-table-column label="→" width='40'>
								<span>→</span>
							</el-table-column>
							<el-table-column :label='form.pxnam' width='140'>
								<template #default='scope'>
									<el-input v-model='scope.row.pxval' required></el-input>
								</template>
							</el-table-column>
							<el-table-column :label='form.pynam' width='140'>
								<template #default='scope'>
									<el-input v-model='scope.row.pyval' required></el-input>
								</template>
							</el-table-column>
							<el-table-column label='备注'>
								<template #default='scope'>
									<el-input v-model='scope.row.notes' required></el-input>
								</template>
							</el-table-column>
							<el-table-column fixed='right' label='操作' width='50' align='center'>
								<template #header>
									<el-icon :size='22' style='top: 5px;cursor: pointer' color='#666'>
										<ele-CirclePlus @click='addItem' />
									</el-icon>
								</template>
								<template #default='scope'>
									<el-icon :size='22' style='top: 3px;cursor: pointer'>
										<ele-CircleClose @click='form.items.splice(scope.$index, 1)' />
									</el-icon>
								</template>
							</el-table-column>


							<!--							<el-table-column label="Name" width="180">-->
							<!--								<template #default="scope">-->
							<!--									<el-popover effect="light" trigger="hover" placement="top" width="auto">-->
							<!--										<template #default>-->
							<!--											<div>name: {{ scope.row.name }}</div>-->
							<!--											<div>address: {{ scope.row.id }}</div>-->
							<!--										</template>-->
							<!--										<template #reference>-->
							<!--											<el-tag>{{ scope.row.name }}</el-tag>-->
							<!--										</template>-->
							<!--									</el-popover>-->
							<!--								</template>-->
							<!--							</el-table-column>-->
						</el-table>


					</el-tab-pane>
					<el-tab-pane label='其他信息' name='tab3'>
						<el-row style='border-top: 1px solid #d2d2d2;'>
							<el-col :span='24'>
								<el-form-item label='备注：'>
									<div class='zinput' style='height: auto'>
										<el-input style="font-family: 'Courier New', Helvetica, Arial, sans-serif; font-size:16px"
															type='textarea' :rows='4'
															v-model='form.notes'>
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
<script lang="ts">
export default {name: 'teFeatDrive'}
</script>
<script lang='ts' setup>
import { getCurrentInstance, onMounted, reactive, ref, toRefs } from 'vue';
import { editInit, tabSave, tabClose } from '/@/comps/page/edit';
import { useRoute } from 'vue-router';
import CateModal from '/@/comps/gen/GenModal.vue';
import request from '/@/utils/request';

const formRef=ref();
const route = useRoute();
const { proxy } = getCurrentInstance() as any;

const state = reactive({
	url: '/te/tran/main',cates:[] as any,
	params: { path: '', query: '' },
	form: { avtag: true } as any,
});

const { form,cates } = toRefs(state);
const activeName = ref('tab1');

onMounted(async () => {
  await	editInit({state, route});
	await catesInit();
});


//分类弹框逻辑
const catesInit = async () => {
	state.cates = await request({
		url: '/te/tran/cate/list',
		method: 'get',
	});
};

const addItem = () => {
	form.value.items.push({});
};

</script>

<style scoped>

</style>
