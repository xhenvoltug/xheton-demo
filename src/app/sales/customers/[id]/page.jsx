'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/shared/StatCard';
import DataTable from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Phone, MapPin, Edit, Download, DollarSign, ShoppingCart, CreditCard, TrendingUp, Loader2 } from 'lucide-react';

export default function CustomerProfilePage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/sales/customers/${id}`);
        if (!response.ok) throw new Error('Failed to load customer');
        const data = await response.json();
        setCustomer(data.data || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCustomer();
    }
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
          <p className="text-gray-600 dark:text-gray-400">Loading customer details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !customer) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 text-red-600">
          <p className="font-semibold mb-2">Error loading customer</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{error || 'Customer not found'}</p>
          <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
        </div>
      </DashboardLayout>
    );
  }

  const purchaseColumns = [
    {
      header: 'Invoice',
      accessor: 'id',
      render: (row) => <span className="font-semibold text-gray-900 dark:text-white">{row.id}</span>,
    },
    {
      header: 'Date',
      accessor: 'date',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-400">
          {new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      ),
    },
    {
      header: 'Items',
      accessor: 'items',
      render: (row) => <span className="text-gray-600 dark:text-gray-400">{row.items} items</span>,
    },
    {
      header: 'Total',
      accessor: 'total',
      render: (row) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          ${row.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          {row.status}
        </Badge>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title={mockCustomer.name}
          subtitle={`Customer ID: ${mockCustomer.id}`}
          actions={[
            <Button
              key="edit"
              variant="outline"
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>,
            <Button
              key="statement"
              variant="outline"
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download Statement
            </Button>,
          ]}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Purchases"
            value={`$${mockCustomer.totalPurchases.toLocaleString()}`}
            change={{ value: 12.5, isPositive: true }}
            icon={DollarSign}
          />
          <StatCard
            title="Orders Count"
            value={mockPurchaseHistory.length}
            icon={ShoppingCart}
          />
          <StatCard
            title="Outstanding Balance"
            value={`$${mockCustomer.outstandingBalance.toFixed(2)}`}
            icon={CreditCard}
          />
          <StatCard
            title="Credit Limit"
            value={`$${mockCustomer.creditLimit.toLocaleString()}`}
            icon={TrendingUp}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Contact Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <Mail className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-900 dark:text-white">{mockCustomer.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <Phone className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="font-medium text-gray-900 dark:text-white">{mockCustomer.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {mockCustomer.address}<br />
                      {mockCustomer.city}, {mockCustomer.state} {mockCustomer.zipCode}<br />
                      {mockCustomer.country}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      {mockCustomer.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Customer Since</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(mockCustomer.joinedDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Purchase History & Details */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 shadow-sm">
              <Tabs defaultValue="history" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="history">Purchase History</TabsTrigger>
                  <TabsTrigger value="outstanding">Outstanding Invoices</TabsTrigger>
                </TabsList>

                <TabsContent value="history">
                  <DataTable
                    columns={purchaseColumns}
                    data={mockPurchaseHistory}
                    variant="compact"
                  />
                </TabsContent>

                <TabsContent value="outstanding">
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No Outstanding Invoices</p>
                    <p className="text-sm mt-1">This customer has no pending payments</p>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
