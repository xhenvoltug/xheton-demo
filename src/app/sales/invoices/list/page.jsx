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
import { Eye, Download, Send, Loader2, TrendingUp } from 'lucide-react';


const statusColors = {
  paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  overdue: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function InvoicesListPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/sales/invoices/list');
        if (!response.ok) throw new Error('Failed to load sales invoices');
        const data = await response.json();
        setInvoices(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

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
      accessor: 'customer_name',
      render: (row) => (
        <span className="text-gray-700 dark:text-gray-300">{row.customer_name}</span>
      ),
    },
    {
      header: 'Date',
      accessor: 'created_at',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-400">
          {new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      ),
    },
    {
      header: 'Amount',
      accessor: 'total_amount',
      render: (row) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          UGX {row.total_amount.toLocaleString('en-US', { minimumFractionDigits: 0 })}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <Badge className={`${statusColors[row.status] || statusColors.pending} capitalize`}>
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

  const filteredData = invoices.filter((invoice) => {
    const matchesSearch = (invoice.customer_name || '').toLowerCase().includes(searchValue.toLowerCase()) ||
                         (invoice.id || '').toLowerCase().includes(searchValue.toLowerCase());
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
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
              <p className="text-gray-600 dark:text-gray-400">Loading sales invoices...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-red-600">
              <p className="font-semibold mb-2">Error loading sales invoices</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <TrendingUp className="h-12 w-12 text-gray-300 dark:text-gray-700 mb-3" />
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">No invoices found</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Create your first sales invoice to get started</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredData}
            />
          )}
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
              <p className="text-gray-600 dark:text-gray-400">Loading sales invoices...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-red-600">
              <p className="font-semibold mb-2">Error loading sales invoices</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <TrendingUp className="h-12 w-12 text-gray-300 dark:text-gray-700 mb-3" />
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">No invoices found</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Create your first sales invoice to get started</p>
            </div>
          ) : (
            filteredData.map((invoice) => (
              <MobileCard
                key={invoice.id}
                onClick={() => router.push(`/sales/invoices/${invoice.id}`)}
                data={[
                  { label: 'Invoice', value: invoice.id },
                  { label: 'Customer', value: invoice.customer_name },
                  { label: 'Amount', value: `UGX ${invoice.total_amount.toLocaleString()}` },
                  {
                    label: 'Status',
                    value: <Badge className={statusColors[invoice.status] || statusColors.pending}>{invoice.status}</Badge>
                  },
                ]}
              />
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
