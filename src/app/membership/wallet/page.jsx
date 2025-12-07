'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wallet, Plus, ArrowUpCircle, ArrowDownCircle, Download, Receipt, CreditCard, DollarSign } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'

const mockTransactions = [
  { id: 'TXN-001', date: '2025-12-20 14:32', type: 'credit', description: 'Wallet Top-up via Mobile Money', amount: 500000, balance: 500000, reference: 'MM-2025-12-001' },
  { id: 'TXN-002', date: '2025-12-18 10:15', type: 'debit', description: 'Membership Payment - Professional Plan', amount: 149000, balance: 351000, reference: 'INV-2025-198' },
  { id: 'TXN-003', date: '2025-12-15 09:22', type: 'credit', description: 'Refund - Duplicate Payment', amount: 49000, balance: 400000, reference: 'REF-2025-003' },
  { id: 'TXN-004', date: '2025-12-10 16:45', type: 'debit', description: 'Add-on Purchase - Extra Storage 20GB', amount: 25000, balance: 326000, reference: 'ADD-2025-011' },
  { id: 'TXN-005', date: '2025-12-05 11:30', type: 'credit', description: 'Wallet Top-up via Bank Transfer', amount: 300000, balance: 626000, reference: 'BT-2025-12-002' }
]

export default function MemberWallet() {
  const [showTopUpModal, setShowTopUpModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [walletBalance] = useState(351000)

  const getTransactionIcon = (type) => {
    return type === 'credit' ? ArrowUpCircle : ArrowDownCircle
  }

  const columns = [
    { header: 'Date', accessorKey: 'date', cell: ({ row }) => <span className="text-xs">{row.original.date}</span> },
    { 
      header: 'Type', 
      accessorKey: 'type',
      cell: ({ row }) => {
        const Icon = getTransactionIcon(row.original.type)
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${row.original.type === 'credit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            <Icon className="w-3 h-3" />
            {row.original.type}
          </span>
        )
      }
    },
    { header: 'Description', accessorKey: 'description' },
    { 
      header: 'Amount', 
      accessorKey: 'amount',
      cell: ({ row }) => (
        <span className={`font-bold ${row.original.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
          {row.original.type === 'credit' ? '+' : '-'}UGX {row.original.amount.toLocaleString()}
        </span>
      )
    },
    { header: 'Balance', accessorKey: 'balance', cell: ({ row }) => <span className="font-semibold">UGX {row.original.balance.toLocaleString()}</span> },
    { header: 'Reference', accessorKey: 'reference', cell: ({ row }) => <span className="font-mono text-xs">{row.original.reference}</span> },
    { 
      header: 'Actions', 
      accessorKey: 'actions',
      cell: ({ row }) => (
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-xl"
          onClick={() => {
            setSelectedTransaction(row.original)
            setShowReceiptModal(true)
          }}
        >
          <Receipt className="w-3 h-3 mr-1" />
          Receipt
        </Button>
      )
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Member Wallet" description="Manage wallet balance and transaction history" />

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="rounded-3xl p-6 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm opacity-90">Current Balance</p>
                <h2 className="text-3xl font-bold">UGX {walletBalance.toLocaleString()}</h2>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button className="flex-1 bg-white text-purple-600 hover:bg-gray-100" onClick={() => setShowTopUpModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Top Up
              </Button>
              <Button variant="outline" className="flex-1 border-white text-white hover:bg-white/20">
                <Download className="w-4 h-4 mr-2" />
                Statement
              </Button>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Total Credits', value: mockTransactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0), icon: ArrowUpCircle, gradient: 'from-green-500 to-emerald-500' },
              { label: 'Total Debits', value: mockTransactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0), icon: ArrowDownCircle, gradient: 'from-red-500 to-orange-500' },
              { label: 'Transactions', value: mockTransactions.length, icon: Receipt, gradient: 'from-blue-500 to-cyan-500' },
              { label: 'Auto-Debit', value: 'Active', icon: CreditCard, gradient: 'from-purple-500 to-pink-500', isText: true }
            ].map((stat, idx) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                <Card className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white`}>
                  <stat.icon className="w-5 h-5 opacity-80 mb-2" />
                  <p className="text-xs opacity-90">{stat.label}</p>
                  <h3 className="text-xl font-bold mt-1">
                    {stat.isText ? stat.value : `UGX ${stat.value.toLocaleString()}`}
                  </h3>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <Card className="rounded-3xl overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-bold">Transaction History</h3>
            <Button variant="outline" className="rounded-xl">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <DataTable columns={columns} data={mockTransactions} />
        </Card>

        {/* Top Up Modal */}
        {showTopUpModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowTopUpModal(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-purple-600" />
                Top Up Wallet
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount (UGX) *</label>
                  <Input type="number" className="rounded-xl" placeholder="50000" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Payment Method *</label>
                  <select className="w-full px-4 py-2 border rounded-xl">
                    <option>Mobile Money (MTN)</option>
                    <option>Mobile Money (Airtel)</option>
                    <option>Bank Transfer</option>
                    <option>Credit/Debit Card</option>
                  </select>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> Your wallet will be credited instantly after successful payment verification.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Proceed to Payment
                  </Button>
                  <Button variant="outline" onClick={() => setShowTopUpModal(false)}>Cancel</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Receipt Modal */}
        {showReceiptModal && selectedTransaction && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowReceiptModal(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${selectedTransaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {selectedTransaction.type === 'credit' ? (
                    <ArrowUpCircle className="w-8 h-8 text-green-600" />
                  ) : (
                    <ArrowDownCircle className="w-8 h-8 text-red-600" />
                  )}
                </div>
                <h2 className="text-2xl font-bold mb-2">Transaction Receipt</h2>
                <p className="text-sm text-gray-600">{selectedTransaction.reference}</p>
              </div>

              <div className="border-t border-b py-4 mb-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold">{selectedTransaction.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className={`font-semibold ${selectedTransaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedTransaction.type.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Description:</span>
                  <span className="font-semibold text-right text-sm">{selectedTransaction.description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Balance After:</span>
                  <span className="font-semibold">UGX {selectedTransaction.balance.toLocaleString()}</span>
                </div>
              </div>

              <div className={`bg-gradient-to-r ${selectedTransaction.type === 'credit' ? 'from-green-100 to-emerald-100' : 'from-red-100 to-orange-100'} p-6 rounded-2xl mb-6`}>
                <p className="text-sm text-gray-600 mb-1">Amount</p>
                <p className={`text-3xl font-bold ${selectedTransaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedTransaction.type === 'credit' ? '+' : '-'}UGX {selectedTransaction.amount.toLocaleString()}
                </p>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setShowReceiptModal(false)}>Close</Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
