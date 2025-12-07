'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import FilterBar from '@/components/shared/FilterBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/core/StatusBadge';
import { Plus, Download, FileText, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const mockPurchaseOrders = [
  { id: 'PO-001', supplier: 'ABC Suppliers Ltd', dateCreated: '2025-12-01', expectedDelivery: '2025-12-15', totalAmount: 250000, status: 'Sent', paymentsMade: 0 },
  { id: 'PO-002', supplier: 'Tech Distributors', dateCreated: '2025-11-28', expectedDelivery: '2025-12-10', totalAmount: 185000, status: 'Partially Received', paymentsMade: 92500 },
  { id: 'PO-003', supplier: 'Global Imports', dateCreated: '2025-11-25', expectedDelivery: '2025-12-05', totalAmount: 145000, status: 'Completed', paymentsMade: 145000 },
  { id: 'PO-004', supplier: 'Office Supplies Co', dateCreated: '2025-12-05', expectedDelivery: '2025-12-20', totalAmount: 85000, status: 'Draft', paymentsMade: 0 },
  { id: 'PO-005', supplier: 'Kenya Hardware Ltd', dateCreated: '2025-11-20', expectedDelivery: '2025-11-30', totalAmount: 320000, status: 'Cancelled', paymentsMade: 0 }
];

export default function PurchaseOrdersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const suppliers = ['all', ...new Set(mockPurchaseOrders.map(po => po.supplier))];

  const filteredPOs = mockPurchaseOrders.filter(po => {
    const matchesSearch = po.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         po.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSupplier = supplierFilter === 'all' || po.supplier === supplierFilter;
    const matchesStatus = statusFilter === 'all' || po.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesSupplier && matchesStatus;
  });

  const totalPOs = mockPurchaseOrders.length;
  const totalAmount = mockPurchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0);
  const completedPOs = mockPurchaseOrders.filter(po => po.status === 'Completed').length;
  const approvedPOs = mockPurchaseOrders.filter(po => po.status === 'Sent' || po.status === 'Partially Received' || po.status === 'Completed').length;
  const pendingAmount = mockPurchaseOrders.filter(po => po.status !== 'Completed' && po.status !== 'Cancelled').reduce((sum, po) => sum + po.totalAmount, 0);

  const getStatusVariant = (status) => {
    const map = {
      'Draft': 'default',
      'Sent': 'info',
      'Partially Received': 'pending',
      'Completed': 'success',
      'Cancelled': 'error'
    };
    return map[status] || 'default';
  };

  const columns = [
    { 
      header: 'PO Number', 
      accessor: 'id',
      render: (row) => (
        <span 
          className="font-mono text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
          onClick={() => router.push(`/purchases/orders/${row.id}`)}
        >
          {row.id}
        </span>
      )
    },
    { 
      header: 'Supplier', 
      accessor: 'supplier',
      render: (row) => <span className="font-semibold text-gray-900 dark:text-white">{row.supplier}</span>
    },
    { header: 'Date Created', accessor: 'dateCreated' },
    { header: 'Expected Delivery', accessor: 'expectedDelivery' },
    { 
      header: 'Total Amount', 
      accessor: 'totalAmount',
      render: (row) => <span className="font-bold text-gray-900 dark:text-white">UGX {row.totalAmount.toLocaleString()}</span>
    },
    { 
      header: 'Payments Made', 
      accessor: 'paymentsMade',
      render: (row) => (
        <span className={row.paymentsMade > 0 ? 'font-semibold text-emerald-600' : 'text-gray-500'}>
          UGX {row.paymentsMade.toLocaleString()}
        </span>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => <StatusBadge variant={getStatusVariant(row.status)}>{row.status}</StatusBadge>
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
