'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Upload, Package, DollarSign, Calendar, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'

const mockAssets = [
  { id: 'AST-001', name: 'Dell Laptop Latitude 5420', category: 'IT Equipment', serialNo: 'SN-LAP-2024-001', purchaseDate: '2024-03-15', purchaseCost: 4500000, currentValue: 3600000, warranty: '2026-03-15', status: 'active', keeper: 'John Mwangi' },
  { id: 'AST-002', name: 'Toyota Hilux 2023', category: 'Vehicles', serialNo: 'VIN-12345ABC', purchaseDate: '2023-06-20', purchaseCost: 125000000, currentValue: 105000000, warranty: '2026-06-20', status: 'active', keeper: 'Transport Dept' },
  { id: 'AST-003', name: 'HP Printer LaserJet Pro', category: 'Office Equipment', serialNo: 'SN-PRT-2024-008', purchaseDate: '2024-01-10', purchaseCost: 1850000, currentValue: 1600000, warranty: '2025-01-10', status: 'active', keeper: 'Admin Office' },
  { id: 'AST-004', name: 'Conference Table Oak', category: 'Furniture', serialNo: 'FUR-TBL-045', purchaseDate: '2023-11-05', purchaseCost: 3200000, currentValue: 2700000, warranty: 'N/A', status: 'active', keeper: 'Boardroom' },
  { id: 'AST-005', name: 'Generator Perkins 45kVA', category: 'Machinery', serialNo: 'GEN-PRK-2023-12', purchaseDate: '2023-08-12', purchaseCost: 28000000, currentValue: 24000000, warranty: '2025-08-12', status: 'maintenance', keeper: 'Facilities' }
]

export default function AssetRegister() {
  const [showAddModal, setShowAddModal] = useState(false)

  const getStatusBadge = (status) => {
    const styles = {
      'active': 'bg-green-100 text-green-700',
      'maintenance': 'bg-yellow-100 text-yellow-700',
      'disposed': 'bg-red-100 text-red-700',
      'written-off': 'bg-gray-100 text-gray-700'
    }
    return <span className={`px-3 py-1 ${styles[status]} rounded-full text-xs font-medium`}>{status}</span>
  }

  const columns = [
    { header: 'Asset ID', accessorKey: 'id', cell: ({ row }) => <span className="font-mono font-bold text-blue-600">{row.original.id}</span> },
    { header: 'Asset Name', accessorKey: 'name', cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
    { header: 'Category', accessorKey: 'category' },
    { header: 'Serial Number', accessorKey: 'serialNo', cell: ({ row }) => <span className="font-mono text-xs">{row.original.serialNo}</span> },
    { 
      header: 'Purchase Cost', 
      accessorKey: 'purchaseCost',
      cell: ({ row }) => <span className="font-bold text-green-600">UGX {row.original.purchaseCost.toLocaleString()}</span>
    },
    { 
      header: 'Current Value', 
      accessorKey: 'currentValue',
      cell: ({ row }) => <span className="font-bold">UGX {row.original.currentValue.toLocaleString()}</span>
    },
    { header: 'Keeper', accessorKey: 'keeper' },
    { header: 'Status', accessorKey: 'status', cell: ({ row }) => getStatusBadge(row.original.status) }
  ]

  const totalAssets = mockAssets.length
  const totalValue = mockAssets.reduce((sum, a) => sum + a.currentValue, 0)
  const warrantyExpiring = mockAssets.filter(a => a.warranty !== 'N/A' && new Date(a.warranty) < new Date('2025-06-01')).length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Asset Register" description="Manage company assets and track value" />

        <div className="flex items-center justify-between">
          <Button className="bg-gradient-to-r from-blue-600 to-cyan-600" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Asset
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Assets', value: totalAssets, icon: Package, gradient: 'from-blue-500 to-cyan-500' },
            { label: 'Total Value', value: `UGX ${(totalValue / 1000000).toFixed(1)}M`, icon: DollarSign, gradient: 'from-green-500 to-emerald-500' },
            { label: 'Active Assets', value: mockAssets.filter(a => a.status === 'active').length, icon: Package, gradient: 'from-purple-500 to-pink-500' },
            { label: 'Warranty Expiring', value: warrantyExpiring, icon: AlertCircle, gradient: 'from-red-500 to-orange-500' }
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
          <DataTable columns={columns} data={mockAssets} />
        </Card>

        {/* Add Asset Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-6 max-w-3xl w-full my-8">
              <h3 className="text-xl font-bold mb-4">Add New Asset</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Asset Name</label>
                    <Input className="rounded-xl" placeholder="e.g., Dell Laptop XPS 15" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select className="w-full px-4 py-2 border rounded-xl">
                      <option>IT Equipment</option>
                      <option>Vehicles</option>
                      <option>Office Equipment</option>
                      <option>Furniture</option>
                      <option>Machinery</option>
                      <option>Buildings</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Serial Number</label>
                    <Input className="rounded-xl" placeholder="e.g., SN-12345" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Purchase Cost (UGX)</label>
                    <Input type="number" className="rounded-xl" placeholder="e.g., 5000000" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Purchase Date</label>
                    <Input type="date" className="rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Warranty Expiry Date</label>
                    <Input type="date" className="rounded-xl" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Assigned To / Keeper</label>
                    <Input className="rounded-xl" placeholder="e.g., John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Location/Branch</label>
                    <select className="w-full px-4 py-2 border rounded-xl">
                      <option>Head Office</option>
                      <option>Branch 1</option>
                      <option>Warehouse</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Asset Photo</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Notes</label>
                  <Textarea className="rounded-xl" rows={2} placeholder="Additional details..." />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600">Add Asset</Button>
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
