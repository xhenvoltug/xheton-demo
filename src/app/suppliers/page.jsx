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
import { Plus, Download, Eye, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const mockSuppliers = [
  { id: 'S001', name: 'ABC Suppliers Ltd', contact: 'James Mwangi', phone: '+254 711 222 333', email: 'james@abc.com', products: 'Electronics, Appliances', totalPurchases: 2400000, outstanding: 125000, status: 'Active' },
  { id: 'S002', name: 'Tech Distributors', contact: 'Mary Wanjiru', phone: '+254 722 333 444', email: 'mary@tech.com', products: 'Computers, Accessories', totalPurchases: 1850000, outstanding: 0, status: 'Active' },
  { id: 'S003', name: 'Global Imports', contact: 'Peter Ochieng', phone: '+254 733 444 555', email: 'peter@global.com', products: 'Furniture, Office Supplies', totalPurchases: 980000, outstanding: 45000, status: 'Active' },
  { id: 'S004', name: 'Local Crafts Co', contact: 'Sarah Akinyi', phone: '+254 744 555 666', email: 'sarah@crafts.com', products: 'Handmade Items', totalPurchases: 450000, outstanding: 0, status: 'Inactive' },
];

export default function SuppliersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const columns = [
    { 
      header: 'Supplier ID',
      accessor: 'id',
      render: (row) => (
        <button
          onClick={() => router.push(`/suppliers/${row.id}`)}
          className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          {row.id}
        </button>
      )
    },
    { 
      header: 'Supplier Name',
      accessor: 'name',
      render: (row) => (
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{row.name}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">{row.contact}</div>
        </div>
      )
    },
    { 
      header: 'Contact',
      accessor: 'phone',
      render: (row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-3 w-3 text-gray-400" />
            {row.phone}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-3 w-3 text-gray-400" />
            {row.email}
          </div>
        </div>
      )
    },
    { header: 'Products Supplied', accessor: 'products' },
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
      header: 'Outstanding Payables',
      accessor: 'outstanding',
      render: (row) => (
        <span className={row.outstanding > 0 ? 'font-semibold text-red-600' : 'text-gray-600'}>
          UGX {row.outstanding.toLocaleString()}
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
        <Button
          onClick={() => router.push(`/suppliers/${row.id}`)}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <Eye className="h-4 w-4" />
        </Button>
      )
    }
  ];

  const filteredData = mockSuppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || supplier.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Suppliers"
          subtitle="Manage your supplier relationships and purchase history"
          badge={<Badge variant="secondary">{mockSuppliers.length} Total</Badge>}
          actions={[
            <Button
              key="export"
              onClick={() => alert('Exporting suppliers...')}
              variant="outline"
              className="rounded-2xl"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>,
            <Button
              key="add"
              onClick={() => router.push('/suppliers/new')}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-2xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Supplier
            </Button>
          ]}
        />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Total Suppliers', value: mockSuppliers.length, color: 'from-blue-500 to-cyan-500' },
            { label: 'Active', value: mockSuppliers.filter(s => s.status === 'Active').length, color: 'from-emerald-500 to-teal-500' },
            { label: 'Total Payables', value: `UGX ${mockSuppliers.reduce((sum, s) => sum + s.outstanding, 0).toLocaleString()}`, color: 'from-red-500 to-rose-500' },
            { label: 'Total Purchased', value: `UGX ${mockSuppliers.reduce((sum, s) => sum + s.totalPurchases, 0).toLocaleString()}`, color: 'from-purple-500 to-pink-500' }
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
            searchPlaceholder="Search by name, contact, or phone..."
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
