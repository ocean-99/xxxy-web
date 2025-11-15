<script setup lang="ts">
import type { UserProfile } from '#/api/system/profile/model';

import { pick } from 'lodash-es';

import { requestClient } from '#/api/request';

const props = defineProps<{ profile: UserProfile }>();

onMounted(() => {
  state.form = pick(props.profile.user, ['userId', 'nickName', 'email', 'phonenumber', 'sex']);
});

const state = reactive({
  form: {} as any,
});

const { form } = toRefs(state);

const userRef = ref();
const rule: any = {
  nickName: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }],
  email: [
    { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: ['blur', 'change'],
    },
  ],
  phonenumber: [
    {
      required: true,
      message: '手机号码不能为空',
      trigger: 'blur',
    },
    { pattern: /^1[3-9|]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
};
const rules = ref(rule);

/** 提交按钮 */
const submit = () => {
  userRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      // await userProfileUpdate(state.form);
      await requestClient.putWithMsg<void>('/system/user/profile', state.form);
    }
  });
};
</script>

<template>
  <div class="mt-[16px] md:w-full lg:w-1/2 2xl:w-2/5">
    <el-form ref="userRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="用户昵称" prop="nickName">
        <el-input v-model="form.nickName" maxlength="30" />
      </el-form-item>
      <el-form-item label="手机号码" prop="phonenumber">
        <el-input v-model="form.phonenumber" maxlength="11" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" maxlength="50" />
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="form.sex">
          <el-radio value="0">男</el-radio>
          <el-radio value="1">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">更新信息</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
