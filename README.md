# smartBiz - Smart Billing & Inventory Management System

> **A high-performance Point of Sale (POS), GST Billing, and Inventory Management System designed for grocery stores, medical pharmacies, clothing apparel boutiques, supermarkets, and wholesale distributors.**

Built with **React.js + Tailwind CSS** on the frontend, **Spring Boot 3 + Spring Data JPA** on the backend, and **MySQL 8.0+** (with zero-friction embedded H2 fallback for instant out-of-the-box evaluation).

---

## 🌟 Key Features

### 1. High-Speed Point of Sale (POS) Billing
- **Two-Column Split Interface**: Real-time billing cart on the left and quick-pick product catalog with category pills on the right.
- **Instant Product Search & Barcode Scanning**: Scan barcodes or type SKU / product names with instant `Enter` or `F2` focus shortcut.
- **One-Click Item Increments**: Quick `+` and `-` quantity controls, unit price edits, and item removal.
- **Comprehensive Totals Engine**: Subtotal, shipping/delivery charges, order-level discounts (% or ₹), and dynamic tax computation.

### 2. Automated GST Tax Engine (Indian GST Standard)
- **HSN & SAC Code Tracking**: Maps each product to its respective HSN code.
- **Flexible Tax Slabs**: Automatic 0% (Exempt), 5%, 12%, 18%, and 28% tax rates.
- **Automatic Intrastate Split**: Real-time calculation of **CGST (50%)** and **SGST (50%)** for local sales, or **IGST** for interstate orders.
- **Audit-Ready GSTR-1 Summaries**: Exportable slab-wise turnover and tax collection reports.

### 3. Professional Dual-Format Invoicing
- **80mm Thermal Receipt (POS Roll)**: Formatted for standard retail thermal slip printers with shop details, itemized table, cashier name, barcode, and footer message.
- **Full A4 GST Tax Invoice**: Official Tax Invoice layout with Supplier GSTIN, Buyer GSTIN, HSN table, amounts in words, bank account details, and authorized signature box.
- **Native 1-Click Print & PDF**: Clean `@media print` CSS ensures clean receipts without UI clutter.

### 4. Product & Stock Inventory Management
- **Catalog Management**: Add, edit, and organize products across categories (Groceries, Apparel, Footwear, Medicines, Electronics).
- **Multi-Unit Support**: Pieces (`pcs`), Kilograms (`kg`), Bottles (`bottle`), Strips (`strip`), Cartons (`box`), and Pairs (`pair`).
- **Low-Stock Alert Automation**: Automated threshold monitoring with flashing alert badges and a dedicated reorder dashboard.

### 5. Customer Directory & Credit Ledger (Khata Book)
- **Credit Sales Management**: Issue goods on credit (`DUE` payment mode) with instant ledger balance updates.
- **Due Settlement Modal**: Accept partial or full payments against customer balances with real-time balance reduction.
- **Customer Profiles**: Record customer mobile number, address, and GSTIN for B2B billing.

### 6. Vendor & Supplier Directory
- Track wholesale distributors, purchase contacts, vendor GSTIN numbers, and pending accounts payable.

### 7. Executive Dashboard & Financial Analytics
- **Live KPI Metrics**: Today's Sales, Total Orders, Estimated Gross Profit, Low Stock Warning, and Pending Credit Dues.
- **Sales Turnover Chart**: Interactive 7-day revenue trend visualization.
- **Payment Method Split**: Visual breakdown of Cash, UPI, Card, and Due transactions.

---

## 🏗️ Architecture & Technology Stack

```
Smart Billing & Inventory Management System/
│
├── frontend/                     # React.js SPA (Vite + Tailwind CSS + Lucide Icons)
│   ├── src/
│   │   ├── components/
│   │   │   ├── POS/             # POSSale, PaymentModal, InvoiceModal, QuickCustomerModal
│   │   │   ├── Dashboard/       # KPI cards, charts, recent transactions
│   │   │   ├── Products/        # Inventory catalog, stock alerts, Add/Edit modal
│   │   │   ├── Sales/           # Past invoices, reprint receipts
│   │   │   ├── Customers/       # Customer directory, Khata book, dues
│   │   │   ├── Suppliers/       # Vendor directory
│   │   │   ├── Ledger/          # Due List & Settlement
│   │   │   ├── Reports/         # Daily/Monthly sales, GST GSTR-1 summary
│   │   │   └── Settings/        # Business profile, GSTIN, receipt footer
│   │   ├── services/api.js      # Hybrid API (Spring Boot REST + LocalStorage sync)
│   │   ├── data/initialData.js  # Rich initial demo dataset
│   │   ├── App.jsx              # Main application shell
│   │   └── index.css            # Tailwind & @media print styles
│   └── package.json
│
├── backend/                      # Spring Boot 3.2.x REST API (Java 17+)
│   ├── src/main/java/com/smartbilling/
│   │   ├── controller/          # ProductController, BillingController, CustomerController, etc.
│   │   ├── model/               # JPA Entities: Product, Order, OrderItem, Customer, Supplier
│   │   ├── repository/          # Spring Data JPA repositories
│   │   ├── service/             # BillingService, ProductService, DashboardService
│   │   ├── dto/                 # Request/Response DTOs
│   │   └── config/              # CorsConfig, DataSeeder (runs on startup)
│   ├── src/main/resources/
│   │   ├── application.properties        # Dev embedded profile (H2, zero-friction)
│   │   └── application-mysql.properties  # Production MySQL profile
│   └── pom.xml
│
├── database/
│   ├── schema.sql               # MySQL 8.0 DDL table definitions
│   └── seed_data.sql            # Initial sample catalog, customers & invoices
│
├── run_frontend.bat             # 1-Click launcher for React frontend
└── run_backend.bat              # 1-Click launcher for Spring Boot backend
```

---

## 🚀 Quick Start Guide

### 1. Launching the React Frontend
The React frontend includes a built-in interactive demo engine with automatic persistence. It connects seamlessly to the Spring Boot backend if running, or operates with localStorage if offline.

```bash
# Option A: Double click run_frontend.bat
# Option B: Run via terminal
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

### 2. Launching the Spring Boot Backend (Optional)
The backend provides enterprise REST APIs for persistence in MySQL or embedded H2.

#### Option A: Using your preferred Java IDE (IntelliJ IDEA / Eclipse / VS Code)
1. Open the `backend/` folder in your IDE as a Maven project.
2. Locate `src/main/java/com/smartbilling/SmartBillingApplication.java`.
3. Click **Run**.
4. REST APIs will be live at `http://localhost:8080/api`.
5. H2 Web Console available at `http://localhost:8080/h2-console` (`JDBC URL: jdbc:h2:mem:smartbilling`, User: `sa`, Password: blank).

#### Option B: Using Maven CLI
```bash
cd backend
mvn spring-boot:run
```

#### Connecting to MySQL
To connect to a live MySQL database instead of the embedded engine:
1. Create a MySQL database:
   ```sql
   CREATE DATABASE smart_billing_db;
   ```
2. Import `database/schema.sql` and `database/seed_data.sql`.
3. In `backend/src/main/resources/application.properties`, activate the MySQL profile:
   ```properties
   spring.profiles.active=mysql
   ```
4. Adjust credentials in `application-mysql.properties` (`root` / your password).

---

## 📋 REST API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Retrieve all products (supports `?search=`, `?categoryId=`, `?lowStock=true`) |
| `POST` | `/api/products` | Create a new product with barcode, SKU, GST rate, and stock alerts |
| `PUT` | `/api/products/{id}` | Update product information |
| `DELETE` | `/api/products/{id}` | Remove a product |
| `POST` | `/api/orders` | Create a sale, deduct inventory, compute GST, and generate invoice |
| `GET` | `/api/orders` | Retrieve list of all past invoices |
| `GET` | `/api/orders/{id}` | Retrieve specific invoice details |
| `GET` | `/api/orders/invoice/{num}` | Lookup order by invoice number |
| `GET` | `/api/customers` | Retrieve all customer records (supports `?hasDue=true`) |
| `POST` | `/api/customers` | Register a new customer |
| `POST` | `/api/customers/{id}/settle-due` | Settle pending credit / Khata balance |
| `GET` | `/api/suppliers` | List all suppliers |
| `POST` | `/api/suppliers` | Add a supplier |
| `GET` | `/api/dashboard/stats` | Retrieve aggregate KPI metrics, today's sales, and profit |

---

## 🎯 Target Verticals & Business Configurations

1. **Grocery & Supermarkets**: High-speed barcode scanning, bulk weight units (`kg`, `g`, `bag`), 0% and 5% food grain GST rates.
2. **Medical Stores & Pharmacies**: Strip & bottle units, HSN 3004 tracking, 12% medicine GST rates, fast patient billing.
3. **Clothing & Fashion Boutiques**: Size/variant tracking, seasonal apparel, 5% and 12% textile GST rates, thermal billing.
4. **Wholesalers & Distributors**: Customer credit ledgers, B2B GSTIN invoices, bank detail printing, bulk discount calculation.

---

## 📄 License
This project is open-source and free for commercial and portfolio demonstration use.

