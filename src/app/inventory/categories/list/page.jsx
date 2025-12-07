'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const mockCategories = [
  { id: 'CAT-001', name: 'Electronics', description: 'Electronic devices and components', productCount: 12 },
  { id: 'CAT-002', name: 'Accessories', description: 'Computer and mobile accessories', productCount: 25 },
  { id: 'CAT-003', name: 'Furniture', description: 'Office and home furniture', productCount: 8 },
  { id: 'CAT-004', name: 'Office Supplies', description: 'Stationery and office essentials', productCount: 15 },
];

export default function CategoriesListPage() {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const columns = [
    {
      header: 'Category ID',
      accessor: 'id',
      render: (row) => <span className="font-semibold text-gray-900 dark:text-white">{row.id}</span>,
    },
    {
      header: 'Name',
      accessor: 'name',
      render: (row) => <span className="font-semibold text-gray-900 dark:text-white">{row.name}</span>,
    },
    {
      header: 'Description',
      accessor: 'description',
      render: (row) => <span className="text-gray-600 dark:text-gray-400">{row.description}</span>,
    },
    {
      header: 'Products',
      accessor: 'productCount',
      render: (row) => <span className="text-gray-900 dark:text-white">{row.productCount}</span>,
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const handleSave = () => {
    if (!formData.name) {
      toast.error('Category name is required');
      return;
    }
    toast.success('Category created successfully!');
    setShowDialog(false);
    setFormData({ name: '', description: '' });
  };

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Categories"
          subtitle="Organize products into categories"
          actions={[
            <Button
              key="new"
              onClick={() => setShowDialog(true)}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 gap-2"
            >
              <Plus className="h-4 w-4" />
              New Category
            </Button>
          ]}
        />

        <DataTable columns={columns} data={mockCategories} />

        {/* Create Category Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter category name"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe this category..."
                  className="mt-2"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
              <Button onClick={handleSave} className="bg-gradient-to-r from-emerald-600 to-teal-600">
                Create Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
