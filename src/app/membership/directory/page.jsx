'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Plus, Search, Download, Mail, Phone, UserCheck, UserX, DollarSign } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'

const mockMembers = [
  { id: 'MEM-001', memberId: 'XHET-2025-001', name: 'Sarah Nambi', email: 'sarah.n@email.ug', phone: '+256 700 111 222', plan: 'Professional', status: 'active', joinDate: '2024-01-15', lastPayment: 'UGX 149,000', nextRenewal: '2026-01-15' },
  { id: 'MEM-002', memberId: 'XHET-2025-002', name: 'David Ochola', email: 'david.o@email.ug', phone: '+256 700 333 444', plan: 'Starter', status: 'active', joinDate: '2024-03-22', lastPayment: 'UGX 49,000', nextRenewal: '2026-03-22' },
  { id: 'MEM-003', memberId: 'XHET-2025-003', name: 'Grace Akello', email: 'grace.a@email.ug', phone: '+256 700 555 666', plan: 'Professional', status: 'active', joinDate: '2024-06-10', lastPayment: 'UGX 149,000', nextRenewal: '2026-06-10' },
  { id: 'MEM-004', memberId: 'XHET-2025-004', name: 'Mark Okello', email: 'mark.o@email.ug', phone: '+256 700 777 888', plan: 'Starter', status: 'inactive', joinDate: '2024-02-18', lastPayment: 'UGX 49,000', nextRenewal: '2025-02-18' },
  { id: 'MEM-005', memberId: 'XHET-2025-005', name: 'Patricia Nanteza', email: 'patricia.n@email.ug', phone: '+256 700 999 000', plan: 'Enterprise', status: 'active', joinDate: '2024-05-05', lastPayment: 'UGX 299,000', nextRenewal: '2026-05-05' }
]

export default function MemberDirectory() {
  const [showAddModal, setShowAddModal] = useState(false)

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-gray-100 text-gray-700',
      suspended: 'bg-red-100 text-red-700'
    }
    const icons = {
      active: UserCheck,
      inactive: UserX,
      suspended: UserX
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
    { header: 'Name', accessorKey: 'name', cell: ({ row }) => <span className="font-semibold">{row.original.name}</span> },
    { 
      header: 'Contact', 
      accessorKey: 'email',
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs">
            <Mail className="w-3 h-3 text-gray-400" />
            {row.original.email}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Phone className="w-3 h-3 text-gray-400" />
            {row.original.phone}
          </div>
        </div>
      )
    },
    { header: 'Plan', accessorKey: 'plan' },
    { header: 'Status', accessorKey: 'status', cell: ({ row }) => getStatusBadge(row.original.status) },
    { header: 'Join Date', accessorKey: 'joinDate' },
    { header: 'Last Payment', accessorKey: 'lastPayment', cell: ({ row }) => <span className="font-bold text-green-600">{row.original.lastPayment}</span> },
    { header: 'Next Renewal', accessorKey: 'nextRenewal' }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Member Directory" description="Manage all membership accounts and subscriptions" />

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search members..." className="pl-10 rounded-xl" />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl" onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Members', value: mockMembers.length, icon: Users, gradient: 'from-purple-500 to-pink-500' },
            { label: 'Active Members', value: mockMembers.filter(m => m.status === 'active').length, icon: UserCheck, gradient: 'from-green-500 to-emerald-500' },
            { label: 'Inactive Members', value: mockMembers.filter(m => m.status === 'inactive').length, icon: UserX, gradient: 'from-gray-500 to-slate-500' },
            { label: 'Monthly Revenue', value: 'UGX 596K', icon: DollarSign, gradient: 'from-blue-500 to-cyan-500' }
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

        <Card className="rounded-3xl overflow-hidden">
          <DataTable columns={columns} data={mockMembers} />
        </Card>

        {/* Add Member Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Add New Member</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <Input className="rounded-xl" placeholder="e.g., Sarah Nambi" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <Input type="email" className="rounded-xl" placeholder="email@example.ug" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <Input className="rounded-xl" placeholder="+256 700 000 000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Membership Plan *</label>
                    <select className="w-full px-4 py-2 border rounded-xl">
                      <option>Starter - UGX 49,000/month</option>
                      <option>Professional - UGX 149,000/month</option>
                      <option>Enterprise - UGX 299,000/month</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Payment Method</label>
                  <select className="w-full px-4 py-2 border rounded-xl">
                    <option>Mobile Money (MTN/Airtel)</option>
                    <option>Bank Transfer</option>
                    <option>Credit/Debit Card</option>
                    <option>Cash</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600">Add Member</Button>
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
