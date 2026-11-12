import React, { useState } from 'react';
import { FileSpreadsheet, Search, Plus, ShoppingCart, Printer, Trash2, ArrowRight } from 'lucide-react';

export default function QuotationList({
  quotations,
  onConvertToSale,
  onDeleteQuotation,
  onOpenPos,
  currency = '₹'
}) {
  const [search, setSearch] = useState('');

  const filtered = quotations.filter(
    (q) =>
      q.quotationNumber?.toLowerCase().includes(search.toLowerCase()) ||
      q.customer?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-100 space-y-5">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
            Quotations &amp; Proforma Estimates (Kaccha Bill)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Issue official price quotes and proforma estimates; convert directly to active POS bills in 1 click.
          </p>
        </div>

        <button
          onClick={onOpenPos}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Quote via POS</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search quotations by quote number or customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Quotations Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Quote #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Quote Date</th>
                <th className="py-3 px-3 text-center">Items</th>
                <th className="py-3 px-3 text-right">Estimated Tax</th>
                <th className="py-3 px-3 text-right">Quoted Total</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    No quotations generated yet. Save a cart draft as quotation from POS.
                  </td>
                </tr>
              ) : (
                filtered.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-700">
                      {q.quotationNumber}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {q.customer?.name || 'Prospective Buyer'}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{q.date}</td>
                    <td className="py-3 px-3 text-center font-bold text-slate-700">
                      {q.items?.length || 1}
                    </td>
                    <td className="py-3 px-3 text-right text-indigo-700 font-semibold">
                      +{currency}{q.taxAmount?.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-extrabold text-slate-900">
                      {currency}{q.grandTotal?.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onConvertToSale(q)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] shadow-xs flex items-center gap-1 transition"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Convert to POS Bill</span>
                        </button>
                        <button
                          onClick={() => onDeleteQuotation(q.id)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-500 transition"
                          title="Delete Quote"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

