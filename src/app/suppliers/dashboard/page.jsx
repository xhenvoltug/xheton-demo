'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Package, TrendingUp, Star, Plus, Upload, ShoppingCart, Filter } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'

const mockSupplierStats = {
  total: 247,
  active: 198,
  inactive: 49,
  pendingDeliveries: 34,
  avgRating: 4.2
}

const mockPerformanceData = [
  { month: 'Jul', score: 78 },
  { month: 'Aug', score: 82 },
  { month: 'Sep', score: 85 },
  { month: 'Oct', score: 88 },
  { month: 'Nov', score: 92 },
  { month: 'Dec', score: 89 }
]

const mockCategoryStats = [
  { name: 'Local', count: 145, color: 'from-blue-500 to-cyan-500' },
  { name: 'International', count: 67, color: 'from-purple-500 to-pink-500' },
  { name: 'Preferred', count: 89, color: 'from-green-500 to-emerald-500' },
  { name: 'High-Risk', count: 12, color: 'from-red-500 to-orange-500' }
]

const mockRecentSuppliers = [
  { id: 'SUP-2501', name: 'Global Tech Supplies Ltd.', category: 'International', rating: 4.8, lastSupply: '2025-12-05', status: 'active' },
  { id: 'SUP-2502', name: 'Local Hardware Co.', category: 'Local', rating: 4.5, lastSupply: '2025-12-04', status: 'active' },
  { id: 'SUP-2503', name: 'Premium Materials Inc.', category: 'Preferred', rating: 4.9, lastSupply: '2025-12-03', status: 'active' },
  { id: 'SUP-2504', name: 'Budget Supplies LLC', category: 'Local', rating: 3.2, lastSupply: '2025-11-28', status: 'inactive' },
  { id: 'SUP-2505', name: 'Overseas Manufacturing', category: 'International', rating: 4.1, lastSupply: '2025-12-02', status: 'active' }
]

export default function SupplierDashboard() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600'
    if (rating >= 3.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHeader
          title="Supplier Dashboard"
          description="Comprehensive vendor management and performance tracking"
        />

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-3"
        >
          <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Supplier
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import Vendors
          </Button>
          <Button variant="outline">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Create Purchase Order
          </Button>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Suppliers</p>
                  <h3 className="text-3xl font-bold mt-2">{mockSupplierStats.total}</h3>
                </div>
                <Users className="w-12 h-12 opacity-80" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Active Suppliers</p>
                  <h3 className="text-3xl font-bold mt-2">{mockSupplierStats.active}</h3>
                  <p className="text-xs text-green-100 mt-1">
                    {mockSupplierStats.inactive} inactive
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 opacity-80" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Pending Deliveries</p>
                  <h3 className="text-3xl font-bold mt-2">{mockSupplierStats.pendingDeliveries}</h3>
                </div>
                <Package className="w-12 h-12 opacity-80" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 bg-gradient-to-br from-yellow-500 to-amber-500 text-white rounded-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Avg Rating</p>
                  <h3 className="text-3xl font-bold mt-2">{mockSupplierStats.avgRating}</h3>
                  <div className="flex gap-1 mt-2">
                    {getRatingStars(mockSupplierStats.avgRating)}
                  </div>
                </div>
                <Star className="w-12 h-12 opacity-80" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Performance</p>
                  <h3 className="text-3xl font-bold mt-2">89%</h3>
                  <p className="text-xs text-purple-100 mt-1">+4% this month</p>
                </div>
                <TrendingUp className="w-12 h-12 opacity-80" />
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Category Filter Chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Supplier Categories</h3>
              <Filter className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({mockSupplierStats.total})
              </button>
              {mockCategoryStats.map((cat, idx) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name.toLowerCase())}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat.name.toLowerCase()
                      ? `bg-gradient-to-r ${cat.color} text-white`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.name} ({cat.count})
                </button>
              ))}
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="p-6 rounded-3xl">
              <h3 className="text-lg font-semibold mb-4">Supplier Performance Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={mockPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="p-6 rounded-3xl">
              <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={mockCategoryStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>

        {/* Recent Suppliers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="p-6 rounded-3xl">
            <h3 className="text-lg font-semibold mb-4">Recent Suppliers</h3>
            <div className="space-y-3">
              {mockRecentSuppliers.map((supplier, idx) => (
                <motion.div
                  key={supplier.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + idx * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                      {supplier.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{supplier.name}</h4>
                      <p className="text-sm text-gray-600">{supplier.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-xs text-gray-500">Category</p>
                      <p className="text-sm font-medium">{supplier.category}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Rating</p>
                      <div className="flex items-center gap-1">
                        <span className={`text-sm font-bold ${getRatingColor(supplier.rating)}`}>
                          {supplier.rating}
                        </span>
                        <div className="flex gap-0.5">
                          {getRatingStars(supplier.rating)}
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Last Supply</p>
                      <p className="text-sm font-medium">{supplier.lastSupply}</p>
                    </div>
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          supplier.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {supplier.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
