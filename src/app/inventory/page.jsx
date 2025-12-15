'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Package, AlertTriangle, TrendingDown, Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function InventoryPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/inventory/products/list');
        if (!response.ok) throw new Error('Failed to load inventory');
        const data = await response.json();
        setProducts(data.data || []);
        
        // Calculate stats from data
        if (Array.isArray(data.data) && data.data.length > 0) {
          const lowStock = data.data.filter(p => p.quantity && p.min_stock && p.quantity < p.min_stock).length;
          const outOfStock = data.data.filter(p => !p.quantity || p.quantity === 0).length;
          setStats({
            totalItems: data.data.length,
            lowStock,
            outOfStock,
          });
        } else {
          setStats({ totalItems: 0, lowStock: 0, outOfStock: 0 });
        }
      } catch (err) {
        setError(err.message);
        setStats({ totalItems: 0, lowStock: 0, outOfStock: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const filteredProducts = products.filter(p =>
    (p.product_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.sku || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (quantity, minStock) => {
    if (!quantity || quantity === 0) return { label: 'Out of Stock', color: 'red' };
    if (minStock && quantity < minStock) return { label: 'Low Stock', color: 'amber' };
    return { label: 'In Stock', color: 'emerald' };
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Inventory Management
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Track stock levels, manage items, and optimize inventory
            </p>
          </div>
          <Button onClick={() => router.push('/inventory/products/new')} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg">
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
          ) : stats ? (
            [
              { label: 'Total Items', value: stats.totalItems.toString(), icon: Package, color: 'emerald' },
              { label: 'Categories', value: '—', icon: Package, color: 'blue' },
              { label: 'Low Stock', value: stats.lowStock.toString(), icon: AlertTriangle, color: 'amber' },
              { label: 'Out of Stock', value: stats.outOfStock.toString(), icon: TrendingDown, color: 'red' },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardDescription className="text-sm">{stat.label}</CardDescription>
                      <Icon className={`h-5 w-5 text-${stat.color}-600`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          ) : null}
        </div>

        {/* Inventory Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-xl font-bold">Stock Items</CardTitle>
                  <CardDescription>Monitor and manage your inventory</CardDescription>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search items..." 
                      className="pl-9 w-full sm:w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-600">{error}</div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 text-lg">No items found</p>
                  <p className="text-gray-500 text-sm mb-6">Get started by adding your first inventory item</p>
                  <Button onClick={() => router.push('/inventory/products/new')} className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-semibold">SKU</TableHead>
                      <TableHead className="font-semibold">Product Name</TableHead>
                      <TableHead className="font-semibold">Quantity</TableHead>
                      <TableHead className="font-semibold">Min Stock</TableHead>
                      <TableHead className="font-semibold">Price</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => {
                      const status = getStockStatus(product.quantity, product.min_stock);
                      return (
                        <TableRow key={product.id} className="xheton-table-row cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900" onClick={() => router.push(`/inventory/products/${product.id}`)}>
                          <TableCell className="font-medium">{product.sku}</TableCell>
                          <TableCell className="font-medium">{product.product_name}</TableCell>
                          <TableCell>
                            <span className={product.quantity && product.min_stock && product.quantity < product.min_stock ? 'text-red-600 font-semibold' : ''}>
                              {product.quantity || 0}
                            </span>
                          </TableCell>
                          <TableCell className="text-gray-500">{product.min_stock || 0}</TableCell>
                          <TableCell className="font-semibold">UGX {(product.selling_price || 0).toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline"
                              className={
                                status.color === 'emerald'
                                  ? 'border-emerald-500 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950'
                                  : status.color === 'amber'
                                  ? 'border-amber-500 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950'
                                  : 'border-red-500 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950'
                              }
                            >
                              {status.label}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
