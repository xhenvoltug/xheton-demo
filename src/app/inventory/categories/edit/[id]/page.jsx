'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EditCategoryPage({ params }) {
  const router = useRouter();
  const { id } = use(params);

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ category_name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch category details on mount
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`/api/inventory/categories/${id}`);
        const data = await res.json();
        if (data.success) {
          setCategory(data.category);
          setFormData({
            category_name: data.category.category_name,
            description: data.category.description || ''
          });
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCategory();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category_name) {
      toast.error('Category name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/inventory/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Category updated successfully!');
        router.push('/inventory/categories/list');
      } else {
        toast.error(data.error || 'Failed to update category');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="xheton-page">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading category...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="xheton-page">
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-2xl p-6 flex items-center gap-4">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-200">Error Loading Category</h3>
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Edit Category"
          subtitle={`Update details for ${category?.category_name || 'category'}`}
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
              {/* Category ID (Read-only) */}
              <div>
                <Label htmlFor="id">Category ID</Label>
                <Input
                  id="id"
                  value={category?.id || ''}
                  disabled
                  className="mt-2 bg-gray-100 dark:bg-gray-800"
                />
              </div>

              {/* Category Code (Read-only) */}
              <div>
                <Label htmlFor="code">Category Code</Label>
                <Input
                  id="code"
                  value={category?.category_code || ''}
                  disabled
                  className="mt-2 bg-gray-100 dark:bg-gray-800"
                />
              </div>

              {/* Category Name */}
              <div>
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  value={formData.category_name}
                  onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                  placeholder="Enter category name"
                  className="mt-2"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter category description (optional)"
                  className="mt-2"
                  rows={4}
                />
              </div>

              {/* Status Info */}
              {category && (
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
                  <p className="text-sm text-blue-900 dark:text-blue-200">
                    <span className="font-semibold">Status:</span> {category.is_active ? 'Active' : 'Inactive'}
                  </p>
                  <p className="text-sm text-blue-900 dark:text-blue-200 mt-1">
                    <span className="font-semibold">Created:</span> {new Date(category.created_at).toLocaleString()}
                  </p>
                </div>
              )}

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
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
