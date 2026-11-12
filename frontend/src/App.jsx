import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import POSSale from './components/POS/POSSale';
import InventorySales from './components/Sales/InventorySales';
import PaymentModal from './components/POS/PaymentModal';
import InvoiceModal from './components/POS/InvoiceModal';
import QuickCustomerModal from './components/POS/QuickCustomerModal';
import Dashboard from './components/Dashboard/Dashboard';
import ProductManagement from './components/Products/ProductManagement';
import PurchaseManagement from './components/Purchases/PurchaseManagement';
import SalesList from './components/Sales/SalesList';
import CustomerList from './components/Customers/CustomerList';
import DueList from './components/Customers/DueList';
import SupplierList from './components/Suppliers/SupplierList';
import DueLedger from './components/Ledger/DueLedger';
import LossProfit from './components/Reports/LossProfit';
import Reports from './components/Reports/Reports';
import Settings from './components/Settings/Settings';
import Subscription from './components/Settings/Subscription';
import BarcodeGenerator from './components/Products/BarcodeGenerator';
import QuotationList from './components/Sales/QuotationList';
import ExpenseTracker from './components/Expenses/ExpenseTracker';
import IncomeTracker from './components/Expenses/IncomeTracker';
import CashRegister from './components/CashRegister/CashRegister';
import UserModal from './components/Auth/UserModal';
import AuthScreen from './components/Auth/AuthScreen';
import { INITIAL_USERS } from './data/initialData';
import { translations } from './utils/i18n';
import { api, checkBackendHealth } from './services/api';

export default function App() {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('smartbiz_lang') || 'en';
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('smartbiz_auth_user');
  });
  const [currentView, setCurrentView] = useState('pos'); // Default to POS Sale matching screenshot!
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('pos_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });
  const [currentUser, setCurrentUser] = useState(() => {
    const savedAuth = localStorage.getItem('smartbiz_auth_user');
    return savedAuth ? JSON.parse(savedAuth) : users[0] || INITIAL_USERS[0];
  });
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [quotations, setQuotations] = useState([
    {
      id: 1,
      quotationNumber: 'QTN-20261109-501',
      customer: { name: 'Dr. Sunil Mehta (Pharma)' },
      date: '2026-11-09 11:00:00',
      items: [{ productName: 'Paracetamol 650mg Strip of 15', quantity: 50, unitPrice: 32 }],
      taxAmount: 192.00,
      grandTotal: 1792.00
    }
  ]);
  const [settings, setSettings] = useState(api.getSettings());

  const [selectedStore, setSelectedStore] = useState('Main Outlet - Store 01');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [cart, setCart] = useState([]);

  // Modals state
  const [pendingCheckoutOrder, setPendingCheckoutOrder] = useState(null);
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [isQuickCustomerOpen, setIsQuickCustomerOpen] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);

  // Load initial data
  const loadAllData = async () => {
    const isHealthy = await checkBackendHealth();
    setBackendConnected(isHealthy);

    const [prods, cats, custs, supps, ords] = await Promise.all([
      api.getProducts(),
      api.getCategories(),
      api.getCustomers(),
      api.getSuppliers(),
      api.getOrders()
    ]);

    setProducts(prods);
    setCategories(cats);
    setCustomers(custs);
    setSuppliers(supps);
    setOrders(ords);

    if (custs.length > 0 && !selectedCustomer) {
      setSelectedCustomer(custs[0]);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Low stock products count
  const lowStockItems = products.filter(
    (p) => p.stockQuantity <= (p.minStockAlert || 5)
  );

  // Handlers for POS Sale & Invoicing
  const handleProceedToPayment = (orderDraft) => {
    setPendingCheckoutOrder(orderDraft);
  };

  const handleConfirmOrder = async (finalOrderData) => {
    const orderWithCashier = {
      ...finalOrderData,
      cashierName: currentUser?.name || 'Admin Cashier',
      counterId: currentUser?.counterId || 'COUNTER-01'
    };
    const createdOrder = await api.createOrder(orderWithCashier);
    setCart([]);
    setPendingCheckoutOrder(null);
    setActiveInvoice(createdOrder);

    // Refresh products and customers
    loadAllData();
  };

  // Handlers for Products
  const handleSaveProduct = async (productData) => {
    await api.saveProduct(productData);
    const updated = await api.getProducts();
    setProducts(updated);
  };

  const handleDeleteProduct = async (id) => {
    await api.deleteProduct(id);
    const updated = await api.getProducts();
    setProducts(updated);
  };

  // Handlers for Customers
  const handleSaveCustomer = async (custData) => {
    const saved = await api.saveCustomer(custData);
    const updated = await api.getCustomers();
    setCustomers(updated);
    setSelectedCustomer(saved);
  };

  const handleSettleDue = async (customerId, amount) => {
    await api.settleCustomerDue(customerId, amount);
    const updated = await api.getCustomers();
    setCustomers(updated);
  };

  // Handlers for Suppliers
  const handleSaveSupplier = async (suppData) => {
    await api.saveSupplier(suppData);
    const updated = await api.getSuppliers();
    setSuppliers(updated);
  };

  // Handlers for Settings
  const handleSaveSettings = (newSettings) => {
    const saved = api.saveSettings(newSettings);
    setSettings(saved);
  };

  const handleLoginSuccess = (user, isNew = false) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('smartbiz_auth_user', JSON.stringify(user));

    if (isNew) {
      const updatedUsers = [...users, user];
      setUsers(updatedUsers);
      localStorage.setItem('pos_users', JSON.stringify(updatedUsers));
      if (user.storeName) {
        const updatedSettings = {
          ...settings,
          storeName: user.storeName,
          gstin: user.gstin || settings.gstin
        };
        setSettings(updatedSettings);
        api.saveSettings(updatedSettings);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('smartbiz_auth_user');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <AuthScreen
        onLoginSuccess={handleLoginSuccess}
        existingUsers={users}
      />
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans antialiased text-slate-800">
      {/* Left Sidebar (Responsive Drawer on Mobile / Full on Desktop) */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        lowStockCount={lowStockItems.length}
        currentUser={currentUser}
        onLogout={handleLogout}
        language={language}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <Header
          selectedStore={selectedStore}
          setSelectedStore={setSelectedStore}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
          customers={customers}
          onOpenNewCustomerModal={() => setIsQuickCustomerOpen(true)}
          lowStockItems={lowStockItems}
          backendConnected={backendConnected}
          onSelectLowStockItem={(item) => {
            setCurrentView('products');
          }}
          currentUser={currentUser}
          onOpenUserModal={() => setIsUserModalOpen(true)}
          onLogout={handleLogout}
          language={language}
          onLanguageChange={(l) => {
            setLanguage(l);
            localStorage.setItem('smartbiz_lang', l);
          }}
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          currentView={currentView}
          setCurrentView={setCurrentView}
        />

        {/* Dynamic Views */}
        {currentView === 'pos' && (
          <POSSale
            products={products}
            selectedCustomer={selectedCustomer}
            onProceedToPayment={handleProceedToPayment}
            cart={cart}
            setCart={setCart}
            currency={settings.currency || '₹'}
            language={language}
          />
        )}

        {currentView === 'inventory_sales' && (
          <InventorySales
            products={products}
            customers={customers}
            onConfirmOrder={handleConfirmOrder}
            currency={settings.currency || '₹'}
            language={language}
          />
        )}

        {currentView === 'dashboard' && (
          <Dashboard
            products={products}
            orders={orders}
            customers={customers}
            setCurrentView={setCurrentView}
            onViewInvoice={(order) => setActiveInvoice(order)}
            currency={settings.currency || '₹'}
            language={language}
          />
        )}

        {currentView === 'purchases' && (
          <PurchaseManagement
            initialTab="new"
            suppliers={suppliers}
            products={products}
            onAddStockPurchase={(items) => {
              setProducts((prev) =>
                prev.map((p) => {
                  const matching = items.find((item) => item.productId === p.id);
                  if (matching) {
                    return {
                      ...p,
                      stockQuantity: p.stockQuantity + matching.quantity,
                      costPrice: matching.costPrice || p.costPrice
                    };
                  }
                  return p;
                })
              );
            }}
            currency={settings.currency || '₹'}
            language={language}
          />
        )}

        {currentView === 'purchase_list' && (
          <PurchaseManagement
            initialTab="list"
            suppliers={suppliers}
            products={products}
            currency={settings.currency || '₹'}
            language={language}
          />
        )}

        {currentView === 'products' && (
          <ProductManagement
            products={products}
            categories={categories}
            onSaveProduct={handleSaveProduct}
            onDeleteProduct={handleDeleteProduct}
            currency={settings.currency || '₹'}
            language={language}
          />
        )}

        {currentView === 'low_stock' && (
          <ProductManagement
            products={products}
            categories={categories}
            onSaveProduct={handleSaveProduct}
            onDeleteProduct={handleDeleteProduct}
            filterLowStockOnly={true}
            currency={settings.currency || '₹'}
            language={language}
          />
        )}

        {currentView === 'sales_list' && (
          <SalesList
            orders={orders}
            onViewInvoice={(order) => setActiveInvoice(order)}
            currency={settings.currency || '₹'}
            language={language}
          />
        )}

        {currentView === 'quotations' && (
          <QuotationList
            quotations={quotations}
            onConvertToSale={(q) => {
              // Convert quote to live POS cart!
              const convertedItems = (q.items || []).map((item, idx) => ({
                id: item.productId || Date.now() + idx,
                name: item.productName || 'Quoted Item',
                sellingPrice: item.unitPrice,
                unitPrice: item.unitPrice,
                quantity: item.quantity,
                stockQuantity: 99,
                gstRate: 12
              }));
              setCart(convertedItems);
              setCurrentView('pos');
            }}
            onDeleteQuotation={(id) => {
              setQuotations(quotations.filter((q) => q.id !== id));
            }}
            onOpenPos={() => setCurrentView('pos')}
            currency={settings.currency || '₹'}
            language={language}
          />
        )}

        {currentView === 'barcodes' && (
          <BarcodeGenerator
            products={products}
            settings={settings}
            currency={settings.currency || '₹'}
            language={language}
          />
        )}

        {currentView === 'customers' && (
          <CustomerList
            customers={customers}
            onSaveCustomer={handleSaveCustomer}
            onSettleDue={handleSettleDue}
            currency={settings.currency || '₹'}
            language={language}
          />
        )}

        {currentView === 'due_list' && (
          <DueList
            customers={customers}
            onSettleDue={handleSettleDue}
            currency={settings.currency || '₹'}
            language={language}
          />
        )}

        {currentView === 'suppliers' && (
          <SupplierList
            suppliers={suppliers}
            onSaveSupplier={handleSaveSupplier}
            currency={settings.currency || '₹'}
            language={language}
          />
        )}

        {currentView === 'ledger' && (
          <DueLedger
            customers={customers}
            onSettleDue={handleSettleDue}
            currency={settings.currency || '₹'}
            language={language}
          />
        )}

        {currentView === 'loss_profit' && (
          <LossProfit
            orders={orders}
            products={products}
            currency={settings.currency || '₹'}
            language={language}
          />
        )}

        {currentView === 'income' && (
          <IncomeTracker
            currency={settings.currency || '₹'}
            language={language}
          />
        )}

        {currentView === 'reports' && (
          <Reports
            orders={orders}
            products={products}
            currency={settings.currency || '₹'}
            language={language}
          />
        )}

        {currentView === 'expenses' && (
          <ExpenseTracker currency={settings.currency || '₹'} language={language} />
        )}

        {currentView === 'cash_register' && (
          <CashRegister orders={orders} currency={settings.currency || '₹'} language={language} />
        )}

        {currentView === 'subscription' && (
          <Subscription currency={settings.currency || '₹'} language={language} />
        )}

        {currentView === 'settings' && (
          <Settings
            settings={settings}
            onSaveSettings={handleSaveSettings}
            backendConnected={backendConnected}
            language={language}
          />
        )}
      </div>

      {/* Payment Modal */}
      {pendingCheckoutOrder && (
        <PaymentModal
          orderData={pendingCheckoutOrder}
          onClose={() => setPendingCheckoutOrder(null)}
          onConfirmOrder={handleConfirmOrder}
          currency={settings.currency || '₹'}
          language={language}
        />
      )}

      {/* Invoice Modal */}
      {activeInvoice && (
        <InvoiceModal
          order={activeInvoice}
          settings={settings}
          onClose={() => setActiveInvoice(null)}
          currency={settings.currency || '₹'}
          language={language}
        />
      )}

      {/* Quick Customer Modal */}
      {isQuickCustomerOpen && (
        <QuickCustomerModal
          onClose={() => setIsQuickCustomerOpen(false)}
          onSaveCustomer={handleSaveCustomer}
        />
      )}

      {/* Staff Authentication & User Registration Modal */}
      {isUserModalOpen && (
        <UserModal
          users={users}
          currentUser={currentUser}
          onSelectUser={(u) => setCurrentUser(u)}
          onRegisterUser={(newUser) => {
            const updated = [...users, newUser];
            setUsers(updated);
            setCurrentUser(newUser);
            localStorage.setItem('pos_users', JSON.stringify(updated));
          }}
          onClose={() => setIsUserModalOpen(false)}
        />
      )}
    </div>
  );
}

