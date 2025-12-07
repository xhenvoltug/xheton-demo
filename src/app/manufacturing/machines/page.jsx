'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Wrench, AlertCircle, CheckCircle, Clock, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'

const mockMachines = [
  { id: 'MCH-001', name: 'CNC Router #1', type: 'Cutting', status: 'operational', downtime: 0, nextMaintenance: '2025-12-15', utilizationRate: 85 },
  { id: 'MCH-002', name: 'Assembly Station #2', type: 'Assembly', status: 'operational', downtime: 0, nextMaintenance: '2025-12-20', utilizationRate: 72 },
  { id: 'MCH-003', name: 'Welding Station #1', type: 'Welding', status: 'maintenance', downtime: 3, nextMaintenance: '2025-12-08', utilizationRate: 0 },
  { id: 'MCH-004', name: 'Paint Booth #1', type: 'Finishing', status: 'operational', downtime: 0, nextMaintenance: '2025-12-18', utilizationRate: 65 },
  { id: 'MCH-005', name: 'QC Inspection Station', type: 'Quality Control', status: 'operational', downtime: 0, nextMaintenance: '2025-12-25', utilizationRate: 90 }
]

const maintenanceHistory = [
  { date: '2025-12-05', machine: 'CNC Router #1', type: 'Preventive', cost: 450000, technician: 'James Otieno', duration: '4 hours' },
  { date: '2025-12-03', machine: 'Welding Station #1', type: 'Breakdown', cost: 850000, technician: 'Sarah Wanjiru', duration: '8 hours' },
  { date: '2025-12-01', machine: 'Paint Booth #1', type: 'Preventive', cost: 320000, technician: 'James Otieno', duration: '3 hours' }
]

export default function Machines() {
  const [showAddModal, setShowAddModal] = useState(false)

  const getStatusBadge = (status) => {
    const styles = {
      'operational': 'bg-green-100 text-green-700',
      'maintenance': 'bg-yellow-100 text-yellow-700',
      'down': 'bg-red-100 text-red-700'
    }
    const icons = {
      'operational': <CheckCircle className="w-3 h-3 mr-1" />,
      'maintenance': <Clock className="w-3 h-3 mr-1" />,
      'down': <AlertCircle className="w-3 h-3 mr-1" />
    }
    return (
      <span className={`px-3 py-1 ${styles[status]} rounded-full text-xs font-medium inline-flex items-center`}>
        {icons[status]}
        {status}
      </span>
    )
  }

  const columns = [
    { header: 'Machine ID', accessorKey: 'id', cell: ({ row }) => <span className="font-mono font-bold text-blue-600">{row.original.id}</span> },
    { header: 'Machine Name', accessorKey: 'name', cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
    { header: 'Type', accessorKey: 'type' },
    { 
      header: 'Utilization', 
      accessorKey: 'utilizationRate',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="w-24 bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${row.original.utilizationRate > 80 ? 'bg-green-600' : row.original.utilizationRate > 50 ? 'bg-yellow-600' : 'bg-red-600'}`}
              style={{ width: `${row.original.utilizationRate}%` }}
            ></div>
          </div>
          <span className="text-xs font-medium">{row.original.utilizationRate}%</span>
        </div>
      )
    },
    { header: 'Downtime (hrs)', accessorKey: 'downtime', cell: ({ row }) => <span className="font-bold text-red-600">{row.original.downtime}</span> },
    { 
      header: 'Next Maintenance', 
      accessorKey: 'nextMaintenance',
      cell: ({ row }) => (
        <span className="flex items-center gap-1 text-sm">
          <Calendar className="w-3 h-3 text-gray-400" />
          {row.original.nextMaintenance}
        </span>
      )
    },
    { header: 'Status', accessorKey: 'status', cell: ({ row }) => getStatusBadge(row.original.status) }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Machines & Work Centers" description="Manage equipment, track downtime, and schedule maintenance" />

        <div className="flex items-center justify-between">
          <Button className="bg-gradient-to-r from-blue-600 to-cyan-600" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Machine
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Machines', value: mockMachines.length, icon: Wrench, gradient: 'from-blue-500 to-cyan-500' },
            { label: 'Operational', value: mockMachines.filter(m => m.status === 'operational').length, icon: CheckCircle, gradient: 'from-green-500 to-emerald-500' },
            { label: 'In Maintenance', value: mockMachines.filter(m => m.status === 'maintenance').length, icon: Clock, gradient: 'from-yellow-500 to-amber-500' },
            { label: 'Avg Utilization', value: '78%', icon: Wrench, gradient: 'from-purple-500 to-pink-500' }
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
          <DataTable columns={columns} data={mockMachines} />
        </Card>

        {/* Maintenance History */}
        <Card className="rounded-3xl p-6">
          <h3 className="font-bold mb-4">Recent Maintenance History</h3>
          <div className="space-y-3">
            {maintenanceHistory.map((record, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${record.type === 'Preventive' ? 'bg-blue-100' : 'bg-red-100'} rounded-xl flex items-center justify-center`}>
                    <Wrench className={`w-6 h-6 ${record.type === 'Preventive' ? 'text-blue-600' : 'text-red-600'}`} />
                  </div>
                  <div>
                    <p className="font-bold">{record.machine}</p>
                    <p className="text-sm text-gray-600">{record.type} Maintenance • {record.duration}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">UGX {record.cost.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{record.date} • {record.technician}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Add Machine Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-6 max-w-2xl w-full">
              <h3 className="text-xl font-bold mb-4">Add New Machine</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Machine Name</label>
                    <Input className="rounded-xl" placeholder="e.g., CNC Router #2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Machine Type</label>
                    <select className="w-full px-4 py-2 border rounded-xl">
                      <option>Cutting</option>
                      <option>Assembly</option>
                      <option>Welding</option>
                      <option>Finishing</option>
                      <option>Quality Control</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Purchase Date</label>
                    <Input type="date" className="rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Maintenance Interval (days)</label>
                    <Input type="number" className="rounded-xl" placeholder="e.g., 30" />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600">Add Machine</Button>
                  <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
