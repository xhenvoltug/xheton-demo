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

const mockOrders = [
  {
    id: 'PO-001',
    supplier: 'Tech Supplies Co',
    items: 12,
    total: 45600.00,
    status: 'approved',
    date: '2025-12-06',
    deliveryDate: '2025-12-10',
  },
  {
    id: 'PO-002',
    supplier: 'Global Electronics',
    items: 8,
    total: 32400.00,
    status: 'pending',
    date: '2025-12-05',
    deliveryDate: '2025-12-12',
  },
  {
    id: 'PO-003',
    supplier: 'Office Mart',
    items: 15,
    total: 18900.00,
    status: 'received',
    date: '2025-12-04',
    deliveryDate: '2025-12-08',
  },
  {
    id: 'PO-004',
    supplier: 'Hardware World',
    items: 5,
    total: 12300.00,
    status: 'cancelled',
    date: '2025-12-03',
    deliveryDate: null,
  },
];

const statusColors = {
  approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  received: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function PurchaseOrdersListPage() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRows, setSelectedRows] = useState([]);

  const columns = [
    {
      header: 'Order No',
      accessor: 'id',
      render: (row) => <span className="font-semibold text-gray-900 dark:text-white">{row.id}</span>,
    },
    {
      header: 'Supplier',
      accessor: 'supplier',
      render: (row) => <span className="text-gray-900 dark:text-white">{row.supplier}</span>,
    },
    {
      header: 'Items',
      accessor: 'items',
      render: (row) => <span className="text-gray-600 dark:text-gray-400">{row.items} items</span>,
    },
    {
      header: 'Total Amount',
      accessor: 'total',
      render: (row) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          ${row.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
      header: 'Order Date',
      accessor: 'date',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-400">
          {new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
          onClick={() => router.push(`/purchases/orders/${row.id}`)}
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
        { label: 'Approved', value: 'approved' },
        { label: 'Pending', value: 'pending' },
        { label: 'Received', value: 'received' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      onChange: setStatusFilter,
    },
  ];

  const filteredData = mockOrders.filter((order) => {
    const matchesSearch = order.supplier.toLowerCase().includes(searchValue.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchValue.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectRow = (id) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedRows(selectedRows.length === filteredData.length ? [] : filteredData.map(o => o.id));
  };

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Purchase Orders"
          subtitle="Manage supplier orders and procurement"
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
              onClick={() => router.push('/purchases/orders/new')}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 gap-2"
            >
              <Plus className="h-4 w-4" />
              New Order
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

        {selectedRows.length > 0 && (
          <div className="mb-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                {selectedRows.length} order(s) selected
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Approve Selected</Button>
                <Button variant="outline" size="sm">Export Selected</Button>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Table */}
        <div className="hidden md:block">
          <DataTable
            columns={columns}
            data={filteredData}
            selectable
            selectedRows={selectedRows}
            onSelectRow={handleSelectRow}
            onSelectAll={handleSelectAll}
          />
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {filteredData.map((order) => (
            <MobileCard
              key={order.id}
              onClick={() => router.push(`/purchases/orders/${order.id}`)}
              data={[
                { label: 'Order', value: order.id },
                { label: 'Supplier', value: order.supplier },
                { label: 'Total', value: `$UGX {order.total.toLocaleString()}` },
                { label: 'Status', value: <Badge className={statusColors[order.status]}>{order.status}</Badge> },
              ]}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
