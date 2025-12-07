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
import { Download, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const mockMovements = [
  {
    id: 'M001',
    date: '2025-12-06 14:30',
    type: 'in',
    product: 'Laptop Pro 15"',
    quantity: 10,
    from: 'Tech Supplies Co (GRN-001)',
    to: 'Main Warehouse (WH-001)',
    user: 'John Smith',
    reference: 'GRN-001',
  },
  {
    id: 'M002',
    date: '2025-12-06 11:15',
    type: 'out',
    product: 'Wireless Mouse',
    quantity: 15,
    from: 'Main Warehouse (WH-001)',
    to: 'West Coast Distribution (WH-002)',
    user: 'Sarah Johnson',
    reference: 'TRF-003',
  },
  {
    id: 'M003',
    date: '2025-12-06 09:45',
    type: 'adjustment',
    product: 'Monitor 27"',
    quantity: -2,
    from: 'Main Warehouse (WH-001)',
    to: 'Damaged Stock',
    user: 'Mike Davis',
    reference: 'ADJ-005',
  },
  {
    id: 'M004',
    date: '2025-12-05 16:20',
    type: 'in',
    product: 'Keyboard Mechanical',
    quantity: 20,
    from: 'Global Electronics (GRN-002)',
    to: 'Main Warehouse (WH-001)',
    user: 'John Smith',
    reference: 'GRN-002',
  },
  {
    id: 'M005',
    date: '2025-12-05 13:10',
    type: 'out',
    product: 'Laptop Pro 15"',
    quantity: 3,
    from: 'Main Warehouse (WH-001)',
    to: 'Customer (INV-045)',
    user: 'Emily Brown',
    reference: 'INV-045',
  },
];

const typeColors = {
  in: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  out: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  adjustment: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

export default function StockMovementListPage() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const columns = [
    {
      header: 'Date & Time',
      accessor: 'date',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(row.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      ),
    },
    {
      header: 'Type',
      accessor: 'type',
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.type === 'in' && <ArrowUpCircle className="h-4 w-4 text-emerald-600" />}
          {row.type === 'out' && <ArrowDownCircle className="h-4 w-4 text-blue-600" />}
          <Badge className={`${typeColors[row.type]} capitalize`}>
            {row.type === 'in' ? 'Inbound' : row.type === 'out' ? 'Outbound' : 'Adjustment'}
          </Badge>
        </div>
      ),
    },
    {
      header: 'Product',
      accessor: 'product',
      render: (row) => (
        <span className="font-semibold text-gray-900 dark:text-white">{row.product}</span>
      ),
    },
    {
      header: 'Quantity',
      accessor: 'quantity',
      render: (row) => (
        <span className={`font-semibold ${row.quantity < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
          {row.quantity > 0 ? '+' : ''}{row.quantity} units
        </span>
      ),
    },
    {
      header: 'From',
      accessor: 'from',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{row.from}</span>
      ),
    },
    {
      header: 'To',
      accessor: 'to',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{row.to}</span>
      ),
    },
    {
      header: 'User',
      accessor: 'user',
      render: (row) => (
        <span className="text-gray-900 dark:text-white">{row.user}</span>
      ),
    },
    {
      header: 'Reference',
      accessor: 'reference',
      render: (row) => (
        <span className="text-sm font-mono text-gray-600 dark:text-gray-400">{row.reference}</span>
      ),
    },
  ];

  const filters = [
    {
      label: 'Type',
      value: typeFilter,
      options: [
        { label: 'Inbound', value: 'in' },
        { label: 'Outbound', value: 'out' },
        { label: 'Adjustment', value: 'adjustment' },
      ],
      onChange: setTypeFilter,
    },
    {
      label: 'Date',
      value: dateFilter,
      options: [
        { label: 'Today', value: 'today' },
        { label: 'Last 7 Days', value: 'week' },
        { label: 'Last 30 Days', value: 'month' },
      ],
      onChange: setDateFilter,
    },
  ];

  const filteredData = mockMovements.filter((movement) => {
    const matchesSearch = movement.product.toLowerCase().includes(searchValue.toLowerCase()) ||
                         movement.reference.toLowerCase().includes(searchValue.toLowerCase()) ||
                         movement.from.toLowerCase().includes(searchValue.toLowerCase()) ||
                         movement.to.toLowerCase().includes(searchValue.toLowerCase());
    const matchesType = typeFilter === 'all' || movement.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Stock Movement Logs"
          subtitle="Track all inventory movements across warehouses"
          actions={[
            <Button
              key="export"
              variant="outline"
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export Report
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
            setDateFilter('all');
          }}
        />

        {/* Desktop Table */}
        <div className="hidden md:block">
          <DataTable columns={columns} data={filteredData} />
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {filteredData.map((movement) => (
            <MobileCard
              key={movement.id}
              data={[
                { label: 'Date', value: new Date(movement.date).toLocaleDateString() },
                { label: 'Type', value: <Badge className={typeColors[movement.type]}>{movement.type}</Badge> },
                { label: 'Product', value: movement.product },
                { label: 'Quantity', value: `${movement.quantity > 0 ? '+' : ''}${movement.quantity}` },
                { label: 'Reference', value: movement.reference },
              ]}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
