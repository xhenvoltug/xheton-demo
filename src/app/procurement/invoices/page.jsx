'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Upload, FileText, DollarSign, AlertCircle, CheckCircle, Calendar, Package } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'
import FilterBar from '@/components/shared/FilterBar'

const mockInvoices = [
  {
    id: 'INV-8901',
    supplier: 'Global Tech Supplies Ltd.',
    poId: 'PO-5789',
    grnId: 'GRN-3402',
    date: '2025-12-06',
    dueDate: '2026-01-05',
    amount: 45000,
    status: 'matched',
    discrepancy: false,
    paymentStatus: 'unpaid'
  },
  {
    id: 'INV-8902',
    supplier: 'Premium Materials Inc.',
    poId: 'PO-5788',
    grnId: 'GRN-3405',
    date: '2025-12-05',
    dueDate: '2026-01-04',
    amount: 62500,
    status: 'discrepancy',
    discrepancy: true,
    paymentStatus: 'unpaid'
  },
  {
    id: 'INV-8903',
    supplier: 'Local Hardware Co.',
    poId: 'PO-5787',
    grnId: 'GRN-3401',
    date: '2025-12-04',
    dueDate: '2026-01-03',
    amount: 17800,
    status: 'matched',
    discrepancy: false,
    paymentStatus: 'processing'
  },
  {
    id: 'INV-8904',
    supplier: 'Fast Track Logistics',
    poId: 'PO-5786',
    grnId: 'GRN-3404',
    date: '2025-12-03',
    dueDate: '2026-01-02',
    amount: 35000,
    status: 'matched',
    discrepancy: false,
    paymentStatus: 'paid'
  }
]

export default function SupplierInvoices() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  const getStatusBadge = (status) => {
    const badges = {
      matched: 'bg-green-100 text-green-700',
      discrepancy: 'bg-red-100 text-red-700',
      pending: 'bg-yellow-100 text-yellow-700'
    }
    return badges[status] || badges.pending
  }

  const getPaymentBadge = (status) => {
    const badges = {
      paid: 'bg-green-100 text-green-700',
      processing: 'bg-blue-100 text-blue-700',
      unpaid: 'bg-yellow-100 text-yellow-700'
    }
    return badges[status] || badges.unpaid
  }

  const filteredInvoices = mockInvoices.filter((inv) => {
    const matchesSearch = inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.supplier.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || inv.status === selectedStatus
    const matchesPayment = selectedPaymentStatus === 'all' || inv.paymentStatus === selectedPaymentStatus
    return matchesSearch && matchesStatus && matchesPayment
  })

  const columns = [
    {
      header: 'Invoice ID',
      accessorKey: 'id',
      cell: ({ row }) => (
        <span className="font-mono text-blue-600 font-semibold">{row.original.id}</span>
      )
    },
    {
      header: 'Supplier',
      accessorKey: 'supplier',
      cell: ({ row }) => (
        <div>
          <p className="font-semibold">{row.original.supplier}</p>
          <p className="text-xs text-gray-500">PO: {row.original.poId} | GRN: {row.original.grnId}</p>
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
      header: 'Due Date',
      accessorKey: 'dueDate'
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
      header: 'Match Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.discrepancy && <AlertCircle className="w-4 h-4 text-red-600" />}
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(row.original.status)}`}>
            {row.original.status}
          </span>
        </div>
      )
    },
    {
      header: 'Payment',
      accessorKey: 'paymentStatus',
      cell: ({ row }) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentBadge(row.original.paymentStatus)}`}>
          {row.original.paymentStatus}
        </span>
      )
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Supplier Invoices"
          description="Manage invoice matching and payment processing"
        />

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-2xl"
              />
            </div>
          </div>

          <Button
            className="bg-gradient-to-r from-blue-600 to-cyan-600"
            onClick={() => setShowUploadModal(true)}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Invoice
          </Button>
        </div>

        {/* Filters */}
        <FilterBar>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border rounded-xl bg-white"
          >
            <option value="all">All Match Status</option>
            <option value="matched">Matched</option>
            <option value="discrepancy">Discrepancy</option>
            <option value="pending">Pending</option>
          </select>

          <select
            value={selectedPaymentStatus}
            onChange={(e) => setSelectedPaymentStatus(e.target.value)}
            className="px-4 py-2 border rounded-xl bg-white"
          >
            <option value="all">All Payment Status</option>
            <option value="paid">Paid</option>
            <option value="processing">Processing</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </FilterBar>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              <p className="text-blue-100 text-sm font-medium">Total Invoices</p>
              <h3 className="text-3xl font-bold mt-2">{mockInvoices.length}</h3>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-500 text-white">
              <p className="text-green-100 text-sm font-medium">Matched</p>
              <h3 className="text-3xl font-bold mt-2">
                {mockInvoices.filter(i => i.status === 'matched').length}
              </h3>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 rounded-3xl bg-gradient-to-br from-red-500 to-orange-500 text-white">
              <p className="text-red-100 text-sm font-medium">Discrepancies</p>
              <h3 className="text-3xl font-bold mt-2">
                {mockInvoices.filter(i => i.discrepancy).length}
              </h3>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 rounded-3xl bg-gradient-to-br from-yellow-500 to-amber-500 text-white">
              <p className="text-yellow-100 text-sm font-medium">Unpaid</p>
              <h3 className="text-3xl font-bold mt-2">
                {mockInvoices.filter(i => i.paymentStatus === 'unpaid').length}
              </h3>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <p className="text-purple-100 text-sm font-medium">Total Value</p>
              <h3 className="text-3xl font-bold mt-2">
                ${(mockInvoices.reduce((sum, i) => sum + i.amount, 0) / 1000).toFixed(0)}K
              </h3>
            </Card>
          </motion.div>
        </div>

        {/* 3-Way Match Indicator */}
        <Card className="p-6 rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-50">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            3-Way Match Validation
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-2xl">
              <FileText className="w-8 h-8 mx-auto text-blue-600 mb-2" />
              <p className="text-xs text-gray-600">Purchase Order</p>
              <p className="font-bold text-sm mt-1">PO Details</p>
            </div>
            <div className="text-center p-4 bg-white rounded-2xl">
              <Package className="w-8 h-8 mx-auto text-green-600 mb-2" />
              <p className="text-xs text-gray-600">Goods Receipt</p>
              <p className="font-bold text-sm mt-1">GRN Quantities</p>
            </div>
            <div className="text-center p-4 bg-white rounded-2xl">
              <DollarSign className="w-8 h-8 mx-auto text-purple-600 mb-2" />
              <p className="text-xs text-gray-600">Invoice</p>
              <p className="font-bold text-sm mt-1">Invoice Amount</p>
            </div>
          </div>
        </Card>

        {/* Invoice Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="rounded-3xl overflow-hidden">
            <DataTable columns={columns} data={filteredInvoices} />
          </Card>
        </motion.div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-6 max-w-lg w-full"
            >
              <h3 className="text-xl font-bold mb-4">Upload Supplier Invoice</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Select PO</label>
                  <select className="w-full px-4 py-2 border rounded-xl">
                    <option>PO-5789 - Global Tech Supplies Ltd.</option>
                    <option>PO-5788 - Premium Materials Inc.</option>
                    <option>PO-5787 - Local Hardware Co.</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Upload PDF</label>
                  <div className="border-2 border-dashed rounded-2xl p-8 text-center">
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Drag & drop or click to upload</p>
                    <p className="text-xs text-gray-400 mt-1">PDF files only</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600"
                    onClick={() => setShowUploadModal(false)}
                  >
                    Upload & Match
                  </Button>
                  <Button variant="outline" onClick={() => setShowUploadModal(false)}>
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
