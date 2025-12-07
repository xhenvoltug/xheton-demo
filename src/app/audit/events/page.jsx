'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Zap, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'

const mockEvents = [
  { id: 'EVT-001', name: 'Daily Sales Report Generation', type: 'CRON', schedule: 'Daily at 23:59', lastRun: '2025-12-06 23:59:00', nextRun: '2025-12-07 23:59:00', duration: '2.3s', status: 'success' },
  { id: 'EVT-002', name: 'Inventory Stock Alert Check', type: 'Automation', schedule: 'Every 6 hours', lastRun: '2025-12-07 12:00:00', nextRun: '2025-12-07 18:00:00', duration: '1.8s', status: 'success' },
  { id: 'EVT-003', name: 'Payment Reminder Emails', type: 'Scheduled Task', schedule: 'Weekly on Monday 09:00', lastRun: '2025-12-02 09:00:00', nextRun: '2025-12-09 09:00:00', duration: '15.4s', status: 'success' },
  { id: 'EVT-004', name: 'Database Backup', type: 'CRON', schedule: 'Daily at 02:00', lastRun: '2025-12-07 02:00:00', nextRun: '2025-12-08 02:00:00', duration: '45.2s', status: 'success' },
  { id: 'EVT-005', name: 'Membership Renewal Check', type: 'Automation', schedule: 'Daily at 08:00', lastRun: '2025-12-07 08:00:00', nextRun: '2025-12-08 08:00:00', duration: '3.1s', status: 'pending' },
  { id: 'EVT-006', name: 'Payroll Auto-calculation', type: 'Scheduled Task', schedule: 'Last day of month 18:00', lastRun: '2025-11-30 18:00:00', nextRun: '2025-12-31 18:00:00', duration: '28.7s', status: 'success' },
  { id: 'EVT-007', name: 'Expired License Cleanup', type: 'CRON', schedule: 'Monthly on 1st 03:00', lastRun: '2025-12-01 03:00:00', nextRun: '2026-01-01 03:00:00', duration: '5.2s', status: 'failed' }
]

export default function SystemEvents() {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const getStatusBadge = (status) => {
    const styles = {
      success: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      failed: 'bg-red-100 text-red-700'
    }
    const icons = {
      success: CheckCircle,
      pending: Clock,
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

  const handleViewDetails = (event) => {
    setSelectedEvent(event)
    setShowModal(true)
  }

  const columns = [
    { header: 'Event ID', accessorKey: 'id', cell: ({ row }) => <span className="font-mono text-xs text-blue-600">{row.original.id}</span> },
    { header: 'Event Name', accessorKey: 'name' },
    { 
      header: 'Type', 
      accessorKey: 'type',
      cell: ({ row }) => (
        <span className="inline-flex items-center gap-1 text-sm">
          <Zap className="w-3 h-3 text-purple-600" />
          {row.original.type}
        </span>
      )
    },
    { header: 'Schedule', accessorKey: 'schedule' },
    { header: 'Last Run', accessorKey: 'lastRun', cell: ({ row }) => <span className="text-xs">{row.original.lastRun}</span> },
    { header: 'Next Run', accessorKey: 'nextRun', cell: ({ row }) => <span className="text-xs font-semibold">{row.original.nextRun}</span> },
    { header: 'Duration', accessorKey: 'duration' },
    { header: 'Status', accessorKey: 'status', cell: ({ row }) => getStatusBadge(row.original.status) },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }) => (
        <Button variant="outline" size="sm" onClick={() => handleViewDetails(row.original)}>
          <Eye className="w-4 h-4 mr-1" />
          Details
        </Button>
      )
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="System Events" description="Monitor background tasks, CRON jobs, and automations" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Events', value: mockEvents.length, icon: Zap, gradient: 'from-purple-500 to-pink-500' },
            { label: 'Successful', value: mockEvents.filter(e => e.status === 'success').length, icon: CheckCircle, gradient: 'from-green-500 to-emerald-500' },
            { label: 'Pending', value: mockEvents.filter(e => e.status === 'pending').length, icon: Clock, gradient: 'from-yellow-500 to-orange-500' },
            { label: 'Failed', value: mockEvents.filter(e => e.status === 'failed').length, icon: XCircle, gradient: 'from-red-500 to-rose-500' }
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
          <DataTable columns={columns} data={mockEvents} />
        </Card>

        {/* Event Detail Modal */}
        {showModal && selectedEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Event Details</h3>
                <Button variant="ghost" onClick={() => setShowModal(false)}>✕</Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Event ID</p>
                    <p className="font-mono text-blue-600">{selectedEvent.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                    <p className="font-semibold">{selectedEvent.type}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Event Name</p>
                  <p className="font-semibold text-lg">{selectedEvent.name}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Schedule</p>
                  <p className="font-semibold">{selectedEvent.schedule}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Last Run</p>
                    <p className="font-semibold">{selectedEvent.lastRun}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Next Run</p>
                    <p className="font-semibold">{selectedEvent.nextRun}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                    <p className="font-semibold">{selectedEvent.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    {getStatusBadge(selectedEvent.status)}
                  </div>
                </div>

                {selectedEvent.status === 'failed' && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-red-600">Error Details</p>
                        <p className="text-sm text-red-600 mt-1">Database connection timeout after 30 seconds. Retry scheduled in 5 minutes.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <Button className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600">Run Now</Button>
                <Button variant="outline" onClick={() => setShowModal(false)}>Close</Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
