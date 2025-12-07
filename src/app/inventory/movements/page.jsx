'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import FilterBar from '@/components/shared/FilterBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/core/StatusBadge';
import { Plus, Download, TrendingUp, TrendingDown, ArrowRightLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const mockMovements = [
  { id: 'MOV-001', type: 'Adjustment', product: 'Product A', quantity: 50, warehouse: 'Main Warehouse', reason: 'Stock count adjustment', createdBy: 'John Kamau', date: '2025-12-06' },
  { id: 'MOV-002', type: 'Transfer', product: 'Product B', quantity: 30, warehouse: 'Main → Branch A', reason: 'Branch restock', createdBy: 'Mary Wanjiru', date: '2025-12-05' },
  { id: 'MOV-003', type: 'Write-Off', product: 'Product C', quantity: 10, warehouse: 'Main Warehouse', reason: 'Damaged goods', createdBy: 'James Ochieng', date: '2025-12-04' },
  { id: 'MOV-004', type: 'Adjustment', product: 'Product D', quantity: 100, warehouse: 'Branch A', reason: 'Initial stock', createdBy: 'Sarah Akinyi', date: '2025-12-03' },
  { id: 'MOV-005', type: 'Reservation', product: 'Product E', quantity: 25, warehouse: 'Main Warehouse', reason: 'Reserved for PO-005', createdBy: 'Peter Mwangi', date: '2025-12-02' }
];

export default function StockMovementsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredMovements = mockMovements.filter(mov => {
    const matchesSearch = mov.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mov.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || mov.type.toLowerCase() === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalMovements = mockMovements.length;
  const adjustments = mockMovements.filter(m => m.type === 'Adjustment').length;
  const transfers = mockMovements.filter(m => m.type === 'Transfer').length;
  const writeOffs = mockMovements.filter(m => m.type === 'Write-Off').length;

  const getTypeIcon = (type) => {
    const icons = {
      'Adjustment': TrendingUp,
      'Transfer': ArrowRightLeft,
      'Write-Off': TrendingDown,
      'Reservation': TrendingUp
    };
    return icons[type] || TrendingUp;
  };

  const getTypeColor = (type) => {
    const colors = {
      'Adjustment': 'text-blue-600',
      'Transfer': 'text-purple-600',
      'Write-Off': 'text-red-600',
      'Reservation': 'text-amber-600'
    };
    return colors[type] || 'text-gray-600';
  };

  const columns = [
    { 
      header: 'Movement ID', 
      accessor: 'id',
      render: (row) => (
        <span className="font-mono text-blue-600 dark:text-blue-400">{row.id}</span>
      )
    },
    { 
      header: 'Type', 
      accessor: 'type',
      render: (row) => {
        const Icon = getTypeIcon(row.type);
        return (
          <div className="flex items-center gap-2">
            <Icon className={`h-4 w-4 ${getTypeColor(row.type)}`} />
            <StatusBadge variant="info">{row.type}</StatusBadge>
          </div>
        );
      }
    },
    { 
      header: 'Product', 
      accessor: 'product',
      render: (row) => <span className="font-semibold text-gray-900 dark:text-white">{row.product}</span>
    },
    { 
      header: 'Quantity', 
      accessor: 'quantity',
      render: (row) => <span className="font-bold">{row.quantity}</span>
    },
    { header: 'Warehouse', accessor: 'warehouse' },
    { 
      header: 'Reason', 
      accessor: 'reason',
      render: (row) => <span className="text-sm text-gray-600 dark:text-gray-400">{row.reason}</span>
    },
    { header: 'Created By', accessor: 'createdBy' },
    { header: 'Date', accessor: 'date' }
  ];

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Stock Movements"
          subtitle="Track all inventory movements and adjustments"
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
              onClick={() => router.push('/inventory/movements/new')}
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Movement
            </Button>
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Total Movements', value: totalMovements, color: 'from-blue-500 to-cyan-500' },
            { label: 'Adjustments', value: adjustments, color: 'from-emerald-500 to-teal-500' },
            { label: 'Transfers', value: transfers, color: 'from-purple-500 to-pink-500' },
            { label: 'Write-Offs', value: writeOffs, color: 'from-red-500 to-rose-500' }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className={`rounded-3xl shadow-lg border-0 overflow-hidden bg-gradient-to-br ${stat.color} text-white p-6`}>
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
              searchPlaceholder="Search by ID or product..."
              filters={[
                {
                  label: 'Type',
                  value: typeFilter,
                  onChange: setTypeFilter,
                  options: [
                    { value: 'all', label: 'All Types' },
                    { value: 'adjustment', label: 'Adjustments' },
                    { value: 'transfer', label: 'Transfers' },
                    { value: 'write-off', label: 'Write-Offs' },
                    { value: 'reservation', label: 'Reservations' }
                  ]
                }
              ]}
            />
            <DataTable columns={columns} data={filteredMovements} />
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
