'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Factory, Calendar, Clock, CheckCircle, AlertCircle, Package } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'

const mockManufacturingOrders = [
  { id: 'MO-2401', product: 'Office Desk Standard', qty: 10, bomId: 'BOM-001', stage: 'Production', wipCost: 4250000, scheduled: '2025-12-10', status: 'in-progress' },
  { id: 'MO-2402', product: 'Executive Chair Deluxe', qty: 25, bomId: 'BOM-002', stage: 'Quality Check', wipCost: 6875000, scheduled: '2025-12-08', status: 'in-progress' },
  { id: 'MO-2403', product: 'Conference Table 8-Seater', qty: 5, bomId: 'BOM-003', stage: 'Completed', wipCost: 6250000, scheduled: '2025-12-05', status: 'completed' },
  { id: 'MO-2404', product: 'Workstation Pod 4-Person', qty: 3, bomId: 'BOM-005', stage: 'Planning', wipCost: 6450000, scheduled: '2025-12-15', status: 'planned' },
  { id: 'MO-2405', product: 'Filing Cabinet Metal', qty: 20, bomId: 'BOM-004', stage: 'Production', wipCost: 3400000, scheduled: '2025-12-12', status: 'in-progress' }
]

export default function ManufacturingOrders() {
  const [showCreateModal, setShowCreateModal] = useState(false)

  const getStatusBadge = (status) => {
    const styles = {
      'planned': 'bg-blue-100 text-blue-700',
      'in-progress': 'bg-yellow-100 text-yellow-700',
      'completed': 'bg-green-100 text-green-700',
      'cancelled': 'bg-red-100 text-red-700'
    }
    return <span className={`px-3 py-1 ${styles[status]} rounded-full text-xs font-medium`}>{status}</span>
  }

  const getStageBadge = (stage) => {
    const styles = {
      'Planning': 'bg-gray-100 text-gray-700',
      'Production': 'bg-blue-100 text-blue-700',
      'Quality Check': 'bg-purple-100 text-purple-700',
      'Completed': 'bg-green-100 text-green-700'
    }
    return <span className={`px-3 py-1 ${styles[stage]} rounded-full text-xs font-medium`}>{stage}</span>
  }

  const columns = [
    { header: 'MO ID', accessorKey: 'id', cell: ({ row }) => <span className="font-mono font-bold text-blue-600">{row.original.id}</span> },
    { header: 'Product', accessorKey: 'product' },
    { header: 'Quantity', accessorKey: 'qty', cell: ({ row }) => <span className="font-bold">{row.original.qty} units</span> },
    { header: 'BOM', accessorKey: 'bomId', cell: ({ row }) => <span className="font-mono text-sm">{row.original.bomId}</span> },
    { header: 'Stage', accessorKey: 'stage', cell: ({ row }) => getStageBadge(row.original.stage) },
    { 
      header: 'WIP Cost', 
      accessorKey: 'wipCost',
      cell: ({ row }) => <span className="font-bold text-orange-600">UGX {row.original.wipCost.toLocaleString()}</span>
    },
    { header: 'Scheduled', accessorKey: 'scheduled' },
    { header: 'Status', accessorKey: 'status', cell: ({ row }) => getStatusBadge(row.original.status) }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Manufacturing Orders" description="Manage production orders and track work-in-progress" />

        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600" onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create MO
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total MOs', value: mockManufacturingOrders.length, icon: Factory, gradient: 'from-blue-500 to-cyan-500' },
            { label: 'In Production', value: mockManufacturingOrders.filter(m => m.status === 'in-progress').length, icon: Clock, gradient: 'from-yellow-500 to-amber-500' },
            { label: 'Completed', value: mockManufacturingOrders.filter(m => m.status === 'completed').length, icon: CheckCircle, gradient: 'from-green-500 to-emerald-500' },
            { label: 'Total WIP', value: 'UGX 27.2M', icon: Package, gradient: 'from-purple-500 to-pink-500' }
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

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="bg-gray-100 p-1 rounded-2xl">
            <TabsTrigger value="all" className="rounded-xl data-[state=active]:bg-white">All Orders</TabsTrigger>
            <TabsTrigger value="planned" className="rounded-xl data-[state=active]:bg-white">Planned</TabsTrigger>
            <TabsTrigger value="in-progress" className="rounded-xl data-[state=active]:bg-white">In Progress</TabsTrigger>
            <TabsTrigger value="completed" className="rounded-xl data-[state=active]:bg-white">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card className="rounded-3xl overflow-hidden">
              <DataTable columns={columns} data={mockManufacturingOrders} />
            </Card>
          </TabsContent>

          <TabsContent value="planned">
            <Card className="rounded-3xl overflow-hidden">
              <DataTable columns={columns} data={mockManufacturingOrders.filter(m => m.status === 'planned')} />
            </Card>
          </TabsContent>

          <TabsContent value="in-progress">
            <Card className="rounded-3xl overflow-hidden">
              <DataTable columns={columns} data={mockManufacturingOrders.filter(m => m.status === 'in-progress')} />
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card className="rounded-3xl overflow-hidden">
              <DataTable columns={columns} data={mockManufacturingOrders.filter(m => m.status === 'completed')} />
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-6 max-w-2xl w-full">
              <h3 className="text-xl font-bold mb-4">Create Manufacturing Order</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Product</label>
                    <select className="w-full px-4 py-2 border rounded-xl">
                      <option>Office Desk Standard (BOM-001)</option>
                      <option>Executive Chair Deluxe (BOM-002)</option>
                      <option>Conference Table 8-Seater (BOM-003)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Quantity to Produce</label>
                    <Input type="number" className="rounded-xl" placeholder="e.g., 10" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Scheduled Date</label>
                    <Input type="date" className="rounded-xl" defaultValue="2025-12-15" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Work Center</label>
                    <select className="w-full px-4 py-2 border rounded-xl">
                      <option>Assembly Line 1</option>
                      <option>Assembly Line 2</option>
                      <option>Finishing Station</option>
                    </select>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-2xl">
                  <p className="text-sm text-gray-700"><span className="font-bold">Estimated Cost:</span> UGX 450,000 per unit</p>
                  <p className="text-sm text-gray-700 mt-1"><span className="font-bold">Total WIP Cost:</span> UGX 4,500,000</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600">Create Order</Button>
                  <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
