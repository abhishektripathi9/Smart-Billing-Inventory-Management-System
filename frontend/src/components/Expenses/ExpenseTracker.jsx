import React, { useState } from 'react';
import { DollarSign, Plus, Trash2, Calendar, Tag, ArrowDownCircle, Download } from 'lucide-react';
import { exportToCSV } from '../../utils/exportCsv';

export default function ExpenseTracker({ currency = '₹' }) {
  const [expenses, setExpenses] = useState([
    { id: 1, date: '2026-11-09', title: 'Counter Staff Daily Refreshments & Tea', category: 'Staff Welfare', amount: 180, paymentMode: 'CASH' },
    { id: 2, date: '2026-11-09', title: 'Local Delivery Rickshaw Freight Charges', category: 'Logistics', amount: 350, paymentMode: 'CASH' },
    { id: 3, date: '2026-11-08', title: 'Thermal Paper Roll 80mm (Box of 20)', category: 'Store Consumables', amount: 620, paymentMode: 'UPI' },
    { id: 4, date: '2026-11-07', title: 'Store Cleaning & Maintenance Supplies', category: 'Cleaning', amount: 240, paymentMode: 'CASH' }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Staff Welfare',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    paymentMode: 'CASH',
    notes: ''
  });

  const totalExpense = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;
    const newExpense = {
      ...formData,
      id: Date.now(),
      amount: Number(formData.amount)
    };
    setExpenses([newExpense, ...expenses]);
    setIsModalOpen(false);
    setFormData({
      title: '',
      category: 'Staff Welfare',
      amount: '',
      date: new Date().toISOString().slice(0, 10),
      paymentMode: 'CASH',
      notes: ''
    });
  };

  const handleDelete = (id) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const handleExportCSV = () => {
    const exportData = expenses.map((e) => ({
      'Date': e.date,
      'Title': e.title,
      'Category': e.category,
      'Amount': e.amount,
      'Payment Mode': e.paymentMode,
      'Notes': e.notes || ''
    }));
    exportToCSV(exportData, `Store_Expenses_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-100 space-y-5">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ArrowDownCircle className="w-5 h-5 text-red-600" />
            Store Daily Expenses &amp; Petty Cash
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Log shop overheads, freight, staff refreshments, maintenance and utility expenses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            <span>Export Expenses</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-red-600/30 flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* KPI Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Overheads Logged
          </span>
          <div className="text-2xl font-black text-red-600 mt-1">
            {currency}{totalExpense.toFixed(2)}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            {expenses.length} expense entries recorded
          </span>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Expense Title / Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 text-slate-500 font-mono">{e.date}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{e.title}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                      {e.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded uppercase font-bold text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {e.paymentMode}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-black text-red-600">
                    -{currency}{Number(e.amount).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleDelete(e.id)}
                      className="p-1 rounded bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-400 transition"
                      title="Delete Entry"
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

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900">Record Store Expense</h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Expense Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tea & snacks for staff, Courier delivery"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none font-semibold"
                >
                  <option value="Staff Welfare">Staff Welfare / Refreshments</option>
                  <option value="Logistics">Logistics / Transportation</option>
                  <option value="Store Consumables">Store Consumables (Packaging / Rolls)</option>
                  <option value="Electricity / Utility">Electricity &amp; Utilities</option>
                  <option value="Cleaning">Store Cleaning &amp; Sanitization</option>
                  <option value="Repairs">Repairs &amp; Hardware Maintenance</option>
                  <option value="Other">Other Expenses</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Amount ({currency}) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2 font-bold text-red-600 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Mode</label>
                  <select
                    value={formData.paymentMode}
                    onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none font-bold"
                  >
                    <option value="CASH">Cash (from Till)</option>
                    <option value="UPI">UPI / Digital</option>
                    <option value="CARD">Debit / Credit Card</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

