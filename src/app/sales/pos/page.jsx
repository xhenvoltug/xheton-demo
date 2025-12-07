'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, Banknote, Smartphone, Receipt } from 'lucide-react';
import toast from 'react-hot-toast';

const categories = ['All', 'Electronics', 'Accessories', 'Office', 'Furniture'];

const mockProducts = [
  { id: 'P001', name: 'Laptop Pro 15"', price: 1299.99, category: 'Electronics', image: '💻', stock: 45 },
  { id: 'P002', name: 'Wireless Mouse', price: 29.99, category: 'Accessories', image: '🖱️', stock: 120 },
  { id: 'P003', name: 'USB-C Cable', price: 15.99, category: 'Accessories', image: '🔌', stock: 200 },
  { id: 'P004', name: 'Monitor 27"', price: 349.99, category: 'Electronics', image: '🖥️', stock: 30 },
  { id: 'P005', name: 'Keyboard Mechanical', price: 89.99, category: 'Accessories', image: '⌨️', stock: 67 },
  { id: 'P006', name: 'Office Chair', price: 249.99, category: 'Furniture', image: '🪑', stock: 15 },
  { id: 'P007', name: 'Desk Lamp', price: 45.99, category: 'Office', image: '💡', stock: 80 },
  { id: 'P008', name: 'Notebook Set', price: 12.99, category: 'Office', image: '📓', stock: 150 },
];

export default function POSPage() {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [amountReceived, setAmountReceived] = useState('');

  const filteredProducts = mockProducts.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      updateQuantity(product.id, existing.quantity + 1);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    toast.success(`${product.name} added to cart`);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCart(cart.map(item =>
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePayment = () => {
    if (!paymentMethod) {
      toast.error('Please select payment method');
      return;
    }
    
    const received = parseFloat(amountReceived) || 0;
    if (paymentMethod === 'cash' && received < total) {
      toast.error('Insufficient amount received');
      return;
    }

    toast.success('Payment successful! Receipt printed.');
    setCart([]);
    setShowPaymentModal(false);
    setPaymentMethod('');
    setAmountReceived('');
  };

  const change = (parseFloat(amountReceived) || 0) - total;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 -m-6 p-4 lg:p-6">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 h-[calc(100vh-120px)]">
            {/* Left Side - Products */}
            <div className="lg:col-span-2 flex flex-col space-y-4">
              {/* Search Bar */}
              <Card className="p-4 bg-white dark:bg-gray-900 shadow-lg">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-11 h-12 text-lg"
                  />
                </div>
              </Card>

              {/* Category Filter */}
              <Card className="p-4 bg-white dark:bg-gray-900 shadow-lg">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      onClick={() => setSelectedCategory(category)}
                      className={`flex-shrink-0 ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600'
                          : ''
                      }`}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </Card>

              {/* Products Grid */}
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Card
                        onClick={() => addToCart(product)}
                        className="p-4 lg:p-6 cursor-pointer hover:shadow-xl transition-all bg-white dark:bg-gray-900 border-2 border-transparent hover:border-emerald-500"
                      >
                        <div className="text-center space-y-3">
                          <div className="text-5xl lg:text-6xl">
                            {product.image}
                          </div>
                          <div>
                            <p className="font-semibold text-sm lg:text-base text-gray-900 dark:text-white line-clamp-2">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Stock: {product.stock}
                            </p>
                          </div>
                          <p className="text-xl lg:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            ${product.price}
                          </p>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Cart */}
            <div className="lg:col-span-1">
              <Card className="h-full flex flex-col bg-white dark:bg-gray-900 shadow-xl">
                {/* Cart Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                      <ShoppingCart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Current Order
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {cart.length} items
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <AnimatePresence>
                    {cart.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500"
                      >
                        <ShoppingCart className="h-16 w-16 mb-4" />
                        <p className="text-lg">Cart is empty</p>
                        <p className="text-sm">Add items to get started</p>
                      </motion.div>
                    ) : (
                      cart.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                        >
                          <Card className="p-4 bg-gray-50 dark:bg-gray-800/50">
                            <div className="flex items-start gap-3">
                              <div className="text-3xl flex-shrink-0">
                                {item.image}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                  {item.name}
                                </p>
                                <p className="text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                                  ${item.price}
                                </p>
                                
                                <div className="flex items-center gap-2 mt-3">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-8 text-center font-semibold">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFromCart(item.id)}
                                    className="ml-auto text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-gray-900 dark:text-white">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>

                {/* Cart Footer */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-800 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Tax (10%)</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-2xl font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                      <span>Total</span>
                      <span className="text-emerald-600 dark:text-emerald-400">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    disabled={cart.length === 0}
                    className="w-full h-14 text-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    size="lg"
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    Checkout
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl">Complete Payment</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Total */}
              <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl">
                <p className="text-gray-600 dark:text-gray-400 mb-2">Total Amount</p>
                <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                  ${total.toFixed(2)}
                </p>
              </div>

              {/* Payment Method */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('cash')}
                    className={`h-20 flex-col gap-2 ${
                      paymentMethod === 'cash'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600'
                        : ''
                    }`}
                  >
                    <Banknote className="h-6 w-6" />
                    <span>Cash</span>
                  </Button>
                  <Button
                    variant={paymentMethod === 'card' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('card')}
                    className={`h-20 flex-col gap-2 ${
                      paymentMethod === 'card'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600'
                        : ''
                    }`}
                  >
                    <CreditCard className="h-6 w-6" />
                    <span>Card</span>
                  </Button>
                  <Button
                    variant={paymentMethod === 'mobile' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('mobile')}
                    className={`h-20 flex-col gap-2 ${
                      paymentMethod === 'mobile'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600'
                        : ''
                    }`}
                  >
                    <Smartphone className="h-6 w-6" />
                    <span>Mobile</span>
                  </Button>
                  <Button
                    variant={paymentMethod === 'split' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('split')}
                    className={`h-20 flex-col gap-2 ${
                      paymentMethod === 'split'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600'
                        : ''
                    }`}
                  >
                    <Receipt className="h-6 w-6" />
                    <span>Split</span>
                  </Button>
                </div>
              </div>

              {/* Amount Received (Cash only) */}
              {paymentMethod === 'cash' && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Amount Received
                  </label>
                  <Input
                    type="number"
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(e.target.value)}
                    placeholder="Enter amount received"
                    className="h-12 text-lg"
                    step="0.01"
                  />
                  {amountReceived && change >= 0 && (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">Change</span>
                        <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                          ${change.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowPaymentModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePayment}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                Complete Payment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
