import React, { useState } from 'react';
import { Barcode, Printer, Tag, Sparkles, Check } from 'lucide-react';

export default function BarcodeGenerator({ products, settings, currency = '₹' }) {
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || 1);
  const [stickerCount, setStickerCount] = useState(24);
  const [showPrice, setShowPrice] = useState(true);
  const [showStoreName, setShowStoreName] = useState(true);

  const selectedProduct = products.find((p) => p.id === Number(selectedProductId)) || products[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-100 space-y-5">
      {/* Banner - Hidden on print */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Barcode className="w-5 h-5 text-indigo-600" />
            Product Barcode Label &amp; Sticker Generator
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Generate and print retail adhesive barcode sheets for shelf pricing and tagging.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-indigo-600/30 flex items-center gap-2 transition"
        >
          <Printer className="w-4 h-4" />
          <span>Print Sticker Sheet</span>
        </button>
      </div>

      {/* Control Panel - Hidden on print */}
      <div className="no-print bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Select Product</label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(Number(e.target.value))}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold focus:outline-none"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.barcode || p.sku})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Stickers Count</label>
          <select
            value={stickerCount}
            onChange={(e) => setStickerCount(Number(e.target.value))}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold focus:outline-none"
          >
            <option value="12">12 Stickers (Half Page)</option>
            <option value="24">24 Stickers (Standard A4 3x8 Sheet)</option>
            <option value="40">40 Stickers (Small 4x10 Sheet)</option>
          </select>
        </div>

        <div className="flex items-center gap-4 pt-5">
          <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={showStoreName}
              onChange={(e) => setShowStoreName(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-0 w-4 h-4"
            />
            <span>Store Header</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={showPrice}
              onChange={(e) => setShowPrice(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-0 w-4 h-4"
            />
            <span>Selling Price</span>
          </label>
        </div>

        <div className="flex items-center justify-end pt-4">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Barcode Target</span>
            <span className="font-mono font-bold text-indigo-700 text-sm">
              {selectedProduct?.barcode || selectedProduct?.sku}
            </span>
          </div>
        </div>
      </div>

      {/* Printable Sheet View */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex justify-center">
        <div
          id="printable-barcodes"
          className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4 bg-white border border-slate-200 rounded-xl"
        >
          {Array.from({ length: stickerCount }).map((_, index) => (
            <div
              key={index}
              className="border border-dashed border-slate-400 p-2.5 rounded-lg text-center flex flex-col items-center justify-between bg-white text-slate-900 font-sans shadow-2xs"
            >
              {/* Store Name Header */}
              {showStoreName && (
                <div className="text-[9px] font-black uppercase tracking-wider text-slate-700 truncate w-full">
                  {settings?.storeName || 'PosSaaS Retail'}
                </div>
              )}

              {/* Product Title */}
              <div className="text-[10px] font-bold text-slate-900 truncate w-full mt-0.5">
                {selectedProduct?.name}
              </div>

              {/* Fake / Graphical Barcode */}
              <div className="my-1 flex flex-col items-center">
                <div className="font-mono text-sm tracking-widest bg-black text-white px-2 py-0.5 select-none scale-y-110">
                  ||| |||| || |||||| | |||||
                </div>
                <div className="text-[9px] font-mono tracking-wider text-slate-600 mt-0.5">
                  {selectedProduct?.barcode || selectedProduct?.sku}
                </div>
              </div>

              {/* Price & SKU */}
              {showPrice && (
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-extrabold text-slate-900 border-t border-slate-200 w-full pt-0.5 mt-0.5">
                  <span>Price: {currency}{selectedProduct?.sellingPrice}</span>
                  {selectedProduct?.mrp > selectedProduct?.sellingPrice && (
                    <span className="text-[9px] text-slate-400 line-through">
                      MRP {currency}{selectedProduct?.mrp}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

