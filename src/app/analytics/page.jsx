'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Package, ShoppingCart, Brain } from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const monthlyData = [
  { month: 'Jan', revenue: 45000, costs: 32000, profit: 13000 },
  { month: 'Feb', revenue: 52000, costs: 35000, profit: 17000 },
  { month: 'Mar', revenue: 48000, costs: 33000, profit: 15000 },
  { month: 'Apr', revenue: 61000, costs: 38000, profit: 23000 },
  { month: 'May', revenue: 55000, costs: 36000, profit: 19000 },
  { month: 'Jun', revenue: 67000, costs: 40000, profit: 27000 },
];

const productPerformance = [
  { product: 'Electronics', sales: 45000, growth: 15 },
  { product: 'Clothing', sales: 32000, growth: 8 },
  { product: 'Food', sales: 28000, growth: 12 },
  { product: 'Home', sales: 21000, growth: 5 },
  { product: 'Sports', sales: 18000, growth: 18 },
];

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Advanced Analytics
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Data-driven insights and AI-powered forecasting
          </p>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Revenue Growth', value: '+23%', icon: TrendingUp, color: 'emerald' },
            { label: 'Profit Margin', value: '32%', icon: DollarSign, color: 'blue' },
            { label: 'Inventory Turnover', value: '5.2x', icon: Package, color: 'purple' },
            { label: 'Sales Velocity', value: '+18%', icon: ShoppingCart, color: 'amber' },
          ].map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardDescription className="text-sm">{kpi.label}</CardDescription>
                    <Icon className={`h-5 w-5 text-${kpi.color}-600`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">{kpi.value}</div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Analytics Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs defaultValue="revenue" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
              <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
              <TabsTrigger value="products">Product Performance</TabsTrigger>
              <TabsTrigger value="forecast">AI Forecasting</TabsTrigger>
            </TabsList>

            <TabsContent value="revenue" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Revenue & Profitability Trends</CardTitle>
                  <CardDescription>6-month financial performance overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} />
                      <Line type="monotone" dataKey="costs" stroke="#ef4444" strokeWidth={3} />
                      <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Top Product Categories</CardTitle>
                  <CardDescription>Sales performance by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={productPerformance}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis dataKey="product" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="sales" fill="#10b981" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="forecast" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Brain className="h-8 w-8 text-purple-600" />
                    <div>
                      <CardTitle className="text-xl font-bold">AI-Powered Forecasting</CardTitle>
                      <CardDescription>Predictive analytics for smarter decisions</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200">
                        <CardHeader>
                          <CardTitle className="text-lg">Next Month Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">UGX 72,500</div>
                          <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">95% confidence</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200">
                        <CardHeader>
                          <CardTitle className="text-lg">Demand Forecast</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">+15%</div>
                          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Growth expected</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200">
                        <CardHeader>
                          <CardTitle className="text-lg">Optimal Inventory</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">UGX 45,200</div>
                          <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">Recommended stock value</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                      <div className="text-center">
                        <Brain className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          AI Forecasting Models Active
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                          Our machine learning algorithms analyze historical data, market trends, and seasonal patterns 
                          to provide accurate predictions for inventory optimization, demand planning, and revenue forecasting.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
