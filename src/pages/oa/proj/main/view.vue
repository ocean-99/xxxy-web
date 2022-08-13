<template>
	<el-card class='box-card' :body-style="{padding:'2px 8px'}" shadow='never'>
		<template #header>
			<el-row>
				<el-col :span='10'>
					<div style='line-height: 32px'>项目查看</div>
				</el-col>
				<el-col :span='14' style='text-align: right'>
					<el-button type='success' @click='viewToEdit({proxy,route,state})' plain>编 辑</el-button>
					<el-button type='info' @click='tabClose({proxy,route})' plain>关 闭</el-button>
				</el-col>
			</el-row>
		</template>
		<div style='margin-top: 8px;margin-bottom: 8px'>
			<el-form ref='formRef' :inline='true' class='yform yview' :model='form' label-width='140px'>
				<el-tabs type='card' v-model='activeName'>
					<el-tab-pane label='基本信息' name='tab1'>
						<div class='yform-div'>
							<el-form-item label='项目名称：' style='width:50%'>
								<span class='zinput'>{{form.name}}</span>
							</el-form-item>
              <el-form-item label='项目ID：' style='width: 25%'>
                <span class='zinput'>{{form.id}}</span>
              </el-form-item>
							<el-form-item label='项目编号：' style='width: 25%'>
								<span class='zinput' v-show='form.id' style='margin-left: 5px;color: green'>{{ form.senum }}</span>
								<span class='zinput' v-show='!form.id' style='margin-left: 5px;color: #b9abab'>提交后自动生成</span>
							</el-form-item>
							<el-form-item label='备注：' style='width: 100%'>
								<el-input type='textarea' :rows='4' v-model='form.notes' readonly/>
							</el-form-item>
              <el-form-item label='负责人：' style='width: 100%'>
                <span class='zinput'>{{prmanName}}</span>
              </el-form-item>
							<el-form-item label='项目成员：' style='width: 100%'>
								<el-table size='small' border :data='form.members' :row-style="{height: '36px'}" style='width: 100%'>
									<el-table-column label='#' width='40' prop='ornum' align='center' header-align='center'/>
									<el-table-column label='姓名' width='100'  prop='name'/>
									<el-table-column label='手机号' width='150'>
										<template #default='scope'>
											{{scope.row.monum}}
										</template>
									</el-table-column>
									<el-table-column label='邮箱' width='150'>
										<template #default='scope'>
											<el-input v-model='scope.row.email' required></el-input>
										</template>
									</el-table-column>
									<el-table-column label='性别' width='80'>
										<template #default='scope'>
											<el-select v-model='scope.row.gender' placeholder=' ' style='width: 100%'>
												<el-option value='m' label='男' />
												<el-option value='f' label='女' />
											</el-select>
										</template>
									</el-table-column>
									<el-table-column label='职务' width='180'>
										<template #default='scope'>
											<el-input v-model='scope.row.post'></el-input>
										</template>
									</el-table-column>
									<el-table-column label='备注'>
										<template #default='scope'>
											<el-input v-model='scope.row.notes'></el-input>
										</template>
									</el-table-column>
								</el-table>
							</el-form-item>
							<el-form-item label='相关附件：' style='width: 100%'>
									<table class='att-table'>
										<tr v-for="att in form.atts" :key="att.id">
											<td class='att-td1'>{{att.name}}</td>
											<td class='att-td2'>{{att.zsize}}</td>
											<td class='att-td3'>
												<el-icon :size='18' style='top:4px;margin-right: 8px;cursor: pointer'>
													<ele-Reading/>
												</el-icon>
												<el-icon :size='18' style='top:4px;cursor: pointer'>
													<ele-Download/>
												</el-icon>
											</td>
										</tr>
									</table>

<!--								<el-upload-->
<!--									:action='state.uploadUrl' :headers='state.headers'-->
<!--									:on-preview='handlePreview' style='width:500px' :on-success='handleSuccess'-->
<!--									:on-remove='handleRemove'-->
<!--									multiple :limit='10' :on-exceed='handleExceed' v-model:file-list='form.atts'>-->
<!--								</el-upload>-->

							</el-form-item>
						</div>
					</el-tab-pane>
					<el-tab-pane label='权限信息' name='tab9'>
						<div class='yform-div'>
							<el-form-item label='可查看者：' style='width: 50%'>
								<el-input type='textarea' :rows='4' v-model='viewersName' readonly @click='openViewersModal'>
								</el-input>
							</el-form-item>
							<el-form-item label='可编辑者：' style='width: 50%'>
								<el-input type='textarea' :rows='4' v-model='editorsName' readonly @click='openEditorsModal'>
								</el-input>
							</el-form-item>
							<el-form-item label='创建人：' style='width: 25%'>
								{{ form.crman ? form.crman.name : '' }}
							</el-form-item>
							<el-form-item label='创建时间：' style='width: 25%'>
								<div class='zinput'> {{ form.crtim }}</div>
							</el-form-item>
							<el-form-item label='更新人：' style='width: 25%'>
								{{ form.upman ? form.upman.name : '' }}
							</el-form-item>
							<el-form-item label='更新时间：' style='width: 25%'>
								<div class='zinput'> {{ form.uptim }}</div>
							</el-form-item>
						</div>
					</el-tab-pane>
				</el-tabs>
			</el-form>
		</div>
	</el-card>
</template>
<script lang='ts'>
export default { name: 'OaProjMainEdit}' };
</script>
<script lang='ts' setup>
import {Reading, Download} from '@element-plus/icons-vue';
import { computed, getCurrentInstance, onMounted, reactive, ref, toRefs } from 'vue';
import { viewInit, tabClose,viewToEdit } from '/@/comps/page/view';
import { useRoute } from 'vue-router';
import { FormInstance } from 'element-plus';
import { uuid } from '/@/utils/xutil';
import { Session } from '/@/utils/storage';

const route = useRoute();
const formRef = ref<FormInstance>();
const { proxy } = getCurrentInstance() as any;
const activeName = ref('tab1');

const state = reactive({
	url: '/oa/proj/main', cates: [] as any,
	params: { path: '', query: '' },
	form: { avtag: true, members: [] as any, atts: [] as any } as any,
	uploadUrl: '', headers: {} as any,
});

const { form } = toRefs(state);


onMounted(async () => {
	await viewInit({ state, route });
	state.uploadUrl = `${import.meta.env.VITE_API_URL}gen/oss/upload`;
	state.headers = { 'Authorization': Session.get('token') };
});

//region -----组织架构逻辑-----
const prmanName = computed(() => {
	return form.value.prman ? form.value.prman.name : '';
});

const viewersName = computed(() => {
	let names = '';
	if (form.value.viewers && form.value.viewers.length > 0) {
		for (const user of form.value.viewers) {
			names += user.name + '；';
		}
	}
	return names;
});

const editorsName = computed(() => {
	let names = '';
	if (form.value.editors && form.value.editors.length > 0) {
		for (const user of form.value.editors) {
			names += user.name + '；';
		}
	}
	return names;
});
//endregion


//region -----项目成员逻辑-----
const addItem = () => {
	let newOrnum = 1;
	if (form.value.members.length > 0) {
		newOrnum = form.value.members[form.value.members.length - 1].ornum + 1;
	}
	if (form.value.id) {
		form.value.members.push({
			id: uuid(), maiid: form.value.id, ornum: newOrnum,
		});
	} else {
		form.value.members.push({
			id: uuid(), ornum: newOrnum,
		});
	}
};
//endregiton



//region-----业务字典-----


//endregion


</script>

<style scoped>
.att-table{
	border-collapse: collapse;
	border-spacing: 0;
	border: 1px solid #eee;
}

.att-table td{
	border-left: 1px solid #eee;
	border-width: 0 0 0 1px;
	font-size: inherit;
	margin: 0;
	overflow: visible;
	padding:1px 5px;
	border-bottom: 1px solid #eee;
}

.att-td1{
	width: 400px;
}

.att-td2{
	width: 80px;
	text-align: right;
}

.att-td3{
	width: 70px;
	text-align: center;
}
</style>
