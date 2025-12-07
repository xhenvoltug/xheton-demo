'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Plus, FileText, Calendar, Users, DollarSign, Search, Filter } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'
import FilterBar from '@/components/shared/FilterBar'

const mockRFQs = [
  {
    id: 'RFQ-2501',
    title: 'Office Equipment Purchase Q1 2026',
    items: 15,
    suppliers: 4,
    deadline: '2025-12-15',
    status: 'open',
    totalEstimate: 125000,
    responses: 2,
    createdBy: 'John Doe',
    createdAt: '2025-12-01'
  },
  {
    id: 'RFQ-2502',
    title: 'Raw Materials for Production',
    items: 8,
    suppliers: 3,
    deadline: '2025-12-20',
    status: 'open',
    totalEstimate: 85000,
    responses: 3,
    createdBy: 'Jane Smith',
    createdAt: '2025-12-03'
  },
  {
    id: 'RFQ-2503',
    title: 'IT Hardware Upgrade',
    items: 22,
    suppliers: 5,
    deadline: '2025-12-10',
    status: 'awarded',
    totalEstimate: 210000,
    responses: 5,
    createdBy: 'Mike Johnson',
    createdAt: '2025-11-20'
  },
  {
    id: 'RFQ-2504',
    title: 'Maintenance Services Contract',
    items: 12,
    suppliers: 3,
    deadline: '2025-12-08',
    status: 'closed',
    totalEstimate: 65000,
    responses: 3,
    createdBy: 'Sarah Lee',
    createdAt: '2025-11-18'
  },
  {
    id: 'RFQ-2505',
    title: 'Packaging Materials Bulk Order',
    items: 6,
    suppliers: 2,
    deadline: '2025-12-18',
    status: 'evaluating',
    totalEstimate: 42000,
    responses: 2,
    createdBy: 'Tom Wilson',
    createdAt: '2025-12-05'
  }
]

export default function RFQList() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const getStatusBadge = (status) => {
    const badges = {
      open: { color: 'bg-blue-100 text-blue-700', label: 'Open' },
      evaluating: { color: 'bg-yellow-100 text-yellow-700', label: 'Evaluating' },
      awarded: { color: 'bg-green-100 text-green-700', label: 'Awarded' },
      closed: { color: 'bg-gray-100 text-gray-700', label: 'Closed' }
    }
    return badges[status] || badges.open
  }

  const filteredRFQs = mockRFQs.filter((rfq) => {
    const matchesSearch = rfq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rfq.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || rfq.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const columns = [
    {
      header: 'RFQ ID',
      accessorKey: 'id',
      cell: ({ row }) => (
        <span className="font-mono text-blue-600 font-semibold cursor-pointer hover:underline">
          {row.original.id}
        </span>
      )
    },
    {
      header: 'Title',
      accessorKey: 'title',
      cell: ({ row }) => (
        <div>
          <p className="font-semibold">{row.original.title}</p>
          <p className="text-xs text-gray-500">Created by {row.original.createdBy}</p>
        </div>
      )
    },
    {
      header: 'Items',
      accessorKey: 'items',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-400" />
          <span>{row.original.items}</span>
        </div>
      )
    },
    {
      header: 'Suppliers',
      accessorKey: 'suppliers',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span>{row.original.suppliers}</span>
        </div>
      )
    },
    {
      header: 'Responses',
      accessorKey: 'responses',
      cell: ({ row }) => (
        <span className="text-blue-600 font-semibold">{row.original.responses}/{row.original.suppliers}</span>
      )
    },
    {
      header: 'Deadline',
      accessorKey: 'deadline',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{row.original.deadline}</span>
        </div>
      )
    },
    {
      header: 'Estimate',
      accessorKey: 'totalEstimate',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span className="font-bold">${row.original.totalEstimate.toLocaleString()}</span>
        </div>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => {
        const badge = getStatusBadge(row.original.status)
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
            {badge.label}
          </span>
        )
      }
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Requests for Quotation (RFQ)"
          description="Manage and track supplier quotation requests"
        />

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search RFQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-2xl"
              />
            </div>
          </div>

          <Button
            className="bg-gradient-to-r from-blue-600 to-cyan-600"
            onClick={() => router.push('/procurement/rfq/create')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create RFQ
          </Button>
        </div>

        {/* Filters */}
        <FilterBar>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border rounded-xl bg-white"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="evaluating">Evaluating</option>
            <option value="awarded">Awarded</option>
            <option value="closed">Closed</option>
          </select>
        </FilterBar>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              <p className="text-blue-100 text-sm font-medium">Total RFQs</p>
              <h3 className="text-4xl font-bold mt-2">{mockRFQs.length}</h3>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-500 text-white">
              <p className="text-green-100 text-sm font-medium">Open RFQs</p>
              <h3 className="text-4xl font-bold mt-2">
                {mockRFQs.filter(r => r.status === 'open').length}
              </h3>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 rounded-3xl bg-gradient-to-br from-yellow-500 to-amber-500 text-white">
              <p className="text-yellow-100 text-sm font-medium">Evaluating</p>
              <h3 className="text-4xl font-bold mt-2">
                {mockRFQs.filter(r => r.status === 'evaluating').length}
              </h3>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <p className="text-purple-100 text-sm font-medium">Total Value</p>
              <h3 className="text-4xl font-bold mt-2">
                ${(mockRFQs.reduce((sum, r) => sum + r.totalEstimate, 0) / 1000).toFixed(0)}K
              </h3>
            </Card>
          </motion.div>
        </div>

        {/* RFQ Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="rounded-3xl overflow-hidden">
            <DataTable
              columns={columns}
              data={filteredRFQs}
              onRowClick={(row) => router.push(`/procurement/rfq/${row.id}`)}
            />
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
