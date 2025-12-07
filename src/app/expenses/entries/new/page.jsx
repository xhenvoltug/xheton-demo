'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import FormCard from '@/components/shared/FormCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Save, X, Upload, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const mockCategories = [
  { id: 'CAT-001', name: 'Office Supplies' },
  { id: 'CAT-002', name: 'Utilities' },
  { id: 'CAT-003', name: 'Rent' },
  { id: 'CAT-004', name: 'Marketing' },
  { id: 'CAT-005', name: 'Salaries' },
  { id: 'CAT-006', name: 'Transportation' },
];

export default function NewExpenseEntryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: '',
    amount: '',
    paymentMethod: '',
    notes: '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.amount || !formData.paymentMethod) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    toast.success('Expense created successfully!');
    setTimeout(() => router.push('/expenses/entries/list'), 1000);
  };

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="New Expense"
          subtitle="Record a new business expense"
          actions={[
            <Button
              key="cancel"
              variant="outline"
              onClick={() => router.push('/expenses/entries/list')}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>,
          ]}
        />

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <FormCard title="Expense Details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                    <SelectTrigger id="category" className="mt-2">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="amount">Amount ($) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleChange('amount', e.target.value)}
                    placeholder="0.00"
                    className="mt-2"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="paymentMethod">Payment Method *</Label>
                  <Select value={formData.paymentMethod} onValueChange={(value) => handleChange('paymentMethod', value)}>
                    <SelectTrigger id="paymentMethod" className="mt-2">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="credit">Credit Card</SelectItem>
                      <SelectItem value="debit">Debit Card</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </FormCard>

            <FormCard title="Additional Information">
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Add any additional details about this expense..."
                  className="mt-2"
                  rows={4}
                />
              </div>
            </FormCard>

            <FormCard title="Attachments">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:border-amber-500 dark:hover:border-amber-500 transition-colors cursor-pointer">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  PDF, PNG, JPG up to 10MB
                </p>
              </div>
            </FormCard>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card className="p-6 bg-white dark:bg-gray-900/50 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Summary
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Amount</span>
                    <span className="font-medium">
                      ${formData.amount ? parseFloat(formData.amount).toFixed(2) : '0.00'}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Category</span>
                    <span className="font-medium">
                      {formData.category ? mockCategories.find(c => c.id === formData.category)?.name : '-'}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Payment</span>
                    <span className="font-medium capitalize">
                      {formData.paymentMethod || '-'}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                      <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                        ${formData.amount ? parseFloat(formData.amount).toFixed(2) : '0.00'}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                  size="lg"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Expense
                </Button>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
