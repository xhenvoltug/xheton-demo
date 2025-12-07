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
import { Plus, Eye, Mail, Phone } from 'lucide-react';

const mockCustomers = [
  {
    id: 'C001',
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    phone: '+1 (555) 123-4567',
    totalPurchases: 124500.00,
    outstandingBalance: 0,
    status: 'active',
    lastPurchase: '2025-12-06',
  },
  {
    id: 'C002',
    name: 'TechStart Inc',
    email: 'info@techstart.com',
    phone: '+1 (555) 234-5678',
    totalPurchases: 89000.50,
    outstandingBalance: 8900.50,
    status: 'active',
    lastPurchase: '2025-12-05',
  },
  {
    id: 'C003',
    name: 'Global Traders',
    email: 'sales@globaltraders.com',
    phone: '+1 (555) 345-6789',
    totalPurchases: 245000.00,
    outstandingBalance: 0,
    status: 'active',
    lastPurchase: '2025-12-04',
  },
  {
    id: 'C004',
    name: 'Metro Solutions',
    email: 'hello@metro.com',
    phone: '+1 (555) 456-7890',
    totalPurchases: 32000.00,
    outstandingBalance: 3200.00,
    status: 'inactive',
    lastPurchase: '2025-10-15',
  },
];

export default function CustomersListPage() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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
      accessor: 'name',
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{row.name}</p>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {row.email}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {row.phone}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Total Purchases',
      accessor: 'totalPurchases',
      render: (row) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          ${row.totalPurchases.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      header: 'Outstanding',
      accessor: 'outstandingBalance',
      render: (row) => (
        <span className={`font-semibold ${
          row.outstandingBalance > 0
            ? 'text-red-600 dark:text-red-400'
            : 'text-emerald-600 dark:text-emerald-400'
        }`}>
          ${row.outstandingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
      header: 'Last Purchase',
      accessor: 'lastPurchase',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-400">
          {new Date(row.lastPurchase).toLocaleDateString('en-US', {
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

  const filteredData = mockCustomers.filter((customer) => {
    const matchesSearch = customer.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchValue.toLowerCase()) ||
                         customer.id.toLowerCase().includes(searchValue.toLowerCase());
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
          <DataTable
            columns={columns}
            data={filteredData}
          />
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {filteredData.map((customer) => (
            <MobileCard
              key={customer.id}
              onClick={() => router.push(`/sales/customers/${customer.id}`)}
              data={[
                { label: 'ID', value: customer.id },
                { label: 'Name', value: customer.name },
                { label: 'Email', value: customer.email },
                { label: 'Total Purchases', value: `$${customer.totalPurchases.toLocaleString()}` },
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
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
