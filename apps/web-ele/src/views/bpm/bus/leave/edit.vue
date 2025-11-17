<script lang="ts" setup>
import { requestClient } from '#/api/request';
import { formSave } from '#/utils/page/edit';

const props = defineProps({
  // eslint-disable-next-line vue/require-default-prop
  busid: { type: String, required: false },
});

const formRef = ref();

const state = reactive({
  url: '/bpm/bus/leave',
  form: {} as any,
});

const { form } = toRefs(state);

const options = [
  {
    value: '1',
    label: '事假',
  },
  {
    value: '2',
    label: '调休',
  },
  {
    value: '3',
    label: '病假',
  },
  {
    value: '4',
    label: '婚假',
  },
];

const save = async (flowBo: any) => {
  state.form.flowBo = flowBo;
  return await formSave({ state, formRef: formRef.value });
};

defineExpose({ save });

onMounted(async () => {
  if (props.busid) {
    state.form = await requestClient.get(`${state.url}/info/${props.busid}`);
  }
});
</script>

<template>
  <el-form ref="formRef" :model="form" label-width="140px">
    <!--        <el-form-item label="请假主题" prop="name" :rules="[{ required: true, message: '请假主题不能为空' }]">-->
    <!--          <el-input v-model="form.name" />-->
    <!--        </el-form-item>-->
    <el-form-item label="请假类型" prop="leaveType">
      <el-select v-model="form.type" placeholder="请选择请假类型" style="width: 100%">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="请假开始日期">
      <el-date-picker v-model="form.sttim" type="date" value-format="YYYY-MM-DD HH:mm:ss" />
    </el-form-item>
    <el-form-item label="请假结束日期">
      <el-date-picker v-model="form.entim" type="date" value-format="YYYY-MM-DD HH:mm:ss" />
    </el-form-item>
    <el-form-item label="请假天数" prop="leaveDays">
      <el-input v-model="form.days" disabled type="number" placeholder="请输入请假天数" />
    </el-form-item>
    <el-form-item label="请假原因" prop="remark">
      <el-input v-model="form.reason" type="textarea" :rows="3" placeholder="请输入请假原因" />
    </el-form-item>
  </el-form>
</template>
