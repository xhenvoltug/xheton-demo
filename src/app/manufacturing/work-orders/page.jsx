'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, User, Wrench, Clock, CheckCircle, XCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'

const mockWorkOrders = [
  { id: 'WO-5401', moId: 'MO-2401', task: 'Cut & Shape Wood Panels', assignedTo: 'John Mwangi', machine: 'CNC Router #1', progress: 75, status: 'in-progress', dueDate: '2025-12-08' },
  { id: 'WO-5402', moId: 'MO-2401', task: 'Assembly & Finishing', assignedTo: 'Mary Achieng', machine: 'Assembly Station #2', progress: 30, status: 'in-progress', dueDate: '2025-12-09' },
  { id: 'WO-5403', moId: 'MO-2402', task: 'Upholstery Work', assignedTo: 'Peter Kimani', machine: 'Manual Station #3', progress: 100, status: 'completed', dueDate: '2025-12-07' },
  { id: 'WO-5404', moId: 'MO-2403', task: 'Quality Inspection', assignedTo: 'Jane Mutua', machine: 'QC Station', progress: 0, status: 'delayed', dueDate: '2025-12-06' },
  { id: 'WO-5405', moId: 'MO-2405', task: 'Metal Cutting & Welding', assignedTo: 'David Ochieng', machine: 'Welding Station #1', progress: 50, status: 'in-progress', dueDate: '2025-12-10' }
]

export default function WorkOrders() {
  const getStatusBadge = (status) => {
    const styles = {
      'in-progress': 'bg-blue-100 text-blue-700',
      'completed': 'bg-green-100 text-green-700',
      'delayed': 'bg-red-100 text-red-700',
      'pending': 'bg-yellow-100 text-yellow-700'
    }
    const icons = {
      'in-progress': <Clock className="w-3 h-3 mr-1" />,
      'completed': <CheckCircle className="w-3 h-3 mr-1" />,
      'delayed': <XCircle className="w-3 h-3 mr-1" />
    }
    return (
      <span className={`px-3 py-1 ${styles[status]} rounded-full text-xs font-medium inline-flex items-center`}>
        {icons[status]}
        {status}
      </span>
    )
  }

  const columns = [
    { header: 'WO ID', accessorKey: 'id', cell: ({ row }) => <span className="font-mono font-bold text-blue-600">{row.original.id}</span> },
    { header: 'MO Reference', accessorKey: 'moId', cell: ({ row }) => <span className="font-mono text-sm">{row.original.moId}</span> },
    { header: 'Task', accessorKey: 'task', cell: ({ row }) => <span className="font-medium">{row.original.task}</span> },
    { 
      header: 'Assigned To', 
      accessorKey: 'assignedTo',
      cell: ({ row }) => (
        <span className="flex items-center gap-1">
          <User className="w-3 h-3 text-gray-400" />
          {row.original.assignedTo}
        </span>
      )
    },
    { 
      header: 'Machine/Station', 
      accessorKey: 'machine',
      cell: ({ row }) => (
        <span className="flex items-center gap-1">
          <Wrench className="w-3 h-3 text-gray-400" />
          {row.original.machine}
        </span>
      )
    },
    { 
      header: 'Progress', 
      accessorKey: 'progress',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="w-24 bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${row.original.progress === 100 ? 'bg-green-600' : 'bg-blue-600'}`}
              style={{ width: `${row.original.progress}%` }}
            ></div>
          </div>
          <span className="text-xs font-medium">{row.original.progress}%</span>
        </div>
      )
    },
    { header: 'Due Date', accessorKey: 'dueDate' },
    { header: 'Status', accessorKey: 'status', cell: ({ row }) => getStatusBadge(row.original.status) }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Work Orders" description="Assign and track individual production tasks" />

        <div className="flex items-center justify-between">
          <Button className="bg-gradient-to-r from-blue-600 to-cyan-600">
            <Plus className="w-4 h-4 mr-2" />
            Create Work Order
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Work Orders', value: mockWorkOrders.length, icon: Wrench, gradient: 'from-blue-500 to-cyan-500' },
            { label: 'In Progress', value: mockWorkOrders.filter(w => w.status === 'in-progress').length, icon: Clock, gradient: 'from-yellow-500 to-amber-500' },
            { label: 'Completed', value: mockWorkOrders.filter(w => w.status === 'completed').length, icon: CheckCircle, gradient: 'from-green-500 to-emerald-500' },
            { label: 'Delayed', value: mockWorkOrders.filter(w => w.status === 'delayed').length, icon: XCircle, gradient: 'from-red-500 to-orange-500' }
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
          <DataTable columns={columns} data={mockWorkOrders} />
        </Card>
      </div>
    </DashboardLayout>
  )
}
