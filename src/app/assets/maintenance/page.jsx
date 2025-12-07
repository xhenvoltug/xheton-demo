'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Wrench, Calendar, DollarSign } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'

const mockMaintenance = [
  { id: 'MAINT-201', assetId: 'AST-002', assetName: 'Toyota Hilux 2023', type: 'Scheduled Service', date: '2025-12-05', cost: 850000, nextDue: '2026-03-05', status: 'completed' },
  { id: 'MAINT-202', assetId: 'AST-005', assetName: 'Generator Perkins 45kVA', type: 'Preventive Maintenance', date: '2025-12-10', cost: 1200000, nextDue: '2026-01-10', status: 'scheduled' },
  { id: 'MAINT-203', assetId: 'AST-001', assetName: 'Dell Laptop Latitude 5420', type: 'Repair', date: '2025-11-28', cost: 350000, nextDue: 'N/A', status: 'completed' }
]

export default function Maintenance() {
  const getStatusBadge = (status) => {
    const styles = {
      'completed': 'bg-green-100 text-green-700',
      'scheduled': 'bg-blue-100 text-blue-700',
      'overdue': 'bg-red-100 text-red-700'
    }
    return <span className={`px-3 py-1 ${styles[status]} rounded-full text-xs font-medium`}>{status}</span>
  }

  const columns = [
    { header: 'Maint ID', accessorKey: 'id', cell: ({ row }) => <span className="font-mono font-bold text-blue-600">{row.original.id}</span> },
    { header: 'Asset', accessorKey: 'assetName' },
    { header: 'Type', accessorKey: 'type' },
    { header: 'Date', accessorKey: 'date' },
    { header: 'Cost', accessorKey: 'cost', cell: ({ row }) => <span className="font-bold text-red-600">UGX {row.original.cost.toLocaleString()}</span> },
    { header: 'Next Due', accessorKey: 'nextDue' },
    { header: 'Status', accessorKey: 'status', cell: ({ row }) => getStatusBadge(row.original.status) }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Asset Maintenance" description="Schedule and track maintenance activities" />

        <div className="flex items-center justify-between">
          <Button className="bg-gradient-to-r from-blue-600 to-cyan-600">
            <Plus className="w-4 h-4 mr-2" />
            Schedule Maintenance
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Total Cost (6 months)', value: 'UGX 2.4M', icon: DollarSign, gradient: 'from-red-500 to-orange-500' },
            { label: 'Scheduled', value: '1', icon: Calendar, gradient: 'from-blue-500 to-cyan-500' },
            { label: 'Completed', value: '2', icon: Wrench, gradient: 'from-green-500 to-emerald-500' }
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

        <Card className="rounded-3xl overflow-hidden">
          <DataTable columns={columns} data={mockMaintenance} />
        </Card>
      </div>
    </DashboardLayout>
  )
}
