<script setup lang="ts">
import { userUpdatePassword } from '#/api/system/profile';

const pwdRef = ref();
const user = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
} as any);

const equalToPassword = (rule: any, value: string, callback: any) => {
  if (user.value.newPassword === value) {
    callback();
  } else {
    callback(new Error('两次输入的密码不一致'));
  }
};
const rules = ref({
  oldPassword: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '新密码不能为空', trigger: 'blur' },
    {
      min: 6,
      max: 20,
      message: '长度在 6 到 20 个字符',
      trigger: 'blur',
    },
    { pattern: /^[^<>"'|\\]+$/, message: String.raw`不能包含非法字符：< > " ' \ |`, trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '确认密码不能为空', trigger: 'blur' },
    {
      required: true,
      validator: equalToPassword,
      trigger: 'blur',
    },
  ],
});

/** 提交按钮 */
const submit = () => {
  pwdRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      await userUpdatePassword({
        oldPassword: user.value.oldPassword,
        newPassword: user.value.newPassword,
      });
    }
  });
};
</script>

<template>
  <div class="mt-[16px] md:w-full lg:w-1/2 2xl:w-2/5">
    <el-form ref="pwdRef" :model="user" :rules="rules" label-width="80px">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="user.oldPassword" placeholder="请输入旧密码" type="password" show-password />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="user.newPassword" placeholder="请输入新密码" type="password" show-password />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="user.confirmPassword" placeholder="请确认新密码" type="password" show-password />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">修改密码</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
