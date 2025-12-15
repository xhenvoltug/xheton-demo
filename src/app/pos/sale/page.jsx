'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Smartphone,
  DollarSign,
  Receipt,
  Printer,
  Mail,
  Tag,
  Percent,
  ArrowLeft
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import DashboardLayout from '@/components/DashboardLayout'

export default function POSSale() {
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [cartItems, setCartItems] = useState([])
  const [barcodeInput, setBarcodeInput] = useState('')
  const [discountType, setDiscountType] = useState('none')
  const [discountValue, setDiscountValue] = useState(0)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [amountTendered, setAmountTendered] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [processingPayment, setProcessingPayment] = useState(false)
  const [paymentError, setPaymentError] = useState(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  // Fetch products and customers on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, custRes] = await Promise.all([
          fetch('/api/inventory/products/list'),
          fetch('/api/sales/customers')
        ]);
        
        const prodData = await prodRes.json();
        const custData = await custRes.json();
        
        if (prodData.success) setProducts(prodData.products || []);
        if (custData.success) setCustomers(custData.customers || []);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchData();
  }, []);

  const addToCart = (product) => {
    // Validate stock before adding to cart
    if (product.current_stock <= 0) {
      alert(`⚠️ "${product.product_name}" is out of stock!`);
      return;
    }

    const existing = cartItems.find(item => item.id === product.id)
    if (existing) {
      const newQty = existing.quantity + 1;
      if (newQty > product.current_stock) {
        alert(`⚠️ Only ${product.current_stock} units available for "${product.product_name}"`);
        return;
      }
      setCartItems(cartItems.map(item =>
        item.id === product.id ? { ...item, quantity: newQty } : item
      ))
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1, product_id: product.id }])
    }
  }

  const updateQuantity = (id, newQty) => {
    const product = products.find(p => p.id === id);
    if (newQty > 0 && newQty > (product?.current_stock || 0)) {
      alert(`⚠️ Only ${product?.current_stock || 0} units available`);
      return;
    }
    if (newQty === 0) {
      setCartItems(cartItems.filter(item => item.id !== id))
    } else {
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, quantity: newQty } : item
      ))
    }
  }

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + ((item.selling_price || item.price || 0) * item.quantity), 0)
  const discountAmount = discountType === 'percentage'
    ? (subtotal * discountValue / 100)
    : discountType === 'fixed'
    ? discountValue
    : 0
  const taxRate = 0.18 // 18% VAT (Uganda standard)
  const taxAmount = (subtotal - discountAmount) * taxRate
  const grandTotal = subtotal - discountAmount + taxAmount
  const changeAmount = amountTendered ? parseFloat(amountTendered) - grandTotal : 0

  const handleBarcodeSubmit = (e) => {
    e.preventDefault()
    if (!barcodeInput) return;
    
    const product = products.find(p => 
      p.barcode === barcodeInput || 
      p.product_code === barcodeInput || 
      (p.id === barcodeInput)
    )
    if (product) {
      addToCart(product)
      setBarcodeInput('')
    } else {
      alert('Product not found');
      setBarcodeInput('');
    }
  }

  // Process checkout - CRITICAL: calls API with stock validation
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert('Cart is empty!');
      return;
    }

    if (!selectedCustomer) {
      alert('Please select a customer');
      return;
    }

    setProcessingPayment(true);
    setPaymentError(null);

    try {
      const response = await fetch('/api/sales/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: selectedCustomer,
          warehouse_id: 'default-warehouse', // You may need to set this dynamically
          items: cartItems.map(item => ({
            product_id: item.id || item.product_id,
            quantity: item.quantity
          }))
        })
      });

      const data = await response.json();

      if (response.status === 409) {
        // Stock validation error
        setPaymentError(data.error || 'Insufficient stock for some items');
        setProcessingPayment(false);
        return;
      }

      if (response.ok && data.success) {
        setPaymentSuccess(true);
        setCartItems([]);
        setTimeout(() => {
          router.push(`/pos/receipt?invoice_id=${data.invoice?.id}`);
        }, 2000);
      } else {
        setPaymentError(data.error || 'Payment processing failed');
        setProcessingPayment(false);
      }
    } catch (err) {
      setPaymentError(err.message);
      setProcessingPayment(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">New Sale</h1>
              <p className="text-gray-600">Scan items or search by SKU/Barcode</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Product Search & Cart */}
          <div className="lg:col-span-2 space-y-6">
            {/* Barcode/SKU Search */}
            <Card className="p-6 rounded-3xl">
              <form onSubmit={handleBarcodeSubmit} className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    placeholder="Scan barcode or enter SKU..."
                    className="pl-10 rounded-xl h-12 text-lg"
                    autoFocus
                  />
                </div>
                <Button type="submit" size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600">
                  Add
                </Button>
              </form>
            </Card>

            {/* Quick Product Buttons */}
            <Card className="p-6 rounded-3xl">
              <h3 className="font-semibold mb-4">Quick Add Products (Stock Available)</h3>
              {loadingProducts ? (
                <div className="text-center py-6 text-gray-500">Loading products...</div>
              ) : products.filter(p => p.current_stock > 0).length === 0 ? (
                <div className="text-center py-6 text-gray-500">No products in stock</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {products.filter(p => p.current_stock > 0).slice(0, 6).map((product) => (
                    <button
                      key={product.id}
                      onClick={() => addToCart(product)}
                      className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-cyan-50 rounded-2xl text-left transition-all border-2 border-transparent hover:border-blue-300"
                    >
                      <p className="font-semibold text-sm line-clamp-2">{product.product_name}</p>
                      <p className="text-lg font-bold text-blue-600 mt-1">UGX {(product.selling_price || 0).toLocaleString()}</p>
                      <p className="text-xs text-gray-500 mt-1">Stock: {product.current_stock}</p>
                    </button>
                  ))}
                </div>
              )}
            </Card>

            {/* Cart Items */}
            <Card className="p-6 rounded-3xl">
              <h3 className="font-semibold mb-4">Cart Items ({cartItems.length})</h3>
              {cartItems.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Tag className="w-16 h-16 mx-auto mb-3 opacity-50" />
                  <p>No items in cart</p>
                  <p className="text-sm mt-1">Scan or add products to start</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl"
                    >
                      <div className="flex-1">
                        <p className="font-semibold">{item.product_name}</p>
                        <p className="text-sm text-gray-600">UGX {(item.selling_price || item.price || 0).toLocaleString()} each</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white rounded-xl p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="w-24 text-right">
                          <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Right: Checkout Summary */}
          <div className="space-y-6">
            {/* Discount */}
            <Card className="p-6 rounded-3xl">
              <div className="flex items-center gap-2 mb-4">
                <Percent className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold">Discount</h3>
              </div>
              <div className="space-y-3">
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl"
                >
                  <option value="none">No Discount</option>
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
                {discountType !== 'none' && (
                  <Input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                    placeholder={discountType === 'percentage' ? 'Enter %' : 'Enter $'}
                    className="rounded-xl"
                  />
                )}
              </div>
            </Card>

            {/* Total Summary */}
            <Card className="p-6 rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-50">
              <h3 className="font-semibold mb-4">Total Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-semibold text-red-600">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (16%)</span>
                  <span className="font-semibold">${taxAmount.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-bold text-lg">Grand Total</span>
                  <span className="font-bold text-2xl text-blue-600">${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </Card>

            {/* Payment Methods */}
            <Card className="p-6 rounded-3xl">
              <h3 className="font-semibold mb-4">Payment Method</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => { setPaymentMethod('cash'); setShowPaymentModal(true); }}
                  disabled={cartItems.length === 0}
                  className="p-4 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <DollarSign className="w-6 h-6 mx-auto mb-1" />
                  <p className="text-sm font-medium">Cash</p>
                </button>
                <button
                  onClick={() => { setPaymentMethod('card'); setShowPaymentModal(true); }}
                  disabled={cartItems.length === 0}
                  className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <CreditCard className="w-6 h-6 mx-auto mb-1" />
                  <p className="text-sm font-medium">Card</p>
                </button>
                <button
                  onClick={() => { setPaymentMethod('mobile'); setShowPaymentModal(true); }}
                  disabled={cartItems.length === 0}
                  className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Smartphone className="w-6 h-6 mx-auto mb-1" />
                  <p className="text-sm font-medium">Mobile</p>
                </button>
                <button
                  disabled={cartItems.length === 0}
                  className="p-4 bg-gradient-to-br from-yellow-500 to-amber-500 text-white rounded-2xl hover:from-yellow-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Receipt className="w-6 h-6 mx-auto mb-1" />
                  <p className="text-sm font-medium">Voucher</p>
                </button>
              </div>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setCartItems([])}
                disabled={cartItems.length === 0}
              >
                Clear Cart
              </Button>
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold mb-4">Complete Payment</h3>
              
              <div className="bg-blue-50 p-4 rounded-2xl mb-6">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-4xl font-bold text-blue-600">${grandTotal.toFixed(2)}</p>
              </div>

              {paymentMethod === 'cash' && (
                <div className="space-y-4">
                  <div>
                    <Label>Amount Tendered</Label>
                    <Input
                      type="number"
                      value={amountTendered}
                      onChange={(e) => setAmountTendered(e.target.value)}
                      placeholder="0.00"
                      className="mt-2 rounded-xl text-xl h-14"
                      autoFocus
                    />
                  </div>
                  {changeAmount > 0 && (
                    <div className="bg-green-50 p-4 rounded-2xl">
                      <p className="text-sm text-gray-600">Change</p>
                      <p className="text-3xl font-bold text-green-600">${changeAmount.toFixed(2)}</p>
                    </div>
                  )}
                  {changeAmount < 0 && amountTendered && (
                    <div className="bg-red-50 p-4 rounded-2xl">
                      <p className="text-sm text-red-600">Insufficient amount</p>
                    </div>
                  )}
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="text-center py-8">
                  <CreditCard className="w-16 h-16 mx-auto text-blue-600 mb-4" />
                  <p className="font-semibold">Insert or tap card</p>
                  <p className="text-sm text-gray-500 mt-1">Waiting for card reader...</p>
                </div>
              )}

              {paymentMethod === 'mobile' && (
                <div className="text-center py-8">
                  <Smartphone className="w-16 h-16 mx-auto text-purple-600 mb-4" />
                  <p className="font-semibold">Send payment to:</p>
                  <p className="text-2xl font-mono font-bold mt-2">+254 712 345 678</p>
                </div>
              )}

              <div className="space-y-3 mt-6">
                <Button
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 h-12"
                  disabled={paymentMethod === 'cash' && changeAmount < 0}
                  onClick={() => {
                    setShowPaymentModal(false)
                    setCartItems([])
                    setAmountTendered('')
                  }}
                >
                  <Receipt className="w-5 h-5 mr-2" />
                  Complete Sale
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline">
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                  <Button variant="outline">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                </div>
                <Button variant="ghost" className="w-full" onClick={() => setShowPaymentModal(false)}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
