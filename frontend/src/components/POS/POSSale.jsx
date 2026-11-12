import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  Barcode,
  Trash2,
  Plus,
  Minus,
  RotateCcw,
  CreditCard,
  Percent,
  CheckCircle,
  AlertCircle,
  Tag,
  PackageOpen,
  ShoppingBag,
  Sparkles,
  Shirt,
  Pill,
  ShoppingBasket
} from 'lucide-react';
import { sounds } from '../../utils/audio';
import { translations } from '../../utils/i18n';

export default function POSSale({
  products,
  selectedCustomer,
  onProceedToPayment,
  cart,
  setCart,
  currency = '₹',
  language = 'en'
}) {
  const t = (key) => translations[language]?.[key] || translations.en[key] || key;
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [shippingCharge, setShippingCharge] = useState(0);
  const [taxMode, setTaxMode] = useState('auto'); // 'auto' (item GST) or specific rate
  const barcodeInputRef = useRef(null);

  // Focus barcode input on mount and shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F2') {
        e.preventDefault();
        barcodeInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter products by category and search
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat =
        selectedCategory === 'ALL' ||
        p.categoryName?.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory === 'Clothes, Shoes' && (p.categoryId === 1 || p.categoryId === 2));

      const matchesSearch =
        searchQuery.trim() === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.barcode?.includes(searchQuery.trim());

      return matchesCat && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Handle barcode Enter submission
  const handleBarcodeSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const code = searchQuery.trim();
      const found = products.find(
        (p) => p.barcode === code || p.sku.toLowerCase() === code.toLowerCase()
      );
      if (found) {
        addToCart(found);
        setSearchQuery('');
      }
    }
  };

  // Add to cart
  const addToCart = (product) => {
    if (product.stockQuantity <= 0) {
      alert(`"${product.name}" is currently Out of Stock!`);
      return;
    }

    sounds.playBeep(); // Classic supermarket scanner beep

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stockQuantity) {
          alert(`Cannot add more. Only ${product.stockQuantity} items in stock!`);
          return prevCart;
        }
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [
          ...prevCart,
          {
            ...product,
            quantity: 1,
            unitPrice: product.sellingPrice,
            gstRate: product.gstRate || 0
          }
        ];
      }
    });
  };

  // Update item quantity
  const updateQuantity = (productId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty > item.stockQuantity) {
              alert(`Maximum available stock is ${item.stockQuantity}`);
              return item;
            }
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // Set quantity directly
  const setQuantityDirect = (productId, qty) => {
    const num = parseInt(qty, 10);
    if (isNaN(num) || num <= 0) return;
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === productId) {
          const finalQty = Math.min(num, item.stockQuantity);
          return { ...item, quantity: finalQty };
        }
        return item;
      })
    );
  };

  // Remove item
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Clear cart
  const clearCart = () => {
    if (cart.length === 0) return;
    if (window.confirm('Are you sure you want to cancel and clear this order?')) {
      setCart([]);
    }
  };

  // Totals calculations
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cart.reduce((sum, item) => {
    return sum + item.quantity * item.unitPrice;
  }, 0);

  // Discount calculation
  const calculatedDiscount = useMemo(() => {
    if (discountPercent > 0) {
      return (subtotal * discountPercent) / 100;
    }
    return Number(discountAmount) || 0;
  }, [subtotal, discountPercent, discountAmount]);

  // Tax calculation
  const totalTax = useMemo(() => {
    if (taxMode === 'auto') {
      return cart.reduce((sum, item) => {
        const itemSubtotal = item.quantity * item.unitPrice;
        const rate = item.gstRate || 0;
        return sum + (itemSubtotal * rate) / 100;
      }, 0);
    } else {
      const rate = Number(taxMode) || 0;
      return (Math.max(0, subtotal - calculatedDiscount) * rate) / 100;
    }
  }, [cart, taxMode, subtotal, calculatedDiscount]);

  const grandTotal = Math.max(
    0,
    subtotal - calculatedDiscount + totalTax + Number(shippingCharge || 0)
  );

  const handleCheckoutClick = () => {
    if (cart.length === 0) {
      alert('Cart is empty! Please add products to proceed with billing.');
      return;
    }
    onProceedToPayment({
      cart,
      subtotal,
      discountAmount: calculatedDiscount,
      discountPercent,
      taxAmount: totalTax,
      shippingCharge: Number(shippingCharge || 0),
      grandTotal,
      customer: selectedCustomer
    });
  };

  // Category quick filter pills matching reference screenshot
  const categories = [
    { id: 'ALL', label: t('allItems') || 'All Items' },
    { id: 'Clothes, Shoes', label: language === 'hi' ? 'कपड़े व जूते' : 'Clothes, Shoes' },
    { id: "Girl's Clothing", label: language === 'hi' ? 'लड़कियों के कपड़े' : "Girl's Clothing" },
    { id: 'Fashion', label: language === 'hi' ? 'फ़ैशन' : 'Fashion' },
    { id: 'Grocery', label: language === 'hi' ? 'किराना व राशन' : 'Grocery' },
    { id: 'Medical / Pharma', label: language === 'hi' ? 'दवाइयां (Pharma)' : 'Medicines' },
    { id: 'Electronics', label: language === 'hi' ? 'इलेक्ट्रॉनिक्स' : 'Electronics' }
  ];

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-100">
      {/* ============================================================ */}
      {/* LEFT PANE: BILLING CART & CHECKOUT (Matching Screenshot)   */}
      {/* ============================================================ */}
      <div className="w-full lg:w-[48%] xl:w-[46%] bg-white border-r border-slate-200 flex flex-col h-[calc(100vh-4rem)]">
        {/* Customer Bar */}
        <div className="p-3 bg-indigo-50/70 border-b border-indigo-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600">{t('billedTo')}:</span>
            <span className="font-bold text-indigo-900 bg-white px-2.5 py-1 rounded-md border border-indigo-200 shadow-2xs">
              {selectedCustomer?.name || t('walkInCustomer')}
            </span>
          </div>
          <div className="text-right">
            {selectedCustomer?.balanceDue > 0 ? (
              <span className="text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                {language === 'hi' ? 'बकाया (Due): ' : 'Pending Due: '}{currency}
                {selectedCustomer.balanceDue}
              </span>
            ) : (
              <span className="text-emerald-700 font-semibold text-[11px] bg-emerald-100 px-2 py-0.5 rounded">
                {language === 'hi' ? 'बकाया शून्य' : 'Clear Balance'}
              </span>
            )}
          </div>
        </div>

        {/* Cart Items Table Header */}
        <div className="grid grid-cols-12 gap-1 px-4 py-2.5 bg-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
          <div className="col-span-5">{t('product')}</div>
          <div className="col-span-2 text-center">{t('price')}</div>
          <div className="col-span-3 text-center">{t('quantity')}</div>
          <div className="col-span-2 text-right">{t('subtotal')}</div>
        </div>

        {/* Cart Item Rows */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-6 text-slate-400">
              <ShoppingBag className="w-12 h-12 text-slate-300 mb-2 stroke-[1.5]" />
              <p className="font-semibold text-sm text-slate-600">Cart is empty</p>
              <p className="text-xs text-slate-400 text-center max-w-xs mt-1">
                Scan barcode, search by name, or click items from the right catalog to add them to this bill.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-1 px-4 py-2.5 items-center text-xs hover:bg-slate-50/80 transition group"
              >
                {/* Product Name & details */}
                <div className="col-span-5">
                  <div className="font-bold text-slate-800 truncate" title={item.name}>
                    {item.name}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                    <span>GST {item.gstRate}%</span>
                    <span>•</span>
                    <span>SKU: {item.sku}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-2 text-center font-semibold text-slate-700">
                  {currency}
                  {item.unitPrice.toFixed(2)}
                </div>

                {/* Quantity Controls */}
                <div className="col-span-3 flex items-center justify-center gap-1">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={item.stockQuantity}
                    value={item.quantity}
                    onChange={(e) => setQuantityDirect(item.id, e.target.value)}
                    className="w-9 h-6 text-center font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                  />
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Subtotal & Delete Action */}
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <span className="font-bold text-slate-900 text-right">
                    {currency}
                    {(item.quantity * item.unitPrice).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-slate-300 hover:text-red-500 transition p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ============================================================ */}
        {/* SUMMARY / TOTALS CALCULATION BOX (Exact to screenshot)     */}
        {/* ============================================================ */}
        <div className="p-4 bg-slate-50/90 border-t border-slate-200 space-y-2 text-xs">
          {/* Total Items & Subtotal */}
          <div className="flex items-center justify-between text-slate-600">
            <span>
              {t('totalItems')}: <strong className="text-slate-800">{totalItemCount}</strong>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">{t('subTotal')}:</span>
              <span className="font-bold text-slate-800">
                {currency}
                {subtotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Service / Shipping & Tax / GST */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Service / Shipping */}
            <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500">{t('shipping')}:</span>
              <div className="flex items-center gap-1">
                <span className="text-slate-400">{currency}</span>
                <input
                  type="number"
                  min="0"
                  value={shippingCharge}
                  onChange={(e) => setShippingCharge(e.target.value)}
                  className="w-14 text-right font-semibold bg-transparent focus:outline-none text-slate-800"
                />
              </div>
            </div>

            {/* GST Rate / Tax Mode */}
            <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500">{t('gstTax')}:</span>
              <select
                value={taxMode}
                onChange={(e) => setTaxMode(e.target.value)}
                className="text-[11px] font-bold text-indigo-700 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="auto">{language === 'hi' ? 'सामान अनुसार जीएसटी (Auto)' : 'Item GST Rates (Auto)'}</option>
                <option value="0">0% (Nil)</option>
                <option value="5">5% (CGST 2.5% + SGST 2.5%)</option>
                <option value="12">12% (CGST 6% + SGST 6%)</option>
                <option value="18">18% (CGST 9% + SGST 9%)</option>
                <option value="28">28% (Luxury)</option>
              </select>
            </div>
          </div>

          {/* Discount & Tax Amount row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Discount */}
            <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500">{t('discount')}:</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={discountPercent > 0 ? discountPercent : discountAmount}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (discountPercent > 0) {
                      setDiscountPercent(val);
                    } else {
                      setDiscountAmount(val);
                    }
                  }}
                  className="w-12 text-right font-semibold bg-transparent focus:outline-none text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (discountPercent > 0) {
                      setDiscountPercent(0);
                      setDiscountAmount(0);
                    } else {
                      setDiscountPercent(5);
                    }
                  }}
                  className="px-1 text-[10px] font-bold rounded bg-slate-100 hover:bg-slate-200 text-indigo-600"
                >
                  {discountPercent > 0 ? '%' : currency}
                </button>
              </div>
            </div>

            {/* Calculated Tax */}
            <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500">{t('gstComputed')}:</span>
              <span className="font-bold text-slate-800">
                +{currency}
                {totalTax.toFixed(2)}
              </span>
            </div>
          </div>

          {/* GRAND TOTAL ROW */}
          <div className="mt-2 pt-2 border-t border-slate-200/80 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {t('grandTotal')}
              </div>
              <div className="text-[10px] text-slate-500">
                {language === 'hi' ? 'सभी कर व जीएसटी सहित' : 'Inclusive of all taxes & GST'}
              </div>
            </div>
            <div className="text-2xl font-extrabold text-indigo-900 tracking-tight">
              {currency}
              {grandTotal.toFixed(2)}
            </div>
          </div>

          {/* Action Buttons: Cancel and Payment (Exact styling to screenshot!) */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={clearCart}
              disabled={cart.length === 0}
              className="py-2.5 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-sm hover:shadow transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('cancelOrder')}</span>
            </button>

            <button
              onClick={handleCheckoutClick}
              disabled={cart.length === 0}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CreditCard className="w-4 h-4" />
              <span>{t('payment')} ({currency}{grandTotal.toFixed(2)})</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* RIGHT PANE: PRODUCT SEARCH & GRID (Matching Screenshot)   */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden p-4 space-y-3">
        {/* Top Controls: Search / Barcode Input */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              ref={barcodeInputRef}
              type="text"
              placeholder={t('scanOrSearch')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleBarcodeSubmit}
              className="w-full pl-10 pr-24 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              <Barcode className="w-3.5 h-3.5" />
              <span>{t('scanner')}</span>
            </div>
          </div>
        </div>

        {/* Category Pills (Matching reference screenshot tabs!) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs select-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg font-bold text-xs whitespace-nowrap transition-all duration-150 shadow-2xs ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          {filteredProducts.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400">
              <PackageOpen className="w-10 h-10 mb-2 stroke-[1.5]" />
              <p className="font-semibold text-sm">{language === 'hi' ? 'कोई उत्पाद नहीं मिला' : 'No products found'}</p>
              <p className="text-xs">{language === 'hi' ? 'खोज या श्रेणी फ़िल्टर बदलकर देखें' : 'Try adjusting your search query or category filter'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredProducts.map((product) => {
                const isOutOfStock = product.stockQuantity <= 0;
                const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= product.minStockAlert;

                return (
                  <div
                    key={product.id}
                    onClick={() => !isOutOfStock && addToCart(product)}
                    className={`bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer group hover:border-indigo-400 ${
                      isOutOfStock ? 'opacity-60 cursor-not-allowed' : 'active:scale-98'
                    }`}
                  >
                    {/* Product Image */}
                    <div className="relative h-32 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {/* Stock Badge */}
                      <div className="absolute top-2 right-2">
                        {isOutOfStock ? (
                          <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-black uppercase shadow-xs">
                            {t('outOfStock')}
                          </span>
                        ) : isLowStock ? (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold shadow-xs">
                            {language === 'hi' ? `केवल ${product.stockQuantity} शेष` : `Only ${product.stockQuantity} left`}
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded-md bg-emerald-600/90 text-white text-[10px] font-bold shadow-xs">
                            {product.stockQuantity} {t('inStock')}
                          </span>
                        )}
                      </div>

                      {/* Category Tag */}
                      <div className="absolute bottom-2 left-2">
                        <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[9px] font-medium">
                          {product.categoryName || 'Retail'}
                        </span>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-2.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-slate-800 text-xs line-clamp-1 group-hover:text-indigo-600 transition">
                          {product.name}
                        </h4>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">
                          {product.variant || product.sku}
                        </div>
                      </div>

                      {/* Price & Add Tag */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                        <div className="flex items-baseline gap-1">
                          <span className="font-extrabold text-slate-900 text-sm">
                            {currency}
                            {product.sellingPrice}
                          </span>
                          {product.mrp > product.sellingPrice && (
                            <span className="text-[10px] text-slate-400 line-through">
                              {currency}
                              {product.mrp}
                            </span>
                          )}
                        </div>

                        <span className="w-6 h-6 rounded-lg bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white flex items-center justify-center transition shadow-2xs">
                          <Plus className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

