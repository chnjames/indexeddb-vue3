<template>
  <div>
    <h1>客户 {{ customerName }} 的采购订单</h1>

    <!-- 查询功能 -->
    <el-form :inline="true" @submit.native.prevent="searchOrders">
      <el-form-item label="采购单号">
        <el-input v-model="searchForm.orderNumber" placeholder="请输入采购单号"></el-input>
      </el-form-item>
      <el-form-item label="品名">
        <el-input v-model="searchForm.productName" placeholder="请输入品名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchOrders">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 添加订单按钮 -->
    <el-button type="primary" @click="openAddDialog">添加订单</el-button>

    <!-- 订单列表 -->
    <el-table :data="filteredOrders" style="width: 100%">
      <el-table-column prop="purchaseDate" label="采购日期"></el-table-column>
      <el-table-column prop="orderNumber" label="采购单号"></el-table-column>
      <el-table-column prop="productCode" label="品号"></el-table-column>
      <el-table-column prop="productName" label="品名"></el-table-column>
      <el-table-column prop="spec" label="规格"></el-table-column>
      <el-table-column prop="unit" label="单位"></el-table-column>
      <el-table-column prop="purchaseQty" label="采购数量"></el-table-column>
      <el-table-column prop="unreceivedQty" label="未收数量"></el-table-column>
      <el-table-column prop="conversionNumerator" label="换算分子"></el-table-column>
      <el-table-column prop="stockUnit" label="库存单位"></el-table-column>
      <el-table-column prop="stockUnitQty" label="库存单位数量"></el-table-column>
      <el-table-column prop="deliveryDate" label="预交日期"></el-table-column>
      <el-table-column prop="blisterBoxQty" label="吸塑盒数量"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="editOrder(scope.row)" size="small">编辑</el-button>
          <el-button @click="deleteOrder(scope.row.id)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑订单对话框 -->
    <el-dialog :title="isEdit ? '编辑订单' : '添加订单'" v-model="dialogVisible">
      <el-form :model="orderForm">
        <el-form-item label="采购单号">
          <el-input v-model="orderForm.orderNumber" placeholder="请输入采购单号"></el-input>
        </el-form-item>
        <el-form-item label="品号">
          <el-input v-model="orderForm.productCode" placeholder="请输入品号"></el-input>
        </el-form-item>
        <el-form-item label="品名">
          <el-input v-model="orderForm.productName" placeholder="请输入品名"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitOrder">{{ isEdit ? '更新' : '添加' }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { db } from '@/api/indexedDB'; // 假设这是你的数据库操作文件

const route = useRoute();
const purchaseOrders = ref([]);
const filteredOrders = ref([]);
const customerName = ref('');

// 查询表单
const searchForm = ref({
  orderNumber: '',
  productName: ''
});

// 订单表单
const orderForm = ref({
  orderNumber: '',
  productCode: '',
  productName: ''
});
const dialogVisible = ref(false);
const isEdit = ref(false); // 判断是否为编辑模式

// 获取订单数据
onMounted(async () => {
  const customerId = route.params.id;
  const customer = await db.getCustomerById(customerId);
  console.log('customer:', customer);
  const orders = await db.getOrdersByCustomerId(customerId); // 通过 customerId 获取订单数据
  if (orders.length > 0) {
    const [firstOrder] = orders;
    customerName.value = firstOrder.customerName; // 设置客户名称
  }
  purchaseOrders.value = orders; // 设置订单数据
  filteredOrders.value = orders; // 默认显示所有订单
});

// 搜索订单
const searchOrders = () => {
  filteredOrders.value = purchaseOrders.value.filter(order => {
    return (
        (!searchForm.value.orderNumber || order.orderNumber.includes(searchForm.value.orderNumber)) &&
        (!searchForm.value.productName || order.productName.includes(searchForm.value.productName))
    );
  });
};

// 重置搜索
const resetSearch = () => {
  searchForm.value.orderNumber = '';
  searchForm.value.productName = '';
  filteredOrders.value = purchaseOrders.value;
};

// 打开添加订单对话框
const openAddDialog = () => {
  orderForm.value = {}; // 清空表单
  dialogVisible.value = true;
  isEdit.value = false;
};

// 编辑订单
const editOrder = (order) => {
  orderForm.value = { ...order }; // 将订单数据拷贝到表单中
  dialogVisible.value = true;
  isEdit.value = true;
};

// 保存订单（新增或更新）
// 订单提交逻辑
const submitOrder = async () => {
  try {
    // 添加或更新订单
    orderForm.value.customerId = route.params.id;
    if (isEdit.value) {
      await db.updateOrder(orderForm.value);
    } else {
      await db.addOrder(orderForm.value);
    }
    dialogVisible.value = false;
    console.log('订单提交成功！');
  } catch (error) {
    if (error.message.includes('订单号')) {
      alert(error.message); // 如果是订单号重复，给出友好的提示
    } else {
      console.error('订单提交失败:', error);
    }
  }
};

// 删除订单
const deleteOrder = async (id) => {
  await db.deleteOrder(id); // 调用数据库删除订单
  await refreshOrders(); // 刷新订单列表
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
h1 {
  margin-bottom: 20px;
}
</style>
