'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Eye, Download, User, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'

const mockActivities = [
  { id: 'ACT-001', document: 'Q4_Sales_Report_2025.pdf', user: 'Sarah Nambi', action: 'Viewed', timestamp: '2025-12-07 14:45', ipAddress: '192.168.1.23' },
  { id: 'ACT-002', document: 'Budget_2026.xlsx', user: 'Finance Director', action: 'Downloaded', timestamp: '2025-12-07 14:30', ipAddress: '192.168.1.45' },
  { id: 'ACT-003', document: 'Employee_Handbook_2026.pdf', user: 'David Ochola', action: 'Viewed', timestamp: '2025-12-07 13:22', ipAddress: '192.168.1.67' },
  { id: 'ACT-004', document: 'Product_Catalog_v3.pdf', user: 'Marketing Team', action: 'Updated', timestamp: '2025-12-07 11:15', ipAddress: '192.168.1.89' },
  { id: 'ACT-005', document: 'Q4_Sales_Report_2025.pdf', user: 'Grace Akello', action: 'Downloaded', timestamp: '2025-12-07 09:30', ipAddress: '192.168.1.12' }
]

export default function DocumentAudit() {
  const getActionBadge = (action) => {
    const styles = {
      Viewed: 'bg-blue-100 text-blue-700',
      Downloaded: 'bg-green-100 text-green-700',
      Updated: 'bg-orange-100 text-orange-700',
      Deleted: 'bg-red-100 text-red-700'
    }
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[action]}`}>{action}</span>
  }

  const columns = [
    { header: 'Document', accessorKey: 'document', cell: ({ row }) => <span className="font-semibold">{row.original.document}</span> },
    { header: 'User', accessorKey: 'user' },
    { header: 'Action', accessorKey: 'action', cell: ({ row }) => getActionBadge(row.original.action) },
    { header: 'Timestamp', accessorKey: 'timestamp', cell: ({ row }) => <span className="text-xs">{row.original.timestamp}</span> },
    { header: 'IP Address', accessorKey: 'ipAddress', cell: ({ row }) => <span className="font-mono text-xs">{row.original.ipAddress}</span> },
    { 
      header: 'Actions', 
      accessorKey: 'actions',
      cell: ({ row }) => (
        <Button variant="outline" size="sm" className="rounded-xl">
          <Eye className="w-3 h-3 mr-1" />
          Details
        </Button>
      )
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Document Activity Logs" description="Track all document access and modifications" />

        <div className="grid md:grid-cols-4 gap-4">
          {[
            { label: 'Total Activities', value: mockActivities.length, icon: FileText, gradient: 'from-blue-500 to-cyan-500' },
            { label: 'Views', value: mockActivities.filter(a => a.action === 'Viewed').length, icon: Eye, gradient: 'from-green-500 to-emerald-500' },
            { label: 'Downloads', value: mockActivities.filter(a => a.action === 'Downloaded').length, icon: Download, gradient: 'from-purple-500 to-pink-500' },
            { label: 'Updates', value: mockActivities.filter(a => a.action === 'Updated').length, icon: Clock, gradient: 'from-orange-500 to-red-500' }
          ].map((stat, idx) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <Card className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white`}>
                <stat.icon className="w-5 h-5 opacity-80 mb-2" />
                <p className="text-xs opacity-90">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="rounded-3xl overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-bold">Activity History</h3>
          </div>
          <DataTable columns={columns} data={mockActivities} />
        </Card>
      </div>
    </DashboardLayout>
  )
}
