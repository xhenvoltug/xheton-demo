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
import { Plus, Eye, MapPin } from 'lucide-react';

const mockWarehouses = [
  {
    id: 'WH-001',
    name: 'Main Warehouse',
    location: 'New York, NY',
    type: 'main',
    totalProducts: 456,
    capacity: '10,000 sqft',
    utilization: 78,
    manager: 'John Smith',
    status: 'active',
  },
  {
    id: 'WH-002',
    name: 'West Coast Distribution',
    location: 'Los Angeles, CA',
    type: 'distribution',
    totalProducts: 324,
    capacity: '8,000 sqft',
    utilization: 65,
    manager: 'Sarah Johnson',
    status: 'active',
  },
  {
    id: 'WH-003',
    name: 'East Coast Hub',
    location: 'Boston, MA',
    type: 'hub',
    totalProducts: 189,
    capacity: '5,000 sqft',
    utilization: 45,
    manager: 'Mike Davis',
    status: 'active',
  },
  {
    id: 'WH-004',
    name: 'South Branch',
    location: 'Miami, FL',
    type: 'branch',
    totalProducts: 78,
    capacity: '3,000 sqft',
    utilization: 32,
    manager: 'Emily Brown',
    status: 'inactive',
  },
];

const typeColors = {
  main: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  distribution: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  hub: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  branch: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
};

const statusColors = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  inactive: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function WarehousesListPage() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const columns = [
    {
      header: 'ID',
      accessor: 'id',
      render: (row) => <span className="font-semibold text-gray-900 dark:text-white">{row.id}</span>,
    },
    {
      header: 'Warehouse Name',
      accessor: 'name',
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{row.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {row.location}
          </p>
        </div>
      ),
    },
    {
      header: 'Type',
      accessor: 'type',
      render: (row) => (
        <Badge className={`${typeColors[row.type]} capitalize`}>
          {row.type}
        </Badge>
      ),
    },
    {
      header: 'Products',
      accessor: 'totalProducts',
      render: (row) => (
        <span className="font-semibold text-gray-900 dark:text-white">{row.totalProducts}</span>
      ),
    },
    {
      header: 'Capacity',
      accessor: 'capacity',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-400">{row.capacity}</span>
      ),
    },
    {
      header: 'Utilization',
      accessor: 'utilization',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-[100px]">
            <div
              className={`h-2 rounded-full ${
                row.utilization > 80 ? 'bg-red-500' : row.utilization > 60 ? 'bg-yellow-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${row.utilization}%` }}
            />
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400 w-12">{row.utilization}%</span>
        </div>
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
          onClick={() => router.push(`/warehouse/locations/${row.id}`)}
          className="hover:bg-purple-50 dark:hover:bg-purple-900/20"
        >
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
      ),
    },
  ];

  const filters = [
    {
      label: 'Type',
      value: typeFilter,
      options: [
        { label: 'Main', value: 'main' },
        { label: 'Distribution', value: 'distribution' },
        { label: 'Hub', value: 'hub' },
        { label: 'Branch', value: 'branch' },
      ],
      onChange: setTypeFilter,
    },
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

  const filteredData = mockWarehouses.filter((wh) => {
    const matchesSearch = wh.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                         wh.location.toLowerCase().includes(searchValue.toLowerCase()) ||
                         wh.id.toLowerCase().includes(searchValue.toLowerCase());
    const matchesType = typeFilter === 'all' || wh.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || wh.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Warehouse Locations"
          subtitle="Manage warehouses and storage facilities"
          actions={[
            <Button
              key="new"
              onClick={() => router.push('/warehouse/locations/new')}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 gap-2"
            >
              <Plus className="h-4 w-4" />
              New Warehouse
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
            setStatusFilter('all');
          }}
        />

        {/* Desktop Table */}
        <div className="hidden md:block">
          <DataTable columns={columns} data={filteredData} />
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {filteredData.map((wh) => (
            <MobileCard
              key={wh.id}
              onClick={() => router.push(`/warehouse/locations/${wh.id}`)}
              data={[
                { label: 'ID', value: wh.id },
                { label: 'Name', value: wh.name },
                { label: 'Location', value: wh.location },
                { label: 'Products', value: wh.totalProducts },
                { label: 'Status', value: <Badge className={statusColors[wh.status]}>{wh.status}</Badge> },
              ]}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
