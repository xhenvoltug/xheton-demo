'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import FilterBar from '@/components/shared/FilterBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/core/StatusBadge';
import { Plus, Download, Receipt } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const mockPayments = [
  { id: 'PAY-001', date: '2025-12-06', type: 'Customer Payment', from: 'John Kamau', to: 'Business', amount: 25000, method: 'M-Pesa', reference: 'MPESA123', invoice: 'INV-001', status: 'Completed' },
  { id: 'PAY-002', date: '2025-12-05', type: 'Supplier Payment', from: 'Business', to: 'ABC Suppliers Ltd', amount: 125000, method: 'Bank Transfer', reference: 'TXN456789', invoice: 'PO-001', status: 'Completed' },
  { id: 'PAY-003', date: '2025-12-04', type: 'Customer Payment', from: 'Mary Wanjiru', to: 'Business', amount: 15000, method: 'Cash', reference: 'CASH-004', invoice: 'INV-002', status: 'Completed' },
  { id: 'PAY-004', date: '2025-12-03', type: 'Supplier Payment', from: 'Business', to: 'Tech Distributors', amount: 185000, method: 'Cheque', reference: 'CHQ-12345', invoice: 'PO-002', status: 'Pending' },
  { id: 'PAY-005', date: '2025-12-02', type: 'Customer Payment', from: 'James Ochieng', to: 'Business', amount: 35000, method: 'Bank Transfer', reference: 'TXN789012', invoice: 'INV-003', status: 'Completed' }
];

export default function PaymentsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPayments = mockPayments.filter(payment => {
    const matchesSearch = payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || payment.type.toLowerCase().includes(typeFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalPayments = mockPayments.reduce((sum, p) => sum + p.amount, 0);
  const customerPayments = mockPayments.filter(p => p.type === 'Customer Payment').reduce((sum, p) => sum + p.amount, 0);
  const supplierPayments = mockPayments.filter(p => p.type === 'Supplier Payment').reduce((sum, p) => sum + p.amount, 0);

  const columns = [
    { 
      header: 'Payment ID', 
      accessor: 'id',
      render: (row) => <span className="font-mono text-blue-600 dark:text-blue-400">{row.id}</span>
    },
    { header: 'Date', accessor: 'date' },
    { 
      header: 'Type', 
      accessor: 'type',
      render: (row) => (
        <StatusBadge variant={row.type === 'Customer Payment' ? 'success' : 'info'}>
          {row.type}
        </StatusBadge>
      )
    },
    { 
      header: 'From → To', 
      accessor: 'flow',
      render: (row) => (
        <div className="text-sm">
          <div className="font-semibold text-gray-900 dark:text-white">{row.from}</div>
          <div className="text-gray-500">→ {row.to}</div>
        </div>
      )
    },
    { 
      header: 'Amount', 
      accessor: 'amount',
      render: (row) => (
        <span className={`font-bold ${row.type === 'Customer Payment' ? 'text-emerald-600' : 'text-red-600'}`}>
          UGX {row.amount.toLocaleString()}
        </span>
      )
    },
    { header: 'Method', accessor: 'method' },
    { header: 'Reference', accessor: 'reference' },
    { header: 'Invoice/PO', accessor: 'invoice' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => (
        <StatusBadge variant={row.status === 'Completed' ? 'success' : 'pending'}>
          {row.status}
        </StatusBadge>
      )
    }
  ];

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Payment Tracking"
          subtitle="Manage customer and supplier payments"
          actions={[
            <Button
              key="customer"
              onClick={() => router.push('/payments/customer')}
              className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Customer Payment
            </Button>,
            <Button
              key="supplier"
              onClick={() => router.push('/payments/supplier')}
              className="rounded-2xl bg-gradient-to-r from-red-600 to-rose-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Supplier Payment
            </Button>
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[
            { label: 'Total Payments', value: `UGX ${totalPayments.toLocaleString()}`, color: 'from-blue-500 to-cyan-500' },
            { label: 'Customer Payments', value: `UGX ${customerPayments.toLocaleString()}`, color: 'from-emerald-500 to-teal-500' },
            { label: 'Supplier Payments', value: `UGX ${supplierPayments.toLocaleString()}`, color: 'from-red-500 to-rose-500' }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className={`rounded-3xl shadow-lg border-0 overflow-hidden bg-gradient-to-br ${stat.color} text-white p-6`}>
                <div className="flex items-center justify-between mb-2">
                  <Receipt className="h-8 w-8 opacity-80" />
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
          transition={{ delay: 0.3 }}
        >
          <Card className="rounded-3xl shadow-lg border-0">
            <FilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Search by ID, name, or reference..."
              filters={[
                {
                  label: 'Type',
                  value: typeFilter,
                  onChange: setTypeFilter,
                  options: [
                    { value: 'all', label: 'All Types' },
                    { value: 'customer', label: 'Customer Payments' },
                    { value: 'supplier', label: 'Supplier Payments' }
                  ]
                },
                {
                  label: 'Status',
                  value: statusFilter,
                  onChange: setStatusFilter,
                  options: [
                    { value: 'all', label: 'All Status' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'pending', label: 'Pending' }
                  ]
                }
              ]}
              actions={[
                <Button key="export" variant="outline" className="rounded-2xl">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              ]}
            />
            <DataTable columns={columns} data={filteredPayments} />
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
