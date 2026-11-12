import React, { useState, useMemo } from 'react';
import {
  FileText,
  Calendar,
  Download,
  Printer,
  TrendingUp,
  Percent,
  DollarSign,
  PieChart,
  BarChart3,
  CheckCircle2
} from 'lucide-react';

export default function Reports({ orders, products, currency = '₹' }) {
  const [dateRange, setDateRange] = useState('ALL'); // 'TODAY', 'WEEK', 'MONTH', 'ALL'

  // Filter orders based on range
  const filteredOrders = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    return orders.filter((o) => {
      if (dateRange === 'ALL') return true;
      const orderDateStr = (o.orderDate || '').slice(0, 10);

      if (dateRange === 'TODAY') {
        return orderDateStr === todayStr;
      }
      if (dateRange === 'WEEK') {
        const orderTime = new Date(o.orderDate).getTime();
        const weekAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
        return orderTime >= weekAgo;
      }
      if (dateRange === 'MONTH') {
        const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
        return orderDateStr >= monthStart;
      }
      return true;
    });
  }, [orders, dateRange]);

  // Aggregate numbers
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
  const totalTax = filteredOrders.reduce((sum, o) => sum + (o.taxAmount || 0), 0);
  const totalDiscount = filteredOrders.reduce((sum, o) => sum + (o.discountAmount || 0), 0);
  const totalSubtotal = filteredOrders.reduce((sum, o) => sum + (o.subtotal || 0), 0);

  // Compute GST slabs
  const gstSlabs = {
    '0': { rate: 0, taxable: 0, tax: 0 },
    '5': { rate: 5, taxable: 0, tax: 0 },
    '12': { rate: 12, taxable: 0, tax: 0 },
    '18': { rate: 18, taxable: 0, tax: 0 },
    '28': { rate: 28, taxable: 0, tax: 0 }
  };

  filteredOrders.forEach((o) => {
    (o.items || []).forEach((item) => {
      const rateKey = String(item.gstRate || 0);
      const lineTaxable = (item.quantity || 1) * (item.unitPrice || 0);
      const lineTax = (lineTaxable * (item.gstRate || 0)) / 100;

      if (!gstSlabs[rateKey]) {
        gstSlabs[rateKey] = { rate: Number(rateKey), taxable: 0, tax: 0 };
      }
      gstSlabs[rateKey].taxable += lineTaxable;
      gstSlabs[rateKey].tax += lineTax;
    });
  });

  // Payment method breakdowns
  const paymentMethods = {
    CASH: 0,
    UPI: 0,
    CARD: 0,
    DUE: 0
  };

  filteredOrders.forEach((o) => {
    const method = (o.paymentMethod || 'CASH').toUpperCase();
    paymentMethods[method] = (paymentMethods[method] || 0) + (o.grandTotal || 0);
  });

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-100 space-y-5">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Financial &amp; GST Sales Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit-ready sales breakdowns, slab-wise GST filing summaries and profit metrics.
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {[
            { id: 'TODAY', label: "Today" },
            { id: 'WEEK', label: '7 Days' },
            { id: 'MONTH', label: 'This Month' },
            { id: 'ALL', label: 'All Time' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDateRange(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition text-xs ${
                dateRange === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Net Sales Revenue
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {currency}{totalRevenue.toFixed(2)}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            {filteredOrders.length} Invoices generated
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total GST Collected
          </span>
          <div className="text-2xl font-black text-indigo-700 mt-1">
            {currency}{totalTax.toFixed(2)}
          </div>
          <span className="text-xs text-indigo-600 mt-1 block font-semibold">
            CGST: {currency}{(totalTax / 2).toFixed(2)} | SGST: {currency}{(totalTax / 2).toFixed(2)}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Discounts Granted
          </span>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            {currency}{totalDiscount.toFixed(2)}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            Promotional &amp; coupon savings
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Taxable Value (Pre-Tax)
          </span>
          <div className="text-2xl font-black text-slate-800 mt-1">
            {currency}{totalSubtotal.toFixed(2)}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Base turnover</span>
        </div>
      </div>

      {/* GST Slabs Table (Audit Compliant) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">
              GST Slab-wise Tax Summary (GSTR-1 Format)
            </h3>
            <p className="text-xs text-slate-500">
              Breakdown required for Indian GST Return filing &amp; tax compliance
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">GST Slab Rate</th>
                <th className="py-3 px-4 text-right">Taxable Turnover</th>
                <th className="py-3 px-4 text-right">CGST (50%)</th>
                <th className="py-3 px-4 text-right">SGST (50%)</th>
                <th className="py-3 px-4 text-right">Total Tax Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {Object.keys(gstSlabs).map((rate) => {
                const slab = gstSlabs[rate];
                return (
                  <tr key={rate} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-bold font-sans text-slate-900">
                      <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-extrabold mr-2">
                        {rate}%
                      </span>
                      {rate === '0' ? 'Nil / Exempted' : rate === '28' ? 'Luxury / Demerit' : 'Standard Rate'}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-800">
                      {currency}{slab.taxable.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-600">
                      {currency}{(slab.tax / 2).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-600">
                      {currency}{(slab.tax / 2).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-indigo-900">
                      {currency}{slab.tax.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-slate-50 font-extrabold border-t border-slate-200 text-xs">
              <tr>
                <td className="py-3 px-4">Total Aggregate</td>
                <td className="py-3 px-4 text-right font-mono">{currency}{totalSubtotal.toFixed(2)}</td>
                <td className="py-3 px-4 text-right font-mono">{currency}{(totalTax / 2).toFixed(2)}</td>
                <td className="py-3 px-4 text-right font-mono">{currency}{(totalTax / 2).toFixed(2)}</td>
                <td className="py-3 px-4 text-right font-mono text-indigo-700">
                  {currency}{totalTax.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Payment Modes Split */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900">
          Payment Modes Settlement
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(paymentMethods).map(([method, amount]) => {
            const percent = totalRevenue > 0 ? ((amount / totalRevenue) * 100).toFixed(1) : 0;
            return (
              <div key={method} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {method === 'DUE' ? 'Credit (Due)' : method}
                </span>
                <div className="text-base font-extrabold text-slate-800 mt-1">
                  {currency}{amount.toFixed(2)}
                </div>
                <div className="text-[11px] font-semibold text-indigo-600 mt-0.5">
                  {percent}% of turnover
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

