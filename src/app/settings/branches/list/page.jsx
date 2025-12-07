'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import FilterBar from '@/components/shared/FilterBar';
import MobileCard from '@/components/shared/MobileCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, User, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const mockBranches = [
  { id: 'B001', name: 'Main Branch', location: 'Nairobi CBD', contact: '+254 700 111 222', manager: 'John Kamau', status: 'Active', sales: 'UGX 2.4M', inventory: 'UGX 890K', expenses: 'UGX 145K' },
  { id: 'B002', name: 'Westlands Branch', location: 'Westlands, Nairobi', contact: '+254 700 333 444', manager: 'Mary Wanjiru', status: 'Active', sales: 'UGX 1.8M', inventory: 'UGX 650K', expenses: 'UGX 98K' },
  { id: 'B003', name: 'Mombasa Branch', location: 'Mombasa Road', contact: '+254 700 555 666', manager: 'James Ochieng', status: 'Active', sales: 'UGX 1.2M', inventory: 'UGX 420K', expenses: 'UGX 76K' },
  { id: 'B004', name: 'Kisumu Branch', location: 'Kisumu Town', contact: '+254 700 777 888', manager: 'Sarah Akinyi', status: 'Inactive', sales: 'UGX 890K', inventory: 'UGX 310K', expenses: 'UGX 52K' },
];

export default function BranchesListPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const columns = [
    { header: 'ID', accessor: 'id', sortable: true },
    { 
      header: 'Branch Name',
      accessor: 'name', 
      sortable: true,
      render: (row) => (
        <button
          onClick={() => router.push(`/settings/branches/${row.id}`)}
          className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          {row.name}
        </button>
      )
    },
    { 
      header: 'Location',
      accessor: 'location',
      render: (row) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span>{row.location}</span>
        </div>
      )
    },
    { 
      header: 'Contact',
      accessor: 'contact',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-400" />
          <span>{row.contact}</span>
        </div>
      )
    },
    { 
      header: 'Manager',
      accessor: 'manager',
      render: (row) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-400" />
          <span>{row.manager}</span>
        </div>
      )
    },
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
            onClick={() => router.push(`/settings/branches/${row.id}`)}
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

  const filteredData = mockBranches?.filter(branch => {
    const matchesSearch = branch.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         branch.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || branch.status?.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Branches"
          subtitle="Manage your business locations and branch offices"
          actions={[
            <Button
              key="add"
              onClick={() => router.push('/settings/branches/new')}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Branch
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
            filters={[
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

          {/* Desktop Table */}
          <div className="hidden md:block">
            <DataTable columns={columns} data={filteredData || []} />
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filteredData && filteredData.map((branch) => (
              <MobileCard
                key={branch.id}
                title={branch.name}
                subtitle={branch.location}
                badge={
                  <Badge className={
                    branch.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-700'
                  }>
                    {branch.status}
                  </Badge>
                }
                fields={[
                  { label: 'ID', value: branch.id },
                  { label: 'Manager', value: branch.manager },
                  { label: 'Contact', value: branch.contact }
                ]}
                onView={() => router.push(`/settings/branches/${branch.id}`)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
