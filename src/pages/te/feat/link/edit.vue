<template>

	<el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
		<template #header>
			<el-row>
				<el-col :span='10'>
					<div style='line-height: 32px'>联动配置</div>
				</el-col>
				<el-col :span='14' style='text-align: right'>
					<el-button type='success' @click='tabSave({formRef,state,proxy,route})' plain>保 存</el-button>
					<el-button type='info' plain>模拟测试</el-button>
					<el-button type='info' plain>复 制</el-button>
					<el-button type='info' @click='tabClose({proxy,route})' plain>关 闭</el-button>
				</el-col>
			</el-row>
		</template>
		<CateModal url='oa/flow/cate/tree' ref='cateModal' @close='cateChoose' />
		<div style='margin-top: 8px;margin-bottom: 8px'>
			<el-form ref="formRef" class='zform' :model='form' label-width='140px'>
				<el-tabs type='card' v-model='activeName'>
					<el-tab-pane label='基本信息' name='tab1'>
						<el-row style='border-top: 1px solid #d2d2d2;'>
							<el-col :span='12'>
								<el-form-item label='联动名称：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]">
									<div class='zinput'>
										<el-input v-model='form.name'></el-input>
									</div>
								</el-form-item>
							</el-col>
							<el-col :span='6'>
								<el-form-item label='所属分类：' prop='catid' :rules="[{ required: true, message: '分类不能为空'}]">
									<div class='zinput'>
										<el-select v-model='form.catid' placeholder='请选择产品分类' style='width: 100%' @change='cateChange'>
											<el-option
												v-for='item in state.cates'
												:key='item.id'
												:label='item.name'
												:value='item.id'
											/>
										</el-select>
									</div>
								</el-form-item>
							</el-col>
							<el-col :span='6'>
								<el-form-item label='所属型号：'>
									<div class='zinput'>
										<el-select v-model='form.modid' placeholder='请选择产品型号' style='width: 100%'>
											<el-option
												v-for='item in state.models'
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
							<el-col :span='6'>
								<el-form-item label='触发参数：' prop='trway'>
									<div class='zinput'>
										<el-select filterable v-model='form.trpar' style='width: 100%'>
											<el-option
												v-for='item in state.zparams'
												:key='item.id'
												:label='item.name'
												:value='item.id'
											/>
										</el-select>
									</div>
								</el-form-item>
							</el-col>
							<el-col :span='6'>
								<el-form-item label='触发方式：'>
									<div class='zinput'>
										<el-select v-model='form.trway' placeholder='请选择触发方式' style='width: 100%'>
											<el-option :value="'a'" :label="'值改变'"></el-option>
											<el-option :value="'b'" :label="'点击'"></el-option>
											<el-option :value="'c'" :label="'失去焦点'"></el-option>
										</el-select>
									</div>
								</el-form-item>
							</el-col>
							<el-col :span='6'>
								<el-form-item label='触发条件[可空]：'>
									<div class='zinput'>
										<el-input v-model='form.trcon'></el-input>
									</div>
								</el-form-item>
							</el-col>
							<el-col :span='6'>
								<el-form-item label='触发顺序：'>
									<div class='zinput'>
										<el-input v-model='form.trnum'></el-input>
									</div>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span='12'>
								<el-form-item label='联动方式：' prop='trway'>
									<div class='zinput'>
										<el-select v-model='form.liway' placeholder='请选择联动方式'>
											<el-option :value="'a'" :label="'矩阵'"></el-option>
											<el-option :value="'b'" :label="'函数'"></el-option>
											<el-option :value="'c'" :label="'excel'"></el-option>
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
								<el-form-item label='联动函数：'>
									<div class='zinput' style='height: auto'>
										<el-input style="font-family: 'Courier New', Helvetica, Arial, sans-serif; font-size:14px"
															type='textarea' :rows='8' placeholder='通过后台JS引擎调用JS代码片段，实现abcd联动xy'
															v-model='form.lifun'>
										</el-input>
									</div>
								</el-form-item>
							</el-col>
						</el-row>

						<div class='znotes'>
							1.当选择了型号好，此联动在联动分配时只出现在对应的型号下<br>
						</div>
					</el-tab-pane>
					<el-tab-pane label='联动矩阵' name='tab2'>


						<el-table border :data='form.items' :row-style="{height: '36px'}" style='width: 100%'>
							<el-table-column type='index' width='40' />
							<el-table-column label='控制项' width='400'>
								<template #default='scope'>
									<div>
										<el-button type='info' plain @click='addCondition(scope.row)'>增加条件</el-button>
										<div :key='left.id' v-for='left of scope.row.lefts' style='margin-top: 5px'>
											<el-select filterable v-model='left.copar' style='width:160px;margin-right:5px'>
												<el-option
													v-for='item in zparams'
													:key='item.id'
													:label='item.name'
													:value='item.id'
												/>
											</el-select>

											<el-select v-model='left.coway' style='width:100px;margin-right:5px'>
												<el-option :value="'a'" :label="'>'"></el-option>
												<el-option :value="'b'" :label="'>='"></el-option>
												<el-option :value="'c'" :label="'='"></el-option>
												<el-option :value="'d'" :label="'<='"></el-option>
												<el-option :value="'e'" :label="'<'"></el-option>
												<el-option :value="'f'" :label="'!='"></el-option>
												<el-option :value="'g'" :label="'in'"></el-option>
											</el-select>

											<el-input v-model='left.coval' style='width:100px;margin-right:5px'>

											</el-input>
										</div>
									</div>
								</template>
							</el-table-column>
							<el-table-column label='→' width='40'>
								<span>→</span>
							</el-table-column>
							<el-table-column label='被控制项' width='700'>
								<template #default='scope'>
									<div>
										<el-button type='info' plain @click='addEffect(scope.row)'>增加影响</el-button>
										<div :key='right.id' v-for='right of scope.row.rights' style='margin-top: 5px'>
											<el-select filterable v-model='right.efpar' style='width:160px;margin-right:5px' @change='efparChange(right)'>
												<el-option
													v-for='item in zparams'
													:key='item.id'
													:label='item.name'
													:value='item.id'
												/>
											</el-select>
											<el-select v-model='right.efway' style='width:100px;margin-right:5px' @change='efwayChange(right)'>
												<el-option :value="'a'" :label="'值改变'"></el-option>
												<el-option :value="'b'" :label="'可选项'"></el-option>
												<el-option :value="'c'" :label="'显示隐藏'"></el-option>
												<el-option :value="'d'" :label="'是否只读'"></el-option>
											</el-select>

											<template v-if="right.efway=='a'">
												<el-input v-model='right.efval' style='width:300px;margin-right:5px'></el-input>
											</template>
											<template v-else-if="right.efway=='b'">
												<el-select v-model='right.efops' style='width:300px;margin-right:5px' multiple>
													<el-option v-for='item in right.options' :key='item.id' :label='item.name' :value='item.id' />
												</el-select>
											</template>
											<template v-else-if="right.efway=='c'">
												<el-input v-model='right.efval' style='width:300px;margin-right:5px'></el-input>
											</template>
											<template v-else>
												<el-input v-model='right.efval' style='width:300px;margin-right:5px'></el-input>
											</template>
										</div>
									</div>
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
					<el-tab-pane label='其他信息' name='tab9'>
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
export default { name: 'teFeatLinkEdit' };
</script>
<script lang='ts' setup>
import { getCurrentInstance, onMounted, reactive, ref, toRefs } from 'vue';
import { tabSave, tabClose } from '/@/comps/page/edit';
import { useRoute } from 'vue-router';
import request from '/@/utils/request';

const formRef=ref();
const route = useRoute();
const { proxy } = getCurrentInstance() as any;

const state = reactive({
	url: '/te/feat/link',
	params: { path: '', query: '' },
	form: { avtag: true } as any,
	cates: [] as any, zparams: [] as any, models: [] as any,
});

const { form } = toRefs(state);
const activeName = ref('tab1');

onMounted(() => {
	editInitx();
});

const catesInit = async () => {
	state.cates = await request({
		url: '/te/prod/cate/list',
		method: 'get',
	});
};

const cateChange = async () => {
	state.models = await request({
		url: '/te/prod/model/list',
		method: 'get',
		params: { catid: form.value.catid },
	});
	form.value.modid = '';
};

const modelsInit = async () => {
	state.models = await request({
		url: '/te/prod/model/list',
		method: 'get',
		params: { catid: form.value.catid },
	});
};

const paramsInit = async () => {
	state.zparams = await request({
		url: '/te/feat/param/list',
		method: 'get',
		params: { catid: 'dt' },
	});
};

const editInitx = async () => {
	state.params = <any>route;
	let id = state.params.query?.id;
	if (id) {
		form.value = await request({
			url: '/te/feat/link/one/' + id,
			method: 'get',
		});
		await modelsInit();
	} else {
		form.value = { avtag: true };
	}
	await catesInit();
	await paramsInit();
};


//联动矩阵逻辑
const addItem = () => {
	form.value.items.push({ lefts: [], rights: [] });
};
const addCondition = (row: any) => {
	row.lefts.push({});
};

const addEffect = (row: any) => {
	row.rights.push({});
};

const efparChange = (right: any) => {
	right.efway = '';
	right.efval = '';
};

const efwayChange = async (right: any) => {
	right.efval = '';
	if (right.efway == 'b') {
		right.options = await request({
			url: '/te/feat/param/options/' + right.efpar,
			method: 'get',
		});
	}
};

</script>

<style scoped>

</style>
