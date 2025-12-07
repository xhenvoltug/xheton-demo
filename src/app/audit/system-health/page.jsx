'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Activity, Cpu, HardDrive, Zap, TrendingUp, AlertTriangle, RefreshCw, Download, Server, Database } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const cpuData = [
  { time: '10:00', usage: 45 },
  { time: '10:15', usage: 52 },
  { time: '10:30', usage: 48 },
  { time: '10:45', usage: 61 },
  { time: '11:00', usage: 55 },
  { time: '11:15', usage: 58 },
  { time: '11:30', usage: 43 },
]

const apiResponseData = [
  { endpoint: '/api/sales', avgTime: 120 },
  { endpoint: '/api/inventory', avgTime: 85 },
  { endpoint: '/api/customers', avgTime: 95 },
  { endpoint: '/api/reports', avgTime: 250 },
  { endpoint: '/api/auth', avgTime: 45 },
]

const errorRates = [
  { module: 'Sales', errors: 2, total: 1250 },
  { module: 'Inventory', errors: 5, total: 980 },
  { module: 'Finance', errors: 1, total: 670 },
  { module: 'HR', errors: 0, total: 340 },
  { module: 'Procurement', errors: 3, total: 890 },
]

const recentLogs = [
  { id: 1, level: 'INFO', message: 'Daily backup completed successfully', timestamp: '2025-12-07 11:30:15', module: 'System' },
  { id: 2, level: 'WARNING', message: 'High memory usage detected (78%)', timestamp: '2025-12-07 11:25:42', module: 'Monitor' },
  { id: 3, level: 'INFO', message: 'Database optimization completed', timestamp: '2025-12-07 11:20:03', module: 'Database' },
  { id: 4, level: 'ERROR', message: 'API timeout on /api/reports endpoint', timestamp: '2025-12-07 11:15:22', module: 'API' },
  { id: 5, level: 'INFO', message: 'User authentication successful', timestamp: '2025-12-07 11:10:54', module: 'Auth' },
]

export default function SystemHealth() {
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [cpuUsage, setCpuUsage] = useState(55)
  const [memoryUsage, setMemoryUsage] = useState(68)
  const [storageUsage, setStorageUsage] = useState(42)

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setCpuUsage(Math.floor(Math.random() * 30) + 40)
        setMemoryUsage(Math.floor(Math.random() * 20) + 60)
        setStorageUsage(Math.floor(Math.random() * 10) + 38)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const getUsageColor = (usage) => {
    if (usage >= 80) return 'from-red-500 to-pink-500'
    if (usage >= 60) return 'from-orange-500 to-yellow-500'
    return 'from-green-500 to-emerald-500'
  }

  const getLevelBadge = (level) => {
    const styles = {
      INFO: 'bg-blue-100 text-blue-700',
      WARNING: 'bg-orange-100 text-orange-700',
      ERROR: 'bg-red-100 text-red-700',
    }
    return styles[level] || styles.INFO
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader 
          title="System Health Monitor" 
          description="Real-time system performance and monitoring"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Switch 
              checked={autoRefresh} 
              onCheckedChange={setAutoRefresh}
              id="auto-refresh"
            />
            <Label htmlFor="auto-refresh" className="flex items-center gap-2">
              <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              Auto-refresh every 5 seconds
            </Label>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* System Metrics Gauges */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: 'CPU Usage', value: cpuUsage, icon: Cpu, unit: '%' },
            { label: 'Memory Usage', value: memoryUsage, icon: Activity, unit: '%' },
            { label: 'Storage Usage', value: storageUsage, icon: HardDrive, unit: '%' },
          ].map((metric, idx) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <metric.icon className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold">{metric.label}</h3>
                  </div>
                  {metric.value >= 80 && <AlertTriangle className="w-5 h-5 text-red-500" />}
                </div>
                
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${metric.value * 3.52} 352`}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#EC4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{metric.value}</div>
                      <div className="text-sm text-gray-500">{metric.unit}</div>
                    </div>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${getUsageColor(metric.value)} transition-all duration-500`}
                    style={{ width: `${metric.value}%` }}
                  ></div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CPU Usage Trend */}
        <Card className="rounded-3xl p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            CPU Usage Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={cpuData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value) => [`${value}%`, 'CPU Usage']}
              />
              <Line 
                type="monotone" 
                dataKey="usage" 
                stroke="url(#colorGradient)" 
                strokeWidth={3} 
                dot={{ fill: '#8B5CF6', r: 4 }}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* API Response Times */}
          <Card className="rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              API Response Times (ms)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={apiResponseData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#888" />
                <YAxis dataKey="endpoint" type="category" stroke="#888" width={120} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`${value}ms`, 'Avg Response']}
                />
                <Bar dataKey="avgTime" fill="url(#barGradient)" radius={[0, 8, 8, 0]} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Error Rates by Module */}
          <Card className="rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Error Rate by Module
            </h3>
            <div className="space-y-4">
              {errorRates.map((module, idx) => {
                const errorRate = ((module.errors / module.total) * 100).toFixed(2)
                return (
                  <motion.div
                    key={module.module}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm">{module.module}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{module.errors}/{module.total}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          parseFloat(errorRate) > 0.5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {errorRate}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          parseFloat(errorRate) > 0.5 ? 'bg-gradient-to-r from-red-500 to-pink-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'
                        }`}
                        style={{ width: `${Math.min(parseFloat(errorRate) * 20, 100)}%` }}
                      ></div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* System Logs Viewer */}
        <Card className="rounded-3xl p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Server className="w-5 h-5 text-purple-600" />
            Recent System Logs
          </h3>
          <div className="space-y-2">
            {recentLogs.map((log, idx) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelBadge(log.level)}`}>
                    {log.level}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{log.message}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span>{log.module}</span>
                      <span>•</span>
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Button variant="outline" className="rounded-xl">
              View All Logs
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
