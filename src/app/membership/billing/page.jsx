'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, CreditCard, FileText, Download, AlertCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'

const mockBillingCycles = [
  { id: 'BC-001', memberId: 'XHET-2025-001', memberName: 'Sarah Nambi', plan: 'Professional', amount: 149000, billingDate: '2026-01-15', status: 'upcoming', autoRenew: true, invoiceId: 'INV-2026-001' },
  { id: 'BC-002', memberId: 'XHET-2025-002', memberName: 'David Ochola', plan: 'Starter', amount: 49000, billingDate: '2026-03-22', status: 'upcoming', autoRenew: true, invoiceId: 'INV-2026-002' },
  { id: 'BC-003', memberId: 'XHET-2025-003', memberName: 'Grace Akello', plan: 'Professional', amount: 149000, billingDate: '2025-12-10', status: 'paid', autoRenew: true, invoiceId: 'INV-2025-198' },
  { id: 'BC-004', memberId: 'XHET-2025-004', memberName: 'Mark Okello', plan: 'Starter', amount: 49000, billingDate: '2025-02-18', status: 'overdue', autoRenew: false, invoiceId: 'INV-2025-023' },
  { id: 'BC-005', memberId: 'XHET-2025-005', memberName: 'Patricia Nanteza', plan: 'Enterprise', amount: 299000, billingDate: '2026-05-05', status: 'upcoming', autoRenew: true, invoiceId: 'INV-2026-003' }
]

const mockUpcomingPayments = [
  { date: '2025-12-25', count: 3, amount: 447000 },
  { date: '2026-01-15', count: 5, amount: 745000 },
  { date: '2026-02-10', count: 2, amount: 298000 },
  { date: '2026-03-22', count: 4, amount: 596000 }
]

export default function BillingCycles() {
  const [selectedCycle, setSelectedCycle] = useState(null)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)

  const getStatusBadge = (status) => {
    const styles = {
      paid: 'bg-green-100 text-green-700',
      upcoming: 'bg-blue-100 text-blue-700',
      overdue: 'bg-red-100 text-red-700',
      processing: 'bg-orange-100 text-orange-700'
    }
    const icons = {
      paid: CheckCircle,
      upcoming: Clock,
      overdue: AlertCircle,
      processing: RefreshCw
    }
    const Icon = icons[status]
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${styles[status]}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    )
  }

  const columns = [
    { header: 'Member ID', accessorKey: 'memberId', cell: ({ row }) => <span className="font-mono text-xs text-blue-600">{row.original.memberId}</span> },
    { header: 'Member Name', accessorKey: 'memberName' },
    { header: 'Plan', accessorKey: 'plan' },
    { header: 'Amount', accessorKey: 'amount', cell: ({ row }) => <span className="font-bold">UGX {row.original.amount.toLocaleString()}</span> },
    { header: 'Billing Date', accessorKey: 'billingDate' },
    { header: 'Status', accessorKey: 'status', cell: ({ row }) => getStatusBadge(row.original.status) },
    { 
      header: 'Auto-Renew', 
      accessorKey: 'autoRenew',
      cell: ({ row }) => (
        <label className="inline-flex items-center cursor-pointer">
          <input type="checkbox" defaultChecked={row.original.autoRenew} className="sr-only peer" />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-600 peer-checked:to-pink-600"></div>
        </label>
      )
    },
    { 
      header: 'Actions', 
      accessorKey: 'actions',
      cell: ({ row }) => (
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-xl"
          onClick={() => {
            setSelectedCycle(row.original)
            setShowInvoiceModal(true)
          }}
        >
          <FileText className="w-3 h-3 mr-1" />
          Invoice
        </Button>
      )
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Billing Cycles" description="Manage recurring payments and invoices" />

        <div className="grid md:grid-cols-4 gap-4">
          {[
            { label: 'Total Cycles', value: mockBillingCycles.length, icon: Calendar, gradient: 'from-purple-500 to-pink-500' },
            { label: 'Upcoming', value: mockBillingCycles.filter(b => b.status === 'upcoming').length, icon: Clock, gradient: 'from-blue-500 to-cyan-500' },
            { label: 'Overdue', value: mockBillingCycles.filter(b => b.status === 'overdue').length, icon: AlertCircle, gradient: 'from-red-500 to-orange-500' },
            { label: 'Auto-Renew Active', value: mockBillingCycles.filter(b => b.autoRenew).length, icon: RefreshCw, gradient: 'from-green-500 to-emerald-500' }
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

        <Card className="rounded-3xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Upcoming Payments Timeline
          </h3>
          <div className="space-y-4">
            {mockUpcomingPayments.map((payment, idx) => (
              <motion.div 
                key={payment.date}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-l-4 border-purple-600"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-600 text-white rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{payment.date}</p>
                  <p className="text-sm text-gray-600">{payment.count} payments due</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-purple-600">UGX {payment.amount.toLocaleString()}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card className="rounded-3xl overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-bold">All Billing Cycles</h3>
            <Button variant="outline" className="rounded-xl">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <DataTable columns={columns} data={mockBillingCycles} />
        </Card>

        {/* Invoice Modal */}
        {showInvoiceModal && selectedCycle && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowInvoiceModal(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">INVOICE</h2>
                <p className="text-sm text-gray-600">{selectedCycle.invoiceId}</p>
              </div>

              <div className="border-t border-b py-4 mb-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Member:</span>
                  <span className="font-semibold">{selectedCycle.memberName} ({selectedCycle.memberId})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-semibold">{selectedCycle.plan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Billing Date:</span>
                  <span className="font-semibold">{selectedCycle.billingDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  {getStatusBadge(selectedCycle.status)}
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-2xl mb-6">
                <p className="text-sm text-gray-600 mb-1">Amount Due</p>
                <p className="text-3xl font-bold text-purple-600">UGX {selectedCycle.amount.toLocaleString()}</p>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setShowInvoiceModal(false)}>Close</Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
