import {openDB} from 'idb';
import { useUserStore } from '@/stores/modules/user';

const dbPromise = openDB('gl-order-db', 4, {
  upgrade(db, oldVersion, newVersion, transaction) {
    console.log('数据库升级：', oldVersion, newVersion, transaction);
    // 订单存储
    if (!db.objectStoreNames.contains('orders')) {
      const orderStore = db.createObjectStore('orders', {keyPath: 'id', autoIncrement: true});
      orderStore.createIndex('customerId', 'customerId', {unique: false}); // 创建 customerId 字段用于关联 customers 表的 id
      orderStore.createIndex('customerName', 'customerName', {unique: false});
      orderStore.createIndex('orderNumber', 'orderNumber', {unique: true});
    }
    // 订单变动记录存储
    if (!db.objectStoreNames.contains('order_changes')) {
      const changeStore = db.createObjectStore('order_changes', {keyPath: 'id', autoIncrement: true});
      changeStore.createIndex('orderId', 'orderId', {unique: false}); // 关联订单 ID
    }
    // 客户存储
    if (!db.objectStoreNames.contains('customers')) {
      const customerStore = db.createObjectStore('customers', {keyPath: 'id', autoIncrement: true});
      customerStore.createIndex('name', 'name', {unique: true});
    }
    // 用户存储
    if (!db.objectStoreNames.contains('users')) {
      const userStore = db.createObjectStore('users', {keyPath: 'id', autoIncrement: true});
      userStore.createIndex('username', 'username', {unique: true});
    }
  },
});

// Function to initialize the database and add default users
export async function initDB() {
  const db = await dbPromise;
  // 检查用户表是否已有用户
  const existingUsers = await db.getAll('users');
  if (existingUsers.length === 0) {
    await db.add('users', {
      nickname: '管理员',
      username: 'admin',
      password: 'admin123',
      phone: '17683928893',
      status: 1,
      remark: '管理员账号',
      createTime: new Date().getTime()
    });
    await db.add('users', {
      nickname: '游客',
      username: 'guest',
      password: 'guest123',
      phone: '17683928893',
      status: 1,
      remark: '游客账号',
      createTime: new Date().getTime()
    });
  }
}

export const db = {
  // 添加订单
  async addOrder(order) {
    const db = await dbPromise;
    await db.add('orders', order);
  },
  // 更新订单
  async updateOrder(order) {
    const db = await dbPromise;
    const userStore = useUserStore();
    // 获取旧订单数据
    const oldOrder = await db.get('orders', order.id);
    // 更新订单
    await db.put('orders', order);
    // 记录变动历史
    const changes = {};
    for (let key in oldOrder) {
      if (oldOrder[key] !== order[key]) {
        changes[key] = { oldValue: oldOrder[key], newValue: order[key] };
      }
    }
    if (Object.keys(changes).length > 0) {
      // 保存变动记录
      await db.add('order_changes', {
        orderId: order.id,
        changes: changes,
        modifiedBy: userStore.user.name, // 保存修改人
        modifiedAt: new Date().toISOString() // 保存修改时间
      });
    }
  },
  // 获取订单变动历史
  async getOrderChangeHistory(orderId) {
    const db = await dbPromise;
    const tx = db.transaction('order_changes', 'readonly');
    const store = tx.objectStore('order_changes');
    const index = store.index('orderId');
    return await index.getAll(orderId); // 获取指定订单的所有变动历史
  },
  // 删除订单
  async deleteOrder(id) {
    const db = await dbPromise;
    await db.delete('orders', id);
  },
  // 获取所有订单
  async getOrders() {
    const db = await dbPromise;
    return await db.getAll('orders');
  },
  // 获取所有客户
  async getCustomers() {
    const db = await dbPromise;
    return await db.getAll('customers');
  },
  // 添加客户
  async addCustomer(customer) {
    const db = await dbPromise;
    await db.add('customers', customer);
  },
  // 更新客户
  async updateCustomer(customer) {
    const db = await dbPromise;
    await db.put('customers', customer);
  },
  // 删除客户
  async deleteCustomer(id) {
    const db = await dbPromise;
    await db.delete('customers', id);
  },
  // 根据 id 获取客户
  async getCustomerById(id) {
    const db = await dbPromise;
    return await db.get('customers', id);
  },
  // 添加用户
  async addUser(user) {
    const db = await dbPromise;
    await db.add('users', user);
  },
  // 更新用户
  async updateUser(user) {
    const db = await dbPromise;
    await db.put('users', user);
  },
  // 删除用户
  async deleteUser(id) {
    const db = await dbPromise;
    await db.delete('users', id);
  },
  // 获取所有用户
  async getUsers() {
    const db = await dbPromise;
    return await db.getAll('users');
  },
  // 根据订单号获取订单
  async getOrderByNumber(orderNumber) {
    const db = await dbPromise;
    return await db.getFromIndex('orders', 'orderNumber', orderNumber);
  },
  // 根据客户名称获取客户
  async getCustomerByName(name) {
    const db = await dbPromise;
    return await db.getFromIndex('customers', 'name', name);
  },
  // 根据用户名获取用户
  async getUserByUsername(username) {
    const db = await dbPromise;
    return await db.getFromIndex('users', 'username', username);
  },
  // 根据 customerId 获取订单列表
  async getOrdersByCustomerId(customerId) {
    const db = await dbPromise;
    const tx = db.transaction('orders', 'readonly');
    const store = tx.objectStore('orders');
    // 确保索引名称正确
    const index = store.index('customerId');
    return await index.getAll(customerId);
  }
};
