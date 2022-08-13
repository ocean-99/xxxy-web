<template>
  <el-upload
      :action='state.uploadUrl' :headers='state.headers'
      :on-preview='handlePreview' style='width:500px' :on-success='handleSuccess'
      :on-remove='handleRemove'
      multiple :limit='10' :on-exceed='handleExceed' v-model:file-list='cform.atts'>
    <el-button type='primary'>上传附件</el-button>
  </el-upload>
</template>

<script lang='ts' setup>
import {ElMessage, ElMessageBox, UploadProps} from "element-plus";
import request from "/@/utils/request";
import {onMounted, reactive, ref, watch} from "vue";
import {Session} from "/@/utils/storage";

const state = reactive({
  uploadUrl: '', headers: {} as any,
});

const props: any = defineProps({
  atts: Array,
});

const cform = ref({
  atts: props.atts,
})

const emit = defineEmits(['update']);

onMounted(() => {
  console.log(props.atts);
  state.uploadUrl = `${import.meta.env.VITE_API_URL}gen/oss/upload`;
  state.headers = { 'Authorization': Session.get('token') };
});

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  console.log(file, uploadFiles);
};

const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
  console.log(uploadFile);
  ElMessageBox.confirm('请选择对应的附件操作', '附件操作',
      {
        confirmButtonText: '下载',
        cancelButtonText: '预览',
        type: 'info',
      },
  ).then(async () => {
    await request({
      url: '/gen/oss/upload',
      method: 'get',
      params: { name: uploadFile.name, path: uploadFile.addre + '/' + uploadFile.id + '.' + uploadFile.sname },
      responseType: 'blob',
    });
  }).catch(() => {

  });
};

const handleSuccess = (a: any, b: any, c: any) => {
  // c[c.length - 1] = { ...a };
  c[c.length - 1].id = a.id;
  c[c.length - 1].name = a.name;
  c[c.length - 1].filid = a.filid;
  c[c.length - 1].filna = a.filna;
  c[c.length - 1].path = a.path;
  c[c.length - 1].ornum = c.length;
  const backAtts=[];
  for (let i = 0; i < c.length ; i++) {
    const backAtt={} as any;
    backAtt.id=c[i].id;
    backAtt.name=c[i].name;
    backAtt.filid=c[i].filid;
    backAtt.filna=c[i].filna;
    backAtt.path=c[i].path;
    backAtt.ornum=c[i].ornum;
    backAtts.push(backAtt);
  }
  emit('update', backAtts);
  // if(form.value.id){
  //   c[c.length - 1].busid=form.value.id;
  // }
};

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
      `The limit is 3, you selected ${files.length} files this time, add up to ${
          files.length + uploadFiles.length
      } totally`,
  );
};


</script>
<style scoped>

</style>
