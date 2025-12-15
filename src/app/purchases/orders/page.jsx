'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import FilterBar from '@/components/shared/FilterBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/core/StatusBadge';
import { Plus, Download, FileText, Eye, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function PurchaseOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/purchases/orders/list');
        if (!res.ok) throw new Error('Failed to load orders');
        const json = await res.json();
        setOrders(json.data || json || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const suppliers = ['all', ...new Set(orders.map(po => po.supplier_name || po.supplier || ''))];

  const filteredPOs = orders.filter(po => {
    const matchesSearch = (po.po_number || po.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (po.supplier_name || po.supplier || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSupplier = supplierFilter === 'all' || (po.supplier_name || po.supplier) === supplierFilter;
    const matchesStatus = statusFilter === 'all' || (po.status || '').toLowerCase() === statusFilter;
    return matchesSearch && matchesSupplier && matchesStatus;
  });

  const totalPOs = orders.length;
  const totalAmount = orders.reduce((sum, po) => sum + (parseFloat(po.total_amount) || 0), 0);
  const completedPOs = orders.filter(po => po.status === 'completed').length;
  const approvedPOs = orders.filter(po => ['sent', 'partial', 'completed'].includes((po.status || '').toLowerCase())).length;
  const pendingAmount = orders.filter(po => !['completed', 'cancelled'].includes((po.status || '').toLowerCase())).reduce((sum, po) => sum + (parseFloat(po.total_amount) || 0), 0);

  const getStatusVariant = (status) => {
    const map = {
      'draft': 'default',
      'sent': 'info',
      'partial': 'pending',
      'completed': 'success',
      'cancelled': 'error'
    };
    return map[(status || '').toLowerCase()] || 'default';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading purchase orders...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-900/10">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  const columns = [
    { 
      header: 'PO Number', 
      accessor: 'po_number',
      render: (row) => (
        <span 
          className="font-mono text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
          onClick={() => router.push(`/purchases/orders/${row.id}`)}
        >
          {row.po_number || row.id}
        </span>
      )
    },
    { 
      header: 'Supplier', 
      accessor: 'supplier_name',
      render: (row) => <span className="font-semibold text-gray-900 dark:text-white">{row.supplier_name || row.supplier}</span>
    },
    { header: 'Date Created', accessor: 'created_at' },
    { header: 'Status', accessor: 'status' },
    { 
      header: 'Total Amount', 
      accessor: 'total_amount',
      render: (row) => <span className="font-bold text-gray-900 dark:text-white">UGX {(parseFloat(row.total_amount) || 0).toLocaleString()}</span>
    },
    { 
      header: 'Status Badge', 
      accessor: 'status_badge',
      render: (row) => <StatusBadge variant={getStatusVariant(row.status)}>{row.status || 'pending'}</StatusBadge>
    },
    { 
      header: 'Actions', 
      accessor: 'actions',
      render: (row) => (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => router.push(`/purchases/orders/${row.id}`)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      )
    }
  ];

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Purchase Orders"
          subtitle="Manage supplier purchase orders"
          actions={[
            <Button
              key="export"
              variant="outline"
              className="rounded-2xl"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>,
            <Button
              key="new"
              onClick={() => router.push('/purchases/orders/new')}
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Purchase Order
            </Button>
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Total POs', value: totalPOs, color: 'from-blue-500 to-cyan-500', icon: FileText },
            { label: 'Total Amount', value: `UGX ${totalAmount.toLocaleString()}`, color: 'from-purple-500 to-pink-500', icon: FileText },
            { label: 'Approved', value: approvedPOs, color: 'from-emerald-500 to-teal-500', icon: FileText },
            { label: 'Pending Amount', value: `UGX ${pendingAmount.toLocaleString()}`, color: 'from-amber-500 to-orange-500', icon: FileText }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className={`rounded-3xl shadow-lg border-0 overflow-hidden bg-gradient-to-br ${stat.color} text-white p-6`}>
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="h-8 w-8 opacity-80" />
                </div>
                <div className="text-sm opacity-90 mb-1">{stat.label}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="rounded-3xl shadow-lg border-0">
            <FilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Search by PO number or supplier..."
              filters={[
                {
                  label: 'Supplier',
                  value: supplierFilter,
                  onChange: setSupplierFilter,
                  options: suppliers.map(s => ({ value: s, label: s === 'all' ? 'All Suppliers' : s }))
                },
                {
                  label: 'Status',
                  value: statusFilter,
                  onChange: setStatusFilter,
                  options: [
                    { value: 'all', label: 'All Status' },
                    { value: 'draft', label: 'Draft' },
                    { value: 'sent', label: 'Sent' },
                    { value: 'partially received', label: 'Partially Received' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'cancelled', label: 'Cancelled' }
                  ]
                }
              ]}
            />
            <DataTable columns={columns} data={filteredPOs} />
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
