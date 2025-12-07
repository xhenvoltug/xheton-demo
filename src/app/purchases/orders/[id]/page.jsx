'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/shared/StatCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Send, Printer, Package, DollarSign, Calendar, TrendingUp } from 'lucide-react';

const mockOrderDetails = {
  'PO-001': {
    id: 'PO-001',
    supplier: {
      name: 'Tech Supplies Co',
      email: 'orders@techsupplies.com',
      phone: '+1 234 567 8900',
      address: '123 Tech Avenue, Silicon Valley, CA 94025',
    },
    orderDate: '2025-12-06',
    deliveryDate: '2025-12-10',
    status: 'approved',
    items: [
      { id: 1, name: 'Laptop Pro 15"', sku: 'LAP-001', quantity: 5, cost: 899.99, total: 4499.95 },
      { id: 2, name: 'Wireless Mouse', sku: 'MOU-002', quantity: 10, cost: 12.99, total: 129.90 },
      { id: 3, name: 'Monitor 27"', sku: 'MON-003', quantity: 3, cost: 249.99, total: 749.97 },
    ],
    subtotal: 5379.82,
    tax: 537.98,
    total: 5917.80,
    notes: 'Please ensure all items are properly packaged. Delivery to main warehouse.',
  },
};

export default function PurchaseOrderDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const order = mockOrderDetails[id] || mockOrderDetails['PO-001'];

  const statusColors = {
    approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    received: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title={`Purchase Order ${order.id}`}
          subtitle={`Supplier: ${order.supplier.name}`}
          actions={[
            <Button key="print" variant="outline" className="gap-2">
              <Printer className="h-4 w-4" />
              Print
            </Button>,
            <Button key="send" variant="outline" className="gap-2">
              <Send className="h-4 w-4" />
              Send
            </Button>,
            <Button key="download" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            icon={DollarSign}
            label="Total Amount"
            value={`$UGX {order.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            trend={{ value: 12.5, isPositive: true }}
            iconColor="emerald"
          />
          <StatCard
            icon={Package}
            label="Total Items"
            value={order.items.reduce((sum, item) => sum + item.quantity, 0)}
            iconColor="blue"
          />
          <StatCard
            icon={Calendar}
            label="Delivery Date"
            value={new Date(order.deliveryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            iconColor="purple"
          />
          <StatCard
            icon={TrendingUp}
            label="Status"
            value={<Badge className={statusColors[order.status]}>{order.status}</Badge>}
            iconColor="amber"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white dark:bg-gray-900/50 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Purchase Order</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Order #{order.id}</p>
                  </div>
                </div>
                <Badge className={statusColors[order.status] + ' text-sm px-3 py-1'}>
                  {order.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">From</h3>
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-900 dark:text-white">XHETON Company</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">456 Business Plaza</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">New York, NY 10001</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">To</h3>
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-900 dark:text-white">{order.supplier.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{order.supplier.address}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{order.supplier.email}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{order.supplier.phone}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Order Date:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(order.orderDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Expected Delivery:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(order.deliveryDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600 dark:text-gray-400">Item</th>
                      <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600 dark:text-gray-400">Qty</th>
                      <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600 dark:text-gray-400">Unit Cost</th>
                      <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600 dark:text-gray-400">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-4 px-2">
                          <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{item.sku}</p>
                        </td>
                        <td className="text-right py-4 px-2 text-gray-900 dark:text-white">{item.quantity}</td>
                        <td className="text-right py-4 px-2 text-gray-900 dark:text-white">
                          ${item.cost.toFixed(2)}
                        </td>
                        <td className="text-right py-4 px-2 font-semibold text-gray-900 dark:text-white">
                          ${item.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-end">
                <div className="w-full max-w-xs space-y-2">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span className="font-medium">UGX {order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Tax (10%)</span>
                    <span className="font-medium">UGX {order.tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      UGX {order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {order.notes && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Notes</h3>
                    <p className="text-gray-700 dark:text-gray-300">{order.notes}</p>
                  </div>
                </>
              )}
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 bg-white dark:bg-gray-900/50">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Package className="h-4 w-4" />
                  Create GRN
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <FileText className="h-4 w-4" />
                  Duplicate Order
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                  Cancel Order
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-white dark:bg-gray-900/50">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Receiving Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Ordered</span>
                  <span className="font-semibold text-gray-900 dark:text-white">18 items</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Received</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">0 items</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Pending</span>
                  <span className="font-semibold text-yellow-600 dark:text-yellow-400">18 items</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
