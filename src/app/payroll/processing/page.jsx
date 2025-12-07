'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatusBadge from '@/components/core/StatusBadge';
import { CheckCircle, Upload, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const mockPayrollEmployees = [
  { id: 'EMP-001', name: 'John Kamau', basicPay: 250000, allowances: 75000, deductions: 45000, netPay: 280000 },
  { id: 'EMP-002', name: 'Mary Wanjiru', basicPay: 220000, allowances: 60000, deductions: 38000, netPay: 242000 },
  { id: 'EMP-003', name: 'James Ochieng', basicPay: 280000, allowances: 85000, deductions: 52000, netPay: 313000 },
  { id: 'EMP-004', name: 'Sarah Akinyi', basicPay: 200000, allowances: 55000, deductions: 35000, netPay: 220000 },
  { id: 'EMP-005', name: 'Peter Mwangi', basicPay: 240000, allowances: 70000, deductions: 42000, netPay: 268000 }
];

export default function PayrollProcessingPage() {
  const [activeTab, setActiveTab] = useState('summary');
  const [payrollStatus, setPayrollStatus] = useState('draft');

  const totalGross = mockPayrollEmployees.reduce((sum, e) => sum + e.basicPay + e.allowances, 0);
  const totalDeductions = mockPayrollEmployees.reduce((sum, e) => sum + e.deductions, 0);
  const totalNet = mockPayrollEmployees.reduce((sum, e) => sum + e.netPay, 0);

  const columns = [
    { header: 'Employee ID', accessor: 'id', render: (row) => <span className="font-mono text-sm">{row.id}</span> },
    { header: 'Name', accessor: 'name', render: (row) => <span className="font-semibold">{row.name}</span> },
    { header: 'Basic Pay', accessor: 'basicPay', render: (row) => <span className="font-semibold">UGX {row.basicPay.toLocaleString()}</span> },
    { header: 'Allowances', accessor: 'allowances', render: (row) => <span className="text-emerald-600">UGX {row.allowances.toLocaleString()}</span> },
    { header: 'Deductions', accessor: 'deductions', render: (row) => <span className="text-red-600">UGX {row.deductions.toLocaleString()}</span> },
    { header: 'Net Pay', accessor: 'netPay', render: (row) => <span className="font-bold text-blue-600">UGX {row.netPay.toLocaleString()}</span> }
  ];

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Payroll Processing"
          subtitle="December 2025 Payroll"
          actions={[
            <StatusBadge key="status" variant={payrollStatus === 'approved' ? 'success' : 'pending'}>
              {payrollStatus}
            </StatusBadge>,
            <Button key="approve" variant="outline" className="rounded-2xl" onClick={() => setPayrollStatus('approved')}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>,
            <Button key="process" className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600">
              Process Payroll
            </Button>
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[
            { label: 'Total Gross', value: `UGX ${(totalGross / 1000000).toFixed(2)}M`, color: 'from-blue-500 to-cyan-500' },
            { label: 'Total Deductions', value: `UGX ${(totalDeductions / 1000).toFixed(0)}K`, color: 'from-red-500 to-rose-500' },
            { label: 'Total Net Pay', value: `UGX ${(totalNet / 1000000).toFixed(2)}M`, color: 'from-emerald-500 to-teal-500' }
          ].map((stat, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <Card className={`rounded-3xl shadow-lg border-0 overflow-hidden bg-gradient-to-br ${stat.color} text-white p-6`}>
                <div className="text-sm opacity-90 mb-1">{stat.label}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="rounded-3xl shadow-lg border-0 p-6 mb-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950">
          <h3 className="text-lg font-semibold mb-3">Pre-Payroll Checklist</h3>
          <div className="space-y-2">
            {[
              { task: 'Attendance records verified', checked: true },
              { task: 'Leave adjustments applied', checked: true },
              { task: 'Overtime calculations reviewed', checked: true },
              { task: 'Tax rates updated', checked: false }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input type="checkbox" checked={item.checked} readOnly className="rounded" />
                <span className={item.checked ? 'text-gray-900 dark:text-white' : 'text-gray-500'}>{item.task}</span>
              </div>
            ))}
          </div>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl">
            <TabsTrigger value="summary" className="rounded-xl">Summary</TabsTrigger>
            <TabsTrigger value="details" className="rounded-xl">Details Table</TabsTrigger>
            <TabsTrigger value="adjustments" className="rounded-xl">Adjustments</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <Card className="rounded-3xl shadow-lg border-0 p-6">
              <h3 className="text-lg font-semibold mb-4">Payroll Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                    <span className="text-gray-600 dark:text-gray-400">Employees Processed</span>
                    <span className="font-bold text-xl">{mockPayrollEmployees.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                    <span className="text-gray-600 dark:text-gray-400">Total Basic Pay</span>
                    <span className="font-bold text-xl">UGX {(mockPayrollEmployees.reduce((sum, e) => sum + e.basicPay, 0) / 1000).toFixed(0)}K</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                    <span className="text-gray-600 dark:text-gray-400">Variance from Last Month</span>
                    <span className="font-bold text-xl text-emerald-600">+2.5%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                    <span className="text-gray-600 dark:text-gray-400">Average Net Pay</span>
                    <span className="font-bold text-xl">UGX {Math.round(totalNet / mockPayrollEmployees.length).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <Card className="rounded-3xl shadow-lg border-0">
              <DataTable columns={columns} data={mockPayrollEmployees} />
            </Card>
          </TabsContent>

          <TabsContent value="adjustments">
            <Card className="rounded-3xl shadow-lg border-0 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Manual Adjustments</h3>
                <Button variant="outline" className="rounded-2xl">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload CSV
                </Button>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">No manual adjustments for this period.</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
