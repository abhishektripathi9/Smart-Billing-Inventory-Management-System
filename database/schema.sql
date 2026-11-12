-- ========================================================
-- Smart Billing & Inventory Management System (PosSaaS)
-- Database: MySQL 8.0+
-- Schema Definition
-- ========================================================

CREATE DATABASE IF NOT EXISTS smart_billing_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE smart_billing_db;

-- 1. Users / Staff Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('ADMIN', 'MANAGER', 'CASHIER') NOT NULL DEFAULT 'CASHIER',
    counter_id VARCHAR(50) DEFAULT 'COUNTER-01',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Store / Company Profile Table
CREATE TABLE IF NOT EXISTS store_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    store_name VARCHAR(150) NOT NULL DEFAULT 'SuperMart & Retail Store',
    tagline VARCHAR(255) DEFAULT 'Quality & Trust Delivered',
    gstin VARCHAR(20) DEFAULT '27AABCS1429B1Z2',
    phone VARCHAR(20) DEFAULT '+91 98765 43210',
    email VARCHAR(100) DEFAULT 'billing@supermart.com',
    address TEXT,
    state VARCHAR(50) DEFAULT 'Maharashtra',
    state_code VARCHAR(10) DEFAULT '27',
    currency VARCHAR(10) DEFAULT '₹',
    receipt_footer TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(50) UNIQUE,
    icon VARCHAR(50) DEFAULT 'package',
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Products & Inventory Table
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    sku VARCHAR(100) NOT NULL UNIQUE,
    barcode VARCHAR(100) UNIQUE,
    category_id BIGINT,
    brand VARCHAR(100),
    unit VARCHAR(20) DEFAULT 'pcs', -- pcs, kg, g, ltr, box
    cost_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    selling_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    mrp DECIMAL(10, 2) DEFAULT 0.00,
    stock_quantity INT NOT NULL DEFAULT 0,
    min_stock_alert INT NOT NULL DEFAULT 5,
    gst_rate DECIMAL(5, 2) NOT NULL DEFAULT 18.00, -- e.g. 0, 5, 12, 18, 28
    hsn_code VARCHAR(20) DEFAULT '610910',
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL
);

-- 4. Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50) DEFAULT 'Maharashtra',
    gstin VARCHAR(20),
    balance_due DECIMAL(10, 2) DEFAULT 0.00,
    total_spent DECIMAL(12, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(150) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    gstin VARCHAR(20),
    address TEXT,
    outstanding_payable DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Orders / Sales Invoices Table
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id BIGINT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    discount_percentage DECIMAL(5, 2) DEFAULT 0.00,
    shipping_charge DECIMAL(10, 2) DEFAULT 0.00,
    tax_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    cgst_amount DECIMAL(10, 2) DEFAULT 0.00,
    sgst_amount DECIMAL(10, 2) DEFAULT 0.00,
    igst_amount DECIMAL(10, 2) DEFAULT 0.00,
    grand_total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    payment_method ENUM('CASH', 'UPI', 'CARD', 'DUE', 'SPLIT') NOT NULL DEFAULT 'CASH',
    payment_status ENUM('PAID', 'PARTIALLY_PAID', 'UNPAID') NOT NULL DEFAULT 'PAID',
    amount_paid DECIMAL(10, 2) DEFAULT 0.00,
    change_returned DECIMAL(10, 2) DEFAULT 0.00,
    due_amount DECIMAL(10, 2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_customer FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE SET NULL
);

-- 7. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT,
    product_name VARCHAR(200) NOT NULL,
    product_sku VARCHAR(100),
    hsn_code VARCHAR(20),
    quantity INT NOT NULL DEFAULT 1,
    unit_cost DECIMAL(10, 2) DEFAULT 0.00,
    unit_price DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    gst_rate DECIMAL(5, 2) DEFAULT 0.00,
    tax_amount DECIMAL(10, 2) DEFAULT 0.00,
    subtotal DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_item_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    CONSTRAINT fk_item_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE SET NULL
);

-- 8. Customer Ledger / Khata Transactions Table
CREATE TABLE IF NOT EXISTS customer_ledger (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    order_id BIGINT,
    transaction_type ENUM('SALE_DUE', 'PAYMENT_RECEIVED', 'REFUND') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    balance_after DECIMAL(10, 2) NOT NULL,
    payment_mode VARCHAR(50),
    notes VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ledger_customer FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE,
    CONSTRAINT fk_ledger_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE SET NULL
);

-- Indexes for lightning fast queries
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_invoice ON orders(invoice_number);
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_customers_phone ON customers(phone);

