'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import FilterBar from '@/components/shared/FilterBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Mail, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const mockUsers = [
  { id: 'U001', name: 'John Kamau', email: 'john@xheton.com', role: 'Super Admin', branch: 'Main Branch', status: 'Active', avatar: null },
  { id: 'U002', name: 'Mary Wanjiru', email: 'mary@xheton.com', role: 'Branch Manager', branch: 'Westlands Branch', status: 'Active', avatar: null },
  { id: 'U003', name: 'James Ochieng', email: 'james@xheton.com', role: 'Branch Manager', branch: 'Mombasa Branch', status: 'Active', avatar: null },
  { id: 'U004', name: 'Sarah Akinyi', email: 'sarah@xheton.com', role: 'Sales Associate', branch: 'Main Branch', status: 'Active', avatar: null },
  { id: 'U005', name: 'David Mutua', email: 'david@xheton.com', role: 'Inventory Clerk', branch: 'Westlands Branch', status: 'Active', avatar: null },
  { id: 'U006', name: 'Grace Njeri', email: 'grace@xheton.com', role: 'Accountant', branch: 'Main Branch', status: 'Active', avatar: null },
  { id: 'U007', name: 'Peter Mwangi', email: 'peter@xheton.com', role: 'Sales Associate', branch: 'Kisumu Branch', status: 'Inactive', avatar: null },
];

export default function UsersListPage() {
  const router = useRouter();
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [inviteData, setInviteData] = useState({
    email: '',
    name: '',
    role: '',
    branch: ''
  });

  const handleInviteUser = () => {
    if (!inviteData.email || !inviteData.name || !inviteData.role || !inviteData.branch) {
      toast.error('Please fill in all fields');
      return;
    }
    toast.success('Invitation sent successfully');
    setShowInviteDialog(false);
    setInviteData({ email: '', name: '', role: '', branch: '' });
  };

  const columns = [
    {
      header: 'User',
      accessor: 'user',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={row.avatar} />
            <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium">
              {row.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{row.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{row.email}</p>
          </div>
        </div>
      )
    },
    { header: 'Role', accessor: 'role', sortable: true },
    { header: 'Branch', accessor: 'branch', sortable: true },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <Badge className={
          row.status === 'Active'
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
        }>
          {row.status}
        </Badge>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
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

  const filteredData = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesBranch = branchFilter === 'all' || user.branch === branchFilter;
    const matchesStatus = statusFilter === 'all' || user.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesRole && matchesBranch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Users Management"
          subtitle="Manage user accounts and access"
          actions={[
            <Button
              key="invite"
              onClick={() => setShowInviteDialog(true)}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Invite User
            </Button>
          ]}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FilterBar
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search users..."
            filters={[
              {
                label: 'Role',
                value: roleFilter,
                onChange: setRoleFilter,
                options: [
                  { label: 'All Roles', value: 'all' },
                  { label: 'Super Admin', value: 'Super Admin' },
                  { label: 'Branch Manager', value: 'Branch Manager' },
                  { label: 'Sales Associate', value: 'Sales Associate' },
                  { label: 'Inventory Clerk', value: 'Inventory Clerk' },
                  { label: 'Accountant', value: 'Accountant' }
                ]
              },
              {
                label: 'Branch',
                value: branchFilter,
                onChange: setBranchFilter,
                options: [
                  { label: 'All Branches', value: 'all' },
                  { label: 'Main Branch', value: 'Main Branch' },
                  { label: 'Westlands Branch', value: 'Westlands Branch' },
                  { label: 'Mombasa Branch', value: 'Mombasa Branch' },
                  { label: 'Kisumu Branch', value: 'Kisumu Branch' }
                ]
              },
              {
                label: 'Status',
                value: statusFilter,
                onChange: setStatusFilter,
                options: [
                  { label: 'All Statuses', value: 'all' },
                  { label: 'Active', value: 'active' },
                  { label: 'Inactive', value: 'inactive' }
                ]
              }
            ]}
          />

          <DataTable columns={columns} data={filteredData} />
        </motion.div>

        {/* Invite User Dialog */}
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite New User</DialogTitle>
            </DialogHeader>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 py-4"
            >
              <div>
                <Label htmlFor="inviteName">Full Name *</Label>
                <Input
                  id="inviteName"
                  value={inviteData.name}
                  onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })}
                  placeholder="John Doe"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="inviteEmail">Email Address *</Label>
                <Input
                  id="inviteEmail"
                  type="email"
                  value={inviteData.email}
                  onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                  placeholder="user@company.com"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="inviteRole">Role *</Label>
                <Select value={inviteData.role} onValueChange={(value) => setInviteData({ ...inviteData, role: value })}>
                  <SelectTrigger id="inviteRole" className="mt-1.5">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="branch-manager">Branch Manager</SelectItem>
                    <SelectItem value="sales-associate">Sales Associate</SelectItem>
                    <SelectItem value="inventory-clerk">Inventory Clerk</SelectItem>
                    <SelectItem value="accountant">Accountant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="inviteBranch">Branch *</Label>
                <Select value={inviteData.branch} onValueChange={(value) => setInviteData({ ...inviteData, branch: value })}>
                  <SelectTrigger id="inviteBranch" className="mt-1.5">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main Branch</SelectItem>
                    <SelectItem value="westlands">Westlands Branch</SelectItem>
                    <SelectItem value="mombasa">Mombasa Branch</SelectItem>
                    <SelectItem value="kisumu">Kisumu Branch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleInviteUser}
                className="bg-gradient-to-r from-emerald-600 to-teal-600"
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
