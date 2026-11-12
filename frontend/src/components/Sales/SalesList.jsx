import React, { useState, useMemo } from 'react';
import {
  Receipt,
  Search,
  Printer,
  Calendar,
  Filter,
  Eye,
  FileSpreadsheet,
  CheckCircle,
  Clock,
  AlertCircle,
  Download
} from 'lucide-react';
import { exportToCSV } from '../../utils/exportCsv';

export default function SalesList({ orders, onViewInvoice, currency = '₹' }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        search.trim() === '' ||
        o.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
        o.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
        o.paymentMethod?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL' || o.paymentStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const handleExportCSV = () => {
    const exportData = filteredOrders.map((o) => ({
      'Invoice Number': o.invoiceNumber,
      'Customer': o.customer?.name || 'Walk-in',
      'Date': o.orderDate,
      'Taxable Subtotal': o.subtotal,
      'GST Tax': o.taxAmount,
      'Grand Total': o.grandTotal,
      'Payment Mode': o.paymentMethod,
      'Status': o.paymentStatus,
      'Amount Paid': o.amountPaid,
      'Due Balance': o.dueAmount || 0
    }));
    exportToCSV(exportData, `Sales_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-100 space-y-5">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Receipt className="w-5 h-5 text-indigo-600" />
            Customer Bills &amp; Sales Invoices
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete transaction history with GST breakdowns, reprint and audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span>Export to CSV</span>
          </button>

          <div className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">
            Total: <span className="text-indigo-600 font-extrabold">{orders.length}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3 text-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by invoice number, customer name, payment method..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          {[
            { id: 'ALL', label: 'All Status' },
            { id: 'PAID', label: 'Paid' },
            { id: 'PARTIALLY_PAID', label: 'Partial' },
            { id: 'UNPAID', label: 'Due / Unpaid' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition text-xs ${
                statusFilter === tab.id
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Date &amp; Time</th>
                <th className="py-3 px-3 text-right">Taxable</th>
                <th className="py-3 px-3 text-right">GST Tax</th>
                <th className="py-3 px-3 text-right">Grand Total</th>
                <th className="py-3 px-3 text-center">Payment Mode</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400">
                    No sales invoices found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-700">
                      {o.invoiceNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">
                        {o.customer?.name || 'Walk-in Customer'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {o.customer?.phone || 'No phone'}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{o.orderDate}</td>
                    <td className="py-3 px-3 text-right text-slate-600 font-semibold">
                      {currency}{o.subtotal?.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right text-indigo-700 font-semibold">
                      +{currency}{o.taxAmount?.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-extrabold text-slate-900">
                      {currency}{o.grandTotal?.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] uppercase bg-slate-100 text-slate-700 border border-slate-200">
                        {o.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {o.paymentStatus === 'PAID' ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          PAID
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                          DUE: {currency}{o.dueAmount?.toFixed(0)}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onViewInvoice(o)}
                        className="px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1 mx-auto transition"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Bill</span>
                      </button>
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

