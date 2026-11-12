import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Truck,
  CreditCard,
  BookOpen,
  TrendingUp,
  TrendingDown,
  FileText,
  DollarSign,
  Settings,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Layers,
  AlertTriangle,
  Receipt,
  LogOut,
  Boxes,
  PackagePlus,
  Crown,
  X
} from 'lucide-react';
import { translations } from '../utils/i18n';

export default function Sidebar({
  currentView,
  setCurrentView,
  lowStockCount,
  currentUser,
  onLogout,
  language = 'en',
  isOpen = false,
  onClose
}) {
  const [salesOpen, setSalesOpen] = useState(true);
  const [purchasesOpen, setPurchasesOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);

  const t = (key) => translations[language]?.[key] || translations.en[key] || key;

  const handleNavigate = (view) => {
    setCurrentView(view);
    if (onClose) onClose();
  };

  const navItemClass = (viewKey) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
      currentView === viewKey
        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-700/40'
        : 'text-indigo-200/70 hover:text-white hover:bg-white/5'
    }`;

  const subNavItemClass = (viewKey) =>
    `flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
      currentView === viewKey
        ? 'bg-indigo-600 text-white shadow-sm'
        : 'text-indigo-300/80 hover:text-white hover:bg-white/5'
    }`;

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1e1744] text-white flex flex-col flex-shrink-0 h-screen overflow-y-auto border-r border-indigo-950/60 select-none shadow-2xl lg:shadow-none transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Logo Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-indigo-900/40 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-400 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-indigo-100 to-emerald-300 bg-clip-text text-transparent">
                  smartBiz
                </span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  PRO
                </span>
              </div>
              <span className="text-[10px] text-indigo-400 block -mt-0.5 font-medium tracking-wide">
                POS &amp; INVENTORY SUITE
              </span>
            </div>
          </div>

          {/* Close button on mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-indigo-300 hover:text-white hover:bg-white/10 lg:hidden transition"
              title="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

      {/* Navigation Links (Matching reference screenshot exactly!) */}
      <nav className="flex-1 px-3 py-4 space-y-1 text-xs">
        {/* 1. Dashboard */}
        <button
          onClick={() => handleNavigate('dashboard')}
          className={`w-full ${navItemClass('dashboard')}`}
        >
          <LayoutDashboard className="w-4 h-4 text-indigo-300" />
          <span>{t('dashboard')}</span>
        </button>

        {/* 2. Sales Dropdown */}
        <div>
          <button
            onClick={() => setSalesOpen(!salesOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-indigo-300 hover:text-white hover:bg-white/5 rounded-lg font-medium text-xs transition"
          >
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-4 h-4 text-indigo-400" />
              <span>{t('sales')}</span>
            </div>
            {salesOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {salesOpen && (
            <div className="ml-5 pl-2 mt-1 space-y-1 border-l border-indigo-800/50">
              <button
                onClick={() => handleNavigate('pos')}
                className={`w-full flex items-center justify-between ${subNavItemClass('pos')}`}
              >
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  {t('posSale')}
                </span>
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                  Live
                </span>
              </button>

              <button
                onClick={() => handleNavigate('inventory_sales')}
                className={`w-full ${subNavItemClass('inventory_sales')}`}
              >
                <Boxes className="w-3.5 h-3.5" />
                <span>{t('inventorySales')}</span>
              </button>

              <button
                onClick={() => handleNavigate('sales_list')}
                className={`w-full ${subNavItemClass('sales_list')}`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>{t('salesList')}</span>
              </button>

              <button
                onClick={() => handleNavigate('quotations')}
                className={`w-full ${subNavItemClass('quotations')}`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{t('quotations')}</span>
              </button>
            </div>
          )}
        </div>

        {/* 3. Purchases Dropdown */}
        <div>
          <button
            onClick={() => setPurchasesOpen(!purchasesOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-indigo-300 hover:text-white hover:bg-white/5 rounded-lg font-medium text-xs transition"
          >
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-indigo-400" />
              <span>{t('purchases')}</span>
            </div>
            {purchasesOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {purchasesOpen && (
            <div className="ml-5 pl-2 mt-1 space-y-1 border-l border-indigo-800/50">
              <button
                onClick={() => handleNavigate('purchases')}
                className={`w-full ${subNavItemClass('purchases')}`}
              >
                <PackagePlus className="w-3.5 h-3.5" />
                <span>{t('newPurchase')}</span>
              </button>

              <button
                onClick={() => handleNavigate('purchase_list')}
                className={`w-full ${subNavItemClass('purchase_list')}`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>{t('purchaseList')}</span>
              </button>
            </div>
          )}
        </div>

        {/* 4. Product Dropdown */}
        <div>
          <button
            onClick={() => setProductOpen(!productOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-indigo-300 hover:text-white hover:bg-white/5 rounded-lg font-medium text-xs transition"
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4 text-indigo-400" />
              <span>{t('products')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              {lowStockCount > 0 && (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                  {lowStockCount}
                </span>
              )}
              {productOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </div>
          </button>

          {productOpen && (
            <div className="ml-5 pl-2 mt-1 space-y-1 border-l border-indigo-800/50">
              <button
                onClick={() => handleNavigate('products')}
                className={`w-full ${subNavItemClass('products')}`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>{t('productList')}</span>
              </button>

              <button
                onClick={() => handleNavigate('barcodes')}
                className={`w-full ${subNavItemClass('barcodes')}`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{t('barcodes')}</span>
              </button>

              <button
                onClick={() => handleNavigate('low_stock')}
                className={`w-full flex items-center justify-between ${subNavItemClass('low_stock')}`}
              >
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('lowStock')}</span>
                </span>
                {lowStockCount > 0 && (
                  <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                    {lowStockCount}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* 5. Supplier List */}
        <button
          onClick={() => handleNavigate('suppliers')}
          className={`w-full ${navItemClass('suppliers')}`}
        >
          <Truck className="w-4 h-4 text-indigo-300" />
          <span>{t('suppliers')}</span>
        </button>

        {/* 6. Customer List */}
        <button
          onClick={() => handleNavigate('customers')}
          className={`w-full ${navItemClass('customers')}`}
        >
          <Users className="w-4 h-4 text-indigo-300" />
          <span>{t('customers')}</span>
        </button>

        {/* 7. Due List */}
        <button
          onClick={() => handleNavigate('due_list')}
          className={`w-full ${navItemClass('due_list')}`}
        >
          <CreditCard className="w-4 h-4 text-red-400" />
          <span>{t('dueList')}</span>
        </button>

        {/* 8. Ledger */}
        <button
          onClick={() => handleNavigate('ledger')}
          className={`w-full ${navItemClass('ledger')}`}
        >
          <BookOpen className="w-4 h-4 text-indigo-300" />
          <span>{t('ledger')}</span>
        </button>

        {/* 9. Loss / Profit */}
        <button
          onClick={() => handleNavigate('loss_profit')}
          className={`w-full ${navItemClass('loss_profit')}`}
        >
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>{t('lossProfit')}</span>
        </button>

        {/* 10. Income */}
        <button
          onClick={() => handleNavigate('income')}
          className={`w-full ${navItemClass('income')}`}
        >
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span>{t('income')}</span>
        </button>

        {/* 11. Expenses */}
        <button
          onClick={() => handleNavigate('expenses')}
          className={`w-full ${navItemClass('expenses')}`}
        >
          <DollarSign className="w-4 h-4 text-amber-400" />
          <span>{t('expenses')}</span>
        </button>

        {/* 12. Daily Transaction (Cash Register) */}
        <button
          onClick={() => handleNavigate('cash_register')}
          className={`w-full ${navItemClass('cash_register')}`}
        >
          <Layers className="w-4 h-4 text-indigo-300" />
          <span>{t('dailyTransaction')}</span>
        </button>

        {/* 13. Reports */}
        <button
          onClick={() => handleNavigate('reports')}
          className={`w-full ${navItemClass('reports')}`}
        >
          <FileText className="w-4 h-4 text-indigo-300" />
          <span>{t('reports')}</span>
        </button>

        {/* 14. Subscription */}
        <button
          onClick={() => handleNavigate('subscription')}
          className={`w-full ${navItemClass('subscription')}`}
        >
          <Crown className="w-4 h-4 text-amber-400" />
          <span>{t('subscription')}</span>
        </button>

        {/* 15. Store Settings */}
        <button
          onClick={() => handleNavigate('settings')}
          className={`w-full ${navItemClass('settings')}`}
        >
          <Settings className="w-4 h-4 text-indigo-300" />
          <span>{t('settings')}</span>
        </button>
      </nav>

      {/* Trial Expiry Card (Exact to reference screenshot: "Your Trial Expires in 112 days") */}
      <div className="p-3 mx-3 mb-2 rounded-2xl bg-gradient-to-br from-indigo-900/80 to-purple-950/80 border border-indigo-700/50 text-xs flex-shrink-0">
        <div className="flex items-center gap-1.5 text-amber-300 font-bold mb-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px]">
            {language === 'hi' ? 'ट्रायल 112 दिनों में समाप्त होगा' : 'Your Trial Expires in 112 days'}
          </span>
        </div>
        <p className="text-[10px] text-indigo-200/70 mb-2">
          smartBiz Enterprise Cloud Plan
        </p>
        <button
          onClick={() => handleNavigate('subscription')}
          className="w-full py-1.5 text-center text-[11px] font-extrabold rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white transition shadow-sm"
        >
          Upgrade / Renew
        </button>
      </div>

      {/* Cashier Sign Out / Switch Terminal Button */}
      {onLogout && (
        <div className="px-3 pb-3 flex-shrink-0">
          <button
            onClick={onLogout}
            title="Log out or switch cashier terminal"
            className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-red-500/20 text-indigo-200 hover:text-red-300 text-[11px] font-bold flex items-center justify-center gap-2 transition border border-white/10"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out / Switch Terminal</span>
          </button>
        </div>
      )}
    </aside>
  </>
);
}

