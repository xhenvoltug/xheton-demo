'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StatusBadge from '@/components/core/StatusBadge';
import DataTable from '@/components/shared/DataTable';
import { Edit, Mail, Phone, MapPin, Building2, CreditCard, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockCustomer = {
  id: 'C001',
  name: 'John Kamau',
  phone: '+254 700 111 222',
  email: 'john@example.com',
  address: 'Nairobi CBD, Kenya',
  businessName: 'JK Enterprises',
  taxNumber: 'A123456789X',
  creditLimit: 100000,
  creditBalance: 15000,
  totalPurchases: 450000,
  status: 'Active',
  createdDate: '2024-01-15',
  lastPurchase: '2025-12-05'
};

const transactions = [
  { id: 'INV-001', date: '2025-12-05', type: 'Sale', amount: 25000, paid: 20000, balance: 5000, status: 'Partial' },
  { id: 'INV-002', date: '2025-12-01', type: 'Sale', amount: 15000, paid: 15000, balance: 0, status: 'Paid' },
  { id: 'INV-003', date: '2025-11-28', type: 'Sale', amount: 35000, paid: 25000, balance: 10000, status: 'Partial' },
];

const payments = [
  { id: 'PAY-001', date: '2025-12-05', amount: 20000, method: 'M-Pesa', reference: 'RH45GK7890', invoice: 'INV-001' },
  { id: 'PAY-002', date: '2025-12-01', amount: 15000, method: 'Cash', reference: '-', invoice: 'INV-002' },
  { id: 'PAY-003', date: '2025-11-28', amount: 25000, method: 'Bank Transfer', reference: 'TXN789456', invoice: 'INV-003' },
];

const purchaseHistory = [
  { month: 'Jul', amount: 35000 },
  { month: 'Aug', amount: 42000 },
  { month: 'Sep', amount: 38000 },
  { month: 'Oct', amount: 55000 },
  { month: 'Nov', amount: 48000 },
  { month: 'Dec', amount: 25000 },
];

export default function CustomerProfilePage({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const transactionColumns = [
    { header: 'Invoice', accessor: 'id' },
    { header: 'Date', accessor: 'date' },
    { header: 'Type', accessor: 'type' },
    { 
      header: 'Amount', 
      accessor: 'amount',
      render: (row) => `UGX ${row.amount.toLocaleString()}`
    },
    { 
      header: 'Paid', 
      accessor: 'paid',
      render: (row) => `UGX ${row.paid.toLocaleString()}`
    },
    { 
      header: 'Balance', 
      accessor: 'balance',
      render: (row) => (
        <span className={row.balance > 0 ? 'text-red-600 font-semibold' : 'text-emerald-600'}>
          UGX {row.balance.toLocaleString()}
        </span>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => (
        <StatusBadge variant={row.status === 'Paid' ? 'success' : row.status === 'Partial' ? 'pending' : 'danger'}>
          {row.status}
        </StatusBadge>
      )
    }
  ];

  const paymentColumns = [
    { header: 'Payment ID', accessor: 'id' },
    { header: 'Date', accessor: 'date' },
    { 
      header: 'Amount', 
      accessor: 'amount',
      render: (row) => <span className="font-semibold text-emerald-600">UGX {row.amount.toLocaleString()}</span>
    },
    { header: 'Method', accessor: 'method' },
    { header: 'Reference', accessor: 'reference' },
    { header: 'Invoice', accessor: 'invoice' }
  ];

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title={mockCustomer.name}
          subtitle={`Customer ID: ${mockCustomer.id}`}
          badge={<StatusBadge variant="success">{mockCustomer.status}</StatusBadge>}
          actions={[
            <Button
              key="edit"
              onClick={() => router.push(`/customers/${resolvedParams.id}/edit`)}
              variant="outline"
              className="rounded-2xl"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Customer
            </Button>
          ]}
        />

        {/* Customer Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="rounded-3xl shadow-lg border-0">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-900">
                    <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Phone</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{mockCustomer.phone}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-900">
                    <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Email</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{mockCustomer.email}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-900">
                    <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Address</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{mockCustomer.address}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-900">
                    <Building2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Business</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{mockCustomer.businessName}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[
            { 
              label: 'Total Spent', 
              value: `UGX ${mockCustomer.totalPurchases.toLocaleString()}`,
              icon: DollarSign,
              color: 'from-emerald-500 to-teal-500'
            },
            { 
              label: 'Outstanding Balance', 
              value: `UGX ${mockCustomer.creditBalance.toLocaleString()}`,
              icon: CreditCard,
              color: 'from-red-500 to-rose-500'
            },
            { 
              label: 'Credit Limit Left', 
              value: `UGX ${(mockCustomer.creditLimit - mockCustomer.creditBalance).toLocaleString()}`,
              icon: TrendingUp,
              color: 'from-blue-500 to-cyan-500'
            },
            { 
              label: 'Last Purchase', 
              value: mockCustomer.lastPurchase,
              icon: Calendar,
              color: 'from-purple-500 to-pink-500'
            }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="rounded-3xl shadow-lg border-0 overflow-hidden">
                <CardContent className={`p-6 bg-gradient-to-br ${stat.color} text-white`}>
                  <div className="flex items-center justify-between mb-3">
                    <stat.icon className="h-8 w-8 opacity-80" />
                  </div>
                  <div className="text-sm opacity-90 mb-1">{stat.label}</div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 rounded-2xl">
              <TabsTrigger value="overview" className="rounded-xl">Overview</TabsTrigger>
              <TabsTrigger value="transactions" className="rounded-xl">Transactions</TabsTrigger>
              <TabsTrigger value="payments" className="rounded-xl">Payments</TabsTrigger>
              <TabsTrigger value="activity" className="rounded-xl">Activity Log</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card className="rounded-3xl shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Purchase History (Last 6 Months)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={purchaseHistory}>
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
                      <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions">
              <Card className="rounded-3xl shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Sales Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataTable columns={transactionColumns} data={transactions} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments">
              <Card className="rounded-3xl shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataTable columns={paymentColumns} data={payments} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card className="rounded-3xl shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { date: '2025-12-05 14:30', action: 'Payment received', details: 'UGX 20,000 via M-Pesa' },
                      { date: '2025-12-05 10:15', action: 'New sale created', details: 'Invoice INV-001 - UGX 25,000' },
                      { date: '2025-12-01 16:45', action: 'Payment received', details: 'UGX 15,000 via Cash' },
                      { date: '2025-11-28 11:20', action: 'Customer updated', details: 'Credit limit increased to UGX 100,000' }
                    ].map((activity, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 dark:text-white">{activity.action}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{activity.details}</div>
                        </div>
                        <div className="text-xs text-gray-500">{activity.date}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
