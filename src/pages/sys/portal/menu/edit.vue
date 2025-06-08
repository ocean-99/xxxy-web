<template>
	<el-drawer v-model='state.show' size='70%'>
		<template #header>
			<h4>菜单信息<span style='color: green'> [按钮权限在接口角色中定义]</span></h4>
		</template>
		<template #default>
			<div style='padding: 20px;'>
				<el-form ref='formRef' :model='form' :inline='true' class='xform' label-width='160px'>
					<div class='zform-div'>
						<el-form-item label='菜单类型：' style='width:100%' prop='type' :rules="[{ required: true, message: '类型不能为空'}]">
							<el-radio-group v-model='form.type'>
								<el-radio-button label='D'>目录</el-radio-button>
								<el-radio-button label='M'>菜单</el-radio-button>
							</el-radio-group>
						</el-form-item>
						<el-form-item label='菜单名称：' prop='name' :rules="[{ required: true, message: '名称不能为空'}]">
							<el-input v-model='form.name'></el-input>
						</el-form-item>
						<el-form-item label='上级菜单：'>
							<el-input v-model='form.pname' readonly :suffix-icon='Search' @click='openParentModal'></el-input>
							<ParentModal url='/sys/portal/menu/tree' :maInit='true' ref='parentModal' @close='closeParentModal' />
						</el-form-item>
						<el-form-item label='排序号：'>
							<el-input-number v-model='form.ornum' controls-position='right' style='width: 100%' />
						</el-form-item>
						<el-form-item label='是否启用：'>
							<el-switch v-model='form.avtag' />
						</el-form-item>
						<el-form-item label='菜单代码：' prop='code' :rules="[{ required: true, message: '代码不能为空'}]"  v-show="form.type === 'M'||form.type === 'D'">
							<el-input v-model='form.code' @keyup="codeChange"></el-input>
						</el-form-item>
						<el-form-item label='路由地址：' v-show="form.type === 'M'||form.type === 'D'" prop='path'
													:rules="[{ required: form.type === 'M'||form.type === 'D', message: '路由地址不能为空'}]">
							<el-input v-model='form.path'></el-input>
						</el-form-item>
						<el-form-item label='图标：' v-show="form.type === 'M'||form.type === 'D'">
							<IconSelector placeholder='请输入菜单图标' v-model='form.icon'  type='all' style='width: 100%' />
<!--              <IconSelector placeholder='请输入菜单图标' modelValue='form.icon' type='all' style='width: 100%' />-->
						</el-form-item>
						<el-form-item label='是否显示：' v-show="form.type === 'M'||form.type === 'D'">
							<el-switch v-model='form.shtag' />
						</el-form-item>
						<el-form-item label='组件路径：' v-show="form.type === 'M'" prop='comp' :rules="[{ required: form.type === 'M', message: '组件路径不能为空'}]">
							<el-input v-model='form.comp'></el-input>
						</el-form-item>
						<el-form-item label='是否缓存：' v-show="form.type === 'M'">
							<el-switch v-model='form.catag' />
						</el-form-item>
						<el-form-item label='是否Iframe：' v-show="form.type === 'M'">
							<el-switch v-model='form.iftag' />
						</el-form-item>
						<el-form-item label='是否外链：' v-show="form.type === 'M'">
							<el-switch v-model='form.extag' />
						</el-form-item>
						<el-form-item label='创建人：' v-show='form.crtim'>
							<div class='zinput'>{{ form.crman ? form.crman.name : '' }}</div>
						</el-form-item>
						<el-form-item label='创建时间：' v-show='form.crtim'>
							<div class='zinput'>{{ form.crtim }}</div>
						</el-form-item>
						<el-form-item label='更新人：' v-show='form.uptim'>
							<div class='zinput'> {{ form.upman ? form.upman.name : '' }}</div>
						</el-form-item>
						<el-form-item label='更新时间：' v-show='form.uptim'>
							<div class='zinput'>{{ form.uptim }}</div>
						</el-form-item>
						<el-form-item label='备注：' style='width: 100%'>
							<el-input v-model='form.notes' :rows='4' type='textarea' />
						</el-form-item>
					</div>
				</el-form>
			</div>
		</template>
		<template #footer>
			<div style='flex: auto;margin: 20px'>
				<el-button type='primary' @click='confirm'>确认</el-button>
				<el-button @click='state.show = false'>取消</el-button>
			</div>
		</template>
	</el-drawer>

</template>

<script lang='ts' setup>
import { Search } from '@element-plus/icons-vue';
import { onMounted, reactive, ref, toRefs } from 'vue';
import { drawerOpen, drawerSave } from '/@/comps/page/edit';
import IconSelector from '/@/components/iconSelector/index.vue';
import ParentModal from '/@/comps/gen/GenTreeModal.vue';
import { FormInstance } from 'element-plus';

const formRef = ref<FormInstance>();

const state = reactive({
	url: '/sys/portal/menu', show: false, apis: [] as any,
	form: {
    icon:'ele-Tickets',
		avtag: true,
		catag: true,
		shtag: true,
		type: 'M',
	} as any,
});

const { form } = toRefs(state);

//暴露open方法给父组件调用
const open = async (data: any) => {
	if (!data.id) {
		if (data.pid) {
			state.form = {
				avtag: true,
				pname: data.pname,
				pid: data.pid,
				porid: data.porid,
        icon:'ele-Tickets',
				type: 'M',
			};
			state.show = true;
		} else {
			state.form = {
				avtag: true,
				porid: data.porid,
				type: 'M',
			};
			state.show = true;
		}
	} else if (data.id) {
		await drawerOpen({ state, id: data.id });
	}
};
defineExpose({ open });

//取得父组件listQuery方法的调用权
const emits = defineEmits(['treeQuery']);
const confirm = async () => {
	await drawerSave({ formRef: formRef.value, state });
	emits('treeQuery');
};


//页面初始化

onMounted(() => {

});


//region -----上级菜单选择逻辑-----
const parentModal = ref();

const openParentModal = () => {
	parentModal.value.openModal({ reload: true, params: { porid: state.form.porid } });
};

const closeParentModal = (node: any) => {
	if(node){
		form.value.pid = node.id;
		form.value.pname = node.name;
	}else{
		form.value.pid = null;
		form.value.pname = null;
	}
};
//endregion

const codeChange=()=>{
   form.value.path=form.value.code.replace(/([A-Z])/g,"/$1").toLowerCase();
   form.value.comp=form.value.path;
}


</script>

<style scoped>
</style>
