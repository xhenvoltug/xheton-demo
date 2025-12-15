'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import FilterBar from '@/components/shared/FilterBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/core/StatusBadge';
import { Plus, Download, Eye, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function SupplierInvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/purchases/invoices/list');
        if (!res.ok) throw new Error('Failed to load invoices');
        const json = await res.json();
        setInvoices(json.data || json || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const suppliers = ['all', ...new Set(invoices.map(inv => inv.supplier_name || inv.supplier || ''))];

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = (inv.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (inv.supplier_name || inv.supplier || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSupplier = supplierFilter === 'all' || (inv.supplier_name || inv.supplier) === supplierFilter;
    const matchesStatus = statusFilter === 'all' || (inv.status || '').toLowerCase().replace(' ', '') === statusFilter;
    return matchesSearch && matchesSupplier && matchesStatus;
  });

  const totalInvoices = invoices.length;
  const totalAmount = invoices.reduce((sum, inv) => sum + (parseFloat(inv.total || 0)), 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + (parseFloat(inv.amount_paid || 0)), 0);
  const totalBalance = invoices.reduce((sum, inv) => sum + (parseFloat(inv.balance || 0)), 0);
  const overdueCount = invoices.filter(inv => (inv.status || '').toLowerCase() === 'overdue').length;

  const getStatusVariant = (status) => {
    const map = {
      'unpaid': 'pending',
      'partially paid': 'info',
      'paid': 'success',
      'overdue': 'error'
    };
    return map[(status || '').toLowerCase()] || 'default';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading invoices...</p>
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
      accessor: 'supplier_name',
      render: (row) => <span className="font-semibold text-gray-900 dark:text-white">{row.supplier_name || row.supplier}</span>
    },
    { 
      header: 'Total', 
      accessor: 'total',
      render: (row) => <span className="font-bold">UGX {(parseFloat(row.total) || 0).toLocaleString()}</span>
    },
    { 
      header: 'Amount Paid', 
      accessor: 'amount_paid',
      render: (row) => (
        <span className={(parseFloat(row.amount_paid) || 0) > 0 ? 'font-semibold text-emerald-600' : 'text-gray-500'}>
          UGX {(parseFloat(row.amount_paid) || 0).toLocaleString()}
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
