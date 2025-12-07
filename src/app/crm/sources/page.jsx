'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, TrendingUp, DollarSign } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'

const mockSources = [
  { id: 'SRC-001', name: 'Website Organic', leadsGenerated: 45, conversionRate: 12.5, cost: 2500000, revenue: 35000000, roi: 1300 },
  { id: 'SRC-002', name: 'LinkedIn Ads', leadsGenerated: 28, conversionRate: 18.2, cost: 5000000, revenue: 42000000, roi: 740 },
  { id: 'SRC-003', name: 'Referral Program', leadsGenerated: 15, conversionRate: 35.0, cost: 1000000, revenue: 28000000, roi: 2700 },
  { id: 'SRC-004', name: 'Trade Shows', leadsGenerated: 32, conversionRate: 22.0, cost: 8000000, revenue: 56000000, roi: 600 },
  { id: 'SRC-005', name: 'Cold Calling', leadsGenerated: 18, conversionRate: 8.5, cost: 3000000, revenue: 12000000, roi: 300 }
]

const sourceDistribution = [
  { name: 'Website', value: 45, color: '#3b82f6' },
  { name: 'LinkedIn', value: 28, color: '#10b981' },
  { name: 'Referral', value: 15, color: '#f59e0b' },
  { name: 'Trade Shows', value: 32, color: '#8b5cf6' },
  { name: 'Cold Call', value: 18, color: '#ef4444' }
]

export default function LeadSources() {
  const [showAddModal, setShowAddModal] = useState(false)

  const totalLeads = mockSources.reduce((sum, s) => sum + s.leadsGenerated, 0)
  const totalCost = mockSources.reduce((sum, s) => sum + s.cost, 0)
  const totalRevenue = mockSources.reduce((sum, s) => sum + s.revenue, 0)

  const columns = [
    { header: 'Source ID', accessorKey: 'id', cell: ({ row }) => <span className="font-mono font-bold text-blue-600">{row.original.id}</span> },
    { header: 'Source Name', accessorKey: 'name', cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
    { header: 'Leads Generated', accessorKey: 'leadsGenerated', cell: ({ row }) => <span className="font-bold">{row.original.leadsGenerated}</span> },
    { 
      header: 'Conversion Rate', 
      accessorKey: 'conversionRate',
      cell: ({ row }) => <span className="font-bold text-green-600">{row.original.conversionRate}%</span>
    },
    { 
      header: 'Cost (UGX)', 
      accessorKey: 'cost',
      cell: ({ row }) => <span className="text-red-600">UGX {(row.original.cost / 1000000).toFixed(1)}M</span>
    },
    { 
      header: 'Revenue (UGX)', 
      accessorKey: 'revenue',
      cell: ({ row }) => <span className="font-bold text-green-600">UGX {(row.original.revenue / 1000000).toFixed(1)}M</span>
    },
    { 
      header: 'ROI', 
      accessorKey: 'roi',
      cell: ({ row }) => <span className="font-bold text-purple-600">{row.original.roi}%</span>
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Lead Sources & Campaigns" description="Track performance of lead generation channels" />

        <div className="flex items-center justify-between">
          <Button className="bg-gradient-to-r from-blue-600 to-cyan-600" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Source
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Leads', value: totalLeads, icon: TrendingUp, gradient: 'from-blue-500 to-cyan-500' },
            { label: 'Total Investment', value: `UGX ${(totalCost / 1000000).toFixed(1)}M`, icon: DollarSign, gradient: 'from-red-500 to-orange-500' },
            { label: 'Total Revenue', value: `UGX ${(totalRevenue / 1000000).toFixed(1)}M`, icon: DollarSign, gradient: 'from-green-500 to-emerald-500' },
            { label: 'Avg ROI', value: `${((totalRevenue / totalCost - 1) * 100).toFixed(0)}%`, icon: TrendingUp, gradient: 'from-purple-500 to-pink-500' }
          ].map((stat, idx) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <Card className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white`}>
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-5 h-5 opacity-80" />
                </div>
                <p className="text-xs opacity-90">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Chart */}
          <Card className="rounded-3xl p-6">
            <h3 className="font-bold mb-4">Source Performance (ROI %)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockSources}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="roi" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Distribution Chart */}
          <Card className="rounded-3xl p-6">
            <h3 className="font-bold mb-4">Lead Distribution by Source</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sourceDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sourceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card className="rounded-3xl overflow-hidden">
          <DataTable columns={columns} data={mockSources} />
        </Card>

        {/* Add Source Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-6 max-w-2xl w-full">
              <h3 className="text-xl font-bold mb-4">Add Lead Source</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Source Name</label>
                  <Input className="rounded-xl" placeholder="e.g., Facebook Ads" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Campaign Cost (UGX)</label>
                    <Input type="number" className="rounded-xl" placeholder="e.g., 5000000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Date</label>
                    <Input type="date" className="rounded-xl" />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600">Add Source</Button>
                  <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
