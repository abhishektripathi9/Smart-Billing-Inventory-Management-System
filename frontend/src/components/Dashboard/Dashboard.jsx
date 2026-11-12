import React from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  Users,
  CreditCard,
  Receipt,
  PlusCircle,
  ArrowUpRight,
  Sparkles,
  Calendar
} from 'lucide-react';
import { translations } from '../../utils/i18n';

export default function Dashboard({
  products,
  orders,
  customers,
  setCurrentView,
  onViewInvoice,
  currency = '₹',
  language = 'en'
}) {
  const t = (k) => translations[language]?.[k] || translations.en[k] || k;
  // Aggregate KPI stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
  const totalTax = orders.reduce((sum, o) => sum + (o.taxAmount || 0), 0);
  const totalOrdersCount = orders.length;

  const lowStockProducts = products.filter(
    (p) => p.stockQuantity <= (p.minStockAlert || 5)
  );

  const totalDueAmount = customers.reduce(
    (sum, c) => sum + (Number(c.balanceDue) || 0),
    0
  );

  // Compute today's sales
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayOrders = orders.filter((o) => (o.orderDate || '').startsWith(todayStr));
  const todaySales = todayOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);

  // Estimate profit
  const estimatedProfit = orders.reduce((sum, o) => {
    let profit = 0;
    (o.items || []).forEach((item) => {
      const cost = item.unitCost || item.unitPrice * 0.7; // default 30% margin fallback
      profit += (item.unitPrice - cost) * item.quantity;
    });
    return sum + profit;
  }, 0);

  // Days trend mock data
  const daysTrend = [
    { day: 'Mon', amount: 3200, orders: 4 },
    { day: 'Tue', amount: 4850, orders: 6 },
    { day: 'Wed', amount: 5120, orders: 7 },
    { day: 'Thu', amount: 6400, orders: 9 },
    { day: 'Fri', amount: 8900, orders: 12 },
    { day: 'Sat', amount: 12400, orders: 18 },
    { day: 'Sun', amount: todaySales > 0 ? todaySales : 9800, orders: todayOrders.length || 14 }
  ];

  const maxAmount = Math.max(...daysTrend.map((d) => d.amount), 1);

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-100 space-y-6">
      {/* Top Banner & Quick Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            {language === 'hi' ? 'दुकान का प्रदर्शन और विश्लेषण' : 'Store Performance & Analytics'}
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {language === 'hi' ? 'लाइव डैशबोर्ड' : 'Live Dashboard'}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'hi' ? 'वास्तविक समय बिलिंग, स्वचालित जीएसटी कर संग्रह और इन्वेंटरी टर्नओवर।' : 'Real-time billing activity, automated GST collections and inventory turnover.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('pos')}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{language === 'hi' ? 'बिलिंग काउंटर खोलें' : 'Open POS Billing'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Sales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {language === 'hi' ? 'आज की कुल बिक्री' : "Today's Sales"}
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {currency}{todaySales.toFixed(2)}
            </div>
            <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{todayOrders.length} {language === 'hi' ? 'बिल बने' : 'bills generated'}</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Total Invoices / Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {language === 'hi' ? 'कुल संचित राजस्व' : 'Total Revenue'}
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {currency}{totalRevenue.toFixed(2)}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              {language === 'hi' ? `कुल ${totalOrdersCount} बिक्री ऑर्डर` : `Across ${totalOrdersCount} total orders`}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div
          onClick={() => setCurrentView('low_stock')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between cursor-pointer hover:border-amber-400 transition"
        >
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {language === 'hi' ? 'कम स्टॉक चेतावनी' : 'Low Stock Alert'}
            </span>
            <div className="text-2xl font-black text-amber-600 mt-1">
              {lowStockProducts.length} {language === 'hi' ? 'सामान' : 'Items'}
            </div>
            <div className="text-[11px] text-amber-700 font-bold mt-1">
              {lowStockProducts.length > 0 ? (language === 'hi' ? 'तुरंत माल मंगाने की जरूरत' : 'Requires immediate restock') : (language === 'hi' ? 'स्टॉक पर्याप्त है' : 'Stock level optimal')}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Total Outstanding Customer Due */}
        <div
          onClick={() => setCurrentView('ledger')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between cursor-pointer hover:border-red-400 transition"
        >
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {language === 'hi' ? 'ग्राहकों का बकाया (खाता)' : 'Customer Due (Khata)'}
            </span>
            <div className="text-2xl font-black text-red-600 mt-1">
              {currency}{totalDueAmount.toFixed(2)}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              {language === 'hi' ? 'उधार वसूली बाकी' : 'Pending credit collections'}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Middle Section: Sales Trend Chart & Stock Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Visual Graph (2 cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Weekly Sales Turnover
              </h3>
              <p className="text-xs text-slate-500">Gross revenue day-by-day comparison</p>
            </div>
            <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
              Last 7 Days
            </div>
          </div>

          {/* Bar Chart Representation */}
          <div className="h-48 pt-6 flex items-end justify-between gap-3 px-2">
            {daysTrend.map((item, idx) => {
              const heightPercent = Math.max(12, Math.round((item.amount / maxAmount) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition duration-150">
                    {currency}{item.amount}
                  </span>
                  <div className="w-full bg-slate-100 rounded-t-xl overflow-hidden h-36 flex items-end">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-xl group-hover:from-indigo-500 group-hover:to-purple-400 transition-all duration-300"
                    ></div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* GST Tax & Profit Breakdown (1 col) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900">
            GST &amp; Profit Summary
          </h3>
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 block">Total GST Collected</span>
                <strong className="text-sm font-extrabold text-indigo-900">
                  {currency}{totalTax.toFixed(2)}
                </strong>
              </div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">
                Govt Tax
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 block">Est. Gross Profit</span>
                <strong className="text-sm font-extrabold text-emerald-700">
                  {currency}{estimatedProfit.toFixed(2)}
                </strong>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Margin ~32%
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 block">Total Products Listed</span>
                <strong className="text-sm font-extrabold text-slate-900">
                  {products.length} Items
                </strong>
              </div>
              <span className="text-xs font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">
                Inventory
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sales Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">
              Recent Sales Invoices
            </h3>
            <p className="text-xs text-slate-500">Live transactions recorded at cash registers</p>
          </div>
          <button
            onClick={() => setCurrentView('sales_list')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
          >
            View All Invoices &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Date &amp; Time</th>
                <th className="py-3 px-4 text-center">Items</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">
                    {order.invoiceNumber}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {order.customer?.name || 'Walk-in Customer'}
                  </td>
                  <td className="py-3 px-4 text-slate-500">{order.orderDate}</td>
                  <td className="py-3 px-4 text-center font-bold text-slate-700">
                    {order.items?.length || 1}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-extrabold text-slate-900">
                    {currency}{order.grandTotal.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onViewInvoice(order)}
                      className="px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold text-[11px] transition"
                    >
                      Print Bill
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

