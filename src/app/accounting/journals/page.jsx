'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, BookOpen, Calendar, DollarSign, FileText, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'

const mockJournals = [
  { id: 'JE-001', date: '2025-12-06', type: 'General', reference: 'INV-2024', debit: 85000, credit: 85000, status: 'posted', entries: 2 },
  { id: 'JE-002', date: '2025-12-05', type: 'Sales', reference: 'SALE-1489', debit: 24500, credit: 24500, status: 'posted', entries: 3 },
  { id: 'JE-003', date: '2025-12-05', type: 'Purchase', reference: 'PO-789', debit: 45000, credit: 45000, status: 'posted', entries: 2 },
  { id: 'JE-004', date: '2025-12-04', type: 'General', reference: 'ADJ-001', debit: 12000, credit: 12000, status: 'draft', entries: 2 },
  { id: 'JE-005', date: '2025-12-03', type: 'Payment', reference: 'PAY-445', debit: 35000, credit: 35000, status: 'posted', entries: 2 }
]

export default function Journals() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [journalEntries, setJournalEntries] = useState([
    { account: '', accountCode: '', debit: 0, credit: 0 },
    { account: '', accountCode: '', debit: 0, credit: 0 }
  ])

  const addEntry = () => {
    setJournalEntries([...journalEntries, { account: '', accountCode: '', debit: 0, credit: 0 }])
  }

  const totalDebit = journalEntries.reduce((sum, e) => sum + Number(e.debit || 0), 0)
  const totalCredit = journalEntries.reduce((sum, e) => sum + Number(e.credit || 0), 0)
  const isBalanced = totalDebit === totalCredit && totalDebit > 0

  const columns = [
    { header: 'Journal ID', accessorKey: 'id', cell: ({ row }) => <span className="font-mono font-bold text-blue-600">{row.original.id}</span> },
    { header: 'Date', accessorKey: 'date' },
    { 
      header: 'Type', 
      accessorKey: 'type',
      cell: ({ row }) => {
        const colors = { General: 'bg-gray-100 text-gray-700', Sales: 'bg-green-100 text-green-700', Purchase: 'bg-blue-100 text-blue-700', Payment: 'bg-purple-100 text-purple-700' }
        return <span className={`px-3 py-1 ${colors[row.original.type]} rounded-full text-xs font-medium`}>{row.original.type}</span>
      }
    },
    { header: 'Reference', accessorKey: 'reference' },
    { header: 'Entries', accessorKey: 'entries' },
    { header: 'Debit', accessorKey: 'debit', cell: ({ row }) => <span className="font-bold text-blue-600">${row.original.debit.toLocaleString()}</span> },
    { header: 'Credit', accessorKey: 'credit', cell: ({ row }) => <span className="font-bold text-green-600">${row.original.credit.toLocaleString()}</span> },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <span className={`px-3 py-1 ${row.original.status === 'posted' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} rounded-full text-xs font-medium`}>
          {row.original.status}
        </span>
      )
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Journal Entries" description="Record and track all accounting transactions" />

        <div className="flex items-center justify-between">
          <Button className="bg-gradient-to-r from-blue-600 to-cyan-600" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Journal Entry
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Journals', value: mockJournals.length, icon: BookOpen, gradient: 'from-blue-500 to-cyan-500' },
            { label: 'Posted Today', value: 3, icon: Calendar, gradient: 'from-green-500 to-emerald-500' },
            { label: 'Draft Entries', value: 1, icon: FileText, gradient: 'from-yellow-500 to-amber-500' },
            { label: 'Total Debit/Credit', value: `$${mockJournals.reduce((s, j) => s + j.debit, 0).toLocaleString()}`, icon: DollarSign, gradient: 'from-purple-500 to-pink-500' }
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
          <DataTable columns={columns} data={mockJournals} />
        </Card>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-6 max-w-4xl w-full my-8">
              <h3 className="text-xl font-bold mb-4">Create Journal Entry</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Date</Label>
                    <Input type="date" className="mt-2 rounded-xl" defaultValue="2025-12-06" />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <select className="w-full mt-2 px-4 py-2 border rounded-xl">
                      <option>General</option>
                      <option>Sales</option>
                      <option>Purchase</option>
                      <option>Payment</option>
                    </select>
                  </div>
                  <div>
                    <Label>Reference</Label>
                    <Input className="mt-2 rounded-xl" placeholder="e.g., INV-2024" />
                  </div>
                </div>

                <div>
                  <Label>Memo / Description</Label>
                  <Textarea className="mt-2 rounded-xl" placeholder="Brief description of the transaction..." rows={2} />
                </div>

                {/* Double Entry Table */}
                <div className="border rounded-2xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-3 text-sm font-medium">Account Code</th>
                        <th className="text-left p-3 text-sm font-medium">Account Name</th>
                        <th className="text-right p-3 text-sm font-medium text-blue-600">Debit</th>
                        <th className="text-right p-3 text-sm font-medium text-green-600">Credit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {journalEntries.map((entry, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="p-3"><Input className="rounded-lg" placeholder="Code" value={entry.accountCode} /></td>
                          <td className="p-3"><Input className="rounded-lg" placeholder="Account name" value={entry.account} /></td>
                          <td className="p-3"><Input type="number" className="rounded-lg text-right" placeholder="0.00" value={entry.debit || ''} /></td>
                          <td className="p-3"><Input type="number" className="rounded-lg text-right" placeholder="0.00" value={entry.credit || ''} /></td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 border-t-2 font-bold">
                      <tr>
                        <td colSpan={2} className="p-3">TOTALS</td>
                        <td className="p-3 text-right text-blue-600">${totalDebit.toFixed(2)}</td>
                        <td className="p-3 text-right text-green-600">${totalCredit.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="flex items-center justify-between">
                  <Button variant="outline" onClick={addEntry}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Entry Line
                  </Button>
                  <div className="flex items-center gap-2">
                    {isBalanced ? (
                      <span className="text-green-600 font-medium flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        Balanced
                      </span>
                    ) : (
                      <span className="text-red-600 font-medium flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                        Not Balanced (Difference: ${Math.abs(totalDebit - totalCredit).toFixed(2)})
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600" disabled={!isBalanced}>Post Journal Entry</Button>
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
