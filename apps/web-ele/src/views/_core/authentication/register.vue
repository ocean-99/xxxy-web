<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import type { CaptchaResponse } from '#/api/core/captcha';

import { computed, h, onMounted, ref } from 'vue';

import { AuthenticationRegister, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { ElMessage } from 'element-plus';

import { captchaImage } from '#/api/core/captcha';
import { requestClient } from '#/api/request';
import {useRouter} from "vue-router";

defineOptions({ name: 'Register' });

const loading = ref(false);

const captchaInfo = ref<CaptchaResponse>({
  captchaEnabled: true,
  img: '',
  uuid: '',
});

// 验证码loading
const captchaLoading = ref(false);
async function loadCaptcha() {
  try {
    captchaLoading.value = true;

    const resp = await captchaImage();
    if (resp.captchaEnabled) {
      resp.img = `data:image/png;base64,${resp.img}`;
    }
    captchaInfo.value = resp;
  } catch (error) {
    console.error(error);
  } finally {
    captchaLoading.value = false;
  }
}

onMounted(async () => {
  // await Promise.all([loadCaptcha(), loadTenant()]);
  await Promise.all([loadCaptcha()]);
});

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.usernameTip'),
      },
      fieldName: 'username',
      label: $t('authentication.username'),
      rules: z.string().min(1, { message: $t('authentication.usernameTip') }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        passwordStrength: true,
        placeholder: $t('authentication.password'),
      },
      fieldName: 'password',
      label: $t('authentication.password'),
      renderComponentContent() {
        return {
          strengthText: () => $t('authentication.passwordStrength'),
        };
      },
      rules: z.string().min(1, { message: $t('authentication.passwordTip') }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('authentication.confirmPassword'),
      },
      dependencies: {
        rules(values) {
          const { password } = values;
          return z
            .string({ required_error: $t('authentication.passwordTip') })
            .min(1, { message: $t('authentication.passwordTip') })
            .refine((value) => value === password, {
              message: $t('authentication.confirmPasswordTip'),
            });
        },
        triggerFields: ['password'],
      },
      fieldName: 'confirmPassword',
      label: $t('authentication.confirmPassword'),
    },
    {
      component: 'VbenInputCaptcha',
      componentProps: {
        captcha: captchaInfo.value.img,
        class: 'focus:border-primary',
        onCaptchaClick: loadCaptcha,
        placeholder: $t('authentication.code'),
        loading: captchaLoading.value,
      },
      dependencies: {
        if: () => captchaInfo.value.captchaEnabled,
        triggerFields: [''],
      },
      fieldName: 'code',
      label: $t('authentication.code'),
      rules: z
        .string()
        .min(1, { message: $t('authentication.verifyRequiredTip') }),
    },
    {
      component: 'VbenCheckbox',
      fieldName: 'agreePolicy',
      renderComponentContent: () => ({
        default: () =>
          h('span', [
            $t('authentication.agree'),
            h(
              'a',
              {
                class: 'vben-link ml-1 ',
                href: '',
              },
              `${$t('authentication.privacyPolicy')} & ${$t('authentication.terms')}`,
            ),
          ]),
      }),
      rules: z.boolean().refine((value) => !!value, {
        message: $t('authentication.agreeTip'),
      }),
    },
  ];
});

const router = useRouter();
async function handleSubmit(value: Recordable<any>) {
  console.log('register submit:', value);
  const body = {
    clientId: import.meta.env.VITE_GLOB_APP_CLIENT_ID,
    username: value.username,
    password: value.password,
    grantType: 'password',
    userType: 'sys_user',
    code: value.code,
    uuid: captchaInfo.value.uuid,
  } as any;
  await requestClient.post('/auth/register', body);
  ElMessage.success('注册成功');
  router.push('/auth/login');
}
</script>

<template>
  <AuthenticationRegister
    :form-schema="formSchema"
    :loading="loading"
    @submit="handleSubmit"
  />
</template>
