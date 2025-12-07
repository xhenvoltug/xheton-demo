'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, CreditCard, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockAccounts = [
  { id: 1, name: 'KCB Main Account', type: 'Bank', accountNumber: '****4589', balance: 2450000, status: 'Active' },
  { id: 2, name: 'Cash Register - Main', type: 'Cash', accountNumber: 'CASH-001', balance: 125000, status: 'Active' },
  { id: 3, name: 'Equity Business Account', type: 'Bank', accountNumber: '****7832', balance: 890000, status: 'Active' },
  { id: 4, name: 'Petty Cash', type: 'Cash', accountNumber: 'CASH-002', balance: 25000, status: 'Active' }
];

const recentTransactions = [
  { id: 1, date: '2025-12-06', description: 'Customer payment - INV-001', account: 'KCB Main Account', type: 'Credit', amount: 125000 },
  { id: 2, date: '2025-12-05', description: 'Supplier payment - PO-002', account: 'Equity Business Account', type: 'Debit', amount: 185000 },
  { id: 3, date: '2025-12-04', description: 'Cash sale', account: 'Cash Register - Main', type: 'Credit', amount: 45000 },
  { id: 4, date: '2025-12-03', description: 'Office rent payment', account: 'KCB Main Account', type: 'Debit', amount: 85000 },
  { id: 5, date: '2025-12-02', description: 'Fuel expense', account: 'Petty Cash', type: 'Debit', amount: 5000 }
];

const balanceTrend = [
  { month: 'Jul', balance: 2100000 },
  { month: 'Aug', balance: 2350000 },
  { month: 'Sep', balance: 2500000 },
  { month: 'Oct', balance: 2750000 },
  { month: 'Nov', balance: 3100000 },
  { month: 'Dec', balance: 3490000 }
];

export default function AccountsPage() {
  const router = useRouter();

  const totalBalance = mockAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  const bankBalance = mockAccounts.filter(a => a.type === 'Bank').reduce((sum, acc) => sum + acc.balance, 0);
  const cashBalance = mockAccounts.filter(a => a.type === 'Cash').reduce((sum, acc) => sum + acc.balance, 0);
  const totalAccounts = mockAccounts.length;

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Bank & Cash Accounts"
          subtitle="Manage all financial accounts"
          actions={[
            <Button
              key="transactions"
              onClick={() => router.push('/accounts/transactions')}
              variant="outline"
              className="rounded-2xl"
            >
              All Transactions
            </Button>,
            <Button
              key="add"
              onClick={() => router.push('/accounts/new')}
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Account
            </Button>
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Total Balance', value: `UGX ${totalBalance.toLocaleString()}`, icon: Building2, color: 'from-blue-500 to-cyan-500' },
            { label: 'Bank Accounts', value: `UGX ${bankBalance.toLocaleString()}`, icon: CreditCard, color: 'from-purple-500 to-pink-500' },
            { label: 'Cash Accounts', value: `UGX ${cashBalance.toLocaleString()}`, icon: TrendingUp, color: 'from-emerald-500 to-teal-500' },
            { label: 'Total Accounts', value: totalAccounts, icon: Building2, color: 'from-amber-500 to-orange-500' }
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
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
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTransactions.slice(0, 5).map((txn) => (
                    <div key={txn.id} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-gray-800">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${txn.type === 'Credit' ? 'bg-emerald-100 dark:bg-emerald-900' : 'bg-red-100 dark:bg-red-900'}`}>
                          {txn.type === 'Credit' ? (
                            <ArrowDownRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white text-sm">{txn.description}</div>
                          <div className="text-xs text-gray-500">{txn.account} • {txn.date}</div>
                        </div>
                      </div>
                      <div className={`font-bold ${txn.type === 'Credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {txn.type === 'Credit' ? '+' : '-'}UGX {txn.amount.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="rounded-3xl shadow-lg border-0">
            <CardHeader>
              <CardTitle>All Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockAccounts.map((account) => (
                  <div 
                    key={account.id}
                    onClick={() => router.push(`/accounts/${account.id}`)}
                    className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{account.name}</h3>
                        <p className="text-sm text-gray-500">{account.type} • {account.accountNumber}</p>
                      </div>
                      <div className={`p-2 rounded-xl ${account.type === 'Bank' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-emerald-100 dark:bg-emerald-900'}`}>
                        {account.type === 'Bank' ? (
                          <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        )}
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      UGX {account.balance.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
