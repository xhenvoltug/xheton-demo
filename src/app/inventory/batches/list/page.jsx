'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import FilterBar from '@/components/shared/FilterBar';
import DataTable from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Loader2, Package } from 'lucide-react';
export default function BatchesListPage() {
  const router = useRouter();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/inventory/batches/list');
        if (!res.ok) throw new Error('Failed to load batches');
        const json = await res.json();
        setBatches(json.data || json || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
  }, []);

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

  const filteredData = batches.filter((batch) => {
    const matchesSearch = (batch.product_name || batch.product || '').toLowerCase().includes(searchValue.toLowerCase()) ||
                         (batch.batch_number || batch.batchNumber || '').toLowerCase().includes(searchValue.toLowerCase());
    const matchesStatus = statusFilter === 'all' || batch.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading batches...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-900/10">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

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
