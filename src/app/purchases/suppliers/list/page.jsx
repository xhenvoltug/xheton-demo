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
import { Plus, Eye, Download } from 'lucide-react';

const mockSuppliers = [
  {
    id: 'SUP-001',
    name: 'Tech Supplies Co',
    email: 'orders@techsupplies.com',
    phone: '+1 234 567 8900',
    totalPurchases: 125600.00,
    outstanding: 15000.00,
    status: 'active',
  },
  {
    id: 'SUP-002',
    name: 'Global Electronics',
    email: 'info@globalelectronics.com',
    phone: '+1 234 567 8901',
    totalPurchases: 98400.00,
    outstanding: 0.00,
    status: 'active',
  },
  {
    id: 'SUP-003',
    name: 'Office Mart',
    email: 'sales@officemart.com',
    phone: '+1 234 567 8902',
    totalPurchases: 45200.00,
    outstanding: 8500.00,
    status: 'active',
  },
  {
    id: 'SUP-004',
    name: 'Hardware World',
    email: 'contact@hardwareworld.com',
    phone: '+1 234 567 8903',
    totalPurchases: 12300.00,
    outstanding: 0.00,
    status: 'inactive',
  },
];

const statusColors = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
};

export default function SuppliersListPage() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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
      accessor: 'totalPurchases',
      render: (row) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          ${row.totalPurchases.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      header: 'Outstanding',
      accessor: 'outstanding',
      render: (row) => (
        <span className={`font-semibold ${row.outstanding > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
          ${row.outstanding.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      ),
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

  const filteredData = mockSuppliers.filter((supplier) => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                         supplier.email.toLowerCase().includes(searchValue.toLowerCase()) ||
                         supplier.id.toLowerCase().includes(searchValue.toLowerCase());
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
          <DataTable columns={columns} data={filteredData} />
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {filteredData.map((supplier) => (
            <MobileCard
              key={supplier.id}
              onClick={() => router.push(`/purchases/suppliers/${supplier.id}`)}
              data={[
                { label: 'ID', value: supplier.id },
                { label: 'Name', value: supplier.name },
                { label: 'Purchases', value: `$${supplier.totalPurchases.toLocaleString()}` },
                { label: 'Status', value: <Badge className={statusColors[supplier.status]}>{supplier.status}</Badge> },
              ]}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
