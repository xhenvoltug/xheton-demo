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

const accountSchema = z.object({
  accountName: z.string().min(3, 'Account name must be at least 3 characters'),
  accountType: z.enum(['Bank', 'Cash'], { required_error: 'Account type is required' }),
  accountNumber: z.string().min(1, 'Account number is required'),
  bankName: z.string().optional(),
  branch: z.string().optional(),
  openingBalance: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount').optional().or(z.literal('')),
  currency: z.string().default('KES'),
  notes: z.string().optional()
});

const accountTypes = ['Bank', 'Cash'];

export default function NewAccountPage() {
  const router = useRouter();
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: { currency: 'KES' }
  });

  const accountType = watch('accountType');

  const onSubmit = (data) => {
    console.log('Account data:', data);
    alert('Account added successfully!');
    router.push('/accounts');
  };

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Add New Account"
          subtitle="Create a new bank or cash account"
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
                    <CardTitle>Account Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="accountName">Account Name *</Label>
                        <Input
                          {...register('accountName')}
                          type="text"
                          placeholder="e.g. KCB Main Account"
                          className="rounded-2xl"
                        />
                        {errors.accountName && <p className="text-red-600 text-sm mt-1">{errors.accountName.message}</p>}
                      </div>

                      <div>
                        <Label htmlFor="accountType">Account Type *</Label>
                        <select
                          {...register('accountType')}
                          className="w-full rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select type</option>
                          {accountTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        {errors.accountType && <p className="text-red-600 text-sm mt-1">{errors.accountType.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="accountNumber">Account Number *</Label>
                        <Input
                          {...register('accountNumber')}
                          type="text"
                          placeholder={accountType === 'Bank' ? 'Bank account number' : 'e.g. CASH-001'}
                          className="rounded-2xl"
                        />
                        {errors.accountNumber && <p className="text-red-600 text-sm mt-1">{errors.accountNumber.message}</p>}
                      </div>

                      <div>
                        <Label htmlFor="currency">Currency</Label>
                        <Input
                          {...register('currency')}
                          type="text"
                          defaultValue="KES"
                          className="rounded-2xl"
                          readOnly
                        />
                      </div>
                    </div>

                    {accountType === 'Bank' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="bankName">Bank Name</Label>
                          <Input
                            {...register('bankName')}
                            type="text"
                            placeholder="e.g. Kenya Commercial Bank"
                            className="rounded-2xl"
                          />
                        </div>

                        <div>
                          <Label htmlFor="branch">Branch</Label>
                          <Input
                            {...register('branch')}
                            type="text"
                            placeholder="e.g. Nairobi Branch"
                            className="rounded-2xl"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="openingBalance">Opening Balance (Optional)</Label>
                      <Input
                        {...register('openingBalance')}
                        type="text"
                        placeholder="0.00"
                        className="rounded-2xl"
                      />
                      {errors.openingBalance && <p className="text-red-600 text-sm mt-1">{errors.openingBalance.message}</p>}
                      <p className="text-sm text-gray-500 mt-1">The starting balance for this account</p>
                    </div>

                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        {...register('notes')}
                        placeholder="Additional information..."
                        className="rounded-2xl min-h-[100px]"
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
                transition={{ delay: 0.1 }}
              >
                <Card className="rounded-3xl shadow-lg border-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900">
                  <CardHeader>
                    <CardTitle className="text-lg">Account Types</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white mb-1">Bank Account</div>
                      <p className="text-gray-600 dark:text-gray-400">For tracking bank balances, transactions, and transfers</p>
                    </div>
                    <div className="pt-3 border-t">
                      <div className="font-semibold text-gray-900 dark:text-white mb-1">Cash Account</div>
                      <p className="text-gray-600 dark:text-gray-400">For petty cash, cash registers, and cash on hand</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="rounded-3xl shadow-lg border-0">
                  <CardContent className="p-6 space-y-3">
                    <Button
                      type="submit"
                      className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-6 text-lg font-semibold"
                    >
                      Add Account
                    </Button>
                    <Button
                      type="button"
                      onClick={() => router.push('/accounts')}
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
