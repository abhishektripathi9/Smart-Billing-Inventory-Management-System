import React, { useState } from 'react';
import { Landmark, Printer, CheckCircle2, AlertTriangle, ArrowRight, DollarSign } from 'lucide-react';

export default function CashRegister({ orders, currency = '₹' }) {
  const [openingFloat, setOpeningFloat] = useState(2000); // Initial till change
  const [cashExpenses, setCashExpenses] = useState(530); // Petty expenses from cash
  const [denominations, setDenominations] = useState({
    500: 4,
    200: 5,
    100: 12,
    50: 8,
    20: 10,
    10: 15
  });

  // Calculate cash sales from today's orders
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayCashOrders = orders.filter(
    (o) => (o.orderDate || '').slice(0, 10) === todayStr && o.paymentMethod === 'CASH'
  );

  const totalCashSales = todayCashOrders.reduce((sum, o) => sum + (o.amountPaid || o.grandTotal || 0), 0);

  // Expected Cash in Drawer
  const expectedCash = Number(openingFloat) + totalCashSales - Number(cashExpenses);

  // Actual Physical Cash Counted
  const actualCash = Object.entries(denominations).reduce(
    (sum, [denom, count]) => sum + Number(denom) * Number(count || 0),
    0
  );

  const difference = actualCash - expectedCash;

  const handleDenominationChange = (denom, val) => {
    setDenominations({
      ...denominations,
      [denom]: Math.max(0, parseInt(val, 10) || 0)
    });
  };

  const handlePrintZReport = () => {
    window.print();
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-100 space-y-5">
      {/* Banner */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Landmark className="w-5 h-5 text-indigo-600" />
            Day-End Cash Register &amp; Drawer Audit (Z-Report)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Shift closing reconciliation: compare expected register cash against physical cash counted.
          </p>
        </div>

        <button
          onClick={handlePrintZReport}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-indigo-600/30 flex items-center gap-2 transition"
        >
          <Printer className="w-4 h-4" />
          <span>Print Shift Z-Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Register Inputs & Summary (2 cols) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Opening Float (Change)
              </span>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-slate-400 font-bold">{currency}</span>
                <input
                  type="number"
                  min="0"
                  value={openingFloat}
                  onChange={(e) => setOpeningFloat(e.target.value)}
                  className="text-xl font-black text-slate-900 bg-transparent focus:outline-none w-28"
                />
              </div>
              <span className="text-[10px] text-slate-400">Starting morning drawer balance</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Cash Sales Today
              </span>
              <div className="text-xl font-black text-emerald-700 mt-1">
                +{currency}{totalCashSales.toFixed(2)}
              </div>
              <span className="text-[10px] text-slate-400">{todayCashOrders.length} cash invoices</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Cash Expenses Paid
              </span>
              <div className="text-xl font-black text-red-600 mt-1">
                -{currency}{cashExpenses.toFixed(2)}
              </div>
              <span className="text-[10px] text-slate-400">Petty cash payouts</span>
            </div>
          </div>

          {/* Currency Denominations Counter */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900">
              Physical Cash Count (Currency Denomination Breakdown)
            </h3>
            <p className="text-xs text-slate-500">
              Count cash notes in your drawer and enter counts below:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {[500, 200, 100, 50, 20, 10].map((denom) => {
                const count = denominations[denom] || 0;
                const lineTotal = denom * count;
                return (
                  <div
                    key={denom}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-black text-indigo-900 text-sm">{currency}{denom}</span>
                      <span className="text-[10px] text-slate-400 block">Note</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-xs font-bold">x</span>
                      <input
                        type="number"
                        min="0"
                        value={count}
                        onChange={(e) => handleDenominationChange(denom, e.target.value)}
                        className="w-14 p-1.5 text-center font-bold bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    <span className="font-mono font-bold text-slate-800 text-right w-16">
                      {currency}{lineTotal}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Closing Audit Status Box (1 col) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900">
            Shift Closing Balance Audit
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border">
              <span className="text-slate-500">Expected in Drawer:</span>
              <strong className="font-mono font-bold text-slate-900">{currency}{expectedCash.toFixed(2)}</strong>
            </div>

            <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border">
              <span className="text-slate-500">Actual Counted Cash:</span>
              <strong className="font-mono font-bold text-indigo-700">{currency}{actualCash.toFixed(2)}</strong>
            </div>

            {/* Reconciliation status badge */}
            <div
              className={`p-4 rounded-xl border flex flex-col items-center text-center gap-1 ${
                difference === 0
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : difference > 0
                  ? 'bg-blue-50 border-blue-300 text-blue-900'
                  : 'bg-red-50 border-red-300 text-red-900'
              }`}
            >
              {difference === 0 ? (
                <>
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mb-1" />
                  <span className="font-extrabold text-sm">Drawer Perfectly Balanced!</span>
                  <span className="text-[11px] text-emerald-700">Zero variance. Register matches exact sales.</span>
                </>
              ) : difference > 0 ? (
                <>
                  <AlertTriangle className="w-8 h-8 text-blue-600 mb-1" />
                  <span className="font-extrabold text-sm">Excess Cash in Drawer</span>
                  <span className="text-[11px] font-bold">
                    +{currency}{difference.toFixed(2)} extra cash counted
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-8 h-8 text-red-600 mb-1" />
                  <span className="font-extrabold text-sm">Cash Shortage Detected!</span>
                  <span className="text-[11px] font-bold text-red-700">
                    -{currency}{Math.abs(difference).toFixed(2)} missing cash
                  </span>
                </>
              )}
            </div>

            <button
              onClick={() => {
                alert('Shift closed successfully! Daily Z-Report archived.');
              }}
              className="w-full py-2.5 bg-slate-900 hover:bg-black text-white font-extrabold text-xs rounded-xl shadow-md transition"
            >
              Close Shift &amp; Archive Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

