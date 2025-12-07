'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  DollarSign, TrendingUp, Package, ShoppingCart, Users, Plus, 
  ArrowUpRight, ArrowDownRight, Activity, Store, BoxIcon, UserPlus
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

// Daily sales data (hourly)
const dailySalesData = [
  { time: '9AM', sales: 4200 },
  { time: '10AM', sales: 6800 },
  { time: '11AM', sales: 8500 },
  { time: '12PM', sales: 11200 },
  { time: '1PM', sales: 9800 },
  { time: '2PM', sales: 10500 },
  { time: '3PM', sales: 11500 },
  { time: '4PM', sales: 9200 },
];

// Top products
const topProductsData = [
  { name: 'Laptop Dell XPS', sales: 45000 },
  { name: 'iPhone 15 Pro', sales: 38000 },
  { name: 'Samsung TV 55"', sales: 32000 },
  { name: 'Office Chair', sales: 28000 },
  { name: 'Wireless Mouse', sales: 18000 },
];

// Stock breakdown
const stockData = [
  { name: 'Electronics', value: 450000, color: '#10b981' },
  { name: 'Furniture', value: 280000, color: '#3b82f6' },
  { name: 'Clothing', value: 180000, color: '#f59e0b' },
  { name: 'Books', value: 120000, color: '#8b5cf6' },
];

// Branch performance
const branchData = [
  { name: 'Main Branch', sales: 2400000, growth: 12.5, trend: 'up' },
  { name: 'Westlands', sales: 1800000, growth: 8.2, trend: 'up' },
  { name: 'Mombasa', sales: 1200000, growth: -3.1, trend: 'down' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100
    }
  }
};

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  useEffect(() => {
    // Check subscription status on mount
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/auth/check-status');
        const data = await response.json();

        if (!response.ok || !data.success) {
          // If unauthorized or check failed, redirect based on API response
          if (data.redirectTo) {
            router.push(data.redirectTo);
          } else {
            router.push('/auth/login');
          }
          return;
        }

        // If API says success, we have access - show dashboard
        setSubscriptionStatus(data);
        setLoading(false);
      } catch (error) {
        console.error('Error checking status:', error);
        router.push('/auth/login');
      }
    };

    checkStatus();
  }, [router]);

  // Show loading state while checking subscription
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div 
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Real-time business overview and analytics
          </p>
        </motion.div>

        {/* Sales Metric Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: 'Sales Today',
              value: 'UGX 89,420',
              change: '+12.5%',
              trend: 'up',
              icon: DollarSign,
              gradient: 'from-emerald-500 to-teal-500'
            },
            {
              title: 'This Week',
              value: 'UGX 456,800',
              change: '+8.2%',
              trend: 'up',
              icon: TrendingUp,
              gradient: 'from-blue-500 to-cyan-500'
            },
            {
              title: 'This Month',
              value: 'UGX 1.89M',
              change: '+15.3%',
              trend: 'up',
              icon: ShoppingCart,
              gradient: 'from-purple-500 to-pink-500'
            },
            {
              title: 'Active Customers',
              value: '1,248',
              change: '+5.7%',
              trend: 'up',
              icon: Users,
              gradient: 'from-amber-500 to-orange-500'
            }
          ].map((metric, index) => (
            <motion.div key={metric.title} variants={itemVariants}>
              <Card className="rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${metric.gradient}`}>
                      <metric.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex items-center gap-1 text-sm font-semibold">
                      {metric.trend === 'up' ? (
                        <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-600" />
                      )}
                      <span className={metric.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {metric.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {metric.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <Card className="rounded-3xl shadow-lg border-0">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { label: 'New Sale', icon: Plus, href: '/sales/new' },
                  { label: 'New Purchase', icon: ShoppingCart, href: '/purchases/new' },
                  { label: 'Add Product', icon: Package, href: '/inventory/products/new' },
                  { label: 'Add Customer', icon: UserPlus, href: '/sales/customers/new' },
                  { label: 'View Stock', icon: BoxIcon, href: '/inventory/stock' },
                  { label: 'Go to POS', icon: Store, href: '/pos' }
                ].map((action) => (
                  <motion.div
                    key={action.label}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full h-auto flex flex-col items-center gap-2 p-4 rounded-2xl border-2 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-all"
                    >
                      <action.icon className="h-6 w-6" />
                      <span className="text-xs font-medium">{action.label}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Sales Trend */}
          <motion.div variants={itemVariants}>
            <Card className="rounded-3xl shadow-lg border-0 h-full">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Daily Sales Trend
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Today's hourly performance
                  </p>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailySalesData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                    <XAxis dataKey="time" className="text-sm" />
                    <YAxis className="text-sm" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '12px'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: '#10b981', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Products */}
          <motion.div variants={itemVariants}>
            <Card className="rounded-3xl shadow-lg border-0 h-full">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Top Products
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Best sellers this month
                  </p>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topProductsData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                    <XAxis type="number" className="text-sm" />
                    <YAxis dataKey="name" type="category" width={120} className="text-sm" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '12px'
                      }} 
                    />
                    <Bar dataKey="sales" fill="#3b82f6" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stock Breakdown */}
          <motion.div variants={itemVariants}>
            <Card className="rounded-3xl shadow-lg border-0 h-full">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Stock Breakdown
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Inventory value by category
                  </p>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stockData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stockData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '12px'
                      }}
                      formatter={(value) => `UGX UGX {value.toLocaleString()}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={itemVariants}>
            <Card className="rounded-3xl shadow-lg border-0 h-full">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Activity
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Latest system activities
                  </p>
                </div>
                <div className="space-y-4">
                  {[
                    { type: 'sale', message: 'Sale completed - UGX 12,500', time: '5 min ago', icon: ShoppingCart, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900' },
                    { type: 'alert', message: 'Low stock alert - 3 items', time: '15 min ago', icon: Package, color: 'text-amber-600 bg-amber-100 dark:bg-amber-900' },
                    { type: 'purchase', message: 'Purchase order created', time: '1 hour ago', icon: Plus, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900' },
                    { type: 'user', message: 'User login - John Doe', time: '2 hours ago', icon: Users, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className={`p-2 rounded-xl ${activity.color}`}>
                        <activity.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.message}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Branch Performance */}
        <motion.div variants={itemVariants}>
          <Card className="rounded-3xl shadow-lg border-0">
            <CardContent className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Branch Performance
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sales performance across all branches
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {branchData.map((branch, index) => (
                  <div key={branch.name} className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-white dark:bg-gray-800 shadow-md">
                        <Store className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div className="flex items-center gap-1">
                        {branch.trend === 'up' ? (
                          <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`text-sm font-semibold ${branch.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                          {branch.growth > 0 ? '+' : ''}{branch.growth}%
                        </span>
                      </div>
                    </div>
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      {branch.name}
                    </h4>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      UGX {(branch.sales / 1000000).toFixed(1)}M
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
