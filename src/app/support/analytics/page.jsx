'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TrendingUp, Clock, Users, CheckCircle, Star, MessageCircle, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'

const ticketTrends = [
  { month: 'Jun', new: 45, resolved: 42, pending: 12 },
  { month: 'Jul', new: 52, resolved: 48, pending: 15 },
  { month: 'Aug', new: 48, resolved: 50, pending: 10 },
  { month: 'Sep', new: 61, resolved: 58, pending: 13 },
  { month: 'Oct', new: 55, resolved: 53, pending: 11 },
  { month: 'Nov', new: 67, resolved: 65, pending: 9 },
  { month: 'Dec', new: 43, resolved: 40, pending: 8 }
]

const categoryDistribution = [
  { name: 'Technical Issues', value: 145, color: '#8B5CF6' },
  { name: 'Billing Questions', value: 89, color: '#EC4899' },
  { name: 'Feature Requests', value: 67, color: '#F59E0B' },
  { name: 'Account Issues', value: 54, color: '#10B981' },
  { name: 'General Inquiries', value: 78, color: '#3B82F6' }
]

const responseTimeData = [
  { day: 'Mon', avgTime: 2.4 },
  { day: 'Tue', avgTime: 1.8 },
  { day: 'Wed', avgTime: 2.1 },
  { day: 'Thu', avgTime: 1.5 },
  { day: 'Fri', avgTime: 2.7 },
  { day: 'Sat', avgTime: 3.2 },
  { day: 'Sun', avgTime: 2.9 }
]

const agentPerformance = [
  { agent: 'Sarah Nambi', resolved: 87, avgRating: 4.8, avgTime: '1.2 hrs' },
  { agent: 'David Ochola', resolved: 76, avgRating: 4.6, avgTime: '1.5 hrs' },
  { agent: 'Grace Akello', resolved: 92, avgRating: 4.9, avgTime: '0.9 hrs' },
  { agent: 'John Mugisha', resolved: 68, avgRating: 4.5, avgTime: '1.8 hrs' }
]

export default function SupportAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Support Analytics" description="Performance metrics and insights" />

        <div className="flex gap-3">
          {['week', 'month', 'quarter', 'year'].map(period => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              className={`rounded-xl capitalize ${selectedPeriod === period ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}`}
              onClick={() => setSelectedPeriod(period)}
            >
              {period}
            </Button>
          ))}
        </div>

        {/* KPI Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { label: 'Total Tickets', value: '433', change: '+12%', icon: MessageCircle, gradient: 'from-purple-500 to-pink-500' },
            { label: 'Avg Resolution Time', value: '2.1 hrs', change: '-18%', icon: Clock, gradient: 'from-blue-500 to-cyan-500' },
            { label: 'Customer Satisfaction', value: '4.7/5', change: '+0.3', icon: Star, gradient: 'from-green-500 to-emerald-500' },
            { label: 'Resolution Rate', value: '94%', change: '+5%', icon: CheckCircle, gradient: 'from-orange-500 to-red-500' }
          ].map((stat, idx) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <Card className={`p-6 rounded-3xl bg-gradient-to-br ${stat.gradient} text-white`}>
                <div className="flex items-center justify-between mb-3">
                  <stat.icon className="w-6 h-6 opacity-80" />
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-white/20' : 'bg-white/20'}`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-sm opacity-90 mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold">{stat.value}</h3>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Ticket Trends Chart */}
        <Card className="rounded-3xl p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Ticket Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ticketTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Legend />
              <Bar dataKey="new" fill="#8B5CF6" radius={[8, 8, 0, 0]} name="New Tickets" />
              <Bar dataKey="resolved" fill="#10B981" radius={[8, 8, 0, 0]} name="Resolved" />
              <Bar dataKey="pending" fill="#F59E0B" radius={[8, 8, 0, 0]} name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Category Distribution */}
          <Card className="rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-6">Ticket Categories</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Response Time Trend */}
          <Card className="rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Avg Response Time (hours)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`${value} hrs`, 'Response Time']}
                />
                <Line type="monotone" dataKey="avgTime" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Agent Performance */}
        <Card className="rounded-3xl p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            Agent Performance
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Agent</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Tickets Resolved</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Avg Rating</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Avg Resolution Time</th>
                </tr>
              </thead>
              <tbody>
                {agentPerformance.map((agent, idx) => (
                  <motion.tr
                    key={agent.agent}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                          {agent.agent.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-semibold">{agent.agent}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                        {agent.resolved} tickets
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold">{agent.avgRating}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{agent.avgTime}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Insights */}
        <Card className="rounded-3xl p-6 bg-gradient-to-r from-blue-50 to-purple-50">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-purple-600" />
            Key Insights
          </h3>
          <div className="space-y-3">
            {[
              { text: 'Resolution rate improved by 5% this month', type: 'positive' },
              { text: 'Average response time decreased by 18% compared to last month', type: 'positive' },
              { text: 'Technical issues remain the top category at 33% of all tickets', type: 'neutral' },
              { text: 'Grace Akello leads with the highest customer satisfaction rating (4.9/5)', type: 'positive' }
            ].map((insight, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-4 rounded-2xl ${
                  insight.type === 'positive' ? 'bg-green-100' : 'bg-blue-100'
                }`}
              >
                <p className="text-sm font-medium text-gray-800">{insight.text}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
