<template>

	<el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
		<template #header>
			<el-row>
				<el-col :span='10'>
					<div style='line-height: 32px'>特性驱动</div>
				</el-col>
				<el-col :span='14' style='text-align: right'>
					<el-button type='success' @click='tabSave({formRef,state,proxy,route})' plain>保 存</el-button>
					<el-button type='info' plain>复 制</el-button>
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
								<el-form-item label='驱动名称：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]">
									<div class='zinput'>
										<el-input v-model='form.name'></el-input>
									</div>
								</el-form-item>
							</el-col>
							<el-col :span='12'>
								<el-form-item label='所属产品分类：' prop='catid' :rules="[{ required: true, message: '分类不能为空'}]">
									<div class='zinput'>
										<el-select v-model='form.catid' placeholder='请选择产品分类'>
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
						<el-row>
							<el-col :span='24'>
								<el-form-item label='驱动函数：'>
									<div class='zinput' style='height: auto'>
										<el-input v-model='form.rule' type='textarea' :rows='6' placeholder='通过后台JS引擎调用JS代码片段，驱动相关土建图参数' />
									</div>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row v-show="form.chway=='a'">
							<el-col :span='24'>
								<el-form-item label='驱动EXCEL：'>
									<div class='zinput' style='height: auto'>
										<el-upload
											class="upload-demo"
											action="https://jsonplaceholder.typicode.com/posts/"
											:on-preview="handlePreview"
											:on-remove="handleRemove"
											:before-remove="beforeRemove"
											multiple
											:limit="3"
											:on-exceed="handleExceed"
											:file-list="fileList"
										>
											<el-button type="primary">点击上传</el-button>
											<template #tip>
												<div class="el-upload__tip">请上传校验excel</div>
											</template>
										</el-upload>
									</div>
								</el-form-item>
							</el-col>
						</el-row>
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
	url: '/te/feat/drive',cates:[] as any,
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
		url: '/te/prod/cate/list',
		method: 'get',
	});
};


</script>

<style scoped>

</style>
