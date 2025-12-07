'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import FilterBar from '@/components/shared/FilterBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StatusBadge from '@/components/core/StatusBadge';
import { Plus, Download, Trash2, Eye, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const mockCustomers = [
  { id: 'C001', name: 'John Kamau', phone: '+254 700 111 222', email: 'john@example.com', address: 'Nairobi CBD', creditBalance: 15000, totalPurchases: 450000, status: 'Active', type: 'Frequent' },
  { id: 'C002', name: 'Mary Wanjiru', phone: '+254 700 333 444', email: 'mary@example.com', address: 'Westlands', creditBalance: 0, totalPurchases: 280000, status: 'Active', type: 'Regular' },
  { id: 'C003', name: 'James Ochieng', phone: '+254 700 555 666', email: 'james@example.com', address: 'Mombasa', creditBalance: 45000, totalPurchases: 890000, status: 'Active', type: 'Debtor' },
  { id: 'C004', name: 'Sarah Akinyi', phone: '+254 700 777 888', email: 'sarah@example.com', address: 'Kisumu', creditBalance: 8000, totalPurchases: 120000, status: 'Inactive', type: 'Regular' },
  { id: 'C005', name: 'Peter Mwangi', phone: '+254 700 999 000', email: 'peter@example.com', address: 'Nakuru', creditBalance: 0, totalPurchases: 650000, status: 'Active', type: 'Frequent' },
];

export default function CustomersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const columns = [
    { 
      header: 'Customer ID',
      accessor: 'id',
      render: (row) => (
        <button
          onClick={() => router.push(`/customers/${row.id}`)}
          className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          {row.id}
        </button>
      )
    },
    { 
      header: 'Name',
      accessor: 'name',
      render: (row) => (
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{row.name}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
            <Phone className="h-3 w-3" />
            {row.phone}
          </div>
        </div>
      )
    },
    { 
      header: 'Email',
      accessor: 'email',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{row.email}</span>
        </div>
      )
    },
    { header: 'Address', accessor: 'address' },
    { 
      header: 'Credit Balance',
      accessor: 'creditBalance',
      render: (row) => (
        <span className={row.creditBalance > 0 ? 'font-semibold text-red-600' : 'text-gray-600'}>
          UGX {row.creditBalance.toLocaleString()}
        </span>
      )
    },
    { 
      header: 'Total Purchases',
      accessor: 'totalPurchases',
      render: (row) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          UGX {row.totalPurchases.toLocaleString()}
        </span>
      )
    },
    { 
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <StatusBadge variant={row.status === 'Active' ? 'success' : 'default'}>
          {row.status}
        </StatusBadge>
      )
    },
    { 
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => router.push(`/customers/${row.id}`)}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const filteredData = mockCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status.toLowerCase() === statusFilter;
    const matchesType = typeFilter === 'all' || customer.type.toLowerCase() === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleExportCSV = () => {
    alert('Exporting customers to CSV...');
  };

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Customers"
          subtitle="Manage your customer database and relationships"
          badge={<Badge variant="secondary">{mockCustomers.length} Total</Badge>}
          actions={[
            <Button
              key="export"
              onClick={handleExportCSV}
              variant="outline"
              className="rounded-2xl"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>,
            <Button
              key="add"
              onClick={() => router.push('/customers/new')}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-2xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          ]}
        />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Total Customers', value: mockCustomers.length, color: 'from-blue-500 to-cyan-500' },
            { label: 'Active', value: mockCustomers.filter(c => c.status === 'Active').length, color: 'from-emerald-500 to-teal-500' },
            { label: 'Debtors', value: mockCustomers.filter(c => c.creditBalance > 0).length, color: 'from-amber-500 to-orange-500' },
            { label: 'Total Credit', value: `UGX ${mockCustomers.reduce((sum, c) => sum + c.creditBalance, 0).toLocaleString()}`, color: 'from-red-500 to-rose-500' }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-6 rounded-3xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}
            >
              <div className="text-sm opacity-90 mb-1">{stat.label}</div>
              <div className="text-3xl font-bold">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FilterBar
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search by name, phone, or email..."
            filters={[
              {
                label: 'Status',
                value: statusFilter,
                onChange: setStatusFilter,
                options: [
                  { label: 'All Status', value: 'all' },
                  { label: 'Active', value: 'active' },
                  { label: 'Inactive', value: 'inactive' }
                ]
              },
              {
                label: 'Type',
                value: typeFilter,
                onChange: setTypeFilter,
                options: [
                  { label: 'All Types', value: 'all' },
                  { label: 'Frequent Buyers', value: 'frequent' },
                  { label: 'Debtors', value: 'debtor' },
                  { label: 'Regular', value: 'regular' }
                ]
              }
            ]}
          />

          <div className="mt-6">
            <DataTable columns={columns} data={filteredData} />
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
