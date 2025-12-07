'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Minus, Plus, Trash2, CreditCard, DollarSign, User, 
  Smartphone, Banknote, Percent, Receipt, Settings, Maximize2,
  Grid3x3, List, Barcode, X, Check
} from 'lucide-react';

const categories = [
  { id: 'all', name: 'All Products', count: 124 },
  { id: 'electronics', name: 'Electronics', count: 45 },
  { id: 'furniture', name: 'Furniture', count: 28 },
  { id: 'clothing', name: 'Clothing', count: 31 },
  { id: 'books', name: 'Books', count: 20 }
];

const products = [
  { id: 1, name: 'Laptop Dell XPS 15', price: 125000, stock: 12, barcode: 'LPT-001', category: 'electronics', image: '💻' },
  { id: 2, name: 'iPhone 15 Pro Max', price: 165000, stock: 8, barcode: 'PHN-001', category: 'electronics', image: '📱' },
  { id: 3, name: 'Samsung 55" TV', price: 85000, stock: 15, barcode: 'TV-001', category: 'electronics', image: '📺' },
  { id: 4, name: 'Office Chair Executive', price: 28000, stock: 24, barcode: 'FRN-001', category: 'furniture', image: '🪑' },
  { id: 5, name: 'Standing Desk', price: 45000, stock: 10, barcode: 'FRN-002', category: 'furniture', image: '🪑' },
  { id: 6, name: 'Wireless Mouse Logitech', price: 3500, stock: 56, barcode: 'ELC-001', category: 'electronics', image: '🖱️' },
  { id: 7, name: 'Mechanical Keyboard', price: 12000, stock: 34, barcode: 'ELC-002', category: 'electronics', image: '⌨️' },
  { id: 8, name: 'Men Formal Shirt', price: 2500, stock: 78, barcode: 'CLT-001', category: 'clothing', image: '👔' },
  { id: 9, name: 'Women Dress', price: 4200, stock: 45, barcode: 'CLT-002', category: 'clothing', image: '👗' },
  { id: 10, name: 'Business Book Collection', price: 8500, stock: 22, barcode: 'BK-001', category: 'books', image: '📚' },
  { id: 11, name: 'HP Printer LaserJet', price: 35000, stock: 9, barcode: 'ELC-003', category: 'electronics', image: '🖨️' },
  { id: 12, name: 'Bookshelf Wooden', price: 18000, stock: 14, barcode: 'FRN-003', category: 'furniture', image: '📚' }
];


export default function POSPage() {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [customer, setCustomer] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [viewMode, setViewMode] = useState('grid');
  const [showSettings, setShowSettings] = useState(false);

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, change) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + change);
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setCustomer(null);
    setDiscount(0);
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = subtotal * (discount / 100);
  const afterDiscount = subtotal - discountAmount;
  const tax = afterDiscount * 0.16; // 16% VAT
  const total = afterDiscount + tax;

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.barcode.includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCheckout = () => {
    // Checkout logic here
    alert(`Payment of UGX ${total.toFixed(2)} received via ${paymentMethod}`);
    clearCart();
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-120px)]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Left Panel - Cart & Checkout */}
          <div className="lg:col-span-1 space-y-4 flex flex-col">
            {/* Customer Section */}
            <Card className="rounded-3xl shadow-lg border-0 flex-shrink-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  {customer ? (
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white">{customer.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{customer.phone}</p>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="flex-1 rounded-2xl"
                      onClick={() => setCustomer({ name: 'Walk-in Customer', phone: 'N/A' })}
                    >
                      Add Customer
                    </Button>
                  )}
                  {customer && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setCustomer(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Cart Items */}
            <Card className="rounded-3xl shadow-lg border-0 flex-1 flex flex-col overflow-hidden">
              <CardHeader className="flex-shrink-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Cart ({cart.length})</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-white hover:bg-white/20"
                    onClick={clearCart}
                    disabled={cart.length === 0}
                  >
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4">
                <AnimatePresence>
                  {cart.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12 text-gray-400"
                    >
                      <p className="text-lg">Cart is empty</p>
                      <p className="text-sm mt-2">Scan or select items to begin</p>
                    </motion.div>
                  ) : (
                    <div className="space-y-2">
                      {cart.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                UGX {item.price.toLocaleString()} × {item.quantity}
                              </p>
                            </div>
                            <p className="font-bold text-emerald-600 dark:text-emerald-400">
                              UGX {(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-7 w-7 rounded-lg"
                                onClick={() => updateQuantity(item.id, -1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center font-semibold text-sm">
                                {item.quantity}
                              </span>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-7 w-7 rounded-lg"
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </CardContent>

              {/* Totals & Checkout */}
              <div className="flex-shrink-0 border-t p-4 bg-gray-50 dark:bg-gray-900 rounded-b-3xl space-y-3">
                {/* Discount Input */}
                <div className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-gray-600" />
                  <Input 
                    type="number"
                    placeholder="Discount %"
                    value={discount || ''}
                    onChange={(e) => setDiscount(Math.max(0, Math.min(100, Number(e.target.value))))}
                    className="h-9 rounded-xl"
                    disabled={cart.length === 0}
                  />
                </div>

                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal:</span>
                    <span>UGX {subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount ({discount}%):</span>
                      <span>-UGX {discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Tax (16%):</span>
                    <span>UGX {tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-2xl font-bold text-gray-900 dark:text-white pt-2 border-t">
                    <span>Total:</span>
                    <span className="text-emerald-600">UGX {total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'cash', label: 'Cash', icon: Banknote },
                    { id: 'mpesa', label: 'M-Pesa', icon: Smartphone },
                    { id: 'card', label: 'Card', icon: CreditCard },
                    { id: 'split', label: 'Split', icon: DollarSign }
                  ].map((method) => (
                    <Button
                      key={method.id}
                      variant={paymentMethod === method.id ? 'default' : 'outline'}
                      className={`h-16 flex flex-col gap-1 rounded-2xl ${
                        paymentMethod === method.id 
                          ? 'bg-emerald-600 hover:bg-emerald-700' 
                          : ''
                      }`}
                      onClick={() => setPaymentMethod(method.id)}
                      disabled={cart.length === 0}
                    >
                      <method.icon className="h-5 w-5" />
                      <span className="text-xs">{method.label}</span>
                    </Button>
                  ))}
                </div>

                {/* Checkout Button */}
                <Button 
                  className="w-full h-14 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-lg shadow-lg rounded-2xl"
                  disabled={cart.length === 0}
                  onClick={handleCheckout}
                >
                  <Check className="mr-2 h-6 w-6" />
                  Complete Sale - UGX {total.toLocaleString()}
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full h-10 rounded-2xl"
                  disabled={cart.length === 0}
                >
                  <Receipt className="mr-2 h-4 w-4" />
                  Hold & Print Receipt
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Panel - Products */}
          <div className="lg:col-span-2 space-y-4 flex flex-col h-full">
            {/* Search & Controls */}
            <Card className="rounded-3xl shadow-lg border-0 flex-shrink-0">
              <CardContent className="p-4 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Barcode className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input 
                    placeholder="Scan barcode or search products..." 
                    className="pl-12 pr-20 h-14 text-lg rounded-2xl border-2 focus:border-emerald-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="icon"
                      className="h-10 w-10 rounded-xl"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid3x3 className="h-5 w-5" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="icon"
                      className="h-10 w-10 rounded-xl"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Category Tabs */}
                <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                  <TabsList className="w-full justify-start rounded-2xl bg-gray-100 dark:bg-gray-800 p-1">
                    {categories.map((cat) => (
                      <TabsTrigger 
                        key={cat.id} 
                        value={cat.id}
                        className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow"
                      >
                        {cat.name}
                        <Badge variant="secondary" className="ml-2">{cat.count}</Badge>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>

            {/* Products Grid/List */}
            <Card className="rounded-3xl shadow-lg border-0 flex-1 overflow-hidden">
              <CardContent className="p-4 h-full overflow-y-auto">
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Card 
                          className="cursor-pointer hover:shadow-xl transition-all border-2 hover:border-emerald-500 rounded-2xl overflow-hidden"
                          onClick={() => addToCart(product)}
                        >
                          <CardContent className="p-4">
                            <div className="aspect-square bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 rounded-xl mb-3 flex items-center justify-center">
                              <span className="text-5xl">{product.image}</span>
                            </div>
                            <Badge variant="secondary" className="mb-2 text-xs">
                              {product.barcode}
                            </Badge>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm line-clamp-2">
                              {product.name}
                            </h3>
                            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                              UGX {product.price.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              Stock: {product.stock}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <Card 
                          className="cursor-pointer hover:shadow-lg transition-all border hover:border-emerald-500 rounded-2xl"
                          onClick={() => addToCart(product)}
                        >
                          <CardContent className="p-4 flex items-center gap-4">
                            <div className="h-16 w-16 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 rounded-xl flex items-center justify-center flex-shrink-0">
                              <span className="text-3xl">{product.image}</span>
                            </div>
                            <div className="flex-1">
                              <Badge variant="secondary" className="mb-1 text-xs">
                                {product.barcode}
                              </Badge>
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {product.name}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Stock: {product.stock} units
                              </p>
                            </div>
                            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                              UGX {product.price.toLocaleString()}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
