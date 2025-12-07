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
import { Eye, Download, Send } from 'lucide-react';

const mockInvoices = [
  {
    id: 'INV-001',
    customer: 'Acme Corporation',
    date: '2025-12-06',
    dueDate: '2025-12-20',
    items: 5,
    subtotal: 11318.18,
    tax: 1131.82,
    total: 12450.00,
    status: 'paid',
    paidDate: '2025-12-08',
  },
  {
    id: 'INV-002',
    customer: 'TechStart Inc',
    date: '2025-12-05',
    dueDate: '2025-12-19',
    items: 3,
    subtotal: 8091.36,
    tax: 809.14,
    total: 8900.50,
    status: 'pending',
  },
  {
    id: 'INV-003',
    customer: 'Global Traders',
    date: '2025-12-04',
    dueDate: '2025-12-18',
    items: 8,
    subtotal: 22272.73,
    tax: 2227.27,
    total: 24500.00,
    status: 'paid',
    paidDate: '2025-12-05',
  },
  {
    id: 'INV-004',
    customer: 'Metro Solutions',
    date: '2025-11-28',
    dueDate: '2025-12-12',
    items: 2,
    subtotal: 2909.09,
    tax: 290.91,
    total: 3200.00,
    status: 'overdue',
  },
];

const statusColors = {
  paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  overdue: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function InvoicesListPage() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const columns = [
    {
      header: 'Invoice #',
      accessor: 'id',
      render: (row) => (
        <span className="font-semibold text-gray-900 dark:text-white">{row.id}</span>
      ),
    },
    {
      header: 'Customer',
      accessor: 'customer',
      render: (row) => (
        <span className="text-gray-700 dark:text-gray-300">{row.customer}</span>
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
      header: 'Due Date',
      accessor: 'dueDate',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-400">
          {new Date(row.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      ),
    },
    {
      header: 'Amount',
      accessor: 'total',
      render: (row) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          ${row.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
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
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/sales/invoices/${row.id}`)}
            className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const filters = [
    {
      label: 'Status',
      value: statusFilter,
      options: [
        { label: 'Paid', value: 'paid' },
        { label: 'Pending', value: 'pending' },
        { label: 'Overdue', value: 'overdue' },
      ],
      onChange: setStatusFilter,
    },
  ];

  const filteredData = mockInvoices.filter((invoice) => {
    const matchesSearch = invoice.customer.toLowerCase().includes(searchValue.toLowerCase()) ||
                         invoice.id.toLowerCase().includes(searchValue.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Invoices"
          subtitle="Manage all sales invoices and payments"
          actions={[
            <Button
              key="export"
              variant="outline"
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export All
            </Button>,
          ]}
        />

        <FilterBar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filters={filters}
          onClearFilters={() => {
            setSearchValue('');
            setStatusFilter('all');
          }}
        />

        {/* Desktop Table */}
        <div className="hidden md:block">
          <DataTable
            columns={columns}
            data={filteredData}
          />
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {filteredData.map((invoice) => (
            <MobileCard
              key={invoice.id}
              onClick={() => router.push(`/sales/invoices/${invoice.id}`)}
              data={[
                { label: 'Invoice', value: invoice.id },
                { label: 'Customer', value: invoice.customer },
                { label: 'Amount', value: `$${invoice.total.toLocaleString()}` },
                { label: 'Due Date', value: new Date(invoice.dueDate).toLocaleDateString() },
                {
                  label: 'Status',
                  value: <Badge className={statusColors[invoice.status]}>{invoice.status}</Badge>
                },
              ]}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
