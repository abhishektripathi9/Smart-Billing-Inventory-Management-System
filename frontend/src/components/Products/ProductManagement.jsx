import React, { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  Edit,
  Trash2,
  Barcode,
  ArrowUpDown,
  CheckCircle2,
  X,
  Filter,
  Download
} from 'lucide-react';
import { exportToCSV } from '../../utils/exportCsv';

export default function ProductManagement({
  products,
  categories,
  onSaveProduct,
  onDeleteProduct,
  filterLowStockOnly = false,
  currency = '₹'
}) {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [stockFilter, setStockFilter] = useState(filterLowStockOnly ? 'LOW' : 'ALL');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    variant: '',
    sku: '',
    barcode: '',
    categoryId: 1,
    categoryName: 'Clothes, Shoes',
    brand: '',
    unit: 'pcs',
    costPrice: 0,
    sellingPrice: 0,
    mrp: 0,
    stockQuantity: 10,
    minStockAlert: 5,
    gstRate: 12,
    hsnCode: '',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=350&auto=format&fit=crop&q=60'
  });

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        search.trim() === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku?.toLowerCase().includes(search.toLowerCase()) ||
        p.barcode?.includes(search.trim());

      const matchesCat = selectedCat === 'ALL' || String(p.categoryId) === String(selectedCat);

      let matchesStock = true;
      if (stockFilter === 'LOW') {
        matchesStock = p.stockQuantity <= (p.minStockAlert || 5) && p.stockQuantity > 0;
      } else if (stockFilter === 'OUT') {
        matchesStock = p.stockQuantity <= 0;
      } else if (stockFilter === 'IN') {
        matchesStock = p.stockQuantity > (p.minStockAlert || 5);
      }

      return matchesSearch && matchesCat && matchesStock;
    });
  }, [products, search, selectedCat, stockFilter]);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      variant: '',
      sku: `SKU-${Date.now().toString().slice(-5)}`,
      barcode: `890${Math.floor(100000000 + Math.random() * 900000000)}`,
      categoryId: categories[0]?.id || 1,
      categoryName: categories[0]?.name || 'Retail',
      brand: '',
      unit: 'pcs',
      costPrice: 100,
      sellingPrice: 150,
      mrp: 200,
      stockQuantity: 20,
      minStockAlert: 5,
      gstRate: 18,
      hsnCode: '610910',
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=350&auto=format&fit=crop&q=60'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setFormData({ ...p });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const cat = categories.find((c) => String(c.id) === String(formData.categoryId));
    const productPayload = {
      ...formData,
      id: editingProduct ? editingProduct.id : undefined,
      categoryName: cat ? cat.name : formData.categoryName,
      costPrice: Number(formData.costPrice),
      sellingPrice: Number(formData.sellingPrice),
      mrp: Number(formData.mrp),
      stockQuantity: Number(formData.stockQuantity),
      minStockAlert: Number(formData.minStockAlert),
      gstRate: Number(formData.gstRate)
    };
    onSaveProduct(productPayload);
    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-100 space-y-5">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-600" />
            Product Catalog &amp; Inventory Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage barcodes, HSN codes, GST tax rates and stock replenishment levels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const exportData = filteredProducts.map((p) => ({
                'Name': p.name,
                'SKU': p.sku,
                'Barcode': p.barcode,
                'Category': p.categoryName,
                'Cost Price': p.costPrice,
                'Selling Price': p.sellingPrice,
                'Stock Quantity': p.stockQuantity,
                'Unit': p.unit,
                'GST Rate %': p.gstRate,
                'HSN Code': p.hsnCode
              }));
              exportToCSV(exportData, `Stock_Inventory_${new Date().toISOString().slice(0, 10)}.csv`);
            }}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            <span>Export Inventory</span>
          </button>

          <button
            onClick={openAddModal}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center gap-3 text-xs">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product title, SKU or barcode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-slate-500 font-semibold flex-shrink-0">Category:</span>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-800 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Stock Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full md:w-auto">
          {[
            { id: 'ALL', label: 'All' },
            { id: 'IN', label: 'In Stock' },
            { id: 'LOW', label: 'Low Stock' },
            { id: 'OUT', label: 'Out of Stock' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStockFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition text-xs ${
                stockFilter === tab.id
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-3">SKU &amp; Barcode</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-right">Cost</th>
                <th className="py-3 px-3 text-right">Sell Price</th>
                <th className="py-3 px-3 text-center">GST %</th>
                <th className="py-3 px-3 text-center">Stock Level</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    No products matched your criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isOutOfStock = p.stockQuantity <= 0;
                  const isLowStock = p.stockQuantity <= (p.minStockAlert || 5) && !isOutOfStock;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition">
                      {/* Product image & name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block truncate max-w-xs">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {p.variant || p.brand || 'Standard'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* SKU & Barcode */}
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                        <div>{p.sku}</div>
                        <div className="text-[10px] text-slate-400">{p.barcode}</div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                          {p.categoryName || 'General'}
                        </span>
                      </td>

                      {/* Cost */}
                      <td className="py-3 px-3 text-right text-slate-500 font-semibold">
                        {currency}{Number(p.costPrice).toFixed(2)}
                      </td>

                      {/* Selling Price */}
                      <td className="py-3 px-3 text-right font-extrabold text-slate-900">
                        {currency}{Number(p.sellingPrice).toFixed(2)}
                      </td>

                      {/* GST % */}
                      <td className="py-3 px-3 text-center">
                        <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                          {p.gstRate}%
                        </span>
                      </td>

                      {/* Stock Level with Badge */}
                      <td className="py-3 px-3 text-center">
                        {isOutOfStock ? (
                          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-black text-[10px] uppercase">
                            Out of Stock (0)
                          </span>
                        ) : isLowStock ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center justify-center gap-1 mx-auto w-fit">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            Low: {p.stockQuantity} {p.unit}
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            {p.stockQuantity} {p.unit}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete "${p.name}"?`)) {
                                onDeleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-indigo-600 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Package className="w-5 h-5" />
                <span>{editingProduct ? 'Edit Product Details' : 'Add New Inventory Item'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-indigo-200 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Product Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Cotton T-Shirt Men Royal Blue"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                  />
                </div>

                {/* SKU */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none font-mono"
                  />
                </div>

                {/* Barcode */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Barcode / EAN</label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none font-mono"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none font-semibold cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Unit */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unit of Measurement</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
                  >
                    <option value="pcs">Pieces (pcs)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="bottle">Bottle</option>
                    <option value="strip">Strip (Medicines)</option>
                    <option value="box">Box / Carton</option>
                    <option value="pair">Pair</option>
                  </select>
                </div>

                {/* Cost Price */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cost Price ({currency})</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>

                {/* Selling Price */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Selling Price ({currency})</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none font-bold text-indigo-700"
                  />
                </div>

                {/* Stock Quantity */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Stock Qty</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none font-bold"
                  />
                </div>

                {/* Min Stock Alert */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Low Stock Threshold</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.minStockAlert}
                    onChange={(e) => setFormData({ ...formData, minStockAlert: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>

                {/* GST Rate */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">GST Tax Rate (%)</label>
                  <select
                    value={formData.gstRate}
                    onChange={(e) => setFormData({ ...formData, gstRate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none font-bold text-indigo-700"
                  >
                    <option value="0">0% (Exempted)</option>
                    <option value="5">5% (CGST 2.5% + SGST 2.5%)</option>
                    <option value="12">12% (CGST 6% + SGST 6%)</option>
                    <option value="18">18% (CGST 9% + SGST 9%)</option>
                    <option value="28">28% (Luxury)</option>
                  </select>
                </div>

                {/* HSN Code */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">HSN / SAC Code</label>
                  <input
                    type="text"
                    value={formData.hsnCode}
                    onChange={(e) => setFormData({ ...formData, hsnCode: e.target.value })}
                    placeholder="e.g. 610910"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none font-mono"
                  />
                </div>

                {/* Image URL */}
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 font-extrabold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

