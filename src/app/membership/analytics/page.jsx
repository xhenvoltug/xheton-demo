'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, DollarSign, UserCheck, UserX, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'

const mockAnalytics = {
  totalMembers: 53,
  activeMembers: 45,
  inactiveMembers: 8,
  churnRate: 4.2,
  monthlyRevenue: 7947000,
  revenueGrowth: 12.5,
  averageLifetimeValue: 1788000,
  topPlan: 'Professional'
}

const mockMonthlyData = [
  { month: 'Jul 2025', newMembers: 8, churned: 2, revenue: 6960000 },
  { month: 'Aug 2025', newMembers: 12, churned: 1, revenue: 7450000 },
  { month: 'Sep 2025', newMembers: 10, churned: 3, revenue: 7120000 },
  { month: 'Oct 2025', newMembers: 15, churned: 2, revenue: 7890000 },
  { month: 'Nov 2025', newMembers: 11, churned: 1, revenue: 7650000 },
  { month: 'Dec 2025', newMembers: 13, churned: 2, revenue: 7947000 }
]

const mockPlanDistribution = [
  { plan: 'Starter', members: 20, percentage: 37.7, revenue: 980000 },
  { plan: 'Professional', members: 28, percentage: 52.8, revenue: 4172000 },
  { plan: 'Enterprise', members: 5, percentage: 9.4, revenue: 1495000 }
]

export default function MembershipAnalytics() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Membership Analytics" description="Track growth, revenue, and retention metrics" />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Members', value: mockAnalytics.totalMembers, change: '+8.2%', icon: Users, gradient: 'from-purple-500 to-pink-500', isPositive: true },
            { label: 'Active Members', value: mockAnalytics.activeMembers, change: '+5.1%', icon: UserCheck, gradient: 'from-green-500 to-emerald-500', isPositive: true },
            { label: 'Monthly Revenue', value: `UGX ${(mockAnalytics.monthlyRevenue / 1000).toFixed(0)}K`, change: `+${mockAnalytics.revenueGrowth}%`, icon: DollarSign, gradient: 'from-blue-500 to-cyan-500', isPositive: true },
            { label: 'Churn Rate', value: `${mockAnalytics.churnRate}%`, change: '-1.3%', icon: UserX, gradient: 'from-red-500 to-orange-500', isPositive: false }
          ].map((stat, idx) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <Card className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white`}>
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-5 h-5 opacity-80" />
                  <span className={`text-xs flex items-center gap-1 ${stat.isPositive ? 'bg-white/20' : 'bg-black/20'} px-2 py-1 rounded-full`}>
                    {stat.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.change}
                  </span>
                </div>
                <p className="text-xs opacity-90">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Monthly Growth Trend
            </h3>
            <div className="space-y-4">
              {mockMonthlyData.map((month, idx) => (
                <motion.div 
                  key={month.month}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl"
                >
                  <div>
                    <p className="font-semibold">{month.month}</p>
                    <div className="flex gap-4 mt-1 text-xs">
                      <span className="text-green-600 font-semibold">+{month.newMembers} New</span>
                      <span className="text-red-600 font-semibold">-{month.churned} Churned</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-purple-600">UGX {(month.revenue / 1000).toFixed(0)}K</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          <Card className="rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Plan Distribution
            </h3>
            <div className="space-y-4">
              {mockPlanDistribution.map((plan, idx) => (
                <motion.div 
                  key={plan.plan}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{plan.plan}</span>
                    <span className="text-sm text-gray-600">{plan.members} members ({plan.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${plan.percentage}%` }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                      className={`h-full rounded-full ${idx === 0 ? 'bg-gradient-to-r from-purple-500 to-pink-500' : idx === 1 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`}
                    />
                  </div>
                  <p className="text-sm font-semibold text-right text-purple-600">UGX {(plan.revenue / 1000).toFixed(0)}K/month</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="rounded-3xl p-6 bg-gradient-to-br from-purple-100 to-pink-100">
            <h4 className="text-sm font-semibold text-purple-700 mb-2">Average Lifetime Value</h4>
            <p className="text-3xl font-bold text-purple-900">UGX {(mockAnalytics.averageLifetimeValue / 1000).toFixed(0)}K</p>
            <p className="text-xs text-purple-700 mt-2">Per member over 12 months</p>
          </Card>

          <Card className="rounded-3xl p-6 bg-gradient-to-br from-blue-100 to-cyan-100">
            <h4 className="text-sm font-semibold text-blue-700 mb-2">Most Popular Plan</h4>
            <p className="text-3xl font-bold text-blue-900">{mockAnalytics.topPlan}</p>
            <p className="text-xs text-blue-700 mt-2">52.8% of total members</p>
          </Card>

          <Card className="rounded-3xl p-6 bg-gradient-to-br from-green-100 to-emerald-100">
            <h4 className="text-sm font-semibold text-green-700 mb-2">Revenue Growth</h4>
            <p className="text-3xl font-bold text-green-900">+{mockAnalytics.revenueGrowth}%</p>
            <p className="text-xs text-green-700 mt-2">Month-over-month increase</p>
          </Card>
        </div>

        <Card className="rounded-3xl p-6">
          <h3 className="text-lg font-bold mb-4">Member Acquisition Heatmap</h3>
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">{day}</div>
            ))}
            {Array.from({ length: 28 }, (_, i) => {
              const intensity = Math.floor(Math.random() * 5)
              const colors = ['bg-gray-100', 'bg-purple-200', 'bg-purple-400', 'bg-purple-600', 'bg-purple-800']
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.01 }}
                  className={`aspect-square rounded-lg ${colors[intensity]} hover:scale-110 transition-transform cursor-pointer`}
                  title={`${intensity} members joined`}
                />
              )
            })}
          </div>
          <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-600">
            <span>Less</span>
            {['bg-gray-100', 'bg-purple-200', 'bg-purple-400', 'bg-purple-600', 'bg-purple-800'].map((color, i) => (
              <div key={i} className={`w-4 h-4 rounded ${color}`} />
            ))}
            <span>More</span>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
