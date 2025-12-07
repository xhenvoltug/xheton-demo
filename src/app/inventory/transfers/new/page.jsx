'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import FormCard from '@/components/shared/FormCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const mockWarehouses = [
  { id: 'WH-001', name: 'Main Warehouse' },
  { id: 'WH-002', name: 'North Branch' },
  { id: 'WH-003', name: 'South Branch' },
];

const mockProducts = [
  { id: 'P001', name: 'Laptop Pro 15"', stock: 30 },
  { id: 'P002', name: 'Wireless Mouse', stock: 120 },
  { id: 'P003', name: 'Monitor 27"', stock: 25 },
];

export default function NewTransferPage() {
  const router = useRouter();
  const [fromWarehouse, setFromWarehouse] = useState('');
  const [toWarehouse, setToWarehouse] = useState('');
  const [items, setItems] = useState([]);

  const addItem = () => {
    setItems([...items, { id: Date.now(), product: '', quantity: '' }]);
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fromWarehouse || !toWarehouse || items.length === 0) {
      toast.error('Please complete all fields');
      return;
    }
    toast.success('Transfer created successfully!');
    setTimeout(() => router.push('/inventory/transfers/list'), 1000);
  };

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="New Stock Transfer"
          subtitle="Transfer items between warehouses"
          actions={[
            <Button
              key="cancel"
              variant="outline"
              onClick={() => router.push('/inventory/transfers/list')}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>,
          ]}
        />

        <form onSubmit={handleSubmit} className="max-w-4xl">
          <div className="space-y-6">
            <FormCard title="Transfer Details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="from">From Warehouse *</Label>
                  <Select value={fromWarehouse} onValueChange={setFromWarehouse}>
                    <SelectTrigger id="from" className="mt-2">
                      <SelectValue placeholder="Select warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockWarehouses.map((w) => (
                        <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="to">To Warehouse *</Label>
                  <Select value={toWarehouse} onValueChange={setToWarehouse}>
                    <SelectTrigger id="to" className="mt-2">
                      <SelectValue placeholder="Select warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockWarehouses.filter(w => w.id !== fromWarehouse).map((w) => (
                        <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </FormCard>

            <FormCard title="Items to Transfer">
              <div className="space-y-4">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <Card className="p-4 bg-gray-50 dark:bg-gray-800/50">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <Label className="text-xs">Product</Label>
                            <Select
                              value={item.product}
                              onValueChange={(v) => updateItem(item.id, 'product', v)}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select product" />
                              </SelectTrigger>
                              <SelectContent>
                                {mockProducts.map((p) => (
                                  <SelectItem key={p.id} value={p.id}>
                                    {p.name} (Stock: {p.stock})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex gap-2">
                            <div className="flex-1">
                              <Label className="text-xs">Quantity</Label>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                                placeholder="0"
                                className="mt-1"
                                min="1"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="mt-6 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <Button
                  type="button"
                  variant="outline"
                  onClick={addItem}
                  className="w-full border-dashed"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </FormCard>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => router.push('/inventory/transfers/list')}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-emerald-600 to-teal-600">
                <Save className="h-4 w-4 mr-2" />
                Create Transfer
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
