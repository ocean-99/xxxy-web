<template>

	<el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
		<template #header>
			<el-row>
				<el-col :span='10'>
					<div style='line-height: 32px'>特性组件</div>
				</el-col>
				<el-col :span='14' style='text-align: right'>
					<el-button type='success' @click='handleSave' plain>保 存</el-button>
					<el-button type='info' :icon='Download' plain>导出</el-button>
					<el-button type='info' @click='handleClose' plain>关 闭</el-button>
				</el-col>
			</el-row>
		</template>
		<div style='margin-top: 8px;margin-bottom: 8px'>

			<el-form class='zform' :model='form' label-width='140px'>
				<el-tabs type='card' v-model='activeName'>
					<el-tab-pane label='基本信息' name='tab1'>
						<el-row style='border-top: 1px solid #d2d2d2;'>
							<el-col :span='12'>
								<el-form-item label='组件名称：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]">
									<div class='zinput'>
										<el-input v-model='form.name'></el-input>
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

					<el-tab-pane label='参数分配' name='tab3'>
						<el-row style='border-top: 1px solid #d2d2d2;'>
							<el-col :span='6'>
								<el-form-item label='匹配方式：'>
									<div class='zinput'>
										<el-select v-model='form.paway' placeholder='请选择' style='width:100%'>
											<el-option :value="'a'" :label="'自定义'"></el-option>
											<el-option :value="'b'" :label="'通过模板'"></el-option>
										</el-select>
									</div>
								</el-form-item>
							</el-col>
							<el-col :span='6'>
								<el-form-item label='引用模板：'>
									<div class='zinput'>
										<el-select v-model='form.patem' placeholder='请选择' style='width:100%'>
											<el-option :value="'a'" :label="'参数分配001'"></el-option>
											<el-option :value="'b'" :label="'参数分配002'"></el-option>
										</el-select>
									</div>
								</el-form-item>
							</el-col>
							<el-col :span='12'>
								<div class='zinput'>
								</div>
							</el-col>
						</el-row>

						<el-row>
							<el-col :span='24' style='background-color: white'>
								<div style='margin-left: 15px;margin-right: 15px;margin-top: 10px'>
									<el-tabs v-model='activeName2'>
										<el-tab-pane :label='screen.name' :name='screen.id' :key='screen.id' v-for='(screen,i) of screens'>
											<el-table :ref='el =>{ if (el) listTableRefs[i]= el}' :data='screen.params' style='width: 100%;height: 200px'>
												<el-table-column type='selection' width='55' />
												<!--												<el-table-column prop='id' label='参数ID' width='180' />-->
												<el-table-column prop='code' label='参数代码' width='180' />
												<el-table-column prop='name' label='参数名称' width='180' />
												<el-table-column prop='ornum' label='排序号' width='100' />
												<el-table-column label='初始可选项' width='300'>
													<template #default='scope'>
														<el-select v-model='scope.row.options' placeholder=' ' multiple style='width: 100%'>
															<el-option :value="'dt21'" :label="'630kg'"></el-option>
															<el-option :value="'dt22'" :label="'1000kg'"></el-option>
															<el-option :value="'dt3'" :label="'1050kg'"></el-option>
														</el-select>
													</template>
												</el-table-column>
												<el-table-column label='初始默认值' width='180'>
													<template #default='scope'>
														<el-select v-model='scope.row.deval' placeholder=' ' style='width: 100%' clearable>
															<el-option :value="'dt21'" :label="'630kg'"></el-option>
															<el-option :value="'dt22'" :label="'1000kg'"></el-option>
															<el-option :value="'dt3'" :label="'1050kg'"></el-option>
														</el-select>
													</template>
												</el-table-column>


												<el-table-column align='right'>
													<template #header>
														<el-input v-model='search' placeholder='输入参数代码或参数名称做过滤' />
													</template>
													<template #default='scope'>
														<el-input v-model='scope.row.notes' placeholder='备注' />
													</template>
												</el-table-column>
											</el-table>
											<el-pagination
												@size-change='handleQuery' @current-change='handleQuery'
												class='mt8' :pager-count='5' :page-sizes='[10, 20, 30]' background
												:total='25' :current-page='1' :page-size='10'
												layout='total, sizes, prev, pager, next, jumper'
											/>
										</el-tab-pane>
									</el-tabs>
								</div>
							</el-col>
						</el-row>

						<div class='znotes'>
							1.匹配方式如果为自定义，则此界面可以直接分配参数<br>
							2.自定义保存时，为了数据的一致性，也需要将参数分配的数据保存到参数分配的表里，做为一个当前版本的专用分配模板<br>
							3.匹配方式如果为通过模板，则可以引用先前建好的分配模板，提高相似产品的组件，产品或同产品不同版本的数据配置利用率<br>
						</div>

					</el-tab-pane>


					<el-tab-pane label='联动分配' name='tab4'>
						<el-row style='border-top: 1px solid #d2d2d2;'>
							<el-col :span='6'>
								<el-form-item label='匹配方式：'>
									<div class='zinput'>
										<el-select v-model='form.laway' placeholder='请选择' style='width:100%'>
											<el-option :value="'a'" :label="'自定义'"></el-option>
											<el-option :value="'b'" :label="'通过模板'"></el-option>
										</el-select>
									</div>
								</el-form-item>
							</el-col>
							<el-col :span='6'>
								<el-form-item label='引用模板：'>
									<div class='zinput'>
										<el-select v-model='form.latem' placeholder='请选择' style='width: 100%'>
											<el-option :value="'a'" :label="'联动分配001'"></el-option>
											<el-option :value="'b'" :label="'联动分配002'"></el-option>
										</el-select>
									</div>
								</el-form-item>
							</el-col>
							<el-col :span='12'>

							</el-col>
						</el-row>
					</el-tab-pane>

					<el-tab-pane label='校验分配' name='tab5'>
						<el-row style='border-top: 1px solid #d2d2d2;'>
							<el-col :span='6'>
								<el-form-item label='匹配方式：'>
									<div class='zinput'>
										<el-select v-model='form.caway' placeholder='请选择' style='width:100%'>
											<el-option :value="'a'" :label="'自定义'"></el-option>
											<el-option :value="'b'" :label="'通过模板'"></el-option>
										</el-select>
									</div>
								</el-form-item>
							</el-col>
							<el-col :span='6'>
								<el-form-item label='引用模板：'>
									<div class='zinput'>
										<el-select v-model='form.catem' placeholder='请选择' style='width: 100%'>
											<el-option :value="'a'" :label="'校验分配001'"></el-option>
											<el-option :value="'b'" :label="'校验分配002'"></el-option>
										</el-select>
									</div>
								</el-form-item>
							</el-col>
							<el-col :span='12'>
								<div class='zinput'>
								</div>
							</el-col>
						</el-row>
					</el-tab-pane>

					<el-tab-pane label='驱动分配' name='tab6'>
						<el-row style='border-top: 1px solid #d2d2d2;'>
							<el-col :span='6'>
								<el-form-item label='匹配方式：'>
									<div class='zinput'>
										<el-select v-model='form.daway' placeholder='请选择' style='width:100%'>
											<el-option :value="'a'" :label="'自定义'"></el-option>
											<el-option :value="'b'" :label="'通过模板'"></el-option>
										</el-select>
									</div>
								</el-form-item>
							</el-col>
							<el-col :span='6'>
								<el-form-item label='引用模板：'>
									<div class='zinput'>
										<el-select v-model='form.datem' placeholder='请选择' style='width: 100%'>
											<el-option :value="'a'" :label="'校验分配001'"></el-option>
											<el-option :value="'b'" :label="'校验分配002'"></el-option>
										</el-select>
									</div>
								</el-form-item>
							</el-col>
							<el-col :span='12'>
								<div class='zinput'>
								</div>
							</el-col>
						</el-row>
					</el-tab-pane>


					<el-tab-pane label='其他信息' name='tab9'>
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

<script lang='ts' setup>
import { Download } from '@element-plus/icons-vue';
import { getCurrentInstance, nextTick, onMounted, reactive, ref, toRefs } from 'vue';
import request from '/@/utils/request';
import { useRoute } from 'vue-router';


const { proxy } = getCurrentInstance() as any;
// import request from '/@/utils/request';
const route = useRoute();

const state = reactive({
	form: {
		avtag: true,
		venum: 1,
		detag: true,
		coway: 'a',
		paway: 'a',
		laway: 'a',
		caway: 'a',
		dpaway: 'a',
		patem: {},
		options: [
			{ id: 1, name: 11, func1: '', func2: '' },
			{ id: 2, name: 22, func1: '', func2: '' },
		],
	} as any,
	params: {
		path: '',
		query: '',
	},
	cates: [],
	screens: [] as any,
});

const {
	form, params, cates, screens,
} = toRefs(state);


const addItem = () => {
	form.value.options.push({});
};

const activeName = ref('tab1');
const activeName2 = ref('');


const handleClose = () => {
	proxy.mittBus.emit('onCurrentContextmenuClick', Object.assign({}, { contextMenuClickId: 1, ...route }));
};

async function handleSave() {
	form.value.patem.items = [];
	for (let j = 0; j < screens.value.length; j++) {
		for (let i = 0; i < listTableRefs.value[j].getSelectionRows().length; i++) {
			form.value.patem.items.push({ parid: listTableRefs.value[j].getSelectionRows()[i].id });
		}
	}


	if (!form.value.id) {
		await request({
			url: '/te/feat/comp',
			method: 'post',
			data: form.value,
		});
	} else {
		await request({
			url: '/te/feat/comp',
			method: 'put',
			data: form.value,
		});
	}


	handleClose();
}

const myEditInit = async (id: string) => {
	if (id) {
		form.value = await request({
			url: '/te/feat/comp/one/' + id,
			method: 'get',
		});
		cateChange();
	} else {
		form.value = { avtag: true };
	}
};

const listTableRefs = ref([]);
const cateChange = async () => {
	screens.value = await request({
		url: '/te/allot/param/screens/',
		method: 'get',
		params: { id: 'dt' },
	});
	if (screens.value.length > 0) {
		activeName2.value = screens.value[0].id;
	}

	nextTick(() => {
		for (let j = 0; j < screens.value.length; j++) {
			screens.value[j].params.forEach((item) => {
				for (const formItem of form.value.patem.items) {
					console.log(formItem.parid);
					if (formItem.parid == item.id) {
						listTableRefs.value[j].toggleRowSelection(item, true);
						break;
					}
				}
			});
		}
	});
};

onMounted(() => {
	state.params = <any>route;
	if (params.value.query?.id) {
		myEditInit(params.value.query?.id);
	} else {
		cateChange();
	}
});


const modelChoose = (node: any) => {
	form.value.modid = node.id;
	form.value.modna = node.name;
	console.log(node);
};

</script>

<style scoped>

</style>
