'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, RefreshCw, DollarSign, CreditCard, Smartphone } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'

const mockRefunds = [
  { id: 'REF-001', saleId: 'SALE-1489', date: '2025-12-06', amount: 245.50, method: 'cash', reason: 'Defective item', status: 'completed' },
  { id: 'REF-002', saleId: 'SALE-1475', date: '2025-12-05', amount: 120.00, method: 'card', reason: 'Wrong item', status: 'pending', }
]

export default function POSReturns() {
  const [receiptNumber, setReceiptNumber] = useState('')
  const [refundMethod, setRefundMethod] = useState('cash')
  const [showRefundModal, setShowRefundModal] = useState(false)

  const columns = [
    { header: 'Refund ID', accessorKey: 'id', cell: ({ row }) => <span className="font-mono text-blue-600 font-semibold">{row.original.id}</span> },
    { header: 'Sale ID', accessorKey: 'saleId' },
    { header: 'Date', accessorKey: 'date' },
    { header: 'Amount', accessorKey: 'amount', cell: ({ row }) => `$${row.original.amount.toFixed(2)}` },
    { header: 'Method', accessorKey: 'method' },
    { header: 'Reason', accessorKey: 'reason' },
    { 
      header: 'Status', 
      accessorKey: 'status',
      cell: ({ row }) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${row.original.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
          {row.original.status}
        </span>
      )
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Sales Returns & Refunds" description="Process returns and issue refunds" />

        {/* Process Refund */}
        <Card className="p-6 rounded-3xl">
          <h3 className="font-semibold mb-4">Process New Refund</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label>Receipt Number</Label>
              <div className="flex gap-3 mt-2">
                <Input
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  placeholder="Enter receipt/sale number..."
                  className="rounded-xl"
                />
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600">
                  <Search className="w-4 h-4 mr-2" />
                  Find
                </Button>
              </div>
            </div>
            <div>
              <Label>Refund Method</Label>
              <select className="w-full mt-2 px-4 py-2 border rounded-xl" value={refundMethod} onChange={(e) => setRefundMethod(e.target.value)}>
                <option value="cash">Cash</option>
                <option value="card">Credit Card</option>
                <option value="mobile">Mobile Money</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 rounded-3xl bg-gradient-to-br from-red-500 to-orange-500 text-white">
            <p className="text-red-100 text-sm">Total Refunds</p>
            <h3 className="text-4xl font-bold mt-2">{mockRefunds.length}</h3>
          </Card>
          <Card className="p-6 rounded-3xl bg-gradient-to-br from-yellow-500 to-amber-500 text-white">
            <p className="text-yellow-100 text-sm">Pending Approval</p>
            <h3 className="text-4xl font-bold mt-2">{mockRefunds.filter(r => r.status === 'pending').length}</h3>
          </Card>
          <Card className="p-6 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            <p className="text-purple-100 text-sm">Total Amount</p>
            <h3 className="text-4xl font-bold mt-2">${mockRefunds.reduce((sum, r) => sum + r.amount, 0).toFixed(2)}</h3>
          </Card>
        </div>

        {/* Refunds Table */}
        <Card className="rounded-3xl overflow-hidden">
          <DataTable columns={columns} data={mockRefunds} />
        </Card>
      </div>
    </DashboardLayout>
  )
}
