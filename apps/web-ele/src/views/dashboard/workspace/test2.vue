<script setup lang="ts">
import type { Api, Options, Rule } from '@form-create/element-ui';

import { Page } from '@vben/common-ui';

import formCreate from '@form-create/element-ui';

import { RePhoneInput } from '#/components/RePhoneInput';
import AnalyticsTrends from '#/views/dashboard/analytics/analytics-trends.vue';

formCreate.component('RePhoneInput', RePhoneInput);
const option: Options = {
  form: {
    inline: false,
    hideRequiredAsterisk: false,
    labelPosition: 'right',
    size: 'default',
    labelWidth: '125px',
  },
  resetBtn: { show: false, innerText: '重置' },
  submitBtn: { show: true, innerText: '提交' },
  formData: { Ftc0mb3atvirabc: '4321' },
};
const rule = ref([
  {
    type: 'input',
    field: 'xaa',
    title: '测试',
    info: '',
    $required: false,
    _fc_id: 'id_Fz31mb3atviracc',
    name: 'ref_Flwemb3atviradc',
    display: true,
    hidden: false,
    _fc_drag_tag: 'input',
  },
  {
    type: 'RePhoneInput',
    field: 'phone',
    title: '手机号',
    value: '4312',
    props: {
      perfix: '+44',
    },
    on: {
      validate(isVaild: boolean) {
        isVaild && alert('校验通过');
      },
    },
    validate: [{ message: '手机号不正确', required: true }],
  },
] as Rule[]);

const fapi = ref({}) as Ref<Api>;
const formData = ref({});

const onSubmit = (formData: any) => {
  // todo 提交表单
  console.log(formData);
};
</script>

<template>
  <Page auto-content-height>
    <el-card>
      <AnalyticsTrends />
      <form-create v-model="formData" v-model:api="fapi" :rule="rule" :option="option" @submit="onSubmit" />
    </el-card>
  </Page>
</template>

<style scoped lang="scss"></style>
