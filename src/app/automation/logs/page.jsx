'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Search, Download, CheckCircle, XCircle, AlertCircle, Eye, Filter } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'

const mockLogs = [
  { id: 'LOG-001', automation: 'Daily Sales Summary', status: 'success', startTime: '2025-12-07 18:00:05', endTime: '2025-12-07 18:00:12', duration: '7.2s', triggeredBy: 'Schedule', details: 'Sent emails to 5 managers with UGX 8,450,000 total sales' },
  { id: 'LOG-002', automation: 'Payment Confirmation', status: 'success', startTime: '2025-12-07 13:30:22', endTime: '2025-12-07 13:30:25', duration: '3.1s', triggeredBy: 'Payment Received', details: 'Email sent to Sarah Nambi for UGX 149,000 payment' },
  { id: 'LOG-003', automation: 'Low Stock Alerts', status: 'success', startTime: '2025-12-07 14:23:45', endTime: '2025-12-07 14:23:48', duration: '2.8s', triggeredBy: 'Inventory Threshold', details: 'Notified 3 items below minimum: Laptop Battery (5 left), USB Cable (8 left), Power Adapter (3 left)' },
  { id: 'LOG-004', automation: 'New Customer Welcome', status: 'failed', startTime: '2025-12-07 11:45:10', endTime: '2025-12-07 11:45:25', duration: '15.0s', triggeredBy: 'Customer Created', details: 'SMTP connection timeout - failed to send welcome email' },
  { id: 'LOG-005', automation: 'Invoice Overdue Reminder', status: 'success', startTime: '2025-12-07 09:15:33', endTime: '2025-12-07 09:15:38', duration: '4.5s', triggeredBy: 'Schedule', details: 'Sent 12 overdue reminders totaling UGX 15,890,000' },
  { id: 'LOG-006', automation: 'Order Fulfillment Workflow', status: 'success', startTime: '2025-12-07 10:22:18', endTime: '2025-12-07 10:22:31', duration: '13.2s', triggeredBy: 'Sale Completed', details: 'Created delivery order, updated inventory, sent customer notification for UGX 450,000 sale' },
  { id: 'LOG-007', automation: 'Payment Confirmation', status: 'warning', startTime: '2025-12-07 08:15:42', endTime: '2025-12-07 08:15:55', duration: '12.8s', triggeredBy: 'Payment Received', details: 'Email sent but SMS failed - insufficient credits' }
]

export default function TriggerLogs() {
  const [showDetailsDrawer, setShowDetailsDrawer] = useState(false)
  const [selectedLog, setSelectedLog] = useState(null)

  const getStatusBadge = (status) => {
    const styles = {
      success: 'bg-green-100 text-green-700',
      failed: 'bg-red-100 text-red-700',
      warning: 'bg-orange-100 text-orange-700'
    }
    const icons = {
      success: CheckCircle,
      failed: XCircle,
      warning: AlertCircle
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
    { header: 'Log ID', accessorKey: 'id', cell: ({ row }) => <span className="font-mono text-xs text-blue-600">{row.original.id}</span> },
    { header: 'Automation', accessorKey: 'automation', cell: ({ row }) => <span className="font-semibold">{row.original.automation}</span> },
    { header: 'Status', accessorKey: 'status', cell: ({ row }) => getStatusBadge(row.original.status) },
    { header: 'Start Time', accessorKey: 'startTime', cell: ({ row }) => <span className="text-xs">{row.original.startTime}</span> },
    { header: 'Duration', accessorKey: 'duration', cell: ({ row }) => <span className="font-mono text-xs text-purple-600">{row.original.duration}</span> },
    { header: 'Triggered By', accessorKey: 'triggeredBy', cell: ({ row }) => <span className="text-xs text-gray-600">{row.original.triggeredBy}</span> },
    { 
      header: 'Actions', 
      accessorKey: 'actions',
      cell: ({ row }) => (
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-xl"
          onClick={() => {
            setSelectedLog(row.original)
            setShowDetailsDrawer(true)
          }}
        >
          <Eye className="w-3 h-3 mr-1" />
          Details
        </Button>
      )
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Trigger Logs" description="View detailed execution history of all automations" />

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search logs..." className="pl-10 rounded-xl" />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" className="rounded-xl">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {[
            { label: 'Total Runs', value: mockLogs.length, icon: Clock, gradient: 'from-blue-500 to-cyan-500' },
            { label: 'Success', value: mockLogs.filter(l => l.status === 'success').length, icon: CheckCircle, gradient: 'from-green-500 to-emerald-500' },
            { label: 'Failed', value: mockLogs.filter(l => l.status === 'failed').length, icon: XCircle, gradient: 'from-red-500 to-orange-500' },
            { label: 'Warnings', value: mockLogs.filter(l => l.status === 'warning').length, icon: AlertCircle, gradient: 'from-orange-500 to-yellow-500' }
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

        <Card className="rounded-3xl overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-bold">Execution History</h3>
          </div>
          <DataTable columns={columns} data={mockLogs} />
        </Card>

        {/* Details Drawer */}
        {showDetailsDrawer && selectedLog && (
          <div className="fixed inset-0 bg-black/50 flex items-end md:items-center md:justify-end z-50" onClick={() => setShowDetailsDrawer(false)}>
            <motion.div 
              initial={{ x: 400 }} 
              animate={{ x: 0 }}
              className="bg-white dark:bg-gray-900 w-full md:w-[500px] h-full md:h-full p-6 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold">{selectedLog.automation}</h3>
                  <p className="text-sm text-gray-600">{selectedLog.id}</p>
                </div>
                {getStatusBadge(selectedLog.status)}
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-600 mb-1">Triggered By</p>
                  <p className="font-semibold">{selectedLog.triggeredBy}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-600 mb-1">Start Time</p>
                    <p className="font-semibold text-sm">{selectedLog.startTime}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-600 mb-1">End Time</p>
                    <p className="font-semibold text-sm">{selectedLog.endTime}</p>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-xl">
                  <p className="text-xs text-purple-600 mb-1">Execution Duration</p>
                  <p className="font-bold text-2xl text-purple-700">{selectedLog.duration}</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-bold mb-3">Execution Details</h4>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-700">{selectedLog.details}</p>
                </div>
              </div>

              {selectedLog.status === 'failed' && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <h4 className="font-bold text-red-700 mb-2">Error Information</h4>
                  <p className="text-sm text-red-600">SMTP connection timeout after 15 seconds. Check email server configuration.</p>
                </div>
              )}

              <Button variant="outline" className="w-full mt-6" onClick={() => setShowDetailsDrawer(false)}>
                Close
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
