'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Plus, Search, FileText, Calendar, DollarSign, Package } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'
import FilterBar from '@/components/shared/FilterBar'

const mockPurchaseOrders = [
  { id: 'PO-5789', supplier: 'Global Tech Supplies Ltd.', date: '2025-12-06', amount: 45000, items: 12, status: 'approved', deliveryDate: '2025-12-20' },
  { id: 'PO-5788', supplier: 'Premium Materials Inc.', date: '2025-12-05', amount: 62000, items: 8, status: 'pending', deliveryDate: '2025-12-18' },
  { id: 'PO-5787', supplier: 'Local Hardware Co.', date: '2025-12-04', amount: 18000, items: 25, status: 'receiving', deliveryDate: '2025-12-15' },
  { id: 'PO-5786', supplier: 'Fast Track Logistics', date: '2025-12-03', amount: 35000, items: 5, status: 'approved', deliveryDate: '2025-12-17' },
  { id: 'PO-5785', supplier: 'Budget Supplies LLC', date: '2025-12-02', amount: 12500, items: 18, status: 'completed', deliveryDate: '2025-12-10' },
  { id: 'PO-5784', supplier: 'Overseas Manufacturing', date: '2025-12-01', amount: 98000, items: 15, status: 'rejected', deliveryDate: null }
]

export default function PurchaseOrders() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const getStatusBadge = (status) => {
    const badges = {
      draft: 'bg-gray-100 text-gray-700',
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      receiving: 'bg-blue-100 text-blue-700',
      completed: 'bg-purple-100 text-purple-700'
    }
    return badges[status] || badges.draft
  }

  const filteredPOs = mockPurchaseOrders.filter((po) => {
    const matchesSearch = po.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.supplier.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || po.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const columns = [
    {
      header: 'PO Number',
      accessorKey: 'id',
      cell: ({ row }) => (
        <span className="font-mono text-blue-600 font-semibold cursor-pointer hover:underline">
          {row.original.id}
        </span>
      )
    },
    {
      header: 'Supplier',
      accessorKey: 'supplier',
      cell: ({ row }) => (
        <div>
          <p className="font-semibold">{row.original.supplier}</p>
        </div>
      )
    },
    {
      header: 'Date',
      accessorKey: 'date',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{row.original.date}</span>
        </div>
      )
    },
    {
      header: 'Items',
      accessorKey: 'items',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-400" />
          <span>{row.original.items}</span>
        </div>
      )
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span className="font-bold">${row.original.amount.toLocaleString()}</span>
        </div>
      )
    },
    {
      header: 'Delivery Date',
      accessorKey: 'deliveryDate',
      cell: ({ row }) => row.original.deliveryDate || 'N/A'
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
          title="Purchase Orders"
          description="Manage and track all purchase orders"
        />

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search POs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-2xl"
              />
            </div>
          </div>

          <Button
            className="bg-gradient-to-r from-purple-600 to-pink-600"
            onClick={() => router.push('/procurement/po/create')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create PO
          </Button>
        </div>

        {/* Filters */}
        <FilterBar>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border rounded-xl bg-white"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="receiving">Receiving</option>
            <option value="completed">Completed</option>
          </select>
        </FilterBar>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              <p className="text-blue-100 text-sm font-medium">Total POs</p>
              <h3 className="text-4xl font-bold mt-2">{mockPurchaseOrders.length}</h3>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 rounded-3xl bg-gradient-to-br from-yellow-500 to-amber-500 text-white">
              <p className="text-yellow-100 text-sm font-medium">Pending Approval</p>
              <h3 className="text-4xl font-bold mt-2">
                {mockPurchaseOrders.filter(po => po.status === 'pending').length}
              </h3>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-500 text-white">
              <p className="text-green-100 text-sm font-medium">Approved</p>
              <h3 className="text-4xl font-bold mt-2">
                {mockPurchaseOrders.filter(po => po.status === 'approved').length}
              </h3>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <p className="text-purple-100 text-sm font-medium">Total Value</p>
              <h3 className="text-4xl font-bold mt-2">
                ${(mockPurchaseOrders.reduce((sum, po) => sum + po.amount, 0) / 1000).toFixed(0)}K
              </h3>
            </Card>
          </motion.div>
        </div>

        {/* PO Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="rounded-3xl overflow-hidden">
            <DataTable
              columns={columns}
              data={filteredPOs}
              onRowClick={(row) => router.push(`/procurement/po/${row.id}`)}
            />
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
