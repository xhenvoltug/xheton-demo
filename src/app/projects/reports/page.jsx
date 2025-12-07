'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, CheckCircle2, Clock, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

const performanceData = [
  { project: 'ERP System', planned: 65, actual: 65, budget: 500000, spent: 325000 },
  { project: 'Mobile App', planned: 80, actual: 82, budget: 350000, spent: 287000 },
  { project: 'Website', planned: 0, actual: 0, budget: 150000, spent: 0 },
  { project: 'Data Migration', planned: 75, actual: 45, budget: 200000, spent: 180000 },
  { project: 'Cloud Setup', planned: 85, actual: 90, budget: 450000, spent: 405000 }
];

const taskCompletionData = [
  { month: 'Jul', completed: 12, total: 15 },
  { month: 'Aug', completed: 18, total: 20 },
  { month: 'Sep', completed: 22, total: 25 },
  { month: 'Oct', completed: 28, total: 30 },
  { month: 'Nov', completed: 35, total: 38 },
  { month: 'Dec', completed: 40, total: 45 }
];

const budgetDistribution = [
  { name: 'ERP System', value: 500000, color: '#3b82f6' },
  { name: 'Mobile App', value: 350000, color: '#8b5cf6' },
  { name: 'Cloud Setup', value: 450000, color: '#10b981' },
  { name: 'Data Migration', value: 200000, color: '#f59e0b' },
  { name: 'Website', value: 150000, color: '#ef4444' }
];

export default function ProjectReportsPage() {
  const [reportType, setReportType] = useState('performance');

  const totalProjects = performanceData.length;
  const onTrack = performanceData.filter(p => p.actual >= p.planned).length;
  const avgCompletion = Math.round(performanceData.reduce((sum, p) => sum + p.actual, 0) / totalProjects);
  const totalBudget = performanceData.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = performanceData.reduce((sum, p) => sum + p.spent, 0);

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Project Reports"
          subtitle="Analytics and performance insights"
          actions={[
            <Button key="export" variant="outline" className="rounded-2xl">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Total Projects', value: totalProjects, color: 'from-blue-500 to-cyan-500', icon: TrendingUp },
            { label: 'On Track', value: onTrack, color: 'from-emerald-500 to-teal-500', icon: CheckCircle2 },
            { label: 'Avg Completion', value: `${avgCompletion}%`, color: 'from-purple-500 to-pink-500', icon: Clock },
            { label: 'Budget Usage', value: `${((totalSpent / totalBudget) * 100).toFixed(0)}%`, color: 'from-amber-500 to-orange-500', icon: DollarSign }
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

        <div className="flex gap-4 mb-6">
          {['performance', 'tasks', 'budget'].map(type => (
            <Button
              key={type}
              variant={reportType === type ? 'default' : 'outline'}
              className="rounded-2xl capitalize"
              onClick={() => setReportType(type)}
            >
              {type} Report
            </Button>
          ))}
        </div>

        {reportType === 'performance' && (
          <Card className="rounded-3xl shadow-lg border-0 p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Project Performance: Planned vs Actual Progress</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="project" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.75rem'
                  }}
                />
                <Legend />
                <Bar dataKey="planned" fill="#93c5fd" name="Planned Progress %" radius={[8, 8, 0, 0]} />
                <Bar dataKey="actual" fill="#3b82f6" name="Actual Progress %" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {reportType === 'tasks' && (
          <Card className="rounded-3xl shadow-lg border-0 p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Task Completion Analytics</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={taskCompletionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.75rem'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#9ca3af" strokeWidth={2} name="Total Tasks" />
                <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={3} name="Completed Tasks" />
              </LineChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 rounded-2xl">
                <div className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</div>
                <div className="text-2xl font-bold text-emerald-600">89%</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-2xl">
                <div className="text-sm text-gray-600 dark:text-gray-400">On-Time Delivery</div>
                <div className="text-2xl font-bold text-blue-600">76%</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 rounded-2xl">
                <div className="text-sm text-gray-600 dark:text-gray-400">Overdue Tasks</div>
                <div className="text-2xl font-bold text-amber-600">5</div>
              </div>
            </div>
          </Card>
        )}

        {reportType === 'budget' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="rounded-3xl shadow-lg border-0 p-6">
                <h3 className="text-lg font-semibold mb-4">Budget Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={budgetDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {budgetDistribution.map((entry, index) => (
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
                <h3 className="text-lg font-semibold mb-4">Budget vs Actual Spending</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="project" stroke="#6b7280" angle={-15} textAnchor="end" height={80} />
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
                    <Bar dataKey="spent" fill="#3b82f6" name="Spent" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card className="rounded-3xl shadow-lg border-0 p-6">
              <h3 className="text-lg font-semibold mb-4">Project Budget Details</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Project</th>
                      <th className="text-right py-3 px-4">Budget</th>
                      <th className="text-right py-3 px-4">Spent</th>
                      <th className="text-right py-3 px-4">Remaining</th>
                      <th className="text-right py-3 px-4">Utilization</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performanceData.map((project, idx) => {
                      const remaining = project.budget - project.spent;
                      const utilization = ((project.spent / project.budget) * 100).toFixed(1);
                      return (
                        <tr key={idx} className="border-b">
                          <td className="py-3 px-4 font-semibold">{project.project}</td>
                          <td className="py-3 px-4 text-right">UGX {project.budget.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right text-blue-600 font-semibold">UGX {project.spent.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right text-emerald-600 font-semibold">UGX {remaining.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right">
                            <span className={`font-semibold ${parseFloat(utilization) > 90 ? 'text-red-600' : parseFloat(utilization) > 75 ? 'text-amber-600' : 'text-emerald-600'}`}>
                              {utilization}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
