'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, AlertTriangle, Ban, Eye, MapPin, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'

const mockAlerts = [
  { id: 'ALT-001', type: 'Suspicious Login', user: 'Unknown User', ip: '45.234.12.89', location: 'Lagos, Nigeria', timestamp: '2025-12-07 14:45:22', severity: 'high', action: 'Block IP', status: 'pending' },
  { id: 'ALT-002', type: 'Multiple Failed Attempts', user: 'grace.akello@company.ug', ip: '192.168.1.92', location: 'Jinja, Uganda', timestamp: '2025-12-07 13:12:15', severity: 'medium', action: 'Notify User', status: 'resolved' },
  { id: 'ALT-003', type: 'Unauthorized Access', user: 'david.ochola@company.ug', ip: '192.168.1.78', location: 'Entebbe, Uganda', timestamp: '2025-12-07 11:30:45', severity: 'critical', action: 'Suspend Account', status: 'investigating' },
  { id: 'ALT-004', type: 'Suspicious Login', user: 'Unknown User', ip: '103.45.78.123', location: 'Mumbai, India', timestamp: '2025-12-07 09:22:38', severity: 'high', action: 'Block IP', status: 'blocked' },
  { id: 'ALT-005', type: 'Multiple Failed Attempts', user: 'mark.okello@company.ug', ip: '192.168.1.103', location: 'Mbarara, Uganda', timestamp: '2025-12-07 08:15:12', severity: 'low', action: 'Monitor', status: 'resolved' }
]

export default function SecurityAlerts() {
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const getSeverityBadge = (severity) => {
    const styles = {
      critical: 'bg-red-100 text-red-700 border-red-300',
      high: 'bg-orange-100 text-orange-700 border-orange-300',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      low: 'bg-blue-100 text-blue-700 border-blue-300'
    }
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[severity]}`}>{severity}</span>
  }

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      investigating: 'bg-blue-100 text-blue-700',
      resolved: 'bg-green-100 text-green-700',
      blocked: 'bg-red-100 text-red-700'
    }
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>{status}</span>
  }

  const handleViewDetails = (alert) => {
    setSelectedAlert(alert)
    setShowModal(true)
  }

  const columns = [
    { header: 'Alert ID', accessorKey: 'id', cell: ({ row }) => <span className="font-mono text-xs text-red-600">{row.original.id}</span> },
    { 
      header: 'Type', 
      accessorKey: 'type',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-500" />
          <span className="font-semibold">{row.original.type}</span>
        </div>
      )
    },
    { header: 'User/Email', accessorKey: 'user' },
    { header: 'IP Address', accessorKey: 'ip', cell: ({ row }) => <span className="font-mono text-xs">{row.original.ip}</span> },
    { 
      header: 'Location', 
      accessorKey: 'location',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-gray-400" />
          <span className="text-sm">{row.original.location}</span>
        </div>
      )
    },
    { header: 'Timestamp', accessorKey: 'timestamp', cell: ({ row }) => <span className="text-xs">{row.original.timestamp}</span> },
    { header: 'Severity', accessorKey: 'severity', cell: ({ row }) => getSeverityBadge(row.original.severity) },
    { header: 'Status', accessorKey: 'status', cell: ({ row }) => getStatusBadge(row.original.status) },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }) => (
        <Button variant="outline" size="sm" onClick={() => handleViewDetails(row.original)}>
          <Eye className="w-4 h-4 mr-1" />
          View
        </Button>
      )
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Security Alerts" description="Monitor and respond to security threats and suspicious activities" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Alerts', value: mockAlerts.length, icon: Shield, gradient: 'from-purple-500 to-pink-500' },
            { label: 'Critical', value: mockAlerts.filter(a => a.severity === 'critical').length, icon: AlertTriangle, gradient: 'from-red-500 to-rose-500' },
            { label: 'Pending', value: mockAlerts.filter(a => a.status === 'pending').length, icon: Clock, gradient: 'from-yellow-500 to-orange-500' },
            { label: 'Blocked', value: mockAlerts.filter(a => a.status === 'blocked').length, icon: Ban, gradient: 'from-gray-500 to-slate-500' }
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
          <DataTable columns={columns} data={mockAlerts} />
        </Card>

        {/* Alert Detail Modal */}
        {showModal && selectedAlert && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Shield className="w-6 h-6 text-red-600" />
                  Security Alert Details
                </h3>
                <Button variant="ghost" onClick={() => setShowModal(false)}>✕</Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Alert ID</p>
                    <p className="font-mono text-red-600">{selectedAlert.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                    <p className="font-semibold">{selectedAlert.type}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Severity</p>
                    {getSeverityBadge(selectedAlert.severity)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    {getStatusBadge(selectedAlert.status)}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">User/Email</p>
                  <p className="font-semibold">{selectedAlert.user}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">IP Address</p>
                    <p className="font-mono text-sm">{selectedAlert.ip}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                    <p className="font-semibold">{selectedAlert.location}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Timestamp</p>
                  <p className="font-semibold">{selectedAlert.timestamp}</p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
                  <p className="font-semibold text-orange-700 dark:text-orange-400">Recommended Action</p>
                  <p className="text-sm text-orange-600 dark:text-orange-300 mt-1">{selectedAlert.action}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button className="flex-1 bg-gradient-to-r from-red-600 to-rose-600">
                  <Ban className="w-4 h-4 mr-2" />
                  Block IP
                </Button>
                <Button variant="outline" className="flex-1">Ignore</Button>
                <Button variant="outline" onClick={() => setShowModal(false)}>Close</Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
