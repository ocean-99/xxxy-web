<script setup lang="ts">
import formCreate from '@form-create/element-ui';
import type { Options, Rule, Api } from '@form-create/element-ui';
import { onMounted, ref, type Ref } from 'vue';

const formData = ref({});
const formApi = ref({}) as Ref<Api>;
const formOptions: Options = {
  form: {
    labelWidth: '100px',
    labelPosition: 'right',
  },
  submitBtn: true,
  resetBtn: true,
};
const rules = ref([
  {
    type: 'group',
    field: 'purchaseList',
    title: '采购清单',
    value: [{ category: '0' }],
    props: {
      rule: [
        {
          type: 'select',
          field: 'category',
          title: '选购类别',
          props: {
            clearable: true,
          },
          options: [
            { label: '蔬菜', value: '0' },
            { label: '水果', value: '1' },
            { label: '肉类', value: '2' },
            { label: '鸡蛋', value: '3' },
          ],
          control: [
            {
              value: '0',
              condition: '==',
              append: 'num',
              rule: [
                {
                  type: 'radio',
                  field: 'goods',
                  title: '商品',
                  options: [
                    { label: '青菜', value: '青菜' },
                    { label: '土豆', value: '土豆' },
                    { label: '番茄', value: '番茄' },
                    { label: '茄子', value: '茄子' },
                    { label: '花菜', value: '花菜', disabled: true },
                  ],
                },
              ],
            },
            {
              value: '1',
              prepend: 'num',
              rule: [
                {
                  type: 'radio',
                  field: 'goods',
                  title: '商品',
                  options: [
                    { label: '苹果', value: '苹果' },
                    { label: '香蕉', value: '香蕉' },
                    { label: '雪梨', value: '雪梨' },
                    { label: '冬枣', value: '冬枣' },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'input',
          field: 'num',
          title: '采购数量',
          link: ['category'],
          value: '44',
          props: {
            type: 'number',
          },
          update(val, rule, fApi, by) {
            console.log('val=', val);
            console.log('rule=', rule);
            console.log('fApi=', fApi);
            console.log('by=', by);
            if (['link', 'init'].every((item) => by.origin !== item)) {
              return;
            }
            const category = fApi.getRule('category').value;
            console.log('category=', category);
            if (category === '2') {
              rule.value = 222;
            }
          },
        },
      ] as Rule[],
    },
  },
] as Rule[]);
onMounted(() => {
  formApi.value?.onSubmit((value) => {
    console.log(value);
  });
});
</script>

<template>
  <div class="base-container flex justify-center">
    <formCreate v-model:api="formApi" v-model="formData" class="w-[768px!important] bg-white p-4" :option="formOptions" :rule="rules" />
  </div>
</template>
