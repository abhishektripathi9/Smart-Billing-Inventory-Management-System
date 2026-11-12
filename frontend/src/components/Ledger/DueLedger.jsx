import React, { useState } from 'react';
import { CreditCard, Search, ArrowDownLeft, CheckCircle2, Phone, User, AlertTriangle } from 'lucide-react';

export default function DueLedger({ customers, onSettleDue, currency = '₹' }) {
  const [search, setSearch] = useState('');
  const [selectedCust, setSelectedCust] = useState(null);
  const [settleAmount, setSettleAmount] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dueCustomers = customers.filter(
    (c) =>
      Number(c.balanceDue) > 0 &&
      (c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search))
  );

  const totalOutstanding = customers.reduce(
    (sum, c) => sum + (Number(c.balanceDue) || 0),
    0
  );

  const handleOpenSettle = (c) => {
    setSelectedCust(c);
    setSettleAmount(c.balanceDue);
    setIsModalOpen(true);
  };

  const handleSettleSubmit = (e) => {
    e.preventDefault();
    if (selectedCust && Number(settleAmount) > 0) {
      onSettleDue(selectedCust.id, Number(settleAmount));
      setIsModalOpen(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-100 space-y-5">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-red-600" />
            Customer Due List &amp; Khata Book
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track credit sales, pending customer balances and record settlements.
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 p-3 rounded-xl flex items-center gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 block">
              Total Outstanding Balance
            </span>
            <div className="text-xl font-black text-red-700">
              {currency}{totalOutstanding.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search due account by customer name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Due Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Address / Area</th>
                <th className="py-3 px-4 text-right">Lifetime Purchases</th>
                <th className="py-3 px-4 text-right">Current Due Amount</th>
                <th className="py-3 px-4 text-center">Settlement Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dueCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1" />
                    All customer dues are completely cleared! No pending balance.
                  </td>
                </tr>
              ) : (
                dueCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">{c.name}</td>
                    <td className="py-3 px-4 font-mono text-slate-700">{c.phone}</td>
                    <td className="py-3 px-4 text-slate-500">{c.address || '—'}</td>
                    <td className="py-3 px-4 text-right text-slate-700 font-semibold">
                      {currency}{Number(c.totalSpent || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-black text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-lg text-xs">
                        {currency}{Number(c.balanceDue).toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleOpenSettle(c)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs transition flex items-center gap-1 mx-auto"
                      >
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                        <span>Receive Payment</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Settle Modal */}
      {isModalOpen && selectedCust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm p-6 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900">
              Record Due Payment Settlement
            </h3>
            <p className="text-xs text-slate-500">
              Customer: <strong className="text-slate-800">{selectedCust.name}</strong>
              <br />
              Pending Amount: <strong className="text-red-600">{currency}{selectedCust.balanceDue}</strong>
            </p>

            <form onSubmit={handleSettleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Amount Received ({currency})
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  max={selectedCust.balanceDue}
                  required
                  value={settleAmount}
                  onChange={(e) => setSettleAmount(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-extrabold bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs shadow-sm"
                >
                  Confirm &amp; Update Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

