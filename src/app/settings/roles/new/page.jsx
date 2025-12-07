'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import FormCard from '@/components/shared/FormCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, CheckSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const permissionModules = [
  {
    name: 'Sales',
    permissions: [
      { id: 'sales-view', label: 'View Sales' },
      { id: 'sales-create', label: 'Create Sales' },
      { id: 'sales-edit', label: 'Edit Sales' },
      { id: 'sales-delete', label: 'Delete Sales' },
      { id: 'customers-manage', label: 'Manage Customers' },
      { id: 'invoices-manage', label: 'Manage Invoices' }
    ]
  },
  {
    name: 'Inventory',
    permissions: [
      { id: 'inventory-view', label: 'View Inventory' },
      { id: 'inventory-edit', label: 'Edit Inventory' },
      { id: 'products-manage', label: 'Manage Products' },
      { id: 'categories-manage', label: 'Manage Categories' },
      { id: 'adjustments-create', label: 'Create Adjustments' },
      { id: 'transfers-manage', label: 'Manage Transfers' }
    ]
  },
  {
    name: 'Purchases',
    permissions: [
      { id: 'purchases-view', label: 'View Purchases' },
      { id: 'purchases-create', label: 'Create Purchase Orders' },
      { id: 'purchases-approve', label: 'Approve Purchase Orders' },
      { id: 'grn-manage', label: 'Manage GRN' },
      { id: 'suppliers-manage', label: 'Manage Suppliers' }
    ]
  },
  {
    name: 'Warehouse',
    permissions: [
      { id: 'warehouse-view', label: 'View Warehouse' },
      { id: 'locations-manage', label: 'Manage Locations' },
      { id: 'stock-movement', label: 'Manage Stock Movement' },
      { id: 'bins-manage', label: 'Manage Bins' }
    ]
  },
  {
    name: 'Expenses',
    permissions: [
      { id: 'expenses-view', label: 'View Expenses' },
      { id: 'expenses-create', label: 'Create Expenses' },
      { id: 'expenses-approve', label: 'Approve Expenses' },
      { id: 'categories-manage', label: 'Manage Expense Categories' }
    ]
  },
  {
    name: 'Analytics',
    permissions: [
      { id: 'analytics-view', label: 'View Analytics' },
      { id: 'reports-export', label: 'Export Reports' },
      { id: 'forecast-view', label: 'View Forecasts' }
    ]
  },
  {
    name: 'Settings',
    permissions: [
      { id: 'settings-view', label: 'View Settings' },
      { id: 'settings-edit', label: 'Edit Settings' },
      { id: 'users-manage', label: 'Manage Users' },
      { id: 'roles-manage', label: 'Manage Roles' },
      { id: 'branches-manage', label: 'Manage Branches' }
    ]
  }
];

export default function NewRolePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [selectedPermissions, setSelectedPermissions] = useState(new Set());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Please enter a role name');
      return;
    }
    if (selectedPermissions.size === 0) {
      toast.error('Please select at least one permission');
      return;
    }
    toast.success('Role created successfully');
    setTimeout(() => router.push('/settings/roles/list'), 1000);
  };

  const togglePermission = (permissionId) => {
    setSelectedPermissions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(permissionId)) {
        newSet.delete(permissionId);
      } else {
        newSet.add(permissionId);
      }
      return newSet;
    });
  };

  const grantAllPermissions = () => {
    const allPermissions = permissionModules.flatMap(module => 
      module.permissions.map(p => p.id)
    );
    setSelectedPermissions(new Set(allPermissions));
    toast.success('All permissions granted');
  };

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Create New Role"
          subtitle="Define role name and assign permissions"
          actions={[
            <Button
              key="back"
              variant="outline"
              onClick={() => router.push('/settings/roles/list')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          ]}
        />

        <form onSubmit={handleSubmit} className="max-w-5xl space-y-6">
          <FormCard title="Role Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Role Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Store Manager"
                  required
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief role description"
                  className="mt-1.5"
                />
              </div>
            </div>
          </FormCard>

          <FormCard 
            title="Permissions"
            actions={
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={grantAllPermissions}
                className="text-emerald-600 hover:text-emerald-700"
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                Grant All Permissions
              </Button>
            }
          >
            <div className="space-y-6">
              {permissionModules.map((module, index) => (
                <motion.div
                  key={module.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="pb-6 border-b dark:border-gray-700 last:border-0"
                >
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">{module.name}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {module.permissions.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission.id}
                          checked={selectedPermissions.has(permission.id)}
                          onCheckedChange={() => togglePermission(permission.id)}
                        />
                        <label
                          htmlFor={permission.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {permission.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </FormCard>

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {selectedPermissions.size} permission{selectedPermissions.size !== 1 ? 's' : ''} selected
            </p>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => router.push('/settings/roles/list')}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Create Role
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
