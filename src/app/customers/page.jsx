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
import { Plus, Download, Trash2, Eye, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch('/api/sales/customers');
        const data = await res.json();
        if (data.success) {
          setCustomers(data.customers);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const columns = [
    { 
      header: 'Customer ID',
      accessor: 'id',
      render: (row) => (
        <button
          onClick={() => router.push(`/customers/${row.id}`)}
          className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          {row.customer_code || row.id}
        </button>
      )
    },
    { 
      header: 'Name',
      accessor: 'customer_name',
      render: (row) => (
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{row.customer_name}</div>
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
          <span className="text-sm">{row.email || '-'}</span>
        </div>
      )
    },
    { header: 'Address', accessor: 'address', render: (row) => row.address || row.city || '-' },
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

  const filteredData = customers.filter(customer => {
    const matchesSearch = (customer.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (customer.phone || '').includes(searchTerm) ||
                         (customer.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? customer.is_active : !customer.is_active);
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    alert('Exporting customers to CSV...');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="xheton-page">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading customers...</p>
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
            <p className="text-red-600 dark:text-red-400">Error loading customers: {error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Customers"
          subtitle="Manage your customer database and relationships"
          badge={<Badge variant="secondary">{customers.length} Total</Badge>}
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
            { label: 'Total Customers', value: customers.length, color: 'from-blue-500 to-cyan-500' },
            { label: 'Active', value: customers.filter(c => c.is_active).length, color: 'from-emerald-500 to-teal-500' },
            { label: 'Inactive', value: customers.filter(c => !c.is_active).length, color: 'from-amber-500 to-orange-500' },
            { label: 'Total Count', value: customers.length > 0 ? (customers.length).toLocaleString() : '0', color: 'from-purple-500 to-pink-500' }
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
