'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import FilterBar from '@/components/shared/FilterBar';
import DataTable from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye } from 'lucide-react';

const mockAdjustments = [
  {
    id: 'ADJ-001',
    date: '2025-12-06',
    product: 'Laptop Pro 15"',
    type: 'increase',
    quantity: 10,
    reason: 'Stock count correction',
    user: 'John Doe',
  },
  {
    id: 'ADJ-002',
    date: '2025-12-05',
    product: 'Wireless Mouse',
    type: 'decrease',
    quantity: 5,
    reason: 'Damaged items',
    user: 'Jane Smith',
  },
  {
    id: 'ADJ-003',
    date: '2025-12-04',
    product: 'Monitor 27"',
    type: 'increase',
    quantity: 15,
    reason: 'Warehouse transfer',
    user: 'John Doe',
  },
];

export default function AdjustmentsListPage() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const columns = [
    {
      header: 'Adjustment ID',
      accessor: 'id',
      render: (row) => <span className="font-semibold text-gray-900 dark:text-white">{row.id}</span>,
    },
    {
      header: 'Date',
      accessor: 'date',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-400">
          {new Date(row.date).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Product',
      accessor: 'product',
      render: (row) => <span className="text-gray-900 dark:text-white">{row.product}</span>,
    },
    {
      header: 'Type',
      accessor: 'type',
      render: (row) => (
        <Badge className={
          row.type === 'increase'
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        }>
          {row.type === 'increase' ? '+' : '-'} {row.quantity}
        </Badge>
      ),
    },
    {
      header: 'Reason',
      accessor: 'reason',
      render: (row) => <span className="text-gray-600 dark:text-gray-400">{row.reason}</span>,
    },
    {
      header: 'By',
      accessor: 'user',
      render: (row) => <span className="text-gray-700 dark:text-gray-300">{row.user}</span>,
    },
  ];

  const filters = [
    {
      label: 'Type',
      value: typeFilter,
      options: [
        { label: 'Increase', value: 'increase' },
        { label: 'Decrease', value: 'decrease' },
      ],
      onChange: setTypeFilter,
    },
  ];

  const filteredData = mockAdjustments.filter((adj) => {
    const matchesSearch = adj.product.toLowerCase().includes(searchValue.toLowerCase());
    const matchesType = typeFilter === 'all' || adj.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Stock Adjustments"
          subtitle="View and manage inventory adjustments"
          actions={[
            <Button
              key="new"
              onClick={() => router.push('/inventory/adjustments/new')}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 gap-2"
            >
              <Plus className="h-4 w-4" />
              New Adjustment
            </Button>
          ]}
        />

        <FilterBar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filters={filters}
          onClearFilters={() => {
            setSearchValue('');
            setTypeFilter('all');
          }}
        />

        <DataTable columns={columns} data={filteredData} />
      </div>
    </DashboardLayout>
  );
}
