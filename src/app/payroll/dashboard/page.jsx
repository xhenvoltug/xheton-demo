'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, TrendingDown, Users, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const mockPayrollData = {
  monthlyTotal: 12500000,
  totalSalaries: 9800000,
  totalDeductions: 1450000,
  totalAllowances: 3150000,
  netPay: 11500000,
  employeeCount: 48,
  status: 'pending'
};

const payrollBreakdown = [
  { component: 'Basic Pay', amount: 9800000 },
  { component: 'Housing Allowance', amount: 1200000 },
  { component: 'Transport Allowance', amount: 950000 },
  { component: 'Medical Allowance', amount: 500000 },
  { component: 'PAYE Tax', amount: -850000 },
  { component: 'NSSF', amount: -350000 },
  { component: 'NHIF', amount: -250000 }
];

export default function PayrollDashboardPage() {
  const router = useRouter();

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Payroll Dashboard"
          subtitle="Manage employee compensation and payroll processing"
          actions={[
            <Button key="structure" variant="outline" className="rounded-2xl" onClick={() => router.push('/payroll/structure')}>
              Salary Structure
            </Button>,
            <Button key="run" className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600">
              <PlayCircle className="h-4 w-4 mr-2" />
              Run Payroll
            </Button>
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Gross Salaries', value: `UGX ${(mockPayrollData.totalSalaries / 1000000).toFixed(1)}M`, color: 'from-blue-500 to-cyan-500', icon: DollarSign },
            { label: 'Allowances', value: `UGX ${(mockPayrollData.totalAllowances / 1000000).toFixed(1)}M`, color: 'from-emerald-500 to-teal-500', icon: TrendingUp },
            { label: 'Deductions', value: `UGX ${(mockPayrollData.totalDeductions / 1000000).toFixed(1)}M`, color: 'from-red-500 to-rose-500', icon: TrendingDown },
            { label: 'Net Pay', value: `UGX ${(mockPayrollData.netPay / 1000000).toFixed(1)}M`, color: 'from-purple-500 to-pink-500', icon: Users }
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

        <Card className="rounded-3xl shadow-lg border-0 p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Payroll Breakdown</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={payrollBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="component" stroke="#6b7280" angle={-15} textAnchor="end" height={100} />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                formatter={(value) => `UGX ${Math.abs(value).toLocaleString()}`}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.75rem'
                }}
              />
              <Legend />
              <Bar dataKey="amount" fill="#3b82f6" name="Amount" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Process Payroll', subtitle: 'Run monthly payroll', link: '/payroll/processing', color: 'from-blue-500 to-cyan-500' },
            { title: 'Payslips', subtitle: 'Generate & send payslips', link: '/payroll/payslips', color: 'from-purple-500 to-pink-500' },
            { title: 'Statutory Compliance', subtitle: 'Tax & compliance reports', link: '/payroll/compliance', color: 'from-emerald-500 to-teal-500' }
          ].map((item, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + idx * 0.1 }}>
              <Card 
                className="rounded-3xl shadow-lg border-0 p-8 cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => router.push(item.link)}
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} mb-4`} />
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{item.subtitle}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
