import React, { useState, useRef, useEffect } from 'react';
import {
  MoreVertical,
  Maximize2,
  Minimize2,
  Globe,
  Download,
  Volume2,
  VolumeX,
  Keyboard,
  LogOut,
  Check,
  Sparkles,
  Shield,
  HelpCircle,
  QrCode,
  Copy,
  Smartphone,
  Wifi,
  X,
  LayoutDashboard,
  ShoppingCart,
  Boxes,
  Package,
  Truck,
  CreditCard,
  TrendingUp,
  Settings as SettingsIcon,
  Menu
} from 'lucide-react';
import { sounds } from '../../utils/audio';

export default function MoreMenu({
  language = 'en',
  onLanguageChange,
  onLogout,
  onOpenUserModal,
  onToggleSidebar,
  currentView = 'pos',
  setCurrentView
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Capture PWA install prompt
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  // Listen to fullscreen changes
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

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
    setIsOpen(false);
  };

  const toggleSound = () => {
    sounds.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) sounds.playBeep();
  };

  const handleInstallApp = async () => {
    setIsOpen(false);
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') setDeferredPrompt(null);
    } else {
      alert(
        "To install smartBiz:\n• On Chrome/Edge: Look at the right side of your address bar and click the 'Install' icon.\n• On Mobile: Tap the 3 dots menu and select 'Add to Home Screen' or 'Install App'."
      );
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Three Dots Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="More Options (Full Screen, Language, Sound)"
        className={`p-2 rounded-xl border transition flex items-center justify-center ${
          isOpen
            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
        }`}
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 max-h-[85vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 divide-y divide-slate-100">
          {/* Section 0: Open Full Sidebar Menu (Drawer on Mobile / Desktop) */}
          {onToggleSidebar && (
            <div className="pb-1.5">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onToggleSidebar();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 text-white font-bold transition shadow-sm hover:from-indigo-700 hover:to-purple-700"
              >
                <div className="flex items-center gap-2.5">
                  <Menu className="w-4 h-4" />
                  <span>{language === 'hi' ? 'साइडबार मेन्यू खोलें' : 'Open Sidebar Menu'}</span>
                </div>
                <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-white/20">
                  ALL (15)
                </span>
              </button>
            </div>
          )}

          {/* Section 1: Quick Navigation Module Switcher */}
          {setCurrentView && (
            <div className="py-2 space-y-1">
              <div className="px-3 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {language === 'hi' ? 'सीधे मॉड्यूल चुनें (Quick Switch)' : 'Quick Navigation'}
                </span>
                <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                  {currentView.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1 px-1">
                <button
                  onClick={() => {
                    setCurrentView('pos');
                    setIsOpen(false);
                  }}
                  className={`p-2 rounded-xl flex items-center gap-2 font-bold text-[11px] transition text-left ${
                    currentView === 'pos'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <ShoppingCart className={`w-3.5 h-3.5 flex-shrink-0 ${currentView === 'pos' ? 'text-white' : 'text-emerald-500'}`} />
                  <span className="truncate">{language === 'hi' ? 'POS बिलिंग' : 'POS Sale'}</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentView('dashboard');
                    setIsOpen(false);
                  }}
                  className={`p-2 rounded-xl flex items-center gap-2 font-bold text-[11px] transition text-left ${
                    currentView === 'dashboard'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className={`w-3.5 h-3.5 flex-shrink-0 ${currentView === 'dashboard' ? 'text-white' : 'text-blue-500'}`} />
                  <span className="truncate">{language === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentView('products');
                    setIsOpen(false);
                  }}
                  className={`p-2 rounded-xl flex items-center gap-2 font-bold text-[11px] transition text-left ${
                    currentView === 'products'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Package className={`w-3.5 h-3.5 flex-shrink-0 ${currentView === 'products' ? 'text-white' : 'text-amber-500'}`} />
                  <span className="truncate">{language === 'hi' ? 'सामान (Products)' : 'Products'}</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentView('purchases');
                    setIsOpen(false);
                  }}
                  className={`p-2 rounded-xl flex items-center gap-2 font-bold text-[11px] transition text-left ${
                    currentView === 'purchases'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Truck className={`w-3.5 h-3.5 flex-shrink-0 ${currentView === 'purchases' ? 'text-white' : 'text-indigo-500'}`} />
                  <span className="truncate">{language === 'hi' ? 'खरीद (Stock)' : 'Purchases'}</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentView('due_list');
                    setIsOpen(false);
                  }}
                  className={`p-2 rounded-xl flex items-center gap-2 font-bold text-[11px] transition text-left ${
                    currentView === 'due_list'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <CreditCard className={`w-3.5 h-3.5 flex-shrink-0 ${currentView === 'due_list' ? 'text-white' : 'text-red-500'}`} />
                  <span className="truncate">{language === 'hi' ? 'उधारी (Due)' : 'Due List'}</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentView('loss_profit');
                    setIsOpen(false);
                  }}
                  className={`p-2 rounded-xl flex items-center gap-2 font-bold text-[11px] transition text-left ${
                    currentView === 'loss_profit'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <TrendingUp className={`w-3.5 h-3.5 flex-shrink-0 ${currentView === 'loss_profit' ? 'text-white' : 'text-emerald-500'}`} />
                  <span className="truncate">{language === 'hi' ? 'मुनाफा / P&L' : 'Profit / Loss'}</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentView('inventory_sales');
                    setIsOpen(false);
                  }}
                  className={`p-2 rounded-xl flex items-center gap-2 font-bold text-[11px] transition text-left ${
                    currentView === 'inventory_sales'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Boxes className={`w-3.5 h-3.5 flex-shrink-0 ${currentView === 'inventory_sales' ? 'text-white' : 'text-purple-500'}`} />
                  <span className="truncate">{language === 'hi' ? 'थोक (Wholesale)' : 'Wholesale'}</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentView('settings');
                    setIsOpen(false);
                  }}
                  className={`p-2 rounded-xl flex items-center gap-2 font-bold text-[11px] transition text-left ${
                    currentView === 'settings'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <SettingsIcon className={`w-3.5 h-3.5 flex-shrink-0 ${currentView === 'settings' ? 'text-white' : 'text-slate-500'}`} />
                  <span className="truncate">{language === 'hi' ? 'सेटिंग्स' : 'Settings'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Section 2: Fullscreen Mode */}
          <div className="py-1.5 space-y-0.5">
            <button
              onClick={toggleFullscreen}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold transition"
            >
              <div className="flex items-center gap-2.5">
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4 text-indigo-600" />
                ) : (
                  <Maximize2 className="w-4 h-4 text-indigo-600" />
                )}
                <span>{isFullscreen ? 'Exit Full Screen' : 'Full Screen POS Mode'}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">F11</span>
            </button>
          </div>

          {/* Section 2: Bilingual Language Option (English / Hindi) */}
          <div className="py-1.5 space-y-1">
            <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Language / भाषा (Bilingual)
            </span>

            <div className="grid grid-cols-2 gap-1 px-1">
              <button
                onClick={() => {
                  onLanguageChange('en');
                  setIsOpen(false);
                }}
                className={`py-1.5 px-2.5 rounded-lg font-bold flex items-center justify-between text-xs transition ${
                  language === 'en'
                    ? 'bg-indigo-50 text-indigo-900 border border-indigo-200 font-extrabold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>English (EN)</span>
                {language === 'en' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
              </button>

              <button
                onClick={() => {
                  onLanguageChange('hi');
                  setIsOpen(false);
                }}
                className={`py-1.5 px-2.5 rounded-lg font-bold flex items-center justify-between text-xs transition ${
                  language === 'hi'
                    ? 'bg-indigo-50 text-indigo-900 border border-indigo-200 font-extrabold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>हिंदी (Hindi)</span>
                {language === 'hi' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
              </button>
            </div>
          </div>

          {/* Section 3: App & Hardware Tools */}
          <div className="py-1.5 space-y-0.5">
            {/* Scan Mobile QR Code */}
            <button
              onClick={() => {
                setShowQrModal(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold transition"
            >
              <div className="flex items-center gap-2.5">
                <QrCode className="w-4 h-4 text-purple-600" />
                <span>{language === 'hi' ? 'फोन पर टेस्ट करें (QR Code)' : 'Mobile Test QR Code'}</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">
                SCAN
              </span>
            </button>

            {/* Install Desktop/Mobile App */}
            <button
              onClick={handleInstallApp}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold transition"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>{language === 'hi' ? 'ऐप इंस्टॉल करें (Desktop / Mobile)' : 'Install Desktop / Mobile App'}</span>
            </button>

            {/* Toggle Scanner Beep Sound */}
            <button
              onClick={toggleSound}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold transition"
            >
              <div className="flex items-center gap-2.5">
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-indigo-600" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                )}
                <span>Barcode Beep Audio</span>
              </div>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  soundEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {soundEnabled ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Keyboard Shortcuts */}
            <button
              onClick={() => {
                setShowShortcutsModal(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold transition"
            >
              <Keyboard className="w-4 h-4 text-amber-500" />
              <span>Cashier Shortcuts (F2)</span>
            </button>
          </div>

          {/* Section 4: Sign Out / Switch Terminal */}
          {onLogout && (
            <div className="pt-1.5">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 font-bold transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out / Switch Terminal</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Keyboard Shortcuts Dialog */}
      {showShortcutsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-2 font-black text-sm text-slate-900 border-b pb-3">
              <Keyboard className="w-5 h-5 text-indigo-600" />
              <span>Cashier POS Keyboard Shortcuts</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded-lg bg-slate-50 border">
                <span className="text-slate-600">Focus Barcode Scanner:</span>
                <kbd className="px-2 py-0.5 rounded bg-white border border-slate-300 font-mono font-bold text-indigo-700">
                  F2
                </kbd>
              </div>

              <div className="flex justify-between p-2 rounded-lg bg-slate-50 border">
                <span className="text-slate-600">Full Screen POS Terminal:</span>
                <kbd className="px-2 py-0.5 rounded bg-white border border-slate-300 font-mono font-bold text-indigo-700">
                  F11
                </kbd>
              </div>

              <div className="flex justify-between p-2 rounded-lg bg-slate-50 border">
                <span className="text-slate-600">Add Scanned Item:</span>
                <kbd className="px-2 py-0.5 rounded bg-white border border-slate-300 font-mono font-bold text-indigo-700">
                  Enter
                </kbd>
              </div>

              <div className="flex justify-between p-2 rounded-lg bg-slate-50 border">
                <span className="text-slate-600">Print Active Bill:</span>
                <kbd className="px-2 py-0.5 rounded bg-white border border-slate-300 font-mono font-bold text-indigo-700">
                  Ctrl + P
                </kbd>
              </div>
            </div>

            <button
              onClick={() => setShowShortcutsModal(false)}
              className="w-full py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-700 transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Mobile App Testing QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col text-slate-800">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-purple-700 via-indigo-700 to-indigo-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs">
                  <Smartphone className="w-5 h-5 text-purple-200" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm tracking-tight">
                    {language === 'hi' ? 'फोन पर smartBiz टेस्ट करें' : 'Test smartBiz on Mobile Phone'}
                  </h3>
                  <p className="text-[11px] text-purple-200">
                    {language === 'hi' ? 'कैमरे से QR कोड स्कैन करें' : 'Instant Wireless Phone Access'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowQrModal(false)}
                className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col items-center text-center space-y-4">
              {/* QR Code Container */}
              <div className="p-4 bg-white rounded-2xl border-2 border-indigo-100 shadow-lg relative group">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=http://10.189.102.61:5173/"
                  alt="smartBiz Mobile App QR Code"
                  className="w-56 h-56 object-contain rounded-xl"
                />
                <div className="absolute inset-x-0 -bottom-3 flex justify-center">
                  <span className="px-3 py-1 bg-indigo-600 text-white font-extrabold text-[10px] rounded-full shadow-md uppercase tracking-wider">
                    smartBiz PWA
                  </span>
                </div>
              </div>

              {/* Direct URL Box */}
              <div className="w-full pt-2">
                <div className="text-[11px] font-bold text-slate-500 mb-1.5 flex items-center justify-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'hi' ? 'सीधा मोबाइल लिंक (Same Wi-Fi)' : 'Direct Mobile Network URL'}</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="flex-1 font-mono text-xs font-bold text-indigo-700 truncate text-left select-all">
                    http://10.189.102.61:5173/
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText('http://10.189.102.61:5173/');
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      copied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? (language === 'hi' ? 'कॉपी हुआ!' : 'Copied!') : (language === 'hi' ? 'कॉपी' : 'Copy')}</span>
                  </button>
                </div>
              </div>

              {/* Instructions 1-2-3 */}
              <div className="w-full p-3.5 bg-purple-50/60 rounded-2xl border border-purple-100 text-left space-y-1.5 text-xs text-slate-700">
                <div className="font-bold text-purple-900 text-[11px] uppercase tracking-wide">
                  {language === 'hi' ? '3 आसान चरणों में शुरू करें:' : '3 Quick Steps to Test:'}
                </div>
                <div className="flex items-start gap-2 text-[11px]">
                  <span className="w-4 h-4 rounded-full bg-purple-200 text-purple-800 font-black flex items-center justify-center flex-shrink-0 text-[10px]">1</span>
                  <span>{language === 'hi' ? 'फोन को उसी वाई-फाई (Wi-Fi) से कनेक्ट करें।' : 'Connect your phone to the same Wi-Fi network.'}</span>
                </div>
                <div className="flex items-start gap-2 text-[11px]">
                  <span className="w-4 h-4 rounded-full bg-purple-200 text-purple-800 font-black flex items-center justify-center flex-shrink-0 text-[10px]">2</span>
                  <span>{language === 'hi' ? 'फोन के कैमरे या Google Lens से ऊपर दिया गया QR कोड स्कैन करें।' : 'Scan this QR code using your phone camera or Google Lens.'}</span>
                </div>
                <div className="flex items-start gap-2 text-[11px]">
                  <span className="w-4 h-4 rounded-full bg-purple-200 text-purple-800 font-black flex items-center justify-center flex-shrink-0 text-[10px]">3</span>
                  <span>{language === 'hi' ? 'ब्राउज़र में "Add to Home Screen" दबाकर ऐप की तरह इस्तेमाल करें!' : 'In Chrome/Safari, tap "Add to Home Screen" to install it as an App!'}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowQrModal(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition"
              >
                {language === 'hi' ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

