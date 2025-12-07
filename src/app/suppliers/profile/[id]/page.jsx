'use client'

import { use, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Package,
  TrendingUp,
  FileText,
  MessageSquare,
  Edit,
  Plus,
  Upload,
  Download
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import DashboardLayout from '@/components/DashboardLayout'
import DataTable from '@/components/shared/DataTable'

const mockSupplierDetails = {
  id: 'SUP-2501',
  name: 'Global Tech Supplies Ltd.',
  category: 'Electronics',
  rating: 4.8,
  country: 'China',
  city: 'Shanghai',
  address: '123 Tech Park, Pudong District',
  phone: '+86 21 1234 5678',
  email: 'sales@globaltech.cn',
  website: 'www.globaltech.cn',
  taxId: 'CN-TAX-123456',
  leadTime: 14,
  paymentTerms: 'Net 30',
  currency: 'UGX',
  status: 'active',
  since: '2020-03-15',
  totalOrders: 156,
  totalValue: 4560000,
  tags: ['Preferred', 'International', 'High Volume']
}

const mockProducts = [
  { id: 'PROD-001', name: 'Laptop Computer X1', sku: 'LAP-X1-512', currentPrice: 850, previousPrice: 820, quantity: 450, lastOrdered: '2025-12-01' },
  { id: 'PROD-002', name: 'Wireless Mouse Pro', sku: 'MOU-PRO-BLK', currentPrice: 45, previousPrice: 42, quantity: 1200, lastOrdered: '2025-11-28' },
  { id: 'PROD-003', name: 'USB-C Hub 7-in-1', sku: 'HUB-7IN1', currentPrice: 32, previousPrice: 35, quantity: 800, lastOrdered: '2025-11-25' },
  { id: 'PROD-004', name: 'Mechanical Keyboard RGB', sku: 'KEY-RGB-MEC', currentPrice: 120, previousPrice: 115, quantity: 300, lastOrdered: '2025-12-03' }
]

const mockPriceHistory = [
  { month: 'Jul', price: 812 },
  { month: 'Aug', price: 820 },
  { month: 'Sep', price: 815 },
  { month: 'Oct', price: 825 },
  { month: 'Nov', price: 820 },
  { month: 'Dec', price: 850 }
]

const mockPerformanceData = {
  onTimeDelivery: 94,
  qualityScore: 92,
  rejectionRate: 2.1,
  responseTime: 4.5,
  orderAccuracy: 97
}

const mockDocuments = [
  { id: 'DOC-001', name: 'Business License', type: 'License', uploadDate: '2020-03-15', expiryDate: '2026-03-15', status: 'valid' },
  { id: 'DOC-002', name: 'ISO 9001 Certificate', type: 'Certification', uploadDate: '2023-06-10', expiryDate: '2026-06-10', status: 'valid' },
  { id: 'DOC-003', name: 'Tax Registration', type: 'Tax Document', uploadDate: '2020-03-15', expiryDate: '2025-12-31', status: 'expiring' },
  { id: 'DOC-004', name: 'Product Catalog 2025', type: 'Catalog', uploadDate: '2025-01-01', expiryDate: null, status: 'valid' }
]

const mockTransactions = [
  { id: 'PO-5678', date: '2025-12-01', type: 'Purchase Order', amount: 38250, status: 'completed', items: 45 },
  { id: 'PO-5654', date: '2025-11-15', type: 'Purchase Order', amount: 52100, status: 'completed', items: 62 },
  { id: 'PO-5623', date: '2025-10-28', type: 'Purchase Order', amount: 29500, status: 'completed', items: 35 },
  { id: 'PO-5601', date: '2025-10-10', type: 'Purchase Order', amount: 41800, status: 'completed', items: 48 }
]

const mockNotes = [
  { id: 'NOTE-001', date: '2025-12-05', author: 'John Doe', note: 'Excellent supplier. Always delivers on time. Recommended for urgent orders.' },
  { id: 'NOTE-002', date: '2025-11-20', author: 'Jane Smith', note: 'Negotiated 5% discount for orders above UGX 50,000. Valid until end of Q1 2026.' },
  { id: 'NOTE-003', date: '2025-10-15', author: 'Mike Johnson', note: 'Product quality has improved significantly. Latest batch exceeded expectations.' }
]

export default function SupplierProfile({ params }) {
  const unwrappedParams = use(params)
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  const productColumns = [
    { header: 'Product', accessorKey: 'name' },
    { header: 'SKU', accessorKey: 'sku' },
    {
      header: 'Current Price',
      accessorKey: 'currentPrice',
      cell: ({ row }) => `$${row.original.currentPrice.toFixed(2)}`
    },
    {
      header: 'Previous Price',
      accessorKey: 'previousPrice',
      cell: ({ row }) => {
        const current = row.original.currentPrice
        const previous = row.original.previousPrice
        const diff = current - previous
        return (
          <div className="flex items-center gap-2">
            <span>${previous.toFixed(2)}</span>
            <span className={`text-xs ${diff > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {diff > 0 ? '+' : ''}{diff.toFixed(2)}
            </span>
          </div>
        )
      }
    },
    { header: 'Quantity', accessorKey: 'quantity' },
    { header: 'Last Ordered', accessorKey: 'lastOrdered' }
  ]

  const documentColumns = [
    { header: 'Document', accessorKey: 'name' },
    { header: 'Type', accessorKey: 'type' },
    { header: 'Upload Date', accessorKey: 'uploadDate' },
    { header: 'Expiry Date', accessorKey: 'expiryDate', cell: ({ row }) => row.original.expiryDate || 'N/A' },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            row.original.status === 'valid'
              ? 'bg-green-100 text-green-700'
              : row.original.status === 'expiring'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {row.original.status}
        </span>
      )
    }
  ]

  const transactionColumns = [
    { header: 'Transaction ID', accessorKey: 'id' },
    { header: 'Date', accessorKey: 'date' },
    { header: 'Type', accessorKey: 'type' },
    { header: 'Items', accessorKey: 'items' },
    {
      header: 'Amount',
      accessorKey: 'amount',
      cell: ({ row }) => `$${row.original.amount.toLocaleString()}`
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{mockSupplierDetails.name}</h1>
              <p className="text-gray-600">{mockSupplierDetails.id}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600">
              <Plus className="w-4 h-4 mr-2" />
              New Order
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-100 p-1 rounded-2xl">
            <TabsTrigger value="overview" className="rounded-xl">Overview</TabsTrigger>
            <TabsTrigger value="products" className="rounded-xl">Products Supplied</TabsTrigger>
            <TabsTrigger value="performance" className="rounded-xl">Performance</TabsTrigger>
            <TabsTrigger value="documents" className="rounded-xl">Documents</TabsTrigger>
            <TabsTrigger value="transactions" className="rounded-xl">Transactions</TabsTrigger>
            <TabsTrigger value="notes" className="rounded-xl">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Basic Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-2"
              >
                <Card className="p-6 rounded-3xl">
                  <h3 className="text-lg font-semibold mb-4">Supplier Information</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Category</p>
                      <p className="font-semibold">{mockSupplierDetails.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Status</p>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        {mockSupplierDetails.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Location</p>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <p className="font-semibold">{mockSupplierDetails.city}, {mockSupplierDetails.country}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Phone</p>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <p className="font-semibold">{mockSupplierDetails.phone}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <p className="font-semibold">{mockSupplierDetails.email}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Website</p>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <p className="font-semibold text-blue-600">{mockSupplierDetails.website}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Lead Time</p>
                      <p className="font-semibold">{mockSupplierDetails.leadTime} days</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Payment Terms</p>
                      <p className="font-semibold">{mockSupplierDetails.paymentTerms}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Supplier Since</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <p className="font-semibold">{mockSupplierDetails.since}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Tax ID</p>
                      <p className="font-semibold">{mockSupplierDetails.taxId}</p>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t">
                    <p className="text-sm text-gray-500 mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {mockSupplierDetails.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Rating & Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
              >
                <Card className="p-6 rounded-3xl">
                  <h3 className="text-lg font-semibold mb-4">Rating</h3>
                  <div className="flex items-center justify-center flex-col">
                    <div className="text-6xl font-bold text-yellow-500 mb-2">
                      {mockSupplierDetails.rating}
                    </div>
                    <div className="flex gap-1 mb-4">
                      {getRatingStars(mockSupplierDetails.rating)}
                    </div>
                    <Button variant="outline" size="sm">
                      <Star className="w-4 h-4 mr-2" />
                      Update Rating
                    </Button>
                  </div>
                </Card>

                <Card className="p-6 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                  <h3 className="text-lg font-semibold mb-4">Total Orders</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-4xl font-bold">{mockSupplierDetails.totalOrders}</p>
                      <p className="text-sm text-blue-100 mt-1">orders placed</p>
                    </div>
                    <Package className="w-12 h-12 opacity-80" />
                  </div>
                </Card>

                <Card className="p-6 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                  <h3 className="text-lg font-semibold mb-4">Total Value</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-4xl font-bold">${(mockSupplierDetails.totalValue / 1000000).toFixed(2)}M</p>
                      <p className="text-sm text-green-100 mt-1">lifetime value</p>
                    </div>
                    <TrendingUp className="w-12 h-12 opacity-80" />
                  </div>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Products Supplied</h3>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Link Product
              </Button>
            </div>
            
            <Card className="rounded-3xl overflow-hidden">
              <DataTable columns={productColumns} data={mockProducts} />
            </Card>

            <Card className="p-6 rounded-3xl">
              <h3 className="text-lg font-semibold mb-4">Price History (Last 6 Months)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockPriceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip />
                  <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6 rounded-3xl">
                <p className="text-sm text-gray-500 mb-2">On-Time Delivery</p>
                <p className="text-4xl font-bold text-green-600">{mockPerformanceData.onTimeDelivery}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${mockPerformanceData.onTimeDelivery}%` }}
                  />
                </div>
              </Card>

              <Card className="p-6 rounded-3xl">
                <p className="text-sm text-gray-500 mb-2">Quality Score</p>
                <p className="text-4xl font-bold text-blue-600">{mockPerformanceData.qualityScore}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${mockPerformanceData.qualityScore}%` }}
                  />
                </div>
              </Card>

              <Card className="p-6 rounded-3xl">
                <p className="text-sm text-gray-500 mb-2">Rejection Rate</p>
                <p className="text-4xl font-bold text-red-600">{mockPerformanceData.rejectionRate}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{ width: `${mockPerformanceData.rejectionRate * 10}%` }}
                  />
                </div>
              </Card>

              <Card className="p-6 rounded-3xl">
                <p className="text-sm text-gray-500 mb-2">Response Time</p>
                <p className="text-4xl font-bold text-purple-600">{mockPerformanceData.responseTime}h</p>
                <p className="text-sm text-gray-600 mt-2">Average response time</p>
              </Card>

              <Card className="p-6 rounded-3xl">
                <p className="text-sm text-gray-500 mb-2">Order Accuracy</p>
                <p className="text-4xl font-bold text-cyan-600">{mockPerformanceData.orderAccuracy}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div
                    className="bg-cyan-600 h-2 rounded-full"
                    style={{ width: `${mockPerformanceData.orderAccuracy}%` }}
                  />
                </div>
              </Card>

              <Card className="p-6 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                <p className="text-sm text-green-100 mb-2">Overall Risk Score</p>
                <p className="text-4xl font-bold">Low</p>
                <p className="text-sm text-green-100 mt-2">Recommended for critical orders</p>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Supplier Documents</h3>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>
            
            <Card className="rounded-3xl overflow-hidden">
              <DataTable columns={documentColumns} data={mockDocuments} />
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Transaction History</h3>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
            
            <Card className="rounded-3xl overflow-hidden">
              <DataTable columns={transactionColumns} data={mockTransactions} />
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Internal Notes</h3>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Note
              </Button>
            </div>

            <div className="space-y-4">
              {mockNotes.map((note, idx) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="p-6 rounded-3xl">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                        {note.author.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold">{note.author}</p>
                          <p className="text-sm text-gray-500">{note.date}</p>
                        </div>
                        <p className="text-gray-700">{note.note}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
