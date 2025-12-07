'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, Eye, Search, Filter } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'

const mockInvoices = [
  { id: 'INV-2025-12', invoiceNumber: 'XHET-INV-001212', date: '2025-12-07', amount: 350000, status: 'paid', plan: 'Business', billingPeriod: 'Dec 2025 - Jan 2026' },
  { id: 'INV-2025-11', invoiceNumber: 'XHET-INV-001156', date: '2025-11-07', amount: 350000, status: 'paid', plan: 'Business', billingPeriod: 'Nov 2025 - Dec 2025' },
  { id: 'INV-2025-10', invoiceNumber: 'XHET-INV-001098', date: '2025-10-07', amount: 350000, status: 'paid', plan: 'Business', billingPeriod: 'Oct 2025 - Nov 2025' },
  { id: 'INV-2025-09', invoiceNumber: 'XHET-INV-001034', date: '2025-09-07', amount: 120000, status: 'paid', plan: 'Starter', billingPeriod: 'Sep 2025 - Oct 2025' },
  { id: 'INV-2025-08', invoiceNumber: 'XHET-INV-000978', date: '2025-08-07', amount: 120000, status: 'paid', plan: 'Starter', billingPeriod: 'Aug 2025 - Sep 2025' },
]

export default function BillingInvoices() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  const getStatusBadge = (status) => {
    const styles = {
      paid: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      overdue: 'bg-red-100 text-red-700',
    }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
        {status.toUpperCase()}
      </span>
    )
  }

  const columns = [
    { 
      header: 'Invoice Number', 
      accessorKey: 'invoiceNumber',
      cell: ({ row }) => <span className="font-mono text-sm">{row.original.invoiceNumber}</span>
    },
    { header: 'Date', accessorKey: 'date' },
    { header: 'Plan', accessorKey: 'plan' },
    { header: 'Billing Period', accessorKey: 'billingPeriod' },
    { 
      header: 'Amount', 
      accessorKey: 'amount',
      cell: ({ row }) => <span className="font-semibold">UGX {row.original.amount.toLocaleString()}</span>
    },
    { 
      header: 'Status', 
      accessorKey: 'status',
      cell: ({ row }) => getStatusBadge(row.original.status)
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl"
            onClick={() => setSelectedInvoice(row.original)}
          >
            <Eye className="w-3 h-3 mr-1" />
            View
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl"
          >
            <Download className="w-3 h-3 mr-1" />
            PDF
          </Button>
        </div>
      )
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Billing History" 
          description="View and download your past invoices"
        />

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Search invoices..." 
              className="pl-10 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
              <Download className="w-4 h-4 mr-2" />
              Download All
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: 'Total Paid', value: 'UGX 1,290,000', color: 'from-green-500 to-emerald-500' },
            { label: 'This Year', value: 'UGX 1,290,000', color: 'from-blue-500 to-cyan-500' },
            { label: 'Next Payment', value: 'Jan 7, 2026', color: 'from-purple-500 to-pink-500' },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className={`rounded-3xl p-6 bg-gradient-to-br ${stat.color} text-white`}>
                <p className="text-sm opacity-90 mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Invoices Table */}
        <Card className="rounded-3xl overflow-hidden">
          <DataTable columns={columns} data={mockInvoices} />
        </Card>

        {/* Invoice Viewer Modal */}
        {selectedInvoice && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Invoice Header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold mb-2">INVOICE</h2>
                  <p className="text-gray-600">{selectedInvoice.invoiceNumber}</p>
                </div>
                <div className="text-right">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-2xl font-bold mb-2">
                    X
                  </div>
                  <p className="text-sm font-semibold">XHETON</p>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="font-semibold text-sm text-gray-500 mb-2">BILLED TO</h4>
                  <p className="font-semibold">Your Business Name</p>
                  <p className="text-sm text-gray-600">Kampala, Uganda</p>
                  <p className="text-sm text-gray-600">email@business.com</p>
                </div>
                <div className="text-right">
                  <h4 className="font-semibold text-sm text-gray-500 mb-2">INVOICE DATE</h4>
                  <p className="font-semibold">{selectedInvoice.date}</p>
                  <h4 className="font-semibold text-sm text-gray-500 mt-4 mb-2">BILLING PERIOD</h4>
                  <p className="font-semibold">{selectedInvoice.billingPeriod}</p>
                </div>
              </div>

              {/* Invoice Items */}
              <div className="border-t border-b py-6 mb-6">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500">
                      <th className="pb-3">DESCRIPTION</th>
                      <th className="pb-3 text-right">AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-3">
                        <p className="font-semibold">{selectedInvoice.plan} Plan</p>
                        <p className="text-sm text-gray-600">Monthly subscription</p>
                      </td>
                      <td className="py-3 text-right font-semibold">
                        UGX {selectedInvoice.amount.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Total */}
              <div className="flex justify-end mb-8">
                <div className="w-64">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span>UGX {selectedInvoice.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Tax (0%)</span>
                    <span>UGX 0</span>
                  </div>
                  <div className="flex justify-between py-3 border-t font-bold text-lg">
                    <span>Total</span>
                    <span>UGX {selectedInvoice.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment Status */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-2xl mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-semibold text-green-700">Payment Received</span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  Paid via MTN Mobile Money on {selectedInvoice.date}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 rounded-xl"
                  onClick={() => setSelectedInvoice(null)}
                >
                  Close
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
