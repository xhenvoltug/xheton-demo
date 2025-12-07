'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/core/StatusBadge';
import DataTable from '@/components/shared/DataTable';
import { Edit, Mail, Phone, MapPin, Building2, DollarSign, TrendingDown, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockSupplier = {
  id: 'S001',
  name: 'ABC Suppliers Ltd',
  contactPerson: 'James Mwangi',
  phone: '+254 711 222 333',
  email: 'james@abc.com',
  address: 'Industrial Area, Nairobi',
  category: 'Electronics, Appliances',
  totalPurchases: 2400000,
  outstanding: 125000,
  status: 'Active',
  lastPurchase: '2025-12-05'
};

const purchaseOrders = [
  { id: 'PO-001', date: '2025-12-05', items: 15, amount: 125000, paid: 0, balance: 125000, status: 'Pending' },
  { id: 'PO-002', date: '2025-11-28', items: 22, amount: 185000, paid: 185000, balance: 0, status: 'Paid' },
  { id: 'PO-003', date: '2025-11-15', items: 18, amount: 145000, paid: 145000, balance: 0, status: 'Paid' },
];

const paymentHistory = [
  { id: 'PAY-S001', date: '2025-11-28', amount: 185000, method: 'Bank Transfer', reference: 'TXN456789', po: 'PO-002' },
  { id: 'PAY-S002', date: '2025-11-15', amount: 145000, method: 'Cheque', reference: 'CHQ-12345', po: 'PO-003' },
];

const purchaseTrend = [
  { month: 'Jul', amount: 195000 },
  { month: 'Aug', amount: 215000 },
  { month: 'Sep', amount: 185000 },
  { month: 'Oct', amount: 245000 },
  { month: 'Nov', amount: 330000 },
  { month: 'Dec', amount: 125000 },
];

export default function SupplierProfilePage({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const poColumns = [
    { header: 'PO Number', accessor: 'id' },
    { header: 'Date', accessor: 'date' },
    { header: 'Items', accessor: 'items' },
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
        <StatusBadge variant={row.status === 'Paid' ? 'success' : 'pending'}>
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
      render: (row) => <span className="font-semibold text-red-600">UGX {row.amount.toLocaleString()}</span>
    },
    { header: 'Method', accessor: 'method' },
    { header: 'Reference', accessor: 'reference' },
    { header: 'PO Number', accessor: 'po' }
  ];

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title={mockSupplier.name}
          subtitle={`Supplier ID: ${mockSupplier.id}`}
          badge={<StatusBadge variant="success">{mockSupplier.status}</StatusBadge>}
          actions={[
            <Button
              key="edit"
              onClick={() => router.push(`/suppliers/${resolvedParams.id}/edit`)}
              variant="outline"
              className="rounded-2xl"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Supplier
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-900">
                    <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Contact</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{mockSupplier.contactPerson}</div>
                    <div className="text-sm text-gray-600">{mockSupplier.phone}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-900">
                    <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Email</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{mockSupplier.email}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-900">
                    <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Address</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{mockSupplier.address}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-900">
                    <Building2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Category</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{mockSupplier.category}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[
            { 
              label: 'Total Purchased', 
              value: `UGX ${mockSupplier.totalPurchases.toLocaleString()}`,
              icon: DollarSign,
              color: 'from-purple-500 to-pink-500'
            },
            { 
              label: 'Outstanding Payables', 
              value: `UGX ${mockSupplier.outstanding.toLocaleString()}`,
              icon: TrendingDown,
              color: 'from-red-500 to-rose-500'
            },
            { 
              label: 'Last Purchase', 
              value: mockSupplier.lastPurchase,
              icon: Calendar,
              color: 'from-blue-500 to-cyan-500'
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 rounded-2xl">
              <TabsTrigger value="overview" className="rounded-xl">Overview</TabsTrigger>
              <TabsTrigger value="orders" className="rounded-xl">Purchase Orders</TabsTrigger>
              <TabsTrigger value="payments" className="rounded-xl">Payments</TabsTrigger>
              <TabsTrigger value="activity" className="rounded-xl">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card className="rounded-3xl shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Purchase Trend (Last 6 Months)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={purchaseTrend}>
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
                      <Line type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card className="rounded-3xl shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Purchase Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataTable columns={poColumns} data={purchaseOrders} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments">
              <Card className="rounded-3xl shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataTable columns={paymentColumns} data={paymentHistory} />
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
                      { date: '2025-12-05 10:30', action: 'Purchase order created', details: 'PO-001 - UGX 125,000' },
                      { date: '2025-11-28 14:15', action: 'Payment made', details: 'UGX 185,000 via Bank Transfer' },
                      { date: '2025-11-28 09:20', action: 'Purchase order created', details: 'PO-002 - UGX 185,000' },
                      { date: '2025-11-15 11:45', action: 'Payment made', details: 'UGX 145,000 via Cheque' }
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
