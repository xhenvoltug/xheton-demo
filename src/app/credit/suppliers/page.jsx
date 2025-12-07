'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import FilterBar from '@/components/shared/FilterBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/core/StatusBadge';
import { Building2, AlertCircle, TrendingUp, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const mockSuppliers = [
  { id: 'S001', name: 'ABC Suppliers Ltd', phone: '+254 711 222 333', paymentTerms: '30 days', currentPayable: 125000, overdue: 0, status: 'Current' },
  { id: 'S002', name: 'Tech Distributors', phone: '+254 722 444 555', paymentTerms: '45 days', currentPayable: 0, overdue: 0, status: 'Paid' },
  { id: 'S003', name: 'Global Imports', phone: '+254 733 666 777', paymentTerms: '30 days', currentPayable: 45000, overdue: 15000, status: 'Overdue' },
  { id: 'S004', name: 'Office Supplies Co', phone: '+254 744 888 999', paymentTerms: '60 days', currentPayable: 85000, overdue: 0, status: 'Current' },
  { id: 'S005', name: 'Kenya Hardware Ltd', phone: '+254 755 111 222', paymentTerms: '30 days', currentPayable: 120000, overdue: 45000, status: 'Overdue' }
];

export default function SupplierCreditPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredSuppliers = mockSuppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.phone.includes(searchTerm) ||
                         supplier.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || supplier.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPayables = mockSuppliers.reduce((sum, s) => sum + s.currentPayable, 0);
  const totalOverdue = mockSuppliers.reduce((sum, s) => sum + s.overdue, 0);
  const currentPayables = totalPayables - totalOverdue;
  const overdueAccounts = mockSuppliers.filter(s => s.overdue > 0).length;

  const columns = [
    { 
      header: 'Supplier', 
      accessor: 'name',
      render: (row) => (
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{row.name}</div>
          <div className="text-sm text-gray-500">{row.id} • {row.phone}</div>
        </div>
      )
    },
    { 
      header: 'Payment Terms', 
      accessor: 'paymentTerms',
      render: (row) => <StatusBadge variant="info">{row.paymentTerms}</StatusBadge>
    },
    { 
      header: 'Current Payable', 
      accessor: 'currentPayable',
      render: (row) => (
        <span className={`font-bold ${row.currentPayable > 0 ? 'text-red-600' : 'text-gray-500'}`}>
          UGX {row.currentPayable.toLocaleString()}
        </span>
      )
    },
    { 
      header: 'Overdue Amount', 
      accessor: 'overdue',
      render: (row) => (
        <span className={`font-bold ${row.overdue > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
          {row.overdue > 0 ? `UGX ${row.overdue.toLocaleString()}` : '-'}
        </span>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => {
        const variantMap = {
          'Paid': 'success',
          'Current': 'info',
          'Overdue': 'error'
        };
        return <StatusBadge variant={variantMap[row.status]}>{row.status}</StatusBadge>;
      }
    },
    { 
      header: 'Actions', 
      accessor: 'actions',
      render: (row) => (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => router.push(`/suppliers/${row.id}`)}
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
          title="Supplier Credit Control"
          subtitle="Monitor payables and supplier payment terms"
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Total Payables', value: `UGX ${totalPayables.toLocaleString()}`, icon: Building2, color: 'from-red-500 to-rose-500' },
            { label: 'Current Payables', value: `UGX ${currentPayables.toLocaleString()}`, icon: TrendingUp, color: 'from-blue-500 to-cyan-500' },
            { label: 'Overdue Amount', value: `UGX ${totalOverdue.toLocaleString()}`, icon: AlertCircle, color: 'from-amber-500 to-orange-500' },
            { label: 'Overdue Accounts', value: overdueAccounts, icon: AlertCircle, color: 'from-purple-500 to-pink-500' }
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
              searchPlaceholder="Search by name, ID, or phone..."
              filters={[
                {
                  label: 'Status',
                  value: statusFilter,
                  onChange: setStatusFilter,
                  options: [
                    { value: 'all', label: 'All Status' },
                    { value: 'paid', label: 'Paid' },
                    { value: 'current', label: 'Current' },
                    { value: 'overdue', label: 'Overdue' }
                  ]
                }
              ]}
            />
            <DataTable columns={columns} data={filteredSuppliers} />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <Card className="rounded-3xl shadow-lg border-0">
            <CardHeader>
              <CardTitle>Payment Status Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <div className="font-semibold text-emerald-700 dark:text-emerald-400 mb-1">Paid</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">All invoices fully paid, no outstanding balance</div>
                </div>
                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <div className="font-semibold text-blue-700 dark:text-blue-400 mb-1">Current</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Payables within payment terms, not yet due</div>
                </div>
                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <div className="font-semibold text-red-700 dark:text-red-400 mb-1">Overdue</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Payments past due date, requires immediate attention</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
