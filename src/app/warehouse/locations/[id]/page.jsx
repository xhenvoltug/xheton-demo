'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/shared/StatCard';
import DataTable from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Package, TrendingUp, BarChart3, AlertCircle, Edit, MapPin, Mail, Phone } from 'lucide-react';

const mockWarehouseDetails = {
  'WH-001': {
    id: 'WH-001',
    name: 'Main Warehouse',
    type: 'main',
    location: 'New York, NY',
    address: '456 Storage Avenue, New York, NY 10001',
    capacity: '10,000 sqft',
    utilization: 78,
    totalProducts: 456,
    totalValue: 567800.00,
    manager: 'John Smith',
    email: 'john.smith@xheton.com',
    phone: '+1 234 567 8900',
    status: 'active',
    topProducts: [
      { id: 'P001', name: 'Laptop Pro 15"', quantity: 45, value: 40499.55 },
      { id: 'P002', name: 'Monitor 27"', quantity: 30, value: 7499.70 },
      { id: 'P003', name: 'Wireless Mouse', quantity: 120, value: 1558.80 },
      { id: 'P004', name: 'Keyboard Mechanical', quantity: 67, value: 3080.33 },
    ],
    recentMovements: [
      { id: 'M001', date: '2025-12-06', type: 'in', product: 'Laptop Pro 15"', quantity: 10, from: 'Supplier', to: 'WH-001' },
      { id: 'M002', date: '2025-12-06', type: 'out', product: 'Wireless Mouse', quantity: 15, from: 'WH-001', to: 'WH-002' },
      { id: 'M003', date: '2025-12-05', type: 'in', product: 'Monitor 27"', quantity: 5, from: 'GRN-001', to: 'WH-001' },
    ],
  },
};

export default function WarehouseDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const warehouse = mockWarehouseDetails[id] || mockWarehouseDetails['WH-001'];

  const typeColors = {
    main: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    distribution: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    hub: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    branch: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  };

  const movementColors = {
    in: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    out: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  };

  const productColumns = [
    {
      header: 'Product',
      accessor: 'name',
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{row.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{row.id}</p>
        </div>
      ),
    },
    {
      header: 'Quantity',
      accessor: 'quantity',
      render: (row) => (
        <span className="font-semibold text-gray-900 dark:text-white">{row.quantity} units</span>
      ),
    },
    {
      header: 'Value',
      accessor: 'value',
      render: (row) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          ${row.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
  ];

  const movementColumns = [
    {
      header: 'Date',
      accessor: 'date',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-400">
          {new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      ),
    },
    {
      header: 'Type',
      accessor: 'type',
      render: (row) => (
        <Badge className={movementColors[row.type]}>
          {row.type === 'in' ? 'Inbound' : 'Outbound'}
        </Badge>
      ),
    },
    {
      header: 'Product',
      accessor: 'product',
      render: (row) => (
        <span className="font-medium text-gray-900 dark:text-white">{row.product}</span>
      ),
    },
    {
      header: 'Quantity',
      accessor: 'quantity',
      render: (row) => (
        <span className="text-gray-900 dark:text-white">{row.quantity} units</span>
      ),
    },
    {
      header: 'Movement',
      accessor: 'movement',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {row.from} → {row.to}
        </span>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title={warehouse.name}
          subtitle={`${warehouse.type.charAt(0).toUpperCase() + warehouse.type.slice(1)} Warehouse • ${warehouse.location}`}
          actions={[
            <Button
              key="edit"
              variant="outline"
              onClick={() => router.push(`/warehouse/locations/${warehouse.id}/edit`)}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>,
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            icon={Package}
            label="Total Products"
            value={warehouse.totalProducts}
            trend={{ value: 8.5, isPositive: true }}
            iconColor="purple"
          />
          <StatCard
            icon={TrendingUp}
            label="Total Value"
            value={`$${warehouse.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            trend={{ value: 12.3, isPositive: true }}
            iconColor="emerald"
          />
          <StatCard
            icon={BarChart3}
            label="Utilization"
            value={`${warehouse.utilization}%`}
            iconColor={warehouse.utilization > 80 ? 'red' : warehouse.utilization > 60 ? 'yellow' : 'blue'}
          />
          <StatCard
            icon={AlertCircle}
            label="Type"
            value={<Badge className={typeColors[warehouse.type]}>{warehouse.type}</Badge>}
            iconColor="cyan"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white dark:bg-gray-900/50">
              <Tabs defaultValue="products" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="products">Stock by Product</TabsTrigger>
                  <TabsTrigger value="movements">Recent Movements</TabsTrigger>
                </TabsList>

                <TabsContent value="products" className="mt-6">
                  <DataTable columns={productColumns} data={warehouse.topProducts} variant="compact" />
                </TabsContent>

                <TabsContent value="movements" className="mt-6">
                  <DataTable columns={movementColumns} data={warehouse.recentMovements} variant="compact" />
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 bg-white dark:bg-gray-900/50">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Location Details</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                    <p className="text-gray-900 dark:text-white">{warehouse.address}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Capacity</p>
                  <p className="text-gray-900 dark:text-white font-medium">{warehouse.capacity}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                  <Badge className={typeColors[warehouse.type] + ' mt-1'}>
                    {warehouse.type}
                  </Badge>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white dark:bg-gray-900/50">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Manager Contact</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manager</p>
                  <p className="text-gray-900 dark:text-white font-medium">{warehouse.manager}</p>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <a href={`mailto:${warehouse.email}`} className="text-gray-900 dark:text-white hover:text-purple-600">
                      {warehouse.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    <a href={`tel:${warehouse.phone}`} className="text-gray-900 dark:text-white hover:text-purple-600">
                      {warehouse.phone}
                    </a>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white dark:bg-gray-900/50">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Package className="h-4 w-4" />
                  View All Stock
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Stock Movement Report
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Utilization Report
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
