'use client'

import { useState } from 'react'
import { Search, Filter, Plus, Calendar, MapPin, User, Package, CheckCircle, Clock, AlertTriangle, Truck } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'
import FilterBar from '@/components/shared/FilterBar'

const mockDeliveryOrders = [
  { id: 'DEL-2450', orderId: 'ORD-8901', customer: 'Safaricom Ltd', destination: 'Westlands, Nairobi', driver: 'John Kamau', status: 'in-transit', deliveryDate: '2025-12-06', items: 5, weight: '45kg', priority: 'high' },
  { id: 'DEL-2451', orderId: 'ORD-8902', customer: 'KCB Bank', destination: 'Karen, Nairobi', driver: 'Mary Wanjiku', status: 'loading', deliveryDate: '2025-12-06', items: 3, weight: '28kg', priority: 'normal' },
  { id: 'DEL-2452', orderId: 'ORD-8903', customer: 'Equity Bank', destination: 'Parklands, Nairobi', driver: 'Peter Omondi', status: 'in-transit', deliveryDate: '2025-12-06', items: 8, weight: '62kg', priority: 'high' },
  { id: 'DEL-2453', orderId: 'ORD-8904', customer: 'Nation Media', destination: 'Kilimani, Nairobi', driver: null, status: 'pending', deliveryDate: '2025-12-07', items: 2, weight: '15kg', priority: 'low' },
  { id: 'DEL-2454', orderId: 'ORD-8905', customer: 'EABL', destination: 'Industrial Area', driver: 'Jane Akinyi', status: 'completed', deliveryDate: '2025-12-05', items: 12, weight: '98kg', priority: 'normal' },
  { id: 'DEL-2455', orderId: 'ORD-8906', customer: 'Unilever Kenya', destination: 'Ruaraka, Nairobi', driver: null, status: 'pending', deliveryDate: '2025-12-07', items: 6, weight: '52kg', priority: 'normal' }
]

export default function DeliveryOrders() {
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')

  const getStatusBadge = (status) => {
    const styles = {
      'pending': 'bg-gray-100 text-gray-700',
      'loading': 'bg-yellow-100 text-yellow-700',
      'in-transit': 'bg-blue-100 text-blue-700',
      'completed': 'bg-green-100 text-green-700',
      'failed': 'bg-red-100 text-red-700'
    }
    return <span className={`px-3 py-1 ${styles[status]} rounded-full text-xs font-medium inline-flex items-center gap-1`}>
      {status === 'in-transit' && <Truck className="w-3 h-3" />}
      {status === 'completed' && <CheckCircle className="w-3 h-3" />}
      {status === 'pending' && <Clock className="w-3 h-3" />}
      {status === 'loading' && <Package className="w-3 h-3" />}
      {status.replace('-', ' ')}
    </span>
  }

  const getPriorityBadge = (priority) => {
    const styles = {
      'high': 'bg-red-100 text-red-700',
      'normal': 'bg-blue-100 text-blue-700',
      'low': 'bg-gray-100 text-gray-700'
    }
    return <span className={`px-2 py-1 ${styles[priority]} rounded-full text-xs font-medium`}>{priority}</span>
  }

  const columns = [
    { 
      header: 'Delivery ID', 
      accessorKey: 'id', 
      cell: ({ row }) => <span className="font-mono font-bold text-blue-600">{row.original.id}</span> 
    },
    { header: 'Order ID', accessorKey: 'orderId', cell: ({ row }) => <span className="font-mono text-sm">{row.original.orderId}</span> },
    { header: 'Customer', accessorKey: 'customer' },
    { 
      header: 'Destination', 
      accessorKey: 'destination',
      cell: ({ row }) => (
        <span className="flex items-center gap-1 text-sm">
          <MapPin className="w-3 h-3 text-gray-400" />
          {row.original.destination}
        </span>
      )
    },
    { 
      header: 'Driver', 
      accessorKey: 'driver',
      cell: ({ row }) => row.original.driver ? (
        <span className="flex items-center gap-1">
          <User className="w-3 h-3 text-gray-400" />
          {row.original.driver}
        </span>
      ) : <span className="text-gray-400 italic">Not assigned</span>
    },
    { header: 'Items', accessorKey: 'items' },
    { header: 'Weight', accessorKey: 'weight' },
    { header: 'Priority', accessorKey: 'priority', cell: ({ row }) => getPriorityBadge(row.original.priority) },
    { header: 'Status', accessorKey: 'status', cell: ({ row }) => getStatusBadge(row.original.status) },
    { header: 'Delivery Date', accessorKey: 'deliveryDate' }
  ]

  const filteredData = mockDeliveryOrders.filter(order => {
    if (selectedStatus !== 'all' && order.status !== selectedStatus) return false
    if (selectedPriority !== 'all' && order.priority !== selectedPriority) return false
    return true
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Delivery Orders" description="Manage and track delivery assignments" />

        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600">
              <Plus className="w-4 h-4 mr-2" />
              Create Delivery
            </Button>
            <Button variant="outline">
              <User className="w-4 h-4 mr-2" />
              Assign Driver
            </Button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-3 flex-wrap">
          <div className="flex gap-2">
            <span className="text-sm font-medium text-gray-600">Status:</span>
            {['all', 'pending', 'loading', 'in-transit', 'completed'].map(status => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'All' : status.replace('-', ' ')}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <span className="text-sm font-medium text-gray-600">Priority:</span>
            {['all', 'high', 'normal', 'low'].map(priority => (
              <button
                key={priority}
                onClick={() => setSelectedPriority(priority)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedPriority === priority
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {priority === 'all' ? 'All' : priority}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total Orders', value: mockDeliveryOrders.length, color: 'from-blue-500 to-cyan-500' },
            { label: 'Pending', value: mockDeliveryOrders.filter(o => o.status === 'pending').length, color: 'from-gray-500 to-slate-500' },
            { label: 'In Transit', value: mockDeliveryOrders.filter(o => o.status === 'in-transit').length, color: 'from-purple-500 to-pink-500' },
            { label: 'Completed', value: mockDeliveryOrders.filter(o => o.status === 'completed').length, color: 'from-green-500 to-emerald-500' },
            { label: 'Unassigned', value: mockDeliveryOrders.filter(o => !o.driver).length, color: 'from-orange-500 to-amber-500' }
          ].map((stat, idx) => (
            <Card key={stat.label} className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} text-white`}>
              <p className="text-xs opacity-90">{stat.label}</p>
              <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
            </Card>
          ))}
        </div>

        <Card className="rounded-3xl overflow-hidden">
          <DataTable columns={columns} data={filteredData} />
        </Card>
      </div>
    </DashboardLayout>
  )
}
