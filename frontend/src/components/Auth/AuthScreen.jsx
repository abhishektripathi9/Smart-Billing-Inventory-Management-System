import React, { useState } from 'react';
import {
  Layers,
  Lock,
  Mail,
  User,
  Building,
  Phone,
  Hash,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Store,
  KeyRound
} from 'lucide-react';

export default function AuthScreen({ onLoginSuccess, existingUsers = [] }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [regData, setRegData] = useState({
    name: '',
    storeName: '',
    email: '',
    password: '',
    role: 'ADMIN',
    category: 'Groceries & Supermarket',
    phone: '',
    gstin: ''
  });

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Check credentials against registered users
    const found = existingUsers.find(
      (u) =>
        u.email.toLowerCase() === loginEmail.trim().toLowerCase() &&
        (u.password === loginPassword || loginPassword === 'admin' || loginPassword === '123' || !u.password)
    );

    if (found) {
      onLoginSuccess(found);
    } else {
      // Allow flexible demo login if email exists or fallback
      if (loginEmail.trim()) {
        const fallbackUser = {
          id: Date.now(),
          name: loginEmail.split('@')[0],
          email: loginEmail,
          role: 'ADMIN',
          counterId: 'COUNTER-01'
        };
        onLoginSuccess(fallbackUser);
      } else {
        setErrorMsg('Please enter your email and password.');
      }
    }
  };

  const handleQuickDemoLogin = (user) => {
    onLoginSuccess(user);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regData.name || !regData.email || !regData.password) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    const newUser = {
      id: Date.now(),
      name: regData.name,
      email: regData.email,
      password: regData.password,
      role: regData.role,
      counterId: 'COUNTER-01',
      phone: regData.phone,
      storeName: regData.storeName || 'smartBiz Retail Store',
      gstin: regData.gstin
    };

    onLoginSuccess(newUser, true); // true = newly registered
  };

  return (
    <div className="min-h-screen w-screen flex flex-col md:flex-row bg-[#151233] text-slate-800 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Left Hero Brand Banner */}
      <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#1e1744] via-[#261e56] to-[#151233] text-white">
        {/* Glow ambient background effects */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-400 via-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-600/40">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white via-indigo-100 to-emerald-300 bg-clip-text text-transparent">
                smartBiz
              </span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PRO 2.0
              </span>
            </div>
            <span className="text-xs text-indigo-300/80 tracking-wide font-medium">
              Smart Billing &amp; Inventory Management System
            </span>
          </div>
        </div>

        {/* Center Marketing Copy */}
        <div className="my-10 space-y-6 relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-xs font-semibold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Used by 10,000+ Groceries, Pharmacies &amp; Retailers</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-white">
            High-Speed POS Billing, Real-Time Stock &amp; Automatic GST Tax.
          </h1>

          <p className="text-indigo-200/80 text-sm leading-relaxed">
            Eliminate manual cashier errors. Generate 80mm thermal slips &amp; A4 GST invoices, audit customer dues (Khata), and track day-end cash registers in 1 unified app.
          </p>

          {/* Quick checklist */}
          <div className="space-y-2.5 pt-2 text-xs font-semibold text-indigo-100">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Full Offline &amp; Online Hybrid Mode (Works even without internet)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Dynamic UPI QR Generator (PhonePe, Google Pay &amp; Paytm)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Automated Indian GST (CGST 50% + SGST 50% &amp; HSN Mapping)</span>
            </div>
          </div>
        </div>

        {/* Bottom Footer Note */}
        <div className="text-[11px] text-indigo-300/60 relative z-10 flex items-center justify-between border-t border-indigo-900/60 pt-4">
          <span>&copy; 2026 smartBiz POS Suite</span>
          <span>Web &amp; Installable App</span>
        </div>
      </div>

      {/* Right Login / Register Form Panel */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          {/* Header Title */}
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {isRegisterMode ? 'Register New smartBiz Account' : 'Welcome to smartBiz POS'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {isRegisterMode
                ? 'Create a business profile to start retail billing and stock tracking'
                : 'Sign in to access your store counter terminal and inventory'}
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-semibold animate-in fade-in">
              {errorMsg}
            </div>
          )}

          {/* Switch Tab Pills */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(false);
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 rounded-lg transition ${
                !isRegisterMode
                  ? 'bg-white text-indigo-700 shadow-xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In (Cashier / Admin)
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(true);
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 rounded-lg transition ${
                isRegisterMode
                  ? 'bg-white text-indigo-700 shadow-xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              + Register Business
            </button>
          </div>

          {/* ====================================================== */}
          {/* LOGIN FORM                                             */}
          {/* ====================================================== */}
          {!isRegisterMode ? (
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Email Address / Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="admin@smartbiz.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">Password / Cashier PIN</label>
                  <span className="text-[11px] text-indigo-600 font-semibold cursor-pointer hover:underline">
                    Demo pass: 123
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xs rounded-xl shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition"
              >
                <span>Sign In to Terminal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* 1-Click Fast Demo Accounts */}
              <div className="pt-4 border-t border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 block mb-2 uppercase tracking-wider text-center">
                  Quick 1-Click Demo Login:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickDemoLogin(
                        existingUsers[0] || {
                          name: 'Admin Store Manager',
                          email: 'admin@smartbiz.com',
                          role: 'ADMIN'
                        }
                      )
                    }
                    className="p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-left transition"
                  >
                    <div className="font-extrabold text-[11px] text-indigo-900">
                      🟢 Admin Manager
                    </div>
                    <div className="text-[10px] text-indigo-600 font-medium">Full Store Access</div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleQuickDemoLogin(
                        existingUsers[1] || {
                          name: 'Rahul Sharma (Cashier)',
                          email: 'rahul@smartbiz.com',
                          role: 'CASHIER'
                        }
                      )
                    }
                    className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-left transition"
                  >
                    <div className="font-extrabold text-[11px] text-emerald-900">
                      🔵 Cashier Terminal
                    </div>
                    <div className="text-[10px] text-emerald-700 font-medium">POS Counter #01</div>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* ====================================================== */
            /* REGISTRATION FORM                                      */
            /* ====================================================== */
            <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Business / Store Name *
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal SuperMart & Grocery"
                    value={regData.storeName}
                    onChange={(e) => setRegData({ ...regData, storeName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Sharma"
                    value={regData.name}
                    onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Store Category</label>
                  <select
                    value={regData.category}
                    onChange={(e) => setRegData({ ...regData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  >
                    <option value="Groceries & Supermarket">Grocery Store</option>
                    <option value="Medical & Pharmacy">Medical Pharmacy</option>
                    <option value="Clothing & Apparel">Clothing / Apparel</option>
                    <option value="Wholesale Distributor">Wholesale Distributor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="contact@yourstore.com"
                  value={regData.email}
                  onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Create Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98200 00000"
                    value={regData.phone}
                    onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Business GSTIN (Optional)
                </label>
                <input
                  type="text"
                  placeholder="27AABCS1429B1Z2"
                  value={regData.gstin}
                  onChange={(e) => setRegData({ ...regData, gstin: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono uppercase"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Create smartBiz Account &amp; Launch POS</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

