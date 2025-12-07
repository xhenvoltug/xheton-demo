'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Users, Zap, HardDrive, Calendar, TrendingUp, AlertCircle, Crown } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'

const currentPlan = {
  name: 'Business',
  price: 350000,
  billingCycle: 'monthly',
  nextBillingDate: '2026-01-07',
  status: 'active',
}

const usageLimits = [
  { label: 'Users', current: 12, limit: 25, icon: Users, color: 'from-blue-500 to-cyan-500' },
  { label: 'Branches', current: 3, limit: 10, icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
  { label: 'Automations', current: 15, limit: 50, icon: Zap, color: 'from-purple-500 to-pink-500' },
  { label: 'Storage', current: 45, limit: 100, icon: HardDrive, color: 'from-orange-500 to-red-500', unit: 'GB' },
]

const paymentMethods = [
  { id: 1, type: 'Mobile Money', provider: 'MTN', number: '•••• •••• 5678', default: true },
  { id: 2, type: 'Bank Account', provider: 'Stanbic Bank', number: '•••• •••• 1234', default: false },
]

export default function BillingOverview() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Subscription Overview" 
          description="Manage your XHETON subscription and billing"
        />

        {/* Current Plan */}
        <Card className="rounded-3xl p-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Current Plan</h2>
              </div>
              <h3 className="text-3xl font-bold mb-2">{currentPlan.name}</h3>
              <p className="text-white/90">
                UGX {currentPlan.price.toLocaleString()}/{currentPlan.billingCycle}
              </p>
            </div>
            <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-semibold">
              {currentPlan.status.toUpperCase()}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm text-white/80">Next Billing Date</span>
              </div>
              <p className="text-lg font-semibold">{currentPlan.nextBillingDate}</p>
            </div>
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard className="w-4 h-4" />
                <span className="text-sm text-white/80">Payment Method</span>
              </div>
              <p className="text-lg font-semibold">MTN Mobile Money</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              className="bg-white text-purple-600 hover:bg-gray-100 rounded-xl font-semibold"
              onClick={() => window.location.href = '/billing/plans'}
            >
              Upgrade Plan
            </Button>
            <Button 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 rounded-xl"
              onClick={() => window.location.href = '/billing/payment-methods'}
            >
              Manage Payment
            </Button>
          </div>
        </Card>

        {/* Usage Metrics */}
        <div>
          <h3 className="text-lg font-bold mb-4">Usage Limits</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {usageLimits.map((usage, idx) => {
              const percentage = (usage.current / usage.limit) * 100
              const isNearLimit = percentage >= 80

              return (
                <motion.div
                  key={usage.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${usage.color} flex items-center justify-center text-white`}>
                        <usage.icon className="w-6 h-6" />
                      </div>
                      {isNearLimit && <AlertCircle className="w-5 h-5 text-orange-500" />}
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{usage.label}</h4>
                    <div className="mb-3">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold">{usage.current}</span>
                        <span className="text-gray-500">/ {usage.limit}</span>
                        {usage.unit && <span className="text-gray-500 text-sm">{usage.unit}</span>}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${usage.color} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">{percentage.toFixed(0)}% used</p>
                    {isNearLimit && (
                      <p className="text-xs text-orange-600 font-semibold mt-2">
                        ⚠ Approaching limit
                      </p>
                    )}
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card 
            className="rounded-3xl p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => window.location.href = '/billing/invoices'}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Billing History</h4>
                <p className="text-sm text-gray-500">View past invoices</p>
              </div>
            </div>
          </Card>

          <Card 
            className="rounded-3xl p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => window.location.href = '/billing/usage'}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Usage Analytics</h4>
                <p className="text-sm text-gray-500">Detailed usage charts</p>
              </div>
            </div>
          </Card>

          <Card 
            className="rounded-3xl p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => window.location.href = '/billing/payment-methods'}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Payment Methods</h4>
                <p className="text-sm text-gray-500">Manage payment options</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Payment Methods Summary */}
        <Card className="rounded-3xl p-6">
          <h3 className="text-lg font-bold mb-6">Payment Methods</h3>
          <div className="space-y-3">
            {paymentMethods.map((method, idx) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 rounded-2xl border flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{method.provider}</h4>
                    <p className="text-sm text-gray-500">{method.number}</p>
                  </div>
                </div>
                {method.default && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                    Default
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
