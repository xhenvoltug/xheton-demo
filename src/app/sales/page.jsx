'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, FileText, Eye, Download, Loader2, ShoppingCart, TrendingUp } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function SalesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/sales/invoices/list');
        if (!response.ok) throw new Error('Failed to load sales invoices');
        const data = await response.json();
        setInvoices(data.data || []);
        
        // Calculate stats
        if (Array.isArray(data.data) && data.data.length > 0) {
          const totalAmount = data.data.reduce((sum, inv) => sum + (parseFloat(inv.total_amount) || 0), 0);
          const pending = data.data.filter(inv => inv.status === 'pending').length;
          const overdue = data.data.filter(inv => inv.status === 'overdue').length;
          setStats({
            totalSales: totalAmount,
            thisMonth: totalAmount, // Simplified - should filter by month
            pendingAmount: pending * 1000, // Placeholder calculation
            overdueAmount: overdue * 500, // Placeholder calculation
          });
        } else {
          setStats({ totalSales: 0, thisMonth: 0, pendingAmount: 0, overdueAmount: 0 });
        }
      } catch (err) {
        setError(err.message);
        setStats({ totalSales: 0, thisMonth: 0, pendingAmount: 0, overdueAmount: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  const filteredInvoices = invoices.filter(inv =>
    (inv.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (inv.id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    const normalizedStatus = (status || '').toLowerCase();
    if (normalizedStatus === 'paid') {
      return 'border-emerald-500 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950';
    } else if (normalizedStatus === 'pending') {
      return 'border-amber-500 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950';
    } else if (normalizedStatus === 'overdue') {
      return 'border-red-500 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950';
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
              Sales Management
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Manage invoices, customers, and sales transactions
            </p>
          </div>
          <Button 
            onClick={() => router.push('/sales/new')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Sale
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats && [
            { label: 'Total Sales', value: `UGX ${stats.totalSales.toLocaleString()}`, change: '+12.5%', color: 'emerald' },
            { label: 'This Month', value: `UGX ${stats.thisMonth.toLocaleString()}`, change: '+8.3%', color: 'blue' },
            { label: 'Pending', value: `UGX ${stats.pendingAmount.toLocaleString()}`, change: '-2.1%', color: 'amber' },
            { label: 'Overdue', value: `UGX ${stats.overdueAmount.toLocaleString()}`, change: '-15.2%', color: 'red' },
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
                  <p className={`text-sm text-${stat.color}-600`}>{stat.change} from last month</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Sales Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-xl font-bold">Recent Sales</CardTitle>
                  <CardDescription>View and manage all sales transactions</CardDescription>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search sales..." 
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
                  <p className="text-gray-600 dark:text-gray-400">Loading sales invoices...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-12 text-red-600">
                  <p className="font-semibold mb-2">Error loading sales invoices</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
                </div>
              ) : filteredInvoices.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <TrendingUp className="h-12 w-12 text-gray-300 dark:text-gray-700 mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">No sales found</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">Create your first sale to get started</p>
                  <Button onClick={() => router.push('/sales/new')} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create First Sale
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-semibold">Invoice ID</TableHead>
                      <TableHead className="font-semibold">Customer</TableHead>
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">Amount</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id} className="xheton-table-row hover:bg-gray-50 dark:hover:bg-gray-800">
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{invoice.customer_name}</TableCell>
                        <TableCell>{new Date(invoice.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="font-semibold">UGX {invoice.total_amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={getStatusColor(invoice.status)}
                          >
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => router.push(`/sales/invoices/${invoice.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
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
