'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import FilterBar from '@/components/shared/FilterBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/core/StatusBadge';
import { Plus, Download, Calendar as CalendarIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const mockLeaveRequests = [
  { id: 'LV-001', employee: 'John Kamau', type: 'Annual', startDate: '2025-12-15', endDate: '2025-12-20', days: 6, status: 'pending', appliedOn: '2025-12-01' },
  { id: 'LV-002', employee: 'Mary Wanjiru', type: 'Sick', startDate: '2025-12-10', endDate: '2025-12-12', days: 3, status: 'approved', appliedOn: '2025-12-08' },
  { id: 'LV-003', employee: 'James Ochieng', type: 'Annual', startDate: '2025-12-18', endDate: '2025-12-22', days: 5, status: 'approved', appliedOn: '2025-11-28' },
  { id: 'LV-004', employee: 'Sarah Akinyi', type: 'Maternity', startDate: '2025-12-01', endDate: '2026-03-01', days: 90, status: 'approved', appliedOn: '2025-11-15' },
  { id: 'LV-005', employee: 'Peter Mwangi', type: 'Casual', startDate: '2025-12-09', endDate: '2025-12-09', days: 1, status: 'rejected', appliedOn: '2025-12-07' }
];

export default function LeaveManagementPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredLeave = mockLeaveRequests.filter(leave => {
    const matchesSearch = leave.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leave.employee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || leave.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingRequests = mockLeaveRequests.filter(l => l.status === 'pending').length;
  const approvedRequests = mockLeaveRequests.filter(l => l.status === 'approved').length;
  const totalDaysApproved = mockLeaveRequests.filter(l => l.status === 'approved').reduce((sum, l) => sum + l.days, 0);

  const columns = [
    { header: 'Leave ID', accessor: 'id', render: (row) => <span className="font-mono text-sm">{row.id}</span> },
    { header: 'Employee', accessor: 'employee', render: (row) => <span className="font-semibold">{row.employee}</span> },
    { header: 'Type', accessor: 'type', render: (row) => <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">{row.type}</span> },
    { header: 'Start Date', accessor: 'startDate' },
    { header: 'End Date', accessor: 'endDate' },
    { header: 'Days', accessor: 'days', render: (row) => <span className="font-bold">{row.days}</span> },
    { header: 'Applied On', accessor: 'appliedOn' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => <StatusBadge variant={row.status === 'approved' ? 'success' : row.status === 'pending' ? 'pending' : 'error'}>{row.status}</StatusBadge>
    }
  ];

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Leave Management"
          subtitle="Manage employee leave requests and balances"
          actions={[
            <Button key="policy" variant="outline" className="rounded-2xl">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Leave Policy
            </Button>,
            <Button key="export" variant="outline" className="rounded-2xl">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>,
            <Button key="new" onClick={() => router.push('/hr/leave/new')} className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600">
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Total Requests', value: mockLeaveRequests.length, color: 'from-blue-500 to-cyan-500' },
            { label: 'Pending', value: pendingRequests, color: 'from-amber-500 to-orange-500' },
            { label: 'Approved', value: approvedRequests, color: 'from-emerald-500 to-teal-500' },
            { label: 'Days Approved', value: totalDaysApproved, color: 'from-purple-500 to-pink-500' }
          ].map((stat, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <Card className={`rounded-3xl shadow-lg border-0 overflow-hidden bg-gradient-to-br ${stat.color} text-white p-6`}>
                <div className="text-sm opacity-90 mb-1">{stat.label}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="rounded-3xl shadow-lg border-0">
          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search by ID or employee..."
            filters={[
              {
                label: 'Status',
                value: statusFilter,
                onChange: setStatusFilter,
                options: [
                  { value: 'all', label: 'All Status' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'approved', label: 'Approved' },
                  { value: 'rejected', label: 'Rejected' }
                ]
              }
            ]}
          />
          <DataTable columns={columns} data={filteredLeave} />
        </Card>
      </div>
    </DashboardLayout>
  );
}
