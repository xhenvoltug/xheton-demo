'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import FilterBar from '@/components/shared/FilterBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/core/StatusBadge';
import { Plus, Download, LayoutGrid, List, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const mockEmployees = [
  { id: 'EMP-001', name: 'John Kamau', department: 'IT', role: 'Senior Developer', status: 'active', email: 'john.kamau@company.com', phone: '+254 712 345678' },
  { id: 'EMP-002', name: 'Mary Wanjiru', department: 'Finance', role: 'Accountant', status: 'active', email: 'mary.w@company.com', phone: '+254 722 345678' },
  { id: 'EMP-003', name: 'James Ochieng', department: 'Sales', role: 'Sales Manager', status: 'active', email: 'james.o@company.com', phone: '+254 732 345678' },
  { id: 'EMP-004', name: 'Sarah Akinyi', department: 'HR', role: 'HR Officer', status: 'active', email: 'sarah.a@company.com', phone: '+254 742 345678' },
  { id: 'EMP-005', name: 'Peter Mwangi', department: 'Operations', role: 'Operations Lead', status: 'on-leave', email: 'peter.m@company.com', phone: '+254 752 345678' }
];

export default function EmployeeDirectoryPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredEmployees = mockEmployees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'all' || emp.department.toLowerCase() === departmentFilter;
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const columns = [
    { 
      header: 'Employee ID', 
      accessor: 'id',
      render: (row) => (
        <span 
          className="font-mono text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
          onClick={() => router.push(`/hr/employees/${row.id}`)}
        >
          {row.id}
        </span>
      )
    },
    { header: 'Name', accessor: 'name', render: (row) => <span className="font-semibold">{row.name}</span> },
    { header: 'Department', accessor: 'department' },
    { header: 'Role', accessor: 'role' },
    { header: 'Email', accessor: 'email', render: (row) => <span className="text-sm text-gray-600">{row.email}</span> },
    { header: 'Phone', accessor: 'phone' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => <StatusBadge variant={row.status === 'active' ? 'success' : 'pending'}>{row.status}</StatusBadge>
    }
  ];

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Employee Directory"
          subtitle="Manage all employee records"
          actions={[
            <Button key="import" variant="outline" className="rounded-2xl">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>,
            <Button key="export" variant="outline" className="rounded-2xl">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>,
            <Button key="grid" variant={viewMode === 'grid' ? 'default' : 'outline'} className="rounded-2xl" onClick={() => setViewMode('grid')}>
              <LayoutGrid className="h-4 w-4" />
            </Button>,
            <Button key="table" variant={viewMode === 'table' ? 'default' : 'outline'} className="rounded-2xl" onClick={() => setViewMode('table')}>
              <List className="h-4 w-4" />
            </Button>,
            <Button key="new" onClick={() => router.push('/hr/employees/new')} className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          ]}
        />

        {viewMode === 'table' ? (
          <Card className="rounded-3xl shadow-lg border-0">
            <FilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Search by name or ID..."
              filters={[
                {
                  label: 'Department',
                  value: departmentFilter,
                  onChange: setDepartmentFilter,
                  options: [
                    { value: 'all', label: 'All Departments' },
                    { value: 'it', label: 'IT' },
                    { value: 'finance', label: 'Finance' },
                    { value: 'sales', label: 'Sales' },
                    { value: 'hr', label: 'HR' },
                    { value: 'operations', label: 'Operations' }
                  ]
                },
                {
                  label: 'Status',
                  value: statusFilter,
                  onChange: setStatusFilter,
                  options: [
                    { value: 'all', label: 'All Status' },
                    { value: 'active', label: 'Active' },
                    { value: 'on-leave', label: 'On Leave' }
                  ]
                }
              ]}
            />
            <DataTable columns={columns} data={filteredEmployees} />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((emp, idx) => (
              <motion.div key={emp.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                <Card className="rounded-3xl shadow-lg border-0 p-6 hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => router.push(`/hr/employees/${emp.id}`)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl">
                      {emp.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{emp.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{emp.role}</p>
                      <p className="text-xs text-gray-500 font-mono mt-1">{emp.id}</p>
                      <div className="mt-3">
                        <StatusBadge variant={emp.status === 'active' ? 'success' : 'pending'}>{emp.status}</StatusBadge>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Department</span>
                      <span className="font-semibold">{emp.department}</span>
                    </div>
                    <div className="text-xs text-gray-500">{emp.email}</div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
