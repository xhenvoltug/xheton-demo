'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import FilterBar from '@/components/shared/FilterBar';
import DataTable from '@/components/shared/DataTable';
import MobileCard from '@/components/shared/MobileCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Download, Loader2, Package } from 'lucide-react';
  },
];

const statusColors = {
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  partial: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  pending: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
};

export default function GoodsReceivedListPage() {
  const router = useRouter();
  const [grns, setGrns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchGrns = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/purchases/goods-received/list');
        if (!res.ok) throw new Error('Failed to load GRNs');
        const json = await res.json();
        setGrns(json.data || json || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGrns();
  }, []);

  const columns = [
    {
      header: 'GRN No',
      accessor: 'id',
      render: (row) => <span className="font-semibold text-gray-900 dark:text-white">{row.id}</span>,
    },
    {
      header: 'PO Number',
      accessor: 'poNumber',
      render: (row) => (
        <button
          onClick={() => router.push(`/purchases/orders/${row.poNumber}`)}
          className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
        >
          {row.poNumber}
        </button>
      ),
    },
    {
      header: 'Supplier',
      accessor: 'supplier',
      render: (row) => <span className="text-gray-900 dark:text-white">{row.supplier}</span>,
    },
    {
      header: 'Items Received',
      accessor: 'items',
      render: (row) => <span className="text-gray-600 dark:text-gray-400">{row.items} items</span>,
    },
    {
      header: 'Received Date',
      accessor: 'receivedDate',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-400">
          {new Date(row.receivedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      ),
    },
    {
      header: 'Received By',
      accessor: 'receivedBy',
      render: (row) => <span className="text-gray-600 dark:text-gray-400">{row.receivedBy}</span>,
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
          onClick={() => router.push(`/purchases/goods-received/${row.id}`)}
          className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
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
        { label: 'Completed', value: 'completed' },
        { label: 'Partial', value: 'partial' },
        { label: 'Pending', value: 'pending' },
      ],
      onChange: setStatusFilter,
    },
  ];

  const filteredData = grns.filter((grn) => {
    const matchesSearch = (grn.supplier_name || grn.supplier || '').toLowerCase().includes(searchValue.toLowerCase()) ||
                         (grn.id || '').toLowerCase().includes(searchValue.toLowerCase()) ||
                         (grn.po_number || '').toLowerCase().includes(searchValue.toLowerCase());
    const matchesStatus = statusFilter === 'all' || grn.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading goods received notes...</p>
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
          title="Goods Received Notes"
          subtitle="Track incoming goods from suppliers"
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
              onClick={() => router.push('/purchases/goods-received/new')}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 gap-2"
            >
              <Plus className="h-4 w-4" />
              New GRN
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

        {/* Desktop Table */}
        <div className="hidden md:block">
          <DataTable columns={columns} data={filteredData} />
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {filteredData.map((grn) => (
            <MobileCard
              key={grn.id}
              onClick={() => router.push(`/purchases/goods-received/${grn.id}`)}
              data={[
                { label: 'GRN', value: grn.id },
                { label: 'PO', value: grn.poNumber },
                { label: 'Supplier', value: grn.supplier },
                { label: 'Status', value: <Badge className={statusColors[grn.status]}>{grn.status}</Badge> },
              ]}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
