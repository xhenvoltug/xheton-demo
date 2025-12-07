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

const mockTransfers = [
  {
    id: 'TRF-001',
    date: '2025-12-06',
    from: 'Main Warehouse',
    to: 'North Branch',
    items: 3,
    status: 'completed',
  },
  {
    id: 'TRF-002',
    date: '2025-12-05',
    from: 'South Branch',
    to: 'Main Warehouse',
    items: 5,
    status: 'in_transit',
  },
  {
    id: 'TRF-003',
    date: '2025-12-04',
    from: 'Main Warehouse',
    to: 'South Branch',
    items: 2,
    status: 'pending',
  },
];

const statusColors = {
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  in_transit: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
};

export default function TransfersListPage() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const columns = [
    {
      header: 'Transfer ID',
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
      header: 'From',
      accessor: 'from',
      render: (row) => <span className="text-gray-900 dark:text-white">{row.from}</span>,
    },
    {
      header: 'To',
      accessor: 'to',
      render: (row) => <span className="text-gray-900 dark:text-white">{row.to}</span>,
    },
    {
      header: 'Items',
      accessor: 'items',
      render: (row) => <span className="text-gray-600 dark:text-gray-400">{row.items} items</span>,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <Badge className={`${statusColors[row.status]} capitalize`}>
          {row.status.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <Button variant="ghost" size="sm">
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
        { label: 'Completed', value: 'completed' },
        { label: 'In Transit', value: 'in_transit' },
        { label: 'Pending', value: 'pending' },
      ],
      onChange: setStatusFilter,
    },
  ];

  const filteredData = mockTransfers.filter((transfer) => {
    const matchesSearch = transfer.from.toLowerCase().includes(searchValue.toLowerCase()) ||
                         transfer.to.toLowerCase().includes(searchValue.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transfer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Stock Transfers"
          subtitle="Manage transfers between warehouses"
          actions={[
            <Button
              key="new"
              onClick={() => router.push('/inventory/transfers/new')}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 gap-2"
            >
              <Plus className="h-4 w-4" />
              New Transfer
            </Button>
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

        <DataTable columns={columns} data={filteredData} />
      </div>
    </DashboardLayout>
  );
}
