import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Building2,
  User,
  Plus,
  Bell,
  CheckCircle2,
  Server,
  Globe,
  AlertTriangle,
  Barcode,
  Maximize2,
  Minimize2,
  Download,
  LogOut,
  Menu
} from 'lucide-react';
import MoreMenu from './Header/MoreMenu';

export default function Header({
  selectedStore,
  setSelectedStore,
  selectedCustomer,
  setSelectedCustomer,
  customers,
  onOpenNewCustomerModal,
  lowStockItems,
  backendConnected,
  onSelectLowStockItem,
  currentUser,
  onOpenUserModal,
  onLogout,
  language = 'en',
  onLanguageChange,
  onToggleSidebar,
  currentView,
  setCurrentView
}) {
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      alert("To install as an app:\n• On Chrome/Edge: Click the 'Install App' icon on the right side of the address bar.\n• On Mobile: Tap browser menu and choose 'Add to Home Screen'.");
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      setCurrentDateTime(now.toLocaleDateString('en-GB', options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between shadow-xs sticky top-0 z-30">
      {/* Left section: Hamburger, Date, Store Selector & Customer Picker */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Hamburger Toggle for Sidebar */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 lg:hidden transition border border-slate-200 flex items-center justify-center flex-shrink-0"
          title="Open Menu / मेन्यू खोलें"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Date / Live Clock */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700">
          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
          <span>{currentDateTime}</span>
        </div>

        {/* Store / Branch Selector */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700">
          <Building2 className="w-3.5 h-3.5 text-indigo-600" />
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="bg-transparent border-none text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="Main Outlet - Store 01">Main Outlet (Retail Counter)</option>
            <option value="Central Warehouse A">Central Warehouse A</option>
            <option value="Express Wholesale Counter">Express Wholesale Counter</option>
          </select>
        </div>

        {/* Quick Customer Picker */}
        <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
          <User className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={selectedCustomer ? selectedCustomer.id : ''}
            onChange={(e) => {
              const cust = customers.find(c => c.id === Number(e.target.value));
              setSelectedCustomer(cust || customers[0]);
            }}
            className="bg-transparent border-none text-xs font-semibold text-slate-800 focus:outline-none max-w-[140px] truncate cursor-pointer"
          >
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.balanceDue > 0 ? `(Due: ₹${c.balanceDue})` : ''}
              </option>
            ))}
          </select>
          <button
            onClick={onOpenNewCustomerModal}
            title="Add New Customer"
            className="p-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Right section: System Status, Low Stock Alert Bell, Language, Profile */}
      <div className="flex items-center gap-3">
        {/* Install App Button */}
        <button
          onClick={handleInstallClick}
          title="Install smartBiz as a Desktop/Mobile App"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold border border-indigo-200 transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'ऐप इंस्टॉल करें' : 'Install App'}</span>
        </button>

        {/* Fullscreen Counter POS Mode */}
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen POS Mode" : "Enter Fullscreen Counter POS Mode"}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-indigo-600" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Backend API Connection Status */}
        <div
          title={backendConnected ? "Spring Boot REST API is connected" : "Running in instant browser demo mode with LocalStorage persistence"}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition ${
            backendConnected
              ? "bg-emerald-50 text-emerald-700 border-emerald-300"
              : "bg-indigo-50 text-indigo-700 border-indigo-200"
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${backendConnected ? "bg-emerald-500 animate-pulse" : "bg-indigo-500"}`}></span>
          <span className="hidden sm:inline">
            {backendConnected ? "Spring Boot API" : "Portfolio Mode"}
          </span>
        </div>

        {/* Low-Stock Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {lowStockItems.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-bounce">
                {lowStockItems.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Inventory Alerts
                </span>
                <span className="text-[10px] font-semibold text-slate-500">
                  {lowStockItems.length} Low Stock
                </span>
              </div>

              {lowStockItems.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-500">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                  All products healthy!
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto space-y-1.5 text-xs">
                  {lowStockItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setShowNotifications(false);
                        if (onSelectLowStockItem) onSelectLowStockItem(item);
                      }}
                      className="p-2 rounded-lg bg-amber-50/70 border border-amber-200 hover:bg-amber-100 cursor-pointer flex items-center justify-between transition"
                    >
                      <div className="truncate pr-2">
                        <div className="font-semibold text-slate-800 truncate">{item.name}</div>
                        <div className="text-[10px] text-slate-500">SKU: {item.sku}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-xs font-extrabold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">
                          {item.stockQuantity} {item.unit || 'pcs'} left
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bilingual Quick Toggle Pill */}
        <button
          onClick={() => onLanguageChange && onLanguageChange(language === 'en' ? 'hi' : 'en')}
          title="Click to switch language: English / हिंदी"
          className="flex items-center gap-1.5 text-xs text-slate-700 font-bold px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 transition"
        >
          <Globe className="w-3.5 h-3.5 text-indigo-600" />
          <span>{language === 'en' ? 'EN / हिंदी' : 'हिंदी / EN'}</span>
        </button>

        {/* Three Dots More Menu (Full Screen, Language, Sound, Shortcuts, Navigation, Sign Out) */}
        <MoreMenu
          language={language}
          onLanguageChange={onLanguageChange}
          onLogout={onLogout}
          onOpenUserModal={onOpenUserModal}
          onToggleSidebar={onToggleSidebar}
          currentView={currentView}
          setCurrentView={setCurrentView}
        />

        {/* User / Cashier Profile (Clickable to switch cashier or register staff) */}
        <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
          <button
            onClick={onOpenUserModal}
            title="Click to Switch Cashier or Register New Staff"
            className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center text-xs shadow-sm uppercase">
              {currentUser?.name?.slice(0, 2) || 'AD'}
            </div>
            <div className="hidden md:block text-left text-xs leading-tight">
              <div className="font-bold text-slate-800 truncate max-w-[120px]">
                {currentUser?.name || 'Admin Store'}
              </div>
              <div className="text-[10px] text-indigo-600 font-semibold">
                {currentUser?.role || 'CASHIER'} • {currentUser?.counterId || 'POS'}
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}

