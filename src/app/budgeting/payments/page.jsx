'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import FilterBar from '@/components/shared/FilterBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/core/StatusBadge';
import { Plus, Download, CheckCircle, X, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const mockPaymentRequests = [
  { id: 'PAY-REQ-001', supplier: 'ABC Suppliers Ltd', amount: 250000, invoiceNo: 'INV-S001', requestDate: '2025-12-05', dueDate: '2025-12-20', status: 'pending', attachments: 2 },
  { id: 'PAY-REQ-002', supplier: 'Tech Distributors', amount: 185000, invoiceNo: 'INV-S002', requestDate: '2025-12-04', dueDate: '2025-12-15', status: 'approved', attachments: 1 },
  { id: 'PAY-REQ-003', supplier: 'Global Imports', amount: 145000, invoiceNo: 'INV-S003', requestDate: '2025-12-03', dueDate: '2025-12-10', status: 'paid', attachments: 3 },
  { id: 'PAY-REQ-004', supplier: 'Office Supplies Co', amount: 85000, invoiceNo: 'INV-S004', requestDate: '2025-12-02', dueDate: '2025-11-30', status: 'pending', attachments: 1 },
  { id: 'PAY-REQ-005', supplier: 'Kenya Hardware', amount: 120000, invoiceNo: 'INV-S005', requestDate: '2025-12-01', dueDate: '2025-12-25', status: 'approved', attachments: 2 }
];

export default function SupplierPaymentRequestsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredRequests = mockPaymentRequests.filter(req => {
    const matchesSearch = req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAmount = mockPaymentRequests.reduce((sum, r) => sum + r.amount, 0);
  const pendingRequests = mockPaymentRequests.filter(r => r.status === 'pending').length;
  const approvedRequests = mockPaymentRequests.filter(r => r.status === 'approved').length;
  const paidRequests = mockPaymentRequests.filter(r => r.status === 'paid').length;

  const columns = [
    { header: 'Request ID', accessor: 'id', render: (row) => <span className="font-mono text-sm">{row.id}</span> },
    { header: 'Supplier', accessor: 'supplier', render: (row) => <span className="font-semibold">{row.supplier}</span> },
    { header: 'Invoice No', accessor: 'invoiceNo', render: (row) => <span className="font-mono text-sm text-gray-600">{row.invoiceNo}</span> },
    { 
      header: 'Amount', 
      accessor: 'amount',
      render: (row) => <span className="font-bold text-blue-600">UGX {row.amount.toLocaleString()}</span>
    },
    { header: 'Request Date', accessor: 'requestDate' },
    { header: 'Due Date', accessor: 'dueDate' },
    { 
      header: 'Attachments', 
      accessor: 'attachments',
      render: (row) => (
        <div className="flex items-center gap-1">
          <FileText className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{row.attachments}</span>
        </div>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => {
        const variants = { pending: 'pending', approved: 'info', paid: 'success' };
        return <StatusBadge variant={variants[row.status]}>{row.status}</StatusBadge>;
      }
    },
    { 
      header: 'Actions', 
      accessor: 'actions',
      render: (row) => row.status === 'pending' ? (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="rounded-xl">
            <CheckCircle className="h-3 w-3 text-emerald-600" />
          </Button>
          <Button size="sm" variant="outline" className="rounded-xl">
            <X className="h-3 w-3 text-red-600" />
          </Button>
        </div>
      ) : row.status === 'approved' ? (
        <Button size="sm" className="rounded-xl bg-blue-600">Process</Button>
      ) : (
        <span className="text-xs text-gray-400">Completed</span>
      )
    }
  ];

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Supplier Payment Requests"
          subtitle="Manage and approve supplier payment requests"
          actions={[
            <Button key="export" variant="outline" className="rounded-2xl">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>,
            <Button key="new" onClick={() => router.push('/budgeting/payments/new')} className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600">
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Total Amount', value: `UGX ${(totalAmount / 1000000).toFixed(1)}M`, color: 'from-blue-500 to-cyan-500' },
            { label: 'Pending', value: pendingRequests, color: 'from-amber-500 to-orange-500' },
            { label: 'Approved', value: approvedRequests, color: 'from-purple-500 to-pink-500' },
            { label: 'Paid', value: paidRequests, color: 'from-emerald-500 to-teal-500' }
          ].map((stat, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <Card className={`rounded-3xl shadow-lg border-0 overflow-hidden bg-gradient-to-br ${stat.color} text-white p-6`}>
                <div className="text-sm opacity-90 mb-1">{stat.label}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="rounded-3xl shadow-lg border-0 mb-6 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
          <h3 className="text-lg font-semibold mb-2">Payment Approval Workflow</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-semibold text-sm">1</div>
              <span className="text-sm">Request Created</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-sm">2</div>
              <span className="text-sm">Pending Approval</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-semibold text-sm">3</div>
              <span className="text-sm">Approved</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-semibold text-sm">4</div>
              <span className="text-sm">Paid</span>
            </div>
          </div>
        </Card>

        <Card className="rounded-3xl shadow-lg border-0">
          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search by ID or supplier..."
            filters={[
              {
                label: 'Status',
                value: statusFilter,
                onChange: setStatusFilter,
                options: [
                  { value: 'all', label: 'All Status' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'approved', label: 'Approved' },
                  { value: 'paid', label: 'Paid' }
                ]
              }
            ]}
          />
          <DataTable columns={columns} data={filteredRequests} />
        </Card>
      </div>
    </DashboardLayout>
  );
}
