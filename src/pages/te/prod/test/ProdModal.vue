<template>

	<el-dialog v-model='dialogVisible' title='产品选择' width='600px'>
		<div style="height: 600px">
					<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
						<el-tab-pane label="常用型号" name="k1">预设的常用型号
						</el-tab-pane>
						<el-tab-pane label="层次选择" name="k2">
							<el-row>
								<el-col :span="12">
									<div style="height: 390px;">

										<el-card class='box-card' style='height: 100%;' body-style='height: 100%;overflow: auto'>
											<template #header>
												<div class='card-header'>
													<div class='tree-h-flex'>
														<div class='tree-h-left'>
															<el-input :prefix-icon='Search' v-model='filterText' placeholder='产品名称' />
														</div>
														<div class='tree-h-right'>
															<el-dropdown @command='handleCommand'>
																<el-button style='margin-left: 10px;width: 30px'>
																	<el-icon class='el-icon--right'>
																		<more-filled />
																	</el-icon>
																</el-button>
																<template #dropdown>
																	<el-dropdown-menu>
																		<el-dropdown-item command='expandAll'>全部展开</el-dropdown-item>
																		<el-dropdown-item command='collapseAll'>全部折叠</el-dropdown-item>
																		<el-dropdown-item command='refresh'>刷新</el-dropdown-item>
																	</el-dropdown-menu>
																</template>
															</el-dropdown>
														</div>
													</div>
												</div>
											</template>
											<div style='margin-bottom: 45px'>
												<el-tree @node-click='nodeClick' ref='treeRef' class='filter-tree' :data='state.data' :props='defaultProps' :filter-node-method='filterNode' />
											</div>
										</el-card>

									</div>
								</el-col>
								<el-col :span="12">
									<div style="border: 1px solid #ccc;height: 390px;margin-left: 5px;overflow: auto">
										<ul class="z-org-tree">
											<li v-for="item in tierItems" :key="item.id" class="f-user" title="444444444" @click="tierItemClick(item)">
												<Checkbox v-model:checked="item.checked"/>
												<img class="vben-header-user-dropdown__header" src="https://q1.qlogo.cn/g?b=qq&nk=190848757&s=640">
												<span class="layui-elip f-user-name">{{ item.name }}</span>
												<span class="layui-elip f-user-dept">{{ item.dept }}</span>
											</li>
										</ul>
									</div>
								</el-col>
							</el-row>
						</el-tab-pane>
						<el-tab-pane label="偏好模板" name="k3">通过设置的偏好模板选择</el-tab-pane>
					</el-tabs>
		</div>



		<template #footer>
      <span class='dialog-footer'>
        <el-button @click='dialogVisible = false'>取消</el-button>
        <el-button type='primary' @click='handleConfirm'>确认</el-button>
      </span>
		</template>
	</el-dialog>

</template>

<script lang='ts' setup>

import { defineExpose, onMounted, reactive, ref, watch } from 'vue';
import { ElMessage, ElMessageBox, ElTree } from 'element-plus';

import type { TabsPaneContext } from 'element-plus'
import request from '/@/utils/request';
import { Search, MoreFilled } from '@element-plus/icons-vue';


interface Tree {
	id: number;
	name: string;
	children?: Tree[];
}

const filterText = ref('');
const treeRef = ref<InstanceType<typeof ElTree>>();


const defaultProps = {
	children: 'children',
	label: 'name',
};

watch(filterText, (val) => {
	treeRef.value!.filter(val);
});

const filterNode = (value: string, data: Tree) => {
	if (!value) return true;
	return data.name.includes(value);
};


const state = reactive({
	data: [] as any,
	id:'',
	name:'',
	pid: ''
});


const handleCommand = (command: string | number | object) => {
	if ('expandAll' == command) {
		for (let i = 0; i < treeRef.value!.store._getAllNodes().length; i++) {
			treeRef.value!.store._getAllNodes()[i].expanded = true;
		}
	} else if ('collapseAll' == command) {
		for (let i = 0; i < treeRef.value!.store._getAllNodes().length; i++) {
			treeRef.value!.store._getAllNodes()[i].expanded = false;
		}
	}
	ElMessage(`click on item ${command}`);
};


// // 初始化表格数据
const initTreeData = async () => {
	state.data= await request({
		url: '/te/prod/model/tree',
		method: 'get',
	});
};

onMounted(() => {
	initTreeData();
});



const activeName = ref('k2')

const handleClick = (tab: TabsPaneContext, event: Event) => {
	console.log(tab, event)
}

const dialogVisible = ref(false);

const handleClose = (done: () => void) => {
	ElMessageBox.confirm('Are you sure to close this dialog?')
		.then(() => {
			done();
		})
		.catch(() => {
			// catch error
		});
};

const openModal = async (id: string) => {
	dialogVisible.value = true;
};

const emits = defineEmits(['close']);
const handleConfirm=()=>{
	emits('close',{id:state.id,name:state.name,pid:state.pid});
	dialogVisible.value = false;
}

defineExpose({ openModal });


const nodeClick=(node:any)=>{
	state.id=node.id;
	state.name=node.name;
	state.pid=node.pid;
}

</script>

<style scoped>
.dialog-footer button:first-child {
	margin-right: 10px;
}



.layui-elip {
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}

.f-user:before,
.f-user:after {
	content: " ";
	display: table;
}

.f-user:after {
	clear: both;
}

.f-user input, .f-user label {
	float: left;
	margin-top: 14px;
	margin-right: 8px;
}

.f-user img {
	width: 50px;
	height: 50px;
	float: left;
	margin-right: 8px;
}


.f-user .f-user-name,
.f-user .f-user-dept {
	display: block;
}

.f-user .f-user-name {
	margin-top: 6px;
}

.f-user .f-user-dept {
	color: #a599b2;
}

/*最近*/
.z-org-recently li {
	width: 33%;
	float: left;
	cursor: pointer;
	padding: 5px;
}

.z-org-recently li:hover {
	background-color: #f7efec;
}

/*搜索查询*/
.z-org-search li {
	/*width: 280px;*/
	width: 50%;
	float: left;
	cursor: pointer;
	padding: 2px;
//margin: 3px;
}

.z-org-search li:hover {
	background-color: #f7efec;
}

/*!*组织架构树*!*/
.z-org-tree li {
	margin: 3px;
	cursor: pointer;
	padding: 3px;
}

.z-org-tree li:hover {
	background-color: #f7efec;
}

/*已选的*/
.z-org-selected li {
	margin: 3px;
	cursor: pointer;
	padding: 3px;
}

.z-org-selected li:hover {
	background-color: #f7efec;
}

.z-org-selected .f-user .anticon-close-circle {
//float: left;
//position:relative;
	position: absolute;
//position:fixed;
	color: #f26b96;
	font-size: 20px;
	display: none;
	margin-left: 42px;
}

.z-org-selected li:hover .anticon-close-circle {
	display: inline;
}

.z-org-selected .f-user img {
	display: inline;
//float: none;
}

.z-org-selected .f-user-name2 {
	display: block;
	margin-top: 14px;
}

.tree-h-flex {
	display: flex;
}

.tree-h-left {
	flex: 1;
	width: 100%;
}

.tree-h-right {
	width: 40px;
	min-width: 40px;
}


</style>
