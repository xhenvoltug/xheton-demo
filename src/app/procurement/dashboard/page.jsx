'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  ShoppingCart,
  FileText,
  Clock,
  AlertCircle,
  DollarSign,
  TrendingDown,
  Package,
  Plus,
  BarChart2
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'

const mockProcurementStats = {
  totalSpend: 2450000,
  activePOs: 34,
  pendingApprovals: 12,
  deliveryDelays: 5,
  avgLeadTime: 18.5,
  savingsThisMonth: 45000
}

const mockSpendByCategory = [
  { category: 'Electronics', amount: 850000, color: '#3b82f6' },
  { category: 'Raw Materials', amount: 620000, color: '#10b981' },
  { category: 'Office Supplies', amount: 180000, color: '#f59e0b' },
  { category: 'Equipment', amount: 450000, color: '#8b5cf6' },
  { category: 'Services', amount: 350000, color: '#ec4899' }
]

const mockSpendTrend = [
  { month: 'Jul', spend: 2100000 },
  { month: 'Aug', spend: 2250000 },
  { month: 'Sep', spend: 2180000 },
  { month: 'Oct', spend: 2350000 },
  { month: 'Nov', spend: 2420000 },
  { month: 'Dec', spend: 2450000 }
]

const mockHeatmapData = [
  { supplier: 'Global Tech', orders: 45, value: 850000, performance: 92 },
  { supplier: 'Local Hardware', orders: 23, value: 320000, performance: 88 },
  { supplier: 'Premium Materials', orders: 38, value: 620000, performance: 96 },
  { supplier: 'Budget Supplies', orders: 12, value: 180000, performance: 72 },
  { supplier: 'Fast Track Logistics', orders: 28, value: 450000, performance: 85 }
]

const mockRecentPOs = [
  { id: 'PO-5789', supplier: 'Global Tech Supplies Ltd.', amount: 45000, items: 12, status: 'approved', date: '2025-12-06' },
  { id: 'PO-5788', supplier: 'Premium Materials Inc.', amount: 62000, items: 8, status: 'pending', date: '2025-12-05' },
  { id: 'PO-5787', supplier: 'Local Hardware Co.', amount: 18000, items: 25, status: 'receiving', date: '2025-12-04' },
  { id: 'PO-5786', supplier: 'Fast Track Logistics', amount: 35000, items: 5, status: 'approved', date: '2025-12-03' }
]

export default function ProcurementDashboard() {
  const router = useRouter()

  const getStatusBadge = (status) => {
    const badges = {
      approved: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      receiving: 'bg-blue-100 text-blue-700',
      completed: 'bg-gray-100 text-gray-700'
    }
    return badges[status] || badges.pending
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHeader
          title="Procurement Dashboard"
          description="Comprehensive procurement analytics and purchasing oversight"
        />

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-3"
        >
          <Button
            className="bg-gradient-to-r from-blue-600 to-cyan-600"
            onClick={() => router.push('/procurement/rfq/create')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create RFQ
          </Button>
          <Button
            className="bg-gradient-to-r from-purple-600 to-pink-600"
            onClick={() => router.push('/procurement/po/create')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Purchase Order
          </Button>
          <Button variant="outline">
            <BarChart2 className="w-4 h-4 mr-2" />
            View Reports
          </Button>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Spend</p>
                  <h3 className="text-2xl font-bold mt-2">
                    ${(mockProcurementStats.totalSpend / 1000000).toFixed(2)}M
                  </h3>
                  <p className="text-xs text-blue-100 mt-1">This month</p>
                </div>
                <DollarSign className="w-10 h-10 opacity-80" />
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
                  <p className="text-green-100 text-sm font-medium">Active POs</p>
                  <h3 className="text-2xl font-bold mt-2">{mockProcurementStats.activePOs}</h3>
                  <p className="text-xs text-green-100 mt-1">In progress</p>
                </div>
                <ShoppingCart className="w-10 h-10 opacity-80" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-gradient-to-br from-yellow-500 to-amber-500 text-white rounded-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Pending Approvals</p>
                  <h3 className="text-2xl font-bold mt-2">{mockProcurementStats.pendingApprovals}</h3>
                  <p className="text-xs text-yellow-100 mt-1">Requires action</p>
                </div>
                <FileText className="w-10 h-10 opacity-80" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">Delivery Delays</p>
                  <h3 className="text-2xl font-bold mt-2">{mockProcurementStats.deliveryDelays}</h3>
                  <p className="text-xs text-red-100 mt-1">Late deliveries</p>
                </div>
                <AlertCircle className="w-10 h-10 opacity-80" />
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
                  <p className="text-purple-100 text-sm font-medium">Avg Lead Time</p>
                  <h3 className="text-2xl font-bold mt-2">{mockProcurementStats.avgLeadTime}</h3>
                  <p className="text-xs text-purple-100 mt-1">Days</p>
                </div>
                <Clock className="w-10 h-10 opacity-80" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6 bg-gradient-to-br from-teal-500 to-cyan-500 text-white rounded-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-100 text-sm font-medium">Savings</p>
                  <h3 className="text-2xl font-bold mt-2">
                    ${(mockProcurementStats.savingsThisMonth / 1000).toFixed(0)}K
                  </h3>
                  <p className="text-xs text-teal-100 mt-1">This month</p>
                </div>
                <TrendingDown className="w-10 h-10 opacity-80" />
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Spend by Category */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="p-6 rounded-3xl">
              <h3 className="text-lg font-semibold mb-4">Spend by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockSpendByCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="category" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip formatter={(value) => `UGX ${(value / 1000).toFixed(0)}K`} />
                  <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                    {mockSpendByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Spend Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="p-6 rounded-3xl">
              <h3 className="text-lg font-semibold mb-4">Procurement Spend Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockSpendTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip formatter={(value) => `UGX ${(value / 1000000).toFixed(2)}M`} />
                  <Line
                    type="monotone"
                    dataKey="spend"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>

        {/* Procurement Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="p-6 rounded-3xl">
            <h3 className="text-lg font-semibold mb-4">Procurement Heatmap - Supplier Activity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {mockHeatmapData.map((supplier, idx) => (
                <motion.div
                  key={supplier.supplier}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + idx * 0.1 }}
                  className={`p-6 rounded-2xl text-white ${
                    supplier.performance >= 90
                      ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                      : supplier.performance >= 80
                      ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                      : 'bg-gradient-to-br from-yellow-500 to-amber-500'
                  }`}
                >
                  <p className="text-sm opacity-90">{supplier.supplier}</p>
                  <p className="text-3xl font-bold mt-2">{supplier.orders}</p>
                  <p className="text-xs opacity-90 mt-1">orders</p>
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-xs opacity-90">Total Value</p>
                    <p className="text-lg font-bold">${(supplier.value / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs opacity-90">Performance</p>
                    <p className="text-lg font-bold">{supplier.performance}%</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Recent Purchase Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <Card className="p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Purchase Orders</h3>
              <Button variant="outline" size="sm" onClick={() => router.push('/procurement/po')}>
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {mockRecentPOs.map((po, idx) => (
                <motion.div
                  key={po.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 + idx * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => router.push(`/procurement/po/${po.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{po.id}</h4>
                      <p className="text-sm text-gray-600">{po.supplier}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Amount</p>
                      <p className="font-bold text-lg">${po.amount.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Items</p>
                      <p className="font-bold">{po.items}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="font-medium text-sm">{po.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(po.status)}`}>
                      {po.status}
                    </span>
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
