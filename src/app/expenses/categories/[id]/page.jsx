'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/shared/StatCard';
import DataTable from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Receipt, TrendingUp, Edit, Calendar } from 'lucide-react';

const mockCategoryDetails = {
  'CAT-001': {
    id: 'CAT-001',
    name: 'Office Supplies',
    description: 'Pens, paper, and office materials',
    totalExpenses: 12450.00,
    expenseCount: 24,
    avgExpense: 518.75,
    status: 'active',
    recentExpenses: [
      { id: 'EXP-045', date: '2025-12-06', amount: 245.00, paymentMethod: 'Credit Card', notes: 'Printer paper and toner' },
      { id: 'EXP-042', date: '2025-12-04', amount: 89.50, paymentMethod: 'Cash', notes: 'Office supplies' },
      { id: 'EXP-038', date: '2025-12-01', amount: 156.00, paymentMethod: 'Credit Card', notes: 'Stationery items' },
    ],
  },
};

export default function CategoryDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const category = mockCategoryDetails[id] || mockCategoryDetails['CAT-001'];

  const statusColors = {
    active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  };

  const expenseColumns = [
    {
      header: 'Expense ID',
      accessor: 'id',
      render: (row) => (
        <button
          onClick={() => router.push(`/expenses/entries/${row.id}`)}
          className="font-semibold font-mono text-amber-600 dark:text-amber-400 hover:underline"
        >
          {row.id}
        </button>
      ),
    },
    {
      header: 'Date',
      accessor: 'date',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-400">
          {new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      ),
    },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (row) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          ${row.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      header: 'Payment Method',
      accessor: 'paymentMethod',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-400">{row.paymentMethod}</span>
      ),
    },
    {
      header: 'Notes',
      accessor: 'notes',
      render: (row) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">{row.notes}</span>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title={category.name}
          subtitle={category.description}
          actions={[
            <Button
              key="edit"
              variant="outline"
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Category
            </Button>,
            <Button
              key="add"
              onClick={() => router.push('/expenses/entries/new')}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 gap-2"
            >
              <Receipt className="h-4 w-4" />
              Add Expense
            </Button>
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            icon={DollarSign}
            label="Total Expenses"
            value={`$${category.totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            trend={{ value: 8.5, isPositive: false }}
            iconColor="amber"
          />
          <StatCard
            icon={Receipt}
            label="Expense Count"
            value={category.expenseCount}
            iconColor="orange"
          />
          <StatCard
            icon={TrendingUp}
            label="Average Expense"
            value={`$${category.avgExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            iconColor="red"
          />
          <StatCard
            icon={Calendar}
            label="Status"
            value={<Badge className={statusColors[category.status]}>{category.status}</Badge>}
            iconColor="emerald"
          />
        </div>

        <Card className="p-6 bg-white dark:bg-gray-900/50">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Expenses</h3>
          <DataTable columns={expenseColumns} data={category.recentExpenses} variant="compact" />
        </Card>
      </div>
    </DashboardLayout>
  );
}
