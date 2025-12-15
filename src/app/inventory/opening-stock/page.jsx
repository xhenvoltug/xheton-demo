'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Upload, Plus, X, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function OpeningStockPage() {
  const router = useRouter();
  const [mode, setMode] = useState('manual'); // 'manual' or 'bulk'
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Manual entry state
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    product_id: '',
    quantity: '',
    batch_number: '',
    unit_cost: '',
    expiry_date: ''
  });
  const [notes, setNotes] = useState('');

  // Bulk import state
  const [bulkItems, setBulkItems] = useState([]);
  const [bulkResults, setBulkResults] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [warehousesRes, productsRes] = await Promise.all([
          fetch('/api/inventory/warehouses'),
          fetch('/api/inventory/products')
        ]);

        const warehousesData = await warehousesRes.json();
        const productsData = await productsRes.json();

        setWarehouses(warehousesData.data || []);
        setProducts(productsData.data || []);
      } catch (err) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addItem = () => {
    if (!currentItem.product_id) {
      toast.error('Please select a product');
      return;
    }
    if (!currentItem.quantity || parseFloat(currentItem.quantity) <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }

    const product = products.find(p => p.id === currentItem.product_id);
    setItems([...items, {
      ...currentItem,
      id: Date.now(),
      product_name: product?.name,
      product_code: product?.code
    }]);

    setCurrentItem({
      product_id: '',
      quantity: '',
      batch_number: '',
      unit_cost: '',
      expiry_date: ''
    });
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleSubmitManual = async () => {
    if (!selectedWarehouse) {
      toast.error('Please select a warehouse');
      return;
    }
    if (items.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/inventory/opening-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          warehouse_id: selectedWarehouse,
          items: items.map(item => ({
            product_id: item.product_id,
            quantity: parseFloat(item.quantity),
            batch_number: item.batch_number || null,
            unit_cost: item.unit_cost ? parseFloat(item.unit_cost) : 0,
            expiry_date: item.expiry_date || null
          })),
          notes: notes || 'Opening stock entry'
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(`Opening stock created! GRN: ${data.data.grn_number}`);
        setItems([]);
        setSelectedWarehouse('');
        setNotes('');
        setTimeout(() => router.push('/purchases/grn'), 1500);
      } else {
        toast.error(data.error || 'Failed to create opening stock');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkImport = async () => {
    if (bulkItems.length === 0) {
      toast.error('Please add items for bulk import');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/inventory/opening-stock', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: bulkItems.map(item => ({
            product_id: item.product_id,
            warehouse_id: item.warehouse_id,
            quantity: parseFloat(item.quantity),
            batch_number: item.batch_number || null,
            unit_cost: item.unit_cost ? parseFloat(item.unit_cost) : 0,
            expiry_date: item.expiry_date || null
          }))
        })
      });

      const data = await res.json();

      if (data.success) {
        setBulkResults(data.data);
        toast.success(`${data.data.successful} items imported successfully`);
        if (data.data.failed > 0) {
          toast.error(`${data.data.failed} items failed`);
        }
      } else {
        toast.error(data.error || 'Bulk import failed');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row = {};
      headers.forEach((header, idx) => {
        row[header] = values[idx];
      });
      if (row.product_id && row.warehouse_id && row.quantity) {
        rows.push(row);
      }
    }

    return rows;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target.result;
        const parsed = parseCSV(csv);
        setBulkItems(parsed);
        toast.success(`${parsed.length} items parsed from file`);
      } catch (err) {
        toast.error('Failed to parse file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="rounded-lg"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <PageHeader
            title="Opening Stock Entry"
            subtitle="Initialize inventory for all products"
          />
        </div>

        {/* Mode Toggle */}
        <Card className="rounded-2xl shadow-lg border-0 mb-6 p-4">
          <div className="flex gap-4">
            <Button
              variant={mode === 'manual' ? 'default' : 'outline'}
              className="rounded-lg"
              onClick={() => setMode('manual')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Manual Entry
            </Button>
            <Button
              variant={mode === 'bulk' ? 'default' : 'outline'}
              className="rounded-lg"
              onClick={() => setMode('bulk')}
            >
              <Upload className="h-4 w-4 mr-2" />
              Bulk Import (CSV/Excel)
            </Button>
          </div>
        </Card>

        {/* Manual Entry Mode */}
        {mode === 'manual' && (
          <div className="space-y-6">
            {/* Info Banner */}
            <Card className="rounded-2xl shadow-lg border-0 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Opening stock can only be set once per product-warehouse combination.
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                    Each entry creates a GRN and stock movement automatically.
                  </p>
                </div>
              </div>
            </Card>

            {/* Warehouse Selection */}
            <Card className="rounded-2xl shadow-lg border-0 p-6">
              <label className="block text-sm font-medium mb-3">Warehouse *</label>
              <select
                value={selectedWarehouse}
                onChange={(e) => setSelectedWarehouse(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800"
              >
                <option value="">Select warehouse...</option>
                {warehouses.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </Card>

            {/* Item Entry */}
            <Card className="rounded-2xl shadow-lg border-0 p-6">
              <h3 className="font-semibold mb-4">Add Items</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Product *</label>
                  <select
                    value={currentItem.product_id}
                    onChange={(e) => setCurrentItem({...currentItem, product_id: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800"
                  >
                    <option value="">Select product...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Quantity *</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={currentItem.quantity}
                    onChange={(e) => setCurrentItem({...currentItem, quantity: e.target.value})}
                    placeholder="0.00"
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Batch Number (Optional)</label>
                  <Input
                    value={currentItem.batch_number}
                    onChange={(e) => setCurrentItem({...currentItem, batch_number: e.target.value})}
                    placeholder="e.g., BATCH-2025-001"
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Unit Cost (UGX) (Optional)</label>
                  <Input
                    type="number"
                    min="0"
                    step="100"
                    value={currentItem.unit_cost}
                    onChange={(e) => setCurrentItem({...currentItem, unit_cost: e.target.value})}
                    placeholder="0"
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Expiry Date (Optional)</label>
                  <Input
                    type="date"
                    value={currentItem.expiry_date}
                    onChange={(e) => setCurrentItem({...currentItem, expiry_date: e.target.value})}
                    className="rounded-lg"
                  />
                </div>
              </div>
              <Button
                onClick={addItem}
                className="rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </Card>

            {/* Items List */}
            {items.length > 0 && (
              <Card className="rounded-2xl shadow-lg border-0 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Product</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Quantity</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Batch</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Cost (UGX)</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Expiry</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="px-4 py-3 text-sm">
                            <div>
                              <p className="font-medium">{item.product_name}</p>
                              <p className="text-gray-500 text-xs">{item.product_code}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm font-medium">{parseFloat(item.quantity).toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.batch_number || '-'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.unit_cost ? parseFloat(item.unit_cost).toLocaleString() : '-'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.expiry_date || '-'}</td>
                          <td className="px-4 py-3 text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Notes */}
            <Card className="rounded-2xl shadow-lg border-0 p-6">
              <label className="block text-sm font-medium mb-3">Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any notes about this opening stock batch..."
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 min-h-24"
              />
            </Card>

            {/* Submit */}
            {items.length > 0 && (
              <div className="flex gap-4">
                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  className="rounded-lg flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitManual}
                  disabled={submitting}
                  className="rounded-lg flex-1 bg-gradient-to-r from-green-600 to-emerald-600"
                >
                  {submitting ? 'Creating...' : 'Create Opening Stock'}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Bulk Import Mode */}
        {mode === 'bulk' && (
          <div className="space-y-6">
            {/* Instructions */}
            <Card className="rounded-2xl shadow-lg border-0 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 p-4">
              <p className="text-sm text-amber-900 dark:text-amber-100 font-medium mb-2">
                CSV Format Required:
              </p>
              <p className="text-sm text-amber-800 dark:text-amber-200 font-mono">
                product_id, warehouse_id, quantity, batch_number (optional), unit_cost (optional), expiry_date (optional)
              </p>
            </Card>

            {/* File Upload */}
            <Card className="rounded-2xl shadow-lg border-0 p-6">
              <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="font-medium mb-1">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">CSV or Excel file</p>
                </label>
              </div>
            </Card>

            {/* Bulk Items Preview */}
            {bulkItems.length > 0 && (
              <>
                <Card className="rounded-2xl shadow-lg border-0 p-6">
                  <h3 className="font-semibold mb-4">{bulkItems.length} Items Ready to Import</h3>
                  <div className="overflow-x-auto max-h-96 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
                        <tr>
                          <th className="px-4 py-2 text-left">Product</th>
                          <th className="px-4 py-2 text-left">Warehouse</th>
                          <th className="px-4 py-2 text-left">Quantity</th>
                          <th className="px-4 py-2 text-left">Batch</th>
                          <th className="px-4 py-2 text-left">Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bulkItems.map((item, idx) => (
                          <tr key={idx} className="border-t">
                            <td className="px-4 py-2">{item.product_id}</td>
                            <td className="px-4 py-2">{item.warehouse_id}</td>
                            <td className="px-4 py-2 font-medium">{item.quantity}</td>
                            <td className="px-4 py-2 text-gray-600">{item.batch_number || '-'}</td>
                            <td className="px-4 py-2 text-gray-600">{item.unit_cost || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                <div className="flex gap-4">
                  <Button
                    onClick={() => setBulkItems([])}
                    variant="outline"
                    className="rounded-lg flex-1"
                  >
                    Clear & Upload New File
                  </Button>
                  <Button
                    onClick={handleBulkImport}
                    disabled={submitting}
                    className="rounded-lg flex-1 bg-gradient-to-r from-orange-600 to-amber-600"
                  >
                    {submitting ? 'Importing...' : 'Import All Items'}
                  </Button>
                </div>
              </>
            )}

            {/* Bulk Results */}
            {bulkResults && (
              <Card className="rounded-2xl shadow-lg border-0 p-6">
                <h3 className="font-semibold mb-4">Import Results</h3>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600">{bulkResults.successful}</p>
                    <p className="text-sm text-green-700">Successful</p>
                  </div>
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
                    <p className="text-2xl font-bold text-red-600">{bulkResults.failed}</p>
                    <p className="text-sm text-red-700">Failed</p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600">{bulkResults.total}</p>
                    <p className="text-sm text-blue-700">Total</p>
                  </div>
                </div>

                {bulkResults.failed > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                          <th className="px-4 py-2 text-left">Row</th>
                          <th className="px-4 py-2 text-left">Status</th>
                          <th className="px-4 py-2 text-left">Message</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bulkResults.results
                          .filter(r => !r.success)
                          .map((result, idx) => (
                            <tr key={idx} className="border-t bg-red-50 dark:bg-red-900/10">
                              <td className="px-4 py-2 font-medium">{result.row}</td>
                              <td className="px-4 py-2">
                                <span className="text-red-600">Failed</span>
                              </td>
                              <td className="px-4 py-2 text-red-600">{result.message}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            )}
          </div>
        )}

        {/* Branding Footer */}
        <div className="mt-12 pt-6 border-t text-center text-xs text-gray-500 dark:text-gray-400">
          <p>
            <span className="font-semibold">XHETON</span> ERP System | Author: Xhenvolt
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
