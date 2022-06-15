<template>
	<div class='yform-div'>
<!--		<el-form-item label='备注：' style='width: 100%' prop='notes' :rules="[{ required: true, message: '备注不能为空'}]">-->
		<el-form-item label='备注：' style='width: 100%'>
			<el-input type='textarea' :rows='4' v-model='cform.notes' />
		</el-form-item>
		<el-form-item label='可查看者：' style='width: 50%'>
			<el-input type='textarea' :rows='4' v-model='viewersName' readonly @click='openViewersModal'>
			</el-input>
		</el-form-item>
		<el-form-item label='可编辑者：' style='width: 50%'>
			<el-input type='textarea' :rows='4' v-model='editorsName' readonly @click='openEditorsModal'>
			</el-input>
		</el-form-item>
		<el-form-item label='创建人：' style='width: 25%'>
			<div class='zinput'> {{ form.crman ? form.crman.name : '' }}</div>
		</el-form-item>
		<el-form-item label='创建时间：' style='width: 25%'>
			<div class='zinput'> {{ form.crtim }}</div>
		</el-form-item>
		<el-form-item label='更新人：' style='width: 25%'>
			<div class='zinput'> {{ form.upman ? form.upman.name : '' }}</div>
		</el-form-item>
		<el-form-item label='更新时间：' style='width: 25%'>
			<div class='zinput'> {{ form.uptim }}</div>
		</el-form-item>
	</div>
</template>

<script lang='ts' setup>
import { computed, ref, toRaw, watch } from 'vue';

const props: any = defineProps({
	form: Object,
	orgModal: Object,
});

const cform = ref({
	notes: props.form.notes,
	viewers: props.form.viewers,
	editors: props.form.editors,
}) as any;

const emit = defineEmits(['update']);
watch(
	cform,
	(newValue) => {
		emit('update', newValue);
	},
	{
		deep: true,
	},
);

const openViewersModal = () => {
	props.orgModal.openModal({
		opener: 'viewers',
		orgType: 11,
		selectMode: 2,
		orgs: toRaw(cform.value.viewers),
	});
};

const openEditorsModal = () => {
	props.orgModal.openModal({
		opener: 'editors',
		orgType: 11,
		selectMode: 2,
		orgs: toRaw(cform.value.editors),
	});
};

const closeOrgModal = (data: any) => {
	let flag = false;
	if (data.opener == 'viewers') {
		if (data.orgs && data.orgs.length > 0) {
			cform.value.viewers = data.orgs;
		} else {
			cform.value.viewers = null;
		}
		flag = true;
	} else if (data.opener == 'editors') {
		if (data.orgs && data.orgs.length > 0) {
			cform.value.editors = data.orgs;
		} else {
			cform.value.editors = null;
		}
		flag = true;
	}
	return flag;
};


const viewersName = computed(() => {
	let names = '';
	if (cform.value.viewers && cform.value.viewers.length > 0) {
		for (const user of cform.value.viewers) {
			names += user.name + '；';
		}
	}
	return names;
});

const editorsName = computed(() => {
	let names = '';
	if (cform.value.editors && cform.value.editors.length > 0) {
		for (const user of cform.value.editors) {
			names += user.name + '；';
		}
	}
	return names;
});

defineExpose({ closeOrgModal });

</script>

<style scoped>

</style>
