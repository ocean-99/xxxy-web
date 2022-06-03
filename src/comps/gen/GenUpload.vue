<template>
  <el-dialog v-model='dialogVisible' title='文件上传' draggable width='500px' :before-close='handleClose'>
    <el-upload
        class="upload-demo"
        drag  ref="upload"
        :headers="state.headers"
        :action="state.uploadUrl"
        :auto-upload="false"
    >
      <el-icon class="el-icon--upload">
        <upload-filled/>
      </el-icon>
      <div class="el-upload__text">
        将文件拖到此处，或<em>点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          请选择.xlsx的文件上传
        </div>
      </template>
    </el-upload>

    <template #footer>
      <span class='dialog-footer'>
				<el-button type='primary' @click='handleConfirm'>确 认</el-button>
        <el-button @click='dialogVisible = false'>取 消</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script lang='ts' setup>
import { defineExpose, onMounted, reactive, ref } from 'vue';
import { UploadFilled } from '@element-plus/icons-vue'
import {Session} from "/@/utils/storage";
import {ElMessage} from "element-plus";

const props = defineProps({
  url: String,
});


const state = reactive({
  data: [] as any,
  uploadUrl:'',
  headers:{} as any
});

const upload = ref()

const dialogVisible = ref(false);
const openModal = async () => {
  state.uploadUrl=`${import.meta.env.VITE_API_URL}sa/agent/main/imp`
  dialogVisible.value = true;
};

defineExpose({ openModal });

onMounted(() => {
  state.headers={"Authorization": Session.get("token")}
});

const emits = defineEmits(['close']);
const handleConfirm = () => {
  ElMessage.warning("演示模式不支持导入")
  //upload.value!.submit();
  emits('close', { id: '333' });
  dialogVisible.value = false;
};

const clearAndcloseModal = () => {
  emits('close', null);
  dialogVisible.value = false;
};



</script>
<style scoped>

</style>
