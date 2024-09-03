import { openDB } from 'idb';

const dbPromise = openDB('gl-order-db', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('orders')) {
      const orderStore = db.createObjectStore('orders', { keyPath: 'id', autoIncrement: true });
      orderStore.createIndex('customerName', 'customerName', { unique: false });
      orderStore.createIndex('orderNumber', 'orderNumber', { unique: true });
    }

    if (!db.objectStoreNames.contains('customers')) {
      const customerStore = db.createObjectStore('customers', { keyPath: 'id', autoIncrement: true });
      customerStore.createIndex('name', 'name', { unique: true });
    }

    if (!db.objectStoreNames.contains('users')) {
      const userStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
      userStore.createIndex('username', 'username', { unique: true });
    }
  },
});

// Function to initialize the database and add default users
export async function initDB() {
  const db = await dbPromise;

  // Check if any users already exist
  const existingUsers = await db.getAll('users');
  if (existingUsers.length === 0) {
    await db.add('users', { username: 'admin', password: 'admin123' });
    await db.add('users', { username: 'user', password: 'user123' });
  }
}

export const db = {
  async addOrder(order) {
    const db = await dbPromise;
    await db.add('orders', order);
  },
  async addCustomer(customer) {
    const db = await dbPromise;
    await db.add('customers', customer);
  },
  async addUser(user) {
    const db = await dbPromise;
    await db.add('users', user);
  },
  async getOrderByNumber(orderNumber) {
    const db = await dbPromise;
    return await db.getFromIndex('orders', 'orderNumber', orderNumber);
  },
  async getCustomerByName(name) {
    const db = await dbPromise;
    return await db.getFromIndex('customers', 'name', name);
  },
  async getUserByUsername(username) {
    const db = await dbPromise;
    return await db.getFromIndex('users', 'username', username);
  },
};