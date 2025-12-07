'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, Send, Printer, Edit, Check } from 'lucide-react';
import toast from 'react-hot-toast';

// Mock invoice data
const mockInvoice = {
  id: 'INV-001',
  date: '2025-12-06',
  dueDate: '2025-12-20',
  status: 'paid',
  paidDate: '2025-12-08',
  customer: {
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Ave, Suite 500',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
  },
  items: [
    { id: 1, name: 'Laptop Pro 15"', sku: 'P001', quantity: 3, price: 1299.99, total: 3899.97 },
    { id: 2, name: 'Wireless Mouse', sku: 'P002', quantity: 5, price: 29.99, total: 149.95 },
    { id: 3, name: 'Monitor 27"', sku: 'P004', quantity: 6, price: 349.99, total: 2099.94 },
    { id: 4, name: 'Keyboard Mechanical', sku: 'P005', quantity: 5, price: 89.99, total: 449.95 },
    { id: 5, name: 'USB-C Cable', sku: 'P003', quantity: 10, price: 15.99, total: 159.90 },
  ],
  subtotal: 6759.71,
  discount: 0,
  tax: 675.97,
  total: 7435.68,
  notes: 'Thank you for your business!',
  paymentMethod: 'Bank Transfer',
};

const statusColors = {
  paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  overdue: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function InvoiceDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();

  const handleDownloadPDF = () => {
    toast.success('Downloading invoice PDF...');
  };

  const handleSendEmail = () => {
    toast.success('Invoice sent to customer email');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title={`Invoice ${mockInvoice.id}`}
          subtitle={`Created on ${new Date(mockInvoice.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
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
              key="print"
              variant="outline"
              onClick={handlePrint}
              className="gap-2"
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>,
            <Button
              key="send"
              variant="outline"
              onClick={handleSendEmail}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              Send
            </Button>,
            <Button
              key="download"
              onClick={handleDownloadPDF}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 gap-2"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>,
          ]}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="p-8 sm:p-12 bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 shadow-lg">
            {/* Invoice Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  INVOICE
                </h1>
                <p className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">
                  {mockInvoice.id}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <Badge className={`${statusColors[mockInvoice.status]} text-sm px-4 py-1 capitalize mb-3`}>
                  <Check className="h-3 w-3 mr-1" />
                  {mockInvoice.status}
                </Badge>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Issue Date:</span> {new Date(mockInvoice.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Due Date:</span> {new Date(mockInvoice.dueDate).toLocaleDateString()}
                  </p>
                  {mockInvoice.paidDate && (
                    <p className="text-emerald-600 dark:text-emerald-400">
                      <span className="font-medium">Paid Date:</span> {new Date(mockInvoice.paidDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* From / To Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                  From
                </h3>
                <div className="text-gray-900 dark:text-white">
                  <p className="font-bold text-lg mb-2">XHETON</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    456 Tech Boulevard<br />
                    San Francisco, CA 94105<br />
                    United States<br />
                    contact@xheton.com
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                  Bill To
                </h3>
                <div className="text-gray-900 dark:text-white">
                  <p className="font-bold text-lg mb-2">{mockInvoice.customer.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {mockInvoice.customer.address}<br />
                    {mockInvoice.customer.city}, {mockInvoice.customer.state} {mockInvoice.customer.zipCode}<br />
                    {mockInvoice.customer.email}<br />
                    {mockInvoice.customer.phone}
                  </p>
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Items Table */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                Items
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Item</th>
                      <th className="text-left py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">SKU</th>
                      <th className="text-right py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Qty</th>
                      <th className="text-right py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Price</th>
                      <th className="text-right py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockInvoice.items.map((item, idx) => (
                      <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-4 text-gray-900 dark:text-white font-medium">
                          {item.name}
                        </td>
                        <td className="py-4 text-gray-600 dark:text-gray-400 text-sm">
                          {item.sku}
                        </td>
                        <td className="py-4 text-right text-gray-600 dark:text-gray-400">
                          {item.quantity}
                        </td>
                        <td className="py-4 text-right text-gray-600 dark:text-gray-400">
                          UGX {item.price.toLocaleString()}
                        </td>
                        <td className="py-4 text-right font-semibold text-gray-900 dark:text-white">
                          ${item.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-full sm:w-80 space-y-3">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-medium">${mockInvoice.subtotal.toFixed(2)}</span>
                </div>
                
                {mockInvoice.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Discount</span>
                    <span>-${mockInvoice.discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax (10%)</span>
                  <span className="font-medium">${mockInvoice.tax.toFixed(2)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-2xl font-bold text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    ${mockInvoice.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            {mockInvoice.paymentMethod && (
              <>
                <Separator className="my-8" />
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Payment Method
                  </h3>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {mockInvoice.paymentMethod}
                  </p>
                </div>
              </>
            )}

            {/* Notes */}
            {mockInvoice.notes && (
              <>
                <Separator className="my-8" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Notes
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {mockInvoice.notes}
                  </p>
                </div>
              </>
            )}

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>Thank you for your business!</p>
              <p className="mt-1">For questions about this invoice, contact us at support@xheton.com</p>
            </div>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
