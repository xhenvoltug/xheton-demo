'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Package, AlertTriangle, TrendingDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const inventoryData = [
  { id: 'SKU-001', name: 'Wireless Mouse', category: 'Electronics', quantity: 145, minStock: 50, price: 29.99, status: 'In Stock' },
  { id: 'SKU-002', name: 'USB Cable', category: 'Accessories', quantity: 23, minStock: 100, price: 9.99, status: 'Low Stock' },
  { id: 'SKU-003', name: 'Laptop Stand', category: 'Electronics', quantity: 67, minStock: 30, price: 49.99, status: 'In Stock' },
  { id: 'SKU-004', name: 'Keyboard', category: 'Electronics', quantity: 12, minStock: 25, price: 79.99, status: 'Low Stock' },
  { id: 'SKU-005', name: 'Monitor', category: 'Electronics', quantity: 0, minStock: 10, price: 299.99, status: 'Out of Stock' },
];

export default function InventoryPage() {
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
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg">
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Items', value: '12,234', icon: Package, color: 'emerald' },
            { label: 'Categories', value: '45', icon: Package, color: 'blue' },
            { label: 'Low Stock', value: '23', icon: AlertTriangle, color: 'amber' },
            { label: 'Out of Stock', value: '5', icon: TrendingDown, color: 'red' },
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
          })}
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
                    <Input placeholder="Search items..." className="pl-9 w-full sm:w-64" />
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
                    <TableHead className="font-semibold">SKU</TableHead>
                    <TableHead className="font-semibold">Product Name</TableHead>
                    <TableHead className="font-semibold">Category</TableHead>
                    <TableHead className="font-semibold">Quantity</TableHead>
                    <TableHead className="font-semibold">Min Stock</TableHead>
                    <TableHead className="font-semibold">Price</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryData.map((item) => (
                    <TableRow key={item.id} className="xheton-table-row">
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <span className={item.quantity < item.minStock ? 'text-red-600 font-semibold' : ''}>
                          {item.quantity}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-500">{item.minStock}</TableCell>
                      <TableCell className="font-semibold">UGX {item.price.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            item.status === 'In Stock' 
                              ? 'border-emerald-500 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950' 
                              : item.status === 'Low Stock'
                              ? 'border-amber-500 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950'
                              : 'border-red-500 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950'
                          }
                        >
                          {item.status}
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
