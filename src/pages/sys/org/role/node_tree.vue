<template>
	<el-card class='box-card' style='height: 100%;' body-style='height: 100%;overflow: auto'>
		<template #header>
			<div class='card-header'>
				<div class='tree-h-flex'>
					<div class='tree-h-left'>
						<div>
							<el-input :prefix-icon='Search' v-model='filterText' placeholder='角色节点 可拖拽可右键' />
						</div>
					</div>
					<div class='tree-h-right'>
						<div>
							<el-dropdown @command='handleCommand'>
								<el-button style='margin-left: 8px;width: 34px'>
									<el-icon class='el-icon--center'>
										<MoreFilled />
									</el-icon>
								</el-button>
								<template #dropdown>
									<el-dropdown-menu>
										<el-dropdown-item command='addCate'>新增节点</el-dropdown-item>
										<el-dropdown-item command='expandAll'>全部展开</el-dropdown-item>
										<el-dropdown-item command='collapseAll'>全部折叠</el-dropdown-item>
										<el-dropdown-item command='rootNode'>根节点</el-dropdown-item>
										<el-dropdown-item command='refresh'>刷新</el-dropdown-item>
									</el-dropdown-menu>
								</template>
							</el-dropdown>
						</div>
					</div>
				</div>
			</div>
		</template>
		<div style="margin-bottom: 88px;font-family: 'Courier New', Helvetica, Arial, sans-serif;">
			<el-tree highlight-current @node-contextmenu='rightClick' node-key='id' ref='treeRef' class='filter-tree' :data='state.data' :props='defaultProps'
:filter-node-method='filterNode' @node-click='nodeClick' draggable :allow-drop='allowDrop' :allow-drag='allowDrag' @node-drop='handleDrop' />

			<div :style="{'z-index': 9999,width:'100px',position: 'fixed',left:state.optionCardX + 'px',top: state.optionCardY + 'px', }" v-show='state.optionCardShow' id='option-button-group'>
				<el-button class='option-card-button' @click='addChildCate' style='border-bottom: 0'>新增节点</el-button>
				<el-button class='option-card-button' @click='editCate' style='border-bottom: 0'>修改节点</el-button>
				<el-button class='option-card-button' @click='deleteCate'>删除节点</el-button>
			</div>
			<NodeEdit ref='nodeRef' @close='cateUpdate' />
		</div>
	</el-card>
</template>

<script lang='ts' setup>
import { onMounted, reactive, ref, watch } from 'vue';
import type { ElTree } from 'element-plus';
import { Search, MoreFilled } from '@element-plus/icons-vue';
import req from '/@/utils/req';
import NodeEdit from './node_medit.vue';
import { DragEvents } from 'element-plus/es/components/tree/src/model/useDragNode';
import { useRoute } from 'vue-router';

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
	data: [] as any, cates: [] as any, catid: '',
	optionCardX: '', optionCardY: '', optionCardShow: false, optionData: [],
});

const nodeRef = ref();

const handleCommand = async (command: string | number | object) => {
	if ('expandAll' == command) {
		for (let i = 0; i < treeRef.value!.store._getAllNodes().length; i++) {
			treeRef.value!.store._getAllNodes()[i].expanded = true;
		}
	} else if ('collapseAll' == command) {
		for (let i = 0; i < treeRef.value!.store._getAllNodes().length; i++) {
			treeRef.value!.store._getAllNodes()[i].expanded = false;
		}
	} else if ('refresh' == command) {
		await initTreeData();
	} else if ('rootNode' == command) {
		emits('node-click', { id: '', name: '' });
	} else if ('addCate' == command) {
		nodeRef.value.open({});
	}
};

const cateUpdate = async (updateNode: any, type: string) => {
	if (type == 'add') {
		if (updateNode.pid == null) {
			state.data.push(updateNode);
		} else {
			for (const targetNode of state.data) {
				// if(targetNode.id==updateNode.pid){
				// 	targetNode.children.push(updateNode);
				// 	break;
				// }
				let back = recAddUpdate(updateNode, targetNode);
				if (back) {
					break;
				}
			}
		}
	} else if (type == 'edit') {
		for (const targetNode of state.data) {
			// if(targetNode.id==updateNode.id){
			// 	targetNode.children.push(updateNode);
			// 	break;
			// }
			let back = recEditUpdate(updateNode, targetNode);
			if (back) {
				break;
			}
		}
		currNode.name = updateNode.name;
		currNode.notes = updateNode.notes;
	}
	// await initTreeData();

};

const recAddUpdate = (updateNode: any, targetNode: any) => {
	if (targetNode.id == updateNode.pid) {
		targetNode.children.push(updateNode);
		return true;
	}
	if (targetNode.children) {
		for (const targetSunNode of targetNode.children) {
			let back = recAddUpdate(updateNode, targetSunNode);
			if (back) {
				return true;
			}
		}
	}
	return false;
};

const recEditUpdate = (updateNode: any, targetNode: any) => {
	if (targetNode.id == updateNode.id) {
		targetNode.name = updateNode.name;
		targetNode.notes = updateNode.notes;
		return true;
	}
	if (targetNode.children) {
		for (const targetSunNode of targetNode.children) {
			let back = recEditUpdate(updateNode, targetSunNode);
			if (back) {
				return true;
			}
		}
	}
	return false;
};

let currNode = {} as any;
const emits = defineEmits(['node-click']);
const nodeClick = (node: any) => {
	state.optionCardShow = false;
	currNode = { id: node.id, name: node.name };
	emits('node-click', { id: node.id, name: node.name });
};

const rightClick = (e: any, data: any, n: any, t: any) => {
	state.optionCardShow = false;
	state.optionCardX = e.x;
	state.optionCardY = e.y;
	state.optionData = data;
	state.optionCardShow = true;
	document.addEventListener('click', rightClose);
};

const rightClose = () => {
	state.optionCardShow = false;
	document.removeEventListener('click', rightClose);
};

onMounted(async () => {
	await initTreeData();
});


const initTreeData = async () => {
	state.data = await req.get({
		url: '/sys/org/rnode/treea',
		params:{treid:useRoute().query?.id},
	});
};

//region -----树拖拽逻辑-----
const handleDrop = async (draggingNode: any, dropNode: any, dropType: any, ev: DragEvents) => {
	await req.post({
		url: '/sys/org/rnode/move',
		data: { type: dropType, draid: draggingNode.data.id, droid: dropNode.data.id },
	});
};
const allowDrop = (draggingNode: any, dropNode: any, type: any) => {
	return true;
};
const allowDrag = (draggingNode: any) => {
	return true;
};
//endregion


const addChildCate = () => {
	nodeRef.value.open({ pid: currNode.id });
};
const editCate = () => {
	nodeRef.value.open({ id: currNode.id });
};
const deleteCate = async () => {
	await req.dele({
		url: '/sys/org/rnode/' + currNode.id,
	});
	treeRef.value!.remove(currNode);
};
</script>

<style scoped>
.tree-h-flex {
	display: flex;
}

.tree-h-left {
	flex: 1;
	width: 100%;
}

.tree-h-right {
	width: 42px;
	min-width: 42px;
}

.option-card-button {
	width: 100%;
	margin-left: 0;
	font-size: 10px;
	border-radius: 0;
}
</style>
