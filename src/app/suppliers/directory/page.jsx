'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, LayoutGrid, List, Plus, Upload, Mail, Download, Star, MapPin, Phone, Calendar, Tag } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'
import FilterBar from '@/components/shared/FilterBar'

const mockSuppliers = [
  {
    id: 'SUP-2501',
    name: 'Global Tech Supplies Ltd.',
    category: 'Electronics',
    country: 'China',
    rating: 4.8,
    leadTime: 14,
    contact: '+86 21 1234 5678',
    email: 'sales@globaltech.cn',
    lastSupply: '2025-12-05',
    status: 'active',
    totalOrders: 156,
    tags: ['Preferred', 'International']
  },
  {
    id: 'SUP-2502',
    name: 'Local Hardware Co.',
    category: 'Hardware',
    country: 'Kenya',
    rating: 4.5,
    leadTime: 3,
    contact: '+254 712 345 678',
    email: 'info@localhardware.co.ke',
    lastSupply: '2025-12-04',
    status: 'active',
    totalOrders: 89,
    tags: ['Local', 'Fast Delivery']
  },
  {
    id: 'SUP-2503',
    name: 'Premium Materials Inc.',
    category: 'Raw Materials',
    country: 'USA',
    rating: 4.9,
    leadTime: 21,
    contact: '+1 555 123 4567',
    email: 'contact@premiummaterials.com',
    lastSupply: '2025-12-03',
    status: 'active',
    totalOrders: 234,
    tags: ['Preferred', 'High Quality']
  },
  {
    id: 'SUP-2504',
    name: 'Budget Supplies LLC',
    category: 'Office Supplies',
    country: 'Kenya',
    rating: 3.2,
    leadTime: 5,
    contact: '+254 722 987 654',
    email: 'orders@budgetsupplies.co.ke',
    lastSupply: '2025-11-28',
    status: 'inactive',
    totalOrders: 45,
    tags: ['Local', 'Budget']
  },
  {
    id: 'SUP-2505',
    name: 'Overseas Manufacturing',
    category: 'Manufacturing',
    country: 'India',
    rating: 4.1,
    leadTime: 18,
    contact: '+91 22 1234 5678',
    email: 'export@overseasmfg.in',
    lastSupply: '2025-12-02',
    status: 'active',
    totalOrders: 178,
    tags: ['International', 'Manufacturing']
  },
  {
    id: 'SUP-2506',
    name: 'Fast Track Logistics',
    category: 'Logistics',
    country: 'UAE',
    rating: 4.6,
    leadTime: 7,
    contact: '+971 4 123 4567',
    email: 'service@fasttrack.ae',
    lastSupply: '2025-12-06',
    status: 'active',
    totalOrders: 312,
    tags: ['International', 'Logistics']
  }
]

export default function SupplierDirectory() {
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCountry, setSelectedCountry] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedSuppliers, setSelectedSuppliers] = useState([])

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600'
    if (rating >= 3.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  const filteredSuppliers = mockSuppliers.filter((supplier) => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || supplier.category === selectedCategory
    const matchesCountry = selectedCountry === 'all' || supplier.country === selectedCountry
    const matchesStatus = selectedStatus === 'all' || supplier.status === selectedStatus
    return matchesSearch && matchesCategory && matchesCountry && matchesStatus
  })

  const columns = [
    {
      header: 'Supplier ID',
      accessorKey: 'id',
      cell: ({ row }) => (
        <span className="font-mono text-blue-600 font-semibold">{row.original.id}</span>
      )
    },
    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }) => (
        <div>
          <p className="font-semibold">{row.original.name}</p>
          <p className="text-xs text-gray-500">{row.original.email}</p>
        </div>
      )
    },
    {
      header: 'Category',
      accessorKey: 'category'
    },
    {
      header: 'Country',
      accessorKey: 'country',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          {row.original.country}
        </div>
      )
    },
    {
      header: 'Rating',
      accessorKey: 'rating',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className={`font-bold ${getRatingColor(row.original.rating)}`}>
            {row.original.rating}
          </span>
          <div className="flex gap-0.5">
            {getRatingStars(row.original.rating)}
          </div>
        </div>
      )
    },
    {
      header: 'Lead Time',
      accessorKey: 'leadTime',
      cell: ({ row }) => `${row.original.leadTime} days`
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            row.original.status === 'active'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          {row.original.status}
        </span>
      )
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Supplier Directory"
          description="Manage and browse your supplier network"
        />

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search suppliers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-2xl"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-100 rounded-2xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl transition-all ${
                  viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-xl transition-all ${
                  viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Supplier
            </Button>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
          </div>
        </div>

        {/* Filters */}
        <FilterBar>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border rounded-xl bg-white"
          >
            <option value="all">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Hardware">Hardware</option>
            <option value="Raw Materials">Raw Materials</option>
            <option value="Office Supplies">Office Supplies</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Logistics">Logistics</option>
          </select>

          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="px-4 py-2 border rounded-xl bg-white"
          >
            <option value="all">All Countries</option>
            <option value="Kenya">Kenya</option>
            <option value="China">China</option>
            <option value="USA">USA</option>
            <option value="India">India</option>
            <option value="UAE">UAE</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border rounded-xl bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </FilterBar>

        {/* Bulk Actions */}
        {selectedSuppliers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-2xl p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-blue-900">
                {selectedSuppliers.length} supplier(s) selected
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Activate
                </Button>
                <Button size="sm" variant="outline">
                  Deactivate
                </Button>
                <Button size="sm" variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Supplier Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuppliers.map((supplier, idx) => (
              <motion.div
                key={supplier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="p-6 rounded-3xl hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
                      {supplier.name.charAt(0)}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        supplier.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {supplier.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg mb-1">{supplier.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{supplier.id}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{supplier.category}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{supplier.country}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{supplier.contact}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Lead: {supplier.leadTime} days</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-xs text-gray-500">Rating</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-lg font-bold ${getRatingColor(supplier.rating)}`}>
                          {supplier.rating}
                        </span>
                        <div className="flex gap-0.5">
                          {getRatingStars(supplier.rating)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Total Orders</p>
                      <p className="text-lg font-bold mt-1">{supplier.totalOrders}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-4">
                    {supplier.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="rounded-3xl overflow-hidden">
            <DataTable columns={columns} data={filteredSuppliers} />
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
