'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import FilterBar from '@/components/shared/FilterBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/core/StatusBadge';
import { UserCheck, AlertTriangle, TrendingDown, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const mockCustomers = [
  { id: 'C001', name: 'John Kamau', phone: '+254 711 111 222', creditLimit: 100000, currentCredit: 15000, utilization: 15, lastPayment: '2025-12-06', status: 'Good' },
  { id: 'C002', name: 'James Ochieng', phone: '+254 722 333 444', creditLimit: 150000, currentCredit: 45000, utilization: 30, lastPayment: '2025-12-02', status: 'Warning' },
  { id: 'C003', name: 'Sarah Akinyi', phone: '+254 733 555 666', creditLimit: 80000, currentCredit: 72000, utilization: 90, lastPayment: '2025-11-15', status: 'Critical' },
  { id: 'C004', name: 'Peter Mwangi', phone: '+254 744 777 888', creditLimit: 120000, currentCredit: 0, utilization: 0, lastPayment: '2025-12-05', status: 'Excellent' },
  { id: 'C005', name: 'Mary Wanjiru', phone: '+254 755 999 000', creditLimit: 90000, currentCredit: 5000, utilization: 6, lastPayment: '2025-12-04', status: 'Good' }
];

export default function CustomerCreditPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm) ||
                         customer.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCreditLimit = mockCustomers.reduce((sum, c) => sum + c.creditLimit, 0);
  const totalOutstanding = mockCustomers.reduce((sum, c) => sum + c.currentCredit, 0);
  const totalAvailable = totalCreditLimit - totalOutstanding;
  const criticalCustomers = mockCustomers.filter(c => c.status === 'Critical').length;

  const columns = [
    { 
      header: 'Customer', 
      accessor: 'name',
      render: (row) => (
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{row.name}</div>
          <div className="text-sm text-gray-500">{row.id} • {row.phone}</div>
        </div>
      )
    },
    { 
      header: 'Credit Limit', 
      accessor: 'creditLimit',
      render: (row) => <span className="font-semibold">UGX {row.creditLimit.toLocaleString()}</span>
    },
    { 
      header: 'Current Credit', 
      accessor: 'currentCredit',
      render: (row) => (
        <span className={`font-bold ${row.currentCredit > 0 ? 'text-red-600' : 'text-gray-500'}`}>
          UGX {row.currentCredit.toLocaleString()}
        </span>
      )
    },
    { 
      header: 'Available Credit', 
      accessor: 'available',
      render: (row) => {
        const available = row.creditLimit - row.currentCredit;
        return <span className="font-semibold text-emerald-600">UGX {available.toLocaleString()}</span>;
      }
    },
    { 
      header: 'Utilization', 
      accessor: 'utilization',
      render: (row) => {
        let color = 'text-emerald-600';
        if (row.utilization >= 75) color = 'text-red-600';
        else if (row.utilization >= 50) color = 'text-amber-600';
        
        return (
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-full rounded-full ${
                  row.utilization >= 75 ? 'bg-red-600' : 
                  row.utilization >= 50 ? 'bg-amber-600' : 
                  'bg-emerald-600'
                }`}
                style={{ width: `${row.utilization}%` }}
              />
            </div>
            <span className={`text-sm font-semibold ${color}`}>{row.utilization}%</span>
          </div>
        );
      }
    },
    { 
      header: 'Last Payment', 
      accessor: 'lastPayment'
    },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => {
        const variantMap = {
          'Excellent': 'success',
          'Good': 'success',
          'Warning': 'pending',
          'Critical': 'error'
        };
        return <StatusBadge variant={variantMap[row.status]}>{row.status}</StatusBadge>;
      }
    },
    { 
      header: 'Actions', 
      accessor: 'actions',
      render: (row) => (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => router.push(`/customers/${row.id}`)}
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
          title="Customer Credit Control"
          subtitle="Monitor and manage customer credit limits and utilization"
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Total Credit Limit', value: `UGX ${totalCreditLimit.toLocaleString()}`, icon: UserCheck, color: 'from-blue-500 to-cyan-500' },
            { label: 'Total Outstanding', value: `UGX ${totalOutstanding.toLocaleString()}`, icon: TrendingDown, color: 'from-red-500 to-rose-500' },
            { label: 'Available Credit', value: `UGX ${totalAvailable.toLocaleString()}`, icon: UserCheck, color: 'from-emerald-500 to-teal-500' },
            { label: 'Critical Accounts', value: criticalCustomers, icon: AlertTriangle, color: 'from-amber-500 to-orange-500' }
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
              searchPlaceholder="Search by name, ID, or phone..."
              filters={[
                {
                  label: 'Status',
                  value: statusFilter,
                  onChange: setStatusFilter,
                  options: [
                    { value: 'all', label: 'All Status' },
                    { value: 'excellent', label: 'Excellent' },
                    { value: 'good', label: 'Good' },
                    { value: 'warning', label: 'Warning' },
                    { value: 'critical', label: 'Critical' }
                  ]
                }
              ]}
            />
            <DataTable columns={columns} data={filteredCustomers} />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <Card className="rounded-3xl shadow-lg border-0">
            <CardHeader>
              <CardTitle>Credit Status Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <div className="font-semibold text-emerald-700 dark:text-emerald-400 mb-1">Excellent</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">No outstanding credit (0%)</div>
                </div>
                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <div className="font-semibold text-blue-700 dark:text-blue-400 mb-1">Good</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Credit usage &lt; 50%</div>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <div className="font-semibold text-amber-700 dark:text-amber-400 mb-1">Warning</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Credit usage 50-75%</div>
                </div>
                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <div className="font-semibold text-red-700 dark:text-red-400 mb-1">Critical</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Credit usage &gt; 75%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
