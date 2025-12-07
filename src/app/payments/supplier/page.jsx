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
  supplier: z.string().min(1, 'Supplier is required'),
  purchaseOrder: z.string().min(1, 'Purchase order is required'),
  date: z.string().min(1, 'Date is required'),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  reference: z.string().optional(),
  notes: z.string().optional()
});

const mockSuppliers = [
  { id: 'S001', name: 'ABC Suppliers Ltd', payables: 125000 },
  { id: 'S002', name: 'Tech Distributors', payables: 0 },
  { id: 'S003', name: 'Global Imports', payables: 45000 }
];

const mockPurchaseOrders = [
  { id: 'PO-001', supplier: 'S001', amount: 125000, paid: 0, balance: 125000 },
  { id: 'PO-002', supplier: 'S002', amount: 185000, paid: 185000, balance: 0 },
  { id: 'PO-003', supplier: 'S003', amount: 145000, paid: 100000, balance: 45000 }
];

const paymentMethods = ['Cash', 'Bank Transfer', 'Cheque', 'M-Pesa', 'Credit Card'];

export default function SupplierPaymentPage() {
  const router = useRouter();
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(paymentSchema)
  });

  const selectedSupplier = watch('supplier');
  const selectedPO = watch('purchaseOrder');

  const supplierData = selectedSupplier ? mockSuppliers.find(s => s.id === selectedSupplier) : null;
  const poData = selectedPO ? mockPurchaseOrders.find(po => po.id === selectedPO) : null;

  const onSubmit = (data) => {
    console.log('Supplier payment data:', data);
    alert('Payment to supplier recorded successfully!');
    router.push('/payments');
  };

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Record Supplier Payment"
          subtitle="Business pays supplier for purchase orders"
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
                        <Label htmlFor="supplier">Supplier *</Label>
                        <select
                          {...register('supplier')}
                          className="w-full rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 focus:ring-2 focus:ring-red-500"
                        >
                          <option value="">Select supplier</option>
                          {mockSuppliers.map((supplier) => (
                            <option key={supplier.id} value={supplier.id}>
                              {supplier.name} (Payable: UGX {supplier.payables.toLocaleString()})
                            </option>
                          ))}
                        </select>
                        {errors.supplier && <p className="text-red-600 text-sm mt-1">{errors.supplier.message}</p>}
                      </div>

                      <div>
                        <Label htmlFor="purchaseOrder">Purchase Order *</Label>
                        <select
                          {...register('purchaseOrder')}
                          className="w-full rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 focus:ring-2 focus:ring-red-500"
                          disabled={!selectedSupplier}
                        >
                          <option value="">Select purchase order</option>
                          {selectedSupplier && mockPurchaseOrders
                            .filter(po => po.supplier === selectedSupplier)
                            .map((po) => (
                              <option key={po.id} value={po.id}>
                                {po.id} (Balance: UGX {po.balance.toLocaleString()})
                              </option>
                            ))}
                        </select>
                        {errors.purchaseOrder && <p className="text-red-600 text-sm mt-1">{errors.purchaseOrder.message}</p>}
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
                          className="w-full rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 focus:ring-2 focus:ring-red-500"
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
              {poData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="rounded-3xl shadow-lg border-0 bg-gradient-to-br from-red-50 to-rose-50 dark:from-gray-800 dark:to-gray-900">
                    <CardHeader>
                      <CardTitle className="text-lg">PO Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Purchase Order:</span>
                        <span className="font-semibold">{poData.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Total:</span>
                        <span className="font-semibold">UGX {poData.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Paid:</span>
                        <span className="font-semibold text-emerald-600">UGX {poData.paid.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t">
                        <span className="text-gray-900 dark:text-white font-semibold">Payable:</span>
                        <span className="font-bold text-red-600">UGX {poData.balance.toLocaleString()}</span>
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
                      className="w-full rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white py-6 text-lg font-semibold"
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
