import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  Filter,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { exportToCSV } from '../../utils/exportCsv';

export default function LossProfit({
  orders = [],
  products = [],
  currency = '₹',
  language = 'en'
}) {
  const [dateRange, setDateRange] = useState('month'); // 'today', 'week', 'month', 'year'

  // Compute Revenue
  const totalGrossSales = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);

  // Compute Cost of Goods Sold (COGS)
  const totalCOGS = orders.reduce((sum, o) => {
    let cost = 0;
    (o.items || []).forEach(item => {
      const prod = products.find(p => p.id === item.productId || p.id === item.id);
      const unitCost = prod?.costPrice || (item.unitPrice * 0.7); // 30% default margin fallback
      cost += unitCost * (item.quantity || 1);
    });
    return sum + (cost || (o.grandTotal * 0.72));
  }, 0);

  // Gross Profit
  const grossProfit = Math.max(0, totalGrossSales - totalCOGS);
  const grossMarginPercent = totalGrossSales > 0 ? ((grossProfit / totalGrossSales) * 100).toFixed(1) : 0;

  // Operating Expenses (Mock store overheads)
  const operatingExpenses = [
    { category: 'Store Rent & Maintenance', amount: 18000 },
    { category: 'Staff Salaries (2 Cashiers)', amount: 24000 },
    { category: 'Electricity & Air Conditioning', amount: 4200 },
    { category: 'Packaging Materials & Carry Bags', amount: 1500 },
    { category: 'Staff Tea & Refreshments', amount: 1250 }
  ];
  const totalExpenses = operatingExpenses.reduce((s, e) => s + e.amount, 0);

  // Other Incomes
  const otherIncomes = [
    { title: 'Delivery & Home Shipping Charges Collected', amount: 3200 },
    { title: 'Wholesale Supplier Cash Discount (Rebate)', amount: 4500 },
    { title: 'Corrugated Carton & Scrap Disposal', amount: 850 }
  ];
  const totalOtherIncome = otherIncomes.reduce((s, i) => s + i.amount, 0);

  // Net Operating Profit
  const netProfit = grossProfit - (totalExpenses / 12) + totalOtherIncome; // prorated for active sample
  const netProfitMargin = totalGrossSales > 0 ? ((netProfit / totalGrossSales) * 100).toFixed(1) : 0;

  // Profit by Category
  const categoryMargins = [
    { category: 'Clothes & Apparel', sales: 48500, cost: 26000, profit: 22500, margin: '46.4%' },
    { category: 'Medical & Pharma', sales: 32400, cost: 24300, profit: 8100, margin: '25.0%' },
    { category: 'Grocery & FMCG', sales: 65000, cost: 56500, profit: 8500, margin: '13.1%' },
    { category: 'Electronics & Accessories', sales: 28000, cost: 19600, profit: 8400, margin: '30.0%' }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-100 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span>{language === 'hi' ? 'लाभ और हानि विश्लेषण (Loss / Profit)' : 'Loss / Profit & Financial Margins'}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'hi' ? 'सकल लाभ, माल की खरीद लागत (COGS), परिचालन खर्च और शुद्ध मुनाफा।' : 'Comprehensive P&L Statement, Cost of Goods Sold (COGS), operational overheads & net margins.'}
          </p>
        </div>

        <button
          onClick={() => exportToCSV(categoryMargins, 'Profit_Loss_Statement')}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export P&amp;L Statement</span>
        </button>
      </div>

      {/* Top 4 KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {language === 'hi' ? 'कुल बिक्री राजस्व' : 'Gross Sales Revenue'}
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {currency}{totalGrossSales.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{orders.length} Invoices</span>
          </div>
        </div>

        {/* Cost of Goods Sold */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {language === 'hi' ? 'माल की खरीद लागत (COGS)' : 'Cost of Goods Sold (COGS)'}
          </span>
          <div className="text-2xl font-black text-slate-700 mt-1">
            {currency}{totalCOGS.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Direct inventory cost
          </div>
        </div>

        {/* Gross Profit */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {language === 'hi' ? 'सकल मुनाफा (Gross Profit)' : 'Gross Profit'}
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {currency}{grossProfit.toFixed(2)}
          </div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1">
            {grossMarginPercent}% Gross Margin
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {language === 'hi' ? 'शुद्ध मुनाफा (Net Profit)' : 'Net Operating Profit'}
          </span>
          <div className="text-2xl font-black text-indigo-900 mt-1">
            {currency}{netProfit.toFixed(2)}
          </div>
          <div className="text-[11px] text-indigo-600 font-bold mt-1">
            {netProfitMargin}% Net Margin
          </div>
        </div>
      </div>

      {/* P&L Statement Table & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Formal P&L Statement */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-extrabold text-sm text-slate-900">
              {language === 'hi' ? 'दुकान का लाभ-हानि विवरण (P&L Summary)' : 'Income Statement / P&L Ledger'}
            </h3>
            <span className="text-[11px] font-mono text-slate-500">FY 2026-27</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-2.5 flex justify-between font-bold text-slate-800">
              <span>(A) Gross Sales Revenue</span>
              <span>{currency}{totalGrossSales.toFixed(2)}</span>
            </div>

            <div className="py-2.5 flex justify-between text-slate-600">
              <span className="pl-4">Less: Cost of Goods Sold (Purchase &amp; Inward)</span>
              <span className="text-red-600 font-semibold">- {currency}{totalCOGS.toFixed(2)}</span>
            </div>

            <div className="py-3 flex justify-between font-black text-emerald-800 bg-emerald-50/60 px-3 rounded-lg">
              <span>(B) Gross Trading Profit (A - COGS)</span>
              <span>+{currency}{grossProfit.toFixed(2)}</span>
            </div>

            <div className="py-2.5 flex justify-between text-slate-600">
              <span className="pl-4">Less: Store Operating Expenses (Overheads &amp; Staff)</span>
              <span className="text-red-600 font-semibold">- {currency}{(totalExpenses / 12).toFixed(2)}</span>
            </div>

            <div className="py-2.5 flex justify-between text-slate-600">
              <span className="pl-4">Add: Non-Sales Store Incomes &amp; Delivery</span>
              <span className="text-emerald-600 font-semibold">+{currency}{totalOtherIncome.toFixed(2)}</span>
            </div>

            <div className="py-3.5 flex justify-between text-sm font-black text-indigo-950 bg-indigo-50/80 px-3 rounded-xl border border-indigo-200 mt-2">
              <span>(C) Net Profit for the Period</span>
              <span>{currency}{netProfit.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Category Margins */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-extrabold text-sm text-slate-900">
              {language === 'hi' ? 'श्रेणी अनुसार मार्जिन' : 'Margin by Product Category'}
            </h3>
          </div>

          <div className="space-y-3">
            {categoryMargins.map((cat, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>{cat.category}</span>
                  <span className="text-emerald-600 font-black">{cat.margin}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>Sales: {currency}{cat.sales.toLocaleString()}</span>
                  <span>Profit: {currency}{cat.profit.toLocaleString()}</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: cat.margin }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

