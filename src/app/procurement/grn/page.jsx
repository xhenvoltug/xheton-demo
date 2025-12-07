'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Plus, Search, Package, CheckCircle, AlertTriangle, FileText } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'

const mockGRNs = [
  { id: 'GRN-3401', poId: 'PO-5787', supplier: 'Local Hardware Co.', date: '2025-12-06', items: 25, received: 23, variance: 2, status: 'partial' },
  { id: 'GRN-3402', poId: 'PO-5789', supplier: 'Global Tech Supplies Ltd.', date: '2025-12-05', items: 12, received: 12, variance: 0, status: 'complete' },
  { id: 'GRN-3403', poId: 'PO-5785', supplier: 'Budget Supplies LLC', date: '2025-12-04', items: 18, received: 16, variance: 2, status: 'complete' },
  { id: 'GRN-3404', poId: 'PO-5786', supplier: 'Fast Track Logistics', date: '2025-12-03', items: 5, received: 5, variance: 0, status: 'complete' }
]

const mockPOsForReceiving = [
  { id: 'PO-5787', supplier: 'Local Hardware Co.', items: 25 },
  { id: 'PO-5789', supplier: 'Global Tech Supplies Ltd.', items: 12 },
  { id: 'PO-5786', supplier: 'Fast Track Logistics', items: 5 }
]

export default function GoodsReceiving() {
  const router = useRouter()
  const [showWizard, setShowWizard] = useState(false)
  const [wizardStep, setWizardStep] = useState(1)
  const [selectedPO, setSelectedPO] = useState(null)
  const [showDamageModal, setShowDamageModal] = useState(false)

  const getStatusBadge = (status) => {
    const badges = {
      complete: 'bg-green-100 text-green-700',
      partial: 'bg-yellow-100 text-yellow-700',
      pending: 'bg-blue-100 text-blue-700'
    }
    return badges[status] || badges.pending
  }

  const columns = [
    {
      header: 'GRN Number',
      accessorKey: 'id',
      cell: ({ row }) => (
        <span className="font-mono text-blue-600 font-semibold">{row.original.id}</span>
      )
    },
    {
      header: 'PO Number',
      accessorKey: 'poId',
      cell: ({ row }) => (
        <span className="font-mono text-gray-600">{row.original.poId}</span>
      )
    },
    { header: 'Supplier', accessorKey: 'supplier' },
    { header: 'Date', accessorKey: 'date' },
    {
      header: 'Items',
      accessorKey: 'items',
      cell: ({ row }) => `${row.original.received}/${row.original.items}`
    },
    {
      header: 'Variance',
      accessorKey: 'variance',
      cell: ({ row }) => (
        <span className={row.original.variance > 0 ? 'text-red-600 font-semibold' : 'text-green-600'}>
          {row.original.variance > 0 ? `- ${row.original.variance}` : '0'}
        </span>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(row.original.status)}`}>
          {row.original.status}
        </span>
      )
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Goods Receiving Notes (GRN)"
          description="Track and manage incoming deliveries"
        />

        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <Button
            className="bg-gradient-to-r from-green-600 to-emerald-600"
            onClick={() => setShowWizard(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create GRN
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              <p className="text-blue-100 text-sm font-medium">Total GRNs</p>
              <h3 className="text-4xl font-bold mt-2">{mockGRNs.length}</h3>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-500 text-white">
              <p className="text-green-100 text-sm font-medium">Complete</p>
              <h3 className="text-4xl font-bold mt-2">
                {mockGRNs.filter(g => g.status === 'complete').length}
              </h3>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 rounded-3xl bg-gradient-to-br from-yellow-500 to-amber-500 text-white">
              <p className="text-yellow-100 text-sm font-medium">Partial Receipts</p>
              <h3 className="text-4xl font-bold mt-2">
                {mockGRNs.filter(g => g.status === 'partial').length}
              </h3>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 rounded-3xl bg-gradient-to-br from-red-500 to-orange-500 text-white">
              <p className="text-red-100 text-sm font-medium">Total Variance</p>
              <h3 className="text-4xl font-bold mt-2">
                {mockGRNs.reduce((sum, g) => sum + g.variance, 0)}
              </h3>
            </Card>
          </motion.div>
        </div>

        {/* GRN Table */}
        <Card className="rounded-3xl overflow-hidden">
          <DataTable columns={columns} data={mockGRNs} />
        </Card>

        {/* Receiving Wizard */}
        {showWizard && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Step Indicator */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Create Goods Receiving Note</h3>
                <Button variant="ghost" onClick={() => setShowWizard(false)}>✕</Button>
              </div>

              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          wizardStep >= step
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {step}
                      </div>
                      {step < 3 && (
                        <div className={`w-16 h-1 ${wizardStep > step ? 'bg-blue-600' : 'bg-gray-200'}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 1: Select PO */}
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Step 1: Select Purchase Order</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {mockPOsForReceiving.map((po) => (
                      <div
                        key={po.id}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          selectedPO?.id === po.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => setSelectedPO(po)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-mono font-bold text-blue-600">{po.id}</p>
                            <p className="text-sm text-gray-600">{po.supplier}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Items</p>
                            <p className="font-bold">{po.items}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <Button
                      disabled={!selectedPO}
                      onClick={() => setWizardStep(2)}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600"
                    >
                      Next Step
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Enter Items */}
              {wizardStep === 2 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Step 2: Scan/Enter Items</h4>
                  <div className="bg-blue-50 p-4 rounded-2xl mb-4">
                    <p className="text-sm font-medium text-blue-900">
                      PO: {selectedPO?.id} | Supplier: {selectedPO?.supplier}
                    </p>
                  </div>

                  <div>
                    <Label>Scan Barcode or Enter SKU</Label>
                    <Input className="mt-2 rounded-xl" placeholder="Scan or type SKU..." />
                  </div>

                  <div className="border rounded-2xl p-4 bg-gray-50">
                    <p className="text-sm font-medium text-gray-600 mb-3">Items to Receive:</p>
                    <div className="space-y-2">
                      {Array.from({ length: 3 }, (_, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-xl">
                          <div className="flex-1">
                            <p className="font-semibold">Item {idx + 1}</p>
                            <p className="text-xs text-gray-500">SKU-{1000 + idx}</p>
                          </div>
                          <Input
                            type="number"
                            className="w-20 rounded-xl"
                            placeholder="Qty"
                            defaultValue={10 + idx}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setWizardStep(1)}>
                      Back
                    </Button>
                    <Button
                      onClick={() => setWizardStep(3)}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600"
                    >
                      Next Step
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Confirm */}
              {wizardStep === 3 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Step 3: Confirm Received Quantities</h4>
                  
                  <Card className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <p className="font-semibold text-green-900">Ready to Create GRN</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">PO Number:</span>
                        <span className="font-mono font-bold">{selectedPO?.id}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Supplier:</span>
                        <span className="font-semibold">{selectedPO?.supplier}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Items Received:</span>
                        <span className="font-bold text-green-600">3/3</span>
                      </div>
                    </div>
                  </Card>

                  <div>
                    <Label>Delivery Notes (Optional)</Label>
                    <Textarea className="mt-2 rounded-xl" rows={3} placeholder="Any observations or notes..." />
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowDamageModal(true)}
                    >
                      <AlertTriangle className="w-4 h-4 mr-2 text-yellow-600" />
                      Report Damage
                    </Button>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setWizardStep(2)}>
                      Back
                    </Button>
                    <Button
                      onClick={() => {
                        setShowWizard(false)
                        setWizardStep(1)
                        setSelectedPO(null)
                      }}
                      className="bg-gradient-to-r from-green-600 to-emerald-600"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Complete GRN
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Damage Report Modal */}
        {showDamageModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-6 max-w-lg w-full"
            >
              <h3 className="text-xl font-bold mb-4">Report Damage</h3>
              <div className="space-y-4">
                <div>
                  <Label>Item</Label>
                  <Input className="mt-2 rounded-xl" placeholder="Select item..." />
                </div>
                <div>
                  <Label>Quantity Damaged</Label>
                  <Input type="number" className="mt-2 rounded-xl" placeholder="0" />
                </div>
                <div>
                  <Label>Damage Description</Label>
                  <Textarea className="mt-2 rounded-xl" rows={3} placeholder="Describe the damage..." />
                </div>
                <div className="flex gap-3">
                  <Button
                    className="flex-1 bg-gradient-to-r from-red-600 to-orange-600"
                    onClick={() => setShowDamageModal(false)}
                  >
                    Submit Report
                  </Button>
                  <Button variant="outline" onClick={() => setShowDamageModal(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
