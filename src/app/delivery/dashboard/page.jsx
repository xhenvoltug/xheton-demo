'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Truck, Package, Clock, CheckCircle, AlertTriangle, MapPin, TrendingUp, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'

const mockDeliveryStats = {
  totalDeliveries: 156,
  pendingDeliveries: 23,
  inTransit: 18,
  completedToday: 12,
  lateDeliveries: 5,
  avgDeliveryTime: '2.4 hrs',
  deliverySuccess: 94.5
}

const performanceData = [
  { day: 'Mon', delivered: 28, late: 2 },
  { day: 'Tue', delivered: 32, late: 1 },
  { day: 'Wed', delivered: 25, late: 3 },
  { day: 'Thu', delivered: 30, late: 2 },
  { day: 'Fri', delivered: 35, late: 1 },
  { day: 'Sat', delivered: 20, late: 0 }
]

const mockActiveDeliveries = [
  { id: 'DEL-2450', driver: 'John Kamau', status: 'in-transit', destination: 'Westlands, Nairobi', eta: '14:30', items: 5 },
  { id: 'DEL-2451', driver: 'Mary Wanjiku', status: 'loading', destination: 'Karen, Nairobi', eta: '15:00', items: 3 },
  { id: 'DEL-2452', driver: 'Peter Omondi', status: 'in-transit', destination: 'Parklands, Nairobi', eta: '14:45', items: 8 },
  { id: 'DEL-2453', driver: 'Jane Akinyi', status: 'pending', destination: 'Kilimani, Nairobi', eta: '16:00', items: 2 }
]

export default function DeliveryDashboard() {
  const getStatusBadge = (status) => {
    const styles = {
      'in-transit': 'bg-blue-100 text-blue-700',
      'loading': 'bg-yellow-100 text-yellow-700',
      'pending': 'bg-gray-100 text-gray-700',
      'completed': 'bg-green-100 text-green-700'
    }
    return <span className={`px-3 py-1 ${styles[status]} rounded-full text-xs font-medium`}>{status.replace('-', ' ')}</span>
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Delivery & Logistics Dashboard" description="Monitor delivery operations and performance" />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Deliveries', value: mockDeliveryStats.totalDeliveries, icon: Package, gradient: 'from-blue-500 to-cyan-500', change: '+12%' },
            { label: 'Pending', value: mockDeliveryStats.pendingDeliveries, icon: Clock, gradient: 'from-yellow-500 to-amber-500', change: '-5%' },
            { label: 'In Transit', value: mockDeliveryStats.inTransit, icon: Truck, gradient: 'from-purple-500 to-pink-500', change: '+8%' },
            { label: 'Completed Today', value: mockDeliveryStats.completedToday, icon: CheckCircle, gradient: 'from-green-500 to-emerald-500', change: '+15%' }
          ].map((stat, idx) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <Card className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white`}>
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-5 h-5 opacity-80" />
                  <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">{stat.change}</span>
                </div>
                <p className="text-xs opacity-90">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 rounded-2xl border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Delivery Time</p>
                <h3 className="text-2xl font-bold text-blue-600">{mockDeliveryStats.avgDeliveryTime}</h3>
              </div>
              <Clock className="w-10 h-10 text-blue-600 opacity-20" />
            </div>
          </Card>
          <Card className="p-4 rounded-2xl border-2 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <h3 className="text-2xl font-bold text-green-600">{mockDeliveryStats.deliverySuccess}%</h3>
              </div>
              <TrendingUp className="w-10 h-10 text-green-600 opacity-20" />
            </div>
          </Card>
          <Card className="p-4 rounded-2xl border-2 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Late Deliveries</p>
                <h3 className="text-2xl font-bold text-red-600">{mockDeliveryStats.lateDeliveries}</h3>
              </div>
              <AlertTriangle className="w-10 h-10 text-red-600 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Performance Chart */}
        <Card className="rounded-3xl p-6">
          <h3 className="font-bold mb-4">Weekly Delivery Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="delivered" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="late" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Active Deliveries */}
        <Card className="rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Active Delivery Sessions</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-3">
            {mockActiveDeliveries.map((delivery, idx) => (
              <motion.div 
                key={delivery.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold">{delivery.id}</p>
                    <p className="text-sm text-gray-600">{delivery.driver}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {delivery.destination}
                    </p>
                    <p className="text-xs text-gray-500">{delivery.items} items • ETA: {delivery.eta}</p>
                  </div>
                  {getStatusBadge(delivery.status)}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
