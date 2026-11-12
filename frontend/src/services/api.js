import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_CUSTOMERS,
  INITIAL_SUPPLIERS,
  INITIAL_ORDERS,
  STORE_SETTINGS
} from '../data/initialData';

const BASE_URL = 'http://localhost:8080/api';

// Storage keys
const STORAGE_KEYS = {
  PRODUCTS: 'pos_products',
  CATEGORIES: 'pos_categories',
  CUSTOMERS: 'pos_customers',
  SUPPLIERS: 'pos_suppliers',
  ORDERS: 'pos_orders',
  SETTINGS: 'pos_settings'
};

// Initialize localStorage if empty
const initLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SUPPLIERS)) {
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(INITIAL_SUPPLIERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(STORE_SETTINGS));
  }
};

initLocalStorage();

// Check if Spring Boot backend is reachable
export const checkBackendHealth = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`${BASE_URL}/dashboard/stats`, { signal: controller.signal });
    clearTimeout(timeoutId);
    return res.ok;
  } catch (err) {
    return false;
  }
};

// API Service
export const api = {
  // PRODUCTS
  async getProducts() {
    try {
      const res = await fetch(`${BASE_URL}/products`);
      if (res.ok) return await res.json();
    } catch (_) {}
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
  },

  async saveProduct(product) {
    try {
      const method = product.id ? 'PUT' : 'POST';
      const url = product.id ? `${BASE_URL}/products/${product.id}` : `${BASE_URL}/products`;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (res.ok) return await res.json();
    } catch (_) {}

    // Fallback to localStorage
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    let saved;
    if (product.id) {
      saved = { ...product };
      const index = products.findIndex(p => p.id === product.id);
      if (index !== -1) products[index] = saved;
    } else {
      saved = {
        ...product,
        id: Date.now(),
        sku: product.sku || `SKU-${Date.now().toString().slice(-4)}`
      };
      products.push(saved);
    }
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return saved;
  },

  async deleteProduct(id) {
    try {
      await fetch(`${BASE_URL}/products/${id}`, { method: 'DELETE' });
    } catch (_) {}
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const filtered = products.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
    return true;
  },

  // CATEGORIES
  async getCategories() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
  },

  // CUSTOMERS
  async getCustomers() {
    try {
      const res = await fetch(`${BASE_URL}/customers`);
      if (res.ok) return await res.json();
    } catch (_) {}
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMERS) || '[]');
  },

  async saveCustomer(customer) {
    try {
      const res = await fetch(`${BASE_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer)
      });
      if (res.ok) return await res.json();
    } catch (_) {}

    const customers = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMERS) || '[]');
    const newCustomer = {
      ...customer,
      id: customer.id || Date.now(),
      balanceDue: customer.balanceDue || 0,
      totalSpent: customer.totalSpent || 0
    };
    if (customer.id) {
      const idx = customers.findIndex(c => c.id === customer.id);
      if (idx !== -1) customers[idx] = newCustomer;
    } else {
      customers.push(newCustomer);
    }
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    return newCustomer;
  },

  async settleCustomerDue(customerId, amount) {
    try {
      const res = await fetch(`${BASE_URL}/customers/${customerId}/settle-due`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });
      if (res.ok) return await res.json();
    } catch (_) {}

    const customers = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMERS) || '[]');
    const cust = customers.find(c => c.id === customerId);
    if (cust) {
      cust.balanceDue = Math.max(0, (cust.balanceDue || 0) - amount);
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    }
    return cust;
  },

  // SUPPLIERS
  async getSuppliers() {
    try {
      const res = await fetch(`${BASE_URL}/suppliers`);
      if (res.ok) return await res.json();
    } catch (_) {}
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SUPPLIERS) || '[]');
  },

  async saveSupplier(supplier) {
    try {
      const res = await fetch(`${BASE_URL}/suppliers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supplier)
      });
      if (res.ok) return await res.json();
    } catch (_) {}

    const suppliers = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUPPLIERS) || '[]');
    const newSupplier = { ...supplier, id: supplier.id || Date.now() };
    if (supplier.id) {
      const idx = suppliers.findIndex(s => s.id === supplier.id);
      if (idx !== -1) suppliers[idx] = newSupplier;
    } else {
      suppliers.push(newSupplier);
    }
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(suppliers));
    return newSupplier;
  },

  // ORDERS / BILLING
  async getOrders() {
    try {
      const res = await fetch(`${BASE_URL}/orders`);
      if (res.ok) return await res.json();
    } catch (_) {}
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
  },

  async createOrder(orderData) {
    try {
      const res = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (res.ok) return await res.json();
    } catch (_) {}

    // Fallback Local Storage Order Creation with GST Calculations
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const customers = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMERS) || '[]');

    // Deduct product stock
    orderData.items.forEach(cartItem => {
      const prod = products.find(p => p.id === (cartItem.productId || cartItem.id));
      if (prod) {
        prod.stockQuantity = Math.max(0, prod.stockQuantity - cartItem.quantity);
      }
    });
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

    const newOrder = {
      ...orderData,
      id: Date.now(),
      invoiceNumber: `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
      orderDate: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };

    // Update customer spending and due balance
    if (orderData.customer && orderData.customer.id) {
      const cust = customers.find(c => c.id === orderData.customer.id);
      if (cust) {
        cust.totalSpent = (cust.totalSpent || 0) + newOrder.grandTotal;
        if (newOrder.dueAmount && newOrder.dueAmount > 0) {
          cust.balanceDue = (cust.balanceDue || 0) + newOrder.dueAmount;
        }
        localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
      }
    }

    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    return newOrder;
  },

  // SETTINGS
  getSettings() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || JSON.stringify(STORE_SETTINGS));
  },

  saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return settings;
  }
};

