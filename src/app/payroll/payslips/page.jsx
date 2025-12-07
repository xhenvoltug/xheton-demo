'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import FilterBar from '@/components/shared/FilterBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Send, FileText, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const mockPayslips = [
  { id: 'PS-DEC-001', employee: 'John Kamau', empId: 'EMP-001', period: 'December 2025', gross: 325000, deductions: 45000, net: 280000, status: 'generated' },
  { id: 'PS-DEC-002', employee: 'Mary Wanjiru', empId: 'EMP-002', period: 'December 2025', gross: 280000, deductions: 38000, net: 242000, status: 'sent' },
  { id: 'PS-DEC-003', employee: 'James Ochieng', empId: 'EMP-003', period: 'December 2025', gross: 365000, deductions: 52000, net: 313000, status: 'sent' },
  { id: 'PS-DEC-004', employee: 'Sarah Akinyi', empId: 'EMP-004', period: 'December 2025', gross: 255000, deductions: 35000, net: 220000, status: 'generated' },
  { id: 'PS-DEC-005', employee: 'Peter Mwangi', empId: 'EMP-005', period: 'December 2025', gross: 310000, deductions: 42000, net: 268000, status: 'generated' }
];

export default function PayslipsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPayslips = mockPayslips.filter(ps => {
    const matchesSearch = ps.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ps.employee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ps.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalGenerated = mockPayslips.length;
  const totalSent = mockPayslips.filter(p => p.status === 'sent').length;

  const columns = [
    { header: 'Payslip ID', accessor: 'id', render: (row) => <span className="font-mono text-sm">{row.id}</span> },
    { header: 'Employee', accessor: 'employee', render: (row) => <span className="font-semibold">{row.employee}</span> },
    { header: 'Emp ID', accessor: 'empId', render: (row) => <span className="font-mono text-xs text-gray-600">{row.empId}</span> },
    { header: 'Period', accessor: 'period' },
    { header: 'Gross', accessor: 'gross', render: (row) => <span>UGX {row.gross.toLocaleString()}</span> },
    { header: 'Deductions', accessor: 'deductions', render: (row) => <span className="text-red-600">UGX {row.deductions.toLocaleString()}</span> },
    { header: 'Net Pay', accessor: 'net', render: (row) => <span className="font-bold text-blue-600">UGX {row.net.toLocaleString()}</span> },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          row.status === 'sent' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {row.status}
        </span>
      )
    },
    { 
      header: 'Actions', 
      accessor: 'actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="rounded-xl">
            <Eye className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" className="rounded-xl">
            <Download className="h-3 w-3" />
          </Button>
          {row.status === 'generated' && (
            <Button size="sm" variant="outline" className="rounded-xl">
              <Send className="h-3 w-3" />
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Payslips"
          subtitle="Generate and send employee payslips"
          actions={[
            <Button key="download-all" variant="outline" className="rounded-2xl">
              <Download className="h-4 w-4 mr-2" />
              Download All
            </Button>,
            <Button key="email-all" className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600">
              <Send className="h-4 w-4 mr-2" />
              Email All
            </Button>
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[
            { label: 'Total Generated', value: totalGenerated, color: 'from-blue-500 to-cyan-500' },
            { label: 'Sent', value: totalSent, color: 'from-emerald-500 to-teal-500' },
            { label: 'Pending', value: totalGenerated - totalSent, color: 'from-amber-500 to-orange-500' }
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
                  { value: 'generated', label: 'Generated' },
                  { value: 'sent', label: 'Sent' }
                ]
              }
            ]}
          />
          <DataTable columns={columns} data={filteredPayslips} />
        </Card>
      </div>
    </DashboardLayout>
  );
}
