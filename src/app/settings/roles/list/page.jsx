'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const mockRoles = [
  { id: 'R001', name: 'Super Admin', description: 'Full system access', usersAssigned: 2, lastUpdated: '2025-12-01' },
  { id: 'R002', name: 'Branch Manager', description: 'Manage branch operations', usersAssigned: 5, lastUpdated: '2025-12-05' },
  { id: 'R003', name: 'Sales Associate', description: 'Sales and customer management', usersAssigned: 12, lastUpdated: '2025-12-03' },
  { id: 'R004', name: 'Inventory Clerk', description: 'Inventory and stock management', usersAssigned: 8, lastUpdated: '2025-12-04' },
  { id: 'R005', name: 'Accountant', description: 'Financial and expense management', usersAssigned: 3, lastUpdated: '2025-12-02' },
];

export default function RolesListPage() {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const handleCreateRole = () => {
    if (!formData.name) {
      toast.error('Role name is required');
      return;
    }
    toast.success('Role created successfully');
    setShowDialog(false);
    setFormData({ name: '', description: '' });
    setTimeout(() => router.push('/settings/roles/new'), 500);
  };

  const columns = [
    { header: 'Role ID', accessor: 'id', sortable: true },
    {
      header: 'Role Name',
      accessor: 'name',
      sortable: true,
      render: (row) => (
        <button
          onClick={() => router.push(`/settings/roles/${row.id}`)}
          className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          {row.name}
        </button>
      )
    },
    { header: 'Description', accessor: 'description' },
    {
      header: 'Users Assigned',
      accessor: 'usersAssigned',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-400" />
          <span>{row.usersAssigned}</span>
        </div>
      )
    },
    { header: 'Last Updated', accessor: 'lastUpdated', sortable: true },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/settings/roles/${row.id}`)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
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
          title="Roles & Permissions"
          subtitle="Manage user roles and access control"
          actions={[
            <Button
              key="matrix"
              variant="outline"
              onClick={() => router.push('/settings/permissions/matrix')}
            >
              Permission Matrix
            </Button>,
            <Button
              key="add"
              onClick={() => setShowDialog(true)}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          ]}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <DataTable columns={columns} data={mockRoles} />
        </motion.div>

        {/* Create Role Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
            </DialogHeader>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 py-4"
            >
              <div>
                <Label htmlFor="roleName">Role Name *</Label>
                <Input
                  id="roleName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Store Manager"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="roleDescription">Description</Label>
                <Input
                  id="roleDescription"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this role"
                  className="mt-1.5"
                />
              </div>
            </motion.div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateRole}
                className="bg-gradient-to-r from-emerald-600 to-teal-600"
              >
                Continue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
