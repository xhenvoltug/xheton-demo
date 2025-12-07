'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import FilterBar from '@/components/shared/FilterBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import StatusBadge from '@/components/core/StatusBadge';
import { Plus, Edit, Trash2, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const mockCategories = [
  { id: 1, name: 'Salaries & Wages', description: 'Employee compensation', monthlyBudget: 250000, spent: 230000, color: 'blue' },
  { id: 2, name: 'Rent & Utilities', description: 'Office space, electricity, water', monthlyBudget: 85000, spent: 85000, color: 'purple' },
  { id: 3, name: 'Transport & Fuel', description: 'Vehicle costs, fuel, logistics', monthlyBudget: 45000, spent: 38000, color: 'green' },
  { id: 4, name: 'Office Supplies', description: 'Stationery, printing, etc.', monthlyBudget: 15000, spent: 12000, color: 'amber' },
  { id: 5, name: 'Marketing & Advertising', description: 'Promotions, ads, campaigns', monthlyBudget: 30000, spent: 22000, color: 'pink' },
  { id: 6, name: 'Maintenance & Repairs', description: 'Equipment, building repairs', monthlyBudget: 20000, spent: 15000, color: 'red' }
];

export default function ExpenseCategoriesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', monthlyBudget: '' });

  const filteredCategories = mockCategories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalBudget = mockCategories.reduce((sum, cat) => sum + cat.monthlyBudget, 0);
  const totalSpent = mockCategories.reduce((sum, cat) => sum + cat.spent, 0);

  const columns = [
    { 
      header: 'Category', 
      accessor: 'name',
      render: (row) => (
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{row.name}</div>
          <div className="text-sm text-gray-500">{row.description}</div>
        </div>
      )
    },
    { 
      header: 'Monthly Budget', 
      accessor: 'monthlyBudget',
      render: (row) => <span className="font-semibold">UGX {row.monthlyBudget.toLocaleString()}</span>
    },
    { 
      header: 'Spent This Month', 
      accessor: 'spent',
      render: (row) => <span className="font-semibold">UGX {row.spent.toLocaleString()}</span>
    },
    { 
      header: 'Remaining', 
      accessor: 'remaining',
      render: (row) => {
        const remaining = row.monthlyBudget - row.spent;
        return (
          <span className={remaining >= 0 ? 'text-emerald-600 font-semibold' : 'text-red-600 font-semibold'}>
            UGX {remaining.toLocaleString()}
          </span>
        );
      }
    },
    { 
      header: 'Usage', 
      accessor: 'usage',
      render: (row) => {
        const percentage = ((row.spent / row.monthlyBudget) * 100).toFixed(0);
        const isOverBudget = percentage > 100;
        return (
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full ${isOverBudget ? 'bg-red-600' : 'bg-emerald-600'}`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
            <span className={`text-sm font-semibold ${isOverBudget ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'}`}>
              {percentage}%
            </span>
          </div>
        );
      }
    },
    { 
      header: 'Actions', 
      accessor: 'actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Expense Categories"
          subtitle="Manage expense categories and budgets"
          actions={[
            <Button
              key="add"
              onClick={() => setIsAddingNew(true)}
              className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>,
            <Button
              key="view-expenses"
              onClick={() => router.push('/expenses')}
              variant="outline"
              className="rounded-2xl"
            >
              View All Expenses
            </Button>
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[
            { label: 'Total Monthly Budget', value: `UGX ${totalBudget.toLocaleString()}`, color: 'from-blue-500 to-cyan-500' },
            { label: 'Total Spent', value: `UGX ${totalSpent.toLocaleString()}`, color: 'from-purple-500 to-pink-500' },
            { label: 'Remaining Budget', value: `UGX ${(totalBudget - totalSpent).toLocaleString()}`, color: 'from-emerald-500 to-teal-500' }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className={`rounded-3xl shadow-lg border-0 overflow-hidden bg-gradient-to-br ${stat.color} text-white p-6`}>
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="h-8 w-8 opacity-80" />
                </div>
                <div className="text-sm opacity-90 mb-1">{stat.label}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {isAddingNew && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="rounded-3xl shadow-lg border-0 p-6">
              <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Category Name</Label>
                  <Input
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="e.g. Office Supplies"
                    className="rounded-2xl"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    placeholder="Brief description"
                    className="rounded-2xl"
                  />
                </div>
                <div>
                  <Label>Monthly Budget</Label>
                  <Input
                    value={newCategory.monthlyBudget}
                    onChange={(e) => setNewCategory({ ...newCategory, monthlyBudget: e.target.value })}
                    placeholder="0.00"
                    type="number"
                    className="rounded-2xl"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <Button
                  onClick={() => {
                    alert('Category added!');
                    setIsAddingNew(false);
                    setNewCategory({ name: '', description: '', monthlyBudget: '' });
                  }}
                  className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600"
                >
                  Save Category
                </Button>
                <Button
                  onClick={() => setIsAddingNew(false)}
                  variant="outline"
                  className="rounded-2xl"
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="rounded-3xl shadow-lg border-0">
            <FilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Search categories..."
            />
            <DataTable columns={columns} data={filteredCategories} />
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
