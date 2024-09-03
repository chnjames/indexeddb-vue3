<template>
  <el-card>
    <div style="margin-bottom: 20px;">
      <el-button type="primary" @click="openDialog('add')">添加客户</el-button>
    </div>
    <el-table :data="customers" style="width: 100%">
      <el-table-column prop="name" label="客户名称" width="180"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="contact" label="联系方式" width="180"></el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button type="text" size="small" @click="openDialog('edit', scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="deleteCustomer(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" v-model:visible="dialogVisible">
      <el-form :model="form">
        <el-form-item label="客户名称" :label-width="formLabelWidth">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" :label-width="formLabelWidth">
          <el-input v-model="form.contact"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCustomer">保存</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

const customers = ref([
  { id: 1, name: '张三', address: '北京市', contact: '12345678901' },
  { id: 2, name: '李四', address: '上海市', contact: '09876543210' },
]);

const dialogVisible = ref(false);
const dialogTitle = ref('');
const form = ref({ id: 0, name: '', address: '', contact: '' });
const formLabelWidth = '100px';

const openDialog = (type, customer) => {
  dialogVisible.value = true;
  if (type === 'add') {
    dialogTitle.value = '添加客户';
    form.value = { id: customers.value.length ? Math.max(...customers.value.map(c => c.id)) + 1 : 1, name: '', address: '', contact: '' };
  } else if (type === 'edit' && customer) {
    dialogTitle.value = '编辑客户';
    form.value = { ...customer };
  }
};

const saveCustomer = () => {
  if (form.value.name === '' || form.value.address === '' || form.value.contact === '') {
    ElMessage.error('请填写完整信息');
    return;
  }

  const existingIndex = customers.value.findIndex(c => c.id === form.value.id);
  if (existingIndex > -1) {
    customers.value[existingIndex] = { ...form.value };
  } else {
    customers.value.push({ ...form.value });
  }
  dialogVisible.value = false;
  ElMessage.success('保存成功');
};

const deleteCustomer = (customer) => {
  customers.value = customers.value.filter(c => c.id !== customer.id);
  ElMessage.success('删除成功');
};
</script>

<style scoped>
</style>
