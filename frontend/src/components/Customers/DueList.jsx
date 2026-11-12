import React, { useState } from 'react';
import {
  CreditCard,
  Search,
  MessageCircle,
  Phone,
  CheckCircle2,
  Calendar,
  AlertCircle,
  DollarSign,
  Download,
  Filter
} from 'lucide-react';
import { exportToCSV } from '../../utils/exportCsv';

export default function DueList({
  customers = [],
  onSettleDue,
  currency = '₹',
  language = 'en'
}) {
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [settleAmount, setSettleAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('CASH');

  // Filter customers who owe money (balanceDue > 0)
  const dueCustomers = customers.filter(c => Number(c.balanceDue) > 0);

  const filtered = dueCustomers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search) ||
    c.gstin?.toLowerCase().includes(search.toLowerCase())
  );

  const totalOutstandingDue = dueCustomers.reduce((sum, c) => sum + Number(c.balanceDue), 0);

  const handleOpenSettle = (cust) => {
    setSelectedCustomer(cust);
    setSettleAmount(cust.balanceDue);
  };

  const handleConfirmSettle = (e) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    const amount = Number(settleAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid settlement amount.');
      return;
    }

    if (onSettleDue) {
      onSettleDue(selectedCustomer.id, amount, paymentMode);
    }

    alert(`Received ${currency}${amount} settlement from ${selectedCustomer.name}!`);
    setSelectedCustomer(null);
  };

  const generateWhatsAppLink = (cust) => {
    const cleanPhone = (cust.phone || '').replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const msg = encodeURIComponent(
      `Dear ${cust.name}, polite reminder from smartBiz SuperMart that your pending ledger due balance is ${currency}${cust.balanceDue}. Kindly clear this at your earliest convenience. Thank you!`
    );
    return `https://wa.me/${phoneWithCountry}?text=${msg}`;
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-100 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-red-600" />
            <span>{language === 'hi' ? 'बकाया वसूली सूची (Customer Due List)' : 'Customer Due List (Pending Collections)'}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'hi' ? 'दुकान का कुल बाजार उधार, व्हाट्सएप्प पेमेंट रिमाइंडर और खाता सेटलमेंट।' : 'Market receivables, WhatsApp payment reminders and instant balance recovery.'}
          </p>
        </div>

        <button
          onClick={() => exportToCSV(dueCustomers, 'Market_Due_List')}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Due List</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {language === 'hi' ? 'कुल बकाया बाजार उधार' : 'Total Outstanding Market Due'}
          </span>
          <div className="text-2xl font-black text-red-600 mt-1">
            {currency}{totalOutstandingDue.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Pending from customers</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {language === 'hi' ? 'बकायादार ग्राहकों की संख्या' : 'Defaulter / Due Accounts'}
          </span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {dueCustomers.length} {language === 'hi' ? 'ग्राहक' : 'Customers'}
          </div>
          <span className="text-[11px] text-amber-700 font-medium">Overdue accounts</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {language === 'hi' ? 'औसत बकाया प्रति ग्राहक' : 'Average Due / Customer'}
          </span>
          <div className="text-2xl font-black text-indigo-900 mt-1">
            {currency}{dueCustomers.length > 0 ? (totalOutstandingDue / dueCustomers.length).toFixed(0) : 0}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">Healthy credit cycle</span>
        </div>
      </div>

      {/* Due Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-200">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={language === 'hi' ? 'ग्राहक का नाम या फोन नंबर खोजें...' : 'Search customer by name or phone...'}
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
                <th className="px-4 py-3">CUSTOMER NAME</th>
                <th className="px-4 py-3">PHONE / CONTACT</th>
                <th className="px-4 py-3">GSTIN</th>
                <th className="px-4 py-3 text-right">TOTAL LIFETIME SPENT</th>
                <th className="px-4 py-3 text-right">PENDING DUE BALANCE</th>
                <th className="px-4 py-3 text-center">REMINDER</th>
                <th className="px-4 py-3 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                    <span>No outstanding dues! All customer accounts are fully settled.</span>
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3">
                      <div className="font-extrabold text-slate-900">{c.name}</div>
                      <div className="text-[10px] text-slate-400">{c.address || 'Retail Customer'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-slate-700 font-mono">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{c.phone || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-500">
                      {c.gstin || 'Consumer'}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-700">
                      {currency}{c.totalSpent || 0}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-black text-sm text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        {currency}{c.balanceDue}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {c.phone ? (
                        <a
                          href={generateWhatsAppLink(c)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[11px] font-bold border border-emerald-300 transition"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WhatsApp</span>
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-400">No phone</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleOpenSettle(c)}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shadow-2xs"
                      >
                        Settle Due
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Settle Due Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="border-b pb-3">
              <h3 className="font-black text-sm text-slate-900">
                {language === 'hi' ? 'उधार वसूली रसीद दर्ज करें' : 'Settle Customer Outstanding Due'}
              </h3>
              <p className="text-xs text-slate-500">
                Customer: <strong>{selectedCustomer.name}</strong> (Pending: {currency}{selectedCustomer.balanceDue})
              </p>
            </div>

            <form onSubmit={handleConfirmSettle} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Settlement Amount Received ({currency}):
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedCustomer.balanceDue}
                  step="0.01"
                  required
                  value={settleAmount}
                  onChange={(e) => setSettleAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Payment Method:
                </label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none"
                >
                  <option value="CASH">Cash (काउंटर नकद)</option>
                  <option value="UPI">UPI / QR Code</option>
                  <option value="BANK_TRANSFER">Direct Bank IMPS/NEFT</option>
                  <option value="CHEQUE">Cheque Clearance</option>
                </select>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCustomer(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md transition"
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

