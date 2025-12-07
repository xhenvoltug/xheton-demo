'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, FileText, DollarSign, Package, TrendingUp, Download, Copy } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'

const mockBOMs = [
  { id: 'BOM-001', product: 'Office Desk Standard', version: 'v1.2', totalCost: 450000, materials: 8, status: 'active', lastUpdated: '2025-12-05' },
  { id: 'BOM-002', product: 'Executive Chair Deluxe', version: 'v2.0', totalCost: 285000, materials: 12, status: 'active', lastUpdated: '2025-12-04' },
  { id: 'BOM-003', product: 'Conference Table 8-Seater', version: 'v1.0', totalCost: 1250000, materials: 15, status: 'active', lastUpdated: '2025-12-03' },
  { id: 'BOM-004', product: 'Filing Cabinet Metal', version: 'v1.1', totalCost: 175000, materials: 6, status: 'draft', lastUpdated: '2025-12-02' },
  { id: 'BOM-005', product: 'Workstation Pod 4-Person', version: 'v3.0', totalCost: 2150000, materials: 24, status: 'active', lastUpdated: '2025-12-01' }
]

export default function BillOfMaterials() {
  const [showCreateModal, setShowCreateModal] = useState(false)

  const getStatusBadge = (status) => {
    const styles = {
      'active': 'bg-green-100 text-green-700',
      'draft': 'bg-yellow-100 text-yellow-700',
      'archived': 'bg-gray-100 text-gray-700'
    }
    return <span className={`px-3 py-1 ${styles[status]} rounded-full text-xs font-medium`}>{status}</span>
  }

  const columns = [
    { header: 'BOM ID', accessorKey: 'id', cell: ({ row }) => <span className="font-mono font-bold text-blue-600">{row.original.id}</span> },
    { header: 'Product', accessorKey: 'product', cell: ({ row }) => <span className="font-medium">{row.original.product}</span> },
    { header: 'Version', accessorKey: 'version', cell: ({ row }) => <span className="font-mono text-sm">{row.original.version}</span> },
    { header: 'Materials', accessorKey: 'materials', cell: ({ row }) => <span className="text-gray-600">{row.original.materials} items</span> },
    { 
      header: 'Total Cost', 
      accessorKey: 'totalCost',
      cell: ({ row }) => <span className="font-bold text-green-600">UGX {row.original.totalCost.toLocaleString()}</span>
    },
    { header: 'Status', accessorKey: 'status', cell: ({ row }) => getStatusBadge(row.original.status) },
    { header: 'Last Updated', accessorKey: 'lastUpdated' }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Bill of Materials (BOM)" description="Manage product manufacturing recipes and cost structures" />

        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600" onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create BOM
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="flex gap-2">
            <Input className="rounded-xl w-64" placeholder="Search BOMs..." />
            <Button variant="outline" size="icon">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active BOMs', value: '4', icon: FileText, gradient: 'from-blue-500 to-cyan-500' },
            { label: 'Total Products', value: '5', icon: Package, gradient: 'from-green-500 to-emerald-500' },
            { label: 'Avg Cost', value: 'UGX 662K', icon: DollarSign, gradient: 'from-purple-500 to-pink-500' },
            { label: 'Draft BOMs', value: '1', icon: TrendingUp, gradient: 'from-yellow-500 to-amber-500' }
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
          <DataTable columns={columns} data={mockBOMs} />
        </Card>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-6 max-w-4xl w-full my-8">
              <h3 className="text-xl font-bold mb-4">Create Bill of Materials</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Name</label>
                    <Input className="rounded-xl" placeholder="e.g., Executive Desk XL" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Version</label>
                    <Input className="rounded-xl" placeholder="v1.0" defaultValue="v1.0" />
                  </div>
                </div>

                {/* Materials Table */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium">Materials & Components</label>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Material
                    </Button>
                  </div>
                  <div className="border rounded-2xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-3 text-sm font-medium">Material</th>
                          <th className="text-center p-3 text-sm font-medium">Qty</th>
                          <th className="text-right p-3 text-sm font-medium">Unit Cost (UGX)</th>
                          <th className="text-right p-3 text-sm font-medium">Total (UGX)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="p-3"><Input className="rounded-lg" placeholder="Wood - Oak" /></td>
                          <td className="p-3"><Input type="number" className="rounded-lg text-center" placeholder="5" /></td>
                          <td className="p-3"><Input type="number" className="rounded-lg text-right" placeholder="25000" /></td>
                          <td className="p-3 text-right font-bold">UGX 0</td>
                        </tr>
                      </tbody>
                      <tfoot className="bg-gray-50 border-t-2 font-bold">
                        <tr>
                          <td colSpan={3} className="p-3">TOTAL COST</td>
                          <td className="p-3 text-right text-green-600">UGX 0</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600">Create BOM</Button>
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
