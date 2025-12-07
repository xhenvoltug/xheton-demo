'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DataTable from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/core/StatusBadge';
import { Edit, CreditCard, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockAccount = {
  id: 1,
  name: 'KCB Main Account',
  type: 'Bank',
  accountNumber: '1234567890',
  bankName: 'Kenya Commercial Bank',
  branch: 'Nairobi Branch',
  balance: 2450000,
  status: 'Active',
  openingBalance: 1500000,
  currency: 'KES'
};

const transactions = [
  { id: 1, date: '2025-12-06 10:30', type: 'Credit', description: 'Customer payment - INV-001', reference: 'MPESA123', amount: 125000, balance: 2450000 },
  { id: 2, date: '2025-12-05 14:15', type: 'Debit', description: 'Supplier payment - PO-002', reference: 'TXN456789', amount: 185000, balance: 2325000 },
  { id: 3, date: '2025-12-03 09:20', type: 'Debit', description: 'Office rent payment', reference: 'CHQ-12345', amount: 85000, balance: 2510000 },
  { id: 4, date: '2025-12-02 11:45', type: 'Credit', description: 'Customer payment - INV-003', reference: 'TXN789012', amount: 75000, balance: 2595000 },
  { id: 5, date: '2025-12-01 16:30', type: 'Debit', description: 'Salary payments', reference: 'BULK-001', amount: 230000, balance: 2520000 }
];

const balanceTrend = [
  { month: 'Jul', balance: 1650000 },
  { month: 'Aug', balance: 1850000 },
  { month: 'Sep', balance: 2100000 },
  { month: 'Oct', balance: 2250000 },
  { month: 'Nov', balance: 2400000 },
  { month: 'Dec', balance: 2450000 }
];

export default function AccountDetailPage({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [filterType, setFilterType] = useState('all');

  const filteredTransactions = transactions.filter(txn => 
    filterType === 'all' || txn.type.toLowerCase() === filterType
  );

  const totalCredit = transactions.filter(t => t.type === 'Credit').reduce((sum, t) => sum + t.amount, 0);
  const totalDebit = transactions.filter(t => t.type === 'Debit').reduce((sum, t) => sum + t.amount, 0);
  const netChange = totalCredit - totalDebit;

  const columns = [
    { 
      header: 'Date & Time', 
      accessor: 'date',
      render: (row) => <span className="text-sm text-gray-600 dark:text-gray-400">{row.date}</span>
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
    },
    { 
      header: 'Balance', 
      accessor: 'balance',
      render: (row) => <span className="font-semibold">UGX {row.balance.toLocaleString()}</span>
    }
  ];

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title={mockAccount.name}
          subtitle={`${mockAccount.type} Account • ${mockAccount.accountNumber}`}
          badge={<StatusBadge variant="success">{mockAccount.status}</StatusBadge>}
          actions={[
            <Button
              key="edit"
              onClick={() => router.push(`/accounts/${resolvedParams.id}/edit`)}
              variant="outline"
              className="rounded-2xl"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Account
            </Button>
          ]}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="rounded-3xl shadow-lg border-0">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-900">
                    <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Bank</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{mockAccount.bankName}</div>
                    <div className="text-sm text-gray-600">{mockAccount.branch}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-900">
                    <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Opening Balance</div>
                    <div className="font-semibold text-gray-900 dark:text-white">UGX {mockAccount.openingBalance.toLocaleString()}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-900">
                    <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Current Balance</div>
                    <div className="font-bold text-2xl text-gray-900 dark:text-white">UGX {mockAccount.balance.toLocaleString()}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-900">
                    <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Currency</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{mockAccount.currency}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[
            { label: 'Total Credits', value: `UGX ${totalCredit.toLocaleString()}`, color: 'from-emerald-500 to-teal-500' },
            { label: 'Total Debits', value: `UGX ${totalDebit.toLocaleString()}`, color: 'from-red-500 to-rose-500' },
            { label: 'Net Change', value: `UGX ${netChange.toLocaleString()}`, color: netChange >= 0 ? 'from-blue-500 to-cyan-500' : 'from-amber-500 to-orange-500' }
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
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <Card className="rounded-3xl shadow-lg border-0">
            <CardHeader>
              <CardTitle>Balance Trend (Last 6 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={balanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px'
                    }}
                    formatter={(value) => `UGX UGX {value.toLocaleString()}`}
                  />
                  <Line type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="rounded-3xl shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Transaction History</CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={() => setFilterType('all')}
                  variant={filterType === 'all' ? 'default' : 'outline'}
                  className="rounded-xl"
                  size="sm"
                >
                  All
                </Button>
                <Button
                  onClick={() => setFilterType('credit')}
                  variant={filterType === 'credit' ? 'default' : 'outline'}
                  className="rounded-xl"
                  size="sm"
                >
                  Credits
                </Button>
                <Button
                  onClick={() => setFilterType('debit')}
                  variant={filterType === 'debit' ? 'default' : 'outline'}
                  className="rounded-xl"
                  size="sm"
                >
                  Debits
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={filteredTransactions} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
