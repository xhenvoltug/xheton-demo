'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, Building2, TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const mockStats = {
  totalStaff: 48,
  departments: 8,
  attendanceRate: 94.5,
  contractExpiries: 3
};

export default function HRDashboardPage() {
  const router = useRouter();

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Human Resource Management"
          subtitle="Manage employees, attendance, and HR operations"
          actions={[
            <Button key="contract" variant="outline" className="rounded-2xl">
              <Calendar className="h-4 w-4 mr-2" />
              Add Contract
            </Button>,
            <Button key="position" variant="outline" className="rounded-2xl">
              <Building2 className="h-4 w-4 mr-2" />
              Add Position
            </Button>,
            <Button key="employee" onClick={() => router.push('/hr/employees/new')} className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Total Staff', value: mockStats.totalStaff, color: 'from-blue-500 to-cyan-500', icon: Users },
            { label: 'Departments', value: mockStats.departments, color: 'from-purple-500 to-pink-500', icon: Building2 },
            { label: 'Attendance Rate', value: `${mockStats.attendanceRate}%`, color: 'from-emerald-500 to-teal-500', icon: TrendingUp },
            { label: 'Contract Expiries', value: mockStats.contractExpiries, color: 'from-red-500 to-rose-500', icon: Calendar }
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Employees', subtitle: 'Manage employee records', link: '/hr/employees', color: 'from-blue-500 to-cyan-500' },
            { title: 'Attendance', subtitle: 'Track attendance & shifts', link: '/hr/attendance', color: 'from-purple-500 to-pink-500' },
            { title: 'Leave Management', subtitle: 'Manage leave requests', link: '/hr/leave', color: 'from-emerald-500 to-teal-500' }
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
