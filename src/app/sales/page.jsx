'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, FileText, Eye, Download } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const salesData = [
  { id: 'INV-001', customer: 'John Doe', date: '2025-12-06', amount: 1250.00, status: 'Paid', items: 5 },
  { id: 'INV-002', customer: 'Jane Smith', date: '2025-12-05', amount: 890.50, status: 'Pending', items: 3 },
  { id: 'INV-003', customer: 'Bob Johnson', date: '2025-12-05', amount: 2340.00, status: 'Paid', items: 12 },
  { id: 'INV-004', customer: 'Alice Williams', date: '2025-12-04', amount: 567.99, status: 'Overdue', items: 2 },
  { id: 'INV-005', customer: 'Charlie Brown', date: '2025-12-04', amount: 1890.00, status: 'Paid', items: 8 },
];

export default function SalesPage() {
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
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg">
            <Plus className="mr-2 h-4 w-4" />
            New Sale
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Sales', value: 'UGX 45,231', change: '+12.5%', color: 'emerald' },
            { label: 'This Month', value: 'UGX 12,450', change: '+8.3%', color: 'blue' },
            { label: 'Pending', value: 'UGX 3,890', change: '-2.1%', color: 'amber' },
            { label: 'Overdue', value: 'UGX 1,234', change: '-15.2%', color: 'red' },
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
                    <Input placeholder="Search sales..." className="pl-9 w-full sm:w-64" />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-semibold">Invoice ID</TableHead>
                    <TableHead className="font-semibold">Customer</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Items</TableHead>
                    <TableHead className="font-semibold">Amount</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesData.map((sale) => (
                    <TableRow key={sale.id} className="xheton-table-row">
                      <TableCell className="font-medium">{sale.id}</TableCell>
                      <TableCell>{sale.customer}</TableCell>
                      <TableCell>{sale.date}</TableCell>
                      <TableCell>{sale.items}</TableCell>
                      <TableCell className="font-semibold">${sale.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            sale.status === 'Paid' 
                              ? 'border-emerald-500 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950' 
                              : sale.status === 'Pending'
                              ? 'border-amber-500 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950'
                              : 'border-red-500 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950'
                          }
                        >
                          {sale.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
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
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
