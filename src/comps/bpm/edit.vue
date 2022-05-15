<template>
	<el-form class='zform' :model='form' label-width='180px'>
		<el-row style='border-top: 1px solid #d2d2d2;'>
			<el-col :span='24'>
				<el-form-item label='流程说明：'>
					<div class='zinput'>
						xxxxxx
					</div>
				</el-form-item>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span='24'>
				<el-form-item label='紧急程度：'>
					<div class='zinput'>
						<el-radio-group v-model='form.opurg'>
							<el-radio :label='1'><span style='color:red'>紧急</span></el-radio>
							<el-radio :label='2'><span style='color:blue'>急</span></el-radio>
							<el-radio :label='3'><span>一般</span></el-radio>
						</el-radio-group>
					</div>
				</el-form-item>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span='24'>
				<el-form-item label='即将流向：'>
					<div class='zinput'>
						N5.部门负责人(张三)
					</div>
				</el-form-item>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span='24'>
				<el-form-item label='处理意见：'>
					<div class='zinput' style='height: auto'>
						<el-input v-model='form.opnot' type='textarea' :rows='5' placeholder=' ' />
					</div>
				</el-form-item>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span='24'>
				<el-form-item label='附件：'>
					<div class='zinput' style='height: auto'>
						<el-upload class='upload-demo' action='https://jsonplaceholder.typicode.com/posts/' :file-list='fileList'>
							<el-button type='primary'>上 传</el-button>
						</el-upload>
					</div>
				</el-form-item>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span='24'>
				<div style='padding-left: 105px;border-right: 1px solid #ccc'>
					<el-checkbox v-model="checked2">流程图</el-checkbox>
				</div>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span='24'>

			</el-col>
		</el-row>
	</el-form>
</template>

<script lang='ts' setup>
import { onMounted, reactive, toRaw, toRefs } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const state = reactive({
	form: {

	},
	params: {
		path: '',
		query: '',
	},
});

const {
	form, params,
} = toRefs(state);


onMounted(() => {
	state.params = <any>route;
	if (params.value.query?.id) {

	}
});

const getOperateInfo =  () => {
	return toRaw(form.value);
};
defineExpose({ getOperateInfo });


// const fileList = ref<UploadUserFile[]>([
// 	{
// 		name: 'food.jpeg',
// 		url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
// 	},
// 	{
// 		name: 'food2.jpeg',
// 		url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
// 	},
// ])

</script>

<style scoped>

</style>
