'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import FilterBar from '@/components/shared/FilterBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/core/StatusBadge';
import { Plus, Download, Upload, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const mockExpenses = [
  { id: 'EXP-101', category: 'Marketing', amount: 85000, date: '2025-12-05', user: 'John Kamau', project: 'PRJ-001', status: 'approved', receipt: true },
  { id: 'EXP-102', category: 'Operations', amount: 45000, date: '2025-12-04', user: 'Mary Wanjiru', project: 'PRJ-002', status: 'pending', receipt: true },
  { id: 'EXP-103', category: 'IT & Technology', amount: 120000, date: '2025-12-03', user: 'James Ochieng', project: 'PRJ-001', status: 'approved', receipt: false },
  { id: 'EXP-104', category: 'Travel', amount: 35000, date: '2025-12-02', user: 'Sarah Akinyi', project: null, status: 'rejected', receipt: true },
  { id: 'EXP-105', category: 'Office Supplies', amount: 12000, date: '2025-12-01', user: 'Peter Mwangi', project: null, status: 'approved', receipt: true }
];

export default function ExpenseManagementPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredExpenses = mockExpenses.filter(exp => {
    const matchesSearch = exp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exp.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || exp.category.toLowerCase() === categoryFilter;
    const matchesStatus = statusFilter === 'all' || exp.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalExpenses = mockExpenses.reduce((sum, e) => sum + e.amount, 0);
  const approvedExpenses = mockExpenses.filter(e => e.status === 'approved').length;
  const pendingExpenses = mockExpenses.filter(e => e.status === 'pending').length;

  const columns = [
    { header: 'Expense ID', accessor: 'id', render: (row) => <span className="font-mono text-sm">{row.id}</span> },
    { header: 'Category', accessor: 'category', render: (row) => <span className="font-semibold">{row.category}</span> },
    { 
      header: 'Amount', 
      accessor: 'amount',
      render: (row) => <span className="font-bold text-blue-600">UGX {row.amount.toLocaleString()}</span>
    },
    { header: 'Date', accessor: 'date' },
    { header: 'User', accessor: 'user' },
    { 
      header: 'Project', 
      accessor: 'project',
      render: (row) => row.project ? <span className="font-mono text-sm">{row.project}</span> : <span className="text-gray-400">-</span>
    },
    { 
      header: 'Receipt', 
      accessor: 'receipt',
      render: (row) => row.receipt ? (
        <FileText className="h-4 w-4 text-emerald-600" />
      ) : (
        <span className="text-xs text-red-600">Missing</span>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => <StatusBadge variant={row.status === 'approved' ? 'success' : row.status === 'pending' ? 'pending' : 'error'}>{row.status}</StatusBadge>
    }
  ];

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Expense Management"
          subtitle="Track and manage all organizational expenses"
          actions={[
            <Button key="export" variant="outline" className="rounded-2xl">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>,
            <Button key="new" onClick={() => router.push('/budgeting/expenses/new')} className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Total Expenses', value: `UGX ${(totalExpenses / 1000).toFixed(0)}K`, color: 'from-blue-500 to-cyan-500' },
            { label: 'Total Count', value: mockExpenses.length, color: 'from-purple-500 to-pink-500' },
            { label: 'Approved', value: approvedExpenses, color: 'from-emerald-500 to-teal-500' },
            { label: 'Pending', value: pendingExpenses, color: 'from-amber-500 to-orange-500' }
          ].map((stat, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <Card className={`rounded-3xl shadow-lg border-0 overflow-hidden bg-gradient-to-br ${stat.color} text-white p-6`}>
                <div className="text-sm opacity-90 mb-1">{stat.label}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="rounded-3xl shadow-lg border-0">
          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search by ID or category..."
            filters={[
              {
                label: 'Category',
                value: categoryFilter,
                onChange: setCategoryFilter,
                options: [
                  { value: 'all', label: 'All Categories' },
                  { value: 'marketing', label: 'Marketing' },
                  { value: 'operations', label: 'Operations' },
                  { value: 'it & technology', label: 'IT & Technology' },
                  { value: 'travel', label: 'Travel' }
                ]
              },
              {
                label: 'Status',
                value: statusFilter,
                onChange: setStatusFilter,
                options: [
                  { value: 'all', label: 'All Status' },
                  { value: 'approved', label: 'Approved' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'rejected', label: 'Rejected' }
                ]
              }
            ]}
          />
          <DataTable columns={columns} data={filteredExpenses} />
        </Card>
      </div>
    </DashboardLayout>
  );
}
