'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, FolderTree, Upload } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'

const mockAccounts = [
  { code: '1000', name: 'Cash', type: 'Asset', category: 'Current Assets', balance: 125000, status: 'active' },
  { code: '1100', name: 'Accounts Receivable', type: 'Asset', category: 'Current Assets', balance: 85000, status: 'active' },
  { code: '1200', name: 'Inventory', type: 'Asset', category: 'Current Assets', balance: 250000, status: 'active' },
  { code: '1500', name: 'Equipment', type: 'Asset', category: 'Fixed Assets', balance: 450000, status: 'active' },
  { code: '2000', name: 'Accounts Payable', type: 'Liability', category: 'Current Liabilities', balance: 65000, status: 'active' },
  { code: '2100', name: 'Loans Payable', type: 'Liability', category: 'Long-term Liabilities', balance: 200000, status: 'active' },
  { code: '3000', name: 'Owner\'s Equity', type: 'Equity', category: 'Equity', balance: 500000, status: 'active' },
  { code: '4000', name: 'Sales Revenue', type: 'Income', category: 'Revenue', balance: 850000, status: 'active' },
  { code: '5000', name: 'Cost of Goods Sold', type: 'Expense', category: 'Direct Costs', balance: 320000, status: 'active' },
  { code: '6000', name: 'Operating Expenses', type: 'Expense', category: 'Operating Costs', balance: 180000, status: 'active' }
]

export default function ChartOfAccounts() {
  const [showAddModal, setShowAddModal] = useState(false)

  const columns = [
    { header: 'Code', accessorKey: 'code', cell: ({ row }) => <span className="font-mono font-bold">{row.original.code}</span> },
    { header: 'Account Name', accessorKey: 'name' },
    { header: 'Type', accessorKey: 'type' },
    { header: 'Category', accessorKey: 'category' },
    { 
      header: 'Balance', 
      accessorKey: 'balance',
      cell: ({ row }) => {
        const isDebit = ['Asset', 'Expense'].includes(row.original.type)
        return (
          <span className={`font-bold ${isDebit ? 'text-blue-600' : 'text-green-600'}`}>
            ${row.original.balance.toLocaleString()}
          </span>
        )
      }
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
          {row.original.status}
        </span>
      )
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Chart of Accounts" description="Manage your accounting structure" />

        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600" onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Account
            </Button>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Import CSV
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['Asset', 'Liability', 'Equity', 'Income', 'Expense'].map((type, idx) => (
            <Card key={type} className={`p-4 rounded-2xl bg-gradient-to-br ${
              ['from-blue-500 to-cyan-500', 'from-red-500 to-orange-500', 'from-purple-500 to-pink-500', 'from-green-500 to-emerald-500', 'from-yellow-500 to-amber-500'][idx]
            } text-white`}>
              <p className="text-xs opacity-90">{type}s</p>
              <h3 className="text-2xl font-bold mt-1">{mockAccounts.filter(a => a.type === type).length}</h3>
            </Card>
          ))}
        </div>

        <Card className="rounded-3xl overflow-hidden">
          <DataTable columns={columns} data={mockAccounts} />
        </Card>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-6 max-w-lg w-full">
              <h3 className="text-xl font-bold mb-4">Add New Account</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Account Code</Label>
                    <Input className="mt-2 rounded-xl" placeholder="e.g., 1300" />
                  </div>
                  <div>
                    <Label>Account Type</Label>
                    <select className="w-full mt-2 px-4 py-2 border rounded-xl">
                      <option>Asset</option>
                      <option>Liability</option>
                      <option>Equity</option>
                      <option>Income</option>
                      <option>Expense</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label>Account Name</Label>
                  <Input className="mt-2 rounded-xl" placeholder="e.g., Petty Cash" />
                </div>
                <div>
                  <Label>Category</Label>
                  <Input className="mt-2 rounded-xl" placeholder="e.g., Current Assets" />
                </div>
                <div className="flex gap-3">
                  <Button className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600" onClick={() => setShowAddModal(false)}>Create Account</Button>
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
