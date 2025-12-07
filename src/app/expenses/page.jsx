'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import FilterBar from '@/components/shared/FilterBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/core/StatusBadge';
import { Plus, FileText, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const mockExpenses = [
  { id: 'EXP-001', date: '2025-12-05', category: 'Salaries & Wages', description: 'December salaries', amount: 230000, paymentMethod: 'Bank Transfer', status: 'Paid', paidBy: 'John Kamau' },
  { id: 'EXP-002', date: '2025-12-03', category: 'Rent & Utilities', description: 'Monthly rent + electricity', amount: 85000, paymentMethod: 'Cheque', status: 'Paid', paidBy: 'Mary Wanjiru' },
  { id: 'EXP-003', date: '2025-12-01', category: 'Transport & Fuel', description: 'Fuel for delivery trucks', amount: 18000, paymentMethod: 'Cash', status: 'Paid', paidBy: 'James Ochieng' },
  { id: 'EXP-004', date: '2025-11-30', category: 'Office Supplies', description: 'Stationery and printer ink', amount: 12000, paymentMethod: 'M-Pesa', status: 'Paid', paidBy: 'Sarah Akinyi' },
  { id: 'EXP-005', date: '2025-11-28', category: 'Marketing & Advertising', description: 'Facebook ads campaign', amount: 22000, paymentMethod: 'Credit Card', status: 'Paid', paidBy: 'Peter Mwangi' },
  { id: 'EXP-006', date: '2025-11-25', category: 'Maintenance & Repairs', description: 'Office AC repair', amount: 15000, paymentMethod: 'Cash', status: 'Paid', paidBy: 'John Kamau' },
  { id: 'EXP-007', date: '2025-12-06', category: 'Transport & Fuel', description: 'Fuel advance for drivers', amount: 20000, paymentMethod: 'Pending', status: 'Pending', paidBy: '-' }
];

export default function ExpensesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const categories = ['all', ...new Set(mockExpenses.map(e => e.category))];

  const filteredExpenses = mockExpenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || expense.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalExpenses = mockExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const paidExpenses = mockExpenses.filter(e => e.status === 'Paid').reduce((sum, exp) => sum + exp.amount, 0);
  const pendingExpenses = mockExpenses.filter(e => e.status === 'Pending').reduce((sum, exp) => sum + exp.amount, 0);

  const columns = [
    { 
      header: 'Expense ID', 
      accessor: 'id',
      render: (row) => <span className="font-mono text-blue-600 dark:text-blue-400">{row.id}</span>
    },
    { header: 'Date', accessor: 'date' },
    { 
      header: 'Category', 
      accessor: 'category',
      render: (row) => <StatusBadge variant="info">{row.category}</StatusBadge>
    },
    { 
      header: 'Description', 
      accessor: 'description',
      render: (row) => (
        <div className="max-w-xs">
          <div className="font-medium text-gray-900 dark:text-white truncate">{row.description}</div>
        </div>
      )
    },
    { 
      header: 'Amount', 
      accessor: 'amount',
      render: (row) => <span className="font-bold text-red-600">UGX {row.amount.toLocaleString()}</span>
    },
    { header: 'Payment Method', accessor: 'paymentMethod' },
    { header: 'Paid By', accessor: 'paidBy' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => (
        <StatusBadge variant={row.status === 'Paid' ? 'success' : 'pending'}>
          {row.status}
        </StatusBadge>
      )
    }
  ];

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Expenses"
          subtitle="Track and manage all business expenses"
          actions={[
            <Button
              key="categories"
              onClick={() => router.push('/expenses/categories')}
              variant="outline"
              className="rounded-2xl"
            >
              Manage Categories
            </Button>,
            <Button
              key="add"
              onClick={() => router.push('/expenses/new')}
              className="rounded-2xl bg-gradient-to-r from-red-600 to-rose-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Record Expense
            </Button>
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[
            { label: 'Total Expenses', value: `UGX ${totalExpenses.toLocaleString()}`, color: 'from-red-500 to-rose-500' },
            { label: 'Paid', value: `UGX ${paidExpenses.toLocaleString()}`, color: 'from-emerald-500 to-teal-500' },
            { label: 'Pending', value: `UGX ${pendingExpenses.toLocaleString()}`, color: 'from-amber-500 to-orange-500' }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className={`rounded-3xl shadow-lg border-0 overflow-hidden bg-gradient-to-br ${stat.color} text-white p-6`}>
                <div className="flex items-center justify-between mb-2">
                  <FileText className="h-8 w-8 opacity-80" />
                </div>
                <div className="text-sm opacity-90 mb-1">{stat.label}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="rounded-3xl shadow-lg border-0">
            <FilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Search by ID or description..."
              filters={[
                {
                  label: 'Category',
                  value: categoryFilter,
                  onChange: setCategoryFilter,
                  options: categories.map(cat => ({ value: cat, label: cat === 'all' ? 'All Categories' : cat }))
                },
                {
                  label: 'Status',
                  value: statusFilter,
                  onChange: setStatusFilter,
                  options: [
                    { value: 'all', label: 'All Status' },
                    { value: 'paid', label: 'Paid' },
                    { value: 'pending', label: 'Pending' }
                  ]
                }
              ]}
              actions={[
                <Button key="export" variant="outline" className="rounded-2xl">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              ]}
            />
            <DataTable columns={columns} data={filteredExpenses} />
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
