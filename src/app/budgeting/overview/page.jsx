'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, AlertTriangle, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';

const mockBudgets = [
  { id: 'BDG-001', category: 'Marketing', allocated: 500000, used: 425000, status: 'active', period: '2025-Q4' },
  { id: 'BDG-002', category: 'Operations', allocated: 800000, used: 620000, status: 'active', period: '2025-Q4' },
  { id: 'BDG-003', category: 'IT & Technology', allocated: 600000, used: 650000, status: 'over-budget', period: '2025-Q4' },
  { id: 'BDG-004', category: 'HR & Training', allocated: 300000, used: 180000, status: 'active', period: '2025-Q4' },
  { id: 'BDG-005', category: 'Office Supplies', allocated: 150000, used: 95000, status: 'active', period: '2025-Q4' }
];

const comparisonData = [
  { month: 'Sep', allocated: 2000000, used: 1850000 },
  { month: 'Oct', allocated: 2100000, used: 1950000 },
  { month: 'Nov', allocated: 2200000, used: 2150000 },
  { month: 'Dec', allocated: 2350000, used: 1970000 }
];

export default function BudgetOverviewPage() {
  const router = useRouter();

  const totalAllocated = mockBudgets.reduce((sum, b) => sum + b.allocated, 0);
  const totalUsed = mockBudgets.reduce((sum, b) => sum + b.used, 0);
  const overBudget = mockBudgets.filter(b => b.status === 'over-budget').length;
  const remaining = totalAllocated - totalUsed;

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Budget Overview"
          subtitle="Monitor and manage organizational budgets"
          actions={[
            <Button key="new" onClick={() => router.push('/budgeting/planner')} className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600">
              <Plus className="h-4 w-4 mr-2" />
              Create Budget
            </Button>
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Total Allocated', value: `UGX ${(totalAllocated / 1000000).toFixed(1)}M`, color: 'from-blue-500 to-cyan-500', icon: DollarSign },
            { label: 'Total Used', value: `UGX ${(totalUsed / 1000000).toFixed(1)}M`, color: 'from-purple-500 to-pink-500', icon: TrendingDown },
            { label: 'Remaining', value: `UGX ${(remaining / 1000000).toFixed(1)}M`, color: 'from-emerald-500 to-teal-500', icon: TrendingUp },
            { label: 'Over Budget', value: overBudget, color: 'from-red-500 to-rose-500', icon: AlertTriangle }
          ].map((stat, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <Card className={`rounded-3xl shadow-lg border-0 overflow-hidden bg-gradient-to-br ${stat.color} text-white p-6`}>
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="h-8 w-8 opacity-80" />
                </div>
                <div className="text-sm opacity-90 mb-1">{stat.label}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {mockBudgets.map((budget, idx) => {
            const percentage = (budget.used / budget.allocated) * 100;
            const isOverBudget = budget.status === 'over-budget';

            return (
              <motion.div key={budget.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                <Card className="rounded-3xl shadow-lg border-0 p-6 hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => router.push(`/budgeting/${budget.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{budget.category}</h3>
                      <p className="text-sm text-gray-500 font-mono">{budget.id}</p>
                    </div>
                    {isOverBudget && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-600 rounded-lg">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-xs font-semibold">Over</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Allocated</span>
                      <span className="font-semibold">UGX {budget.allocated.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Used</span>
                      <span className={`font-semibold ${isOverBudget ? 'text-red-600' : 'text-blue-600'}`}>
                        UGX {budget.used.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Remaining</span>
                      <span className={`font-semibold ${isOverBudget ? 'text-red-600' : 'text-emerald-600'}`}>
                        UGX {(budget.allocated - budget.used).toLocaleString()}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Utilization</span>
                        <span className={`font-semibold ${isOverBudget ? 'text-red-600' : percentage > 80 ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${isOverBudget ? 'bg-red-500' : percentage > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <span className="text-xs text-gray-500">Period: {budget.period}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <Card className="rounded-3xl shadow-lg border-0 p-6">
          <h3 className="text-lg font-semibold mb-4">Budget Comparison: Month vs Month</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                formatter={(value) => `UGX UGX {value.toLocaleString()}`}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.75rem'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="allocated" stroke="#3b82f6" strokeWidth={3} name="Allocated" />
              <Line type="monotone" dataKey="used" stroke="#10b981" strokeWidth={3} name="Used" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </DashboardLayout>
  );
}
