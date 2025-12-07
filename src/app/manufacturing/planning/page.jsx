'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, TrendingUp, Package, AlertTriangle, CheckCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'

const demandData = [
  { week: 'Week 1', demand: 45, capacity: 60 },
  { week: 'Week 2', demand: 52, capacity: 60 },
  { week: 'Week 3', demand: 38, capacity: 60 },
  { week: 'Week 4', demand: 65, capacity: 60 }
]

const materialRequirements = [
  { material: 'Oak Wood Panels', required: 250, available: 180, shortage: 70, unit: 'sq meters', unitCost: 35000 },
  { material: 'Steel Frames', required: 120, available: 140, shortage: 0, unit: 'units', unitCost: 85000 },
  { material: 'Fabric Upholstery', required: 85, available: 50, shortage: 35, unit: 'meters', unitCost: 45000 },
  { material: 'Screws & Bolts Kit', required: 500, available: 600, shortage: 0, unit: 'packs', unitCost: 12000 },
  { material: 'Varnish & Paint', required: 45, available: 30, shortage: 15, unit: 'liters', unitCost: 28000 }
]

export default function ProductionPlanning() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Production Planning" description="Demand forecasting and material requirements planning" />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Weekly Capacity', value: '60 units', icon: TrendingUp, gradient: 'from-blue-500 to-cyan-500' },
            { label: 'Avg Demand', value: '50 units/wk', icon: Calendar, gradient: 'from-green-500 to-emerald-500' },
            { label: 'Material Shortages', value: '3', icon: AlertTriangle, gradient: 'from-red-500 to-orange-500' },
            { label: 'Utilization Rate', value: '83%', icon: CheckCircle, gradient: 'from-purple-500 to-pink-500' }
          ].map((stat, idx) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <Card className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white`}>
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-5 h-5 opacity-80" />
                </div>
                <p className="text-xs opacity-90">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Demand vs Capacity Chart */}
        <Card className="rounded-3xl p-6">
          <h3 className="font-bold mb-4">Demand vs Production Capacity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={demandData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="demand" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Demand" />
              <Bar dataKey="capacity" fill="#10b981" radius={[8, 8, 0, 0]} name="Capacity" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Material Requirements */}
        <Card className="rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Material Requirements Planning (MRP)</h3>
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600">
              <Package className="w-4 h-4 mr-2" />
              Generate Purchase Orders
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 text-sm font-medium">Material</th>
                  <th className="text-center p-3 text-sm font-medium">Required</th>
                  <th className="text-center p-3 text-sm font-medium">Available</th>
                  <th className="text-center p-3 text-sm font-medium">Shortage</th>
                  <th className="text-right p-3 text-sm font-medium">Unit Cost (UGX)</th>
                  <th className="text-right p-3 text-sm font-medium">Total Cost (UGX)</th>
                  <th className="text-center p-3 text-sm font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {materialRequirements.map((item, idx) => (
                  <motion.tr 
                    key={idx} 
                    className="border-t hover:bg-gray-50"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <td className="p-3">
                      <p className="font-medium">{item.material}</p>
                      <p className="text-xs text-gray-500">{item.unit}</p>
                    </td>
                    <td className="p-3 text-center font-bold">{item.required}</td>
                    <td className="p-3 text-center">{item.available}</td>
                    <td className="p-3 text-center">
                      <span className={`font-bold ${item.shortage > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {item.shortage > 0 ? `-${item.shortage}` : '✓'}
                      </span>
                    </td>
                    <td className="p-3 text-right text-sm">UGX {item.unitCost.toLocaleString()}</td>
                    <td className="p-3 text-right font-bold text-green-600">
                      UGX {(item.shortage * item.unitCost).toLocaleString()}
                    </td>
                    <td className="p-3 text-center">
                      {item.shortage > 0 ? (
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Shortage
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium inline-flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Sufficient
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t-2">
                <tr>
                  <td colSpan={5} className="p-3 font-bold">Total Procurement Needed</td>
                  <td className="p-3 text-right font-bold text-green-600">
                    UGX {materialRequirements.reduce((sum, item) => sum + (item.shortage * item.unitCost), 0).toLocaleString()}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
