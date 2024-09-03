<template>
    <div>
      <el-button type="primary" @click="showAddFormDialog = true">Add Form</el-button>
      <el-table :data="forms">
        <el-table-column prop="title" label="Title" />
        <el-table-column prop="description" label="Description" />
      </el-table>
      <el-dialog title="Add Form" :visible.sync="showAddFormDialog">
        <el-form @submit.native.prevent="addForm">
          <el-form-item>
            <el-input v-model="newForm.title" placeholder="Title" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="newForm.description" placeholder="Description" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addForm">Add</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { db } from '../api/indexedDB';
  
  const forms = ref([]);
  const showAddFormDialog = ref(false);
  const newForm = ref({ title: '', description: '' });
  
  const loadForms = async () => {
    forms.value = await db.getCustomerByName();
  };
  
  const addForm = async () => {
    await db.getCustomerByName(newForm.value);
    showAddFormDialog.value = false;
    await loadForms();
    newForm.value = { title: '', description: '' };
  };
  
  onMounted(loadForms);
  </script>
  