'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import FormCard from '@/components/shared/FormCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Minus, Search, Trash2, Save, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewSalePage() {
  const router = useRouter();
  const [customer, setCustomer] = useState('');
  const [lineItems, setLineItems] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(10);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, customersRes] = await Promise.all([
          fetch('/api/inventory/products/list'),
          fetch('/api/sales/customers/list')
        ]);
        
        if (productsRes.ok) {
          const prodData = await productsRes.json();
          setProducts(prodData.data || []);
        }
        if (customersRes.ok) {
          const custData = await customersRes.json();
          setCustomers(custData.data || []);
        }
      } catch (err) {
        console.error('Failed to load data:', err);
        toast.error('Failed to load products or customers');
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const addLineItem = (product) => {
    const existing = lineItems.find(item => item.productId === product.id);
    if (existing) {
      updateQuantity(existing.id, existing.quantity + 1);
    } else {
      setLineItems([...lineItems, {
        id: Date.now(),
        productId: product.id,
        name: product.product_name || product.name,
        price: product.selling_price || product.price,
        quantity: 1,
        discount: 0,
      }]);
    }
    setProductSearch('');
    setShowProductSearch(false);
    toast.success(`${product.product_name || product.name} added`);
  };

  const removeLineItem = (id) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setLineItems(lineItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const updateLineDiscount = (id, discount) => {
    setLineItems(lineItems.map(item =>
      item.id === id ? { ...item, discount: parseFloat(discount) || 0 } : item
    ));
  };

  const subtotal = lineItems.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity;
    const itemDiscount = (itemTotal * item.discount) / 100;
    return sum + (itemTotal - itemDiscount);
  }, 0);

  const discountAmount = (subtotal * discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * taxRate) / 100;
  const total = taxableAmount + taxAmount;

  const filteredProducts = products.filter(p =>
    (p.product_name || p.name || '').toLowerCase().includes(productSearch.toLowerCase()) ||
    (p.sku || p.id || '').toLowerCase().includes(productSearch.toLowerCase())
  );

  const handleSave = () => {
    if (!customer) {
      toast.error('Please select a customer');
      return;
    }
    if (lineItems.length === 0) {
      toast.error('Please add at least one product');
      return;
    }
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }
    
    toast.success('Sale created successfully!');
    setTimeout(() => router.push('/sales/list'), 1000);
  };

  if (loadingData) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading products and customers...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="New Sale"
          subtitle="Create a new sales invoice"
          actions={[
            <Button
              key="cancel"
              variant="outline"
              onClick={() => router.push('/sales/list')}
              className="gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>,
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Selection */}
              <FormCard title="Customer Information">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="customer">Customer *</Label>
                    <Select value={customer} onValueChange={setCustomer}>
                      <SelectTrigger id="customer" className="mt-2">
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.customer_name || c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </FormCard>

              {/* Product Search & Line Items */}
              <FormCard title="Items">
                {/* Product Search */}
                <div className="relative">
                  <Label>Add Products</Label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search products by name or SKU..."
                      value={productSearch}
                      onChange={(e) => {
                        setProductSearch(e.target.value);
                        setShowProductSearch(true);
                      }}
                      onFocus={() => setShowProductSearch(true)}
                      className="pl-10"
                    />
                  </div>

                  {/* Product Dropdown */}
                  <AnimatePresence>
                    {showProductSearch && productSearch && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-60 overflow-auto"
                      >
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map((product) => (
                            <button
                              key={product.id}
                              onClick={() => addLineItem(product)}
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800 last:border-0 transition-colors"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    {product.product_name || product.name}
                                  </p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {product.sku || product.id} • Stock: {product.quantity || product.stock || 0}
                                  </p>
                                </div>
                                <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                                  UGX {((product.selling_price || product.price || 0) * 1).toLocaleString()}
                                </p>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                            No products found
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Line Items Table */}
                <div className="mt-6 space-y-3">
                  <AnimatePresence>
                    {lineItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      >
                        <Card className="p-4 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {item.name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  ${item.price} each
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeLineItem(item.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                              {/* Quantity */}
                              <div>
                                <Label className="text-xs">Quantity</Label>
                                <div className="flex items-center gap-2 mt-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <Input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                    className="h-8 text-center"
                                    min="1"
                                  />
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>

                              {/* Discount */}
                              <div>
                                <Label className="text-xs">Discount %</Label>
                                <Input
                                  type="number"
                                  value={item.discount}
                                  onChange={(e) => updateLineDiscount(item.id, e.target.value)}
                                  className="h-8 mt-1"
                                  min="0"
                                  max="100"
                                />
                              </div>

                              {/* Line Total */}
                              <div>
                                <Label className="text-xs">Total</Label>
                                <div className="h-8 flex items-center mt-1">
                                  <span className="font-semibold text-gray-900 dark:text-white">
                                    ${((item.price * item.quantity) * (1 - item.discount / 100)).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {lineItems.length === 0 && (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
                      <p>No items added yet</p>
                      <p className="text-sm mt-1">Search and add products above</p>
                    </div>
                  )}
                </div>
              </FormCard>

              {/* Additional Info */}
              <FormCard title="Additional Information">
                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any additional notes or terms..."
                    className="mt-2"
                    rows={4}
                  />
                </div>
              </FormCard>
            </div>

            {/* Sidebar - Totals & Payment */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                {/* Totals Card */}
                <Card className="p-6 bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Order Summary
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Discount %</Label>
                      <Input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                        min="0"
                        max="100"
                        className="h-9"
                      />
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                        <span>Discount ({discount}%)</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label className="text-xs">Tax Rate %</Label>
                      <Input
                        type="number"
                        value={taxRate}
                        onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                        min="0"
                        max="100"
                        className="h-9"
                      />
                    </div>

                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Tax ({taxRate}%)</span>
                      <span className="font-medium">${taxAmount.toFixed(2)}</span>
                    </div>

                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          Total
                        </span>
                        <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Payment Method */}
                <Card className="p-6 bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Payment Method
                  </h3>

                  <div className="space-y-3">
                    <Label>Select Method *</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="mobile">Mobile Money</SelectItem>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                        <SelectItem value="credit">Credit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleSave}
                    className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    size="lg"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Create Sale
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
}
