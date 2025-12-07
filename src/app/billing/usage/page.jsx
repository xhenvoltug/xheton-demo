'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Zap, HardDrive, MapPin, TrendingUp, AlertTriangle, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const usageMetrics = [
  { label: 'Active Users', current: 12, limit: 25, icon: Users, color: 'from-blue-500 to-cyan-500', trend: '+2 this month' },
  { label: 'Branches', current: 3, limit: 10, icon: MapPin, color: 'from-green-500 to-emerald-500', trend: 'No change' },
  { label: 'Automations', current: 15, limit: 50, icon: Zap, color: 'from-purple-500 to-pink-500', trend: '+3 this month' },
  { label: 'Storage Used', current: 45, limit: 100, icon: HardDrive, color: 'from-orange-500 to-red-500', unit: 'GB', trend: '+5 GB this month' },
]

const storageUsageData = [
  { month: 'Jul', storage: 25 },
  { month: 'Aug', storage: 30 },
  { month: 'Sep', storage: 32 },
  { month: 'Oct', storage: 38 },
  { month: 'Nov', storage: 40 },
  { month: 'Dec', storage: 45 },
]

const userActivityData = [
  { month: 'Jul', users: 8 },
  { month: 'Aug', users: 9 },
  { month: 'Sep', users: 10 },
  { month: 'Oct', users: 10 },
  { month: 'Nov', users: 11 },
  { month: 'Dec', users: 12 },
]

const automationUsageData = [
  { category: 'Sales', count: 5 },
  { category: 'Inventory', count: 4 },
  { category: 'Finance', count: 3 },
  { category: 'HR', count: 2 },
  { category: 'Logistics', count: 1 },
]

export default function BillingUsage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Usage Analytics" 
          description="Monitor your subscription usage and limits"
        />

        <div className="flex gap-3">
          {['week', 'month', 'quarter', 'year'].map(period => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              className={`rounded-xl capitalize ${
                selectedPeriod === period ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''
              }`}
              onClick={() => setSelectedPeriod(period)}
            >
              {period}
            </Button>
          ))}
        </div>

        {/* Usage Metrics Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {usageMetrics.map((metric, idx) => {
            const percentage = (metric.current / metric.limit) * 100
            const isNearLimit = percentage >= 80
            const isAtLimit = percentage >= 95

            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${metric.color} flex items-center justify-center text-white`}>
                      <metric.icon className="w-6 h-6" />
                    </div>
                    {isNearLimit && (
                      <AlertTriangle className={`w-5 h-5 ${isAtLimit ? 'text-red-500' : 'text-orange-500'}`} />
                    )}
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-2">{metric.label}</h4>
                  
                  <div className="mb-3">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">{metric.current}</span>
                      <span className="text-gray-500">/ {metric.limit}</span>
                      {metric.unit && <span className="text-gray-500 text-sm">{metric.unit}</span>}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{metric.trend}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${metric.color} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-semibold ${
                        isAtLimit ? 'text-red-600' : isNearLimit ? 'text-orange-600' : 'text-gray-600'
                      }`}>
                        {percentage.toFixed(0)}% used
                      </span>
                      {isNearLimit && (
                        <span className={`${isAtLimit ? 'text-red-600' : 'text-orange-600'} font-semibold`}>
                          {isAtLimit ? '⚠ At limit!' : '⚠ Approaching limit'}
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Usage Alerts */}
        <Card className="rounded-3xl p-6 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h4 className="font-semibold text-orange-900 mb-2">Usage Alert</h4>
              <p className="text-sm text-orange-800 mb-3">
                You're using 80% of your storage limit. Consider upgrading to the Enterprise plan for 500 GB storage.
              </p>
              <Button 
                className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl"
                size="sm"
                onClick={() => window.location.href = '/billing/plans'}
              >
                Upgrade Now
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Storage Usage Trend */}
          <Card className="rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-orange-600" />
              Storage Usage Trend (GB)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={storageUsageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`${value} GB`, 'Storage']}
                />
                <Line 
                  type="monotone" 
                  dataKey="storage" 
                  stroke="#F59E0B" 
                  strokeWidth={3} 
                  dot={{ fill: '#F59E0B', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* User Activity Trend */}
          <Card className="rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Active Users Trend
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`${value} users`, 'Active Users']}
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#3B82F6" 
                  strokeWidth={3} 
                  dot={{ fill: '#3B82F6', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Automation Usage by Category */}
        <Card className="rounded-3xl p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            Automation Usage by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={automationUsageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="category" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value) => [`${value} automations`, 'Count']}
              />
              <Bar dataKey="count" fill="url(#automationGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="automationGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Projected Usage */}
        <Card className="rounded-3xl p-6 bg-gradient-to-r from-blue-50 to-purple-50">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Projected Usage
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Based on your current usage trends:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-purple-600 mt-0.5" />
                  <span>
                    <strong>Storage:</strong> You'll reach 60 GB by end of January 2026
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-purple-600 mt-0.5" />
                  <span>
                    <strong>Users:</strong> Expected to add 2-3 users in Q1 2026
                  </span>
                </li>
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <Button 
                className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl"
                onClick={() => window.location.href = '/billing/plans'}
              >
                View Upgrade Options
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
