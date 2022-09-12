<template>
	<el-sub-menu :index='val.path' :key='val.path' v-if='val.children && val.children.length > 0'>
		<template #title>
			<SvgIcon :name='val.meta.icon' />
			<span>{{ $t(val.meta.title) }}</span>
		</template>
		<!--		<sub-item :chil="val.children" :key="`s-${val.path}`"/>-->
		<!--					<BasicSubMenuItem v-bind="$props" :item="childrenItem" />-->
		<SubItem :item='childrenItem' v-for='childrenItem in val.children' :key="`s-${childrenItem.path}`"/>
		<!--			<sub-item :chil="val.children"/>-->
	</el-sub-menu>
	<template v-else>
		<el-menu-item :index='val.path' :key='val.path'>
			<template v-if='!val.meta.isLink || (val.meta.isLink && val.meta.isIframe)'>
				<SvgIcon :name='val.meta.icon' />
				<span>{{ $t(val.meta.title) }}</span>
			</template>
			<template v-else>
				<a :href='val.meta.isLink' target='_blank' rel='opener' class='w100'>
					<SvgIcon :name='val.meta.icon' />
					<span>{{ $t(val.meta.title) }}</span>
				</a>
			</template>
		</el-menu-item>
	</template>
</template>

<script lang='ts'>
import { computed, defineComponent } from 'vue';

export default defineComponent({
	name: 'navMenuSubItem',
	props: {
		item: {
			type: Object,
			default: () => {
			},
		},
	},
	setup(props) {
		// 获取父级菜单数据
		const val = computed(() => {
			return <any>props.item;
		});
		return {
			val,
		};
	},
});
</script>
