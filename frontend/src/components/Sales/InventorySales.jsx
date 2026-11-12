import React, { useState } from 'react';
import {
  Boxes,
  Truck,
  Plus,
  Receipt,
  Search,
  CheckCircle2,
  Calendar,
  Building2,
  Download,
  Trash2,
  Printer,
  ShoppingBag
} from 'lucide-react';
import { exportToCSV } from '../../utils/exportCsv';

export default function InventorySales({
  products = [],
  customers = [],
  onConfirmOrder,
  currency = '₹',
  language = 'en'
}) {
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || 1);
  const [selectedWarehouse, setSelectedWarehouse] = useState('Primary Central Warehouse');
  const [transportMode, setTransportMode] = useState('Road Cargo (Tempo)');
  const [vehicleNo, setVehicleNo] = useState('MH-02-CD-4512');
  const [dispatchDate, setDispatchDate] = useState(new Date().toISOString().slice(0, 10));

  const [items, setItems] = useState([
    {
      productId: products[0]?.id || 1,
      quantity: 20,
      wholesaleRate: (products[0]?.sellingPrice || 300) * 0.85, // 15% wholesale discount
      gstRate: products[0]?.gstRate || 12
    }
  ]);

  const handleAddItem = () => {
    const prod = products[0] || { id: 1, sellingPrice: 200, gstRate: 12 };
    setItems([
      ...items,
      {
        productId: prod.id,
        quantity: 10,
        wholesaleRate: prod.sellingPrice * 0.85,
        gstRate: prod.gstRate || 12
      }
    ]);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    if (field === 'productId') {
      const prod = products.find(p => p.id === Number(value));
      updated[index].productId = Number(value);
      if (prod) {
        updated[index].wholesaleRate = prod.sellingPrice * 0.85;
        updated[index].gstRate = prod.gstRate;
      }
    } else {
      updated[index][field] = Number(value);
    }
    setItems(updated);
  };

  const handleRemove = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.wholesaleRate), 0);
  const totalTax = items.reduce((sum, item) => sum + ((item.quantity * item.wholesaleRate * item.gstRate) / 100), 0);
  const grandTotal = subtotal + totalTax;

  const handleDispatch = (e) => {
    e.preventDefault();
    const cust = customers.find(c => c.id === Number(selectedCustomerId)) || customers[0];

    const finalOrder = {
      id: Date.now(),
      invoiceNumber: `INV-B2B-${Date.now().toString().slice(-6)}`,
      customer: cust,
      orderType: 'INVENTORY_WHOLESALE',
      warehouse: selectedWarehouse,
      transport: `${transportMode} (${vehicleNo})`,
      cart: items.map(item => {
        const prod = products.find(p => p.id === item.productId);
        return {
          id: item.productId,
          name: prod?.name || 'Wholesale Product',
          unitPrice: item.wholesaleRate,
          quantity: item.quantity,
          gstRate: item.gstRate
        };
      }),
      subtotal,
      taxAmount: totalTax,
      grandTotal,
      paymentMethod: 'DUE',
      paymentStatus: 'UNPAID',
      date: dispatchDate
    };

    if (onConfirmOrder) {
      onConfirmOrder(finalOrder);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-100 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Boxes className="w-5 h-5 text-indigo-600" />
            <span>{language === 'hi' ? 'गोदाम थोक बिक्री (Inventory Sales)' : 'Inventory Sales (Wholesale & B2B)'}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'hi' ? 'सीधे गोदाम से थोक बिलिंग, बल्क डिस्काउंट और परिवहन चालान।' : 'Direct warehouse bulk billing, wholesale discounted rates and transport dispatch.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold text-xs">
            B2B GST Dispatch
          </span>
        </div>
      </div>

      {/* Main Order Form */}
      <form onSubmit={handleDispatch} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
        {/* Buyer & Logistics row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'खरीदार / डीलर (Buyer):' : 'B2B Client / Buyer:'}
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
            >
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name} {c.gstin ? `(GST: ${c.gstin})` : ''}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'गोदाम (Source Warehouse):' : 'Dispatch Warehouse:'}
            </label>
            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
            >
              <option value="Primary Central Warehouse">Primary Central Warehouse</option>
              <option value="Secondary Depot - Unit 2">Secondary Depot - Unit 2</option>
              <option value="Retail Outlet Stockroom">Retail Outlet Stockroom</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'परिवहन माध्यम (Transport):' : 'Transport Mode:'}
            </label>
            <input
              type="text"
              value={transportMode}
              onChange={(e) => setTransportMode(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'गाड़ी संख्या (Vehicle No):' : 'Vehicle / LR No:'}
            </label>
            <input
              type="text"
              value={vehicleNo}
              onChange={(e) => setVehicleNo(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
            />
          </div>
        </div>

        {/* Wholesale Items Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">
              {language === 'hi' ? 'थोक माल सूची (Wholesale Items):' : 'Wholesale Items & Quantities:'}
            </span>
            <button
              type="button"
              onClick={handleAddItem}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'और सामान जोड़ें' : 'Add Item'}</span>
            </button>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                <tr>
                  <th className="px-3 py-2.5">PRODUCT &amp; SKU</th>
                  <th className="px-3 py-2.5 w-28 text-center">BULK QTY</th>
                  <th className="px-3 py-2.5 w-32 text-center">WHOLESALE RATE ({currency})</th>
                  <th className="px-3 py-2.5 w-28 text-center">GST %</th>
                  <th className="px-3 py-2.5 w-32 text-right">LINE TOTAL</th>
                  <th className="px-3 py-2.5 w-12 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60">
                    <td className="p-2">
                      <select
                        value={item.productId}
                        onChange={(e) => handleItemChange(idx, 'productId', e.target.value)}
                        className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
                      >
                        {products.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} (Stock: {p.stockQuantity} | Retail MRP: ₹{p.mrp})
                          </option>
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
                        value={item.wholesaleRate}
                        onChange={(e) => handleItemChange(idx, 'wholesaleRate', e.target.value)}
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
                      {currency}{((item.quantity * item.wholesaleRate) * (1 + item.gstRate / 100)).toFixed(2)}
                    </td>
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemove(idx)}
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

        {/* Footer Summary & Submit */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <div className="text-xs text-slate-500">
            {language === 'hi' ? 'ऑर्डर की पुष्टि होते ही स्टॉक स्वतः घट जाएगा और इनवॉइस बन जाएगा।' : 'Stock automatically deducted from warehouse and tax invoice generated.'}
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block uppercase font-bold">Total Bulk Payable</span>
              <span className="text-xl font-black text-indigo-900">{currency}{grandTotal.toFixed(2)}</span>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-2"
            >
              <Receipt className="w-4 h-4" />
              <span>{language === 'hi' ? 'थोक बिल बनाएं और स्टॉक डिस्पैच करें' : 'Generate B2B Invoice & Dispatch'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

