-- ========================================================
-- Seed Data for Smart Billing & Inventory Management System
-- ========================================================

USE smart_billing_db;

-- Users / Cashiers & Admins
INSERT INTO users (id, name, email, password_hash, phone, role, counter_id) VALUES
(1, 'Admin Store Manager', 'admin@possaas.com', '$2a$10$hashedAdminPassword', '+91 98765 00001', 'ADMIN', 'COUNTER-01'),
(2, 'Rahul Sharma (Cashier)', 'rahul.cashier@possaas.com', '$2a$10$hashedCashierPassword', '+91 98765 00002', 'CASHIER', 'COUNTER-01'),
(3, 'Pooja Verma (Cashier)', 'pooja.cashier@possaas.com', '$2a$10$hashedCashierPassword', '+91 98765 00003', 'CASHIER', 'COUNTER-02');

-- Store Settings
INSERT INTO store_settings (id, store_name, tagline, gstin, phone, email, address, state, state_code, currency, receipt_footer)
VALUES (1, 'PosSaaS SuperMart & Retail Store', 'Fast, Smart & Accurate Billing', '27AABCS1429B1Z2', '+91 98765 43210', 'billing@possaas.com', 'Shop #12, Apex Mall, Central Avenue, Mumbai', 'Maharashtra', '27', '₹', 'Thank you for shopping with us! Visit again. Exchange within 7 days with original invoice.');

-- Categories matching the reference screenshot & retail verticals
INSERT INTO categories (id, name, code, icon, description) VALUES
(1, 'Clothes & Shoes', 'CAT-CLOTH-SHOE', 'shirt', 'Apparel, footwear and fashion wear'),
(2, 'Girl\'s Clothing', 'CAT-GIRL-WEAR', 'sparkles', 'Women and girls modern dresses & casuals'),
(3, 'Fashion Accessories', 'CAT-FASHION', 'watch', 'Watches, belts, bags and styling accessories'),
(4, 'Grocery & Staples', 'CAT-GROCERY', 'shopping-basket', 'Daily groceries, pulses, grains and spices'),
(5, 'Medical & Pharmacy', 'CAT-MEDICINE', 'pill', 'Pharmaceuticals, healthcare and personal care'),
(6, 'Electronics & Gadgets', 'CAT-ELEC', 'smartphone', 'Mobile accessories, audio and smart devices');

-- Products matching the screenshot (e.g. T-SHIRT MEN ROYAL T-SHIRT, dresses, etc.)
INSERT INTO products (id, name, sku, barcode, category_id, brand, unit, cost_price, selling_price, mrp, stock_quantity, min_stock_alert, gst_rate, hsn_code, image_url) VALUES
(1, 'T-Shirt Men Royal Blue Slim Fit', 'TSH-ROYAL-M', '890123450001', 1, 'RoyalWear', 'pcs', 240.00, 399.00, 599.00, 48, 10, 5.00, '610910', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=60'),
(2, 'Casual Cotton Green Summer Dress', 'DRS-SUMMER-G', '890123450002', 2, 'Aura Fashion', 'pcs', 550.00, 899.00, 1299.00, 22, 5, 12.00, '620442', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&auto=format&fit=crop&q=60'),
(3, 'High-Rise Beige Linen Trousers', 'TRS-BEIGE-32', '890123450003', 1, 'UrbanFit', 'pcs', 450.00, 749.00, 999.00, 15, 5, 12.00, '620342', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&auto=format&fit=crop&q=60'),
(4, 'Floral Print Chiffon Maxi Dress', 'DRS-FLORAL-M', '890123450004', 2, 'Bella Bella', 'pcs', 700.00, 1199.00, 1699.00, 18, 5, 12.00, '620444', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300&auto=format&fit=crop&q=60'),
(5, 'Men\'s Denim Trucker Jacket', 'JKT-DENIM-L', '890123450005', 1, 'LeviStrauss', 'pcs', 1100.00, 1799.00, 2499.00, 8, 5, 12.00, '620140', 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=300&auto=format&fit=crop&q=60'),
(6, 'Sport Running Sneakers Mesh White', 'SHOE-RUN-W42', '890123450006', 1, 'AeroStride', 'pair', 800.00, 1349.00, 1999.00, 14, 4, 18.00, '640411', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=60'),
(7, 'Basmati Premium Royal Rice 5kg', 'GROC-RICE-5KG', '890123450007', 4, 'IndiaGate', 'bag', 380.00, 480.00, 520.00, 35, 10, 0.00, '100630', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&auto=format&fit=crop&q=60'),
(8, 'Cold-Pressed Pure Sunflower Oil 1L', 'GROC-OIL-1L', '890123450008', 4, 'Fortune', 'bottle', 130.00, 165.00, 180.00, 4, 10, 5.00, '151219', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&auto=format&fit=crop&q=60'), -- Low stock
(9, 'Paracetamol 650mg Strip of 15', 'MED-DOLO-650', '890123450009', 5, 'MicroLabs', 'strip', 22.00, 32.00, 35.00, 80, 20, 12.00, '300490', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=60'),
(10, 'Vitamin C Zinc Chewable 30s', 'MED-VITC-30', '890123450010', 5, 'Limcee', 'bottle', 75.00, 115.00, 130.00, 3, 15, 12.00, '300450', 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&auto=format&fit=crop&q=60'), -- Low stock
(11, 'Wireless Bluetooth Earbuds Pro', 'ELEC-TWS-01', '890123450011', 6, 'SoundPod', 'pcs', 650.00, 1099.00, 1999.00, 12, 5, 18.00, '851830', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&auto=format&fit=crop&q=60'),
(12, 'Fast Charging Cable USB-C 65W', 'ELEC-CABLE-65W', '890123450012', 6, 'AnkerPower', 'pcs', 120.00, 249.00, 399.00, 2, 8, 18.00, '854442', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300&auto=format&fit=crop&q=60'); -- Low stock

-- Customers
INSERT INTO customers (id, name, phone, email, address, city, state, gstin, balance_due, total_spent) VALUES
(1, 'Walk-in Customer', '0000000000', 'walkin@store.com', 'Counter Sale', 'Mumbai', 'Maharashtra', NULL, 0.00, 12450.00),
(2, 'Rahul Sharma', '+91 98201 11223', 'rahul.sharma@gmail.com', 'B-402, Lotus Enclave, Andheri West', 'Mumbai', 'Maharashtra', '27ABCPS1234D1Z5', 0.00, 6850.00),
(3, 'Priya Patel', '+91 98765 22334', 'priya.patel@outlook.com', '12, Sunrise Residency, Borivali', 'Mumbai', 'Maharashtra', NULL, 350.00, 14200.00),
(4, 'Vikram Singh', '+91 91234 56789', 'vikram.singh@yahoo.com', 'Shop 4, Market Yard, Dadar', 'Mumbai', 'Maharashtra', '27AABCS5566K1Z9', 1200.00, 32500.00);

-- Suppliers
INSERT INTO suppliers (id, company_name, contact_person, phone, email, gstin, address, outstanding_payable) VALUES
(1, 'Textile World Wholesalers', 'Anand Kulkarni', '+91 98230 44556', 'orders@textileworld.in', '27AAACT1234E1Z1', 'Surat Textile Market, Surat', 14500.00),
(2, 'Metro Grocery Distributors', 'Mahesh Jain', '+91 98450 77889', 'supply@metrogrocery.in', '27AAACM9988D1Z2', 'APMC Market, Vashi, Navi Mumbai', 6200.00),
(3, 'PharmaCare Life Sciences', 'Dr. Sunil Mehta', '+91 98110 33221', 'sales@pharmacare.com', '27AAACP3344F1Z7', 'Bhiwandi Pharma Hub, Thane', 0.00);

-- Sample Initial Sales Orders
INSERT INTO orders (id, invoice_number, customer_id, order_date, subtotal, discount_amount, tax_amount, cgst_amount, sgst_amount, igst_amount, grand_total, payment_method, payment_status, amount_paid, change_returned, due_amount) VALUES
(1, 'INV-20261109-001', 2, '2026-11-09 10:15:00', 1298.00, 50.00, 95.80, 47.90, 47.90, 0.00, 1343.80, 'UPI', 'PAID', 1343.80, 0.00, 0.00),
(2, 'INV-20261109-002', 3, '2026-11-09 11:42:00', 899.00, 0.00, 107.88, 53.94, 53.94, 0.00, 1006.88, 'CASH', 'PAID', 1100.00, 93.12, 0.00),
(3, 'INV-20261109-003', 4, '2026-11-09 13:05:00', 3598.00, 100.00, 420.00, 210.00, 210.00, 0.00, 3918.00, 'DUE', 'PARTIALLY_PAID', 2718.00, 0.00, 1200.00);

-- Order Items
INSERT INTO order_items (id, order_id, product_id, product_name, product_sku, hsn_code, quantity, unit_cost, unit_price, discount_amount, gst_rate, tax_amount, subtotal, total_amount) VALUES
(1, 1, 1, 'T-Shirt Men Royal Blue Slim Fit', 'TSH-ROYAL-M', '610910', 2, 240.00, 399.00, 0.00, 5.00, 39.90, 798.00, 837.90),
(2, 1, 3, 'High-Rise Beige Linen Trousers', 'TRS-BEIGE-32', '620342', 1, 450.00, 749.00, 50.00, 12.00, 55.90, 699.00, 754.90),
(3, 2, 2, 'Casual Cotton Green Summer Dress', 'DRS-SUMMER-G', '620442', 1, 550.00, 899.00, 0.00, 12.00, 107.88, 899.00, 1006.88),
(4, 3, 5, 'Men\'s Denim Trucker Jacket', 'JKT-DENIM-L', '620140', 2, 1100.00, 1799.00, 100.00, 12.00, 420.00, 3498.00, 3918.00);

