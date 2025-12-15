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
import { Plus, Eye, Download, Loader2, Building2 } from 'lucide-react';

const statusColors = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
};

export default function SuppliersListPage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/purchases/suppliers/list');
        if (!response.ok) throw new Error('Failed to load suppliers');
        const data = await response.json();
        setSuppliers(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  const columns = [
    {
      header: 'Supplier ID',
      accessor: 'id',
      render: (row) => <span className="font-semibold text-gray-900 dark:text-white">{row.id}</span>,
    },
    {
      header: 'Name',
      accessor: 'name',
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{row.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{row.email}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{row.phone}</p>
        </div>
      ),
    },
    {
      header: 'Total Purchases',
      accessor: 'total_purchases',
      render: (row) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          UGX {(row.total_purchases || 0).toLocaleString('en-US', { minimumFractionDigits: 0 })}
        </span>
      ),
    },
    {
      header: 'Outstanding',
      accessor: 'current_balance',
      render: (row) => {
        const balance = parseFloat(row.current_balance) || 0;
        return (
          <span className={`font-semibold ${balance > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
            UGX {balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        );
      },
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
          onClick={() => router.push(`/purchases/suppliers/${row.id}`)}
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
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
      onChange: setStatusFilter,
    },
  ];

  const filteredData = suppliers.filter((supplier) => {
    const matchesSearch = (supplier.supplier_name || '').toLowerCase().includes(searchValue.toLowerCase()) ||
                         (supplier.email || '').toLowerCase().includes(searchValue.toLowerCase()) ||
                         (supplier.id || '').toLowerCase().includes(searchValue.toLowerCase());
    const matchesStatus = statusFilter === 'all' || supplier.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Suppliers"
          subtitle="Manage supplier relationships"
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
              onClick={() => router.push('/purchases/suppliers/new')}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 gap-2"
            >
              <Plus className="h-4 w-4" />
              New Supplier
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
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
              <p className="text-gray-600 dark:text-gray-400">Loading suppliers...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-red-600">
              <p className="font-semibold mb-2">Error loading suppliers</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-gray-300 dark:text-gray-700 mb-3" />
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">No suppliers found</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Add your first supplier to get started</p>
            </div>
          ) : (
            <DataTable columns={columns} data={filteredData} />
          )}
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
              <p className="text-gray-600 dark:text-gray-400">Loading suppliers...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-red-600">
              <p className="font-semibold mb-2">Error loading suppliers</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-gray-300 dark:text-gray-700 mb-3" />
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">No suppliers found</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Add your first supplier to get started</p>
            </div>
          ) : (
            filteredData.map((supplier) => (
              <MobileCard
                key={supplier.id}
                onClick={() => router.push(`/purchases/suppliers/${supplier.id}`)}
                data={[
                  { label: 'ID', value: supplier.id },
                  { label: 'Name', value: supplier.supplier_name },
                  { label: 'Purchases', value: `UGX ${(supplier.total_purchases || 0).toLocaleString()}` },
                  { label: 'Status', value: <Badge className={statusColors[supplier.status] || statusColors.active}>{supplier.status}</Badge> },
                ]}
              />
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
