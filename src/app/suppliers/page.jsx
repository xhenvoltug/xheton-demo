'use client';

import { useState, useEffect } from 'react';
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

export default function SuppliersPage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await fetch('/api/purchases/suppliers/list');
        const data = await res.json();
        if (data.success) {
          setSuppliers(data.suppliers);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  const columns = [
    { 
      header: 'Supplier ID',
      accessor: 'id',
      render: (row) => (
        <button
          onClick={() => router.push(`/suppliers/${row.id}`)}
          className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          {row.supplier_code || row.id}
        </button>
      )
    },
    { 
      header: 'Supplier Name',
      accessor: 'supplier_name',
      render: (row) => (
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{row.supplier_name}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">{row.contact_person || ''}</div>
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
    { header: 'Payment Terms', accessor: 'payment_terms', render: (row) => `${row.payment_terms || 0} days` },
    { 
      header: 'Credit Limit',
      accessor: 'credit_limit',
      render: (row) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          UGX {(row.credit_limit || 0).toLocaleString()}
        </span>
      )
    },
    { 
      header: 'Status',
      accessor: 'is_active',
      render: (row) => (
        <StatusBadge variant={row.is_active ? 'success' : 'default'}>
          {row.is_active ? 'Active' : 'Inactive'}
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

  const filteredData = suppliers.filter(supplier => {
    const matchesSearch = (supplier.supplier_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (supplier.supplier_code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (supplier.phone || '').includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? supplier.is_active : !supplier.is_active);
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="xheton-page">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading suppliers...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="xheton-page">
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-2xl p-6">
            <p className="text-red-600 dark:text-red-400">Error loading suppliers: {error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Suppliers"
          subtitle="Manage your supplier relationships and purchase history"
          badge={<Badge variant="secondary">{suppliers.length} Total</Badge>}
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
            { label: 'Total Suppliers', value: suppliers.length, color: 'from-blue-500 to-cyan-500' },
            { label: 'Active', value: suppliers.filter(s => s.is_active).length, color: 'from-emerald-500 to-teal-500' },
            { label: 'Payment Terms (Avg)', value: suppliers.length > 0 ? Math.round(suppliers.reduce((sum, s) => sum + (s.payment_terms || 0), 0) / suppliers.length) + ' days' : '0 days', color: 'from-orange-500 to-amber-500' },
            { label: 'Total Credit Limit', value: `UGX ${suppliers.reduce((sum, s) => sum + (s.credit_limit || 0), 0).toLocaleString()}`, color: 'from-purple-500 to-pink-500' }
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
