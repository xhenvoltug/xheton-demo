'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import FilterBar from '@/components/shared/FilterBar';
import DataTable from '@/components/shared/DataTable';
import MobileCard from '@/components/shared/MobileCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Download, FileText } from 'lucide-react';

const mockExpenses = [
  {
    id: 'EXP-045',
    date: '2025-12-06',
    category: 'Office Supplies',
    amount: 245.00,
    paymentMethod: 'Credit Card',
    notes: 'Printer paper and toner',
    status: 'approved',
    attachments: 1,
  },
  {
    id: 'EXP-044',
    date: '2025-12-06',
    category: 'Transportation',
    amount: 85.50,
    paymentMethod: 'Cash',
    notes: 'Fuel for delivery van',
    status: 'approved',
    attachments: 0,
  },
  {
    id: 'EXP-043',
    date: '2025-12-05',
    category: 'Utilities',
    amount: 1250.00,
    paymentMethod: 'Bank Transfer',
    notes: 'Monthly electricity bill',
    status: 'approved',
    attachments: 1,
  },
  {
    id: 'EXP-042',
    date: '2025-12-04',
    category: 'Marketing',
    amount: 850.00,
    paymentMethod: 'Credit Card',
    notes: 'Social media advertising',
    status: 'pending',
    attachments: 0,
  },
  {
    id: 'EXP-041',
    date: '2025-12-03',
    category: 'Office Supplies',
    amount: 156.00,
    paymentMethod: 'Credit Card',
    notes: 'Stationery items',
    status: 'approved',
    attachments: 1,
  },
];

const statusColors = {
  approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function ExpenseEntriesListPage() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const columns = [
    {
      header: 'Expense ID',
      accessor: 'id',
      render: (row) => <span className="font-semibold font-mono text-gray-900 dark:text-white">{row.id}</span>,
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
      header: 'Category',
      accessor: 'category',
      render: (row) => (
        <span className="font-medium text-gray-900 dark:text-white">{row.category}</span>
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
        <span className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">{row.notes}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <Badge className={`${statusColors[row.status]} capitalize`}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/expenses/entries/${row.id}`)}
          className="hover:bg-amber-50 dark:hover:bg-amber-900/20"
        >
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
      ),
    },
  ];

  const filters = [
    {
      label: 'Category',
      value: categoryFilter,
      options: [
        { label: 'Office Supplies', value: 'office' },
        { label: 'Utilities', value: 'utilities' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Transportation', value: 'transportation' },
      ],
      onChange: setCategoryFilter,
    },
    {
      label: 'Payment Method',
      value: paymentFilter,
      options: [
        { label: 'Credit Card', value: 'credit' },
        { label: 'Cash', value: 'cash' },
        { label: 'Bank Transfer', value: 'bank' },
      ],
      onChange: setPaymentFilter,
    },
    {
      label: 'Status',
      value: statusFilter,
      options: [
        { label: 'Approved', value: 'approved' },
        { label: 'Pending', value: 'pending' },
        { label: 'Rejected', value: 'rejected' },
      ],
      onChange: setStatusFilter,
    },
  ];

  const filteredData = mockExpenses.filter((expense) => {
    const matchesSearch = expense.id.toLowerCase().includes(searchValue.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchValue.toLowerCase()) ||
                         expense.notes.toLowerCase().includes(searchValue.toLowerCase());
    const matchesStatus = statusFilter === 'all' || expense.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Expense Entries"
          subtitle="Track and manage all business expenses"
          actions={[
            <Button
              key="export"
              variant="outline"
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>,
            <Button
              key="new"
              onClick={() => router.push('/expenses/entries/new')}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 gap-2"
            >
              <Plus className="h-4 w-4" />
              New Expense
            </Button>
          ]}
        />

        <FilterBar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filters={filters}
          onClearFilters={() => {
            setSearchValue('');
            setCategoryFilter('all');
            setPaymentFilter('all');
            setStatusFilter('all');
          }}
        />

        {/* Desktop Table */}
        <div className="hidden md:block">
          <DataTable columns={columns} data={filteredData} />
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {filteredData.map((expense) => (
            <MobileCard
              key={expense.id}
              onClick={() => router.push(`/expenses/entries/${expense.id}`)}
              data={[
                { label: 'ID', value: expense.id },
                { label: 'Date', value: new Date(expense.date).toLocaleDateString() },
                { label: 'Category', value: expense.category },
                { label: 'Amount', value: `$${expense.amount.toLocaleString()}` },
                { label: 'Status', value: <Badge className={statusColors[expense.status]}>{expense.status}</Badge> },
              ]}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
