'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, FileText } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const purchasesData = [
  { id: 'PO-001', supplier: 'ABC Corp', date: '2025-12-06', items: 15, amount: 3450.00, status: 'Received' },
  { id: 'PO-002', supplier: 'XYZ Ltd', date: '2025-12-05', items: 8, amount: 1890.50, status: 'Pending' },
  { id: 'PO-003', supplier: 'Tech Supplies', date: '2025-12-04', items: 25, amount: 5670.00, status: 'Received' },
  { id: 'PO-004', supplier: 'Global Trading', date: '2025-12-03', items: 12, amount: 2340.00, status: 'In Transit' },
  { id: 'PO-005', supplier: 'ABC Corp', date: '2025-12-02', items: 30, amount: 8920.00, status: 'Received' },
];

export default function PurchasesPage() {
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
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg">
            <Plus className="mr-2 h-4 w-4" />
            New Purchase Order
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Purchases', value: 'UGX 89,540', change: '+18.2%' },
            { label: 'This Month', value: 'UGX 22,270', change: '+12.1%' },
            { label: 'Pending Orders', value: '12', change: '-5.3%' },
            { label: 'Active Suppliers', value: '45', change: '+3.2%' },
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
          ))}
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
                    <Input placeholder="Search orders..." className="pl-9 w-full sm:w-64" />
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
                    <TableHead className="font-semibold">PO Number</TableHead>
                    <TableHead className="font-semibold">Supplier</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Items</TableHead>
                    <TableHead className="font-semibold">Amount</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchasesData.map((purchase) => (
                    <TableRow key={purchase.id} className="xheton-table-row">
                      <TableCell className="font-medium">{purchase.id}</TableCell>
                      <TableCell>{purchase.supplier}</TableCell>
                      <TableCell>{purchase.date}</TableCell>
                      <TableCell>{purchase.items}</TableCell>
                      <TableCell className="font-semibold">${purchase.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            purchase.status === 'Received' 
                              ? 'border-emerald-500 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950' 
                              : purchase.status === 'In Transit'
                              ? 'border-blue-500 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950'
                              : 'border-amber-500 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950'
                          }
                        >
                          {purchase.status}
                        </Badge>
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
