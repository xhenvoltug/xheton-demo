'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Monitor, Smartphone, Tablet, MapPin, Clock, Power, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'

const mockSessions = [
  { id: 'SES-001', user: 'Sarah Nambi', device: 'Windows 11 - Chrome', deviceType: 'desktop', ip: '192.168.1.45', location: 'Kampala, Uganda', loginTime: '2025-12-07 08:30:15', lastActive: '2025-12-07 14:32:15', duration: '6h 2m', status: 'active' },
  { id: 'SES-002', user: 'David Ochola', device: 'iPhone 15 - Safari', deviceType: 'mobile', ip: '192.168.1.78', location: 'Entebbe, Uganda', loginTime: '2025-12-07 09:15:42', lastActive: '2025-12-07 14:28:43', duration: '5h 13m', status: 'active' },
  { id: 'SES-003', user: 'Grace Akello', device: 'MacOS - Firefox', deviceType: 'desktop', ip: '192.168.1.92', location: 'Jinja, Uganda', loginTime: '2025-12-07 07:45:20', lastActive: '2025-12-07 14:15:22', duration: '6h 30m', status: 'active' },
  { id: 'SES-004', user: 'Mark Okello', device: 'iPad Pro - Safari', deviceType: 'tablet', ip: '192.168.1.103', location: 'Mbarara, Uganda', loginTime: '2025-12-07 10:20:18', lastActive: '2025-12-07 13:45:31', duration: '3h 25m', status: 'idle' },
  { id: 'SES-005', user: 'Admin User', device: 'Ubuntu - Chrome', deviceType: 'desktop', ip: '192.168.1.1', location: 'Kampala, Uganda', loginTime: '2025-12-07 06:00:00', lastActive: '2025-12-07 14:30:09', duration: '8h 30m', status: 'active' }
]

export default function UserSessions() {
  const [terminatingSession, setTerminatingSession] = useState(null)

  const getDeviceIcon = (deviceType) => {
    const icons = {
      desktop: Monitor,
      mobile: Smartphone,
      tablet: Tablet
    }
    return icons[deviceType] || Monitor
  }

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-700',
      idle: 'bg-yellow-100 text-yellow-700',
      expired: 'bg-gray-100 text-gray-700'
    }
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>{status}</span>
  }

  const handleTerminateSession = (sessionId) => {
    setTerminatingSession(sessionId)
    setTimeout(() => {
      alert(`Session ${sessionId} terminated successfully`)
      setTerminatingSession(null)
    }, 1000)
  }

  const columns = [
    { header: 'Session ID', accessorKey: 'id', cell: ({ row }) => <span className="font-mono text-xs text-blue-600">{row.original.id}</span> },
    { header: 'User', accessorKey: 'user' },
    { 
      header: 'Device', 
      accessorKey: 'device',
      cell: ({ row }) => {
        const Icon = getDeviceIcon(row.original.deviceType)
        return (
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{row.original.device}</span>
          </div>
        )
      }
    },
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
    { header: 'Duration', accessorKey: 'duration' },
    { header: 'Status', accessorKey: 'status', cell: ({ row }) => getStatusBadge(row.original.status) },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }) => (
        <Button 
          variant="outline" 
          size="sm" 
          className="text-red-600 hover:bg-red-50"
          onClick={() => handleTerminateSession(row.original.id)}
          disabled={terminatingSession === row.original.id}
        >
          <Power className="w-4 h-4 mr-1" />
          {terminatingSession === row.original.id ? 'Terminating...' : 'Terminate'}
        </Button>
      )
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="User Sessions" description="Monitor and manage active user sessions" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Sessions', value: mockSessions.filter(s => s.status === 'active').length, icon: Monitor, gradient: 'from-green-500 to-emerald-500' },
            { label: 'Idle Sessions', value: mockSessions.filter(s => s.status === 'idle').length, icon: Clock, gradient: 'from-yellow-500 to-orange-500' },
            { label: 'Mobile Devices', value: mockSessions.filter(s => s.deviceType === 'mobile').length, icon: Smartphone, gradient: 'from-blue-500 to-cyan-500' },
            { label: 'Desktop Users', value: mockSessions.filter(s => s.deviceType === 'desktop').length, icon: Monitor, gradient: 'from-purple-500 to-pink-500' }
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
          <DataTable columns={columns} data={mockSessions} />
        </Card>

        {/* Session Timeline */}
        <Card className="rounded-3xl p-6">
          <h3 className="text-lg font-bold mb-4">Session Timeline (Last 24 Hours)</h3>
          <div className="space-y-4">
            {mockSessions.slice(0, 3).map((session, idx) => (
              <motion.div 
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-4 border-l-4 border-blue-500 pl-4 py-2"
              >
                <div className="flex-1">
                  <p className="font-semibold">{session.user}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{session.device}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Login: {session.loginTime}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {session.location}
                    </span>
                  </div>
                </div>
                {getStatusBadge(session.status)}
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
