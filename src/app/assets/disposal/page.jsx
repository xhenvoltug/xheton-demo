'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trash2, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'

const mockDisposals = [
  { id: 'DISP-001', assetId: 'AST-099', assetName: 'Old Dell Desktop PC', purchaseCost: 2500000, nbv: 150000, disposalValue: 200000, gain: 50000, date: '2025-11-15', reason: 'Obsolete' },
  { id: 'DISP-002', assetId: 'AST-098', assetName: 'Wooden Filing Cabinet', purchaseCost: 850000, nbv: 100000, disposalValue: 50000, gain: -50000, date: '2025-10-20', reason: 'Damaged beyond repair' }
]

export default function Disposal() {
  const [showDisposeModal, setShowDisposeModal] = useState(false)

  const columns = [
    { header: 'Disposal ID', accessorKey: 'id', cell: ({ row }) => <span className="font-mono font-bold text-blue-600">{row.original.id}</span> },
    { header: 'Asset Name', accessorKey: 'assetName' },
    { header: 'Purchase Cost', accessorKey: 'purchaseCost', cell: ({ row }) => <span>UGX {row.original.purchaseCost.toLocaleString()}</span> },
    { header: 'NBV', accessorKey: 'nbv', cell: ({ row }) => <span>UGX {row.original.nbv.toLocaleString()}</span> },
    { header: 'Disposal Value', accessorKey: 'disposalValue', cell: ({ row }) => <span className="font-bold">UGX {row.original.disposalValue.toLocaleString()}</span> },
    { 
      header: 'Gain/(Loss)', 
      accessorKey: 'gain',
      cell: ({ row }) => (
        <span className={`font-bold ${row.original.gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          UGX {row.original.gain >= 0 ? '+' : ''}{row.original.gain.toLocaleString()}
        </span>
      )
    },
    { header: 'Date', accessorKey: 'date' },
    { header: 'Reason', accessorKey: 'reason' }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Asset Disposal & Write-Off" description="Manage asset disposal with gain/loss calculations" />

        <div className="flex items-center justify-between">
          <Button className="bg-gradient-to-r from-red-600 to-orange-600" onClick={() => setShowDisposeModal(true)}>
            <Trash2 className="w-4 h-4 mr-2" />
            Dispose Asset
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Total Disposed', value: mockDisposals.length, icon: Trash2, gradient: 'from-gray-500 to-slate-500' },
            { label: 'Total Gains', value: 'UGX 50K', icon: TrendingUp, gradient: 'from-green-500 to-emerald-500' },
            { label: 'Total Losses', value: 'UGX 50K', icon: TrendingDown, gradient: 'from-red-500 to-orange-500' }
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
          <DataTable columns={columns} data={mockDisposals} />
        </Card>

        {/* Dispose Modal */}
        {showDisposeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-6 max-w-2xl w-full">
              <h3 className="text-xl font-bold mb-4">Dispose Asset</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Asset</label>
                  <select className="w-full px-4 py-2 border rounded-xl">
                    <option>AST-001 - Dell Laptop Latitude 5420</option>
                    <option>AST-003 - HP Printer LaserJet Pro</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Disposal Value (UGX)</label>
                    <Input type="number" className="rounded-xl" placeholder="e.g., 500000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Disposal Date</label>
                    <Input type="date" className="rounded-xl" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Reason for Disposal</label>
                  <Textarea className="rounded-xl" rows={2} placeholder="e.g., End of useful life, Damaged, Obsolete..." />
                </div>

                <div className="bg-yellow-50 p-4 rounded-2xl">
                  <p className="text-sm"><span className="font-bold">Current NBV:</span> UGX 3,600,000</p>
                  <p className="text-sm mt-1"><span className="font-bold">Estimated Gain/(Loss):</span> <span className="text-green-600">UGX +0</span></p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-gradient-to-r from-red-600 to-orange-600">Process Disposal</Button>
                  <Button variant="outline" onClick={() => setShowDisposeModal(false)}>Cancel</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
