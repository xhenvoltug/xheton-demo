'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/shared/StatCard';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Package, ShoppingBag, Receipt, TrendingUp, Download } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const salesData = [
  { month: 'Jul', sales: 12400, profit: 4800 },
  { month: 'Aug', sales: 15200, profit: 5900 },
  { month: 'Sep', sales: 18600, profit: 7200 },
  { month: 'Oct', sales: 16800, profit: 6500 },
  { month: 'Nov', sales: 21400, profit: 8300 },
  { month: 'Dec', sales: 25600, profit: 9900 },
];

const categoryData = [
  { name: 'Electronics', value: 45000, color: '#10b981' },
  { name: 'Furniture', value: 28000, color: '#3b82f6' },
  { name: 'Clothing', value: 18000, color: '#f59e0b' },
  { name: 'Books', value: 12000, color: '#8b5cf6' },
  { name: 'Other', value: 8000, color: '#ef4444' },
];

const inventoryData = [
  { month: 'Jul', inStock: 450, lowStock: 45, outOfStock: 12 },
  { month: 'Aug', inStock: 480, lowStock: 38, outOfStock: 8 },
  { month: 'Sep', inStock: 520, lowStock: 42, outOfStock: 10 },
  { month: 'Oct', inStock: 495, lowStock: 50, outOfStock: 15 },
  { month: 'Nov', inStock: 540, lowStock: 35, outOfStock: 6 },
  { month: 'Dec', inStock: 580, lowStock: 28, outOfStock: 4 },
];

const expenseData = [
  { category: 'Salaries', amount: 125000 },
  { category: 'Rent', amount: 45000 },
  { category: 'Marketing', amount: 18600 },
  { category: 'Utilities', amount: 8920 },
  { category: 'Office', amount: 12450 },
  { category: 'Transport', amount: 6750 },
];

export default function AnalyticsDashboardPage() {
  const router = useRouter();
  const [dateRange, setDateRange] = useState('6months');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Analytics Dashboard"
          subtitle="Comprehensive business insights and metrics"
          actions={[
            <Select key="range" value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>,
            <Button
              key="export"
              variant="outline"
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          ]}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* KPI Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <StatCard
              icon={DollarSign}
              label="Sales Today"
              value="UGX 25,640"
              trend={{ value: 12.5, isPositive: true }}
              iconColor="emerald"
            />
            <StatCard
              icon={Package}
              label="Inventory Value"
              value="UGX 567,800"
              trend={{ value: 8.2, isPositive: true }}
              iconColor="blue"
            />
            <StatCard
              icon={ShoppingBag}
              label="Purchases MTD"
              value="UGX 125,400"
              trend={{ value: 3.1, isPositive: false }}
              iconColor="purple"
            />
            <StatCard
              icon={Receipt}
              label="Expenses MTD"
              value="UGX 45,280"
              trend={{ value: 5.4, isPositive: false }}
              iconColor="amber"
            />
            <StatCard
              icon={TrendingUp}
              label="Net Profit"
              value="UGX 82,360"
              trend={{ value: 15.8, isPositive: true }}
              iconColor="emerald"
            />
          </motion.div>

          {/* Charts Tabs */}
          <motion.div variants={itemVariants}>
            <Tabs defaultValue="sales" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="sales">Sales</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="purchases">Purchases</TabsTrigger>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
              </TabsList>

              <TabsContent value="sales" className="mt-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2 p-6 bg-white dark:bg-gray-900/50">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sales & Profit Trends</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={salesData}>
                        <defs>
                          <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                        <Legend />
                        <Area type="monotone" dataKey="sales" stroke="#10b981" fillOpacity={1} fill="url(#salesGradient)" />
                        <Area type="monotone" dataKey="profit" stroke="#3b82f6" fillOpacity={1} fill="url(#profitGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Card>

                  <Card className="p-6 bg-white dark:bg-gray-900/50">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sales by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="inventory" className="mt-6">
                <Card className="p-6 bg-white dark:bg-gray-900/50">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Inventory Status Trends</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={inventoryData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                      <Legend />
                      <Bar dataKey="inStock" fill="#10b981" name="In Stock" />
                      <Bar dataKey="lowStock" fill="#f59e0b" name="Low Stock" />
                      <Bar dataKey="outOfStock" fill="#ef4444" name="Out of Stock" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </TabsContent>

              <TabsContent value="purchases" className="mt-6">
                <Card className="p-6 bg-white dark:bg-gray-900/50">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Purchase Order Trends</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                      <Legend />
                      <Line type="monotone" dataKey="sales" stroke="#8b5cf6" strokeWidth={3} name="Purchase Amount" />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </TabsContent>

              <TabsContent value="expenses" className="mt-6">
                <Card className="p-6 bg-white dark:bg-gray-900/50">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Expenses by Category</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={expenseData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis type="number" />
                      <YAxis dataKey="category" type="category" width={100} />
                      <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                      <Bar dataKey="amount" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
