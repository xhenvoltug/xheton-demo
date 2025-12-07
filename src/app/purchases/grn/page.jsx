'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import FilterBar from '@/components/shared/FilterBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/core/StatusBadge';
import { Plus, Download, Eye, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const mockGRNs = [
  { id: 'GRN-001', linkedPO: 'PO-001', supplier: 'ABC Suppliers Ltd', receivedBy: 'John Kamau', dateReceived: '2025-12-05', status: 'Complete' },
  { id: 'GRN-002', linkedPO: 'PO-002', supplier: 'Tech Distributors', receivedBy: 'Mary Wanjiru', dateReceived: '2025-12-04', status: 'Partial' },
  { id: 'GRN-003', linkedPO: 'PO-003', supplier: 'Global Imports', receivedBy: 'James Ochieng', dateReceived: '2025-12-03', status: 'Complete' },
  { id: 'GRN-004', linkedPO: 'PO-004', supplier: 'Office Supplies Co', receivedBy: 'Sarah Akinyi', dateReceived: '2025-12-02', status: 'Partial' },
  { id: 'GRN-005', linkedPO: 'PO-002', supplier: 'Tech Distributors', receivedBy: 'Peter Mwangi', dateReceived: '2025-12-01', status: 'Returned' }
];

export default function GRNPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredGRNs = mockGRNs.filter(grn => {
    const matchesSearch = grn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grn.linkedPO.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grn.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || grn.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalGRNs = mockGRNs.length;
  const completeGRNs = mockGRNs.filter(g => g.status === 'Complete').length;
  const partialGRNs = mockGRNs.filter(g => g.status === 'Partial').length;
  const returnedGRNs = mockGRNs.filter(g => g.status === 'Returned').length;

  const getStatusVariant = (status) => {
    const map = {
      'Complete': 'success',
      'Partial': 'pending',
      'Returned': 'error'
    };
    return map[status] || 'default';
  };

  const columns = [
    { 
      header: 'GRN Number', 
      accessor: 'id',
      render: (row) => (
        <span 
          className="font-mono text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
          onClick={() => router.push(`/purchases/grn/${row.id}`)}
        >
          {row.id}
        </span>
      )
    },
    { 
      header: 'Linked PO', 
      accessor: 'linkedPO',
      render: (row) => <span className="font-mono text-sm text-gray-600 dark:text-gray-400">{row.linkedPO}</span>
    },
    { 
      header: 'Supplier', 
      accessor: 'supplier',
      render: (row) => <span className="font-semibold text-gray-900 dark:text-white">{row.supplier}</span>
    },
    { header: 'Received By', accessor: 'receivedBy' },
    { header: 'Date Received', accessor: 'dateReceived' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => <StatusBadge variant={getStatusVariant(row.status)}>{row.status}</StatusBadge>
    },
    { 
      header: 'Actions', 
      accessor: 'actions',
      render: (row) => (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => router.push(`/purchases/grn/${row.id}`)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      )
    }
  ];

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Goods Received Notes (GRN)"
          subtitle="Track received inventory from suppliers"
          actions={[
            <Button
              key="export"
              variant="outline"
              className="rounded-2xl"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>,
            <Button
              key="new"
              onClick={() => router.push('/purchases/grn/new')}
              className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              New GRN
            </Button>
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Total GRNs', value: totalGRNs, color: 'from-blue-500 to-cyan-500', icon: Package },
            { label: 'Complete', value: completeGRNs, color: 'from-emerald-500 to-teal-500', icon: Package },
            { label: 'Partial', value: partialGRNs, color: 'from-amber-500 to-orange-500', icon: Package },
            { label: 'Returned', value: returnedGRNs, color: 'from-red-500 to-rose-500', icon: Package }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className={`rounded-3xl shadow-lg border-0 overflow-hidden bg-gradient-to-br ${stat.color} text-white p-6`}>
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="h-8 w-8 opacity-80" />
                </div>
                <div className="text-sm opacity-90 mb-1">{stat.label}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="rounded-3xl shadow-lg border-0">
            <FilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Search by GRN, PO, or supplier..."
              filters={[
                {
                  label: 'Status',
                  value: statusFilter,
                  onChange: setStatusFilter,
                  options: [
                    { value: 'all', label: 'All Status' },
                    { value: 'complete', label: 'Complete' },
                    { value: 'partial', label: 'Partial' },
                    { value: 'returned', label: 'Returned' }
                  ]
                }
              ]}
            />
            <DataTable columns={columns} data={filteredGRNs} />
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
