'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/shared/StatCard';
import DataTable from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DollarSign, ShoppingCart, TrendingUp, FileText, Mail, Phone, MapPin, Edit } from 'lucide-react';

const mockSupplierDetails = {
  'SUP-001': {
    id: 'SUP-001',
    name: 'Tech Supplies Co',
    email: 'orders@techsupplies.com',
    phone: '+1 234 567 8900',
    address: '123 Tech Avenue, Silicon Valley, CA 94025',
    taxId: 'XX-1234567',
    paymentTerms: 'Net 30 Days',
    creditLimit: 50000.00,
    totalPurchases: 125600.00,
    outstanding: 15000.00,
    status: 'active',
    purchaseOrders: [
      { id: 'PO-001', date: '2025-12-06', items: 12, total: 45600.00, status: 'approved' },
      { id: 'PO-005', date: '2025-12-01', items: 8, total: 32400.00, status: 'received' },
      { id: 'PO-008', date: '2025-11-28', items: 15, total: 47600.00, status: 'received' },
    ],
    outstandingInvoices: [
      { id: 'INV-001', date: '2025-12-03', amount: 15000.00, dueDate: '2026-01-02' },
    ],
  },
};

export default function SupplierDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const supplier = mockSupplierDetails[id] || mockSupplierDetails['SUP-001'];

  const statusColors = {
    active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  };

  const poStatusColors = {
    approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    received: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  };

  const poColumns = [
    {
      header: 'Order No',
      accessor: 'id',
      render: (row) => (
        <button
          onClick={() => router.push(`/purchases/orders/${row.id}`)}
          className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          {row.id}
        </button>
      ),
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
      header: 'Amount',
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
        <Badge className={`${poStatusColors[row.status]} capitalize`}>
          {row.status}
        </Badge>
      ),
    },
  ];

  const invoiceColumns = [
    {
      header: 'Invoice No',
      accessor: 'id',
      render: (row) => <span className="font-semibold text-gray-900 dark:text-white">{row.id}</span>,
    },
    {
      header: 'Invoice Date',
      accessor: 'date',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-400">
          {new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      ),
    },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (row) => (
        <span className="font-semibold text-red-600 dark:text-red-400">
          ${row.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      header: 'Due Date',
      accessor: 'dueDate',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-400">
          {new Date(row.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title={supplier.name}
          subtitle={`Supplier ID: ${supplier.id}`}
          actions={[
            <Button
              key="edit"
              variant="outline"
              onClick={() => router.push(`/purchases/suppliers/${supplier.id}/edit`)}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>,
            <Button
              key="order"
              onClick={() => router.push('/purchases/orders/new')}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              New Order
            </Button>
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            icon={DollarSign}
            label="Total Purchases"
            value={`$${supplier.totalPurchases.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            trend={{ value: 15.2, isPositive: true }}
            iconColor="emerald"
          />
          <StatCard
            icon={FileText}
            label="Outstanding"
            value={`$${supplier.outstanding.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            iconColor="red"
          />
          <StatCard
            icon={ShoppingCart}
            label="Total Orders"
            value={supplier.purchaseOrders.length}
            iconColor="blue"
          />
          <StatCard
            icon={TrendingUp}
            label="Status"
            value={<Badge className={statusColors[supplier.status]}>{supplier.status}</Badge>}
            iconColor="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white dark:bg-gray-900/50">
              <Tabs defaultValue="orders" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
                  <TabsTrigger value="invoices">Outstanding Invoices</TabsTrigger>
                </TabsList>

                <TabsContent value="orders" className="mt-6">
                  <DataTable columns={poColumns} data={supplier.purchaseOrders} variant="compact" />
                </TabsContent>

                <TabsContent value="invoices" className="mt-6">
                  {supplier.outstandingInvoices.length > 0 ? (
                    <DataTable columns={invoiceColumns} data={supplier.outstandingInvoices} variant="compact" />
                  ) : (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <p>No outstanding invoices</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 bg-white dark:bg-gray-900/50">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <a href={`mailto:${supplier.email}`} className="text-gray-900 dark:text-white hover:text-emerald-600">
                      {supplier.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    <a href={`tel:${supplier.phone}`} className="text-gray-900 dark:text-white hover:text-emerald-600">
                      {supplier.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                    <p className="text-gray-900 dark:text-white">{supplier.address}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white dark:bg-gray-900/50">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Business Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tax ID</p>
                  <p className="text-gray-900 dark:text-white font-medium">{supplier.taxId}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Payment Terms</p>
                  <p className="text-gray-900 dark:text-white font-medium">{supplier.paymentTerms}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Credit Limit</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    ${supplier.creditLimit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
