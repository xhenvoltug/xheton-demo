'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Plus, Trash2, X, Save } from 'lucide-react';

export default function NewGRNPage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [grnData, setGrnData] = useState({
    supplier_id: '',
    warehouse_id: '',
    po_reference: '',
    grn_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    product_id: '',
    quantity: '',
    batch_number: '',
    unit_cost: ''
  });

  // Fetch suppliers, warehouses, products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [suppRes, whRes, prodRes] = await Promise.all([
          fetch('/api/suppliers'),
          fetch('/api/inventory/warehouses'),
          fetch('/api/inventory/products')
        ]);

        if (suppRes.ok) {
          const suppData = await suppRes.json();
          const suppliersList = Array.isArray(suppData) ? suppData : suppData.data || [];
          setSuppliers(suppliersList);
        } else {
          console.error('Suppliers API error:', suppRes.status);
        }
        if (whRes.ok) {
          const whData = await whRes.json();
          const warehousesList = whData.warehouses || whData.data || [];
          setWarehouses(warehousesList);
        }
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          const productsList = prodData.data || [];
          setProducts(productsList);
        } else {
          console.error('Products API error:', prodRes.status);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addItem = () => {
    if (!newItem.product_id || !newItem.quantity) {
      toast.error('Please select product and quantity');
      return;
    }

    setItems([...items, { ...newItem, id: Date.now() }]);
    setNewItem({ product_id: '', quantity: '', batch_number: '', unit_cost: '' });
    toast.success('Item added');
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const submitGRN = async () => {
    if (!grnData.warehouse_id || items.length === 0) {
      toast.error('Please select warehouse and add at least one item');
      return;
    }

    setSubmitting(true);
    try {
      // Send GRN data - API will auto-create Opening Stock supplier if needed
      const res = await fetch('/api/purchases/grn-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...grnData,
          // Note: supplier_id can be undefined for Opening Stock
          items: items.map(({ id, ...item }) => item)
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('GRN created successfully. Status: Draft (awaiting approval)');
        setTimeout(() => router.push('/purchases/grn'), 1500);
      } else {
        toast.error(data.error || 'Failed to create GRN');
        console.error('GRN creation error:', data);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getProductName = (id) => {
    return products.find(p => p.id === id)?.product_name || id;
  };

  const getSupplierName = (id) => {
    return suppliers.find(s => s.id === id)?.supplier_name || id;
  };

  const getWarehouseName = (id) => {
    const warehouse = warehouses.find(w => w.id === id);
    return warehouse ? (warehouse.name || warehouse.warehouse_name) : id;
  };

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="New Goods Received Note (GRN)"
          subtitle="GRN is the ONLY entry point for creating stock. Requires approval to create stock movements."
          actions={[
            <Button
              key="cancel"
              variant="outline"
              onClick={() => router.push('/purchases/grn')}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          ]}
        />

        <div className="max-w-4xl space-y-6">
          {/* GRN Header */}
          <Card className="rounded-2xl shadow-lg border-0 p-6">
            <h2 className="text-xl font-bold mb-6">GRN Details</h2>
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-800 dark:text-blue-200">
              <p>💡 <strong>Tip:</strong> Leave supplier blank for Opening Stock. Required for regular GRNs from suppliers.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Supplier (Optional - leave blank for Opening Stock)</label>
                <select
                  value={grnData.supplier_id}
                  onChange={(e) => setGrnData({ ...grnData, supplier_id: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800"
                >
                  <option value="">-- Opening Stock --</option>
                  {suppliers.length > 0 ? (
                    suppliers.map(s => <option key={s.id} value={s.id}>{s.supplier_name}</option>)
                  ) : (
                    <option disabled>No suppliers available</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Destination Warehouse *</label>
                <select
                  value={grnData.warehouse_id}
                  onChange={(e) => setGrnData({ ...grnData, warehouse_id: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800"
                  required
                >
                  <option value="">Select Warehouse</option>
                  {warehouses.length > 0 ? (
                    warehouses.map(w => <option key={w.id} value={w.id}>{w.name || w.warehouse_name}</option>)
                  ) : (
                    <option disabled>No warehouses available</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">GRN Date</label>
                <Input
                  type="date"
                  value={grnData.grn_date}
                  onChange={(e) => setGrnData({ ...grnData, grn_date: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">PO Reference (Optional)</label>
                <Input
                  placeholder="e.g., PO-2025-001"
                  value={grnData.po_reference}
                  onChange={(e) => setGrnData({ ...grnData, po_reference: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
                <textarea
                  value={grnData.notes}
                  onChange={(e) => setGrnData({ ...grnData, notes: e.target.value })}
                  placeholder="Any additional notes about this receipt..."
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800"
                  rows={3}
                />
              </div>
            </div>
          </Card>

          {/* Add Items */}
          <Card className="rounded-2xl shadow-lg border-0 p-6">
            <h2 className="text-xl font-bold mb-6">Add Items to GRN</h2>
            <div className="space-y-4">
              {/* New Item Form */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <select
                  value={newItem.product_id}
                  onChange={(e) => setNewItem({ ...newItem, product_id: e.target.value })}
                  className="px-3 py-2 border rounded dark:bg-gray-800 text-sm"
                >
                  <option value="">Product</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.product_name}</option>)}
                </select>

                <Input
                  type="number"
                  placeholder="Quantity"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                  className="h-10 text-sm"
                />

                <Input
                  placeholder="Batch #"
                  value={newItem.batch_number}
                  onChange={(e) => setNewItem({ ...newItem, batch_number: e.target.value })}
                  className="h-10 text-sm"
                />

                <Input
                  type="number"
                  placeholder="Unit Cost"
                  value={newItem.unit_cost}
                  onChange={(e) => setNewItem({ ...newItem, unit_cost: e.target.value })}
                  className="h-10 text-sm"
                />

                <Button
                  onClick={addItem}
                  className="h-10 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Items List */}
              {items.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium">Product</th>
                        <th className="px-3 py-2 text-left font-medium">Qty</th>
                        <th className="px-3 py-2 text-left font-medium">Batch</th>
                        <th className="px-3 py-2 text-left font-medium">Cost</th>
                        <th className="px-3 py-2 text-center font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map(item => (
                        <tr key={item.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="px-3 py-2">{getProductName(item.product_id)}</td>
                          <td className="px-3 py-2">{item.quantity}</td>
                          <td className="px-3 py-2">{item.batch_number || '-'}</td>
                          <td className="px-3 py-2">{item.unit_cost || '-'}</td>
                          <td className="px-3 py-2 text-center">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeItem(item.id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {items.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  No items added yet. Add at least one product.
                </div>
              )}
            </div>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => router.push('/purchases/grn')}
            >
              Cancel
            </Button>
            <Button
              onClick={submitGRN}
              disabled={submitting || loading}
              className="bg-gradient-to-r from-purple-600 to-pink-600"
            >
              <Save className="h-4 w-4 mr-2" />
              {submitting ? 'Creating...' : 'Create GRN (Draft)'}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
