'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';

const paymentSchema = z.object({
  customer: z.string().min(1, 'Customer is required'),
  invoice: z.string().min(1, 'Invoice is required'),
  date: z.string().min(1, 'Date is required'),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  reference: z.string().optional(),
  notes: z.string().optional()
});

const mockCustomers = [
  { id: 'C001', name: 'John Kamau', balance: 15000 },
  { id: 'C002', name: 'Mary Wanjiru', balance: 0 },
  { id: 'C003', name: 'James Ochieng', balance: 45000 }
];

const mockInvoices = [
  { id: 'INV-001', customer: 'C001', amount: 50000, paid: 25000, balance: 25000 },
  { id: 'INV-002', customer: 'C002', amount: 35000, paid: 20000, balance: 15000 },
  { id: 'INV-003', customer: 'C003', amount: 75000, paid: 40000, balance: 35000 }
];

const paymentMethods = ['Cash', 'M-Pesa', 'Bank Transfer', 'Cheque', 'Credit Card'];

export default function CustomerPaymentPage() {
  const router = useRouter();
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(paymentSchema)
  });

  const selectedCustomer = watch('customer');
  const selectedInvoice = watch('invoice');

  const customerData = selectedCustomer ? mockCustomers.find(c => c.id === selectedCustomer) : null;
  const invoiceData = selectedInvoice ? mockInvoices.find(i => i.id === selectedInvoice) : null;

  const onSubmit = (data) => {
    console.log('Payment data:', data);
    alert('Payment recorded successfully!');
    router.push('/payments');
  };

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Record Customer Payment"
          subtitle="Customer pays business for invoices"
        />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="rounded-3xl shadow-lg border-0">
                  <CardHeader>
                    <CardTitle>Payment Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="customer">Customer *</Label>
                        <select
                          {...register('customer')}
                          className="w-full rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="">Select customer</option>
                          {mockCustomers.map((customer) => (
                            <option key={customer.id} value={customer.id}>
                              {customer.name} (Balance: UGX {customer.balance.toLocaleString()})
                            </option>
                          ))}
                        </select>
                        {errors.customer && <p className="text-red-600 text-sm mt-1">{errors.customer.message}</p>}
                      </div>

                      <div>
                        <Label htmlFor="invoice">Invoice *</Label>
                        <select
                          {...register('invoice')}
                          className="w-full rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 focus:ring-2 focus:ring-emerald-500"
                          disabled={!selectedCustomer}
                        >
                          <option value="">Select invoice</option>
                          {selectedCustomer && mockInvoices
                            .filter(inv => inv.customer === selectedCustomer)
                            .map((invoice) => (
                              <option key={invoice.id} value={invoice.id}>
                                {invoice.id} (Balance: UGX {invoice.balance.toLocaleString()})
                              </option>
                            ))}
                        </select>
                        {errors.invoice && <p className="text-red-600 text-sm mt-1">{errors.invoice.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date">Payment Date *</Label>
                        <Input
                          {...register('date')}
                          type="date"
                          className="rounded-2xl"
                        />
                        {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date.message}</p>}
                      </div>

                      <div>
                        <Label htmlFor="amount">Amount (UGX) *</Label>
                        <Input
                          {...register('amount')}
                          type="text"
                          placeholder="0.00"
                          className="rounded-2xl"
                        />
                        {errors.amount && <p className="text-red-600 text-sm mt-1">{errors.amount.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="paymentMethod">Payment Method *</Label>
                        <select
                          {...register('paymentMethod')}
                          className="w-full rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="">Select method</option>
                          {paymentMethods.map((method) => (
                            <option key={method} value={method}>{method}</option>
                          ))}
                        </select>
                        {errors.paymentMethod && <p className="text-red-600 text-sm mt-1">{errors.paymentMethod.message}</p>}
                      </div>

                      <div>
                        <Label htmlFor="reference">Reference Number</Label>
                        <Input
                          {...register('reference')}
                          type="text"
                          placeholder="Transaction reference"
                          className="rounded-2xl"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        {...register('notes')}
                        placeholder="Additional notes..."
                        className="rounded-2xl min-h-[100px]"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="space-y-6">
              {invoiceData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="rounded-3xl shadow-lg border-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900">
                    <CardHeader>
                      <CardTitle className="text-lg">Invoice Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Invoice:</span>
                        <span className="font-semibold">{invoiceData.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Total:</span>
                        <span className="font-semibold">UGX {invoiceData.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Paid:</span>
                        <span className="font-semibold text-emerald-600">UGX {invoiceData.paid.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t">
                        <span className="text-gray-900 dark:text-white font-semibold">Balance:</span>
                        <span className="font-bold text-red-600">UGX {invoiceData.balance.toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="rounded-3xl shadow-lg border-0">
                  <CardContent className="p-6 space-y-3">
                    <Button
                      type="submit"
                      className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-6 text-lg font-semibold"
                    >
                      Record Payment
                    </Button>
                    <Button
                      type="button"
                      onClick={() => router.push('/payments')}
                      variant="outline"
                      className="w-full rounded-2xl"
                    >
                      Cancel
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
