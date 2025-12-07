'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const mockStatutoryReports = [
  { id: 'STAT-001', type: 'PAYE', period: 'December 2025', amount: 850000, dueDate: '2026-01-09', status: 'pending' },
  { id: 'STAT-002', type: 'NSSF', period: 'December 2025', amount: 350000, dueDate: '2026-01-09', status: 'pending' },
  { id: 'STAT-003', type: 'NHIF', period: 'December 2025', amount: 250000, dueDate: '2026-01-09', status: 'pending' },
  { id: 'STAT-004', type: 'PAYE', period: 'November 2025', amount: 820000, dueDate: '2025-12-09', status: 'filed' },
  { id: 'STAT-005', type: 'NSSF', period: 'November 2025', amount: 340000, dueDate: '2025-12-09', status: 'filed' }
];

const taxConfig = [
  { name: 'PAYE Tax Rate', value: 'Progressive (10%-30%)', editable: false },
  { name: 'NSSF Rate', value: '6% (Employee) + 6% (Employer)', editable: false },
  { name: 'NHIF Rate', value: 'Tiered (UGX 150 - 1,700)', editable: false },
  { name: 'Personal Relief', value: 'UGX 2,400/month', editable: false }
];

export default function StatutoryCompliancePage() {
  const totalPending = mockStatutoryReports.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0);
  const pendingReports = mockStatutoryReports.filter(r => r.status === 'pending').length;
  const filedReports = mockStatutoryReports.filter(r => r.status === 'filed').length;

  const columns = [
    { header: 'Report ID', accessor: 'id', render: (row) => <span className="font-mono text-sm">{row.id}</span> },
    { header: 'Type', accessor: 'type', render: (row) => <span className="font-semibold">{row.type}</span> },
    { header: 'Period', accessor: 'period' },
    { header: 'Amount', accessor: 'amount', render: (row) => <span className="font-bold">UGX {row.amount.toLocaleString()}</span> },
    { header: 'Due Date', accessor: 'dueDate', render: (row) => <span className="text-sm">{row.dueDate}</span> },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          row.status === 'filed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {row.status}
        </span>
      )
    },
    { 
      header: 'Actions', 
      accessor: 'actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="rounded-xl">
            <FileText className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" className="rounded-xl">
            <Download className="h-3 w-3" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Statutory Compliance"
          subtitle="Manage tax and statutory reports"
          actions={[
            <Button key="calendar" variant="outline" className="rounded-2xl">
              <Calendar className="h-4 w-4 mr-2" />
              Tax Calendar
            </Button>,
            <Button key="export" className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600">
              <Download className="h-4 w-4 mr-2" />
              Export Reports
            </Button>
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[
            { label: 'Pending Amount', value: `UGX ${(totalPending / 1000000).toFixed(2)}M`, color: 'from-amber-500 to-orange-500' },
            { label: 'Pending Reports', value: pendingReports, color: 'from-blue-500 to-cyan-500' },
            { label: 'Filed This Quarter', value: filedReports, color: 'from-emerald-500 to-teal-500' }
          ].map((stat, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <Card className={`rounded-3xl shadow-lg border-0 overflow-hidden bg-gradient-to-br ${stat.color} text-white p-6`}>
                <div className="text-sm opacity-90 mb-1">{stat.label}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="rounded-3xl shadow-lg border-0 p-6">
            <h3 className="text-lg font-semibold mb-4">Tax Configuration</h3>
            <div className="space-y-3">
              {taxConfig.map((config, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                  <span className="text-gray-700 dark:text-gray-300">{config.name}</span>
                  <span className="font-semibold">{config.value}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-3xl shadow-lg border-0 p-6">
            <h3 className="text-lg font-semibold mb-4">Employer Tax Calendar (Q4 2025)</h3>
            <div className="space-y-3">
              {[
                { month: 'October', deadline: '2025-11-09', items: 'PAYE, NSSF, NHIF' },
                { month: 'November', deadline: '2025-12-09', items: 'PAYE, NSSF, NHIF' },
                { month: 'December', deadline: '2026-01-09', items: 'PAYE, NSSF, NHIF' }
              ].map((entry, idx) => (
                <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold">{entry.month}</span>
                    <span className="text-sm text-gray-600">{entry.deadline}</span>
                  </div>
                  <div className="text-xs text-gray-500">{entry.items}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="rounded-3xl shadow-lg border-0">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Monthly Statutory Reports</h3>
          </div>
          <DataTable columns={columns} data={mockStatutoryReports} />
        </Card>
      </div>
    </DashboardLayout>
  );
}
