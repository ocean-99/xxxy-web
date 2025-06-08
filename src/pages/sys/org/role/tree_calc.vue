<template>
	<el-dialog v-model='state.show' title='角色树模拟计算' draggable width='500px'>
		<OrgModal ref='orgModal' @close='closeOrgModal' />
		<el-form ref='formRef' :model='form' label-width='120px'>
			<el-form-item label='用户：'>
				<el-input v-model='cdata.loman' readonly @click='lomanModal' />
			</el-form-item>
			<el-form-item label='角色树：' prop='treid'>
				<el-select v-model='form.treid' placeholder=' ' style='width: 100%' @change='rolesInit'>
					<el-option v-for='item in trees' :key='item.id' :label='item.name' :value='item.id' />
				</el-select>
			</el-form-item>
			<el-form-item label='角色：' prop='treid'>
				<el-select v-model='form.rolid' placeholder=' ' style='width: 100%'>
					<el-option v-for='item in roles' :key='item.id' :label='item.name' :value='item.id' />
				</el-select>
			</el-form-item>
			<el-form-item label='计算结果：' prop='notes'>
				<el-input v-model='cdata.reman' readonly></el-input>
			</el-form-item>
		</el-form>

		<template #footer>
      <span class='dialog-footer'>
				<el-button type='primary' @click='calc'>计 算</el-button>
        <el-button @click='state.show = false'>关 闭</el-button>
      </span>
		</template>
	</el-dialog>
</template>

<script lang='ts' setup>
import { computed, defineExpose, reactive, ref, toRaw, toRefs } from 'vue';
import {modalSave} from '/@/comps/page/edit';
import OrgModal from '/@/comps/sys/OrgModal.vue';
import {get} from '/@/utils/req';

const state = reactive({
	url: '/sys/org/rtree', show: false,trees:[] as any,roles:[] as any,
	form: {avtag: true} as any,
});

const {form,trees,roles} = toRefs(state);

const formRef = ref();
const open = async () => {
	state.show = true;
	await treesInit();
};
defineExpose({open});


//region -----组织架构逻辑-----
const orgModal = ref();
const cdata = reactive({}) as any;

const lomanModal = () => {
	orgModal.value.openModal({
		opener: 'loman',
		orgType: 8,
		selectMode: 1
	});
};

const closeOrgModal = (data: any) => {
	if (data.opener == 'loman') {
		if (data.orgs && data.orgs.length > 0) {
			form.value.loman = {};
			form.value.loman = { id: data.orgs[0].id, name: data.orgs[0].name };
			form.value.lomid = data.orgs[0].id;
		} else {
			form.value.loman = null;
			form.value.lomid = null;
		}
	}
};

cdata.loman = computed(() => {
	return form.value.loman ? form.value.loman.name : '';
});

cdata.reman = computed(() => {
	return form.value.reman ? form.value.reman.name : '';
});
//endregion

const treesInit = async () => {
	trees.value = await get({
		url: '/sys/org/rtree/tlist',
	});
};

const rolesInit = async () => {
	roles.value = await get({
		url: '/sys/org/rtree/rlist',
		params:{treid:form.value.treid}
	});
};


const calc = async () => {
	form.value.reman= await get({
		url: '/sys/org/rtree/calc',
		params:{useid:form.value.loman.id,rolid:form.value.rolid}
	});
};


</script>
