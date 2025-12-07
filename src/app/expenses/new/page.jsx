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

const expenseSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  paidBy: z.string().min(2, 'Paid by field is required'),
  reference: z.string().optional(),
  receipt: z.string().optional(),
  notes: z.string().optional()
});

const categories = [
  'Salaries & Wages',
  'Rent & Utilities',
  'Transport & Fuel',
  'Office Supplies',
  'Marketing & Advertising',
  'Maintenance & Repairs',
  'Insurance',
  'Legal & Professional Fees',
  'Taxes',
  'Miscellaneous'
];

const paymentMethods = ['Cash', 'Bank Transfer', 'M-Pesa', 'Cheque', 'Credit Card', 'Debit Card'];

export default function NewExpensePage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(expenseSchema)
  });

  const onSubmit = (data) => {
    console.log('Expense data:', data);
    alert('Expense recorded successfully!');
    router.push('/expenses');
  };

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Record Expense"
          subtitle="Add a new business expense"
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
                    <CardTitle>Expense Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <select
                          {...register('category')}
                          className="w-full rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="">Select category</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>}
                      </div>

                      <div>
                        <Label htmlFor="date">Date *</Label>
                        <Input
                          {...register('date')}
                          type="date"
                          className="rounded-2xl"
                        />
                        {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="amount">Amount (KES) *</Label>
                        <Input
                          {...register('amount')}
                          type="text"
                          placeholder="0.00"
                          className="rounded-2xl"
                        />
                        {errors.amount && <p className="text-red-600 text-sm mt-1">{errors.amount.message}</p>}
                      </div>

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
                    </div>

                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        {...register('description')}
                        placeholder="Describe the expense..."
                        className="rounded-2xl min-h-[100px]"
                      />
                      {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="paidBy">Paid By *</Label>
                        <Input
                          {...register('paidBy')}
                          type="text"
                          placeholder="Person who made payment"
                          className="rounded-2xl"
                        />
                        {errors.paidBy && <p className="text-red-600 text-sm mt-1">{errors.paidBy.message}</p>}
                      </div>

                      <div>
                        <Label htmlFor="reference">Reference Number</Label>
                        <Input
                          {...register('reference')}
                          type="text"
                          placeholder="Transaction/Receipt reference"
                          className="rounded-2xl"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="rounded-3xl shadow-lg border-0">
                  <CardHeader>
                    <CardTitle>Additional Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="receipt">Receipt/Attachment</Label>
                      <Input
                        {...register('receipt')}
                        type="file"
                        className="rounded-2xl"
                        accept="image/*,.pdf"
                      />
                      <p className="text-sm text-gray-500 mt-1">Upload receipt image or PDF (optional)</p>
                    </div>

                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        {...register('notes')}
                        placeholder="Any additional notes..."
                        className="rounded-2xl min-h-[80px]"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="rounded-3xl shadow-lg border-0">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      type="button"
                      onClick={() => router.push('/expenses/categories')}
                      variant="outline"
                      className="w-full rounded-2xl"
                    >
                      Manage Categories
                    </Button>
                    <Button
                      type="button"
                      onClick={() => router.push('/expenses')}
                      variant="outline"
                      className="w-full rounded-2xl"
                    >
                      View All Expenses
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="rounded-3xl shadow-lg border-0">
                  <CardContent className="p-6 space-y-3">
                    <Button
                      type="submit"
                      className="w-full rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white py-6 text-lg font-semibold"
                    >
                      Record Expense
                    </Button>
                    <Button
                      type="button"
                      onClick={() => router.push('/expenses')}
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
