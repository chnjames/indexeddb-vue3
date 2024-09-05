<template>
  <!-- 查询部分 -->
  <div style="margin-bottom: 20px;">
    <el-input v-model="searchForm.name" placeholder="客户名称" style="width: 200px; margin-right: 10px;"></el-input>
    <el-input v-model="searchForm.contact" placeholder="联系方式" style="width: 200px; margin-right: 10px;"></el-input>
    <el-button type="primary" @click="searchCustomers">查询</el-button>
    <el-button @click="resetSearch">重置</el-button>
  </div>

  <!-- 添加客户按钮 -->
  <div style="margin-bottom: 20px;">
    <el-button type="primary" @click="openDialog('add')">添加客户</el-button>
  </div>

  <!-- 客户列表 -->
  <el-table :data="paginatedCustomers" stripe border style="width: 100%">
    <el-table-column prop="name" label="客户名称">
      <template #default="{row}">
        <el-link type="primary" @click="openPurchase(row)">{{ row.name }}</el-link>
      </template>
    </el-table-column>
    <el-table-column prop="address" label="地址"></el-table-column>
    <el-table-column prop="contact" label="联系方式"></el-table-column>
    <el-table-column label="操作" width="180">
      <template #default="{row}">
        <el-button type="primary" link size="small" @click="openDialog('edit', row)">编辑</el-button>
        <el-button type="danger" link size="small" @click="deleteCustomer(row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 分页控件 -->
  <div class="pagination-container" v-if="showPagination">
    <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize" background
        :total="filteredCustomers.length"
        layout="total, prev, pager, next"
        @current-change="handlePageChange"
        @size-change="handleSizeChange">
    </el-pagination>
  </div>

  <!-- 客户对话框 -->
  <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500">
    <el-form ref="formRef" :model="form" :rules="rules" :label-width="formLabelWidth">
      <el-form-item label="客户名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入客户名称" />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="form.address" placeholder="请输入地址" />
      </el-form-item>
      <el-form-item label="联系方式" prop="contact">
        <el-input v-model="form.contact" placeholder="请输入联系方式" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="saveCustomer">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, toRaw, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { db } from '@/api/indexedDB'; // Correctly referencing db
import { useRouter } from 'vue-router';
const router = useRouter();

// 客户列表及搜索条件
const customers = ref([]);
const filteredCustomers = ref([]); // 保存过滤后的客户列表
const dialogVisible = ref(false);  // Dialog visibility control
const dialogTitle = ref('');
const form = ref({ id: 0, name: '', address: '', contact: '' });
const formLabelWidth = '100px';
const formRef = ref(null);

// 分页相关数据
const currentPage = ref(1);       // 当前页
const pageSize = ref(5);          // 每页显示的条数

// 搜索表单
const searchForm = ref({
  name: '',
  contact: ''
});

// 表单校验规则
const rules = ref({
  name: [
    { required: true, message: '请输入客户名称', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入地址', trigger: 'blur' }
  ],
  contact: [
    { required: true, message: '请输入联系方式', trigger: 'blur' },
    { pattern: /^[0-9]{10,11}$/, message: '请输入有效的联系方式（10到11位数字）', trigger: 'blur' }
  ]
});

// 加载客户数据
onMounted(async () => {
  const customerData = await db.getCustomers(); // 获取客户数据
  customers.value = customerData;
  filteredCustomers.value = customerData; // 初始时显示全部客户
});

// 分页计算：根据当前页和每页大小获取显示的数据
const paginatedCustomers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredCustomers.value.slice(start, end);
});

// 计算是否需要显示分页控件（当总页数大于1时才显示）
const showPagination = computed(() => {
  return filteredCustomers.value.length > pageSize.value;
});

// 页码变化处理
const handlePageChange = (newPage) => {
  currentPage.value = newPage;
};

// 每页显示条数变化处理
const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 1; // 切换每页大小后，重置到第一页
};

// 打开对话框
const openDialog = (type, customer = null) => {
  dialogVisible.value = true;  // 显示对话框

  if (type === 'add') {
    dialogTitle.value = '添加客户';
    form.value = { id: customers.value.length ? Math.max(...customers.value.map(c => c.id)) + 1 : 1, name: '', address: '', contact: '' };
  } else if (type === 'edit' && customer) {
    dialogTitle.value = '编辑客户';
    form.value = {
      id: customer.id || form.value.id,
      name: customer.name || '',
      address: customer.address || '',
      contact: customer.contact || ''
    };
  }
};

// 保存客户数据
const saveCustomer = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      const plainForm = toRaw(form.value);  // 将表单数据转换为普通对象

      const existingIndex = customers.value.findIndex(c => c.id === plainForm.id);

      if (existingIndex > -1) {
        // 更新客户
        await db.updateCustomer(plainForm);
        customers.value[existingIndex] = {...plainForm};
      } else {
        // 添加新客户
        await db.addCustomer(plainForm);
        customers.value.push({...plainForm});
      }

      dialogVisible.value = false;
      filteredCustomers.value = customers.value; // 保存后刷新显示的客户
      ElMessage.success('保存成功');
    } else {
      ElMessage.error('表单验证失败，请检查输入内容');
      return false;
    }
  });
};

// 删除客户
const deleteCustomer = async (customer) => {
  await db.deleteCustomer(customer.id); // 删除客户
  customers.value = customers.value.filter(c => c.id !== customer.id);
  filteredCustomers.value = customers.value; // 删除后更新显示列表
  ElMessage.success('删除成功');
};

// 查询客户
const searchCustomers = () => {
  filteredCustomers.value = customers.value.filter(c => {
    const matchesName = searchForm.value.name ? c.name.includes(searchForm.value.name) : true;
    const matchesContact = searchForm.value.contact ? c.contact.includes(searchForm.value.contact) : true;
    return matchesName && matchesContact;
  });
  currentPage.value = 1; // 搜索后重置到第一页
};

// 重置查询
const resetSearch = () => {
  searchForm.value.name = '';
  searchForm.value.contact = '';
  filteredCustomers.value = customers.value; // 重置为显示所有客户
  currentPage.value = 1; // 重置到第一页
};

// 打开采购订单
const openPurchase = (customer) => {
  router.push({ name: 'purchase-order', params: { id: customer.id } });
};
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
