'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const mockComponents = [
  { id: 'SC-001', name: 'Basic Pay', category: 'Fixed', taxable: 'Yes', formula: 'Monthly Salary' },
  { id: 'SC-002', name: 'Housing Allowance', category: 'Allowance', taxable: 'Yes', formula: '15% of Basic Pay' },
  { id: 'SC-003', name: 'Transport Allowance', category: 'Allowance', taxable: 'No', formula: 'Fixed UGX 20,000' },
  { id: 'SC-004', name: 'Medical Allowance', category: 'Allowance', taxable: 'No', formula: 'Fixed UGX 10,000' },
  { id: 'SC-005', name: 'PAYE Tax', category: 'Deduction', taxable: 'N/A', formula: 'Progressive Tax Rate' },
  { id: 'SC-006', name: 'NSSF', category: 'Deduction', taxable: 'N/A', formula: '6% of Gross (Max 18K)' },
  { id: 'SC-007', name: 'NHIF', category: 'Deduction', taxable: 'N/A', formula: 'Tiered Rates' }
];

export default function SalaryStructurePage() {
  const router = useRouter();

  const allowances = mockComponents.filter(c => c.category === 'Allowance').length;
  const deductions = mockComponents.filter(c => c.category === 'Deduction').length;
  const fixedComponents = mockComponents.filter(c => c.category === 'Fixed').length;

  const columns = [
    { header: 'Component ID', accessor: 'id', render: (row) => <span className="font-mono text-sm">{row.id}</span> },
    { header: 'Name', accessor: 'name', render: (row) => <span className="font-semibold">{row.name}</span> },
    { 
      header: 'Category', 
      accessor: 'category',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          row.category === 'Fixed' ? 'bg-blue-100 text-blue-700' :
          row.category === 'Allowance' ? 'bg-emerald-100 text-emerald-700' :
          'bg-red-100 text-red-700'
        }`}>
          {row.category}
        </span>
      )
    },
    { header: 'Taxable', accessor: 'taxable' },
    { header: 'Formula', accessor: 'formula', render: (row) => <span className="text-sm text-gray-600">{row.formula}</span> }
  ];

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Salary Structure Setup"
          subtitle="Configure salary components and formulas"
          actions={[
            <Button key="export" variant="outline" className="rounded-2xl">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>,
            <Button key="new" className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Component
            </Button>
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[
            { label: 'Fixed Components', value: fixedComponents, color: 'from-blue-500 to-cyan-500' },
            { label: 'Allowances', value: allowances, color: 'from-emerald-500 to-teal-500' },
            { label: 'Deductions', value: deductions, color: 'from-red-500 to-rose-500' }
          ].map((stat, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <Card className={`rounded-3xl shadow-lg border-0 overflow-hidden bg-gradient-to-br ${stat.color} text-white p-6`}>
                <div className="text-sm opacity-90 mb-1">{stat.label}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="rounded-3xl shadow-lg border-0 p-6 mb-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
          <h3 className="text-lg font-semibold mb-3">Formula Builder (Drag & Drop)</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            Create complex salary formulas by combining components with operators (+, -, *, /, %)
          </p>
          <div className="flex gap-3 flex-wrap">
            {['Basic Pay', 'Housing', 'Transport', '+', '-', '*', '%'].map((item, idx) => (
              <div key={idx} className="px-4 py-2 bg-white dark:bg-gray-800 border-2 border-dashed border-blue-300 rounded-xl cursor-move hover:border-blue-500 transition-colors">
                <span className="font-semibold text-sm">{item}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-3xl shadow-lg border-0">
          <DataTable columns={columns} data={mockComponents} />
        </Card>
      </div>
    </DashboardLayout>
  );
}
