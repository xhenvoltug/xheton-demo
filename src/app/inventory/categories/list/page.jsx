'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CategoriesListPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ category_name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/inventory/categories');
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories || []);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const columns = [
    {
      header: 'Category ID',
      accessor: 'id',
      render: (row) => <span className="font-semibold text-emerald-600 dark:text-emerald-400">{row.id}</span>,
    },
    {
      header: 'Category Name',
      accessor: 'category_name',
      render: (row) => <span className="font-semibold text-gray-900 dark:text-white">{row.category_name}</span>,
    },
    {
      header: 'Description',
      accessor: 'description',
      render: (row) => <span className="text-gray-600 dark:text-gray-400">{row.description || '-'}</span>,
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              setEditingCategory(row);
              setFormData({ category_name: row.category_name, description: row.description || '' });
              setShowEditDialog(true);
            }}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleDelete(row.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const handleDelete = async (categoryId) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const res = await fetch(`/api/inventory/categories/${categoryId}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        toast.success('Category deleted successfully');
        setCategories(categories.filter(c => c.id !== categoryId));
      } else {
        toast.error('Failed to delete category');
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSave = async () => {
    if (!formData.category_name) {
      toast.error('Category name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingCategory) {
        // Update existing category
        const res = await fetch(`/api/inventory/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const data = await res.json();

        if (res.ok && data.success) {
          toast.success('Category updated successfully!');
          setCategories(categories.map(c => c.id === editingCategory.id ? data.category : c));
          setShowEditDialog(false);
          setEditingCategory(null);
          setFormData({ category_name: '', description: '' });
        } else {
          toast.error(data.error || 'Failed to update category');
        }
      } else {
        // Create new category
        const res = await fetch('/api/inventory/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const data = await res.json();

        if (res.ok && data.success) {
          toast.success('Category created successfully!');
          setCategories([...categories, data.category]);
          setShowCreateDialog(false);
          setFormData({ category_name: '', description: '' });
        } else {
          toast.error(data.error || 'Failed to create category');
        }
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <DashboardLayout>
        <div className="xheton-page">
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-2xl p-6 flex items-center gap-4">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-200">Error Loading Categories</h3>
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
          title="Categories"
          subtitle={loading ? 'Loading categories...' : `Manage ${categories.length} product categories`}
          actions={[
            <Button
              key="new"
              onClick={() => {
                setEditingCategory(null);
                setFormData({ category_name: '', description: '' });
                setShowCreateDialog(true);
              }}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 gap-2"
            >
              <Plus className="h-4 w-4" />
              New Category
            </Button>
          ]}
        />

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading categories...</p>
            </div>
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-2xl p-12 text-center">
            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">No Categories Yet</h3>
            <p className="text-blue-700 dark:text-blue-300 mb-4">Create your first product category to get started</p>
            <Button
              onClick={() => {
                setEditingCategory(null);
                setFormData({ category_name: '', description: '' });
                setShowCreateDialog(true);
              }}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Category
            </Button>
          </div>
        ) : (
          <DataTable columns={columns} data={categories} />
        )}

        {/* Create/Edit Category Dialog */}
        <Dialog open={showCreateDialog || showEditDialog} onOpenChange={(open) => {
          if (!open) {
            setShowCreateDialog(false);
            setShowEditDialog(false);
            setEditingCategory(null);
            setFormData({ category_name: '', description: '' });
          }
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Category' : 'Create New Category'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  value={formData.category_name}
                  onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                  placeholder="Enter category name (e.g., Electronics, Furniture)"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe this category (optional)"
                  className="mt-2"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowCreateDialog(false);
                  setShowEditDialog(false);
                  setEditingCategory(null);
                  setFormData({ category_name: '', description: '' });
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                className="bg-gradient-to-r from-emerald-600 to-teal-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : (editingCategory ? 'Update Category' : 'Create Category')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
