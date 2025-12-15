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
import { Plus, Eye, Download, Loader2, ShoppingCart } from 'lucide-react';


const statusColors = {
  approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  received: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function PurchaseOrdersListPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/purchases/orders/list');
        if (!response.ok) throw new Error('Failed to load purchase orders');
        const data = await response.json();
        setOrders(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const columns = [
    {
      header: 'Order No',
      accessor: 'po_number',
      render: (row) => <span className="font-semibold text-gray-900 dark:text-white">{row.po_number}</span>,
    },
    {
      header: 'Supplier',
      accessor: 'supplier_name',
      render: (row) => <span className="text-gray-900 dark:text-white">{row.supplier_name}</span>,
    },
    {
      header: 'Total Amount',
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
      header: 'Order Date',
      accessor: 'created_at',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-400">
          {new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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

  const filteredData = orders.filter((order) => {
    const matchesSearch = (order.supplier_name || '').toLowerCase().includes(searchValue.toLowerCase()) ||
                         (order.po_number || '').toLowerCase().includes(searchValue.toLowerCase());
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

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
            <p className="text-gray-600 dark:text-gray-400">Loading purchase orders...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-red-600">
            <p className="font-semibold mb-2">Error loading purchase orders</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <ShoppingCart className="h-12 w-12 text-gray-300 dark:text-gray-700 mb-3" />
            <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">No purchase orders found</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">Create your first purchase order to get started</p>
            <Button onClick={() => router.push('/purchases/orders/new')} className="gap-2">
              <Plus className="h-4 w-4" />
              Create First Order
            </Button>
          </div>
        ) : (
          <>
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
                    { label: 'Order', value: order.po_number },
                    { label: 'Supplier', value: order.supplier_name },
                    { label: 'Total', value: `UGX ${order.total_amount.toLocaleString()}` },
                    { label: 'Status', value: <Badge className={statusColors[order.status] || statusColors.pending}>{order.status}</Badge> },
                  ]}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
