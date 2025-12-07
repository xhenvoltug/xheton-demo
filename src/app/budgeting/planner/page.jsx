'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Calendar, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const budgetSchema = z.object({
  budgetName: z.string().min(3, 'Budget name must be at least 3 characters'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  isRecurring: z.boolean().optional()
});

const categoryTemplates = [
  { name: 'Marketing', amount: 500000 },
  { name: 'Operations', amount: 800000 },
  { name: 'IT & Technology', amount: 600000 },
  { name: 'HR & Training', amount: 300000 },
  { name: 'Office Supplies', amount: 150000 },
  { name: 'Travel & Accommodation', amount: 200000 }
];

export default function BudgetPlannerPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([{ id: 1, name: '', allocated: '', limit: '' }]);
  const [useTemplate, setUseTemplate] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(budgetSchema)
  });

  const addCategory = () => {
    setCategories([...categories, { id: Date.now(), name: '', allocated: '', limit: '' }]);
  };

  const removeCategory = (id) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const updateCategory = (id, field, value) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, [field]: value } : cat
    ));
  };

  const applyTemplate = () => {
    setCategories(categoryTemplates.map((cat, idx) => ({
      id: idx + 1,
      name: cat.name,
      allocated: cat.amount.toString(),
      limit: (cat.amount * 1.1).toString()
    })));
    setUseTemplate(true);
  };

  const onSubmit = (data) => {
    console.log('Budget data:', { ...data, categories });
    alert('Budget plan created successfully!');
    router.push('/budgeting/overview');
  };

  const totalAllocated = categories.reduce((sum, cat) => sum + (parseFloat(cat.allocated) || 0), 0);

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Budget Planner"
          subtitle="Create and allocate budgets across categories"
          actions={[
            <Button key="cancel" variant="outline" className="rounded-2xl" onClick={() => router.push('/budgeting/overview')}>
              Cancel
            </Button>
          ]}
        />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="rounded-3xl shadow-lg border-0 p-6">
                <h3 className="text-lg font-semibold mb-4">Budget Information</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="budgetName">Budget Name</Label>
                    <Input 
                      id="budgetName" 
                      {...register('budgetName')}
                      className="rounded-2xl mt-1"
                      placeholder="Q4 2025 Operating Budget"
                    />
                    {errors.budgetName && <p className="text-red-500 text-sm mt-1">{errors.budgetName.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input 
                        id="startDate" 
                        type="date"
                        {...register('startDate')}
                        className="rounded-2xl mt-1"
                      />
                      {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input 
                        id="endDate" 
                        type="date"
                        {...register('endDate')}
                        className="rounded-2xl mt-1"
                      />
                      {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="isRecurring"
                      {...register('isRecurring')}
                      className="rounded"
                    />
                    <Label htmlFor="isRecurring" className="cursor-pointer">Recurring Budget (Auto-renew)</Label>
                  </div>
                </div>
              </Card>

              <Card className="rounded-3xl shadow-lg border-0 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Budget Categories</h3>
                  <div className="flex gap-2">
                    <Button 
                      type="button"
                      variant="outline" 
                      className="rounded-2xl"
                      onClick={applyTemplate}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
                    <Button 
                      type="button"
                      variant="outline" 
                      className="rounded-2xl"
                      onClick={addCategory}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Category
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {categories.map((category, idx) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-12 gap-3 items-end"
                    >
                      <div className="col-span-4">
                        <Label className="text-xs">Category Name</Label>
                        <Input 
                          value={category.name}
                          onChange={(e) => updateCategory(category.id, 'name', e.target.value)}
                          className="rounded-2xl mt-1"
                          placeholder="e.g., Marketing"
                        />
                      </div>
                      <div className="col-span-3">
                        <Label className="text-xs">Allocated Amount</Label>
                        <Input 
                          type="number"
                          value={category.allocated}
                          onChange={(e) => updateCategory(category.id, 'allocated', e.target.value)}
                          className="rounded-2xl mt-1"
                          placeholder="0"
                        />
                      </div>
                      <div className="col-span-3">
                        <Label className="text-xs">Spending Limit</Label>
                        <Input 
                          type="number"
                          value={category.limit}
                          onChange={(e) => updateCategory(category.id, 'limit', e.target.value)}
                          className="rounded-2xl mt-1"
                          placeholder="0"
                        />
                      </div>
                      <div className="col-span-2">
                        {idx > 0 && (
                          <Button 
                            type="button"
                            variant="outline" 
                            size="sm"
                            className="rounded-2xl w-full"
                            onClick={() => removeCategory(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="rounded-3xl shadow-lg border-0 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 sticky top-6">
                <h3 className="text-lg font-semibold mb-4">Budget Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Categories</span>
                    <span className="font-bold text-xl">{categories.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Allocated</span>
                    <span className="font-bold text-xl text-blue-600">
                      UGX {totalAllocated.toLocaleString()}
                    </span>
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    {categories.filter(c => c.name && c.allocated).map(cat => (
                      <div key={cat.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300">{cat.name}</span>
                        <span className="font-semibold">UGX {parseFloat(cat.allocated).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    type="submit"
                    className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-6 mt-6"
                  >
                    Create Budget Plan
                  </Button>
                </div>
              </Card>

              {useTemplate && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card className="rounded-3xl shadow-lg border-0 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                      <Sparkles className="h-5 w-5" />
                      <span className="text-sm font-semibold">Template Applied!</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Standard categories loaded. Adjust as needed.
                    </p>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
