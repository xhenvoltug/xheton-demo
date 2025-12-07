'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import FilterBar from '@/components/shared/FilterBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/core/StatusBadge';
import { Plus, Download, Eye, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const mockInvoices = [
  { id: 'INV-S001', supplier: 'ABC Suppliers Ltd', relatedPO: 'PO-001', total: 250000, amountPaid: 0, balance: 250000, dueDate: '2025-12-20', status: 'Unpaid' },
  { id: 'INV-S002', supplier: 'Tech Distributors', relatedPO: 'PO-002', total: 185000, amountPaid: 92500, balance: 92500, dueDate: '2025-12-15', status: 'Partially Paid' },
  { id: 'INV-S003', supplier: 'Global Imports', relatedPO: 'PO-003', total: 145000, amountPaid: 145000, balance: 0, dueDate: '2025-12-10', status: 'Paid' },
  { id: 'INV-S004', supplier: 'Office Supplies Co', relatedPO: null, total: 85000, amountPaid: 0, balance: 85000, dueDate: '2025-11-30', status: 'Overdue' },
  { id: 'INV-S005', supplier: 'Kenya Hardware Ltd', relatedPO: 'PO-005', total: 120000, amountPaid: 60000, balance: 60000, dueDate: '2025-12-25', status: 'Partially Paid' }
];

export default function SupplierInvoicesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const suppliers = ['all', ...new Set(mockInvoices.map(inv => inv.supplier))];

  const filteredInvoices = mockInvoices.filter(inv => {
    const matchesSearch = inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inv.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSupplier = supplierFilter === 'all' || inv.supplier === supplierFilter;
    const matchesStatus = statusFilter === 'all' || inv.status.toLowerCase().replace(' ', '') === statusFilter;
    return matchesSearch && matchesSupplier && matchesStatus;
  });

  const totalInvoices = mockInvoices.length;
  const totalAmount = mockInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalPaid = mockInvoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
  const totalBalance = mockInvoices.reduce((sum, inv) => sum + inv.balance, 0);
  const overdueCount = mockInvoices.filter(inv => inv.status === 'Overdue').length;

  const getStatusVariant = (status) => {
    const map = {
      'Unpaid': 'pending',
      'Partially Paid': 'info',
      'Paid': 'success',
      'Overdue': 'error'
    };
    return map[status] || 'default';
  };

  const columns = [
    { 
      header: 'Invoice Number', 
      accessor: 'id',
      render: (row) => (
        <span 
          className="font-mono text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
          onClick={() => router.push(`/purchases/invoices/${row.id}`)}
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
    { 
      header: 'Related PO', 
      accessor: 'relatedPO',
      render: (row) => row.relatedPO ? (
        <span className="font-mono text-sm text-gray-600 dark:text-gray-400">{row.relatedPO}</span>
      ) : (
        <span className="text-gray-400">-</span>
      )
    },
    { 
      header: 'Total', 
      accessor: 'total',
      render: (row) => <span className="font-bold">UGX {row.total.toLocaleString()}</span>
    },
    { 
      header: 'Amount Paid', 
      accessor: 'amountPaid',
      render: (row) => (
        <span className={row.amountPaid > 0 ? 'font-semibold text-emerald-600' : 'text-gray-500'}>
          UGX {row.amountPaid.toLocaleString()}
        </span>
      )
    },
    {
      header: 'Balance',
      accessorKey: 'balance',
      render: (row) => (
        <span className={`font-bold ${row.balance > 0 ? 'text-red-600' : 'text-gray-500'}`}>
          UGX {row.balance.toLocaleString()}
        </span>
      )
    },
    { 
      header: 'Due Date', 
      accessor: 'dueDate',
      render: (row) => {
        const isOverdue = new Date(row.dueDate) < new Date() && row.balance > 0;
        return (
          <div className="flex items-center gap-2">
            {isOverdue && <AlertCircle className="h-4 w-4 text-red-600" />}
            <span className={isOverdue ? 'text-red-600 font-semibold' : ''}>{row.dueDate}</span>
          </div>
        );
      }
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
          onClick={() => router.push(`/purchases/invoices/${row.id}`)}
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
          title="Supplier Invoices"
          subtitle="Manage supplier bills and payables"
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
              onClick={() => router.push('/purchases/invoices/new')}
              className="rounded-2xl bg-gradient-to-r from-red-600 to-rose-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Invoice
            </Button>
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          {[
            { label: 'Total Invoices', value: totalInvoices, color: 'from-blue-500 to-cyan-500' },
            { label: 'Total Amount', value: `UGX ${totalAmount.toLocaleString()}`, color: 'from-purple-500 to-pink-500' },
            { label: 'Total Paid', value: `UGX ${totalPaid.toLocaleString()}`, color: 'from-emerald-500 to-teal-500' },
            { label: 'Total Balance', value: `UGX ${totalBalance.toLocaleString()}`, color: 'from-red-500 to-rose-500' },
            { label: 'Overdue', value: overdueCount, color: 'from-amber-500 to-orange-500' }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className={`rounded-3xl shadow-lg border-0 overflow-hidden bg-gradient-to-br ${stat.color} text-white p-6`}>
                <div className="text-sm opacity-90 mb-1">{stat.label}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="rounded-3xl shadow-lg border-0">
            <FilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Search by invoice number or supplier..."
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
                    { value: 'unpaid', label: 'Unpaid' },
                    { value: 'partiallypaid', label: 'Partially Paid' },
                    { value: 'paid', label: 'Paid' },
                    { value: 'overdue', label: 'Overdue' }
                  ]
                }
              ]}
            />
            <DataTable columns={columns} data={filteredInvoices} />
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
