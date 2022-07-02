<template>
	<div class="preview-container">
		<el-card shadow="hover" header="element-plus 大图预览">
			<el-image style="width: 100px; height: 100px; border-radius: 5px" :src="url" :preview-src-list="srcList" title="点击查看大图预览"> </el-image>
		</el-card>
	</div>
</template>

<script lang="ts">
import { toRefs, reactive, defineComponent } from 'vue';

export default defineComponent({
	name: 'pagesPreview',
	setup() {
		const state = reactive({
			url: 'https://zsvg.gitee.io/vboot-vue/public/xiaoyoutai.png',
			srcList: [
				'https://zsvg.gitee.io/vboot-vue/public/xiaoyoutai.png',
				'https://zsvg.gitee.io/vboot-vue/public/xiaoyoutai.png',
				'https://zsvg.gitee.io/vboot-vue/public/xiaoyoutai.png',
			],
		});
		return {
			...toRefs(state),
		};
	},
});
</script>
