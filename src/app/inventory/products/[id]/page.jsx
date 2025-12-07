'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/shared/StatCard';
import DataTable from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Package, DollarSign, TrendingUp, Warehouse } from 'lucide-react';

const mockProduct = {
  id: 'P001',
  image: '💻',
  sku: 'LP-PRO-15',
  name: 'Laptop Pro 15"',
  category: 'Electronics',
  description: 'High-performance laptop with 15-inch display, perfect for professionals.',
  cost: 899.99,
  price: 1299.99,
  stock: 45,
  minStock: 10,
  unit: 'piece',
  barcode: '1234567890123',
  weight: 2.5,
  dimensions: '35 × 24 × 2 cm',
};

const stockByWarehouse = [
  { warehouse: 'Main Warehouse', location: 'A-12-05', quantity: 30 },
  { warehouse: 'North Branch', location: 'B-08-12', quantity: 10 },
  { warehouse: 'South Branch', location: 'C-15-03', quantity: 5 },
];

const salesHistory = [
  { id: 'INV-001', date: '2025-12-06', customer: 'Acme Corp', quantity: 3, total: 3899.97 },
  { id: 'INV-015', date: '2025-11-22', customer: 'TechStart Inc', quantity: 2, total: 2599.98 },
  { id: 'INV-032', date: '2025-10-18', customer: 'Global Traders', quantity: 5, total: 6499.95 },
];

const purchaseHistory = [
  { id: 'PO-045', date: '2025-11-30', supplier: 'Tech Supplies Co', quantity: 20, cost: 17999.80 },
  { id: 'PO-032', date: '2025-10-15', supplier: 'Global Electronics', quantity: 30, cost: 26999.70 },
];

export default function ProductDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();

  const profitMargin = ((mockProduct.price - mockProduct.cost) / mockProduct.price * 100).toFixed(1);
  const totalValue = mockProduct.stock * mockProduct.cost;

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title={mockProduct.name}
          subtitle={`SKU: ${mockProduct.sku} • Category: ${mockProduct.category}`}
          actions={[
            <Button
              key="edit"
              variant="outline"
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Product
            </Button>,
          ]}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Current Stock"
            value={mockProduct.stock}
            icon={Package}
          />
          <StatCard
            title="Stock Value"
            value={`$UGX {totalValue.toLocaleString()}`}
            icon={DollarSign}
          />
          <StatCard
            title="Selling Price"
            value={`$UGX {mockProduct.price}`}
            icon={TrendingUp}
          />
          <StatCard
            title="Profit Margin"
            value={`${profitMargin}%`}
            change={{ value: 2.5, isPositive: true }}
            icon={TrendingUp}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Details */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="text-center mb-6">
                <div className="text-8xl mb-4">{mockProduct.image}</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {mockProduct.name}
                </h3>
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  In Stock
                </Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                  <p className="text-gray-900 dark:text-white mt-1">{mockProduct.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Cost Price</p>
                    <p className="font-semibold text-gray-900 dark:text-white">UGX {mockProduct.cost}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Selling Price</p>
                    <p className="font-semibold text-emerald-600 dark:text-emerald-400">UGX {mockProduct.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Unit</p>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">{mockProduct.unit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Min Stock</p>
                    <p className="font-medium text-gray-900 dark:text-white">{mockProduct.minStock}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Weight</p>
                    <p className="font-medium text-gray-900 dark:text-white">{mockProduct.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Barcode</p>
                    <p className="font-medium text-gray-900 dark:text-white text-xs">{mockProduct.barcode}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Dimensions</p>
                  <p className="font-medium text-gray-900 dark:text-white">{mockProduct.dimensions}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* History & Warehouse */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 shadow-sm">
              <Tabs defaultValue="warehouse" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="warehouse">Stock by Warehouse</TabsTrigger>
                  <TabsTrigger value="sales">Sales History</TabsTrigger>
                  <TabsTrigger value="purchases">Purchase History</TabsTrigger>
                </TabsList>

                <TabsContent value="warehouse">
                  <DataTable
                    columns={[
                      {
                        header: 'Warehouse',
                        accessor: 'warehouse',
                        render: (row) => (
                          <div className="flex items-center gap-2">
                            <Warehouse className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="font-semibold text-gray-900 dark:text-white">{row.warehouse}</span>
                          </div>
                        ),
                      },
                      {
                        header: 'Location',
                        accessor: 'location',
                        render: (row) => <span className="text-gray-600 dark:text-gray-400">{row.location}</span>,
                      },
                      {
                        header: 'Quantity',
                        accessor: 'quantity',
                        render: (row) => (
                          <span className="font-semibold text-gray-900 dark:text-white">{row.quantity} units</span>
                        ),
                      },
                    ]}
                    data={stockByWarehouse}
                    variant="compact"
                  />
                </TabsContent>

                <TabsContent value="sales">
                  <DataTable
                    columns={[
                      {
                        header: 'Invoice',
                        accessor: 'id',
                        render: (row) => <span className="font-semibold text-gray-900 dark:text-white">{row.id}</span>,
                      },
                      {
                        header: 'Date',
                        accessor: 'date',
                        render: (row) => (
                          <span className="text-gray-600 dark:text-gray-400">
                            {new Date(row.date).toLocaleDateString()}
                          </span>
                        ),
                      },
                      {
                        header: 'Customer',
                        accessor: 'customer',
                        render: (row) => <span className="text-gray-700 dark:text-gray-300">{row.customer}</span>,
                      },
                      {
                        header: 'Quantity',
                        accessor: 'quantity',
                        render: (row) => <span className="text-gray-900 dark:text-white">{row.quantity}</span>,
                      },
                      {
                        header: 'Total',
                        accessor: 'total',
                        render: (row) => (
                          <span className="font-semibold text-gray-900 dark:text-white">UGX {row.total.toFixed(2)}</span>
                        ),
                      },
                    ]}
                    data={salesHistory}
                    variant="compact"
                  />
                </TabsContent>

                <TabsContent value="purchases">
                  <DataTable
                    columns={[
                      {
                        header: 'PO Number',
                        accessor: 'id',
                        render: (row) => <span className="font-semibold text-gray-900 dark:text-white">{row.id}</span>,
                      },
                      {
                        header: 'Date',
                        accessor: 'date',
                        render: (row) => (
                          <span className="text-gray-600 dark:text-gray-400">
                            {new Date(row.date).toLocaleDateString()}
                          </span>
                        ),
                      },
                      {
                        header: 'Supplier',
                        accessor: 'supplier',
                        render: (row) => <span className="text-gray-700 dark:text-gray-300">{row.supplier}</span>,
                      },
                      {
                        header: 'Quantity',
                        accessor: 'quantity',
                        render: (row) => <span className="text-gray-900 dark:text-white">{row.quantity}</span>,
                      },
                      {
                        header: 'Cost',
                        accessor: 'cost',
                        render: (row) => (
                          <span className="font-semibold text-gray-900 dark:text-white">UGX {row.cost.toLocaleString()}</span>
                        ),
                      },
                    ]}
                    data={purchaseHistory}
                    variant="compact"
                  />
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
