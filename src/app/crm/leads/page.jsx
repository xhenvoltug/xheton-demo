'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Upload, Tag, Phone, Mail, User, DollarSign } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'

const mockLeads = [
  { id: 'LEAD-8901', name: 'Acme Corporation', contact: 'John Smith', phone: '+256 700 123 456', email: 'john@acme.com', value: 15000000, source: 'Website', tags: ['Enterprise', 'Hot'], status: 'new', createdDate: '2025-12-06' },
  { id: 'LEAD-8902', name: 'TechStart Ltd', contact: 'Mary Johnson', phone: '+256 701 234 567', email: 'mary@techstart.ug', value: 8500000, source: 'Referral', tags: ['SME', 'Warm'], status: 'contacted', createdDate: '2025-12-05' },
  { id: 'LEAD-8903', name: 'Global Traders', contact: 'David Okello', phone: '+256 702 345 678', email: 'david@globaltraders.com', value: 25000000, source: 'LinkedIn', tags: ['Enterprise', 'Hot'], status: 'qualified', createdDate: '2025-12-04' },
  { id: 'LEAD-8904', name: 'Local Supplies Co', contact: 'Sarah Nambi', phone: '+256 703 456 789', email: 'sarah@localsupplies.ug', value: 4500000, source: 'Cold Call', tags: ['SME', 'Cold'], status: 'new', createdDate: '2025-12-03' }
]

export default function Leads() {
  const [showCreateModal, setShowCreateModal] = useState(false)

  const getStatusBadge = (status) => {
    const styles = {
      'new': 'bg-blue-100 text-blue-700',
      'contacted': 'bg-yellow-100 text-yellow-700',
      'qualified': 'bg-green-100 text-green-700',
      'lost': 'bg-red-100 text-red-700'
    }
    return <span className={`px-3 py-1 ${styles[status]} rounded-full text-xs font-medium`}>{status}</span>
  }

  const columns = [
    { header: 'Lead ID', accessorKey: 'id', cell: ({ row }) => <span className="font-mono font-bold text-blue-600">{row.original.id}</span> },
    { header: 'Company', accessorKey: 'name', cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
    { 
      header: 'Contact Person', 
      accessorKey: 'contact',
      cell: ({ row }) => (
        <div>
          <p className="font-medium flex items-center gap-1">
            <User className="w-3 h-3 text-gray-400" />
            {row.original.contact}
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <Phone className="w-3 h-3" />
            {row.original.phone}
          </p>
        </div>
      )
    },
    { 
      header: 'Lead Value', 
      accessorKey: 'value',
      cell: ({ row }) => <span className="font-bold text-green-600">UGX {row.original.value.toLocaleString()}</span>
    },
    { 
      header: 'Source', 
      accessorKey: 'source',
      cell: ({ row }) => <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">{row.original.source}</span>
    },
    { 
      header: 'Tags', 
      accessorKey: 'tags',
      cell: ({ row }) => (
        <div className="flex gap-1">
          {row.original.tags.map((tag, idx) => (
            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">{tag}</span>
          ))}
        </div>
      )
    },
    { header: 'Status', accessorKey: 'status', cell: ({ row }) => getStatusBadge(row.original.status) },
    { header: 'Created', accessorKey: 'createdDate' }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Leads" description="Capture and manage sales leads" />

        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600" onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Lead
            </Button>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Import CSV
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Leads', value: mockLeads.length, icon: User, gradient: 'from-blue-500 to-cyan-500' },
            { label: 'New Leads', value: mockLeads.filter(l => l.status === 'new').length, icon: Plus, gradient: 'from-green-500 to-emerald-500' },
            { label: 'Qualified', value: mockLeads.filter(l => l.status === 'qualified').length, icon: Tag, gradient: 'from-purple-500 to-pink-500' },
            { label: 'Total Value', value: 'UGX 53M', icon: DollarSign, gradient: 'from-yellow-500 to-amber-500' }
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
          <DataTable columns={columns} data={mockLeads} />
        </Card>

        {/* Create Lead Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-6 max-w-2xl w-full">
              <h3 className="text-xl font-bold mb-4">Add New Lead</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Company Name</label>
                    <Input className="rounded-xl" placeholder="e.g., Tech Solutions Ltd" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Contact Person</label>
                    <Input className="rounded-xl" placeholder="e.g., John Doe" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <Input className="rounded-xl" placeholder="+256 700 000 000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <Input type="email" className="rounded-xl" placeholder="contact@company.com" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Lead Value (UGX)</label>
                    <Input type="number" className="rounded-xl" placeholder="e.g., 10000000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Lead Source</label>
                    <select className="w-full px-4 py-2 border rounded-xl">
                      <option>Website</option>
                      <option>Referral</option>
                      <option>LinkedIn</option>
                      <option>Cold Call</option>
                      <option>Trade Show</option>
                      <option>Partner</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                  <Input className="rounded-xl" placeholder="e.g., Enterprise, Hot, Manufacturing" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Notes</label>
                  <Textarea className="rounded-xl" rows={3} placeholder="Additional information about this lead..." />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600">Create Lead</Button>
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
