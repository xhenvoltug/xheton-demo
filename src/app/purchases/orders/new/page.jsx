'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Plus, Trash2, FileText, Loader2 } from 'lucide-react';

const poSchema = z.object({
  supplier: z.string().min(1, 'Supplier is required'),
  deliveryDate: z.string().min(1, 'Expected delivery date is required'),
  discount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid discount').optional().or(z.literal('')),
  tax: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid tax').optional().or(z.literal('')),
  notes: z.string().optional()
});

export default function NewPurchaseOrderPage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(poSchema)
  });

  // Fetch suppliers and products for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suppliersRes, productsRes] = await Promise.all([
          fetch('/api/purchases/suppliers/list'),
          fetch('/api/inventory/products/list')
        ]);
        
        if (suppliersRes.ok) {
          const suppData = await suppliersRes.json();
          setSuppliers(suppData.data || []);
        }
        if (productsRes.ok) {
          const prodData = await productsRes.json();
          setProducts(prodData.data || []);
        }
      } catch (err) {
        console.error('Failed to load dropdown data:', err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const [items, setItems] = useState([
    { product: '', quantity: '', unitCost: '', total: 0 }
  ]);

  const addItem = () => {
    setItems([...items, { product: '', quantity: '', unitCost: '', total: 0 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    
    if (field === 'quantity' || field === 'unitCost') {
      const qty = parseFloat(newItems[index].quantity) || 0;
      const cost = parseFloat(newItems[index].unitCost) || 0;
      newItems[index].total = qty * cost;
    }
    
    setItems(newItems);
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const discount = 0;
  const tax = subtotal * 0.16;
  const grandTotal = subtotal - discount + tax;

  const onSubmit = (data) => {
    const poData = {
      ...data,
      items,
      subtotal,
      discount,
      tax,
      grandTotal
    };
    console.log('PO Data:', poData);
    alert('Purchase Order created successfully!');
    router.push('/purchases/orders');
  };

  const saveDraft = () => {
    alert('Saved as draft!');
  };

  const generatePDF = () => {
    alert('PDF generated!');
  };

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="New Purchase Order"
          subtitle="Create a new purchase order"
        />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="rounded-3xl shadow-lg border-0">
                  <CardHeader>
                    <CardTitle>Order Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="supplier">Supplier *</Label>
                        <select
                          {...register('supplier')}
                          className="w-full rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select supplier</option>
                          {mockSuppliers.map((supplier) => (
                            <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                          ))}
                        </select>
                        {errors.supplier && <p className="text-red-600 text-sm mt-1">{errors.supplier.message}</p>}
                      </div>

                      <div>
                        <Label htmlFor="deliveryDate">Expected Delivery Date *</Label>
                        <Input
                          {...register('deliveryDate')}
                          type="date"
                          className="rounded-2xl"
                        />
                        {errors.deliveryDate && <p className="text-red-600 text-sm mt-1">{errors.deliveryDate.message}</p>}
                      </div>
                    </div>

                    <div>
                      <Label>Notes</Label>
                      <Textarea
                        {...register('notes')}
                        placeholder="Additional notes..."
                        className="rounded-2xl min-h-[80px]"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="rounded-3xl shadow-lg border-0">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Order Items</CardTitle>
                    <Button type="button" onClick={addItem} size="sm" className="rounded-xl">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {items.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 gap-3 items-end p-4 rounded-2xl bg-gray-50 dark:bg-gray-800">
                          <div className="col-span-4">
                            <Label className="text-xs">Product</Label>
                            <select
                              value={item.product}
                              onChange={(e) => {
                                updateItem(index, 'product', e.target.value);
                                const product = mockProducts.find(p => p.id === e.target.value);
                                if (product) updateItem(index, 'unitCost', product.lastCost);
                              }}
                              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                            >
                              <option value="">Select product</option>
                              {mockProducts.map((product) => (
                                <option key={product.id} value={product.id}>{product.name}</option>
                              ))}
                            </select>
                          </div>

                          <div className="col-span-2">
                            <Label className="text-xs">Quantity</Label>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                              placeholder="0"
                              className="rounded-xl"
                            />
                          </div>

                          <div className="col-span-2">
                            <Label className="text-xs">Unit Cost</Label>
                            <Input
                              type="number"
                              value={item.unitCost}
                              onChange={(e) => updateItem(index, 'unitCost', e.target.value)}
                              placeholder="0.00"
                              className="rounded-xl"
                            />
                          </div>

                          <div className="col-span-3">
                            <Label className="text-xs">Total</Label>
                            <div className="font-bold text-lg text-gray-900 dark:text-white">
                              UGX {item.total.toLocaleString()}
                            </div>
                          </div>

                          <div className="col-span-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="rounded-3xl shadow-lg border-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                      <span className="font-semibold">UGX {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Discount</span>
                      <span className="font-semibold text-emerald-600">- UGX {discount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tax (16%)</span>
                      <span className="font-semibold">UGX {tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t">
                      <span className="font-bold text-gray-900 dark:text-white">Grand Total</span>
                      <span className="font-bold text-2xl text-blue-600">UGX {grandTotal.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="rounded-3xl shadow-lg border-0">
                  <CardContent className="p-6 space-y-3">
                    <Button
                      type="submit"
                      className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-6 text-lg font-semibold"
                    >
                      Send to Supplier
                    </Button>
                    <Button
                      type="button"
                      onClick={saveDraft}
                      variant="outline"
                      className="w-full rounded-2xl"
                    >
                      Save as Draft
                    </Button>
                    <Button
                      type="button"
                      onClick={generatePDF}
                      variant="outline"
                      className="w-full rounded-2xl"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Generate PDF
                    </Button>
                    <Button
                      type="button"
                      onClick={() => router.push('/purchases/orders')}
                      variant="outline"
                      className="w-full rounded-2xl"
                    >
                      Cancel
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
