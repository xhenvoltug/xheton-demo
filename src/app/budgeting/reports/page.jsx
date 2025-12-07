'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, File } from 'lucide-react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const categoryBreakdown = [
  { name: 'Marketing', value: 425000, budget: 500000, color: '#3b82f6' },
  { name: 'Operations', value: 620000, budget: 800000, color: '#8b5cf6' },
  { name: 'IT & Technology', value: 650000, budget: 600000, color: '#10b981' },
  { name: 'HR & Training', value: 180000, budget: 300000, color: '#f59e0b' },
  { name: 'Office Supplies', value: 95000, budget: 150000, color: '#ef4444' }
];

const monthlySpending = [
  { month: 'Jul', spending: 1800000 },
  { month: 'Aug', spending: 1950000 },
  { month: 'Sep', spending: 1850000 },
  { month: 'Oct', spending: 2100000 },
  { month: 'Nov', spending: 2050000 },
  { month: 'Dec', spending: 1970000 }
];

const budgetVsActual = categoryBreakdown.map(cat => ({
  category: cat.name,
  budget: cat.budget,
  actual: cat.value,
  variance: cat.budget - cat.value
}));

export default function BudgetReportsPage() {
  const [reportType, setReportType] = useState('breakdown');

  const totalBudget = categoryBreakdown.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = categoryBreakdown.reduce((sum, c) => sum + c.value, 0);
  const totalVariance = totalBudget - totalSpent;

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Budget Reports"
          subtitle="Comprehensive budget analysis and insights"
          actions={[
            <Button key="csv" variant="outline" className="rounded-2xl">
              <File className="h-4 w-4 mr-2" />
              CSV
            </Button>,
            <Button key="pdf" variant="outline" className="rounded-2xl">
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </Button>,
            <Button key="download" className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600">
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[
            { label: 'Total Budget', value: `UGX ${(totalBudget / 1000000).toFixed(1)}M`, color: 'from-blue-500 to-cyan-500' },
            { label: 'Total Spent', value: `UGX ${(totalSpent / 1000000).toFixed(1)}M`, color: 'from-purple-500 to-pink-500' },
            { label: 'Variance', value: `UGX ${(totalVariance / 1000000).toFixed(1)}M`, color: totalVariance > 0 ? 'from-emerald-500 to-teal-500' : 'from-red-500 to-rose-500' }
          ].map((stat, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <Card className={`rounded-3xl shadow-lg border-0 overflow-hidden bg-gradient-to-br ${stat.color} text-white p-6`}>
                <div className="text-sm opacity-90 mb-1">{stat.label}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-4 mb-6">
          {['breakdown', 'spending', 'comparison'].map(type => (
            <Button
              key={type}
              variant={reportType === type ? 'default' : 'outline'}
              className="rounded-2xl capitalize"
              onClick={() => setReportType(type)}
            >
              {type === 'breakdown' ? 'Category Breakdown' : type === 'spending' ? 'Monthly Spending' : 'Budget vs Actual'}
            </Button>
          ))}
        </div>

        {reportType === 'breakdown' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="rounded-3xl shadow-lg border-0 p-6">
              <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `UGX UGX {value.toLocaleString()}`}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.75rem'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="rounded-3xl shadow-lg border-0 p-6">
              <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={categoryBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" angle={-15} textAnchor="end" height={80} />
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
                  <Bar dataKey="budget" fill="#93c5fd" name="Budget" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="value" fill="#3b82f6" name="Spent" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {reportType === 'spending' && (
          <Card className="rounded-3xl shadow-lg border-0 p-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Spending Trend</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={monthlySpending}>
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
                <Line type="monotone" dataKey="spending" stroke="#3b82f6" strokeWidth={3} name="Monthly Spending" />
              </LineChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-2xl">
                <div className="text-sm text-gray-600 dark:text-gray-400">Average Monthly</div>
                <div className="text-2xl font-bold text-blue-600">UGX 1.95M</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 rounded-2xl">
                <div className="text-sm text-gray-600 dark:text-gray-400">Lowest Month</div>
                <div className="text-2xl font-bold text-emerald-600">UGX 1.80M</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950 dark:to-rose-950 rounded-2xl">
                <div className="text-sm text-gray-600 dark:text-gray-400">Highest Month</div>
                <div className="text-2xl font-bold text-red-600">UGX 2.10M</div>
              </div>
            </div>
          </Card>
        )}

        {reportType === 'comparison' && (
          <Card className="rounded-3xl shadow-lg border-0 p-6">
            <h3 className="text-lg font-semibold mb-4">Budget vs Actual Matrix</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Category</th>
                    <th className="text-right py-3 px-4">Budget</th>
                    <th className="text-right py-3 px-4">Actual</th>
                    <th className="text-right py-3 px-4">Variance</th>
                    <th className="text-right py-3 px-4">Utilization</th>
                    <th className="text-center py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {budgetVsActual.map((item, idx) => {
                    const utilization = ((item.actual / item.budget) * 100).toFixed(1);
                    const isOverBudget = item.variance < 0;
                    
                    return (
                      <tr key={idx} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="py-3 px-4 font-semibold">{item.category}</td>
                        <td className="py-3 px-4 text-right">UGX {item.budget.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-semibold text-blue-600">UGX {item.actual.toLocaleString()}</td>
                        <td className={`py-3 px-4 text-right font-semibold ${isOverBudget ? 'text-red-600' : 'text-emerald-600'}`}>
                          {isOverBudget ? '-' : ''}UGX {Math.abs(item.variance).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`font-semibold ${parseFloat(utilization) > 100 ? 'text-red-600' : parseFloat(utilization) > 80 ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {utilization}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {isOverBudget ? (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-semibold">Over Budget</span>
                          ) : parseFloat(utilization) > 80 ? (
                            <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-semibold">Near Limit</span>
                          ) : (
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-semibold">On Track</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
