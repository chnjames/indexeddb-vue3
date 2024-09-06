<template>
  <div class="container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="80px">
      <el-form-item label="用户名称">
        <el-input v-model="queryParams.username" placeholder="请输入用户名称" clearable @keyup.enter="handleQuery"/>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryParams.status" placeholder="请选择状态" style="width: 200px">
          <el-option label="启用" :value="1"/>
          <el-option label="停用" :value="0"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
        <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb20">
      <el-col :span="1.5">
        <el-button type="primary" :icon="Plus" @click="openDialog('add')">新增用户</el-button>
      </el-col>
    </el-row>
    <!-- 客户列表 -->
    <el-table :data="paginatedCustomers" stripe border style="width: 100%">
      <el-table-column prop="id" label="用户编号"/>
      <el-table-column prop="nickname" label="用户昵称"/>
      <el-table-column prop="username" label="用户名称"/>
      <el-table-column prop="phone" label="手机号码"/>
      <el-table-column label="状态">
        <template #default="{row}">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '启用' : '停用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template #default="{row}">
          {{ parseTime(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{row}">
          <el-button type="primary" link size="small" @click="openDialog('edit', row)">编辑</el-button>
          <el-button type="danger" link size="small" @click="deleteCustomer(row)">删除</el-button>
          <el-button type="primary" link size="small" @click="openPurchase(row)">采购订单</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页控件 -->
    <div class="pagination-container" v-if="showPagination">
      <el-pagination
          v-model:current-page="pageInfo.pageNum"
          :page-size="pageInfo.pageSize" background
          :total="filteredCustomers.length"
          layout="total, sizes, prev, pager, next"
          @current-change="handlePageChange"
          @size-change="handleSizeChange">
      </el-pagination>
    </div>
  </div>

  <!-- 客户对话框 -->
  <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="form.nickname" placeholder="请输入用户昵称"/>
      </el-form-item>
      <el-form-item label="用户名称" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名称"/>
      </el-form-item>
      <el-form-item label="用户密码" prop="password">
        <el-input v-model="form.password" placeholder="请输入用户密码"/>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号码"/>
      </el-form-item>
      <el-form-item label="用户状态">
        <el-switch v-model="form.status" inline-prompt
                   :active-value="1" :inactive-value="0"
                   active-text="启用" inactive-text="停用"/>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" placeholder="请输入备注信息" type="textarea"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="saveCustomer">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import {Search, Refresh, Plus} from '@element-plus/icons-vue'
import {ref, onMounted, toRaw, computed} from 'vue';
import {parseTime} from '@/utils';
import {ElMessage} from 'element-plus';
import {db} from '@/api/indexedDB';
import {useRouter} from 'vue-router';

const router = useRouter();

// 客户列表及搜索条件
const customers = ref([]);
const filteredCustomers = ref([]); // 保存过滤后的客户列表
const dialogVisible = ref(false);  // Dialog visibility control
const dialogTitle = ref('');
const form = ref({
  id: '',
  nickname: '',
  username: '',
  password: '',
  phone: '',
  status: 1,
  createdTime: '',
  remark: ''
});
const formRef = ref(null);

const pageInfo = ref({
  total: 0,
  pageSize: 10,
  pageNum: 1
})

// 搜索表单
const queryParams = ref({
  username: '',
  status: ''
});

// 表单校验规则
const rules = ref({
  nickname: [{required: true, message: '请输入用户昵称', trigger: 'blur'}],
  username: [{required: true, message: '请输入用户名称', trigger: 'blur'}],
  password: [{required: true, message: '请输入用户密码', trigger: 'blur'}],
  phone: [
    {required: true, message: '请输入手机号码', trigger: 'blur'},
    {pattern: /^[0-9]{11}$/, message: '请输入有效的手机号码（11位数字）', trigger: 'blur'}
  ],
  status: [{required: true, message: '请选择用户状态', trigger: 'blur'}]
});

// 加载客户数据
onMounted(async () => {
  await getQueryData();
});

// 获取客户数据
function getQueryData() {
  db.getUsers().then(res => {
    customers.value = res;
    filteredCustomers.value = res;
  })
}

// 分页计算：根据当前页和每页大小获取显示的数据
const paginatedCustomers = computed(() => {
  const start = (pageInfo.value.pageNum - 1) * pageInfo.value.pageSize;
  const end = start + pageInfo.value.pageSize;
  return filteredCustomers.value.slice(start, end);
});

// 计算是否需要显示分页控件
const showPagination = computed(() => {
  return filteredCustomers.value.length > pageInfo.value.pageSize;
});
// 页码变化处理
const handlePageChange = (newPage) => {
  pageInfo.value.pageNum = newPage;
};
// 每页显示条数变化处理
const handleSizeChange = (newSize) => {
  pageInfo.value.pageSize = newSize;
  pageInfo.value.pageNum = 1;
};

// 打开对话框
const openDialog = (type, customer = null) => {
  dialogVisible.value = true;  // 显示对话框
  if (type === 'add') {
    dialogTitle.value = '添加用户';
    form.value.id = customers.value.length ? Math.max(...customers.value.map(c => c.id)) + 1 : 1;
    form.value.createdTime = new Date().getTime();
  } else if (type === 'edit' && customer) {
    dialogTitle.value = '编辑用户';
    form.value = {
      ...customer,
      createdTime: new Date().getTime(),
      id: customer.id || form.value.id
    };
  }
};

// 保存客户数据
const saveCustomer = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      const plainForm = toRaw(form.value);
      const existingIndex = customers.value.findIndex(c => c.id === plainForm.id);
      if (existingIndex !== -1) {
        await db.updateUser(plainForm);
        customers.value[existingIndex] = {...plainForm};
      } else {
        await db.addUser(plainForm);
        customers.value.push({...plainForm});
      }
      dialogVisible.value = false;
      filteredCustomers.value = customers.value;
      ElMessage.success('保存成功');
    }
  });
};

// 删除客户
const deleteCustomer = async (customer) => {
  await db.deleteUser(customer.id);
  customers.value = customers.value.filter(c => c.id !== customer.id);
  filteredCustomers.value = customers.value;
  ElMessage.success('删除成功');
};

// 查询客户
const handleQuery = () => {
  const {username, status} = queryParams.value;
  filteredCustomers.value = customers.value.filter(c => {
    const matchesName = !username || c.username.includes(username);
    const matchesStatus = !status || c.status === status;
    return matchesName && matchesStatus;
  });
  pageInfo.value.pageNum = 1;
};

// 重置查询
const queryRef = ref(null);
const resetQuery = () => {
  queryRef.value.resetFields();
  handleQuery();
};

// 打开采购订单
const openPurchase = (customer) => {
  router.push({name: 'purchase-order', params: {id: customer.id}});
};
</script>

<style scoped>

</style>
