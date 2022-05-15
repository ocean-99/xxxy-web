<template>
	<div class='p-flex' :style='{ height: `calc(100vh - ${initTagViewHeight}`}'>
		<slot></slot>
	</div>
</template>

<script lang='ts' setup>

//设置高度为100%
import { useStore } from '/@/store';
import { computed } from 'vue';

const store = useStore();
const initTagViewHeight = computed(() => {
	let { isTagsview } = store.state.themeConfig.themeConfig;
	let { isTagsViewCurrenFull } = store.state.tagsViewRoutes;
	if (isTagsViewCurrenFull) {
		return `13px`;
	} else {
		if (isTagsview) return `97px`;
		else return `63px`;
	}
});

</script>
