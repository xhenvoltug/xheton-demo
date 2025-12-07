'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRightLeft, Plus, MapPin, User, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'

const mockTransfers = [
  { id: 'TRF-001', assetId: 'AST-002', assetName: 'Toyota Hilux 2023', fromBranch: 'Head Office - Kampala', toBranch: 'Mbarara Branch', fromKeeper: 'Sarah Nambi', toKeeper: 'David Ochola', date: '2025-11-28', reason: 'Branch expansion', status: 'completed' },
  { id: 'TRF-002', assetId: 'AST-004', assetName: 'Conference Table', fromBranch: 'Jinja Branch', toBranch: 'Head Office - Kampala', fromKeeper: 'Grace Akello', toKeeper: 'Mark Okello', date: '2025-12-01', reason: 'Office renovation', status: 'pending' }
]

export default function Transfers() {
  const [showTransferModal, setShowTransferModal] = useState(false)

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      inTransit: 'bg-blue-100 text-blue-700'
    }
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || styles.pending}`}>{status}</span>
  }

  const columns = [
    { header: 'Transfer ID', accessorKey: 'id', cell: ({ row }) => <span className="font-mono font-bold text-blue-600">{row.original.id}</span> },
    { header: 'Asset', accessorKey: 'assetName' },
    { header: 'From Branch', accessorKey: 'fromBranch' },
    { header: 'To Branch', accessorKey: 'toBranch' },
    { header: 'From Keeper', accessorKey: 'fromKeeper' },
    { header: 'To Keeper', accessorKey: 'toKeeper' },
    { header: 'Date', accessorKey: 'date' },
    { header: 'Status', accessorKey: 'status', cell: ({ row }) => getStatusBadge(row.original.status) }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Asset Transfers" description="Track inter-branch asset movements and keeper reassignments" />

        <div className="flex items-center justify-between">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600" onClick={() => setShowTransferModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Transfer
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Transfers', value: mockTransfers.length, icon: ArrowRightLeft, gradient: 'from-purple-500 to-pink-500' },
            { label: 'Completed', value: 1, icon: ArrowRightLeft, gradient: 'from-green-500 to-emerald-500' },
            { label: 'Pending', value: 1, icon: Calendar, gradient: 'from-yellow-500 to-orange-500' },
            { label: 'In Transit', value: 0, icon: MapPin, gradient: 'from-blue-500 to-cyan-500' }
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
          <DataTable columns={columns} data={mockTransfers} />
        </Card>

        {/* Transfer Modal */}
        {showTransferModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-6 max-w-2xl w-full">
              <h3 className="text-xl font-bold mb-4">Create Asset Transfer</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Asset(s)</label>
                  <select className="w-full px-4 py-2 border rounded-xl" multiple>
                    <option>AST-001 - Dell Laptop Latitude 5420</option>
                    <option>AST-002 - Toyota Hilux 2023</option>
                    <option>AST-003 - HP Printer LaserJet Pro</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple assets</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">From Branch</label>
                    <select className="w-full px-4 py-2 border rounded-xl">
                      <option>Head Office - Kampala</option>
                      <option>Mbarara Branch</option>
                      <option>Jinja Branch</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">To Branch</label>
                    <select className="w-full px-4 py-2 border rounded-xl">
                      <option>Mbarara Branch</option>
                      <option>Jinja Branch</option>
                      <option>Head Office - Kampala</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">From Keeper</label>
                    <select className="w-full px-4 py-2 border rounded-xl">
                      <option>Sarah Nambi</option>
                      <option>David Ochola</option>
                      <option>Grace Akello</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">To Keeper</label>
                    <select className="w-full px-4 py-2 border rounded-xl">
                      <option>David Ochola</option>
                      <option>Mark Okello</option>
                      <option>Patricia Nanteza</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Transfer Date</label>
                    <Input type="date" className="rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Expected Arrival</label>
                    <Input type="date" className="rounded-xl" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Transfer Reason</label>
                  <Textarea className="rounded-xl" rows={2} placeholder="e.g., Branch expansion, Staff relocation, Equipment sharing..." />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600">Create Transfer</Button>
                  <Button variant="outline" onClick={() => setShowTransferModal(false)}>Cancel</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
