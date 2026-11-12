import React, { useState } from 'react';
import {
  TrendingUp,
  Plus,
  Search,
  DollarSign,
  Download,
  Calendar,
  CheckCircle2,
  Trash2,
  Sparkles
} from 'lucide-react';
import { exportToCSV } from '../../utils/exportCsv';

export default function IncomeTracker({
  currency = '₹',
  language = 'en'
}) {
  const [incomes, setIncomes] = useState([
    {
      id: 1,
      title: 'Customer Home Delivery Charges',
      category: 'Delivery / Shipping',
      amount: 1450.00,
      paymentMode: 'CASH',
      date: '2026-11-09',
      notes: 'Collected from 29 home delivery orders'
    },
    {
      id: 2,
      title: 'Packaging Carton & Waste Paper Sale',
      category: 'Scrap & Waste',
      amount: 680.00,
      paymentMode: 'CASH',
      date: '2026-11-08',
      notes: 'Sold to local recycling vendor'
    },
    {
      id: 3,
      title: 'Brand Promotional Display Rack Fee',
      category: 'Brand Sponsorship',
      amount: 3500.00,
      paymentMode: 'UPI',
      date: '2026-11-05',
      notes: 'Fortune Oil promotional floor display space'
    },
    {
      id: 4,
      title: 'Supplier Volume Cash Rebate',
      category: 'Vendor Cashback',
      amount: 2200.00,
      paymentMode: 'BANK_TRANSFER',
      date: '2026-11-01',
      notes: 'Quarterly target incentive from textile distributor'
    }
  ]);

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newIncome, setNewIncome] = useState({
    title: '',
    category: 'Delivery / Shipping',
    amount: '',
    paymentMode: 'CASH',
    date: new Date().toISOString().slice(0, 10),
    notes: ''
  });

  const totalIncome = incomes.reduce((sum, i) => sum + Number(i.amount), 0);

  const filteredIncomes = incomes.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const amount = Number(newIncome.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    setIncomes([
      {
        id: Date.now(),
        ...newIncome,
        amount
      },
      ...incomes
    ]);

    setIsModalOpen(false);
    setNewIncome({
      title: '',
      category: 'Delivery / Shipping',
      amount: '',
      paymentMode: 'CASH',
      date: new Date().toISOString().slice(0, 10),
      notes: ''
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this income record?')) {
      setIncomes(incomes.filter(i => i.id !== id));
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-100 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span>{language === 'hi' ? 'दुकान की अन्य आय (Other Income)' : 'Other Store Income & Receipts'}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'hi' ? 'डिलीवरी शुल्क, ब्रांड स्पॉन्सरशिप, कबाड़ बिक्री और सप्लायर कैश डिस्काउंट।' : 'Non-sales store revenues, shipping fees, scrap sales and brand display commissions.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToCSV(incomes, 'Other_Income_Report')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'hi' ? 'आय दर्ज करें' : 'Record Income'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {language === 'hi' ? 'कुल संचित अन्य आय' : 'Total Other Income'}
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {currency}{totalIncome.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Added to store net profit</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {language === 'hi' ? 'आय प्रविष्टियों की संख्या' : 'Income Vouchers'}
          </span>
          <div className="text-2xl font-black text-indigo-900 mt-1">
            {incomes.length} {language === 'hi' ? 'प्रविष्टियां' : 'Entries'}
          </div>
          <span className="text-[11px] text-indigo-600 font-medium">Verified receipts</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {language === 'hi' ? 'सर्वाधिक आय का स्रोत' : 'Top Income Stream'}
          </span>
          <div className="text-lg font-black text-slate-800 mt-1 truncate">
            Brand Sponsorship &amp; Delivery
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">High recurring margin</span>
        </div>
      </div>

      {/* Income Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-200">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={language === 'hi' ? 'आय का स्रोत खोजें...' : 'Search income records...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
              <tr>
                <th className="px-4 py-3">INCOME DESCRIPTION</th>
                <th className="px-4 py-3">CATEGORY</th>
                <th className="px-4 py-3">DATE</th>
                <th className="px-4 py-3 text-center">MODE</th>
                <th className="px-4 py-3 text-right">AMOUNT</th>
                <th className="px-4 py-3 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredIncomes.map((i) => (
                <tr key={i.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3">
                    <div className="font-extrabold text-slate-800">{i.title}</div>
                    <div className="text-[10px] text-slate-400">{i.notes || 'Direct store receipt'}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {i.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{i.date}</td>
                  <td className="px-4 py-3 text-center font-bold text-slate-600">{i.paymentMode}</td>
                  <td className="px-4 py-3 text-right font-black text-emerald-600 text-sm">
                    +{currency}{i.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(i.id)}
                      className="text-slate-300 hover:text-red-500 transition p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Income Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="border-b pb-3">
              <h3 className="font-black text-sm text-slate-900">
                {language === 'hi' ? 'दुकान की अन्य आय दर्ज करें' : 'Record Other Store Income'}
              </h3>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Income Description:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Home Delivery Service Fee"
                  value={newIncome.title}
                  onChange={(e) => setNewIncome({ ...newIncome, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category:
                  </label>
                  <select
                    value={newIncome.category}
                    onChange={(e) => setNewIncome({ ...newIncome, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="Delivery / Shipping">Delivery / Shipping</option>
                    <option value="Scrap & Waste">Scrap & Waste</option>
                    <option value="Brand Sponsorship">Brand Sponsorship</option>
                    <option value="Vendor Cashback">Vendor Cashback</option>
                    <option value="Other Receipts">Other Receipts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Amount ({currency}):
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    value={newIncome.amount}
                    onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Payment Mode:
                  </label>
                  <select
                    value={newIncome.paymentMode}
                    onChange={(e) => setNewIncome({ ...newIncome, paymentMode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="CASH">Cash</option>
                    <option value="UPI">UPI / QR</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Date:
                  </label>
                  <input
                    type="date"
                    required
                    value={newIncome.date}
                    onChange={(e) => setNewIncome({ ...newIncome, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md transition"
                >
                  Save Income
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

