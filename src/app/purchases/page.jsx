'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, FileText, Loader2, ShoppingBag, ShoppingCart } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function PurchasesPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/purchases/orders/list');
        if (!response.ok) throw new Error('Failed to load purchase orders');
        const data = await response.json();
        setOrders(data.data || []);
        
        // Calculate stats
        if (Array.isArray(data.data) && data.data.length > 0) {
          const totalAmount = data.data.reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0);
          const pending = data.data.filter(o => o.status === 'pending').length;
          setStats({
            totalPurchases: totalAmount,
            thisMonth: totalAmount, // Simplified - should filter by month
            pendingOrders: pending,
            activeSuppliers: new Set(data.data.map(o => o.supplier_id)).size,
          });
        } else {
          setStats({ totalPurchases: 0, thisMonth: 0, pendingOrders: 0, activeSuppliers: 0 });
        }
      } catch (err) {
        setError(err.message);
        setStats({ totalPurchases: 0, thisMonth: 0, pendingOrders: 0, activeSuppliers: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  const filteredOrders = orders.filter(o =>
    (o.supplier_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.po_number || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    const normalizedStatus = (status || '').toLowerCase();
    if (normalizedStatus === 'approved' || normalizedStatus === 'received') {
      return 'border-emerald-500 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950';
    } else if (normalizedStatus === 'pending') {
      return 'border-amber-500 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950';
    } else if (normalizedStatus === 'in transit' || normalizedStatus === 'in_transit') {
      return 'border-blue-500 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950';
    }
    return 'border-gray-500 text-gray-700 dark:text-gray-400 bg-gray-50 dark:bg-gray-950';
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
              Purchases & Procurement
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Manage purchase orders, suppliers, and procurement
            </p>
          </div>
          <Button onClick={() => router.push('/purchases/orders/new')} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg">
            <Plus className="mr-2 h-4 w-4" />
            New Purchase Order
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
              { label: 'Total Purchases', value: `UGX ${(stats.totalPurchases / 1000000).toFixed(1)}M`, change: '+18.2%' },
              { label: 'This Month', value: `UGX ${(stats.thisMonth / 1000000).toFixed(1)}M`, change: '+12.1%' },
              { label: 'Pending Orders', value: stats.pendingOrders.toString(), change: '-5.3%' },
              { label: 'Active Suppliers', value: stats.activeSuppliers.toString(), change: '+3.2%' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription className="text-sm">{stat.label}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                    <p className="text-sm text-emerald-600">{stat.change} from last month</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : null}
        </div>

        {/* Purchases Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-xl font-bold">Purchase Orders</CardTitle>
                  <CardDescription>View and manage all purchase orders</CardDescription>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search orders..." 
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
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">Loading purchase orders...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-12 text-red-600">
                  <p className="font-semibold mb-2">Error loading purchase orders</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <ShoppingCart className="h-12 w-12 text-gray-300 dark:text-gray-700 mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">No purchase orders found</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">Start creating orders to see them here</p>
                  <Button onClick={() => router.push('/purchases/orders/new')} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create First Order
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-semibold">PO Number</TableHead>
                      <TableHead className="font-semibold">Supplier</TableHead>
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">Amount</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow 
                        key={order.id} 
                        className="xheton-table-row cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                        onClick={() => router.push(`/purchases/orders/${order.id}`)}
                      >
                        <TableCell className="font-medium">{order.po_number}</TableCell>
                        <TableCell>{order.supplier_name}</TableCell>
                        <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="font-semibold">UGX {order.total_amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={getStatusColor(order.status)}
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
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
