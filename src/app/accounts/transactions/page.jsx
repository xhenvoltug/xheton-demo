'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import FilterBar from '@/components/shared/FilterBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/core/StatusBadge';
import { Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

const mockTransactions = [
  { id: 1, date: '2025-12-06 10:30', account: 'KCB Main Account', type: 'Credit', description: 'Customer payment - INV-001', reference: 'MPESA123', amount: 125000 },
  { id: 2, date: '2025-12-06 09:15', account: 'Cash Register - Main', type: 'Credit', description: 'Cash sale', reference: 'SALE-045', amount: 45000 },
  { id: 3, date: '2025-12-05 14:15', account: 'Equity Business Account', type: 'Debit', description: 'Supplier payment - PO-002', reference: 'TXN456789', amount: 185000 },
  { id: 4, date: '2025-12-04 11:30', account: 'KCB Main Account', type: 'Debit', description: 'Office rent payment', reference: 'CHQ-12345', amount: 85000 },
  { id: 5, date: '2025-12-03 16:45', account: 'Petty Cash', type: 'Debit', description: 'Fuel expense', reference: 'CASH-032', amount: 5000 },
  { id: 6, date: '2025-12-02 11:45', account: 'KCB Main Account', type: 'Credit', description: 'Customer payment - INV-003', reference: 'TXN789012', amount: 75000 },
  { id: 7, date: '2025-12-02 09:20', account: 'Cash Register - Main', type: 'Debit', description: 'Cash withdrawal to bank', reference: 'TRANS-12', amount: 50000 },
  { id: 8, date: '2025-12-01 16:30', account: 'KCB Main Account', type: 'Debit', description: 'Salary payments', reference: 'BULK-001', amount: 230000 }
];

export default function AllTransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [accountFilter, setAccountFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const accounts = ['all', ...new Set(mockTransactions.map(t => t.account))];

  const filteredTransactions = mockTransactions.filter(txn => {
    const matchesSearch = txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         txn.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAccount = accountFilter === 'all' || txn.account === accountFilter;
    const matchesType = typeFilter === 'all' || txn.type.toLowerCase() === typeFilter;
    return matchesSearch && matchesAccount && matchesType;
  });

  const totalCredit = mockTransactions.filter(t => t.type === 'Credit').reduce((sum, t) => sum + t.amount, 0);
  const totalDebit = mockTransactions.filter(t => t.type === 'Debit').reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalCredit - totalDebit;

  const columns = [
    { 
      header: 'Date & Time', 
      accessor: 'date',
      render: (row) => <span className="text-sm font-mono text-gray-600 dark:text-gray-400">{row.date}</span>
    },
    { 
      header: 'Account', 
      accessor: 'account',
      render: (row) => <span className="font-semibold text-gray-900 dark:text-white">{row.account}</span>
    },
    { 
      header: 'Type', 
      accessor: 'type',
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.type === 'Credit' ? (
            <ArrowDownRight className="h-4 w-4 text-emerald-600" />
          ) : (
            <ArrowUpRight className="h-4 w-4 text-red-600" />
          )}
          <StatusBadge variant={row.type === 'Credit' ? 'success' : 'pending'}>
            {row.type}
          </StatusBadge>
        </div>
      )
    },
    { 
      header: 'Description', 
      accessor: 'description',
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{row.description}</div>
          <div className="text-xs text-gray-500">Ref: {row.reference}</div>
        </div>
      )
    },
    { 
      header: 'Amount', 
      accessor: 'amount',
      render: (row) => (
        <span className={`font-bold ${row.type === 'Credit' ? 'text-emerald-600' : 'text-red-600'}`}>
          {row.type === 'Credit' ? '+' : '-'}UGX {row.amount.toLocaleString()}
        </span>
      )
    }
  ];

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="All Transactions"
          subtitle="View all account transactions across all accounts"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[
            { label: 'Total Credits', value: `UGX ${totalCredit.toLocaleString()}`, color: 'from-emerald-500 to-teal-500' },
            { label: 'Total Debits', value: `UGX ${totalDebit.toLocaleString()}`, color: 'from-red-500 to-rose-500' },
            { label: 'Net Balance', value: `UGX ${netBalance.toLocaleString()}`, color: netBalance >= 0 ? 'from-blue-500 to-cyan-500' : 'from-amber-500 to-orange-500' }
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
          transition={{ delay: 0.3 }}
        >
          <Card className="rounded-3xl shadow-lg border-0">
            <FilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Search by description or reference..."
              filters={[
                {
                  label: 'Account',
                  value: accountFilter,
                  onChange: setAccountFilter,
                  options: accounts.map(acc => ({ value: acc, label: acc === 'all' ? 'All Accounts' : acc }))
                },
                {
                  label: 'Type',
                  value: typeFilter,
                  onChange: setTypeFilter,
                  options: [
                    { value: 'all', label: 'All Types' },
                    { value: 'credit', label: 'Credits' },
                    { value: 'debit', label: 'Debits' }
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
            <DataTable columns={columns} data={filteredTransactions} />
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
