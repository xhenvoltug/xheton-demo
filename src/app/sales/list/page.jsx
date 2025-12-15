'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import FilterBar from '@/components/shared/FilterBar';
import DataTable from '@/components/shared/DataTable';
import MobileCard from '@/components/shared/MobileCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Download, Eye, Loader2, TrendingUp } from 'lucide-react';


// Mock data
const statusColors = {
  paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  overdue: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function SalesListPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [selectedRows, setSelectedRows] = useState([]);

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
      header: 'Invoice No',
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
      header: 'Total',
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
      header: 'Date',
      accessor: 'created_at',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-400">
          {new Date(row.created_at).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/sales/invoices/${row.id}`)}
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
        { label: 'Paid', value: 'paid' },
        { label: 'Pending', value: 'pending' },
        { label: 'Overdue', value: 'overdue' },
      ],
      onChange: setStatusFilter,
    },
    {
      label: 'Date Range',
      value: dateRange,
      options: [
        { label: 'Today', value: 'today' },
        { label: 'This Week', value: 'week' },
        { label: 'This Month', value: 'month' },
        { label: 'This Year', value: 'year' },
      ],
      onChange: setDateRange,
    },
  ];

  const filteredData = invoices.filter((sale) => {
    const matchesSearch = (sale.customer_name || '').toLowerCase().includes(searchValue.toLowerCase()) ||
                         (sale.id || '').toLowerCase().includes(searchValue.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectRow = (id) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedRows(selectedRows.length === filteredData.length ? [] : filteredData.map(s => s.id));
  };

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Sales"
          subtitle="Manage all your sales, invoices, and customer transactions"
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
              onClick={() => router.push('/sales/new')}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 gap-2"
            >
              <Plus className="h-4 w-4" />
              New Sale
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
            setDateRange('all');
          }}
        />

        {/* Bulk Actions */}
        {selectedRows.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                {selectedRows.length} invoice(s) selected
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Selected
                </Button>
                <Button variant="outline" size="sm">
                  Send Reminder
                </Button>
              </div>
            </div>
          </motion.div>
        )}

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
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">No sales found</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Create your first sale to get started</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredData}
              selectable
              selectedRows={selectedRows}
              onSelectRow={handleSelectRow}
              onSelectAll={handleSelectAll}
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
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">No sales found</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Create your first sale to get started</p>
            </div>
          ) : (
            filteredData.map((sale) => (
              <MobileCard
                key={sale.id}
                onClick={() => router.push(`/sales/invoices/${sale.id}`)}
                data={[
                  { label: 'Invoice', value: sale.id },
                  { label: 'Customer', value: sale.customer_name },
                  { label: 'Total', value: `UGX ${sale.total_amount.toLocaleString()}` },
                  { 
                    label: 'Status', 
                    value: <Badge className={statusColors[sale.status] || statusColors.pending}>{sale.status}</Badge> 
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
