<template>
    <div>
      <el-button type="primary" @click="showAddUserDialog = true">Add User</el-button>
      <el-table :data="users">
        <el-table-column prop="username" label="Username" />
        <el-table-column prop="email" label="Email" />
      </el-table>
      <el-dialog title="Add User" :visible.sync="showAddUserDialog">
        <el-form @submit.native.prevent="addUser">
          <el-form-item>
            <el-input v-model="newUser.username" placeholder="Username" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="newUser.email" placeholder="Email" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addUser">Add</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { db } from '../api/indexedDB';
  
  const users = ref([]);
  const showAddUserDialog = ref(false);
  const newUser = ref({ username: '', email: '' });
  
  const loadUsers = async () => {
    users.value = await db.getUsers();
  };
  
  const addUser = async () => {
    await db.addUser(newUser.value);
    showAddUserDialog.value = false;
    await loadUsers();
    newUser.value = { username: '', email: '' };
  };
  
  onMounted(loadUsers);
  </script>
  