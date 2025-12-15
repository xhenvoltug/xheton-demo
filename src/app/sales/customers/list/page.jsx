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
import { Plus, Eye, Mail, Phone, Loader2, Users } from 'lucide-react';


export default function CustomersListPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/sales/customers/list');
        if (!response.ok) throw new Error('Failed to load customers');
        const data = await response.json();
        setCustomers(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const columns = [
    {
      header: 'Customer ID',
      accessor: 'id',
      render: (row) => (
        <span className="font-semibold text-gray-900 dark:text-white">{row.id}</span>
      ),
    },
    {
      header: 'Name',
      accessor: 'customer_name',
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{row.customer_name}</p>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
            {row.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {row.email}
              </span>
            )}
            {row.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {row.phone}
              </span>
            )}
          </div>
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
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <Badge className={
          row.status === 'active'
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
        }>
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
          onClick={() => router.push(`/sales/customers/${row.id}`)}
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

  const filteredData = customers.filter((customer) => {
    const matchesSearch = (customer.customer_name || '').toLowerCase().includes(searchValue.toLowerCase()) ||
                         (customer.email || '').toLowerCase().includes(searchValue.toLowerCase()) ||
                         (customer.id || '').toLowerCase().includes(searchValue.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Customers"
          subtitle="Manage your customer database and relationships"
          actions={[
            <Button
              key="new"
              onClick={() => router.push('/sales/customers/new')}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 gap-2"
            >
              <Plus className="h-4 w-4" />
              New Customer
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
              <p className="text-gray-600 dark:text-gray-400">Loading customers...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-red-600">
              <p className="font-semibold mb-2">Error loading customers</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-gray-300 dark:text-gray-700 mb-3" />
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">No customers found</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">Create your first customer to get started</p>
              <Button onClick={() => router.push('/sales/customers/new')} className="gap-2">
                <Plus className="h-4 w-4" />
                Create First Customer
              </Button>
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
              <p className="text-gray-600 dark:text-gray-400">Loading customers...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-red-600">
              <p className="font-semibold mb-2">Error loading customers</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-gray-300 dark:text-gray-700 mb-3" />
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">No customers found</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">Create your first customer to get started</p>
              <Button onClick={() => router.push('/sales/customers/new')} className="gap-2">
                <Plus className="h-4 w-4" />
                Create First Customer
              </Button>
            </div>
          ) : (
            filteredData.map((customer) => (
              <MobileCard
                key={customer.id}
                onClick={() => router.push(`/sales/customers/${customer.id}`)}
                data={[
                  { label: 'ID', value: customer.id },
                  { label: 'Name', value: customer.customer_name },
                  { label: 'Email', value: customer.email || 'N/A' },
                  { label: 'Total Purchases', value: `UGX ${(customer.total_purchases || 0).toLocaleString()}` },
                  {
                    label: 'Status',
                    value: <Badge className={
                      customer.status === 'active'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    }>{customer.status}</Badge>
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
