'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewCategoryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ category_name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category_name) {
      toast.error('Category name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/inventory/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Category created successfully!');
        router.push('/inventory/categories/list');
      } else {
        toast.error(data.error || 'Failed to create category');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Create New Category"
          subtitle="Add a new product category to your inventory"
          actions={[
            <Button
              key="back"
              variant="outline"
              onClick={() => router.push('/inventory/categories/list')}
              className="rounded-2xl"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Button>
          ]}
        />

        <div className="max-w-2xl">
          <Card className="rounded-3xl shadow-lg border-0 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Name */}
              <div>
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  value={formData.category_name}
                  onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                  placeholder="e.g., Electronics, Furniture, Clothing"
                  className="mt-2"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  A unique code will be auto-generated from the category name
                </p>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what types of products belong in this category (optional)"
                  className="mt-2"
                  rows={4}
                />
              </div>

              {/* Info */}
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  📝 <span className="font-semibold">Tip:</span> The category code will be automatically generated from the first 4 letters of your category name plus a timestamp to ensure uniqueness.
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 justify-end pt-4 border-t dark:border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/inventory/categories/list')}
                  disabled={isSubmitting}
                  className="rounded-2xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-2xl"
                  disabled={isSubmitting}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Creating...' : 'Create Category'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
