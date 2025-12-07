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

const mockBins = [
  {
    id: 'BIN-A-001',
    warehouse: 'Main Warehouse',
    zone: 'A',
    aisle: '1',
    level: '1',
    capacity: 100,
    occupied: 85,
    product: 'Laptop Pro 15"',
    status: 'occupied',
  },
  {
    id: 'BIN-A-002',
    warehouse: 'Main Warehouse',
    zone: 'A',
    aisle: '1',
    level: '2',
    capacity: 100,
    occupied: 0,
    product: null,
    status: 'empty',
  },
  {
    id: 'BIN-B-001',
    warehouse: 'Main Warehouse',
    zone: 'B',
    aisle: '2',
    level: '1',
    capacity: 150,
    occupied: 120,
    product: 'Monitor 27"',
    status: 'occupied',
  },
  {
    id: 'BIN-B-002',
    warehouse: 'Main Warehouse',
    zone: 'B',
    aisle: '2',
    level: '2',
    capacity: 150,
    occupied: 150,
    product: 'Wireless Mouse',
    status: 'full',
  },
  {
    id: 'BIN-C-001',
    warehouse: 'West Coast Distribution',
    zone: 'C',
    aisle: '1',
    level: '1',
    capacity: 200,
    occupied: 45,
    product: 'Keyboard Mechanical',
    status: 'occupied',
  },
];

const statusColors = {
  empty: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  occupied: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  full: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function BinManagementListPage() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const columns = [
    {
      header: 'Bin ID',
      accessor: 'id',
      render: (row) => <span className="font-semibold text-gray-900 dark:text-white font-mono">{row.id}</span>,
    },
    {
      header: 'Location',
      accessor: 'location',
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {row.warehouse}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Zone {row.zone} • Aisle {row.aisle} • Level {row.level}
          </p>
        </div>
      ),
    },
    {
      header: 'Product',
      accessor: 'product',
      render: (row) => (
        <span className="text-gray-900 dark:text-white">
          {row.product || <span className="text-gray-400 italic">Empty</span>}
        </span>
      ),
    },
    {
      header: 'Capacity',
      accessor: 'capacity',
      render: (row) => (
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">{row.occupied}/{row.capacity} units</span>
            <span className="text-gray-600 dark:text-gray-400">
              {Math.round((row.occupied / row.capacity) * 100)}%
            </span>
          </div>
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                row.occupied === 0 ? 'bg-gray-400' :
                row.occupied === row.capacity ? 'bg-red-500' :
                'bg-blue-500'
              }`}
              style={{ width: `${(row.occupied / row.capacity) * 100}%` }}
            />
          </div>
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
          onClick={() => router.push(`/warehouse/bins/${row.id}`)}
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
      label: 'Warehouse',
      value: warehouseFilter,
      options: [
        { label: 'Main Warehouse', value: 'main' },
        { label: 'West Coast Distribution', value: 'west' },
      ],
      onChange: setWarehouseFilter,
    },
    {
      label: 'Status',
      value: statusFilter,
      options: [
        { label: 'Empty', value: 'empty' },
        { label: 'Occupied', value: 'occupied' },
        { label: 'Full', value: 'full' },
      ],
      onChange: setStatusFilter,
    },
  ];

  const filteredData = mockBins.filter((bin) => {
    const matchesSearch = bin.id.toLowerCase().includes(searchValue.toLowerCase()) ||
                         bin.warehouse.toLowerCase().includes(searchValue.toLowerCase()) ||
                         (bin.product && bin.product.toLowerCase().includes(searchValue.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || bin.status === statusFilter;
    const matchesWarehouse = warehouseFilter === 'all' ||
                            (warehouseFilter === 'main' && bin.warehouse === 'Main Warehouse') ||
                            (warehouseFilter === 'west' && bin.warehouse === 'West Coast Distribution');
    return matchesSearch && matchesStatus && matchesWarehouse;
  });

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Bin Management"
          subtitle="Manage warehouse storage bins and locations"
          actions={[
            <Button
              key="new"
              onClick={() => router.push('/warehouse/bins/new')}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 gap-2"
            >
              <Plus className="h-4 w-4" />
              New Bin
            </Button>
          ]}
        />

        <FilterBar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filters={filters}
          onClearFilters={() => {
            setSearchValue('');
            setWarehouseFilter('all');
            setStatusFilter('all');
          }}
        />

        {/* Desktop Table */}
        <div className="hidden md:block">
          <DataTable columns={columns} data={filteredData} />
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {filteredData.map((bin) => (
            <MobileCard
              key={bin.id}
              onClick={() => router.push(`/warehouse/bins/${bin.id}`)}
              data={[
                { label: 'Bin ID', value: bin.id },
                { label: 'Warehouse', value: bin.warehouse },
                { label: 'Location', value: `Zone ${bin.zone} • Aisle ${bin.aisle} • Level ${bin.level}` },
                { label: 'Occupied', value: `${bin.occupied}/${bin.capacity}` },
                { label: 'Status', value: <Badge className={statusColors[bin.status]}>{bin.status}</Badge> },
              ]}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
