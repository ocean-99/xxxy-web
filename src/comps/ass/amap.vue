<template>
  <div class="amap-dialog">
    <el-dialog v-model='dialogVisible' title='地址选择' draggable width='90%' >
      <div style="height: 700px;overflow: hidden">
        <iframe :src="state.amapSrc" frameborder="0" height="100%" width="100%"></iframe>
<!--        <iframe :src="http://localhost:868/ass/amap.html?adcoo=&adreg=&addet=&adzoo=&v=" frameborder="0" height="100%" width="100%"></iframe>-->
      </div>
      <!--    <template #footer>-->
      <!--      <span class='dialog-footer'>-->
      <!--				<el-button type='primary' @click='handleConfirm'>确 认</el-button>-->
      <!--        <el-button @click='dialogVisible = false'>取 消</el-button>-->
      <!--      </span>-->
      <!--    </template>-->
    </el-dialog>
  </div>
</template>

<script lang='ts' setup>
import {defineExpose, onMounted, reactive, ref} from 'vue';


const state = reactive({
  data: [] as any,
  amapSrc:'',
});


const dialogVisible = ref(false);
const openModal = async (data:any) => {
  if(data&&data.adcoo){
    state.amapSrc=import.meta.env.VITE_PUBLIC_PATH+'ass/amap.html?adcoo='
        +data.adcoo+'&adreg='+data.adreg+'&addet='+data.addet+'&adzoo='+data.adzoo+'&v=';
  }else{
    state.amapSrc=import.meta.env.VITE_PUBLIC_PATH+'ass/amap.html?adcoo=&adreg=&addet=&adzoo=&v=';
  }
  dialogVisible.value = true;
};

defineExpose({openModal});

onMounted(() => {

});

const emits = defineEmits(['close']);
const handleConfirm = () => {
  emits('close', {id: '333'});
  dialogVisible.value = false;
};

window.addressChooseBack=function (data:any){
  emits('close', data);
  dialogVisible.value = false;
}
</script>
<style scoped>

</style>
