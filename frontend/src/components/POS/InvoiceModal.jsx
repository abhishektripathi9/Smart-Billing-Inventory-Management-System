import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  Receipt,
  FileText,
  Building,
  QrCode
} from 'lucide-react';
import { translations } from '../../utils/i18n';

export default function InvoiceModal({ order, settings, onClose, currency = '₹', language = 'en' }) {
  const t = (key) => translations[language]?.[key] || translations.en[key] || key;
  const [invoiceType, setInvoiceType] = useState('thermal'); // 'thermal' (80mm) or 'a4' (Standard GST Tax Invoice)

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  // Convert numbers to Indian Rupees in words (simple utility)
  const numberToWords = (num) => {
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const n = ('000000000' + Math.floor(num)).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return '';
    let str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'Rupees Only' : 'Rupees Only';
    return str;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col my-auto max-h-[95vh]">
        {/* Controls Header - Hidden on Print */}
        <div className="no-print px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="font-bold text-sm">Invoice Generated Successfully</span>
              <div className="text-[11px] text-slate-300 font-mono">
                {order.invoiceNumber}
              </div>
            </div>
          </div>

          {/* Toggle format: Thermal vs A4 */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg text-xs">
            <button
              onClick={() => setInvoiceType('thermal')}
              className={`px-2.5 py-1 rounded font-bold transition ${
                invoiceType === 'thermal' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              80mm Thermal
            </button>
            <button
              onClick={() => setInvoiceType('a4')}
              className={`px-2.5 py-1 rounded font-bold transition ${
                invoiceType === 'a4' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              A4 GST Invoice
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Invoice Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100 flex justify-center">
          <div
            id="printable-invoice"
            className={`bg-white shadow-md p-6 text-slate-800 font-sans ${
              invoiceType === 'thermal'
                ? 'w-[360px] text-xs font-mono border border-slate-300'
                : 'w-full max-w-xl text-xs border border-slate-300'
            }`}
          >
            {/* ============================================================ */}
            {/* FORMAT 1: 80mm THERMAL RECEIPT                               */}
            {/* ============================================================ */}
            {invoiceType === 'thermal' ? (
              <div className="space-y-3">
                {/* Store Header */}
                <div className="text-center border-b border-dashed border-slate-400 pb-3">
                  <h2 className="text-base font-black tracking-tight uppercase">
                    {settings?.storeName || 'smartBiz SuperMart'}
                  </h2>
                  <p className="text-[10px] text-slate-600 leading-tight">
                    {settings?.address || 'Shop #12, Apex Mall, Mumbai'}
                  </p>
                  <p className="text-[10px] text-slate-600">
                    Phone: {settings?.phone || '+91 98765 43210'}
                  </p>
                  <p className="text-[11px] font-bold mt-1">
                    GSTIN: {settings?.gstin || '27AABCS1429B1Z2'}
                  </p>
                  <div className="mt-1 inline-block border border-black px-2 py-0.5 text-[9px] font-black uppercase tracking-wider">
                    TAX INVOICE
                  </div>
                </div>

                {/* Invoice & Customer Meta */}
                <div className="text-[11px] leading-relaxed border-b border-dashed border-slate-400 pb-2">
                  <div className="flex justify-between">
                    <span>Invoice:</span>
                    <strong className="font-bold">{order.invoiceNumber}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{order.orderDate || new Date().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer:</span>
                    <span>{order.customer?.name || 'Walk-in Customer'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cashier / Staff:</span>
                    <strong className="text-slate-800">{order.cashierName || 'Admin Store'}</strong>
                  </div>
                  {order.customer?.phone && (
                    <div className="flex justify-between">
                      <span>Phone:</span>
                      <span>{order.customer.phone}</span>
                    </div>
                  )}
                  {order.customer?.gstin && (
                    <div className="flex justify-between">
                      <span>Buyer GSTIN:</span>
                      <span>{order.customer.gstin}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Payment Mode:</span>
                    <strong className="uppercase">{order.paymentMethod}</strong>
                  </div>
                </div>

                {/* Items List */}
                <div className="border-b border-dashed border-slate-400 pb-2">
                  <div className="flex justify-between font-bold border-b border-black pb-1 mb-1">
                    <span className="w-1/2">ITEM [HSN]</span>
                    <span className="w-1/6 text-center">QTY</span>
                    <span className="w-1/6 text-right">RATE</span>
                    <span className="w-1/6 text-right">AMT</span>
                  </div>
                  <div className="space-y-1.5">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-[11px] items-baseline">
                        <div className="w-1/2 leading-tight">
                          <span className="font-semibold block">{item.name || item.productName}</span>
                          <span className="text-[9px] text-slate-500">
                            HSN: {item.hsnCode || 'N/A'} (GST {item.gstRate || 0}%)
                          </span>
                        </div>
                        <span className="w-1/6 text-center font-bold">{item.quantity}</span>
                        <span className="w-1/6 text-right">{item.unitPrice?.toFixed(2)}</span>
                        <span className="w-1/6 text-right font-bold">
                          {(item.quantity * item.unitPrice).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals Summary */}
                <div className="text-[11px] space-y-1 border-b border-dashed border-slate-400 pb-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{currency}{order.subtotal?.toFixed(2)}</span>
                  </div>
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount:</span>
                      <span>-{currency}{order.discountAmount?.toFixed(2)}</span>
                    </div>
                  )}
                  {order.shippingCharge > 0 && (
                    <div className="flex justify-between">
                      <span>Shipping/Delivery:</span>
                      <span>+{currency}{order.shippingCharge?.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>CGST (Central Tax):</span>
                    <span>+{currency}{(order.taxAmount / 2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>SGST (State Tax):</span>
                    <span>+{currency}{(order.taxAmount / 2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-black text-sm border-t border-black pt-1">
                    <span>NET TOTAL:</span>
                    <span>{currency}{order.grandTotal?.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Breakdown */}
                <div className="text-[10px] space-y-0.5 border-b border-dashed border-slate-400 pb-2">
                  <div className="flex justify-between">
                    <span>Amount Received:</span>
                    <span>{currency}{order.amountPaid?.toFixed(2) || order.grandTotal?.toFixed(2)}</span>
                  </div>
                  {order.changeReturned > 0 && (
                    <div className="flex justify-between font-bold">
                      <span>Change Returned:</span>
                      <span>{currency}{order.changeReturned?.toFixed(2)}</span>
                    </div>
                  )}
                  {order.dueAmount > 0 && (
                    <div className="flex justify-between font-bold text-red-600">
                      <span>Balance Due:</span>
                      <span>{currency}{order.dueAmount?.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* Footer Barcode & Greeting */}
                <div className="text-center pt-2 space-y-2">
                  {/* Fake barcode display */}
                  <div className="flex justify-center">
                    <div className="tracking-widest font-mono text-sm bg-black text-white px-3 py-1">
                      ||| |||| || |||||| | |||||
                    </div>
                  </div>
                  <p className="text-[10px] font-semibold text-slate-600">
                    {settings?.receiptFooter || 'Thank you for shopping with us! Visit again.'}
                  </p>
                </div>
              </div>
            ) : (
              /* ============================================================ */
              /* FORMAT 2: FULL A4 GST TAX INVOICE                             */
              /* ============================================================ */
              <div className="space-y-4 text-xs font-sans">
                {/* Header Title */}
                <div className="text-center border-b pb-2">
                  <h1 className="text-base font-extrabold uppercase tracking-wide text-slate-900">
                    TAX INVOICE
                  </h1>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">
                    (Original for Recipient)
                  </span>
                </div>

                {/* Seller & Buyer Grid */}
                <div className="grid grid-cols-2 gap-4 border p-3 rounded-lg bg-slate-50/50">
                  {/* Seller Details */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      SUPPLIER / SELLER:
                    </span>
                    <strong className="text-sm font-bold text-slate-900 block">
                      {settings?.storeName || 'PosSaaS Retail & Smart Mart'}
                    </strong>
                    <p className="text-slate-600 leading-tight">
                      {settings?.address || 'Shop #12, Apex Mall, Mumbai'}
                    </p>
                    <p className="text-slate-600">State: Maharashtra (Code: 27)</p>
                    <p className="font-bold text-slate-800">
                      GSTIN: {settings?.gstin || '27AABCS1429B1Z2'}
                    </p>
                    <p className="text-slate-600">Phone: {settings?.phone}</p>
                  </div>

                  {/* Invoice & Buyer Details */}
                  <div className="space-y-1 border-l pl-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      INVOICE &amp; BUYER DETAILS:
                    </span>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Invoice No:</span>
                      <strong className="font-mono text-indigo-900">{order.invoiceNumber}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Date &amp; Time:</span>
                      <span>{order.orderDate || new Date().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t">
                      <span className="text-slate-500">Billed To:</span>
                      <strong className="text-slate-900">
                        {order.customer?.name || 'Walk-in Customer'}
                      </strong>
                    </div>
                    {order.customer?.phone && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Phone:</span>
                        <span>{order.customer.phone}</span>
                      </div>
                    )}
                    {order.customer?.gstin && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Customer GSTIN:</span>
                        <strong className="text-indigo-800">{order.customer.gstin}</strong>
                      </div>
                    )}
                  </div>
                </div>

                {/* Items Table */}
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-[11px] text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b uppercase">
                      <tr>
                        <th className="py-2 px-2.5">#</th>
                        <th className="py-2 px-2.5">Item Description</th>
                        <th className="py-2 px-2 text-center">HSN</th>
                        <th className="py-2 px-2 text-center">Qty</th>
                        <th className="py-2 px-2 text-right">Rate</th>
                        <th className="py-2 px-2 text-center">GST %</th>
                        <th className="py-2 px-2.5 text-right">Taxable</th>
                        <th className="py-2 px-2.5 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {order.items?.map((item, i) => {
                        const lineSubtotal = item.quantity * item.unitPrice;
                        const lineTax = (lineSubtotal * (item.gstRate || 0)) / 100;
                        return (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="py-2 px-2.5 text-slate-400">{i + 1}</td>
                            <td className="py-2 px-2.5 font-semibold text-slate-800">
                              {item.name || item.productName}
                            </td>
                            <td className="py-2 px-2 text-center text-slate-500 font-mono">
                              {item.hsnCode || 'N/A'}
                            </td>
                            <td className="py-2 px-2 text-center font-bold">{item.quantity}</td>
                            <td className="py-2 px-2 text-right">
                              {currency}{item.unitPrice?.toFixed(2)}
                            </td>
                            <td className="py-2 px-2 text-center font-semibold text-indigo-700">
                              {item.gstRate || 0}%
                            </td>
                            <td className="py-2 px-2.5 text-right font-semibold">
                              {currency}{lineSubtotal.toFixed(2)}
                            </td>
                            <td className="py-2 px-2.5 text-right font-bold text-slate-900">
                              {currency}{(lineSubtotal + lineTax).toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Amount in words & Tax summary */}
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div className="space-y-2">
                    <div className="p-2.5 bg-slate-50 rounded-lg border text-[11px]">
                      <span className="font-bold text-slate-500 block">Total Amount in Words:</span>
                      <strong className="text-slate-800 italic">
                        {numberToWords(order.grandTotal)}
                      </strong>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-lg border text-[11px] space-y-1">
                      <span className="font-bold text-slate-500 block">Bank Details for Transfer:</span>
                      <p className="text-slate-700 font-mono">{settings?.bankDetails}</p>
                    </div>
                  </div>

                  {/* Totals Table */}
                  <div className="bg-slate-50 p-3 rounded-lg border space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Sub Total:</span>
                      <span>{currency}{order.subtotal?.toFixed(2)}</span>
                    </div>
                    {order.discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>Discount Applied:</span>
                        <span>-{currency}{order.discountAmount?.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-600">
                      <span>CGST (Central Tax 50%):</span>
                      <span>+{currency}{(order.taxAmount / 2).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>SGST (State Tax 50%):</span>
                      <span>+{currency}{(order.taxAmount / 2).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-extrabold text-sm border-t pt-1.5 text-indigo-950">
                      <span>Grand Total:</span>
                      <span>{currency}{order.grandTotal?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Signatory Box */}
                <div className="pt-6 flex justify-between items-end border-t text-[11px]">
                  <div className="text-slate-500 max-w-xs">
                    <span className="font-bold text-slate-700 block">Terms &amp; Conditions:</span>
                    <span>1. Goods once sold will not be taken back without original bill.</span>
                    <br />
                    <span>2. Subject to Mumbai Jurisdiction.</span>
                  </div>
                  <div className="text-right space-y-8">
                    <span className="font-bold text-slate-700">For {settings?.storeName}</span>
                    <div className="border-t border-slate-400 pt-1 text-slate-500">
                      Authorized Signatory
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Actions Footer - Hidden on Print */}
        <div className="no-print px-6 py-3.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white transition"
          >
            {t('closeBack')}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>{t('printInvoice')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

