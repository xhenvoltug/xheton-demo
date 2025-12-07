'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Download, Filter, Eye, UserCheck, LogIn, LogOut, Edit, Trash2, Shield, DollarSign } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'

const mockLogs = [
  { id: 'LOG-001', timestamp: '2025-12-07 14:32:15', user: 'Sarah Nambi', action: 'Login', module: 'Authentication', details: 'Successful login from 192.168.1.45', severity: 'info' },
  { id: 'LOG-002', timestamp: '2025-12-07 14:28:43', user: 'David Ochola', action: 'Create', module: 'Sales', details: 'Created invoice INV-2025-1234', severity: 'info' },
  { id: 'LOG-003', timestamp: '2025-12-07 14:15:22', user: 'Grace Akello', action: 'Update', module: 'Inventory', details: 'Updated product SKU-8923 quantity from 150 to 200', severity: 'info' },
  { id: 'LOG-004', timestamp: '2025-12-07 14:02:18', user: 'Mark Okello', action: 'Delete', module: 'Purchases', details: 'Deleted draft purchase order PO-DRAFT-456', severity: 'warning' },
  { id: 'LOG-005', timestamp: '2025-12-07 13:45:31', user: 'Admin User', action: 'Permissions', module: 'Settings', details: 'Updated role permissions for Sales Manager', severity: 'critical' },
  { id: 'LOG-006', timestamp: '2025-12-07 13:30:09', user: 'Patricia Nanteza', action: 'Financial', module: 'Payments', details: 'Processed payment of UGX 2,500,000 to supplier SUP-001', severity: 'critical' },
  { id: 'LOG-007', timestamp: '2025-12-07 13:12:55', user: 'James Mugisha', action: 'Logout', module: 'Authentication', details: 'User logged out from session', severity: 'info' }
]

export default function ActivityLogs() {
  const [selectedLog, setSelectedLog] = useState(null)
  const [showDrawer, setShowDrawer] = useState(false)

  const getActionIcon = (action) => {
    const icons = {
      Login: LogIn,
      Logout: LogOut,
      Create: UserCheck,
      Update: Edit,
      Delete: Trash2,
      Permissions: Shield,
      Financial: DollarSign
    }
    return icons[action] || UserCheck
  }

  const getSeverityBadge = (severity) => {
    const styles = {
      info: 'bg-blue-100 text-blue-700',
      warning: 'bg-yellow-100 text-yellow-700',
      critical: 'bg-red-100 text-red-700'
    }
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[severity]}`}>{severity}</span>
  }

  const handleViewDetails = (log) => {
    setSelectedLog(log)
    setShowDrawer(true)
  }

  const columns = [
    { header: 'Log ID', accessorKey: 'id', cell: ({ row }) => <span className="font-mono text-xs text-blue-600">{row.original.id}</span> },
    { header: 'Timestamp', accessorKey: 'timestamp', cell: ({ row }) => <span className="text-sm">{row.original.timestamp}</span> },
    { header: 'User', accessorKey: 'user' },
    { 
      header: 'Action', 
      accessorKey: 'action',
      cell: ({ row }) => {
        const Icon = getActionIcon(row.original.action)
        return (
          <span className="inline-flex items-center gap-2">
            <Icon className="w-4 h-4 text-gray-500" />
            {row.original.action}
          </span>
        )
      }
    },
    { header: 'Module', accessorKey: 'module' },
    { header: 'Severity', accessorKey: 'severity', cell: ({ row }) => getSeverityBadge(row.original.severity) },
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
        <PageHeader title="Activity Logs" description="Monitor all system activities and user actions" />

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search logs..." className="pl-10 rounded-xl" />
            </div>
            <Button variant="outline" className="rounded-xl">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Logs', value: mockLogs.length, icon: UserCheck, gradient: 'from-blue-500 to-cyan-500' },
            { label: 'Critical Events', value: mockLogs.filter(l => l.severity === 'critical').length, icon: Shield, gradient: 'from-red-500 to-rose-500' },
            { label: 'Warnings', value: mockLogs.filter(l => l.severity === 'warning').length, icon: Edit, gradient: 'from-yellow-500 to-orange-500' },
            { label: 'Info Events', value: mockLogs.filter(l => l.severity === 'info').length, icon: UserCheck, gradient: 'from-green-500 to-emerald-500' }
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
          <DataTable columns={columns} data={mockLogs} />
        </Card>

        {/* Side Drawer */}
        {showDrawer && selectedLog && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end" onClick={() => setShowDrawer(false)}>
            <motion.div 
              initial={{ x: 400 }} 
              animate={{ x: 0 }} 
              className="bg-white dark:bg-gray-900 w-full md:w-96 h-full p-6 overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Log Details</h3>
                <Button variant="ghost" onClick={() => setShowDrawer(false)}>✕</Button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Log ID</p>
                  <p className="font-mono text-blue-600">{selectedLog.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Timestamp</p>
                  <p className="font-semibold">{selectedLog.timestamp}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">User</p>
                  <p className="font-semibold">{selectedLog.user}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Action</p>
                  <p className="font-semibold">{selectedLog.action}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Module</p>
                  <p className="font-semibold">{selectedLog.module}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Severity</p>
                  {getSeverityBadge(selectedLog.severity)}
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Details</p>
                  <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mt-1">{selectedLog.details}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
