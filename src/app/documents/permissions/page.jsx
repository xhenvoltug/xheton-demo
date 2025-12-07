'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Users, Eye, Edit, Trash2, Share2, Link as LinkIcon, Clock, Copy } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'

const mockPermissions = [
  { id: 'PERM-001', document: 'Q4_Sales_Report_2025.pdf', user: 'Sarah Nambi', role: 'Finance Manager', access: 'edit', sharedBy: 'Admin', sharedDate: '2025-12-07' },
  { id: 'PERM-002', document: 'Employee_Handbook_2026.pdf', user: 'All Staff', role: 'Employee', access: 'view', sharedBy: 'HR Department', sharedDate: '2025-12-05' },
  { id: 'PERM-003', document: 'Budget_2026.xlsx', user: 'Finance Team', role: 'Finance', access: 'edit', sharedBy: 'Finance Director', sharedDate: '2025-11-20' },
  { id: 'PERM-004', document: 'Product_Catalog_v3.pdf', user: 'Marketing Team', role: 'Marketing', access: 'edit', sharedBy: 'Marketing Lead', sharedDate: '2025-12-03' },
  { id: 'PERM-005', document: 'Company_Logo_2025.png', user: 'All Staff', role: 'Employee', access: 'view', sharedBy: 'Design Team', sharedDate: '2025-11-28' }
]

const mockSharedLinks = [
  { id: 'LINK-001', document: 'Q4_Sales_Report_2025.pdf', url: 'https://xheton.ug/share/abc123def', views: 23, expires: '2025-12-31', status: 'active' },
  { id: 'LINK-002', document: 'Product_Catalog_v3.pdf', url: 'https://xheton.ug/share/xyz789ghi', views: 45, expires: '2026-01-15', status: 'active' },
  { id: 'LINK-003', document: 'Training_Video_CRM.mp4', url: 'https://xheton.ug/share/pqr456stu', views: 12, expires: '2025-12-20', status: 'expired' }
]

export default function DocumentPermissions() {
  const [showShareModal, setShowShareModal] = useState(false)

  const getAccessBadge = (access) => {
    const styles = {
      edit: 'bg-green-100 text-green-700',
      view: 'bg-blue-100 text-blue-700',
      delete: 'bg-red-100 text-red-700'
    }
    const icons = {
      edit: Edit,
      view: Eye,
      delete: Trash2
    }
    const Icon = icons[access]
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${styles[access]}`}>
        <Icon className="w-3 h-3" />
        {access}
      </span>
    )
  }

  const columns = [
    { header: 'Document', accessorKey: 'document', cell: ({ row }) => <span className="font-semibold">{row.original.document}</span> },
    { header: 'User/Role', accessorKey: 'user', cell: ({ row }) => (
      <div>
        <p className="font-semibold text-sm">{row.original.user}</p>
        <p className="text-xs text-gray-600">{row.original.role}</p>
      </div>
    )},
    { header: 'Access Level', accessorKey: 'access', cell: ({ row }) => getAccessBadge(row.original.access) },
    { header: 'Shared By', accessorKey: 'sharedBy' },
    { header: 'Shared Date', accessorKey: 'sharedDate' },
    { 
      header: 'Actions', 
      accessorKey: 'actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-xl">
            <Edit className="w-3 h-3" />
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl text-red-600">
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Document Permissions" description="Manage access control and sharing settings" />

        <div className="flex justify-end">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl" onClick={() => setShowShareModal(true)}>
            <Share2 className="w-4 h-4 mr-2" />
            Share Document
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: 'Total Permissions', value: mockPermissions.length, icon: Shield, gradient: 'from-purple-500 to-pink-500' },
            { label: 'Shared Links', value: mockSharedLinks.length, icon: LinkIcon, gradient: 'from-blue-500 to-cyan-500' },
            { label: 'Active Links', value: mockSharedLinks.filter(l => l.status === 'active').length, icon: Users, gradient: 'from-green-500 to-emerald-500' }
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
          <div className="p-4 border-b">
            <h3 className="font-bold">User & Role Permissions</h3>
          </div>
          <DataTable columns={columns} data={mockPermissions} />
        </Card>

        <Card className="rounded-3xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-purple-600" />
            Shared Links
          </h3>
          <div className="space-y-3">
            {mockSharedLinks.map((link, idx) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-4 rounded-2xl border-l-4 ${link.status === 'active' ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-300'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{link.document}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${link.status === 'active' ? 'bg-green-600 text-white' : 'bg-gray-400 text-white'}`}>
                        {link.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Input 
                        value={link.url} 
                        readOnly 
                        className="flex-1 text-sm font-mono bg-white rounded-xl"
                      />
                      <Button variant="outline" size="sm" className="rounded-xl">
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {link.views} views
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Expires: {link.expires}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowShareModal(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Share Document</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Document</label>
                  <select className="w-full px-4 py-2 border rounded-xl">
                    <option>Q4_Sales_Report_2025.pdf</option>
                    <option>Employee_Handbook_2026.pdf</option>
                    <option>Budget_2026.xlsx</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Share With</label>
                  <select className="w-full px-4 py-2 border rounded-xl">
                    <option>Specific Users</option>
                    <option>Roles</option>
                    <option>Everyone</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Access Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'view', label: 'View Only', icon: Eye },
                      { value: 'edit', label: 'Can Edit', icon: Edit },
                      { value: 'delete', label: 'Full Access', icon: Trash2 }
                    ].map(level => (
                      <Card key={level.value} className="p-4 rounded-xl cursor-pointer hover:bg-purple-50 transition-colors">
                        <level.icon className="w-5 h-5 text-purple-600 mb-2" />
                        <p className="text-sm font-semibold">{level.label}</p>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Link Expiry (Optional)</label>
                  <Input type="date" className="rounded-xl" />
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="notify" className="rounded" />
                  <label htmlFor="notify" className="text-sm">Send email notification to recipients</label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600">Share Document</Button>
                  <Button variant="outline" onClick={() => setShowShareModal(false)}>Cancel</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
