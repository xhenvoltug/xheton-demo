'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, TrendingUp, TrendingDown, Clock, User } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'

const mockCashierSession = {
  cashier: 'John Doe',
  sessionId: 'SES-2025120701',
  openTime: '09:00 AM',
  openingBalance: 500,
  currentBalance: 2500,
  totalSales: 15420,
  cashSales: 8200,
  cardSales: 6420,
  mobileSales: 800,
  transactions: 45
}

const mockCashLog = [
  { time: '16:45', type: 'sale', amount: 245.50, balance: 2500, ref: 'SALE-1501' },
  { time: '16:42', type: 'sale', amount: 189.00, balance: 2254.50, ref: 'SALE-1502' },
  { time: '15:30', type: 'withdrawal', amount: -200, balance: 2065.50, ref: 'WITHD-001' },
  { time: '14:15', type: 'sale', amount: 412.75, balance: 2265.50, ref: 'SALE-1480' }
]

export default function CashRegister() {
  const [showCloseSession, setShowCloseSession] = useState(false)
  const [closingCount, setClosingCount] = useState({
    coins: '',
    bills: '',
    total: 0
  })

  const calculateTotal = () => {
    const coins = parseFloat(closingCount.coins) || 0
    const bills = parseFloat(closingCount.bills) || 0
    return coins + bills
  }

  const expectedClosing = mockCashierSession.openingBalance + mockCashierSession.cashSales
  const actualClosing = calculateTotal()
  const discrepancy = actualClosing - expectedClosing

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Cash Register / Drawer Management"
          description="Monitor cash drawer activity and manage sessions"
        />

        {/* Session Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-50">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl">
                    {mockCashierSession.cashier.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-lg">{mockCashierSession.cashier}</p>
                    <p className="text-sm text-gray-600">{mockCashierSession.sessionId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Opened at {mockCashierSession.openTime}</span>
                </div>
              </div>
              <Button
                className="bg-gradient-to-r from-red-600 to-orange-600"
                onClick={() => setShowCloseSession(true)}
              >
                Close Session
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-500 text-white">
              <p className="text-green-100 text-sm font-medium">Opening Balance</p>
              <h3 className="text-3xl font-bold mt-2">${mockCashierSession.openingBalance}</h3>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              <p className="text-blue-100 text-sm font-medium">Current Balance</p>
              <h3 className="text-3xl font-bold mt-2">${mockCashierSession.currentBalance}</h3>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <p className="text-purple-100 text-sm font-medium">Cash Sales</p>
              <h3 className="text-3xl font-bold mt-2">${mockCashierSession.cashSales}</h3>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 rounded-3xl bg-gradient-to-br from-yellow-500 to-amber-500 text-white">
              <p className="text-yellow-100 text-sm font-medium">Transactions</p>
              <h3 className="text-3xl font-bold mt-2">{mockCashierSession.transactions}</h3>
            </Card>
          </motion.div>
        </div>

        {/* Cash Count & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expected Count */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6 rounded-3xl">
              <h3 className="font-semibold mb-4">Expected Cash Count</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-2xl">
                  <p className="text-sm text-gray-600">Opening Balance</p>
                  <p className="text-2xl font-bold text-blue-600">${mockCashierSession.openingBalance}</p>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Cash Sales</p>
                    <p className="text-xl font-bold text-green-600">+${mockCashierSession.cashSales}</p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600">Expected Closing</p>
                  <p className="text-3xl font-bold text-gray-900">${expectedClosing}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Cash Activity Log */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6 rounded-3xl">
              <h3 className="font-semibold mb-4">Cash Activity Log</h3>
              <div className="space-y-2">
                {mockCashLog.map((log, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        log.type === 'sale' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {log.type === 'sale' ? (
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{log.ref}</p>
                        <p className="text-xs text-gray-500">{log.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${log.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {log.amount > 0 ? '+' : ''}${Math.abs(log.amount).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">${log.balance}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Close Session Modal */}
        {showCloseSession && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold mb-4">Close Cash Session</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <Label>Count Coins</Label>
                  <Input
                    type="number"
                    value={closingCount.coins}
                    onChange={(e) => setClosingCount({...closingCount, coins: e.target.value})}
                    placeholder="0.00"
                    className="mt-2 rounded-xl"
                  />
                </div>
                <div>
                  <Label>Count Bills</Label>
                  <Input
                    type="number"
                    value={closingCount.bills}
                    onChange={(e) => setClosingCount({...closingCount, bills: e.target.value})}
                    placeholder="0.00"
                    className="mt-2 rounded-xl"
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Expected Closing:</span>
                    <span className="font-bold">${expectedClosing}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Actual Count:</span>
                    <span className="font-bold">${actualClosing.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-semibold">Discrepancy:</span>
                    <span className={`font-bold text-lg ${discrepancy === 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {discrepancy > 0 ? '+' : ''}${discrepancy.toFixed(2)}
                    </span>
                  </div>
                </div>

                {discrepancy !== 0 && (
                  <div className={`p-3 rounded-xl ${discrepancy > 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                    <p className={`text-sm ${discrepancy > 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {discrepancy > 0 ? 'Cash Over' : 'Cash Short'}: ${Math.abs(discrepancy).toFixed(2)}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-red-600 to-orange-600 h-12">
                  Complete & Close Session
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setShowCloseSession(false)}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
