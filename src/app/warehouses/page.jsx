'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import FilterBar from '@/components/shared/FilterBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/core/StatusBadge';
import { Plus, Download, Warehouse, Package, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const mockWarehouses = [
  { id: 'WH-001', name: 'Main Warehouse', location: 'Nairobi, Industrial Area', capacity: 10000, occupied: 7500, status: 'Active', manager: 'John Kamau' },
  { id: 'WH-002', name: 'Branch A Warehouse', location: 'Mombasa, Port Area', capacity: 5000, occupied: 3200, status: 'Active', manager: 'Mary Wanjiru' },
  { id: 'WH-003', name: 'Distribution Center', location: 'Kisumu, City Center', capacity: 8000, occupied: 6000, status: 'Active', manager: 'James Ochieng' },
  { id: 'WH-004', name: 'Cold Storage', location: 'Nairobi, Westlands', capacity: 2000, occupied: 500, status: 'Active', manager: 'Sarah Akinyi' },
  { id: 'WH-005', name: 'Overflow Warehouse', location: 'Nakuru, Industrial Zone', capacity: 3000, occupied: 100, status: 'Inactive', manager: 'Peter Mwangi' }
];

export default function WarehousesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredWarehouses = mockWarehouses.filter(wh => {
    const matchesSearch = wh.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wh.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || wh.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalWarehouses = mockWarehouses.length;
  const activeWarehouses = mockWarehouses.filter(w => w.status === 'Active').length;
  const totalCapacity = mockWarehouses.reduce((sum, w) => sum + w.capacity, 0);
  const totalOccupied = mockWarehouses.reduce((sum, w) => sum + w.occupied, 0);

  const columns = [
    { 
      header: 'Warehouse ID', 
      accessor: 'id',
      render: (row) => (
        <span 
          className="font-mono text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
          onClick={() => router.push(`/warehouses/${row.id}`)}
        >
          {row.id}
        </span>
      )
    },
    { 
      header: 'Name', 
      accessor: 'name',
      render: (row) => <span className="font-semibold text-gray-900 dark:text-white">{row.name}</span>
    },
    { 
      header: 'Location', 
      accessor: 'location',
      render: (row) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{row.location}</span>
        </div>
      )
    },
    { 
      header: 'Capacity', 
      accessor: 'capacity',
      render: (row) => {
        const percentage = (row.occupied / row.capacity * 100).toFixed(0);
        return (
          <div>
            <div className="text-sm font-semibold">{row.occupied.toLocaleString()} / {row.capacity.toLocaleString()}</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className={`h-2 rounded-full ${percentage > 90 ? 'bg-red-500' : percentage > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      }
    },
    { header: 'Manager', accessor: 'manager' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => <StatusBadge variant={row.status === 'Active' ? 'success' : 'default'}>{row.status}</StatusBadge>
    },
    { 
      header: 'Actions', 
      accessor: 'actions',
      render: (row) => (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => router.push(`/warehouses/${row.id}`)}
        >
          <Package className="h-4 w-4" />
        </Button>
      )
    }
  ];

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Warehouses"
          subtitle="Manage warehouse locations and capacity"
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
              onClick={() => router.push('/warehouses/new')}
              className="rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Warehouse
            </Button>
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Total Warehouses', value: totalWarehouses, color: 'from-blue-500 to-cyan-500', icon: Warehouse },
            { label: 'Active', value: activeWarehouses, color: 'from-emerald-500 to-teal-500', icon: Warehouse },
            { label: 'Total Capacity', value: totalCapacity.toLocaleString(), color: 'from-purple-500 to-pink-500', icon: Package },
            { label: 'Occupied', value: totalOccupied.toLocaleString(), color: 'from-amber-500 to-orange-500', icon: Package }
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
              searchPlaceholder="Search by name or location..."
              filters={[
                {
                  label: 'Status',
                  value: statusFilter,
                  onChange: setStatusFilter,
                  options: [
                    { value: 'all', label: 'All Status' },
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' }
                  ]
                }
              ]}
            />
            <DataTable columns={columns} data={filteredWarehouses} />
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
