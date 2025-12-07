'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { DollarSign, ShoppingCart, TrendingUp, Users, RefreshCw, BarChart3 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'

const mockPOSStats = {
  dailySales: 15420,
  itemsSold: 247,
  paymentsReceived: 15420,
  balance: 0,
  sessionStatus: 'open',
  cashInDrawer: 2500,
  transactionsToday: 45
}

const mockSalesData = [
  { hour: '9AM', sales: 850 },
  { hour: '10AM', sales: 1200 },
  { hour: '11AM', sales: 1850 },
  { hour: '12PM', sales: 2100 },
  { hour: '1PM', sales: 1950 },
  { hour: '2PM', sales: 2450 },
  { hour: '3PM', sales: 2200 },
  { hour: '4PM', sales: 1820 },
  { hour: 'Now', sales: 1000 }
]

const mockRecentSales = [
  { id: 'SALE-1501', time: '16:45', items: 5, total: 245.50, payment: 'Cash', cashier: 'John' },
  { id: 'SALE-1502', time: '16:42', items: 3, total: 189.00, payment: 'Card', cashier: 'Sarah' },
  { id: 'SALE-1503', time: '16:38', items: 8, total: 412.75, payment: 'Mobile', cashier: 'John' },
  { id: 'SALE-1504', time: '16:35', items: 2, total: 95.00, payment: 'Cash', cashier: 'Mike' },
  { id: 'SALE-1505', time: '16:30', items: 12, total: 658.25, payment: 'Card', cashier: 'Sarah' }
]

export default function POSDashboard() {
  const router = useRouter()
  const [sessionOpen, setSessionOpen] = useState(true)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Point of Sale Dashboard"
          description="Quick sales overview and session management"
        />

        {/* Session Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className={`p-6 rounded-3xl ${sessionOpen ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">POS Session Status</p>
                <p className={`text-2xl font-bold mt-1 ${sessionOpen ? 'text-green-700' : 'text-red-700'}`}>
                  {sessionOpen ? 'Session Open' : 'Session Closed'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {sessionOpen ? 'Started at 9:00 AM' : 'Closed at 6:00 PM'}
                </p>
              </div>
              <div className="flex gap-3">
                {sessionOpen ? (
                  <>
                    <Button
                      className="bg-gradient-to-r from-blue-600 to-cyan-600"
                      onClick={() => router.push('/pos/sale')}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      New Sale
                    </Button>
                    <Button variant="outline" onClick={() => setSessionOpen(false)}>
                      Close Session
                    </Button>
                  </>
                ) : (
                  <Button
                    className="bg-gradient-to-r from-green-600 to-emerald-600"
                    onClick={() => setSessionOpen(true)}
                  >
                    Open Session
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Daily Sales</p>
                  <h3 className="text-3xl font-bold mt-2">${mockPOSStats.dailySales.toLocaleString()}</h3>
                  <p className="text-xs text-blue-100 mt-1">{mockPOSStats.transactionsToday} transactions</p>
                </div>
                <DollarSign className="w-12 h-12 opacity-80" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-500 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Items Sold</p>
                  <h3 className="text-3xl font-bold mt-2">{mockPOSStats.itemsSold}</h3>
                  <p className="text-xs text-green-100 mt-1">Today</p>
                </div>
                <ShoppingCart className="w-12 h-12 opacity-80" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Cash in Drawer</p>
                  <h3 className="text-3xl font-bold mt-2">${mockPOSStats.cashInDrawer.toLocaleString()}</h3>
                  <p className="text-xs text-purple-100 mt-1">Current balance</p>
                </div>
                <DollarSign className="w-12 h-12 opacity-80" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 rounded-3xl bg-gradient-to-br from-yellow-500 to-amber-500 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Balance Due</p>
                  <h3 className="text-3xl font-bold mt-2">${mockPOSStats.balance.toFixed(2)}</h3>
                  <p className="text-xs text-yellow-100 mt-1">All paid</p>
                </div>
                <TrendingUp className="w-12 h-12 opacity-80" />
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 rounded-3xl">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant="outline"
                className="h-auto py-6 flex-col gap-2"
                onClick={() => router.push('/pos/sale')}
              >
                <ShoppingCart className="w-6 h-6" />
                <span>New Sale</span>
              </Button>
              <Button variant="outline" className="h-auto py-6 flex-col gap-2">
                <RefreshCw className="w-6 h-6" />
                <span>Refund</span>
              </Button>
              <Button variant="outline" className="h-auto py-6 flex-col gap-2">
                <DollarSign className="w-6 h-6" />
                <span>Discount</span>
              </Button>
              <Button variant="outline" className="h-auto py-6 flex-col gap-2">
                <BarChart3 className="w-6 h-6" />
                <span>Reports</span>
              </Button>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6 rounded-3xl">
              <h3 className="text-lg font-semibold mb-4">Today's Sales Performance</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={mockSalesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hour" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Recent Sales */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="p-6 rounded-3xl">
              <h3 className="text-lg font-semibold mb-4">Recent Sales</h3>
              <div className="space-y-3">
                {mockRecentSales.map((sale, idx) => (
                  <motion.div
                    key={sale.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + idx * 0.05 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
                        {sale.cashier.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{sale.id}</p>
                        <p className="text-xs text-gray-500">{sale.time} • {sale.items} items</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">${sale.total.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{sale.payment}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}
