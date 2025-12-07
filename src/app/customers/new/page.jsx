'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Save, X } from 'lucide-react';
import { motion } from 'framer-motion';

const customerSchema = z.object({
  fullName: z.string().min(3, 'Name must be at least 3 characters'),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  businessName: z.string().optional(),
  taxNumber: z.string().optional(),
  openingBalance: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount').optional().or(z.literal('')),
  creditLimit: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount').optional().or(z.literal('')),
  notes: z.string().optional()
});

export default function NewCustomerPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(customerSchema)
  });

  const onSubmit = (data) => {
    console.log('Customer data:', data);
    alert('Customer added successfully!');
    router.push('/customers');
  };

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Add New Customer"
          subtitle="Create a new customer profile"
          actions={[
            <Button
              key="cancel"
              onClick={() => router.push('/customers')}
              variant="outline"
              className="rounded-2xl"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          ]}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Information */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="rounded-3xl shadow-lg border-0">
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          {...register('fullName')}
                          className="rounded-2xl"
                          placeholder="John Doe"
                        />
                        {errors.fullName && (
                          <p className="text-sm text-red-600 mt-1">{errors.fullName.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          {...register('phone')}
                          className="rounded-2xl"
                          placeholder="+254 700 000 000"
                        />
                        {errors.phone && (
                          <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="email">Email (Optional)</Label>
                        <Input
                          id="email"
                          type="email"
                          {...register('email')}
                          className="rounded-2xl"
                          placeholder="customer@example.com"
                        />
                        {errors.email && (
                          <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="businessName">Business Name (Optional)</Label>
                        <Input
                          id="businessName"
                          {...register('businessName')}
                          className="rounded-2xl"
                          placeholder="ABC Company Ltd"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        {...register('address')}
                        className="rounded-2xl"
                        placeholder="123 Main Street, Nairobi"
                      />
                      {errors.address && (
                        <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="taxNumber">Tax Number (Optional)</Label>
                      <Input
                        id="taxNumber"
                        {...register('taxNumber')}
                        className="rounded-2xl"
                        placeholder="A123456789X"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-3xl shadow-lg border-0">
                  <CardHeader>
                    <CardTitle>Additional Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      {...register('notes')}
                      className="rounded-2xl min-h-[120px]"
                      placeholder="Any additional information about this customer..."
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Financial Information */}
              <div className="space-y-6">
                <Card className="rounded-3xl shadow-lg border-0">
                  <CardHeader>
                    <CardTitle>Financial Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="openingBalance">Opening Balance</Label>
                      <Input
                        id="openingBalance"
                        {...register('openingBalance')}
                        className="rounded-2xl"
                        placeholder="0.00"
                        type="number"
                        step="0.01"
                      />
                      {errors.openingBalance && (
                        <p className="text-sm text-red-600 mt-1">{errors.openingBalance.message}</p>
                      )}
                      <p className="text-xs text-gray-600 mt-1">Initial credit/debt amount</p>
                    </div>

                    <div>
                      <Label htmlFor="creditLimit">Credit Limit</Label>
                      <Input
                        id="creditLimit"
                        {...register('creditLimit')}
                        className="rounded-2xl"
                        placeholder="0.00"
                        type="number"
                        step="0.01"
                      />
                      {errors.creditLimit && (
                        <p className="text-sm text-red-600 mt-1">{errors.creditLimit.message}</p>
                      )}
                      <p className="text-xs text-gray-600 mt-1">Maximum allowed credit</p>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-2xl text-lg"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Save Customer
                </Button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
