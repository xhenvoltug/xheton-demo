'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import FilterBar from '@/components/shared/FilterBar';
import DataTable from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';

const mockBatches = [
  {
    id: 'BAT-001',
    product: 'Laptop Pro 15"',
    batchNumber: 'LP2025001',
    quantity: 50,
    remaining: 30,
    expiryDate: '2026-12-31',
    status: 'active',
  },
  {
    id: 'BAT-002',
    product: 'Wireless Mouse',
    batchNumber: 'WM2025001',
    quantity: 200,
    remaining: 120,
    expiryDate: '2027-06-30',
    status: 'active',
  },
  {
    id: 'BAT-003',
    product: 'USB-C Cable',
    batchNumber: 'UC2024012',
    quantity: 300,
    remaining: 8,
    expiryDate: '2025-12-31',
    status: 'expiring_soon',
  },
];

export default function BatchesListPage() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const columns = [
    {
      header: 'Batch Number',
      accessor: 'batchNumber',
      render: (row) => <span className="font-semibold text-gray-900 dark:text-white">{row.batchNumber}</span>,
    },
    {
      header: 'Product',
      accessor: 'product',
      render: (row) => <span className="text-gray-900 dark:text-white">{row.product}</span>,
    },
    {
      header: 'Total Qty',
      accessor: 'quantity',
      render: (row) => <span className="text-gray-600 dark:text-gray-400">{row.quantity}</span>,
    },
    {
      header: 'Remaining',
      accessor: 'remaining',
      render: (row) => (
        <span className="font-semibold text-gray-900 dark:text-white">{row.remaining}</span>
      ),
    },
    {
      header: 'Expiry Date',
      accessor: 'expiryDate',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-400">
          {new Date(row.expiryDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <Badge className={
          row.status === 'active'
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
        }>
          {row.status.replace('_', ' ')}
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
          onClick={() => router.push(`/inventory/batches/${row.id}`)}
        >
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
      ),
    },
  ];

  const filters = [
    {
      label: 'Status',
      value: statusFilter,
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Expiring Soon', value: 'expiring_soon' },
      ],
      onChange: setStatusFilter,
    },
  ];

  const filteredData = mockBatches.filter((batch) => {
    const matchesSearch = batch.product.toLowerCase().includes(searchValue.toLowerCase()) ||
                         batch.batchNumber.toLowerCase().includes(searchValue.toLowerCase());
    const matchesStatus = statusFilter === 'all' || batch.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Batches & Serials"
          subtitle="Track product batches and expiry dates"
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

        <DataTable columns={columns} data={filteredData} />
      </div>
    </DashboardLayout>
  );
}
