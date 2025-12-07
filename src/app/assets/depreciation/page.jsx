'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingDown, DollarSign, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'

const mockDepreciation = [
  { id: 'AST-001', name: 'Dell Laptop Latitude 5420', method: 'Straight Line', purchaseCost: 4500000, monthlyDep: 112500, accumulatedDep: 900000, nbv: 3600000, usefulLife: 36 },
  { id: 'AST-002', name: 'Toyota Hilux 2023', method: 'Reducing Balance', purchaseCost: 125000000, monthlyDep: 2083333, accumulatedDep: 20000000, nbv: 105000000, usefulLife: 60 },
  { id: 'AST-003', name: 'HP Printer LaserJet Pro', method: 'Straight Line', purchaseCost: 1850000, monthlyDep: 46250, accumulatedDep: 250000, nbv: 1600000, usefulLife: 36 }
]

const depTrend = [
  { month: 'Jan', depreciation: 2500000 },
  { month: 'Feb', depreciation: 2500000 },
  { month: 'Mar', depreciation: 2500000 },
  { month: 'Apr', depreciation: 2500000 },
  { month: 'May', depreciation: 2500000 },
  { month: 'Jun', depreciation: 2500000 }
]

export default function Depreciation() {
  const columns = [
    { header: 'Asset ID', accessorKey: 'id', cell: ({ row }) => <span className="font-mono font-bold text-blue-600">{row.original.id}</span> },
    { header: 'Asset Name', accessorKey: 'name' },
    { header: 'Method', accessorKey: 'method' },
    { header: 'Purchase Cost', accessorKey: 'purchaseCost', cell: ({ row }) => <span>UGX {row.original.purchaseCost.toLocaleString()}</span> },
    { header: 'Monthly Dep', accessorKey: 'monthlyDep', cell: ({ row }) => <span className="text-red-600">UGX {row.original.monthlyDep.toLocaleString()}</span> },
    { header: 'Accumulated Dep', accessorKey: 'accumulatedDep', cell: ({ row }) => <span>UGX {row.original.accumulatedDep.toLocaleString()}</span> },
    { header: 'Net Book Value', accessorKey: 'nbv', cell: ({ row }) => <span className="font-bold text-green-600">UGX {row.original.nbv.toLocaleString()}</span> }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Asset Depreciation" description="Track asset depreciation and net book values" />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Monthly Depreciation', value: 'UGX 2.5M', icon: TrendingDown, gradient: 'from-red-500 to-orange-500' },
            { label: 'Total NBV', value: 'UGX 110.2M', icon: DollarSign, gradient: 'from-green-500 to-emerald-500' },
            { label: 'Avg Useful Life', value: '44 months', icon: Calendar, gradient: 'from-blue-500 to-cyan-500' }
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

        <Card className="rounded-3xl p-6">
          <h3 className="font-bold mb-4">Monthly Depreciation Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={depTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="depreciation" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="rounded-3xl overflow-hidden">
          <DataTable columns={columns} data={mockDepreciation} />
        </Card>
      </div>
    </DashboardLayout>
  )
}
