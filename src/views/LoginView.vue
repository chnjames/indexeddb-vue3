<template>
  <el-form @submit.native.prevent="onLogin">
    <el-form-item>
      <el-input v-model="username" placeholder="Username" />
    </el-form-item>
    <el-form-item>
      <el-input v-model="password" type="password" placeholder="Password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onLogin">登 录</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/modules/user';
import { useRouter } from 'vue-router';
import { db } from '@/api/indexedDB';

const username = ref('');
const password = ref('');
const userStore = useUserStore();
const router = useRouter();

const onLogin = async () => {
  const user = await db.getUserByUsername(username.value);
  if (user && user.password === password.value) {
    userStore.login({ userName: user.username, password: user.password });
    router.push('/');
  } else {
    console.log('登录失败');
  }
};
</script>
