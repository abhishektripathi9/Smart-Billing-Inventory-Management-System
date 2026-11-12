import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Receipt,
  Search,
  CheckCircle2,
  Calendar,
  Building,
  DollarSign,
  PackagePlus,
  Download,
  Trash2,
  Eye,
  X
} from 'lucide-react';
import { exportToCSV } from '../../utils/exportCsv';

export default function PurchaseManagement({
  suppliers = [],
  products = [],
  onAddStockPurchase,
  currency = '₹',
  language = 'en',
  initialTab = 'list' // 'list' or 'new'
}) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'list' or 'new'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || 1);
  const [invoiceNumber, setInvoiceNumber] = useState(`PUR-${Date.now().toString().slice(-6)}`);
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentStatus, setPaymentStatus] = useState('PAID'); // PAID, PARTIAL, DUE
  const [purchaseItems, setPurchaseItems] = useState([
    {
      productId: products[0]?.id || 1,
      quantity: 10,
      costPrice: products[0]?.costPrice || 200,
      gstRate: products[0]?.gstRate || 12
    }
  ]);
  const [purchases, setPurchases] = useState([
    {
      id: 1,
      purchaseNumber: 'PUR-982104',
      supplierName: 'Royal Textile Wholesalers Ltd',
      supplierGstin: '27AABCT8899K1Z4',
      date: '2026-11-08',
      itemsCount: 45,
      totalAmount: 18450.00,
      taxAmount: 1976.78,
      status: 'PAID'
    },
    {
      id: 2,
      purchaseNumber: 'PUR-982105',
      supplierName: 'Micro Pharma Distributors',
      supplierGstin: '27AABCM4432L1Z9',
      date: '2026-11-07',
      itemsCount: 120,
      totalAmount: 8960.00,
      taxAmount: 960.00,
      status: 'PARTIAL'
    },
    {
      id: 3,
      purchaseNumber: 'PUR-982106',
      supplierName: 'Fortune Grocery FMCG Hub',
      supplierGstin: '27AABCF1122D1Z1',
      date: '2026-11-06',
      itemsCount: 60,
      totalAmount: 12400.00,
      taxAmount: 620.00,
      status: 'DUE'
    }
  ]);

  const [viewingPurchase, setViewingPurchase] = useState(null);

  // Subtotal and tax for new purchase
  const subtotal = purchaseItems.reduce((sum, item) => sum + (item.quantity * item.costPrice), 0);
  const totalTax = purchaseItems.reduce((sum, item) => sum + ((item.quantity * item.costPrice * item.gstRate) / 100), 0);
  const grandTotal = subtotal + totalTax;

  const handleAddItemRow = () => {
    const firstProd = products[0] || { id: 1, costPrice: 100, gstRate: 12 };
    setPurchaseItems([
      ...purchaseItems,
      {
        productId: firstProd.id,
        quantity: 5,
        costPrice: firstProd.costPrice || 100,
        gstRate: firstProd.gstRate || 12
      }
    ]);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...purchaseItems];
    if (field === 'productId') {
      const prod = products.find(p => p.id === Number(value));
      updated[index].productId = Number(value);
      if (prod) {
        updated[index].costPrice = prod.costPrice;
        updated[index].gstRate = prod.gstRate;
      }
    } else {
      updated[index][field] = Number(value);
    }
    setPurchaseItems(updated);
  };

  const handleRemoveItem = (index) => {
    if (purchaseItems.length === 1) return;
    setPurchaseItems(purchaseItems.filter((_, i) => i !== index));
  };

  const handleSubmitPurchase = (e) => {
    e.preventDefault();
    const sup = suppliers.find(s => s.id === Number(selectedSupplierId)) || suppliers[0];
    const newRecord = {
      id: Date.now(),
      purchaseNumber: invoiceNumber,
      supplierName: sup?.name || 'Authorized Vendor',
      supplierGstin: sup?.gstin || '27AABCT8899K1Z4',
      date: purchaseDate,
      itemsCount: purchaseItems.reduce((s, i) => s + i.quantity, 0),
      totalAmount: grandTotal,
      taxAmount: totalTax,
      status: paymentStatus
    };

    setPurchases([newRecord, ...purchases]);

    // Auto-increase stock in product inventory
    if (onAddStockPurchase) {
      onAddStockPurchase(purchaseItems);
    }

    alert(`Purchase ${invoiceNumber} saved! Inventory stock successfully updated.`);
    setActiveTab('list');
    setInvoiceNumber(`PUR-${Date.now().toString().slice(-6)}`);
  };

  const filteredPurchases = purchases.filter(p =>
    p.purchaseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.supplierName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-100 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Truck className="w-5 h-5 text-indigo-600" />
            <span>{language === 'hi' ? 'खरीद और स्टॉक इनवर्ड (Purchases)' : 'Purchases & Stock Inward'}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'hi' ? 'आपूर्तिकर्ताओं से माल खरीद, बिल प्रविष्टि और स्वचालित स्टॉक वृद्धि।' : 'Vendor purchases, inward challan entries and automated stock additions.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'list'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {language === 'hi' ? 'खरीद सूची (Purchase List)' : 'Purchase List'}
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition ${
              activeTab === 'new'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'नया स्टॉक खरीदें (Stock In)' : 'New Purchase (Stock In)'}</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: PURCHASE LIST */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase">
                {language === 'hi' ? 'कुल खरीद खर्च' : 'Total Purchases'}
              </span>
              <div className="text-xl font-extrabold text-slate-900 mt-1">
                {currency}{purchases.reduce((s, p) => s + p.totalAmount, 0).toLocaleString()}
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase">
                {language === 'hi' ? 'इनपुट जीएसटी क्रेडिट' : 'Input GST Credit'}
              </span>
              <div className="text-xl font-extrabold text-emerald-600 mt-1">
                {currency}{purchases.reduce((s, p) => s + p.taxAmount, 0).toFixed(2)}
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase">
                {language === 'hi' ? 'कुल खरीद वाउचर' : 'Purchase Invoices'}
              </span>
              <div className="text-xl font-extrabold text-indigo-600 mt-1">
                {purchases.length} {language === 'hi' ? 'बिल' : 'Bills'}
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={language === 'hi' ? 'खरीद बिल या आपूर्तिकर्ता खोजें...' : 'Search purchase bill or supplier...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <button
                onClick={() => exportToCSV(purchases, 'Purchases_Report')}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-4 py-3">INVOICE NO</th>
                    <th className="px-4 py-3">SUPPLIER</th>
                    <th className="px-4 py-3">DATE</th>
                    <th className="px-4 py-3 text-center">ITEMS</th>
                    <th className="px-4 py-3 text-right">INPUT GST</th>
                    <th className="px-4 py-3 text-right">TOTAL AMOUNT</th>
                    <th className="px-4 py-3 text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredPurchases.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3 font-mono font-bold text-indigo-700">
                        {p.purchaseNumber}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-800">{p.supplierName}</div>
                        <div className="text-[10px] text-slate-400">GSTIN: {p.supplierGstin}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{p.date}</td>
                      <td className="px-4 py-3 text-center font-bold">{p.itemsCount} pcs</td>
                      <td className="px-4 py-3 text-right text-emerald-600 font-bold">
                        {currency}{p.taxAmount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right font-black text-slate-900 text-sm">
                        {currency}{p.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            p.status === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800'
                              : p.status === 'PARTIAL'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: NEW STOCK PURCHASE ENTRY FORM */}
      {activeTab === 'new' && (
        <form onSubmit={handleSubmitPurchase} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-base font-extrabold text-slate-800">
              {language === 'hi' ? 'नया स्टॉक इनवर्ड वाउचर (Stock In Entry)' : 'New Stock Purchase Inward'}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'hi' ? 'आपूर्तिकर्ता बिल विवरण भरें। यह आपके गोदाम और बिक्री काउंटर में स्टॉक स्वतः बढ़ा देगा।' : 'Record inward supplier invoice. Products added here immediately replenish inventory stock.'}
            </p>
          </div>

          {/* Supplier, Bill No & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'आपूर्तिकर्ता (Supplier):' : 'Select Supplier:'}
              </label>
              <select
                value={selectedSupplierId}
                onChange={(e) => setSelectedSupplierId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.companyName || 'Vendor'})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'खरीद बिल संख्या (Invoice No):' : 'Supplier Invoice No:'}
              </label>
              <input
                type="text"
                required
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'खरीद तिथि (Date):' : 'Purchase Date:'}
              </label>
              <input
                type="date"
                required
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Items Inward Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">
                {language === 'hi' ? 'स्टॉक में जोड़ने योग्य सामान (Items to Inward):' : 'Purchase Items List:'}
              </span>
              <button
                type="button"
                onClick={handleAddItemRow}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'और सामान जोड़ें' : 'Add Item Row'}</span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                  <tr>
                    <th className="px-3 py-2.5">PRODUCT</th>
                    <th className="px-3 py-2.5 w-24 text-center">QUANTITY</th>
                    <th className="px-3 py-2.5 w-32 text-center">BUY PRICE ({currency})</th>
                    <th className="px-3 py-2.5 w-28 text-center">GST %</th>
                    <th className="px-3 py-2.5 w-32 text-right">LINE TOTAL</th>
                    <th className="px-3 py-2.5 w-12 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {purchaseItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60">
                      <td className="p-2">
                        <select
                          value={item.productId}
                          onChange={(e) => handleItemChange(idx, 'productId', e.target.value)}
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
                        >
                          {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          className="w-20 text-center py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-xs"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          required
                          value={item.costPrice}
                          onChange={(e) => handleItemChange(idx, 'costPrice', e.target.value)}
                          className="w-24 text-right py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-xs"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <select
                          value={item.gstRate}
                          onChange={(e) => handleItemChange(idx, 'gstRate', e.target.value)}
                          className="w-20 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-indigo-700"
                        >
                          <option value="0">0%</option>
                          <option value="5">5%</option>
                          <option value="12">12%</option>
                          <option value="18">18%</option>
                          <option value="28">28%</option>
                        </select>
                      </td>
                      <td className="p-2 text-right font-bold text-slate-800">
                        {currency}{((item.quantity * item.costPrice) * (1 + item.gstRate / 100)).toFixed(2)}
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-slate-300 hover:text-red-500 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals & Submit */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600">
                {language === 'hi' ? 'भुगतान स्थिति (Payment Status):' : 'Payment Status:'}
              </span>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
              >
                <option value="PAID">PAID (Full Cash/Bank)</option>
                <option value="PARTIAL">PARTIAL (Advance Paid)</option>
                <option value="DUE">DUE (Credit/Payable Later)</option>
              </select>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block uppercase font-bold">Total Inward Value</span>
                <span className="text-xl font-black text-indigo-900">{currency}{grandTotal.toFixed(2)}</span>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-2"
              >
                <PackagePlus className="w-4 h-4" />
                <span>{language === 'hi' ? 'स्टॉक जोड़ें और सहेजें' : 'Add to Stock & Save'}</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

