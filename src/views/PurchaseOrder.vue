<template>
  <div>
    <h1 class="mb20">客户 ({{ customerName }}) 的采购订单</h1>

    <!-- 查询功能 -->
    <el-form ref="queryRef" :inline="true" label-width="80px" @submit.native.prevent="handleQuery">
      <el-form-item label="采购单号">
        <el-input v-model="queryParams.orderNumber" placeholder="请输入采购单号" clearable />
      </el-form-item>
      <el-form-item label="品名">
        <el-input v-model="queryParams.productName" placeholder="请输入品名" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery">查询</el-button>
        <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 添加订单按钮 -->
    <el-row :gutter="10" class="mb20">
      <el-col :span="1.5">
        <el-button type="primary" :icon="Plus" @click="openDialog('add')">添加订单</el-button>
      </el-col>
    </el-row>

    <!-- 订单列表 -->
    <el-table :data="paginatedOrders" style="width: 100%">
      <el-table-column prop="purchaseDate" label="采购日期" />
      <el-table-column prop="orderNumber" label="采购单号" />
      <el-table-column prop="productCode" label="品号" />
      <el-table-column prop="productName" label="品名" />
      <el-table-column prop="spec" label="规格" />
      <el-table-column prop="unit" label="单位" />
      <el-table-column prop="purchaseQty" label="采购数量" />
      <el-table-column prop="unreceivedQty" label="未收数量" />
      <el-table-column prop="conversionNumerator" label="换算分子" />
      <el-table-column prop="stockUnit" label="库存单位" />
      <el-table-column prop="stockUnitQty" label="库存单位数量" />
      <el-table-column prop="deliveryDate" label="预交日期" />
      <el-table-column prop="blisterBoxQty" label="吸塑盒数量" />
      <el-table-column label="操作">
        <template #default="{row}">
          <el-button link @click="openDialog('edit', row)" size="small">编辑</el-button>
          <el-button link @click="deleteOrder(row)" type="danger" size="small">删除</el-button>
          <el-button link @click="bindChangeLog(row)" size="small">变更记录</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页控件 -->
    <div class="pagination-container" v-if="showPagination">
      <el-pagination
        v-model:current-page="pageInfo.pageNum"
        :page-size="pageInfo.pageSize" background
        :total="filteredOrders.length"
        layout="total, sizes, prev, pager, next"
        @current-change="handlePageChange"
        @size-change="handleSizeChange">
      </el-pagination>
    </div>

    <!-- 添加/编辑订单对话框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="650">
      <el-form ref="formRef" :model="orderForm" :rules="rules" label-width="110px">
        <el-row :gutter="30">
          <el-col :xl="12" :xs="24" :sm="12">
            <el-form-item label="采购日期" prop="purchaseDate">
              <el-date-picker v-model="orderForm.purchaseDate" value-format="YYYY-MM-DD" type="date" placeholder="选择采购日期" clearable />
            </el-form-item>
          </el-col>
          <el-col :xl="12" :xs="24" :sm="12">
            <el-form-item label="采购单号" prop="orderNumber">
              <el-input v-model="orderForm.orderNumber" placeholder="请输入采购单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :xl="12" :xs="24" :sm="12">
            <el-form-item label="品号" prop="productCode">
              <el-input v-model="orderForm.productCode" placeholder="请输入品号" clearable />
            </el-form-item>
          </el-col>
          <el-col :xl="12" :xs="24" :sm="12">
            <el-form-item label="品名" prop="productName">
              <el-input v-model="orderForm.productName" placeholder="请输入品名" clearable />
            </el-form-item>
          </el-col>
          <el-col :xl="12" :xs="24" :sm="12">
            <el-form-item label="规格" prop="spec">
              <el-input v-model="orderForm.spec" placeholder="请输入规格" clearable />
            </el-form-item>
          </el-col>
          <el-col :xl="12" :xs="24" :sm="12">
            <el-form-item label="单位" prop="unit">
              <el-input v-model="orderForm.unit" placeholder="请输入单位" clearable />
            </el-form-item>
          </el-col>
          <el-col :xl="12" :xs="24" :sm="12">
            <el-form-item label="采购数量" prop="purchaseQty">
              <el-input v-model="orderForm.purchaseQty" placeholder="请输入采购数量" clearable />
            </el-form-item>
          </el-col>
          <el-col :xl="12" :xs="24" :sm="12">
            <el-form-item label="未收数量" prop="unreceivedQty">
              <el-input v-model="orderForm.unreceivedQty" placeholder="请输入未收数量" clearable />
            </el-form-item>
          </el-col>
          <el-col :xl="12" :xs="24" :sm="12">
            <el-form-item label="换算分子" prop="conversionNumerator">
              <el-input v-model="orderForm.conversionNumerator" placeholder="请输入换算分子" clearable />
            </el-form-item>
          </el-col>
          <el-col :xl="12" :xs="24" :sm="12">
            <el-form-item label="库存单位" prop="stockUnit">
              <el-input v-model="orderForm.stockUnit" placeholder="请输入库存单位" clearable />
            </el-form-item>
          </el-col>
          <el-col :xl="12" :xs="24" :sm="12">
            <el-form-item label="库存单位数量" prop="stockUnitQty">
              <el-input v-model="orderForm.stockUnitQty" placeholder="请输入库存单位数量" clearable />
            </el-form-item>
          </el-col>
          <el-col :xl="12" :xs="24" :sm="12">
            <el-form-item label="预交日期" prop="deliveryDate">
              <el-date-picker v-model="orderForm.deliveryDate" value-format="YYYY-MM-DD" type="date" placeholder="选择预交日期" />
            </el-form-item>
          </el-col>
          <el-col :xl="12" :xs="24" :sm="12">
            <el-form-item label="吸塑盒数量" prop="blisterBoxQty">
              <el-input v-model="orderForm.blisterBoxQty" placeholder="请输入吸塑盒数量" clearable />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="备注">
              <el-input v-model="orderForm.remark" placeholder="请输入备注信息" type="textarea" clearable />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitOrder">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, toRaw } from 'vue';
import { useRoute } from 'vue-router';
import { db } from '@/api/indexedDB';
import { Plus, Refresh, Search } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

const route = useRoute();
const purchaseOrders = ref([]);
const filteredOrders = ref([]);
const customerName = ref('');
const dialogTitle = ref('');

const rules = {
  purchaseDate: [{ required: true, message: '请选择采购日期', trigger: 'blur' }],
  orderNumber: [{ required: true, message: '请输入采购单号', trigger: 'blur' }],
  productCode: [{ required: true, message: '请输入品号', trigger: 'blur' }],
  productName: [{ required: true, message: '请输入品名', trigger: 'blur' }],
  spec: [{ required: true, message: '请输入规格', trigger: 'blur' }],
  unit: [{ required: true, message: '请输入单位', trigger: 'blur' }],
  purchaseQty: [{ required: true, message: '请输入采购数量', trigger: 'blur' }],
  unreceivedQty: [{ required: true, message: '请输入未收数量', trigger: 'blur' }],
  conversionNumerator: [{ required: true, message: '请输入换算分子', trigger: 'blur' }],
  stockUnit: [{ required: true, message: '请输入库存单位', trigger: 'blur' }],
  stockUnitQty: [{ required: true, message: '请输入库存单位数量', trigger: 'blur' }],
  deliveryDate: [{ required: true, message: '请选择预交日期', trigger: 'blur' }],
  blisterBoxQty: [{ required: true, message: '请输入吸塑盒数量', trigger: 'blur' }]
};

// 查询表单
const queryParams = ref({
  orderNumber: '',
  productName: ''
});

// 订单表单
const orderForm = ref({
  id: '',
  customerId: '',
  purchaseDate: '',
  orderNumber: '',
  productCode: '',
  productName: '',
  spec: '',
  unit: '',
  purchaseQty: '',
  unreceivedQty: '',
  conversionNumerator: '',
  stockUnit: '',
  stockUnitQty: '',
  deliveryDate: '',
  blisterBoxQty: '',
  remark: ''
});
const dialogVisible = ref(false);

const pageInfo = ref({
  total: 0,
  pageSize: 10,
  pageNum: 1
})

// 分页计算：根据当前页和每页大小获取显示的数据
const paginatedOrders = computed(() => {
  const start = (pageInfo.value.pageNum - 1) * pageInfo.value.pageSize;
  const end = start + pageInfo.value.pageSize;
  return filteredOrders.value.slice(start, end);
});

// 计算是否需要显示分页控件
const showPagination = computed(() => {
  return filteredOrders.value.length > pageInfo.value.pageSize;
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

// 获取订单数据
onMounted(async () => {
  const customerId = route.params.id;
  const customer = await db.getCustomerById(Number(customerId));
  customerName.value = customer.name;
  const orders = await db.getOrdersByCustomerId(customerId);
  purchaseOrders.value = orders;
  filteredOrders.value = orders;
});

// 搜索订单
const handleQuery = () => {
  const { orderNumber, productName } = queryParams.value;
  filteredOrders.value = purchaseOrders.value.filter(c => {
    const matchesNumber = !orderNumber || c.orderNumber.includes(orderNumber);
    const matchesName = !productName || c.productName.includes(productName);
    return matchesNumber && matchesName;
  });
  pageInfo.value.pageNum = 1;
};

// 重置搜索
const queryRef = ref(null);
const resetSearch = () => {
  queryRef.value.resetFields();
  handleQuery();
};

// 打开对话框
const openDialog = (type, order = null) => {
  dialogVisible.value = true;  // 显示对话框
  if (type === 'add') {
    dialogTitle.value = '添加订单';
    orderForm.value.id = purchaseOrders.value.length ? Math.max(...purchaseOrders.value.map(c => c.id)) + 1 : 1;
    orderForm.value.createdTime = new Date().getTime();
    orderForm.value.customerId = route.params.id;
  } else if (type === 'edit' && order) {
    dialogTitle.value = '编辑订单';
    orderForm.value = {
      ...order,
      customerId: route.params.id,
      createdTime: new Date().getTime(),
      id: order.id || orderForm.value.id
    };
  }
};

// 保存订单（新增或更新）
const formRef = ref(null);
const submitOrder = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      const plainForm = toRaw(orderForm.value);
      const existingIndex = purchaseOrders.value.findIndex(c => c.id === plainForm.id);
      if (existingIndex !== -1) {
        await db.updateOrder(plainForm);
        purchaseOrders.value[existingIndex] = {...plainForm};
      } else {
        await db.addOrder(plainForm);
        purchaseOrders.value.push({...plainForm});
      }
      dialogVisible.value = false;
      filteredOrders.value = purchaseOrders.value;
      ElMessage.success('保存成功');
    }
  });
};

// 删除订单
const deleteOrder = async (row) => {
  await db.deleteOrder(row.id);
  ElMessage.success('删除成功');
  await refreshOrders();
};

// 变更记录
const bindChangeLog = async (row) => {
  const changeHistory = await db.getOrderChangeHistory(row.id);
  console.log('订单变动历史:', changeHistory);
};

// 刷新订单列表
const refreshOrders = async () => {
  const customerId = route.params.id;
  const orders = await db.getOrdersByCustomerId(customerId);
  purchaseOrders.value = orders;
  filteredOrders.value = orders;
};
</script>

<style scoped>

</style>
