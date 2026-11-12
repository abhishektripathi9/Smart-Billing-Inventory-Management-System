import React, { useState } from 'react';
import { UserCheck, UserPlus, X, Shield, Phone, Mail, Hash, Check } from 'lucide-react';

export default function UserModal({
  users,
  currentUser,
  onSelectUser,
  onRegisterUser,
  onClose
}) {
  const [tab, setTab] = useState('switch'); // 'switch' or 'register'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'CASHIER',
    counterId: 'COUNTER-01',
    phone: '',
    password: 'password123'
  });

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    const newUser = {
      ...formData,
      id: Date.now()
    };
    onRegisterUser(newUser);
    setTab('switch');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="font-extrabold text-sm">Staff Authentication &amp; User Register</h3>
              <p className="text-[11px] text-slate-400">
                Active: <strong className="text-white">{currentUser?.name}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs: Switch Cashier vs Register Staff */}
        <div className="flex border-b border-slate-200 text-xs font-bold bg-slate-50">
          <button
            onClick={() => setTab('switch')}
            className={`flex-1 py-3 text-center transition ${
              tab === 'switch'
                ? 'border-b-2 border-indigo-600 text-indigo-700 bg-white font-black'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Switch Active Cashier
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-3 text-center transition ${
              tab === 'register'
                ? 'border-b-2 border-indigo-600 text-indigo-700 bg-white font-black'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            + Register New Staff
          </button>
        </div>

        {/* Tab 1: Switch Cashier */}
        {tab === 'switch' && (
          <div className="p-5 space-y-3">
            <span className="text-xs font-bold text-slate-600 block mb-1">
              Select Cashier Logged into this Counter Terminal:
            </span>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {users.map((u) => {
                const isCurrent = currentUser?.id === u.id;
                return (
                  <div
                    key={u.id}
                    onClick={() => {
                      onSelectUser(u);
                      onClose();
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      isCurrent
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-900">{u.name}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>Role: {u.role}</span>
                        <span>•</span>
                        <span>{u.counterId}</span>
                      </div>
                    </div>

                    {isCurrent ? (
                      <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center gap-1">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <button className="px-2.5 py-1 text-[11px] font-bold text-indigo-600 hover:bg-indigo-100 rounded-md transition">
                        Log In
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Register New Staff */}
        {tab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="p-5 space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Kumar"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Staff Email / Username *</label>
              <input
                type="email"
                required
                placeholder="ramesh@possaas.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">System Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none font-semibold"
                >
                  <option value="CASHIER">Cashier (POS Only)</option>
                  <option value="MANAGER">Store Manager</option>
                  <option value="ADMIN">System Admin</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Counter</label>
                <select
                  value={formData.counterId}
                  onChange={(e) => setFormData({ ...formData, counterId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none font-semibold"
                >
                  <option value="COUNTER-01">Counter 01 (Front)</option>
                  <option value="COUNTER-02">Counter 02 (Express)</option>
                  <option value="TABLET-POS">Mobile / Tablet POS</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Mobile Contact</label>
              <input
                type="tel"
                placeholder="+91 98000 00000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t">
              <button
                type="button"
                onClick={() => setTab('switch')}
                className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm"
              >
                Register &amp; Add Staff
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

