'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import FilterBar from '@/components/shared/FilterBar';
import DataTable from '@/components/shared/DataTable';
import MobileCard from '@/components/shared/MobileCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const mockCategories = [
  { id: 'CAT-001', name: 'Office Supplies', description: 'Pens, paper, and office materials', totalExpenses: 12450.00, expenseCount: 24, status: 'active' },
  { id: 'CAT-002', name: 'Utilities', description: 'Electricity, water, internet', totalExpenses: 8920.00, expenseCount: 12, status: 'active' },
  { id: 'CAT-003', name: 'Rent', description: 'Office and warehouse rent', totalExpenses: 45000.00, expenseCount: 3, status: 'active' },
  { id: 'CAT-004', name: 'Marketing', description: 'Advertising and promotions', totalExpenses: 18600.00, expenseCount: 15, status: 'active' },
  { id: 'CAT-005', name: 'Salaries', description: 'Employee compensation', totalExpenses: 125000.00, expenseCount: 30, status: 'active' },
  { id: 'CAT-006', name: 'Transportation', description: 'Fuel, vehicle maintenance', totalExpenses: 6750.00, expenseCount: 18, status: 'active' },
];

const statusColors = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
};

export default function ExpenseCategoriesListPage() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const columns = [
    {
      header: 'Category ID',
      accessor: 'id',
      render: (row) => <span className="font-semibold font-mono text-gray-900 dark:text-white">{row.id}</span>,
    },
    {
      header: 'Name',
      accessor: 'name',
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{row.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{row.description}</p>
        </div>
      ),
    },
    {
      header: 'Total Expenses',
      accessor: 'totalExpenses',
      render: (row) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          ${row.totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      header: 'Count',
      accessor: 'expenseCount',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-400">{row.expenseCount} expenses</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <Badge className={`${statusColors[row.status]} capitalize`}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/expenses/categories/${row.id}`)}
            className="hover:bg-amber-50 dark:hover:bg-amber-900/20"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const filters = [
    {
      label: 'Status',
      value: statusFilter,
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
      onChange: setStatusFilter,
    },
  ];

  const filteredData = mockCategories.filter((cat) => {
    const matchesSearch = cat.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                         cat.description.toLowerCase().includes(searchValue.toLowerCase());
    const matchesStatus = statusFilter === 'all' || cat.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateCategory = () => {
    if (!formData.name) {
      toast.error('Please enter category name');
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
          title="Expense Categories"
          subtitle="Organize expenses by category"
          actions={[
            <Button
              key="new"
              onClick={() => setShowDialog(true)}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 gap-2"
            >
              <Plus className="h-4 w-4" />
              New Category
            </Button>
          ]}
        />

        <FilterBar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filters={filters}
          onClearFilters={() => {
            setSearchValue('');
            setStatusFilter('all');
          }}
        />

        {/* Desktop Table */}
        <div className="hidden md:block">
          <DataTable columns={columns} data={filteredData} />
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {filteredData.map((cat) => (
            <MobileCard
              key={cat.id}
              onClick={() => router.push(`/expenses/categories/${cat.id}`)}
              data={[
                { label: 'Category', value: cat.name },
                { label: 'Total', value: `$${cat.totalExpenses.toLocaleString()}` },
                { label: 'Expenses', value: cat.expenseCount },
                { label: 'Status', value: <Badge className={statusColors[cat.status]}>{cat.status}</Badge> },
              ]}
            />
          ))}
        </div>

        {/* Create Category Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
            </DialogHeader>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 py-4"
            >
              <div>
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Office Supplies"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this category"
                  className="mt-2"
                  rows={3}
                />
              </div>
            </motion.div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateCategory}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
              >
                Create Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
