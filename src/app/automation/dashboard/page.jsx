'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Plus, Search, Play, Pause, Trash2, Edit, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'

const mockAutomations = [
  { id: 'AUTO-001', name: 'Low Stock Alerts', trigger: 'Inventory below threshold', actions: 3, lastRun: '2025-12-07 14:23', status: 'active', runs: 45, successRate: 98 },
  { id: 'AUTO-002', name: 'Invoice Overdue Reminder', trigger: 'Payment due date passed', actions: 2, lastRun: '2025-12-07 09:15', status: 'active', runs: 28, successRate: 100 },
  { id: 'AUTO-003', name: 'Daily Sales Summary', trigger: 'Scheduled daily at 6 PM', actions: 4, lastRun: '2025-12-06 18:00', status: 'active', runs: 156, successRate: 100 },
  { id: 'AUTO-004', name: 'New Customer Welcome', trigger: 'Customer created', actions: 2, lastRun: '2025-12-07 11:45', status: 'paused', runs: 67, successRate: 95 },
  { id: 'AUTO-005', name: 'Payment Confirmation', trigger: 'Payment received', actions: 3, lastRun: '2025-12-07 13:30', status: 'active', runs: 89, successRate: 100 },
  { id: 'AUTO-006', name: 'Order Fulfillment Workflow', trigger: 'Sale completed', actions: 5, lastRun: '2025-12-07 10:22', status: 'active', runs: 123, successRate: 97 },
  { id: 'AUTO-007', name: 'Supplier PO Auto-Generate', trigger: 'Stock level critical', actions: 4, lastRun: '2025-12-05 08:15', status: 'paused', runs: 12, successRate: 92 }
]

export default function AutomationDashboard() {
  const [selectedFilter, setSelectedFilter] = useState('all')

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-700',
      paused: 'bg-gray-100 text-gray-700',
      failed: 'bg-red-100 text-red-700'
    }
    const icons = {
      active: CheckCircle,
      paused: Pause,
      failed: XCircle
    }
    const Icon = icons[status]
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${styles[status]}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    )
  }

  const columns = [
    { header: 'Automation', accessorKey: 'name', cell: ({ row }) => <span className="font-semibold">{row.original.name}</span> },
    { header: 'Trigger', accessorKey: 'trigger', cell: ({ row }) => <span className="text-sm text-gray-600">{row.original.trigger}</span> },
    { header: 'Actions', accessorKey: 'actions', cell: ({ row }) => <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">{row.original.actions} steps</span> },
    { header: 'Last Run', accessorKey: 'lastRun', cell: ({ row }) => <span className="text-xs text-gray-600">{row.original.lastRun}</span> },
    { header: 'Success Rate', accessorKey: 'successRate', cell: ({ row }) => <span className="text-sm font-semibold text-green-600">{row.original.successRate}%</span> },
    { header: 'Status', accessorKey: 'status', cell: ({ row }) => getStatusBadge(row.original.status) },
    { 
      header: 'Actions', 
      accessorKey: 'controls',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-xl">
            <Play className="w-3 h-3" />
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl">
            <Edit className="w-3 h-3" />
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl text-red-600">
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Automation Dashboard" description="Manage workflow automations and triggers" />

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search automations..." className="pl-10 rounded-xl" />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl" onClick={() => window.location.href = '/automation/templates'}>
              View Templates
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl" onClick={() => window.location.href = '/automation/builder'}>
              <Plus className="w-4 h-4 mr-2" />
              Create Automation
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {[
            { label: 'Total Automations', value: mockAutomations.length, icon: Zap, gradient: 'from-purple-500 to-pink-500' },
            { label: 'Active', value: mockAutomations.filter(a => a.status === 'active').length, icon: CheckCircle, gradient: 'from-green-500 to-emerald-500' },
            { label: 'Paused', value: mockAutomations.filter(a => a.status === 'paused').length, icon: Pause, gradient: 'from-gray-500 to-slate-500' },
            { label: 'Total Runs Today', value: '342', icon: Clock, gradient: 'from-blue-500 to-cyan-500' }
          ].map((stat, idx) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
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

        <div className="flex gap-2">
          {['all', 'active', 'paused'].map(filter => (
            <Button
              key={filter}
              variant={selectedFilter === filter ? 'default' : 'outline'}
              className={`rounded-xl capitalize ${selectedFilter === filter ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter}
            </Button>
          ))}
        </div>

        <Card className="rounded-3xl overflow-hidden">
          <DataTable columns={columns} data={mockAutomations} />
        </Card>

        <Card className="rounded-3xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {[
              { automation: 'Daily Sales Summary', status: 'success', time: '10 min ago', message: 'Sent summary to 5 managers' },
              { automation: 'Payment Confirmation', status: 'success', time: '25 min ago', message: 'Email sent to customer Sarah Nambi' },
              { automation: 'Low Stock Alerts', status: 'success', time: '1 hour ago', message: 'Notified procurement team about 3 items' },
              { automation: 'New Customer Welcome', status: 'failed', time: '2 hours ago', message: 'SMTP connection timeout' }
            ].map((activity, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-4 rounded-2xl border-l-4 ${activity.status === 'success' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm">{activity.automation}</h4>
                      {activity.status === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{activity.message}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
